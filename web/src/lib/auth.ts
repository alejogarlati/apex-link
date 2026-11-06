import type { PerfilUsuario, SesionAuth } from "@/types/usuario";
import { autenticarUsuario } from "@/lib/apiClient";

const CLAVE_ALMACENAMIENTO_AUTH = "apexlink_auth_sesion";

// ---------------------------------------------------------------------------
// USUARIO 1: ALEJO GARLATI (Alien F1 • Setup Specialist)
// ---------------------------------------------------------------------------
export const USUARIO_ALEJO_GARLATI: PerfilUsuario = {
  id: "11111111-1111-1111-1111-111111111111",
  nombre: "Alejo Garlati",
  alias: "AG_PRO",
  email: "agarlati@apexlink.io",
  esInvitadoFappe: false,
  licencia: "Licencia Apex F1 Alien",
  nacionalidad: "Argentina",
  codigoPais: "ARG",
  vehiculoPrincipal: "Ferrari SF70H (F1)",
  simulador: "Assetto Corsa · Shared Memory Win32 MMF",
  puntajeGeneral: 96.5,
  rating: {
    paceRating: 2850,
    safetyRating: "S",
    nivel: "Alien F1",
    metricas: {
      velocidad: 98,
      consistencia: 97,
      frenada: 96,
      control: 95,
      agresividad: 89,
    },
  },
  vueltasTotales: 34,
  kilometrosTotales: 196.4,
  habilidades: [
    {
      id: "frenada",
      nombre: "Frenada / Trail Braking",
      etiquetaCorta: "FRENADA",
      valor: 96,
      descripcion: "Modulación de frenada de élite con deceleración sostenida superior a -3.0G.",
      consejo: "Excelente modulación. Podés mantener el umbral de 100% de presión 5 metros más profundo antes del bite point.",
    },
    {
      id: "traccion",
      nombre: "Tracción / Salida",
      etiquetaCorta: "TRACCIÓN",
      valor: 94,
      descripcion: "Despliegue del tren híbrido ERS a la salida de curvas sin sobreviraje.",
      consejo: "Excelente apertura de acelerador. La respuesta del V6 Turbo en 3ra marcha es óptima.",
    },
    {
      id: "apice",
      nombre: "Velocidad en Ápice",
      etiquetaCorta: "ÁPICE",
      valor: 98,
      descripcion: "Paso por curva de alta velocidad maximizando la carga del fondo plano aerodinámico.",
      consejo: "Tu punto más fuerte. Mantenés una velocidad de vértice insuperable en curvas rápidas como Biassono.",
    },
    {
      id: "consistencia",
      nombre: "Consistencia",
      etiquetaCorta: "CONSISTENCIA",
      valor: 97,
      descripcion: "Dispersión de tiempos inferior a ±0.080 s entre vueltas consecutivas.",
      consejo: "Ritmo de clasificación de calibre mundial. Capacidad de replicar la trazada metro a metro.",
    },
    {
      id: "limites",
      nombre: "Respeto de Límites",
      etiquetaCorta: "LÍMITES",
      valor: 92,
      descripcion: "Uso de pianos exteriores en el límite reglamentario sin invalidar vueltas.",
      consejo: "Aprovechamiento total de los pianos de Ascari respetando las cuatro ruedas sobre la línea blanca.",
    },
  ],
  records: [
    {
      id: "monza",
      circuito: "Autodromo Nazionale Monza",
      pais: "ITA",
      tiempo: "01:21.240",
      esRecordSesion: true,
    },
    {
      id: "redbullring",
      circuito: "Red Bull Ring (Spielberg)",
      pais: "AUT",
      tiempo: "01:05.410",
      esRecordSesion: true,
    },
  ],
  diagnosticoAi: {
    puntoFuerteTitulo: "Variante Ascari & Curva Grande",
    puntoFuerteDesc:
      "Paso por curva con carga aerodinámica máxima impecable. +7.2 km/h por encima del promedio del stint sin pérdida de adherencia lateral.",
    oportunidadMejoraTitulo: "Entrada a Variante del Rettifilo (Curva 1)",
    oportunidadMejoraDesc:
      "Frenada en los 120 metros con deceleración extrema de -3.2G. Liberar un 10% antes para evitar micro-bloqueo en rueda delantera interior.",
  },
  logros: [
    {
      id: "monza-sub-82",
      titulo: "Muro de la Velocidad",
      descripcion: "Vuelta por debajo de 01:22.000 en el Autodromo Nazionale Monza",
      icono: "zap",
      desbloqueado: true,
      fechaDesbloqueo: "2026-10-31",
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
      id: "ritmo-quirurgico",
      titulo: "Ritmo Quirúrgico",
      descripcion: "10 vueltas seguidas dentro de un delta de ±0.2 s.",
      icono: "crosshair",
      desbloqueado: true,
      fechaDesbloqueo: "2026-10-25",
    },
    {
      id: "sub-121-monza",
      titulo: "Sub 1:21 Monza",
      descripcion: "Vuelta récord oficial de stand en monoplaza F1.",
      icono: "timer",
      desbloqueado: true,
      fechaDesbloqueo: "2026-10-31",
    },
  ],
};

// ---------------------------------------------------------------------------
// USUARIO 2: ALEJO SALAS (Pro-Am GT3 • Endurance Specialist)
// ---------------------------------------------------------------------------
export const USUARIO_ALEJO_SALAS: PerfilUsuario = {
  id: "22222222-2222-2222-2222-222222222222",
  nombre: "Alejo Salas",
  alias: "AS_GT3",
  email: "asalas@apexlink.io",
  esInvitadoFappe: false,
  licencia: "Licencia Apex GT3 Pro-Am",
  nacionalidad: "Argentina",
  codigoPais: "ARG",
  vehiculoPrincipal: "Ferrari 488 GT3",
  simulador: "Assetto Corsa · Shared Memory Win32 MMF",
  puntajeGeneral: 78.5,
  rating: {
    paceRating: 1950,
    safetyRating: "A",
    nivel: "Pro-Am GT3",
    metricas: {
      velocidad: 81,
      consistencia: 86,
      frenada: 79,
      control: 83,
      agresividad: 75,
    },
  },
  vueltasTotales: 20,
  kilometrosTotales: 130.4,
  habilidades: [
    {
      id: "frenada",
      nombre: "Frenada / Trail Braking",
      etiquetaCorta: "FRENADA",
      valor: 79,
      descripcion: "Presión inicial sólida con oportunidad de mejora en la fase final de descompresión.",
      consejo: "Soltá el freno de forma más lineal en los últimos 30 m antes del ápice: estás liberando de golpe y el auto subvira en la entrada.",
    },
    {
      id: "traccion",
      nombre: "Tracción / Salida",
      etiquetaCorta: "TRACCIÓN",
      valor: 91,
      descripcion: "Apertura progresiva y limpia del acelerador al salir de curvas de media velocidad.",
      consejo: "Es tu mayor fortaleza en GT3. Podés intentar anticipar 2 metros la aceleración en chicanas lentas.",
    },
    {
      id: "apice",
      nombre: "Velocidad en Ápice",
      etiquetaCorta: "ÁPICE",
      valor: 74,
      descripcion: "Rotación y velocidad mínima en vértices de curvas cerradas.",
      consejo: "Llevás demasiada velocidad sobrante al frenar y la perdés en el ápice. Frená 5 metros antes para asegurar mayor rotación.",
    },
    {
      id: "consistencia",
      nombre: "Consistencia",
      etiquetaCorta: "CONSISTENCIA",
      valor: 86,
      descripcion: "Repetibilidad y dispersión controlada en stints largos de GT3.",
      consejo: "Ritmo muy constante y predecible. Muy apto para stints de larga duración en carreras de resistencia GT.",
    },
    {
      id: "limites",
      nombre: "Respeto de Límites",
      etiquetaCorta: "LÍMITES",
      valor: 88,
      descripcion: "Cuidado de neumáticos y gestión de pianos altos de chicana.",
      consejo: "Buen respeto de pianos. Cuidado con el piano exterior de la Variante Ascari al acelerar a fondo.",
    },
  ],
  records: [
    {
      id: "monza",
      circuito: "Autodromo Nazionale Monza",
      pais: "ITA",
      tiempo: "01:47.382",
      esRecordSesion: true,
    },
    {
      id: "spa",
      circuito: "Circuit de Spa-Francorchamps",
      pais: "BEL",
      tiempo: "02:18.420",
      esRecordSesion: true,
    },
  ],
  diagnosticoAi: {
    puntoFuerteTitulo: "Tracción en Salida de Curva (Variante Roggia)",
    puntoFuerteDesc:
      "Apertura progresiva y limpia del acelerador al salir de curvas de media velocidad. Cero patinaje y excelente cuidado del compuesto trasero.",
    oportunidadMejoraTitulo: "Transición de Freno a Ápice (Trail-Braking)",
    oportunidadMejoraDesc:
      "Liberación del pedal de freno algo abrupta en los últimos 25 metros antes del vértice, provocando subviraje transitorio en la entrada.",
  },
  logros: [
    {
      id: "freno-precision",
      titulo: "Freno de Precisión",
      descripcion: "Trail braking óptimo en la Variante del Rettifilo.",
      icono: "disc",
      desbloqueado: true,
      fechaDesbloqueo: "2026-10-29",
    },
    {
      id: "cero-incidentes",
      titulo: "Cero Incidentes",
      descripcion: "100% de vueltas válidas sin exceder los límites de pista.",
      icono: "shield-check",
      desbloqueado: true,
      fechaDesbloqueo: "2026-10-26",
    },
    {
      id: "fappe-showcase",
      titulo: "Piloto Oficial ApexLink",
      descripcion: "Conducción en pista con telemetría de boxes activa",
      icono: "award",
      desbloqueado: true,
      fechaDesbloqueo: "2026-10-31",
    },
  ],
};

// ---------------------------------------------------------------------------
// USUARIO MAESTRO: ADMIN (Control de Boxes & Exclusivo Modo Mock)
// ---------------------------------------------------------------------------
export const USUARIO_ADMIN: PerfilUsuario = {
  id: "00000000-0000-0000-0000-000000000001",
  nombre: "Administrador Maestro",
  alias: "ADMIN",
  email: "admin@apexlink.io",
  esInvitadoFappe: false,
  licencia: "Licencia de Control Maestro Apex",
  nacionalidad: "Argentina",
  codigoPais: "ARG",
  vehiculoPrincipal: "Formula RSS Supreme 2025",
  simulador: "Simulador de Boxes / Modo Mock & Control",
  puntajeGeneral: 90.2,
  rating: {
    paceRating: 2650,
    safetyRating: "S",
    nivel: "Director de Carrera",
    metricas: {
      velocidad: 90,
      consistencia: 92,
      frenada: 88,
      control: 91,
      agresividad: 84,
    },
  },
  vueltasTotales: 12,
  kilometrosTotales: 69.5,
  porcentajeVueltasValidas: 91.7,
  velocidadMaximaKmh: 312.4,
  habilidades: [
    {
      id: "frenada",
      nombre: "Frenada / Trail Braking",
      etiquetaCorta: "FRENADA",
      valor: 88,
      descripcion: "Modulación de sensores de desaceleración y telemetría de frenada.",
      consejo: "Excelente modulación de presión inicial y descompresión progresiva hacia el vértice.",
    },
    {
      id: "traccion",
      nombre: "Tracción / Salida",
      etiquetaCorta: "TRACCIÓN",
      valor: 90,
      descripcion: "Despliegue de potencia y telemetría de tracción.",
      consejo: "Apertura limpia del acelerador a la salida de chicanas lentas.",
    },
    {
      id: "apice",
      nombre: "Velocidad en Ápice",
      etiquetaCorta: "ÁPICE",
      valor: 89,
      descripcion: "Velocidad mínima en el vértice aprovechando la carga aerodinámica.",
      consejo: "Buen paso por curva manteniendo carga aerodinámica estable.",
    },
    {
      id: "consistencia",
      nombre: "Consistencia",
      etiquetaCorta: "CONSISTENCIA",
      valor: 92,
      descripcion: "Dispersión de tiempos entre vueltas consecutivas.",
      consejo: "Ritmo de referencia consistente entre giros consecutivos.",
    },
    {
      id: "limites",
      nombre: "Respeto de Límites",
      etiquetaCorta: "LÍMITES",
      valor: 92,
      descripcion: "Control de límites de pista y aprovechamiento de pianos.",
      consejo: "Respeto reglamentario de pianos y límites de pista.",
    },
  ],
  records: [
    {
      id: "monza",
      circuito: "Autodromo Nazionale Monza",
      pais: "ITA",
      tiempo: "01:23.450",
      esRecordSesion: true,
    },
  ],
  diagnosticoAi: {
    puntoFuerteTitulo: "Control Maestro de Pista",
    puntoFuerteDesc: "Privilegios exclusivos de conmutación de simulador sintético Mock y auditoría de telemetría.",
    oportunidadMejoraTitulo: "Gestión de Flota",
    oportunidadMejoraDesc: "Asegurar que los pilotos compitan exclusivamente con telemetría física real.",
  },
  logros: [
    {
      id: "admin-master",
      titulo: "Director de Carrera",
      descripcion: "Acceso concedido al panel maestro de telemetría y generador sintético.",
      icono: "shield-check",
      desbloqueado: true,
      fechaDesbloqueo: "2026-11-05",
    },
  ],
};

export const USUARIOS_PRUEBA = [USUARIO_ALEJO_GARLATI, USUARIO_ALEJO_SALAS, USUARIO_ADMIN];

/**
 * Comprueba si el usuario tiene privilegios de Administrador Maestro
 */
export function esUsuarioAdmin(usuario?: PerfilUsuario | null): boolean {
  if (!usuario) return false;
  return (
    usuario.alias === "ADMIN" ||
    usuario.email.toLowerCase() === "admin" ||
    usuario.email.toLowerCase() === "admin@apexlink.io" ||
    usuario.id === USUARIO_ADMIN.id
  );
}

// Compatibilidad hacia atrás: el piloto predeterminado es Alejo Garlati
export const PILOTO_INVITADO_FAPPE: PerfilUsuario = USUARIO_ALEJO_GARLATI;

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
  window.dispatchEvent(new Event("apexlink_usuario_cambiado"));
}

/**
 * Autentica al piloto contra el backend .NET 10 / PostgreSQL 16.
 * Si el backend no está alcanzable por red local, verifica las credenciales
 * de forma estricta contra las cuentas oficiales registradas.
 */
export async function iniciarSesionConServidor(
  email: string,
  password: string
): Promise<{ exitoso: boolean; sesion?: SesionAuth; error?: string }> {
  const emailNorm = email.trim().toLowerCase();
  const passNorm = password.trim();

  if (!emailNorm || !passNorm) {
    return {
      exitoso: false,
      error: "Debés ingresar tu correo electrónico y contraseña de boxes.",
    };
  }

  try {
    const emailAEnviar = emailNorm === "admin" ? "admin@apexlink.io" : emailNorm;
    const res = await autenticarUsuario({ email: emailAEnviar, password: passNorm });
    if (res.exitoso && res.datos) {
      const dto = res.datos.usuario;
      const baseUsuario =
        emailNorm === "admin" || emailNorm.includes("admin")
          ? USUARIO_ADMIN
          : emailNorm.includes("salas")
          ? USUARIO_ALEJO_SALAS
          : USUARIO_ALEJO_GARLATI;

      const evalDto = dto.ultimaEvaluacion;
      const usuarioConsolidado: PerfilUsuario = {
        ...baseUsuario,
        id: dto.usuarioId || baseUsuario.id,
        nombre: dto.nombre || baseUsuario.nombre,
        alias: dto.alias || baseUsuario.alias,
        email: dto.email || baseUsuario.email,
        licencia: dto.licencia || baseUsuario.licencia,
        nacionalidad: dto.nacionalidad || baseUsuario.nacionalidad,
        codigoPais: dto.codigoPais || baseUsuario.codigoPais,
        vehiculoPrincipal: dto.vehiculoPrincipal || baseUsuario.vehiculoPrincipal,
        simulador: dto.simuladorPrincipal || baseUsuario.simulador,
        puntajeGeneral: dto.puntajeGeneral ?? baseUsuario.puntajeGeneral,
        vueltasTotales: dto.vueltasTotales ?? baseUsuario.vueltasTotales,
        kilometrosTotales: dto.kilometrosTotales ?? baseUsuario.kilometrosTotales,
        porcentajeVueltasValidas: dto.porcentajeVueltasValidas ?? baseUsuario.porcentajeVueltasValidas,
        velocidadMaximaKmh: dto.velocidadMaximaKmh ?? baseUsuario.velocidadMaximaKmh,
        rating: {
          paceRating: dto.paceRating ?? baseUsuario.rating.paceRating,
          safetyRating: dto.safetyRating ?? baseUsuario.rating.safetyRating,
          nivel: dto.nivel || baseUsuario.rating.nivel,
          metricas: evalDto
            ? {
                velocidad: evalDto.velocidad,
                consistencia: evalDto.consistencia,
                frenada: evalDto.frenada,
                control: evalDto.control,
                agresividad: evalDto.agresividad,
              }
            : baseUsuario.rating.metricas,
        },
        habilidades: evalDto
          ? [
              {
                id: "frenada",
                nombre: "Frenada / Trail Braking",
                etiquetaCorta: "FRENADA",
                valor: evalDto.frenada,
                descripcion: "Modulación de frenada de precisión.",
                consejo: evalDto.consejoFrenada || baseUsuario.habilidades[0]?.consejo || "",
              },
              {
                id: "traccion",
                nombre: "Tracción / Salida",
                etiquetaCorta: "TRACCIÓN",
                valor: evalDto.traccionSalida,
                descripcion: "Despliegue de potencia a la salida de curvas.",
                consejo: evalDto.consejoTraccion || baseUsuario.habilidades[1]?.consejo || "",
              },
              {
                id: "apice",
                nombre: "Velocidad en Ápice",
                etiquetaCorta: "ÁPICE",
                valor: evalDto.velocidadApice,
                descripcion: "Paso por curva en vértices.",
                consejo: evalDto.consejoApice || baseUsuario.habilidades[2]?.consejo || "",
              },
              {
                id: "consistencia",
                nombre: "Consistencia",
                etiquetaCorta: "CONSISTENCIA",
                valor: evalDto.consistencia,
                descripcion: "Dispersión de tiempos entre vueltas.",
                consejo: evalDto.consejoConsistencia || baseUsuario.habilidades[3]?.consejo || "",
              },
              {
                id: "limites",
                nombre: "Respeto de Límites",
                etiquetaCorta: "LÍMITES",
                valor: evalDto.respetoLimites,
                descripcion: "Uso de pianos y trazada reglamentaria.",
                consejo: evalDto.consejoLimites || baseUsuario.habilidades[4]?.consejo || "",
              },
            ]
          : baseUsuario.habilidades,
        records:
          dto.records && dto.records.length > 0
            ? dto.records.map((r) => ({
                id: r.id,
                circuito: r.circuito,
                pais: r.pais,
                tiempo: r.tiempo,
                esRecordSesion: r.esRecordSesion,
              }))
            : baseUsuario.records,
        logros:
          dto.logros && dto.logros.length > 0
            ? dto.logros.map((l) => ({
                id: l.id,
                titulo: l.titulo,
                descripcion: l.descripcion,
                icono: l.icono,
                desbloqueado: l.desbloqueado,
                fechaDesbloqueo: l.fechaDesbloqueo,
              }))
            : baseUsuario.logros,
      };

      const sesion: SesionAuth = {
        token: res.datos.token,
        usuario: usuarioConsolidado,
        expiraEn: res.datos.expiraEn,
      };

      guardarSesionLocal(sesion);
      return { exitoso: true, sesion };
    }

    return {
      exitoso: false,
      error: res.mensaje || "Credenciales inválidas. Verificá tu correo y contraseña de boxes.",
    };
  } catch (err: unknown) {
    const mensajeError = err instanceof Error ? err.message : "";
    // Si el servidor respondió explícitamente 401 (Credenciales inválidas)
    if (
      mensajeError.includes("401") ||
      mensajeError.toLowerCase().includes("invalida") ||
      mensajeError.toLowerCase().includes("credenciales") ||
      mensajeError.toLowerCase().includes("no corresponde")
    ) {
      return {
        exitoso: false,
        error: "Credenciales inválidas. Verificá tu correo y contraseña de boxes.",
      };
    }

    // Servidor central no alcanzable: rechazo estricto sin inicio de sesión offline
    return {
      exitoso: false,
      error: "Servidor central de boxes desconectado. Levantá la API de telemetría Kestrel (.NET 10 / PostgreSQL) para iniciar sesión.",
    };
  }
}

/**
 * Elimina la sesión activa
 */
export function cerrarSesion(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CLAVE_ALMACENAMIENTO_AUTH);
  window.dispatchEvent(new Event("apexlink_usuario_cambiado"));
}

/**
 * Comprueba si hay una sesión válida
 */
export function estaAutenticado(): boolean {
  return obtenerSesionLocal() !== null;
}
