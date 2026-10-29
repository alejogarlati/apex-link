/**
 * ApexLink Telemetry Contracts (1:1 with Backend Relay & CONTRATOS_TELEMETRIA_Y_API.md)
 */

export interface GForce {
  lat: number;
  lon: number;
  vert: number;
}

export interface WorldPosition {
  x: number;
  y: number;
  z: number;
}

export interface CarTelemetry {
  speedKmh: number;
  rpms: number;
  maxRpm: number;
  gear: number; // -1 = R, 0 = N, 1..8 = 1st to 8th
  throttle: number; // 0.0 .. 1.0
  brake: number; // 0.0 .. 1.0
  steer: number; // -1.0 .. 1.0
  drsAvailable: boolean;
  drsEnabled: boolean;
}

export interface TyresTelemetry {
  pressurePsi: [number, number, number, number]; // [FL, FR, RL, RR]
  tempCoreC: [number, number, number, number]; // [FL, FR, RL, RR]
  wear: [number, number, number, number]; // [FL, FR, RL, RR] percentage 0..100%
}

export interface TimingTelemetry {
  lapTimeMs: number;
  lapTimeStr: string; // "mm:ss.fff"
  bestTimeMs: number;
  bestTimeStr: string; // "mm:ss.fff" or "--:--.---"
  deltaMs: number; // negative = faster (green), positive = slower (red)
  currentLap: number;
  sector: number; // 1, 2, 3
  lapProgress: number; // 0.0 .. 1.0
}

export interface DynamicsTelemetry {
  gForce: GForce;
  worldPos: WorldPosition;
}

export interface SessionTelemetry {
  flag: 'GREEN' | 'YELLOW' | 'BLUE' | 'BLACK' | 'WHITE' | 'CHECKERED' | 'PENALTY';
  position: number;
  track: string;
  carModel: string;
}

export interface TelemetryFrame {
  type: 'FRAME';
  timestamp: number;
  car: CarTelemetry;
  tyres: TyresTelemetry;
  timing: TimingTelemetry;
  dynamics: DynamicsTelemetry;
  session: SessionTelemetry;
}

export interface LapCompletedEvent {
  type: 'LAP_COMPLETED';
  lapNumber: number;
  lapTimeMs: number;
  lapTimeStr: string;
  isPersonalBest: boolean;
  isValidLap: boolean;
  sectors: [number, number, number];
  telemetrySamplesCount: number;
  sessionLapId: string;
}

export type TelemetrySocketMessage = TelemetryFrame | LapCompletedEvent;
