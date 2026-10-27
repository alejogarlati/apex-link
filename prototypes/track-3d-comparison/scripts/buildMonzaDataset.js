const fs = require('fs');
const path = require('path');

const trackDir = path.join(__dirname, '../tracks/monza_f1_2024');
const aiFile = path.join(trackDir, 'ai/fast_lane.ai');
const mapIniFile = path.join(trackDir, 'data/map.ini');
const sectionsIniFile = path.join(trackDir, 'data/sections.ini');
const drsIniFile = path.join(trackDir, 'data/drs_zones.ini');

// 1. Read binary fast_lane.ai
const aiBuf = fs.readFileSync(aiFile);
const pointCount = aiBuf.readInt32LE(4);

const rawPoints = [];
for (let i = 0; i < pointCount; i++) {
  const offset = 16 + i * 20;
  rawPoints.push({
    x: aiBuf.readFloatLE(offset),
    y: aiBuf.readFloatLE(offset + 4),
    z: aiBuf.readFloatLE(offset + 8),
    dist: aiBuf.readFloatLE(offset + 12)
  });
}

// Subsample if needed or keep high density (e.g. 1 in every 2 points = 1875 points for silky 60fps)
const step = 2;
const sampled = [];
for (let i = 0; i < rawPoints.length; i += step) {
  sampled.push(rawPoints[i]);
}

const totalDist = rawPoints[rawPoints.length - 1].dist;

// 2. Parse map.ini
const mapIniRaw = fs.readFileSync(mapIniFile, 'utf8');
function parseIni(content) {
  const result = {};
  let currentSection = 'default';
  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith(';') || line.startsWith('#')) return;
    if (line.startsWith('[') && line.endsWith(']')) {
      currentSection = line.slice(1, -1);
      result[currentSection] = {};
    } else if (line.includes('=')) {
      const [k, v] = line.split('=').map(s => s.trim());
      if (!result[currentSection]) result[currentSection] = {};
      result[currentSection][k] = isNaN(Number(v)) ? v : Number(v);
    }
  });
  return result;
}

const mapConfig = parseIni(mapIniRaw).PARAMETERS || {
  WIDTH: 927.422,
  HEIGHT: 1575.82,
  MARGIN: 20,
  SCALE_FACTOR: 1.4,
  X_OFFSET: 232.866,
  Z_OFFSET: 1297.7
};

// 3. Parse sections.ini
const sectionsRaw = fs.readFileSync(sectionsIniFile, 'utf8');
const parsedSections = parseIni(sectionsRaw);
const sections = Object.values(parsedSections).map(s => ({
  in: parseFloat(s.IN),
  out: parseFloat(s.OUT),
  name: s.TEXT || 'Pista'
}));

// 4. Parse drs_zones.ini
const drsRaw = fs.readFileSync(drsIniFile, 'utf8');
const parsedDrs = parseIni(drsRaw);
const drsZones = Object.values(parsedDrs).map(z => ({
  detection: parseFloat(z.DETECTION),
  start: parseFloat(z.START),
  end: parseFloat(z.END)
}));

// Helper to find corner name by normalized lap progress t (0.0 to 1.0)
function getSectionName(t) {
  for (const s of sections) {
    if (s.in > s.out) {
      // Wraps around start/finish (e.g. 0.970 to 0.123)
      if (t >= s.in || t <= s.out) return s.name;
    } else {
      if (t >= s.in && t <= s.out) return s.name;
    }
  }
  return 'Rettifilo / Enlace';
}

function isDrsActive(t) {
  for (const z of drsZones) {
    if (z.start > z.end) {
      if (t >= z.start || t <= z.end) return true;
    } else {
      if (t >= z.start && t <= z.end) return true;
    }
  }
  return false;
}

// 5. Calculate Realistic F1 Telemetry Physics along Monza
const numPoints = sampled.length;
const speeds = new Float32Array(numPoints);

// First pass: Curvature & lateral G cornering limits
for (let i = 0; i < numPoints; i++) {
  const prev = sampled[(i - 1 + numPoints) % numPoints];
  const curr = sampled[i];
  const next = sampled[(i + 1) % numPoints];

  const dx1 = curr.x - prev.x;
  const dz1 = curr.z - prev.z;
  const dx2 = next.x - curr.x;
  const dz2 = next.z - curr.z;

  const angle1 = Math.atan2(dx1, dz1);
  const angle2 = Math.atan2(dx2, dz2);
  let dAngle = Math.abs(angle2 - angle1);
  if (dAngle > Math.PI) dAngle = 2 * Math.PI - dAngle;

  const segLen = Math.sqrt(dx2 * dx2 + dz2 * dz2) || 1.5;
  const curvature = dAngle / segLen; // radians per meter

  // Max cornering speed (F1 car ~3.8G lateral)
  const maxLatAcc = 36.0; // m/s^2 (~3.7G)
  const maxV = curvature > 0.0001 ? Math.sqrt(maxLatAcc / curvature) : 96.0; // m/s (96 m/s = 345 km/h)

  // Cap between 72 km/h (Prima Variante chicane apex) and 350 km/h (Rettifilo end)
  speeds[i] = Math.max(20.0, Math.min(97.2, maxV)); // in m/s
}

// Backward pass: Braking limits (F1 car ~4.8G braking = 47 m/s^2)
const maxBrakingDecel = 46.0;
for (let pass = 0; pass < 2; pass++) {
  for (let i = numPoints - 1; i >= 0; i--) {
    const nextIdx = (i + 1) % numPoints;
    const dx = sampled[nextIdx].x - sampled[i].x;
    const dz = sampled[nextIdx].z - sampled[i].z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    const maxAllowableSpeed = Math.sqrt(speeds[nextIdx] * speeds[nextIdx] + 2 * maxBrakingDecel * dist);
    if (speeds[i] > maxAllowableSpeed) {
      speeds[i] = maxAllowableSpeed;
    }
  }
}

// Forward pass: Acceleration limits (F1 engine power curve)
for (let pass = 0; pass < 2; pass++) {
  for (let i = 0; i < numPoints; i++) {
    const prevIdx = (i - 1 + numPoints) % numPoints;
    const dx = sampled[i].x - sampled[prevIdx].x;
    const dz = sampled[i].z - sampled[prevIdx].z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    const v = speeds[prevIdx];
    // Acceleration decreases with aerodynamic drag as speed increases
    const maxAccel = Math.max(3.5, 14.0 - (v / 90.0) * 10.0);
    const maxAchievableSpeed = Math.sqrt(v * v + 2 * maxAccel * dist);
    if (speeds[i] > maxAchievableSpeed) {
      speeds[i] = maxAchievableSpeed;
    }
  }
}

// 6. Build Final Monza Track Array
const finalTrack = [];
for (let i = 0; i < numPoints; i++) {
  const p = sampled[i];
  const next = sampled[(i + 1) % numPoints];
  const t = p.dist / totalDist;

  const speedKmh = Math.round(speeds[i] * 3.6);
  const nextSpeedKmh = Math.round(speeds[(i + 1) % numPoints] * 3.6);
  const accel = nextSpeedKmh - speedKmh;

  let throttle = 0;
  let brake = 0;

  if (accel > 0.1) {
    throttle = Math.min(1.0, 0.4 + accel * 0.18);
    brake = 0;
  } else if (accel < -0.1) {
    brake = Math.min(1.0, Math.abs(accel) * 0.25);
    throttle = 0;
  } else {
    throttle = 0.3;
    brake = 0;
  }

  // F1 8-Speed Seamless Gearbox
  let gear = 1;
  if (speedKmh > 310) gear = 8;
  else if (speedKmh > 275) gear = 7;
  else if (speedKmh > 235) gear = 6;
  else if (speedKmh > 195) gear = 5;
  else if (speedKmh > 155) gear = 4;
  else if (speedKmh > 115) gear = 3;
  else gear = 2;

  const rpmPerGear = {
    2: speedKmh * 88,
    3: speedKmh * 72,
    4: speedKmh * 60,
    5: speedKmh * 50,
    6: speedKmh * 42,
    7: speedKmh * 36,
    8: speedKmh * 32
  };
  const rpm = Math.min(12400, Math.max(5000, Math.round(rpmPerGear[gear] || 8000)));

  const dx = next.x - p.x;
  const dy = next.y - p.y;
  const dz = next.z - p.z;
  const segDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const slope = segDist > 0 ? (dy / segDist) * 100 : 0;
  const yaw = Math.atan2(dx, dz);

  finalTrack.push({
    index: i,
    t: parseFloat(t.toFixed(4)),
    x: parseFloat(p.x.toFixed(3)),
    y: parseFloat(p.y.toFixed(3)),
    z: parseFloat(p.z.toFixed(3)),
    dist: Math.round(p.dist),
    yaw: parseFloat(yaw.toFixed(3)),
    speed: speedKmh,
    gear,
    rpm,
    throttle: parseFloat(throttle.toFixed(2)),
    brake: parseFloat(brake.toFixed(2)),
    slope: parseFloat(slope.toFixed(2)),
    section: getSectionName(t),
    drs: isDrsActive(t)
  });
}

// Bounding box
let minX = Infinity, maxX = -Infinity;
let minY = Infinity, maxY = -Infinity;
let minZ = Infinity, maxZ = -Infinity;

finalTrack.forEach(p => {
  if (p.x < minX) minX = p.x;
  if (p.x > maxX) maxX = p.x;
  if (p.y < minY) minY = p.y;
  if (p.y > maxY) maxY = p.y;
  if (p.z < minZ) minZ = p.z;
  if (p.z > maxZ) maxZ = p.z;
});

const center = {
  x: (minX + maxX) / 2,
  y: (minY + maxY) / 2,
  z: (minZ + maxZ) / 2
};

const bounds = {
  minX, maxX, minY, maxY, minZ, maxZ,
  width: maxX - minX,
  height: maxY - minY,
  depth: maxZ - minZ,
  totalDistance: Math.round(totalDist)
};

const output = `/**
 * Autodromo Nazionale Monza (F1 2024 Layout)
 * Extracted directly from Assetto Corsa fast_lane.ai, map.ini, sections.ini, and drs_zones.ini
 */

export const MONZA_MAP_CONFIG = ${JSON.stringify(mapConfig, null, 2)};

export const MONZA_SECTIONS = ${JSON.stringify(sections, null, 2)};

export const MONZA_DRS_ZONES = ${JSON.stringify(drsZones, null, 2)};

export const MONZA_TRACK_DATA = {
  name: "Autodromo Nazionale Monza",
  layout: "Grand Prix (F1 2024)",
  lengthMeters: ${Math.round(totalDist)},
  bounds: ${JSON.stringify(bounds, null, 2)},
  center: ${JSON.stringify(center, null, 2)},
  track: ${JSON.stringify(finalTrack)}
};
`;

const outputPath = path.join(__dirname, '../src/monzaRealData.js');
fs.writeFileSync(outputPath, output, 'utf8');
console.log('Successfully generated monzaRealData.js! Total points:', finalTrack.length);
