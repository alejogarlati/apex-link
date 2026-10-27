/**
 * ApexLink Mock Telemetry Engine
 * Simula una vuelta a 60 FPS generando datos dinámicos realistas
 * (aceleración, frenado, paso de marcha, RPM, delta y coordenadas).
 */
export function createMockTelemetryGenerator() {
  const maxRpm = 13500;
  const idleRpm = 3500;
  let currentRpm = idleRpm;
  let currentGear = 1;
  let currentSpeed = 0;
  let lapProgress = 0.0;
  let lapTimeMs = 0;
  let bestTimeMs = 82450; // 01:22.450
  let lapCount = 1;
  let throttle = 0;
  let brake = 0;

  return function getNextFrame() {
    lapTimeMs += 16;
    lapProgress += 0.0002;

    if (lapProgress >= 1.0) {
      lapProgress = 0.0;
      lapCount++;
      lapTimeMs = 0;
      currentSpeed = 60;
      currentGear = 2;
    }

    // Comportamiento cíclico de aceleración y frenada
    const cycle = (lapProgress * 20) % 2; // Alterna rectas y curvas
    if (cycle < 1.4) {
      // Zona de aceleración
      throttle = 1.0;
      brake = 0.0;
      currentRpm += 120;
      currentSpeed += 0.7;

      if (currentRpm >= maxRpm && currentGear < 8) {
        currentGear++;
        currentRpm = 9500;
      }
    } else {
      // Zona de frenada
      throttle = 0.0;
      brake = 0.85;
      currentRpm = Math.max(idleRpm, currentRpm - 250);
      currentSpeed = Math.max(70, currentSpeed - 2.5);

      if (currentRpm <= 8000 && currentGear > 2) {
        currentGear--;
        currentRpm = 10500;
      }
    }

    const minutes = Math.floor(lapTimeMs / 60000);
    const seconds = Math.floor((lapTimeMs % 60000) / 1000);
    const millis = lapTimeMs % 1000;
    const lapTimeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;

    // Delta simulado (+/- milisegundos respecto a la vuelta de referencia)
    const deltaMs = Math.round(Math.sin(lapProgress * Math.PI * 4) * 450);

    return {
      type: 'FRAME',
      timestamp: Date.now(),
      car: {
        speedKmh: Math.round(currentSpeed),
        rpms: Math.round(currentRpm),
        maxRpm: maxRpm,
        gear: currentGear,
        throttle: Number(throttle.toFixed(2)),
        brake: Number(brake.toFixed(2)),
        steer: Number((Math.sin(lapProgress * 30) * 0.3).toFixed(2)),
        drsAvailable: currentSpeed > 220,
        drsEnabled: currentSpeed > 240
      },
      tyres: {
        pressurePsi: [23.4, 23.5, 21.2, 21.3],
        tempCoreC: [
          Math.round(92 + Math.sin(lapProgress * 10) * 6),
          Math.round(94 + Math.cos(lapProgress * 10) * 7),
          89,
          90
        ],
        wear: [98.5, 98.2, 99.1, 99.0]
      },
      timing: {
        lapTimeMs,
        lapTimeStr,
        bestTimeMs,
        bestTimeStr: '01:22.450',
        deltaMs,
        currentLap: lapCount,
        sector: lapProgress < 0.33 ? 1 : lapProgress < 0.66 ? 2 : 3,
        lapProgress: Number(lapProgress.toFixed(4))
      },
      dynamics: {
        gForce: {
          lat: Number((Math.sin(lapProgress * 20) * 2.8).toFixed(2)),
          lon: Number((brake > 0 ? -3.2 : 1.1).toFixed(2)),
          vert: 0.1
        },
        worldPos: {
          x: Number((Math.cos(lapProgress * Math.PI * 2) * 500).toFixed(2)),
          y: 10.0,
          z: Number((Math.sin(lapProgress * Math.PI * 2) * 500).toFixed(2))
        }
      },
      session: {
        flag: brake > 0 && currentSpeed < 90 ? 'YELLOW' : 'GREEN',
        position: 1,
        track: 'monza',
        carModel: 'formula_hybrid_2026'
      }
    };
  };
}
