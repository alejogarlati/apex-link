import { apiClient } from '@/lib/apiClient';
import type { SesionResumen, EstadoServidor } from '@/types/sesiones';
import type { ResumenVuelta } from '@/types/telemetria';

/**
 * Servicio para consultar el estado del servidor y el historial de sesiones.
 */
export const sesionesService = {
  /**
   * Obtiene el estado actual de la conexión y simulador.
   */
  async obtenerEstado(): Promise<EstadoServidor> {
    const respuesta = await apiClient.get<EstadoServidor>('/api/status');
    return respuesta.data;
  },

  /**
   * Obtiene la lista de todas las sesiones registradas.
   */
  async obtenerSesiones(): Promise<SesionResumen[]> {
    const respuesta = await apiClient.get<SesionResumen[]>('/api/sessions');
    return respuesta.data;
  },

  /**
   * Obtiene las vueltas pertenecientes a una sesión específica.
   */
  async obtenerVueltasPorSesion(sesionId: string): Promise<ResumenVuelta[]> {
    const respuesta = await apiClient.get<ResumenVuelta[]>(`/api/sessions/${sesionId}/laps`);
    return respuesta.data;
  },
};
