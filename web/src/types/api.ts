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
  estaConectado: boolean;
  modoMock: boolean;
  circuito: string;
  modeloVehiculo: string;
  longitudPistaMetros: number;
  autosActivos: number;

  // Propiedades serializadas con JsonPropertyName en C#
  isConnected?: boolean;
  isMockMode?: boolean;
  circuit?: string;
  carModel?: string;
  trackLengthMeters?: number;
  activeCars?: number;

  // Perfil del piloto activo
  pilotName?: string;
  pilotAlias?: string;
  isGuest?: boolean;
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
  circuito: string;
  configuracionCircuito: string;
  modeloVehiculo: string;
  tipoSesion: TipoSesion;
  esSimulacionMock: boolean;
  fechaInicio: string; // ISO 8601 UTC
  fechaFin: string; // ISO 8601 UTC
  totalVueltas: number;
  mejorTiempoMs: number;
}

/** Metadatos de vuelta registrada */
export interface VueltaDto {
  id: string; // Guid
  numeroVuelta: number;
  tiempoVueltaMs: number;
  tiempoVueltaTexto: string; // "mm:ss.fff"
  sector1Ms: number;
  sector2Ms: number;
  sector3Ms: number;
  esValida: boolean;
  esMejorVuelta: boolean;
}

/** Conmutador de modo Mock en desarrollo */
export interface EstadoMockDto {
  modoMockActivo: boolean;
  mensaje: string;
}
