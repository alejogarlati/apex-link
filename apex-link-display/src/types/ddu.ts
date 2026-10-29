import { LapCompletedEvent, TelemetryFrame } from './telemetry';

export interface ChassisSettings {
  tc: number; // Traction Control level 1..8
  tcCut: number; // TC Cut rate 1..8
  abs: number; // Anti-lock braking 1..10
  brakeBias: number; // Front brake bias percentage, e.g. 58.5
  engineMap: string; // e.g. "RACE 1", "QUAL 1", "WET", "MIX 2"
}

export interface FuelTelemetry {
  remainingLiters: number;
  consumptionPerLap: number;
  lapsAutonomy: number;
}

export interface BrakesThermalTelemetry {
  tempDiscsC: [number, number, number, number]; // [FL, FR, RL, RR] in °C
}

export type SpeedUnit = 'KMH' | 'MPH';
export type TempUnit = 'C' | 'F';
export type DDULayoutMode = 'F1' | 'GT3';

export type MockScenario = 
  | 'RACE_STINT' // Dynamic lap around Monza with accelerations & braking
  | 'RETTIFILO_BRAKING' // Heavy braking from 330 km/h to 75 km/h
  | 'CURVA_GRANDE_ACCEL' // High speed right turn with lateral G
  | 'PIT_LANE' // In pit lane with pit limiter 4Hz active
  | 'DRS_ZONE'; // Full throttle 7th gear with DRS open

export interface DDUState {
  // Telemetry frame
  telemetry: TelemetryFrame;
  
  // Auxiliary cockpit parameters
  chassis: ChassisSettings;
  fuel: FuelTelemetry;
  brakes: BrakesThermalTelemetry;
  
  // Connection & Diagnostics
  isConnected: boolean;
  isUsbConnected: boolean;
  latencyMs: number;
  fps: number;
  
  // UI Display Preferences
  speedUnit: SpeedUnit;
  tempUnit: TempUnit;
  layoutMode: DDULayoutMode;
  
  // Pit Limiter state
  pitLimiterActive: boolean;
  
  // Event & Notification state
  lastCompletedLap: LapCompletedEvent | null;
  showLapBanner: boolean;
  
  // Mock Engine Controls
  isMockActive: boolean;
  mockScenario: MockScenario;
  
  // Actions
  updateTelemetry: (frame: TelemetryFrame) => void;
  triggerLapCompleted: (event: LapCompletedEvent) => void;
  setConnectionStatus: (connected: boolean, latencyMs?: number) => void;
  setFps: (fps: number) => void;
  toggleSpeedUnit: () => void;
  toggleTempUnit: () => void;
  setLayoutMode: (mode: DDULayoutMode) => void;
  setChassisValue: <K extends keyof ChassisSettings>(key: K, value: ChassisSettings[K]) => void;
  setPitLimiter: (active: boolean) => void;
  setMockActive: (active: boolean) => void;
  setMockScenario: (scenario: MockScenario) => void;
  dismissLapBanner: () => void;
}
