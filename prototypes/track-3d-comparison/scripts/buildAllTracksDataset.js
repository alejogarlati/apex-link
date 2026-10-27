const fs = require('fs');
const path = require('path');

const tracksBase = path.join(__dirname, '../tracks');

// Helper to parse ini files
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

function processCircuit({
  id,
  displayName,
  mapPngSource,
  mapPngTarget,
  aiPath,
  mapIniPath,
  sectionsIniPath,
  drsIniPath,
  customSections,
  step = 2
}) {
  console.log(`\n--- Processing ${displayName} ---`);

  // 1. Copy map.png
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.copyFileSync(mapPngSource, path.join(publicDir, mapPngTarget));
  console.log(`Copied ${mapPngSource} -> public/${mapPngTarget}`);

  // 2. Read map.ini
  const mapIniRaw = fs.readFileSync(mapIniPath, 'utf8');
  const mapConfig = parseIni(mapIniRaw).PARAMETERS;

  // 3. Read sections.ini or custom sections
  let sections = [];
  if (sectionsIniPath && fs.existsSync(sectionsIniPath)) {
    const sRaw = fs.readFileSync(sectionsIniPath, 'utf8');
    const parsedS = parseIni(sRaw);
    sections = Object.values(parsedS).map(s => ({
      in: parseFloat(s.IN),
      out: parseFloat(s.OUT),
      name: s.TEXT || 'Curva'
    }));
  } else if (customSections) {
    sections = customSections;
  }

  // 4. Read DRS zones
  let drsZones = [];
  if (drsIniPath && fs.existsSync(drsIniPath)) {
    const dRaw = fs.readFileSync(drsIniPath, 'utf8');
    const parsedD = parseIni(dRaw);
    drsZones = Object.values(parsedD).map(z => ({
      detection: parseFloat(z.DETECTION),
      start: parseFloat(z.START),
      end: parseFloat(z.END)
    }));
  }

  // 5. Read fast_lane.ai binary
  const aiBuf = fs.readFileSync(aiPath);
  const totalPointsCount = aiBuf.readInt32LE(4);
  const rawPoints = [];
  for (let i = 0; i < totalPointsCount; i++) {
    const offset = 16 + i * 20;
    rawPoints.push({
      x: aiBuf.readFloatLE(offset),
      y: aiBuf.readFloatLE(offset + 4),
      z: aiBuf.readFloatLE(offset + 8),
      dist: aiBuf.readFloatLE(offset + 12)
    });
  }

  const sampled = [];
  for (let i = 0; i < rawPoints.length; i += step) {
    sampled.push(rawPoints[i]);
  }
  const totalDist = rawPoints[rawPoints.length - 1].dist;

  // 6. Curvature and F1 physical telemetry calculation
  const numPoints = sampled.length;
  const speeds = new Float32Array(numPoints);

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
    const curvature = dAngle / segLen;

    const maxLatAcc = 36.0; // ~3.7G
    const maxV = curvature > 0.0001 ? Math.sqrt(maxLatAcc / curvature) : 96.0;
    speeds[i] = Math.max(20.0, Math.min(97.2, maxV)); // 72 to 350 km/h
  }

  // Braking pass
  const maxBrakingDecel = 46.0; // 4.7G
  for (let pass = 0; pass < 2; pass++) {
    for (let i = numPoints - 1; i >= 0; i--) {
      const nextIdx = (i + 1) % numPoints;
      const dx = sampled[nextIdx].x - sampled[i].x;
      const dz = sampled[nextIdx].z - sampled[i].z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const maxAllowable = Math.sqrt(speeds[nextIdx] * speeds[nextIdx] + 2 * maxBrakingDecel * dist);
      if (speeds[i] > maxAllowable) speeds[i] = maxAllowable;
    }
  }

  // Accel pass
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < numPoints; i++) {
      const prevIdx = (i - 1 + numPoints) % numPoints;
      const dx = sampled[i].x - sampled[prevIdx].x;
      const dz = sampled[i].z - sampled[prevIdx].z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const v = speeds[prevIdx];
      const maxAccel = Math.max(3.5, 14.0 - (v / 90.0) * 10.0);
      const maxAchievable = Math.sqrt(v * v + 2 * maxAccel * dist);
      if (speeds[i] > maxAchievable) speeds[i] = maxAchievable;
    }
  }

  function getSectionName(t) {
    for (const s of sections) {
      if (s.in > s.out) {
        if (t >= s.in || t <= s.out) return s.name;
      } else {
        if (t >= s.in && t <= s.out) return s.name;
      }
    }
    return 'Recta Principal / Enlace';
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

  const finalTrack = [];
  for (let i = 0; i < numPoints; i++) {
    const p = sampled[i];
    const next = sampled[(i + 1) % numPoints];
    const t = p.dist / totalDist;
    const speedKmh = Math.round(speeds[i] * 3.6);
    const nextSpeedKmh = Math.round(speeds[(i + 1) % numPoints] * 3.6);
    const accel = nextSpeedKmh - speedKmh;

    let throttle = 0, brake = 0;
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

    let gear = 1;
    if (speedKmh > 310) gear = 8;
    else if (speedKmh > 275) gear = 7;
    else if (speedKmh > 235) gear = 6;
    else if (speedKmh > 195) gear = 5;
    else if (speedKmh > 155) gear = 4;
    else if (speedKmh > 115) gear = 3;
    else gear = 2;

    const rpmPerGear = { 2: 88, 3: 72, 4: 60, 5: 50, 6: 42, 7: 36, 8: 32 };
    const rpm = Math.min(12400, Math.max(5000, Math.round(speedKmh * (rpmPerGear[gear] || 40))));

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

  console.log(`Processed ${displayName}: ${finalTrack.length} points, length: ${Math.round(totalDist)}m`);

  return {
    id,
    displayName,
    mapImageUrl: `/${mapPngTarget}`,
    mapConfig,
    sections,
    drsZones,
    lengthMeters: Math.round(totalDist),
    bounds,
    center,
    track: finalTrack
  };
}

// 1. Imola F1 2025
const imolaCustomSections = [
  { in: 0.940, out: 0.055, name: "Rettilineo Partenza / Traguardo" },
  { in: 0.075, out: 0.155, name: "Variante Tamburello (T2-T4)" },
  { in: 0.190, out: 0.255, name: "Variante Villeneuve (T5-T6)" },
  { in: 0.285, out: 0.355, name: "Curva Tosa (T7)" },
  { in: 0.420, out: 0.485, name: "Curva Piratella (T9)" },
  { in: 0.540, out: 0.635, name: "Acque Minerali (T11-T13)" },
  { in: 0.705, out: 0.770, name: "Variante Alta / Gresini (T14-T15)" },
  { in: 0.835, out: 0.910, name: "Curva Rivazza 1 & 2 (T17-T18)" }
];

const imola = processCircuit({
  id: 'imola',
  displayName: 'Autodromo Enzo e Dino Ferrari (Imola F1 2025)',
  mapPngSource: path.join(tracksBase, 'fn_imola/imola_f1_2025/map.png'),
  mapPngTarget: 'imola_map.png',
  aiPath: path.join(tracksBase, 'fn_imola/imola_f1_2025/ai/fast_lane.ai'),
  mapIniPath: path.join(tracksBase, 'fn_imola/imola_f1_2025/data/map.ini'),
  drsIniPath: path.join(tracksBase, 'fn_imola/data/drs_zones.ini'),
  customSections: imolaCustomSections,
  step: 2
});

// 2. Red Bull Ring (layout_gp)
const rbr = processCircuit({
  id: 'rbr',
  displayName: 'Red Bull Ring (Layout GP)',
  mapPngSource: path.join(tracksBase, 'ks_red_bull_ring/layout_gp/map.png'),
  mapPngTarget: 'rbr_map.png',
  aiPath: path.join(tracksBase, 'ks_red_bull_ring/layout_gp/ai/fast_lane.ai'),
  mapIniPath: path.join(tracksBase, 'ks_red_bull_ring/layout_gp/data/map.ini'),
  sectionsIniPath: path.join(tracksBase, 'ks_red_bull_ring/layout_gp/data/sections.ini'),
  drsIniPath: path.join(tracksBase, 'ks_red_bull_ring/layout_gp/data/drs_zones.ini'),
  step: 2
});

// 3. Monza F1 2025
const monza = processCircuit({
  id: 'monza',
  displayName: 'Autodromo Nazionale Monza (F1 2025)',
  mapPngSource: path.join(tracksBase, 'monza/monza_f1_2025/map.png'),
  mapPngTarget: 'monza_map.png',
  aiPath: path.join(tracksBase, 'monza/monza_f1_2025/ai/fast_lane.ai'),
  mapIniPath: path.join(tracksBase, 'monza/monza_f1_2025/data/map.ini'),
  sectionsIniPath: path.join(tracksBase, 'monza/monza_f1_2025/data/sections.ini'),
  drsIniPath: path.join(tracksBase, 'monza/monza_f1_2025/data/drs_zones.ini'),
  step: 2
});

const output = `/**
 * Official Assetto Corsa Circuits Dataset
 * Generated from official binary fast_lane.ai, map.png, map.ini, sections.ini, and drs_zones.ini
 * Tracks: Imola F1 2025, Red Bull Ring GP, Monza F1 2025
 */

export const CIRCUITS_DATA = {
  imola: ${JSON.stringify(imola)},
  rbr: ${JSON.stringify(rbr)},
  monza: ${JSON.stringify(monza)}
};
`;

const outputPath = path.join(__dirname, '../src/circuitsData.js');
fs.writeFileSync(outputPath, output, 'utf8');
console.log('\nSuccessfully generated src/circuitsData.js with all 3 circuits!');
