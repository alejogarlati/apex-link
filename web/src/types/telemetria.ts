/**
 * Contratos de Telemetría en Tiempo Real y Post-Sesión
 * Sincronizados 1:1 con CONTRATOS_TELEMETRIA_Y_API.md
 */

/** Cinemática y controles del monoplaza en tiempo real */
export interface TelemetriaAuto {
  speedKmh: number;
  rpms: number;
  maxRpm: number;
  gear: number; // -1 = R, 0 = N, 1..8
  throttle: number; // 0.0 .. 1.0
  brake: number; // 0.0 .. 1.0
  steer: number; // -1.0 .. 1.0
  drsAvailable: boolean;
  drsEnabled: boolean;
}

/** Dinámica y temperatura de neumáticos (Orden: [0]=FL, [1]=FR, [2]=RL, [3]=RR) */
export interface TelemetriaNeumaticos {
  pressurePsi: [number, number, number, number];
  tempCoreC: [number, number, number, number];
  wear: [number, number, number, number];
}

/** Cronometraje y sectores de vuelta en curso */
export interface TelemetriaCronometraje {
  lapTimeMs: number;
  lapTimeStr: string; // "mm:ss.fff"
  bestTimeMs: number;
  bestTimeStr: string;
  deltaMs: number; // < 0 más rápido (verde), > 0 más lento (rojo)
  currentLap: number;
  sector: number; // 1, 2 o 3
  lapProgress: number; // 0.0 .. 1.0
}

/** Fuerzas G y posición cartesiana tridimensional */
export interface TelemetriaDinamicas {
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
}

/** Estado de sesión e identificación de pista */
export interface TelemetriaSesionEnVivo {
  flag: "GREEN" | "YELLOW" | "BLUE" | "BLACK" | "WHITE" | "CHECKERED" | "PENALTY";
  position: number;
  track: string;
  carModel: string;
}

/** Trama WebSocket continua a 60 Hz */
export interface TelemetryFrame {
  type: "FRAME";
  timestamp: number;
  car: TelemetriaAuto;
  tyres: TelemetriaNeumaticos;
  timing: TelemetriaCronometraje;
  dynamics: TelemetriaDinamicas;
  session: TelemetriaSesionEnVivo;
}

/** Evento WebSocket despachado al cruzar meta */
export interface LapCompletedEvent {
  type: "LAP_COMPLETED";
  lapNumber: number;
  lapTimeMs: number;
  lapTimeStr: string;
  isPersonalBest: boolean;
  isValidLap: boolean;
  sectors: [number, number, number];
  telemetrySamplesCount: number;
  sessionLapId: string; // Guid para consulta REST inmediata
}

/** Mensaje discriminado del WebSocket */
export type MensajeWebSocketTelemetria = TelemetryFrame | LapCompletedEvent;

/** Muestra densa de telemetría por vuelta (Dominio de Distancia: 0 a L_pista) */
export interface MuestraTelemetriaDto {
  distanciaPistaMetros: number;
  velocidadKmh: number;
  acelerador: number; // 0.0 a 1.0
  freno: number; // 0.0 a 1.0
  marcha: number;
  rpms: number;
  fuerzaGLat: number;
  fuerzaGLon: number;
  posicionX: number;
  posicionY: number;
  posicionZ: number;
}

/** Modelo enriquecido para renderizado visual en gráficos y Canvas 2D */
export interface MuestraTelemetria {
  timestamp: number;
  distanciaMetros: number;
  velocidadKmh: number;
  rpms: number;
  marcha: number;
  acelerador: number; // 0.0 a 1.0
  freno: number; // 0.0 a 1.0
  direccion: number; // -1.0 a 1.0
  posicionMundo: {
    x: number;
    y: number;
    z: number;
  };
  gForce: {
    lat: number;
    lon: number;
  };
}

/** Resumen de vuelta en catálogo */
export interface ResumenVuelta {
  id: string;
  numeroVuelta: number;
  tiempoVueltaMs: number;
  tiempoVueltaStr: string; // "mm:ss.fff"
  esMejorVuelta: boolean;
  esVueltaValida: boolean;
  sectoresMs: number[];
  totalMuestras: number;
}

/** Punto interpolado para superposición comparativa de dos vueltas */
export interface PuntoComparativoDto {
  distanciaPistaMetros: number;
  velocidadBaseKmh: number;
  velocidadComparadaKmh: number;
  deltaVelocidadKmh: number;
  aceleradorBase: number;
  aceleradorComparada: number;
  frenoBase: number;
  frenoComparada: number;
  deltaTiempoAcumuladoMs: number;
}

/** Resultado analítico de comparativa de dos vueltas con interpolación trapezoidal */
export interface ComparativaVueltasDto {
  vueltaBaseId: string;
  vueltaComparadaId: string;
  totalMuestrasBase: number;
  totalMuestrasComparada: number;
  puntosComparados: PuntoComparativoDto[];
}
