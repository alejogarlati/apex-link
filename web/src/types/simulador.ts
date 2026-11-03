/**
 * Tipos de Simuladores, Circuitos y Vehículos en el Hub
 */

export type IdSimulador = "assetto-corsa" | "acc" | "iracing" | "f1-24";

export interface SimuladorInfo {
  id: IdSimulador;
  nombre: string;
  categoria: string;
  descripcion: string;
  activo: boolean; // Solo Assetto Corsa activo para FAPPE 2026
  estadoTexto: string;
  icono: string;
  puertoDefault: number;
}

export interface CircuitoCatalogo {
  id: string;
  nombre: string;
  pais: string;
  longitudMetros: number;
  curvasTotal: number;
  recordVueltaTexto: string;
  pilotoRecord: string;
  activo: boolean;
}

export interface VehiculoCatalogo {
  id: string;
  nombre: string;
  clase: string;
  maxRpm: number;
  potenciaCv: number;
  pesoKg: number;
  traccion: string;
}
