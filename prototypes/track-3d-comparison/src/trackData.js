/**
 * Realistic 3D Circuit Generator with Elevation and Telemetry Physics
 * Generates ~1200 continuous points representing an FIA Grade 1 style circuit
 * with marked elevation changes (Eau Rouge climb, Corkscrew descent, banked curves).
 */

// Catmull-Rom spline interpolation helper
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;

  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

// 3D Control points (X: East-West in meters, Y: Elevation in meters, Z: North-South in meters)
const CIRCUIT_KEYPOINTS = [
  // Sector 1: Main Straight & Turn 1 Hairpin
  { x: 0,    y: 10,  z: 0,    targetSpeed: 275 }, // Start/Finish line
  { x: 0,    y: 12,  z: 350,  targetSpeed: 290 }, // End of straight (braking point)
  { x: 30,   y: 10,  z: 460,  targetSpeed: 140 }, // Braking entry
  { x: 110,  y: 6,   z: 510,  targetSpeed: 75  }, // T1 Apex (tight downhill hairpin)
  { x: 180,  y: 5,   z: 480,  targetSpeed: 120 }, // T1 Exit acceleration

  // Sector 1 continued: The Steep Eau Rouge / Raidillon Climb
  { x: 260,  y: 12,  z: 410,  targetSpeed: 210 }, // Uphill compression
  { x: 320,  y: 35,  z: 340,  targetSpeed: 245 }, // Rapid climb (+23m)
  { x: 370,  y: 58,  z: 240,  targetSpeed: 265 }, // Blind crest climb (+23m)
  { x: 390,  y: 68,  z: 110,  targetSpeed: 280 }, // Summit crest (+10m, peak altitude 68m)

  // Sector 2: Highland Sweepers & High Speed Flow
  { x: 420,  y: 66,  z: -80,  targetSpeed: 285 }, // Highland straight
  { x: 480,  y: 62,  z: -260, targetSpeed: 240 }, // High speed right-hander entry
  { x: 550,  y: 58,  z: -390, targetSpeed: 185 }, // Apex
  { x: 580,  y: 54,  z: -520, targetSpeed: 215 }, // Exit

  // Sector 2 continued: The Downhill Corkscrew Drop
  { x: 540,  y: 52,  z: -640, targetSpeed: 190 }, // Corkscrew approach
  { x: 460,  y: 44,  z: -720, targetSpeed: 130 }, // Hard braking crest
  { x: 380,  y: 30,  z: -760, targetSpeed: 82  }, // Blind left drop apex (-14m drop)
  { x: 320,  y: 18,  z: -740, targetSpeed: 95  }, // Snapping right downhill (-12m drop)
  { x: 250,  y: 10,  z: -690, targetSpeed: 155 }, // Corkscrew compression rollout

  // Sector 3: Technical Infield & Stadium Section
  { x: 160,  y: 8,   z: -610, targetSpeed: 195 }, // Fast downhill run
  { x: 90,   y: 8,   z: -510, targetSpeed: 135 }, // Medium right entry
  { x: 40,   y: 9,   z: -420, targetSpeed: 110 }, // Apex
  { x: 10,   y: 10,  z: -320, targetSpeed: 160 }, // Exit
  { x: -50,  y: 11,  z: -220, targetSpeed: 130 }, // Left kink
  { x: -110, y: 11,  z: -140, targetSpeed: 98  }, // Final chicane entry
  { x: -130, y: 10,  z: -60,  targetSpeed: 88  }, // Final chicane apex
  { x: -90,  y: 10,  z: -10,  targetSpeed: 145 }, // Final corner exit into pit straight
];

export function generateTrackTelemetry(totalPoints = 1200) {
  const numKeypoints = CIRCUIT_KEYPOINTS.length;
  const rawSpline = [];

  // Generate smooth spline points
  for (let i = 0; i < numKeypoints; i++) {
    const p0 = CIRCUIT_KEYPOINTS[(i - 1 + numKeypoints) % numKeypoints];
    const p1 = CIRCUIT_KEYPOINTS[i];
    const p2 = CIRCUIT_KEYPOINTS[(i + 1) % numKeypoints];
    const p3 = CIRCUIT_KEYPOINTS[(i + 2) % numKeypoints];

    const stepsPerSegment = Math.floor(totalPoints / numKeypoints);

    for (let step = 0; step < stepsPerSegment; step++) {
      const t = step / stepsPerSegment;
      const x = catmullRom(p0.x, p1.x, p2.x, p3.x, t);
      const y = catmullRom(p0.y, p1.y, p2.y, p3.y, t);
      const z = catmullRom(p0.z, p1.z, p2.z, p3.z, t);
      const targetSpeed = catmullRom(p0.targetSpeed, p1.targetSpeed, p2.targetSpeed, p3.targetSpeed, t);

      rawSpline.push({ x, y, z, targetSpeed });
    }
  }

  // Calculate cumulative distances, speeds, throttle, brake, gears and rpm
  const track = [];
  let totalDistance = 0;

  for (let i = 0; i < rawSpline.length; i++) {
    const next = rawSpline[(i + 1) % rawSpline.length];
    const dx = next.x - rawSpline[i].x;
    const dy = next.y - rawSpline[i].y;
    const dz = next.z - rawSpline[i].z;
    const segmentDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    totalDistance += segmentDist;
  }

  let accumulatedDist = 0;
  for (let i = 0; i < rawSpline.length; i++) {
    const curr = rawSpline[i];
    const next = rawSpline[(i + 1) % rawSpline.length];
    const prev = rawSpline[(i - 1 + rawSpline.length) % rawSpline.length];

    const dx = next.x - curr.x;
    const dy = next.y - curr.y;
    const dz = next.z - curr.z;
    const segmentDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    accumulatedDist += segmentDist;

    // Heading angle in horizontal plane (radians & degrees)
    const yaw = Math.atan2(dx, dz);

    // Speed smoothing and telemetry synthetic calculation
    const speed = Math.max(65, Math.min(295, curr.targetSpeed));
    const speedNext = next.targetSpeed;
    const accel = speedNext - speed;

    let throttle = 0;
    let brake = 0;

    if (accel > 0.05) {
      throttle = Math.min(1.0, 0.4 + accel * 0.15);
      brake = 0;
    } else if (accel < -0.05) {
      brake = Math.min(1.0, Math.abs(accel) * 0.22);
      throttle = 0;
    } else {
      throttle = 0.25;
      brake = 0;
    }

    // Realistic Gear selection
    let gear = 1;
    if (speed > 240) gear = 6;
    else if (speed > 190) gear = 5;
    else if (speed > 145) gear = 4;
    else if (speed > 105) gear = 3;
    else gear = 2;

    // RPM based on gear & speed
    const rpmPerGear = {
      2: speed * 68,
      3: speed * 52,
      4: speed * 42,
      5: speed * 34,
      6: speed * 29
    };
    const rpm = Math.min(8800, Math.max(3200, Math.round(rpmPerGear[gear] || 6000)));

    // Elevation gradient (%)
    const slope = segmentDist > 0 ? (dy / segmentDist) * 100 : 0;

    track.push({
      index: i,
      t: accumulatedDist / totalDistance,
      x: curr.x,
      y: curr.y,
      z: curr.z,
      yaw,
      speed: Math.round(speed),
      gear,
      rpm,
      throttle: parseFloat(throttle.toFixed(2)),
      brake: parseFloat(brake.toFixed(2)),
      slope: parseFloat(slope.toFixed(1))
    });
  }

  // Calculate bounding box and center offsets
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  track.forEach(p => {
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
    totalDistance: Math.round(totalDistance)
  };

  return { track, center, bounds };
}
