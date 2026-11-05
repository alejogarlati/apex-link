/**
 * Tipos de Usuario, Autenticación, Rating y Gamificación
 */

export interface MetricasRadar {
  velocidad: number; // 0 a 100
  consistencia: number; // 0 a 100
  frenada: number; // 0 a 100
  control: number; // 0 a 100
  agresividad: number; // 0 a 100
}

export interface ApexRating {
  paceRating: number; // ej. 1850 (Rango 0 - 3000)
  safetyRating: string; // ej. "A", "B", "C", "S"
  nivel: string; // "Semi-Pro", "Pro", "Alien"
  metricas: MetricasRadar;
}

export interface LogroGamificado {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  desbloqueado: boolean;
  fechaDesbloqueo?: string;
}

export interface HabilidadDetalle {
  id: string;
  nombre: string;
  etiquetaCorta: string;
  valor: number;
  descripcion: string;
  consejo: string;
}

export interface RecordCircuitoPiloto {
  id: string;
  circuito: string;
  pais: string;
  tiempo: string;
  esRecordSesion: boolean;
}

export interface DiagnosticoAiCoach {
  puntoFuerteTitulo: string;
  puntoFuerteDesc: string;
  oportunidadMejoraTitulo: string;
  oportunidadMejoraDesc: string;
}

export interface PerfilUsuario {
  id: string;
  nombre: string;
  alias: string;
  email: string;
  avatarUrl?: string;
  esInvitadoFappe: boolean;
  licencia: string;
  nacionalidad: string;
  codigoPais: string;
  vehiculoPrincipal: string;
  simulador: string;
  puntajeGeneral: number; // 0..100
  rating: ApexRating;
  vueltasTotales: number;
  kilometrosTotales: number;
  logros: LogroGamificado[];
  habilidades: HabilidadDetalle[];
  records: RecordCircuitoPiloto[];
  diagnosticoAi: DiagnosticoAiCoach;
}

export interface SesionAuth {
  token: string;
  usuario: PerfilUsuario;
  expiraEn: string;
}
