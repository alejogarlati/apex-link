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
  },
  tyres: {
    pressurePsi: [27.6, 27.8, 27.7, 27.9],
    tempCoreC: [88.2, 91.4, 85.0, 92.1],
    wear: [98.5, 97.8, 99.1, 98.6],
  },
  timing: {
    lapTimeMs: 42350,
    lapTimeStr: '00:42.350',
    bestTimeMs: 81240,
    bestTimeStr: '01:21.240',
    deltaMs: -320,
    currentLap: 4,
    sector: 2,
    lapProgress: 0.5215,
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

// Generate 20 microsectors across track (S1: 0..6, S2: 7..13, S3: 14..19)
const createInitialMicrosectors = (): Microsector[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    status: (i < 9 ? (i % 3 === 0 ? 'purple' : i % 2 === 0 ? 'green' : 'yellow') : i === 9 ? 'active' : 'upcoming') as any,
    macroSector: i < 7 ? 1 : i < 14 ? 2 : 3,
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

  isConnected: true,
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

  lastCompletedLap: null,
  showLapBanner: false,
  dismissLapBanner: () => set({ showLapBanner: false }),

  isMockActive: true, // Default to mock for standalone testing
  mockScenario: 'RACE_STINT',

  updateTelemetry: (frame: TelemetryFrame) => {
    set({ telemetry: frame });
  },

  showTimedOverlay: (overlay: TimedFullscreenOverlay, durationMs = 1000) => {
    // If a timer was already running, clear it immediately (interrupt and reset clock)
    if (timedOverlayTimer) {
      clearTimeout(timedOverlayTimer);
      timedOverlayTimer = null;
    }

    set({ timedOverlay: overlay });

    // Set new timer for exactly durationMs (1.0s by default)
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
    set({ lastCompletedLap: event });

    if (event.isPersonalBest) {
      // Show fastest lap overlay for 1.0 second
      get().showTimedOverlay({
        type: 'FASTEST_LAP',
        lapTimeStr: event.lapTimeStr,
        lapNumber: event.lapNumber,
      }, 1000);
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

    // Trigger full screen 1-second overlay for BBIAS, TC, or ABS
    if (key === 'brakeBias') {
      const val = value as number;
      get().showTimedOverlay({
        type: 'CHASSIS_CHANGE',
        parameter: 'BRAKE BIAS',
        value: `${val.toFixed(1)}%`,
        color: 'text-white',
        subtext: 'FRONT AXLE BALANCE',
      }, 1000);
    } else if (key === 'tc') {
      get().showTimedOverlay({
        type: 'CHASSIS_CHANGE',
        parameter: 'TRACTION CONTROL',
        value: `${value}`,
        color: 'text-cyan-400',
        subtext: 'SLIP RATIO 1..12',
      }, 1000);
    } else if (key === 'abs') {
      get().showTimedOverlay({
        type: 'CHASSIS_CHANGE',
        parameter: 'ABS',
        value: `${value}`,
        color: 'text-rose-400',
        subtext: 'ANTI-LOCK THRESHOLD 1..12',
      }, 1000);
    }
  },

  setPitLimiter: (active: boolean) => {
    set({ pitLimiterActive: active });
  },

  setIsInPitLane: (inPit: boolean) => {
    set({
      isInPitLane: inPit,
      // If entering pit lane, default pit limiter to true if needed
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
        status: i === 0 ? 'active' : 'upcoming',
        macroSector: i < 7 ? 1 : i < 14 ? 2 : 3,
      })),
    });
  },
}));
