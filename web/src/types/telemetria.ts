/**
 * Contratos de Telemetría en Tiempo Real y Post-Sesión
 * Sincronizados 1:1 con CONTRATOS_TELEMETRIA_Y_API.md y C# ASP.NET Core Kestrel
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

/** Muestra densa de telemetría por vuelta (Dominio de Distancia: 0 a L_pista) — Formato REST C# */
export interface MuestraTelemetriaDto {
  distanceMeters: number;
  speedKmh: number;
  throttle: number; // 0.0 a 1.0
  brake: number; // 0.0 a 1.0
  gear: number;
  rpm: number;
  gLat: number;
  gLon: number;
  worldPositionX: number;
  worldPositionY: number;
  worldPositionZ: number;

  // Aliases de compatibilidad opcional
  distanciaPistaMetros?: number;
  velocidadKmh?: number;
  acelerador?: number;
  freno?: number;
  marcha?: number;
  rpms?: number;
  fuerzaGLat?: number;
  fuerzaGLon?: number;
  posicionX?: number;
  posicionY?: number;
  posicionZ?: number;
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

/** Convierte una muestra cruda de la API REST al formato del renderizador gráfico */
export function mapearMuestraDtoAMuestra(dto: MuestraTelemetriaDto, indice = 0): MuestraTelemetria {
  const distancia = dto.distanceMeters ?? dto.distanciaPistaMetros ?? 0;
  const velocidad = dto.speedKmh ?? dto.velocidadKmh ?? 0;
  const acel = dto.throttle ?? dto.acelerador ?? 0;
  const fren = dto.brake ?? dto.freno ?? 0;
  const march = dto.gear ?? dto.marcha ?? 0;
  const revoluciones = dto.rpm ?? dto.rpms ?? 0;
  const lat = dto.gLat ?? dto.fuerzaGLat ?? 0;
  const lon = dto.gLon ?? dto.fuerzaGLon ?? 0;
  const x = dto.worldPositionX ?? dto.posicionX ?? 0;
  const y = dto.worldPositionY ?? dto.posicionY ?? 12;
  const z = dto.worldPositionZ ?? dto.posicionZ ?? 0;

  return {
    timestamp: indice * 16.666,
    distanciaMetros: distancia,
    velocidadKmh: velocidad,
    rpms: revoluciones,
    marcha: march,
    acelerador: acel,
    freno: fren,
    direccion: 0,
    posicionMundo: { x, y, z },
    gForce: { lat, lon },
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
  distanceMeters: number;
  baseSpeedKmh: number;
  comparedSpeedKmh: number;
  deltaSpeedKmh: number;
  baseThrottle: number;
  comparedThrottle: number;
  baseBrake: number;
  comparedBrake: number;
  accumulatedDeltaTimeMs: number;

  // Aliases de compatibilidad opcional
  distanciaPistaMetros?: number;
  velocidadBaseKmh?: number;
  velocidadComparadaKmh?: number;
  deltaVelocidadKmh?: number;
  aceleradorBase?: number;
  aceleradorComparada?: number;
  frenoBase?: number;
  frenoComparada?: number;
  deltaTiempoAcumuladoMs?: number;
}

/** Resultado analítico de comparativa de dos vueltas con interpolación trapezoidal */
export interface ComparativaVueltasDto {
  baseLapId: string;
  comparedLapId: string;
  baseLapSamplesCount: number;
  comparedLapSamplesCount: number;
  points: PuntoComparativoDto[];

  // Aliases de compatibilidad opcional
  vueltaBaseId?: string;
  vueltaComparadaId?: string;
  totalMuestrasBase?: number;
  totalMuestrasComparada?: number;
  puntosComparados?: PuntoComparativoDto[];
}
