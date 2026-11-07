import { create } from 'zustand';
import {
  AppState,
  ChassisSettings,
  DDUState,
  FuelTelemetry,
  Microsector,
  MicrosectorStatus,
  MockScenario,
  PilotProfile,
  TimedFullscreenOverlay,
} from '../types/ddu';
import { LapCompletedEvent, TelemetryFrame } from '../types/telemetry';

const INITIAL_TELEMETRY: TelemetryFrame = {
  type: 'FRAME',
  timestamp: 0,
  car: {
    speedKmh: 0,
    rpms: 0,
    maxRpm: 13000,
    gear: 0,
    throttle: 0.0,
    brake: 0.0,
    clutch: 1.0,
    steer: 0.0,
    drsAvailable: false,
    drsEnabled: false,
    tc: 2,
    abs: 3,
    brakeBias: 58.5,
    pitLimiterOn: false,
    isInPitLane: false,
  },
  tyres: {
    pressurePsi: [27.0, 27.0, 27.0, 27.0],
    tempCoreC: [75.0, 75.0, 75.0, 75.0],
    wear: [100.0, 100.0, 100.0, 100.0],
    tempBrakesC: [350, 350, 350, 350],
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
      lat: 0.0,
      lon: 0.0,
      vert: 0.0,
    },
    worldPos: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },
  },
  session: {
    flag: 'GREEN',
    position: 1,
    track: '',
    carModel: '',
    fuel: 45.0,
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

const INITIAL_PILOT: PilotProfile = {
  name: 'Invitado',
  alias: 'INVITADO',
  isGuest: true,
};

// Generar 20 microsectores en la pista (S1: 0..6, S2: 7..13, S3: 14..19)
const createInitialMicrosectors = (): Microsector[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    status: (i === 0 ? 'active' : 'upcoming') as MicrosectorStatus,
    macroSector: (i < 7 ? 1 : i < 14 ? 2 : 3) as (1 | 2 | 3),
  }));
};

let timedOverlayTimer: number | null = null;

export const useTelemetryStore = create<DDUState>((set, get) => ({
  appState: 'STANDBY',
  pilotProfile: INITIAL_PILOT,
  isSimulatorConnected: false,
  calibrationProgress: 0,
  lastFrameReceivedAt: 0,

  telemetry: INITIAL_TELEMETRY,
  chassis: INITIAL_CHASSIS,
  fuel: INITIAL_FUEL,
  brakes: {
    tempDiscsC: [350, 350, 350, 350],
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
  macroSectors: ['active', 'upcoming', 'upcoming'],
  timedOverlay: null,
  microsectors: createInitialMicrosectors(),

  bestLapTimeMs: 0,
  bestLapTimeStr: '--:--.---',

  lastCompletedLap: null,
  showLapBanner: false,
  dismissLapBanner: () => set({ showLapBanner: false }),

  isMockActive: false, // Por defecto conecta directamente al backend de telemetria en vivo
  mockScenario: 'RACE_STINT',

  setAppState: (appState: AppState) => {
    set({ appState });
  },

  setPilotProfile: (pilotProfile: PilotProfile) => {
    set({ pilotProfile });
  },

  setSimulatorConnected: (isSimulatorConnected: boolean) => {
    set({ isSimulatorConnected });
  },

  setCalibrationProgress: (calibrationProgress: number) => {
    set({ calibrationProgress });
  },

  startCalibration: () => {
    const current = get().appState;
    if (current === 'CALIBRATING' || current === 'ON_SESSION') return;
    set({
      appState: 'CALIBRATING',
      calibrationProgress: 0,
    });
  },

  updateTelemetry: (frame: TelemetryFrame) => {
    const prevState = get();

    // Detectar si el cuadro corresponde a una sesión activa en pista
    const hasValidSession =
      Boolean(frame.session.track && frame.session.track.trim() !== '' && !frame.session.track.toLowerCase().includes('desconocido')) ||
      frame.car.rpms > 0 ||
      frame.car.speedKmh > 0 ||
      prevState.isMockActive;

    if (prevState.appState === 'STANDBY' && hasValidSession) {
      prevState.startCalibration();
    }

    set((state) => {
      // 1. Detección robusta de reinicio o cambio de contexto de sesión
      const prevTrack = (state.telemetry.session.track || '').trim().toLowerCase();
      const nextTrack = (frame.session.track || '').trim().toLowerCase();
      const trackChanged = Boolean(prevTrack && nextTrack && prevTrack !== nextTrack);

      const prevCar = (state.telemetry.session.carModel || '').trim().toLowerCase();
      const nextCar = (frame.session.carModel || '').trim().toLowerCase();
      const carChanged = Boolean(prevCar && nextCar && prevCar !== nextCar);

      const lapDecreased = frame.timing.currentLap < state.telemetry.timing.currentLap;
      const sessionReset = trackChanged || carChanged || lapDecreased;

      // Vuelta inicial en curso sin récord previo oficial de esta sesión
      const onInitialLapWithoutBest =
        frame.timing.currentLap <= 1 &&
        (!frame.timing.bestTimeMs || frame.timing.bestTimeMs <= 0);

      let currentBestMs = 0;
      let currentBestStr = '--:--.---';

      if (!sessionReset) {
        if (frame.timing.bestTimeMs && frame.timing.bestTimeMs > 0) {
          currentBestMs = frame.timing.bestTimeMs;
          currentBestStr =
            frame.timing.bestTimeStr && frame.timing.bestTimeStr !== '-:--:---'
              ? frame.timing.bestTimeStr
              : '--:--.---';
        } else if (!onInitialLapWithoutBest && state.bestLapTimeMs > 0) {
          currentBestMs = state.bestLapTimeMs;
          currentBestStr = state.bestLapTimeStr;
        }
      }

      // Normalizar la representación de cadenas de tiempo para evitar "-:--:---"
      const bestDisplayStr = (currentBestMs > 0 && currentBestStr !== '--:--.---' && currentBestStr !== '-:--:---')
        ? currentBestStr
        : (frame.timing.bestTimeStr && frame.timing.bestTimeStr !== '-:--:---' && frame.timing.bestTimeStr !== '--:--.---')
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
        const parsedTc = Math.round(frame.car.tc);
        if (parsedTc !== state.chassis.tc) {
          nextChassis.tc = parsedTc;
          tcChanged = true;
        }
      }

      if (frame.car.abs !== undefined) {
        const parsedAbs = Math.round(frame.car.abs);
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

      // Si el cambio proviene del simulador en vivo y ya estamos en sesión, disparar el overlay temporal correspondiente
      if (state.appState === 'ON_SESSION' && state.isConnected && state.telemetry.timestamp > 0) {
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

      for (let i = 0; i < currentMicroIdx; i++) {
        if (copy[i].status === 'upcoming' || copy[i].status === 'active') {
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

      // 8. Lógica Oficial de los 3 Sectores de Circuito (S1, S2, S3)
      let nextMacroSectors = [...state.macroSectors] as [MicrosectorStatus, MicrosectorStatus, MicrosectorStatus];

      if (currentLap !== previousLap && currentLap > 0) {
        nextMacroSectors = ['active', 'upcoming', 'upcoming'];
      } else {
        if (sector === 1) {
          nextMacroSectors[0] = 'active';
          nextMacroSectors[1] = 'upcoming';
          nextMacroSectors[2] = 'upcoming';
        } else if (sector === 2) {
          if (nextMacroSectors[0] === 'active' || nextMacroSectors[0] === 'upcoming') {
            nextMacroSectors[0] = deltaMs <= 0 ? 'purple' : 'yellow';
          }
          nextMacroSectors[1] = 'active';
          nextMacroSectors[2] = 'upcoming';
        } else if (sector === 3) {
          if (nextMacroSectors[1] === 'active' || nextMacroSectors[1] === 'upcoming') {
            nextMacroSectors[1] = deltaMs <= 0 ? 'purple' : 'yellow';
          }
          nextMacroSectors[2] = 'active';
        }
      }

      return {
        lastFrameReceivedAt: Date.now(),
        isSimulatorConnected: hasValidSession,
        telemetry: nextTelemetry,
        chassis: nextChassis,
        isInPitLane: nextInPit,
        pitLimiterActive: nextPitLimiter,
        brakes: nextBrakes,
        fuel: nextFuel,
        tyreCompound: nextCompound,
        microsectors: nextMicrosectors,
        macroSectors: nextMacroSectors,
        lastCompletedLap: sessionReset ? null : state.lastCompletedLap,
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
    set({
      isMockActive: active,
      bestLapTimeMs: active ? get().bestLapTimeMs : 0,
      bestLapTimeStr: active ? get().bestLapTimeStr : '--:--.---',
      lastCompletedLap: active ? get().lastCompletedLap : null,
    });
    if (active) {
      get().startCalibration();
    } else {
      set({ appState: 'STANDBY', isSimulatorConnected: false });
    }
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
