/**
 * Información resumida de una sesión de simulación guardada.
 */
export interface SesionResumen {
  id: string;
  fecha: string;
  circuito: string;
  modeloAuto: string;
  totalVueltas: number;
  mejorTiempoVueltaStr: string;
}

/**
 * Estado general de conectividad del servidor de telemetría.
 */
export interface EstadoServidor {
  connected: boolean;
  game: string;
  track: string;
  isMock: boolean;
}
