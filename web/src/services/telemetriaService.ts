import { apiClient } from '@/lib/apiClient';
import type { MuestraTelemetria } from '@/types/telemetria';

/**
 * Servicio para consultar las muestras de telemetría de una vuelta grabada.
 */
export const telemetriaService = {
  /**
   * Obtiene la serie temporal/espacial completa de muestras de telemetría para una vuelta.
   */
  async obtenerTelemetriaPorVuelta(lapId: string): Promise<MuestraTelemetria[]> {
    const respuesta = await apiClient.get<MuestraTelemetria[]>(`/api/laps/${lapId}/telemetry`);
    return respuesta.data;
  },
};
