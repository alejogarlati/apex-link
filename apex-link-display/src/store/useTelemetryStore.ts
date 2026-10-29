import { create } from 'zustand';
import { ChassisSettings, DDUState, FuelTelemetry, MockScenario, SpeedUnit, TempUnit } from '../types/ddu';
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

let lapBannerTimeout: number | null = null;

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
  
  pitLimiterActive: false,
  
  lastCompletedLap: null,
  showLapBanner: false,
  
  isMockActive: true, // Default to mock for standalone testing
  mockScenario: 'RACE_STINT',
  
  updateTelemetry: (frame: TelemetryFrame) => {
    set({ telemetry: frame });
  },
  
  triggerLapCompleted: (event: LapCompletedEvent) => {
    if (lapBannerTimeout) {
      clearTimeout(lapBannerTimeout);
    }
    
    set({
      lastCompletedLap: event,
      showLapBanner: true,
    });
    
    // Auto-dismiss lap completed overlay after 4 seconds as specified in requirements
    lapBannerTimeout = window.setTimeout(() => {
      set({ showLapBanner: false });
      lapBannerTimeout = null;
    }, 4000);
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
  },
  
  setPitLimiter: (active: boolean) => {
    set({ pitLimiterActive: active });
  },
  
  setMockActive: (active: boolean) => {
    set({ isMockActive: active });
  },
  
  setMockScenario: (scenario: MockScenario) => {
    set({ mockScenario: scenario });
  },
  
  dismissLapBanner: () => {
    if (lapBannerTimeout) {
      clearTimeout(lapBannerTimeout);
      lapBannerTimeout = null;
    }
    set({ showLapBanner: false });
  },
}));
