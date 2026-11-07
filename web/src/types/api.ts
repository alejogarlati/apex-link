/**
 * Contratos de API REST — Sincronizados 1:1 con C# ASP.NET Core Kestrel (Dev 1)
 * Fuente: CONTRATOS_TELEMETRIA_Y_API.md
 */

/** Contenedor genérico unificado de respuesta HTTP */
export interface RespuestaApi<T> {
  exitoso: boolean;
  mensaje: string;
  datos: T;
  errores: string[];
}

/** Paginación estándar para colecciones de datos */
export interface PaginacionRespuesta<T> {
  elementos: T[];
  paginaActual: number;
  tamanioPagina: number;
  totalRegistros: number;
  totalPaginas: number;
  tienePaginaSiguiente: boolean;
  tienePaginaAnterior: boolean;
}

/** Estado de conexión y simulación del backend */
export interface EstadoServicioDto {
  isConnected: boolean;
  isMockMode: boolean;
  circuit: string;
  carModel: string;
  trackLengthMeters: number;
  activeCars: number;
  pilotName?: string;
  pilotAlias?: string;
  isGuest?: boolean;

  // Compatibilidad hacia atrás garantizada
  estaConectado: boolean;
  modoMock: boolean;
  circuito: string;
  modeloVehiculo: string;
  longitudPistaMetros: number;
  autosActivos: number;
  nombrePiloto?: string;
  aliasPiloto?: string;
  esInvitado?: boolean;
}

/** Tipo de sesión oficial */
export enum TipoSesion {
  Practica = 0,
  Clasificacion = 1,
  Carrera = 2,
}

/** Resumen de una tanda o sesión guardada */
export interface SesionResumenDto {
  id: string; // Guid
  circuit: string;
  trackConfig: string;
  carModel: string;
  sessionType: TipoSesion;
  isMockSimulation: boolean;
  startTime: string; // ISO 8601 UTC
  endTime: string | null; // ISO 8601 UTC
  totalLaps: number;
  bestLapTimeMs: number;

  // Aliases de compatibilidad opcional
  circuito?: string;
  configuracionCircuito?: string;
  modeloVehiculo?: string;
  tipoSesion?: TipoSesion;
  esSimulacionMock?: boolean;
  fechaInicio?: string;
  fechaFin?: string | null;
  totalVueltas?: number;
  mejorTiempoMs?: number;
}

/** Metadatos de vuelta registrada */
export interface VueltaDto {
  id: string; // Guid
  lapNumber: number;
  lapTimeMs: number;
  lapTimeStr: string; // "mm:ss.fff"
  sector1Ms: number;
  sector2Ms: number;
  sector3Ms: number;
  isValidLap: boolean;
  isBestLap: boolean;

  // Aliases de compatibilidad opcional
  numeroVuelta?: number;
  tiempoVueltaMs?: number;
  tiempoVueltaTexto?: string;
  esValida?: boolean;
  esMejorVuelta?: boolean;
}

/** Conmutador de modo Mock en desarrollo */
export interface EstadoMockDto {
  modoMockActivo: boolean;
  mensaje: string;
  isMockActive?: boolean;
  message?: string;
}

/** Metadatos de circuitos FAPPE */
export interface CircuitoDto {
  id: string;
  nombre: string;
  pais: string;
  codigoPais: string;
  longitudMetros: number;
  cantidadCurvas: number;
  recordVuelta: string;
  pilotoRecord: string;
  zonasDrsCount: number;
  esOficialFappe: boolean;
}

export interface CircuitoDetalleDto extends CircuitoDto {
  descripcion: string;
  variante: string;
  escala: number;
  xOffset: number;
  zOffset: number;
  archivoMapa: string;
}

/** Elemento del ranking / clasificación oficial */
export interface LeaderboardItemDto {
  posicion: number;
  piloto: string;
  alias: string;
  tiempo: string;
  tiempoMs: number;
  delta: string;
  auto: string;
  circuito: string;
  vueltas: number;
  esRecord: boolean;
}

/** Resumen de tanda recién finalizada pendiente de atribución al Torneo FAPPE */
export interface SesionFinalizadaTorneoDto {
  sesionId: string;
  circuito: string;
  modeloVehiculo: string;
  totalVueltas: number;
  vueltasValidas: number;
  mejorTiempoMs: number;
  mejorTiempoTexto: string;
  fechaFin: string;
}

/** Evaluación completa del rendimiento del piloto generada por el motor analítico */
export interface EvaluacionRendimientoApiDto {
  id: string;
  usuarioId: string;
  sesionId?: string;
  velocidad: number;
  consistencia: number;
  frenada: number;
  control: number;
  agresividad: number;
  trailBraking: number;
  traccionSalida: number;
  velocidadApice: number;
  respetoLimites: number;
  puntoFuerteTitulo: string;
  puntoFuerteDesc: string;
  oportunidadMejoraTitulo: string;
  oportunidadMejoraDesc: string;
  consejoFrenada: string;
  consejoTraccion: string;
  consejoApice: string;
  consejoConsistencia: string;
  consejoLimites: string;
  fechaCreacion: string;
}

/** Detalle completo de perfil de piloto */
export interface PerfilPilotoDetalleApiDto {
  usuarioId: string;
  nombre: string;
  alias: string;
  email: string;
  rol?: string;
  licencia: string;
  nacionalidad: string;
  codigoPais: string;
  vehiculoPrincipal: string;
  simuladorPrincipal: string;
  paceRating: number;
  safetyRating: string;
  nivel: string;
  puntajeGeneral: number;
  vueltasTotales: number;
  kilometrosTotales: number;
  porcentajeVueltasValidas?: number;
  velocidadMaximaKmh?: number;
  ultimaEvaluacion?: EvaluacionRendimientoApiDto;
  logros: Array<{
    id: string;
    titulo: string;
    descripcion: string;
    icono: string;
    desbloqueado: boolean;
    fechaDesbloqueo?: string;
  }>;
  records: Array<{
    id: string;
    circuito: string;
    pais: string;
    tiempo: string;
    esRecordSesion: boolean;
  }>;
}

export interface GenerarEvaluacionApiRequest {
  sesionId: string;
  usuarioId?: string;
}

export interface ActualizarRatingApiRequest {
  paceRating: number;
  safetyRating: string;
  puntajeGeneral: number;
  vueltasSumar?: number;
  kmSumar?: number;
}

export interface LoginApiRequest {
  email: string;
  password: string;
}

export interface RegistroApiRequest {
  nombre: string;
  alias: string;
  email: string;
  password: string;
  nacionalidad?: string;
  codigoPais?: string;
}

export interface LoginRespuestaApiDto {
  token: string;
  expiraEn: string;
  usuario: PerfilPilotoDetalleApiDto;
}
