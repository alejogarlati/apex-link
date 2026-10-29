import { useEffect, useRef } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { LapCompletedEvent, TelemetryFrame } from '../types/telemetry';

export const useMockTelemetry = () => {
  const isMockActive = useTelemetryStore((s) => s.isMockActive);
  const mockScenario = useTelemetryStore((s) => s.mockScenario);
  const updateTelemetry = useTelemetryStore((s) => s.updateTelemetry);
  const triggerLapCompleted = useTelemetryStore((s) => s.triggerLapCompleted);
  const setFps = useTelemetryStore((s) => s.setFps);

  const stateRef = useRef({
    progress: 0.52,
    lap: 4,
    lapTimeMs: 42350,
    bestTimeMs: 81240,
    speedKmh: 284,
    gear: 6,
    rpm: 11800,
    throttle: 1.0,
    brake: 0.0,
    brakeTemps: [620, 640, 630, 680] as [number, number, number, number],
    tyreTemps: [88.5, 91.2, 86.0, 92.4] as [number, number, number, number],
    tyrePressures: [27.5, 27.8, 27.6, 27.9] as [number, number, number, number],
    tyreWear: [98.5, 97.9, 99.1, 98.7] as [number, number, number, number],
    gLat: 0.45,
    gLon: 0.85,
    drsAvailable: true,
    drsEnabled: false,
    lastFrameTime: performance.now(),
    frameCount: 0,
    fpsTimer: performance.now(),
  });

  useEffect(() => {
    if (!isMockActive) return;

    let animId: number;

    const formatLapTime = (ms: number): string => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const millis = Math.floor(ms % 1000);
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
    };

    const loop = (now: number) => {
      const state = stateRef.current;
      const dtSec = Math.min((now - state.lastFrameTime) / 1000, 0.05); // Cap to avoid huge skips
      state.lastFrameTime = now;

      // FPS tracking
      state.frameCount++;
      if (now - state.fpsTimer >= 1000) {
        setFps(state.frameCount);
        state.frameCount = 0;
        state.fpsTimer = now;
      }

      // Step telemetry based on scenario
      if (mockScenario === 'PIT_LANE') {
        state.speedKmh = 78.5 + Math.sin(now * 0.005) * 1.5;
        state.gear = 1;
        state.rpm = 5400;
        state.throttle = 0.45;
        state.brake = 0.0;
        state.drsAvailable = false;
        state.drsEnabled = false;
        state.gLat = 0.02;
        state.gLon = 0.0;
        state.brakeTemps = [480, 490, 450, 460];
      } else if (mockScenario === 'RETTIFILO_BRAKING') {
        // Heavy deceleration scenario
        state.speedKmh = Math.max(74, state.speedKmh - dtSec * 160);
        state.throttle = 0.0;
        state.brake = Math.min(1.0, state.brake + dtSec * 4.0);
        state.gear = state.speedKmh > 240 ? 6 : state.speedKmh > 180 ? 5 : state.speedKmh > 130 ? 4 : state.speedKmh > 95 ? 3 : 2;
        state.rpm = Math.max(4500, Math.floor(state.speedKmh * 45));
        state.gLon = -2.85;
        state.gLat = 0.15;
        state.drsAvailable = false;
        state.drsEnabled = false;
        // Brake discs get white-hot
        state.brakeTemps = [
          Math.min(840, state.brakeTemps[0] + dtSec * 120),
          Math.min(855, state.brakeTemps[1] + dtSec * 125),
          Math.min(790, state.brakeTemps[2] + dtSec * 90),
          Math.min(810, state.brakeTemps[3] + dtSec * 95),
        ];
        if (state.speedKmh <= 75) {
          state.speedKmh = 325; // Loop braking demo
          state.brake = 0.0;
        }
      } else if (mockScenario === 'DRS_ZONE') {
        state.speedKmh = Math.min(335, 310 + Math.sin(now * 0.002) * 15);
        state.gear = 7;
        state.rpm = Math.floor(12100 + (state.speedKmh - 310) * 45);
        state.throttle = 1.0;
        state.brake = 0.0;
        state.drsAvailable = true;
        state.drsEnabled = true;
        state.gLat = 0.05;
        state.gLon = 0.42;
      } else if (mockScenario === 'CURVA_GRANDE_ACCEL') {
        state.speedKmh = 292 + Math.sin(now * 0.003) * 6;
        state.gear = 6;
        state.rpm = 12450;
        state.throttle = 1.0;
        state.brake = 0.0;
        state.drsAvailable = false;
        state.drsEnabled = false;
        state.gLat = 2.45; // Intense lateral G
        state.gLon = 0.35;
        // Left tyres get hot
        state.tyreTemps[0] = Math.min(104, state.tyreTemps[0] + dtSec * 2.5);
        state.tyreTemps[2] = Math.min(101, state.tyreTemps[2] + dtSec * 2.0);
      } else {
        // Dynamic continuous realistic lap (RACE_STINT)
        state.progress += (state.speedKmh / 3.6 / 5793.0) * dtSec;
        state.lapTimeMs += dtSec * 1000;

        // Realistic Monza track profile according to progress (0..1)
        if (state.progress >= 1.0) {
          // Lap completed!
          state.progress -= 1.0;
          state.lap += 1;
          const closedTime = Math.floor(state.lapTimeMs);
          const isPB = closedTime < state.bestTimeMs;
          if (isPB) state.bestTimeMs = closedTime;

          const event: LapCompletedEvent = {
            type: 'LAP_COMPLETED',
            lapNumber: state.lap - 1,
            lapTimeMs: closedTime,
            lapTimeStr: formatLapTime(closedTime),
            isPersonalBest: isPB,
            isValidLap: true,
            sectors: [28100, 27450, 25690],
            telemetrySamplesCount: 4890,
            sessionLapId: `lap-${state.lap - 1}-${Date.now()}`,
          };
          triggerLapCompleted(event);
          state.lapTimeMs = 0;
        }

        const p = state.progress;
        // Rettifilo straight (0.00 -> 0.15): 280 to 330 km/h in 7th
        if (p < 0.14) {
          state.throttle = 1.0;
          state.brake = 0.0;
          state.speedKmh = Math.min(332, 280 + p * 380);
          state.gear = state.speedKmh > 305 ? 7 : 6;
          state.drsAvailable = state.speedKmh > 260;
          state.drsEnabled = state.drsAvailable && state.gear === 7;
          state.gLat = 0.02;
          state.gLon = 0.45;
          // Discs cool down
          state.brakeTemps[0] = Math.max(520, state.brakeTemps[0] - dtSec * 25);
          state.brakeTemps[1] = Math.max(530, state.brakeTemps[1] - dtSec * 25);
        } else if (p < 0.17) {
          // Rettifilo Chicane 1 braking (0.14 -> 0.17): 330 -> 76 km/h
          state.throttle = 0.0;
          state.brake = 1.0;
          state.speedKmh = Math.max(76, state.speedKmh - dtSec * 210);
          state.gear = state.speedKmh > 200 ? 5 : state.speedKmh > 130 ? 3 : 2;
          state.drsAvailable = false;
          state.drsEnabled = false;
          state.gLon = -2.95;
          state.gLat = 0.45;
          state.brakeTemps[0] = Math.min(845, state.brakeTemps[0] + dtSec * 90);
          state.brakeTemps[1] = Math.min(850, state.brakeTemps[1] + dtSec * 95);
        } else if (p < 0.34) {
          // Curva Grande / Biassono (0.17 -> 0.34): 76 -> 292 km/h full throttle right
          state.throttle = 1.0;
          state.brake = 0.0;
          state.speedKmh = Math.min(295, state.speedKmh + dtSec * 45);
          state.gear = state.speedKmh > 265 ? 6 : state.speedKmh > 215 ? 5 : state.speedKmh > 165 ? 4 : 3;
          state.drsAvailable = false;
          state.drsEnabled = false;
          state.gLat = 2.35;
          state.gLon = 0.55;
        } else if (p < 0.38) {
          // Variante della Roggia (0.34 -> 0.38): 295 -> 95 km/h
          state.throttle = 0.1;
          state.brake = 0.95;
          state.speedKmh = Math.max(95, state.speedKmh - dtSec * 180);
          state.gear = state.speedKmh > 180 ? 4 : state.speedKmh > 120 ? 3 : 2;
          state.gLon = -2.6;
          state.gLat = -1.2;
        } else if (p < 0.58) {
          // Lesmo 1 & 2 (0.38 -> 0.58): 165 to 220 km/h
          state.throttle = 0.85;
          state.brake = 0.0;
          state.speedKmh = Math.min(235, 160 + (p - 0.38) * 350);
          state.gear = state.speedKmh > 205 ? 5 : 4;
          state.gLat = 1.85;
          state.gLon = 0.45;
        } else if (p < 0.72) {
          // Serraglio & Recta hacia Ascari (0.58 -> 0.72): 298 km/h
          state.throttle = 1.0;
          state.brake = 0.0;
          state.speedKmh = Math.min(302, 235 + (p - 0.58) * 450);
          state.gear = state.speedKmh > 270 ? 7 : 6;
          state.drsAvailable = true;
          state.drsEnabled = true;
          state.gLat = 0.05;
          state.gLon = 0.5;
        } else if (p < 0.82) {
          // Variante Ascari (0.72 -> 0.82): chicana rápida izquierda-derecha 170-240 km/h
          state.throttle = 0.7;
          state.brake = 0.3;
          state.speedKmh = Math.min(245, 175 + (p - 0.72) * 550);
          state.gear = state.speedKmh > 210 ? 5 : 4;
          state.drsAvailable = false;
          state.drsEnabled = false;
          state.gLat = -1.95;
          state.gLon = 0.1;
        } else {
          // Curva Alboreto / Parabolica (0.82 -> 1.00): entrada a 170 y salida a fondo en 6ta
          state.throttle = p > 0.88 ? 1.0 : 0.65;
          state.brake = p < 0.84 ? 0.6 : 0.0;
          state.speedKmh = Math.min(280, 170 + (p - 0.82) * 600);
          state.gear = state.speedKmh > 250 ? 6 : state.speedKmh > 200 ? 5 : 4;
          state.gLat = 2.15;
          state.gLon = 0.65;
        }

        // RPM calculation based on gear and speed
        const gearRatio = [0, 165, 118, 88, 68, 54, 44.5, 39.8][state.gear] || 45;
        state.rpm = Math.min(13100, Math.max(4200, Math.floor(state.speedKmh * gearRatio)));
      }

      // Delta oscillation (-0.450 to +0.320s)
      const deltaOsc = Math.sin((state.progress + state.lap * 0.35) * Math.PI * 2) * 380;
      const currentDeltaMs = Math.round(deltaOsc);

      // Determine sector
      const sector = state.progress < 0.35 ? 1 : state.progress < 0.70 ? 2 : 3;

      const frame: TelemetryFrame = {
        type: 'FRAME',
        timestamp: Date.now(),
        car: {
          speedKmh: Math.round(state.speedKmh),
          rpms: state.rpm,
          maxRpm: 13000,
          gear: state.gear,
          throttle: parseFloat(state.throttle.toFixed(2)),
          brake: parseFloat(state.brake.toFixed(2)),
          steer: parseFloat((state.gLat * 0.12).toFixed(2)),
          drsAvailable: state.drsAvailable,
          drsEnabled: state.drsEnabled,
        },
        tyres: {
          pressurePsi: [
            parseFloat(state.tyrePressures[0].toFixed(1)),
            parseFloat(state.tyrePressures[1].toFixed(1)),
            parseFloat(state.tyrePressures[2].toFixed(1)),
            parseFloat(state.tyrePressures[3].toFixed(1)),
          ],
          tempCoreC: [
            parseFloat(state.tyreTemps[0].toFixed(1)),
            parseFloat(state.tyreTemps[1].toFixed(1)),
            parseFloat(state.tyreTemps[2].toFixed(1)),
            parseFloat(state.tyreTemps[3].toFixed(1)),
          ],
          wear: [
            parseFloat(state.tyreWear[0].toFixed(1)),
            parseFloat(state.tyreWear[1].toFixed(1)),
            parseFloat(state.tyreWear[2].toFixed(1)),
            parseFloat(state.tyreWear[3].toFixed(1)),
          ],
        },
        timing: {
          lapTimeMs: Math.floor(state.lapTimeMs),
          lapTimeStr: formatLapTime(state.lapTimeMs),
          bestTimeMs: state.bestTimeMs,
          bestTimeStr: formatLapTime(state.bestTimeMs),
          deltaMs: currentDeltaMs,
          currentLap: state.lap,
          sector,
          lapProgress: parseFloat(state.progress.toFixed(4)),
        },
        dynamics: {
          gForce: {
            lat: parseFloat(state.gLat.toFixed(2)),
            lon: parseFloat(state.gLon.toFixed(2)),
            vert: 0.05,
          },
          worldPos: {
            x: 245 + Math.sin(state.progress * Math.PI * 2) * 600,
            y: 12.0,
            z: -412 + Math.cos(state.progress * Math.PI * 2) * 350,
          },
        },
        session: {
          flag: 'GREEN',
          position: 2,
          track: 'monza',
          carModel: 'ks_ferrari_sf70h',
        },
      };

      updateTelemetry(frame);

      // Update brake discs in store
      useTelemetryStore.setState({
        brakes: {
          tempDiscsC: [
            Math.round(state.brakeTemps[0]),
            Math.round(state.brakeTemps[1]),
            Math.round(state.brakeTemps[2]),
            Math.round(state.brakeTemps[3]),
          ],
        },
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isMockActive, mockScenario, updateTelemetry, triggerLapCompleted, setFps]);
};
