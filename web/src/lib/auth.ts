import type { PerfilUsuario, SesionAuth } from "@/types/usuario";

const CLAVE_ALMACENAMIENTO_AUTH = "apexlink_auth_sesion";

export const PILOTO_INVITADO_FAPPE: PerfilUsuario = {
  id: "fappe-guest-2026",
  nombre: "Piloto Invitado FAPPE",
  alias: "APEX-INVITADO",
  email: "invitado@fappe2026.edu.ar",
  esInvitadoFappe: true,
  rating: {
    paceRating: 2180,
    safetyRating: "S",
    nivel: "Alien GT3",
    metricas: {
      velocidad: 92,
      consistencia: 88,
      frenada: 95,
      control: 90,
      agresividad: 84,
    },
  },
  vueltasTotales: 142,
  kilometrosTotales: 822.7,
  logros: [
    {
      id: "monza-sub-82",
      titulo: "Muro de la Velocidad",
      descripcion: "Vuelta por debajo de 01:22.000 en el Autodromo Nazionale Monza",
      icono: "zap",
      desbloqueado: true,
      fechaDesbloqueo: "2026-10-26",
    },
    {
      id: "telemetria-pro",
      titulo: "Ingeniero en Cabina",
      descripcion: "Completaste 50 vueltas con telemetría en tiempo real a 60 Hz",
      icono: "gauge",
      desbloqueado: true,
      fechaDesbloqueo: "2026-10-28",
    },
    {
      id: "fappe-showcase",
      titulo: "Piloto Oficial FAPPE 2026",
      descripcion: "Conducción en vivo en el stand de innovación tecnológica",
      icono: "award",
      desbloqueado: true,
      fechaDesbloqueo: "2026-10-31",
    },
  ],
};

/**
 * Obtiene la sesión activa desde el almacenamiento local
 */
export function obtenerSesionLocal(): SesionAuth | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CLAVE_ALMACENAMIENTO_AUTH);
    if (!raw) return null;
    return JSON.parse(raw) as SesionAuth;
  } catch {
    return null;
  }
}

/**
 * Guarda la sesión activa en el almacenamiento local
 */
export function guardarSesionLocal(sesion: SesionAuth): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CLAVE_ALMACENAMIENTO_AUTH, JSON.stringify(sesion));
}

/**
 * Inicia sesión automática con 1-clic con el perfil oficial de demostración FAPPE
 */
export function iniciarSesionInvitado(): SesionAuth {
  const sesion: SesionAuth = {
    token: "token-fappe-invitado-2026",
    usuario: PILOTO_INVITADO_FAPPE,
    expiraEn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  guardarSesionLocal(sesion);
  return sesion;
}

/**
 * Inicia sesión clásica por credenciales
 */
export function iniciarSesionCredenciales(
  email: string,
  alias: string
): SesionAuth {
  const sesion: SesionAuth = {
    token: `token-${Date.now()}`,
    usuario: {
      id: `usr-${Date.now()}`,
      nombre: alias || "Piloto Registrado",
      alias: alias.toUpperCase() || "PILOTO",
      email: email,
      esInvitadoFappe: false,
      rating: {
        paceRating: 1650,
        safetyRating: "B",
        nivel: "Semi-Pro",
        metricas: {
          velocidad: 74,
          consistencia: 70,
          frenada: 78,
          control: 72,
          agresividad: 68,
        },
      },
      vueltasTotales: 12,
      kilometrosTotales: 69.5,
      logros: [PILOTO_INVITADO_FAPPE.logros[0]!],
    },
    expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  guardarSesionLocal(sesion);
  return sesion;
}

/**
 * Elimina la sesión activa
 */
export function cerrarSesion(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CLAVE_ALMACENAMIENTO_AUTH);
}

/**
 * Comprueba si hay una sesión válida
 */
export function estaAutenticado(): boolean {
  return obtenerSesionLocal() !== null;
}
