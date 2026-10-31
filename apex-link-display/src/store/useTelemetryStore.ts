import { create } from 'zustand';
import {
  ChassisSettings,
  DDUState,
  FuelTelemetry,
  Microsector,
  MicrosectorStatus,
  MockScenario,
  TimedFullscreenOverlay,
} from '../types/ddu';
import { LapCompletedEvent, TelemetryFrame } from '../types/telemetry';

const INITIAL_TELEMETRY: TelemetryFrame = {
  type: 'FRAME',
  timestamp: Date.now(),
  car: {
    speedKmh: 312,
    rpms: 12450,
    maxRpm: 13000,
    gear: 7,
    throttle: 1.0,
    brake: 0.0,
    clutch: 0.0,
    steer: 0.02,
    drsAvailable: true,
    drsEnabled: true,
    tc: 2,
    abs: 3,
    brakeBias: 58.5,
    pitLimiterOn: false,
    isInPitLane: false,
  },
  tyres: {
    pressurePsi: [27.6, 27.8, 27.7, 27.9],
    tempCoreC: [88.2, 91.4, 85.0, 92.1],
    wear: [98.5, 97.8, 99.1, 98.6],
    tempBrakesC: [623, 648, 634, 701],
  },
  timing: {
    lapTimeMs: 0,
    lapTimeStr: '00:00.000',
    bestTimeMs: 0,
    bestTimeStr: '--:--.---',
    deltaMs: 0,
    currentLap: 1,
    sector: 1,
    lapProgress: 0.0,
  },
  dynamics: {
    gForce: {
      lat: 0.45,
      lon: 0.85,
      vert: 0.05,
    },
    worldPos: {
      x: 245.32,
      y: 12.0,
      z: -412.18,
    },
  },
  session: {
    flag: 'GREEN',
    position: 2,
    track: 'monza',
    carModel: 'ks_ferrari_sf70h',
    fuel: 46.2,
    maxFuel: 105.0,
    tyreCompound: 'SOFT',
  },
};

const INITIAL_CHASSIS: ChassisSettings = {
  tc: 2,
  tcCut: 2,
  abs: 3,
  brakeBias: 58.5,
  engineMap: 'RACE 1',
};

const INITIAL_FUEL: FuelTelemetry = {
  remainingLiters: 46.2,
  consumptionPerLap: 2.45,
  lapsAutonomy: 18,
};

// Generar 20 microsectores en la pista (S1: 0..6, S2: 7..13, S3: 14..19)
const createInitialMicrosectors = (): Microsector[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    status: (i < 9 ? (i % 3 === 0 ? 'purple' : i % 2 === 0 ? 'green' : 'yellow') : i === 9 ? 'active' : 'upcoming') as MicrosectorStatus,
    macroSector: (i < 7 ? 1 : i < 14 ? 2 : 3) as (1 | 2 | 3),
    deltaMs: i < 9 ? (i % 3 === 0 ? -240 : i % 2 === 0 ? -80 : 120) : undefined,
  }));
};

let timedOverlayTimer: number | null = null;

export const useTelemetryStore = create<DDUState>((set, get) => ({
  telemetry: INITIAL_TELEMETRY,
  chassis: INITIAL_CHASSIS,
  fuel: INITIAL_FUEL,
  brakes: {
    tempDiscsC: [623, 648, 634, 701],
  },

  isConnected: false,
  isUsbConnected: true,
  latencyMs: 1,
  fps: 60,

  speedUnit: 'KMH',
  tempUnit: 'C',
  layoutMode: 'F1',

  isInPitLane: false,
  pitLimiterActive: false,
  tyreCompound: 'SOFT',
  macroSectors: ['purple', 'active', 'upcoming'],
  timedOverlay: null,
  microsectors: createInitialMicrosectors(),

  bestLapTimeMs: 0,
  bestLapTimeStr: '--:--.---',

  lastCompletedLap: null,
  showLapBanner: false,
  dismissLapBanner: () => set({ showLapBanner: false }),

  isMockActive: false, // Por defecto conecta directamente al backend de telemetria en vivo
  mockScenario: 'RACE_STINT',

  updateTelemetry: (frame: TelemetryFrame) => {
    set((state) => {
      // 1. Gestión del Mejor Tiempo de la Sesión Activa
      const sessionReset = frame.timing.currentLap < state.telemetry.timing.currentLap;

      let currentBestMs = sessionReset ? 0 : (frame.timing.bestTimeMs ?? 0);
      let currentBestStr = sessionReset
        ? '--:--.---'
        : (frame.timing.bestTimeStr && frame.timing.bestTimeStr !== '-:--:---')
        ? frame.timing.bestTimeStr
        : '--:--.---';

      // Si el frame no trae mejor tiempo aún pero en esta misma sesión se registró una vuelta completada
      if (!sessionReset && currentBestMs === 0 && state.bestLapTimeMs > 0 && frame.timing.currentLap >= state.telemetry.timing.currentLap) {
        currentBestMs = state.bestLapTimeMs;
        currentBestStr = state.bestLapTimeStr;
      }

      // Normalizar la representación de cadenas de tiempo para evitar "-:--:---"
      const bestDisplayStr = (currentBestMs > 0 && currentBestStr !== '--:--.---' && currentBestStr !== '-:--:---')
        ? currentBestStr
        : (frame.timing.bestTimeStr && frame.timing.bestTimeStr !== '-:--:---')
        ? frame.timing.bestTimeStr
        : '--:--.---';

      const lapTimeDisplayStr = (frame.timing.lapTimeStr && frame.timing.lapTimeStr !== '-:--:---')
        ? frame.timing.lapTimeStr
        : '00:00.000';

      const nextTelemetry: TelemetryFrame = {
        ...frame,
        timing: {
          ...frame.timing,
          bestTimeMs: currentBestMs,
          bestTimeStr: bestDisplayStr,
          lapTimeStr: lapTimeDisplayStr,
        },
      };

      // 2. Parámetros del chasis (TC, ABS, Reparto de frenada) si vienen del simulador
      const nextChassis = { ...state.chassis };
      let tcChanged = false;
      let absChanged = false;
      let biasChanged = false;

      if (frame.car.tc !== undefined) {
        const parsedTc = frame.car.tc <= 1.0 ? Math.round(frame.car.tc) : Math.round(frame.car.tc);
        if (parsedTc !== state.chassis.tc) {
          nextChassis.tc = parsedTc;
          tcChanged = true;
        }
      }

      if (frame.car.abs !== undefined) {
        const parsedAbs = frame.car.abs <= 1.0 ? Math.round(frame.car.abs) : Math.round(frame.car.abs);
        if (parsedAbs !== state.chassis.abs) {
          nextChassis.abs = parsedAbs;
          absChanged = true;
        }
      }

      if (frame.car.brakeBias !== undefined && frame.car.brakeBias > 0) {
        const parsedBias = frame.car.brakeBias <= 1.0
          ? Math.round(frame.car.brakeBias * 1000) / 10
          : Math.round(frame.car.brakeBias * 10) / 10;
        if (Math.abs(parsedBias - state.chassis.brakeBias) >= 0.2) {
          nextChassis.brakeBias = parsedBias;
          biasChanged = true;
        }
      }

      // Si el cambio proviene del simulador en vivo, disparar el overlay temporal correspondiente
      if (state.isConnected && state.telemetry.timestamp > 0) {
        if (biasChanged) {
          get().showTimedOverlay(
            {
              type: 'CHASSIS_CHANGE',
              parameter: 'BRAKE BIAS',
              value: `${nextChassis.brakeBias.toFixed(1)}%`,
              color: 'text-white',
              subtext: 'FRONT AXLE BALANCE',
            },
            1000
          );
        } else if (tcChanged) {
          get().showTimedOverlay(
            {
              type: 'CHASSIS_CHANGE',
              parameter: 'TRACTION CONTROL',
              value: nextChassis.tc === 0 ? 'OFF' : nextChassis.tc === 1 ? 'ON' : `${nextChassis.tc}`,
              color: 'text-cyan-400',
              subtext: nextChassis.tc === 0 ? 'TC DISABLED' : nextChassis.tc === 1 ? 'TC ENABLED' : 'SLIP RATIO 1..12',
            },
            1000
          );
        } else if (absChanged) {
          get().showTimedOverlay(
            {
              type: 'CHASSIS_CHANGE',
              parameter: 'ABS',
              value: nextChassis.abs === 0 ? 'OFF' : nextChassis.abs === 1 ? 'ON' : `${nextChassis.abs}`,
              color: 'text-rose-400',
              subtext: nextChassis.abs === 0 ? 'ABS DISABLED' : nextChassis.abs === 1 ? 'ABS ENABLED' : 'ANTI-LOCK THRESHOLD',
            },
            1000
          );
        }
      }

      // 3. Estado de boxes y limitador de velocidad
      const nextInPit = frame.car.isInPitLane ?? state.isInPitLane;
      const nextPitLimiter = frame.car.pitLimiterOn ?? state.pitLimiterActive;

      // 4. Temperaturas térmicas de frenos
      const nextBrakes = frame.tyres.tempBrakesC
        ? { tempDiscsC: frame.tyres.tempBrakesC }
        : state.brakes;

      // 5. Combustible
      const nextFuel = frame.session.fuel !== undefined
        ? {
            ...state.fuel,
            remainingLiters: Math.round(frame.session.fuel * 10) / 10,
          }
        : state.fuel;

      // 6. Compuesto de neumático
      let nextCompound = state.tyreCompound;
      if (frame.session.tyreCompound) {
        const rawUpper = frame.session.tyreCompound.toUpperCase();
        if (rawUpper.includes('SOFT') || rawUpper === 'S') nextCompound = 'SOFT';
        else if (rawUpper.includes('MED') || rawUpper === 'M') nextCompound = 'MEDIUM';
        else if (rawUpper.includes('HARD') || rawUpper === 'H') nextCompound = 'HARD';
        else if (rawUpper.includes('INTER') || rawUpper === 'I') nextCompound = 'INTER';
        else if (rawUpper.includes('WET') || rawUpper === 'W') nextCompound = 'WET';
      }

      // 7. Microsectores (20 segmentos a lo largo del circuito)
      const progress = Math.min(1.0, Math.max(0.0, frame.timing.lapProgress || 0));
      const deltaMs = frame.timing.deltaMs || 0;
      const sector = frame.timing.sector || 1;
      const currentLap = frame.timing.currentLap;
      const previousLap = state.telemetry.timing.currentLap;

      let nextMicrosectors = state.microsectors;

      // Detectar inicio de una nueva vuelta completada
      if (currentLap !== previousLap && currentLap > 0) {
        nextMicrosectors = Array.from({ length: 20 }, (_, i) => ({
          id: i,
          status: (i === 0 ? 'active' : 'upcoming') as MicrosectorStatus,
          macroSector: (i < 7 ? 1 : i < 14 ? 2 : 3) as (1 | 2 | 3),
        }));
      }

      const currentMicroIdx = Math.min(19, Math.max(0, Math.floor(progress * 20)));
      const copy = [...nextMicrosectors];
      let hasChanges = false;

      // Actualizar segmentos ya transitados
      for (let i = 0; i < currentMicroIdx; i++) {
        if (copy[i].status === 'upcoming' || copy[i].status === 'active') {
          // Lógica estricta de telemetría de competición:
          // - Récord de sector: morado ('purple') si deltaMs < -150
          // - Mejora personal: verde ('green') si deltaMs <= 0
          // - Pérdida de tiempo / sin mejora: amarillo/gris ('yellow') si deltaMs > 0
          let status: MicrosectorStatus = 'yellow';
          if (deltaMs < -150) {
            status = 'purple';
          } else if (deltaMs <= 0) {
            status = 'green';
          } else {
            status = 'yellow';
          }

          copy[i] = {
            ...copy[i],
            status,
            deltaMs,
          };
          hasChanges = true;
        }
      }

      // El segmento actual donde se ubica el vehículo
      if (copy[currentMicroIdx] && copy[currentMicroIdx].status !== 'active') {
        copy[currentMicroIdx] = {
          ...copy[currentMicroIdx],
          status: 'active',
        };
        hasChanges = true;
      }

      if (hasChanges) {
        nextMicrosectors = copy;
      }

      // 7. Lógica Oficial de los 3 Sectores de Circuito (S1, S2, S3)
      let nextMacroSectors = [...state.macroSectors] as [MicrosectorStatus, MicrosectorStatus, MicrosectorStatus];

      // Al cruzar la línea de meta: ELIMINAR inmediatamente los colores de la vuelta anterior
      if (currentLap !== previousLap && currentLap > 0) {
        nextMacroSectors = ['active', 'upcoming', 'upcoming'];
      } else {
        if (sector === 1) {
          nextMacroSectors[0] = 'active';
          nextMacroSectors[1] = 'upcoming';
          nextMacroSectors[2] = 'upcoming';
        } else if (sector === 2) {
          // Consolidar Sector 1 solo una vez y mantenerlo inmutable durante el resto de la vuelta
          if (nextMacroSectors[0] === 'active' || nextMacroSectors[0] === 'upcoming') {
            nextMacroSectors[0] = deltaMs <= 0 ? 'purple' : 'yellow';
          }
          nextMacroSectors[1] = 'active';
          nextMacroSectors[2] = 'upcoming';
        } else if (sector === 3) {
          // Consolidar Sector 2 solo una vez y mantenerlo inmutable
          if (nextMacroSectors[1] === 'active' || nextMacroSectors[1] === 'upcoming') {
            nextMacroSectors[1] = deltaMs <= 0 ? 'purple' : 'yellow';
          }
          nextMacroSectors[2] = 'active';
        }
      }

      return {
        telemetry: nextTelemetry,
        chassis: nextChassis,
        isInPitLane: nextInPit,
        pitLimiterActive: nextPitLimiter,
        brakes: nextBrakes,
        fuel: nextFuel,
        tyreCompound: nextCompound,
        microsectors: nextMicrosectors,
        macroSectors: nextMacroSectors,
        bestLapTimeMs: currentBestMs,
        bestLapTimeStr: currentBestStr,
      };
    });
  },

  showTimedOverlay: (overlay: TimedFullscreenOverlay, durationMs = 1000) => {
    if (timedOverlayTimer) {
      clearTimeout(timedOverlayTimer);
      timedOverlayTimer = null;
    }

    set({ timedOverlay: overlay });

    timedOverlayTimer = window.setTimeout(() => {
      set({ timedOverlay: null });
      timedOverlayTimer = null;
    }, durationMs);
  },

  dismissTimedOverlay: () => {
    if (timedOverlayTimer) {
      clearTimeout(timedOverlayTimer);
      timedOverlayTimer = null;
    }
    set({ timedOverlay: null });
  },

  triggerLapCompleted: (event: LapCompletedEvent) => {
    set((state) => {
      const isPB = event.isPersonalBest || state.bestLapTimeMs === 0 || event.lapTimeMs < state.bestLapTimeMs;
      const nextBestMs = isPB ? event.lapTimeMs : state.bestLapTimeMs;
      const nextBestStr = isPB ? event.lapTimeStr : state.bestLapTimeStr;

      return {
        lastCompletedLap: event,
        bestLapTimeMs: nextBestMs,
        bestLapTimeStr: nextBestStr,
        macroSectors: ['active', 'upcoming', 'upcoming'],
        telemetry: {
          ...state.telemetry,
          timing: {
            ...state.telemetry.timing,
            bestTimeMs: nextBestMs,
            bestTimeStr: nextBestStr,
          },
        },
      };
    });

    if (event.isPersonalBest) {
      get().showTimedOverlay(
        {
          type: 'FASTEST_LAP',
          lapTimeStr: event.lapTimeStr,
          lapNumber: event.lapNumber,
        },
        1500
      );
    } else {
      set({ showLapBanner: true });
      window.setTimeout(() => {
        set({ showLapBanner: false });
      }, 3000);
    }
  },

  setConnectionStatus: (connected: boolean, latencyMs = 1) => {
    set({ isConnected: connected, latencyMs });
  },

  setFps: (fps: number) => {
    set({ fps });
  },

  toggleSpeedUnit: () => {
    set((state) => ({
      speedUnit: state.speedUnit === 'KMH' ? 'MPH' : 'KMH',
    }));
  },

  toggleTempUnit: () => {
    set((state) => ({
      tempUnit: state.tempUnit === 'C' ? 'F' : 'C',
    }));
  },

  setLayoutMode: (mode) => {
    set({ layoutMode: mode });
  },

  setChassisValue: (key, value) => {
    set((state) => ({
      chassis: {
        ...state.chassis,
        [key]: value,
      },
    }));

    if (key === 'brakeBias') {
      const val = value as number;
      get().showTimedOverlay(
        {
          type: 'CHASSIS_CHANGE',
          parameter: 'BRAKE BIAS',
          value: `${val.toFixed(1)}%`,
          color: 'text-white',
          subtext: 'FRONT AXLE BALANCE',
        },
        1000
      );
    } else if (key === 'tc') {
      get().showTimedOverlay(
        {
          type: 'CHASSIS_CHANGE',
          parameter: 'TRACTION CONTROL',
          value: `${value}`,
          color: 'text-cyan-400',
          subtext: 'SLIP RATIO 1..12',
        },
        1000
      );
    } else if (key === 'abs') {
      get().showTimedOverlay(
        {
          type: 'CHASSIS_CHANGE',
          parameter: 'ABS',
          value: `${value}`,
          color: 'text-rose-400',
          subtext: 'ANTI-LOCK THRESHOLD 1..12',
        },
        1000
      );
    }
  },

  setPitLimiter: (active: boolean) => {
    set({ pitLimiterActive: active });
  },

  setIsInPitLane: (inPit: boolean) => {
    set({
      isInPitLane: inPit,
      pitLimiterActive: inPit,
    });
  },

  setTyreCompound: (compound) => {
    set({ tyreCompound: compound });
  },

  setMacroSector: (index, status) => {
    set((state) => {
      const copy = [...state.macroSectors] as [MicrosectorStatus, MicrosectorStatus, MicrosectorStatus];
      copy[index] = status;
      return { macroSectors: copy };
    });
  },

  setMockActive: (active: boolean) => {
    set({ isMockActive: active });
  },

  setMockScenario: (scenario: MockScenario) => {
    const inPit = scenario === 'PIT_LANE';
    set({
      mockScenario: scenario,
      isInPitLane: inPit,
      pitLimiterActive: inPit,
    });
  },

  updateMicrosector: (index: number, status, deltaMs) => {
    set((state) => {
      const copy = [...state.microsectors];
      if (copy[index]) {
        copy[index] = { ...copy[index], status, deltaMs };
      }
      return { microsectors: copy };
    });
  },

  resetMicrosectors: () => {
    set({
      microsectors: Array.from({ length: 20 }, (_, i) => ({
        id: i,
        status: (i === 0 ? 'active' : 'upcoming') as MicrosectorStatus,
        macroSector: (i < 7 ? 1 : i < 14 ? 2 : 3) as (1 | 2 | 3),
      })),
    });
  },
}));
