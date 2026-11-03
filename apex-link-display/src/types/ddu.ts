import { LapCompletedEvent, TelemetryFrame } from './telemetry';

export type AppState = 'STANDBY' | 'CALIBRATING' | 'ON_SESSION';

export interface PilotProfile {
  name: string;
  alias: string;
  isGuest: boolean;
}

export interface ChassisSettings {
  tc: number; // Traction Control level 1..12
  tcCut: number; // TC Cut rate 1..8
  abs: number; // Anti-lock braking 1..12
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
export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTER' | 'WET';

export type MockScenario = 
  | 'RACE_STINT' // Dynamic lap around Monza with accelerations & braking
  | 'RETTIFILO_BRAKING' // Heavy braking from 330 km/h to 75 km/h
  | 'CURVA_GRANDE_ACCEL' // High speed right turn with lateral G
  | 'PIT_LANE' // In pit lane with pit limiter 4Hz active
  | 'DRS_ZONE'; // Full throttle 7th gear with DRS open

export type MicrosectorStatus = 'upcoming' | 'active' | 'purple' | 'green' | 'yellow';

export interface Microsector {
  id: number; // 0..19
  status: MicrosectorStatus;
  deltaMs?: number;
  macroSector: 1 | 2 | 3;
}

export type TimedFullscreenOverlay =
  | {
      type: 'CHASSIS_CHANGE';
      parameter: 'BRAKE BIAS' | 'TRACTION CONTROL' | 'ABS';
      value: string;
      color: string;
      subtext?: string;
    }
  | {
      type: 'FASTEST_LAP';
      lapTimeStr: string;
      lapNumber: number;
    }
  | null;

export interface DDUState {
  // Lifecycle & Profile State
  appState: AppState;
  pilotProfile: PilotProfile;
  isSimulatorConnected: boolean;
  calibrationProgress: number; // 0.0 .. 1.0
  lastFrameReceivedAt: number;

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
  
  // Pit State & Limiter (Fullscreen overlay when in pit lane)
  isInPitLane: boolean;
  pitLimiterActive: boolean;
  
  // Tyre Compound (Pirelli F1 official palette)
  tyreCompound: TyreCompound;

  // Macro-sectors (S1, S2, S3 under tyres, using microsector color rules)
  macroSectors: [MicrosectorStatus, MicrosectorStatus, MicrosectorStatus];
  
  // Timed Fullscreen Overlays (1 second duration, interruptible)
  timedOverlay: TimedFullscreenOverlay;
  
  // Microsectors bar (20 segments, 5% of height)
  microsectors: Microsector[];
  bestLapTimeMs: number;
  bestLapTimeStr: string;
  
  // Event & Notification state
  lastCompletedLap: LapCompletedEvent | null;
  showLapBanner: boolean;
  dismissLapBanner: () => void;
  
  // Mock Engine Controls
  isMockActive: boolean;
  mockScenario: MockScenario;
  
  // Actions
  setAppState: (state: AppState) => void;
  setPilotProfile: (profile: PilotProfile) => void;
  setSimulatorConnected: (connected: boolean) => void;
  setCalibrationProgress: (progress: number) => void;
  startCalibration: () => void;
  updateTelemetry: (frame: TelemetryFrame) => void;
  triggerLapCompleted: (event: LapCompletedEvent) => void;
  setConnectionStatus: (connected: boolean, latencyMs?: number) => void;
  setFps: (fps: number) => void;
  toggleSpeedUnit: () => void;
  toggleTempUnit: () => void;
  setLayoutMode: (mode: DDULayoutMode) => void;
  setChassisValue: <K extends keyof ChassisSettings>(key: K, value: ChassisSettings[K]) => void;
  setPitLimiter: (active: boolean) => void;
  setIsInPitLane: (inPit: boolean) => void;
  setTyreCompound: (compound: TyreCompound) => void;
  setMacroSector: (index: 0 | 1 | 2, status: MicrosectorStatus) => void;
  setMockActive: (active: boolean) => void;
  setMockScenario: (scenario: MockScenario) => void;
  showTimedOverlay: (overlay: TimedFullscreenOverlay, durationMs?: number) => void;
  dismissTimedOverlay: () => void;
  updateMicrosector: (index: number, status: MicrosectorStatus, deltaMs?: number) => void;
  resetMicrosectors: () => void;
}
