import type { PerfilUsuario, SesionAuth } from "@/types/usuario";
import type { PerfilPilotoDetalleApiDto, RegistroApiRequest } from "@/types/api";
import { autenticarUsuario, registrarUsuario, declararPilotoActivo } from "@/lib/apiClient";

const CLAVE_ALMACENAMIENTO_AUTH = "apexlink_auth_sesion";

/**
 * Comprueba si el usuario tiene privilegios de Administrador Maestro
 */
export function esUsuarioAdmin(usuario?: PerfilUsuario | null): boolean {
  if (!usuario) return false;
  return (
    usuario.alias === "ADMIN" ||
    usuario.email.toLowerCase() === "admin" ||
    usuario.email.toLowerCase() === "admin@apexlink.io" ||
    usuario.id.startsWith("00000000")
  );
}

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
 * Mapea el DTO devuelto por el servidor central hacia el modelo de sesión del cliente
 * sin inyectar perfiles ni constantes hardcodeadas.
 */
export function mapearDtoAPerfilUsuario(dto: PerfilPilotoDetalleApiDto): PerfilUsuario {
  const evalDto = dto.ultimaEvaluacion;

  return {
    id: dto.usuarioId,
    nombre: dto.nombre,
    alias: dto.alias,
    email: dto.email,
    esInvitadoFappe: false,
    licencia: dto.licencia || "Licencia Apex SimRacing",
    nacionalidad: dto.nacionalidad || "Argentina",
    codigoPais: dto.codigoPais || "ARG",
    vehiculoPrincipal: dto.vehiculoPrincipal || "Sin vehículo registrado",
    simulador: dto.simuladorPrincipal || "Assetto Corsa",
    puntajeGeneral: dto.puntajeGeneral ?? 0,
    vueltasTotales: dto.vueltasTotales ?? 0,
    kilometrosTotales: dto.kilometrosTotales ?? 0,
    porcentajeVueltasValidas: dto.porcentajeVueltasValidas ?? 0,
    velocidadMaximaKmh: dto.velocidadMaximaKmh ?? 0,
    rating: {
      paceRating: dto.paceRating ?? 1500,
      safetyRating: dto.safetyRating || "B",
      nivel: dto.nivel || "Amateur",
      metricas: {
        velocidad: evalDto?.velocidad ?? 0,
        consistencia: evalDto?.consistencia ?? 0,
        frenada: evalDto?.frenada ?? 0,
        control: evalDto?.control ?? 0,
        agresividad: evalDto?.agresividad ?? 0,
      },
    },
    habilidades: [
      {
        id: "frenada",
        nombre: "Frenada / Trail Braking",
        etiquetaCorta: "FRENADA",
        valor: evalDto?.frenada ?? 0,
        descripcion: "Modulación de frenada de precisión.",
        consejo: evalDto?.consejoFrenada || "Sin telemetría de frenada evaluada aún.",
      },
      {
        id: "traccion",
        nombre: "Tracción / Salida",
        etiquetaCorta: "TRACCIÓN",
        valor: evalDto?.traccionSalida ?? 0,
        descripcion: "Despliegue de potencia a la salida de curvas.",
        consejo: evalDto?.consejoTraccion || "Sin telemetría de tracción evaluada aún.",
      },
      {
        id: "apice",
        nombre: "Velocidad en Ápice",
        etiquetaCorta: "ÁPICE",
        valor: evalDto?.velocidadApice ?? 0,
        descripcion: "Paso por curva en vértices.",
        consejo: evalDto?.consejoApice || "Sin telemetría de vértice evaluada aún.",
      },
      {
        id: "consistencia",
        nombre: "Consistencia",
        etiquetaCorta: "CONSISTENCIA",
        valor: evalDto?.consistencia ?? 0,
        descripcion: "Dispersión de tiempos entre vueltas.",
        consejo: evalDto?.consejoConsistencia || "Completá una tanda para evaluar consistencia.",
      },
      {
        id: "limites",
        nombre: "Respeto de Límites",
        etiquetaCorta: "LÍMITES",
        valor: evalDto?.respetoLimites ?? 0,
        descripcion: "Uso de pianos y trazada reglamentaria.",
        consejo: evalDto?.consejoLimites || "Sin registros de límites de pista evaluados aún.",
      },
    ],
    diagnosticoAi: {
      puntoFuerteTitulo: evalDto?.puntoFuerteTitulo || "Pendiente de evaluación en pista",
      puntoFuerteDesc:
        evalDto?.puntoFuerteDesc ||
        "Registrá vueltas válidas en el simulador para generar el diagnóstico de telemetría.",
      oportunidadMejoraTitulo: evalDto?.oportunidadMejoraTitulo || "Pendiente de evaluación en pista",
      oportunidadMejoraDesc:
        evalDto?.oportunidadMejoraDesc ||
        "El motor heurístico analizará tus frenadas, vértices y tracción al finalizar tu primera tanda.",
    },
    records: Array.isArray(dto.records)
      ? dto.records.map((r) => ({
          id: r.id,
          circuito: r.circuito,
          pais: r.pais,
          tiempo: r.tiempo,
          esRecordSesion: r.esRecordSesion,
        }))
      : [],
    logros: Array.isArray(dto.logros)
      ? dto.logros.map((l) => ({
          id: l.id,
          titulo: l.titulo,
          descripcion: l.descripcion,
          icono: l.icono,
          desbloqueado: l.desbloqueado,
          fechaDesbloqueo: l.fechaDesbloqueo,
        }))
      : [],
  };
}

/**
 * Autentica al piloto contra el backend .NET 10 / PostgreSQL 16.
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
      const usuarioConsolidado = mapearDtoAPerfilUsuario(res.datos.usuario);

      const sesion: SesionAuth = {
        token: res.datos.token,
        usuario: usuarioConsolidado,
        expiraEn: res.datos.expiraEn,
      };

      guardarSesionLocal(sesion);
      declararPilotoActivo(
        usuarioConsolidado.id,
        usuarioConsolidado.nombre,
        usuarioConsolidado.alias
      ).catch(() => {});
      return { exitoso: true, sesion };
    }

    return {
      exitoso: false,
      error: res.mensaje || "Credenciales inválidas. Verificá tu correo y contraseña de boxes.",
    };
  } catch (err: unknown) {
    const mensajeError = err instanceof Error ? err.message : "";
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

    return {
      exitoso: false,
      error:
        "Servidor central de boxes desconectado. Levantá la API de telemetría Kestrel (.NET 10 / PostgreSQL) para iniciar sesión.",
    };
  }
}

/**
 * Registra un nuevo piloto en el servidor central (.NET 10 / PostgreSQL 16 con BCrypt),
 * inicia su sesión automáticamente y lo declara como piloto activo en cabina.
 */
export async function registrarPilotoConServidor(
  datos: RegistroApiRequest
): Promise<{ exitoso: boolean; sesion?: SesionAuth; error?: string }> {
  const nombre = datos.nombre.trim();
  const alias = datos.alias.trim().toUpperCase();
  const email = datos.email.trim().toLowerCase();
  const password = datos.password;

  if (nombre.length < 2) {
    return {
      exitoso: false,
      error: "El nombre completo debe tener al menos 2 caracteres.",
    };
  }

  if (alias.length < 2 || alias.length > 20) {
    return {
      exitoso: false,
      error: "El alias de piloto debe tener entre 2 y 20 caracteres.",
    };
  }

  if (!email.includes("@") || !email.includes(".")) {
    return {
      exitoso: false,
      error: "Debés ingresar una dirección de correo electrónico válida.",
    };
  }

  if (!password || password.length < 6) {
    return {
      exitoso: false,
      error: "La contraseña debe tener al menos 6 caracteres.",
    };
  }

  try {
    const res = await registrarUsuario({
      nombre,
      alias,
      email,
      password,
      nacionalidad: datos.nacionalidad || "Argentina",
      codigoPais: datos.codigoPais || "ARG",
    });

    if (res.exitoso && res.datos) {
      const usuarioConsolidado = mapearDtoAPerfilUsuario(res.datos.usuario);

      const sesion: SesionAuth = {
        token: res.datos.token,
        usuario: usuarioConsolidado,
        expiraEn: res.datos.expiraEn,
      };

      guardarSesionLocal(sesion);
      declararPilotoActivo(
        usuarioConsolidado.id,
        usuarioConsolidado.nombre,
        usuarioConsolidado.alias
      ).catch(() => {});

      return { exitoso: true, sesion };
    }

    return {
      exitoso: false,
      error: res.mensaje || "No se pudo completar el registro del piloto.",
    };
  } catch (err: unknown) {
    const mensajeError = err instanceof Error ? err.message : "";
    if (
      mensajeError.includes("409") ||
      mensajeError.toLowerCase().includes("existe") ||
      mensajeError.toLowerCase().includes("en uso") ||
      mensajeError.toLowerCase().includes("registrado")
    ) {
      return {
        exitoso: false,
        error: mensajeError || "El correo electrónico o el alias ya se encuentran registrados en boxes.",
      };
    }

    if (mensajeError.includes("400")) {
      return {
        exitoso: false,
        error: mensajeError || "Verificá los datos del formulario de registro.",
      };
    }

    return {
      exitoso: false,
      error:
        "Servidor central de boxes desconectado. Levantá la API de telemetría Kestrel (.NET 10 / PostgreSQL) para registrar pilotos.",
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
