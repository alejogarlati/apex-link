export interface TelemetryFrame {
  type: 'FRAME';
  timestamp: number;
  car: {
    speedKmh: number;
    rpms: number;
    maxRpm: number;
    gear: number;
    throttle: number;
    brake: number;
    steer: number;
    drsAvailable: boolean;
    drsEnabled: boolean;
  };
  tyres: {
    pressurePsi: [number, number, number, number];
    tempCoreC: [number, number, number, number];
    wear: [number, number, number, number];
  };
  timing: {
    lapTimeMs: number;
    lapTimeStr: string;
    bestTimeMs: number;
    bestTimeStr: string;
    deltaMs: number;
    currentLap: number;
    sector: number;
    lapProgress: number;
  };
  dynamics: {
    gForce: {
      lat: number;
      lon: number;
      vert: number;
    };
    worldPos: {
      x: number;
      y: number;
      z: number;
    };
  };
  session: {
    flag: 'GREEN' | 'YELLOW' | 'BLUE' | 'RED' | 'CHEQUERED';
    position: number;
    track: string;
    carModel: string;
  };
}
