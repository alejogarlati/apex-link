import axios, { AxiosInstance, AxiosResponse } from "axios";
import type {
  RespuestaApi,
  PaginacionRespuesta,
  EstadoServicioDto,
  EstadoMockDto,
  SesionResumenDto,
  VueltaDto,
  CircuitoDto,
  CircuitoDetalleDto,
  LeaderboardItemDto,
  EvaluacionRendimientoApiDto,
  PerfilPilotoDetalleApiDto,
  GenerarEvaluacionApiRequest,
  ActualizarRatingApiRequest,
  LoginApiRequest,
  RegistroApiRequest,
  LoginRespuestaApiDto,
} from "@/types/api";
import type { MuestraTelemetriaDto, ComparativaVueltasDto } from "@/types/telemetria";

const URL_BASE_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const clienteHttp: AxiosInstance = axios.create({
  baseURL: URL_BASE_API,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

clienteHttp.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("apexlink_auth_sesion");
      if (raw) {
        const sesion = JSON.parse(raw);
        if (sesion?.token) {
          config.headers.Authorization = `Bearer ${sesion.token}`;
        }
      }
    } catch {
      // Ignorar fallo de parseo
    }
  }
  return config;
});

clienteHttp.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const errorSanitizado =
      error.response?.data?.mensaje ||
      error.response?.data?.detail ||
      error.message ||
      "Error al comunicarse con el servidor de telemetría de boxes";

    return Promise.reject(new Error(errorSanitizado));
  }
);

/**
 * Envoltorio tipado seguro para peticiones GET
 */
export async function solicitarGet<T>(ruta: string): Promise<RespuestaApi<T>> {
  const respuesta = await clienteHttp.get<RespuestaApi<T>>(ruta);
  return respuesta.data;
}

/**
 * Envoltorio tipado seguro para peticiones POST
 */
export async function solicitarPost<T, B = unknown>(
  ruta: string,
  cuerpo?: B
): Promise<RespuestaApi<T>> {
  const respuesta = await clienteHttp.post<RespuestaApi<T>>(ruta, cuerpo);
  return respuesta.data;
}

/**
 * Envoltorio tipado seguro para peticiones PUT
 */
export async function solicitarPut<T, B = unknown>(
  ruta: string,
  cuerpo?: B
): Promise<RespuestaApi<T>> {
  const respuesta = await clienteHttp.put<RespuestaApi<T>>(ruta, cuerpo);
  return respuesta.data;
}

/**
 * Envoltorio tipado seguro para peticiones DELETE
 */
export async function solicitarDelete<T>(ruta: string): Promise<RespuestaApi<T>> {
  const respuesta = await clienteHttp.delete<RespuestaApi<T>>(ruta);
  return respuesta.data;
}

// ---------------------------------------------------------------------------
// Endpoints de Dominio de Telemetría (Capa 1 Kestrel <-> Capa 3 WebApp)
// ---------------------------------------------------------------------------

/** Consulta el estado operativo del relay y la simulación */
export async function obtenerEstadoServicio(): Promise<RespuestaApi<EstadoServicioDto>> {
  return solicitarGet<EstadoServicioDto>("/api/estado");
}

/** Alterna el generador sintético mock en caliente */
export async function alternarModoMock(usarMock?: boolean): Promise<RespuestaApi<EstadoMockDto>> {
  return solicitarPost<EstadoMockDto, { usarMock?: boolean }>("/api/mock/alternar", { usarMock });
}

/** Obtiene el catálogo de circuitos FAPPE y calibraciones */
export async function obtenerCircuitos(): Promise<RespuestaApi<CircuitoDto[]>> {
  return solicitarGet<CircuitoDto[]>("/api/circuitos");
}

/** Obtiene la calibración y metadatos map.ini de un circuito */
export async function obtenerCircuitoPorId(id: string): Promise<RespuestaApi<CircuitoDetalleDto>> {
  return solicitarGet<CircuitoDetalleDto>(`/api/circuitos/${id}`);
}

/** Obtiene las sesiones registradas en SQLite/PostgreSQL con paginación */
export async function obtenerSesionesPaginadas(
  numeroPagina = 1,
  tamanioPagina = 10,
  usuarioId?: string
): Promise<RespuestaApi<PaginacionRespuesta<SesionResumenDto>>> {
  const url = usuarioId
    ? `/api/sesiones?numeroPagina=${numeroPagina}&tamanioPagina=${tamanioPagina}&usuarioId=${encodeURIComponent(usuarioId)}`
    : `/api/sesiones?numeroPagina=${numeroPagina}&tamanioPagina=${tamanioPagina}`;
  return solicitarGet<PaginacionRespuesta<SesionResumenDto>>(url);
}

/** Elimina una sesión y todas sus vueltas y telemetría asociadas en cascada */
export async function eliminarSesion(sesionId: string): Promise<RespuestaApi<boolean>> {
  return solicitarDelete<boolean>(`/api/sesiones/${sesionId}`);
}

/** Declara el piloto activo sentado en la cabina del simulador (FAPPE) */
export async function declararPilotoActivo(
  usuarioId: string,
  nombre: string,
  alias: string
): Promise<RespuestaApi<boolean>> {
  return solicitarPost<boolean, { usuarioId: string; nombre: string; alias: string }>(
    "/api/telemetria/piloto-activo",
    { usuarioId, nombre, alias }
  );
}

/** Consulta el piloto actualmente activo en cabina */
export async function obtenerPilotoActivo(): Promise<
  RespuestaApi<{ usuarioId: string | null; nombre: string; alias: string }>
> {
  return solicitarGet<{ usuarioId: string | null; nombre: string; alias: string }>(
    "/api/telemetria/piloto-activo"
  );
}

/** Obtiene las vueltas registradas de una tanda específica */
export async function obtenerVueltasSesion(
  sesionId: string
): Promise<RespuestaApi<VueltaDto[]>> {
  return solicitarGet<VueltaDto[]>(`/api/sesiones/${sesionId}/vueltas`);
}

/** Obtiene el volcado métrico completo (~4.800 muestras) de una vuelta */
export async function obtenerTelemetriaVuelta(
  vueltaId: string
): Promise<RespuestaApi<MuestraTelemetriaDto[]>> {
  return solicitarGet<MuestraTelemetriaDto[]>(`/api/vueltas/${vueltaId}/telemetria`);
}

/** Obtiene el delta temporal e interpolación métrica comparativa entre dos vueltas */
export async function compararVueltas(
  vueltaBaseId: string,
  vueltaComparadaId: string
): Promise<RespuestaApi<ComparativaVueltasDto>> {
  return solicitarGet<ComparativaVueltasDto>(
    `/api/vueltas/comparativa?vueltaBaseId=${vueltaBaseId}&vueltaComparadaId=${vueltaComparadaId}`
  );
}

/** Obtiene la tabla de clasificación y récords de vuelta oficial */
export async function obtenerLeaderboard(
  circuito = "monza",
  limite = 10
): Promise<RespuestaApi<LeaderboardItemDto[]>> {
  return solicitarGet<LeaderboardItemDto[]>(
    `/api/leaderboard?circuito=${encodeURIComponent(circuito)}&limite=${limite}`
  );
}

// ---------------------------------------------------------------------------
// Endpoints de Perfiles de Piloto y Motor de Evaluación (PostgreSQL / C# Engine)
// ---------------------------------------------------------------------------

/** Consulta el perfil completo del piloto, radar de 5 ejes y logros */
export async function obtenerPerfilPiloto(
  usuarioId: string
): Promise<RespuestaApi<PerfilPilotoDetalleApiDto>> {
  return solicitarGet<PerfilPilotoDetalleApiDto>(`/api/pilotos/${usuarioId}/perfil`);
}

/** Dispara el motor heurístico en el backend para evaluar una tanda y guardar métricas */
export async function evaluarSesionPiloto(
  usuarioId: string,
  sesionId: string
): Promise<RespuestaApi<EvaluacionRendimientoApiDto>> {
  return solicitarPost<EvaluacionRendimientoApiDto, GenerarEvaluacionApiRequest>(
    `/api/pilotos/${usuarioId}/evaluacion`,
    { sesionId, usuarioId }
  );
}

/** Actualiza manualmente el rating del piloto en PostgreSQL */
export async function actualizarRatingPiloto(
  usuarioId: string,
  datos: ActualizarRatingApiRequest
): Promise<RespuestaApi<string>> {
  return solicitarPut<string, ActualizarRatingApiRequest>(
    `/api/pilotos/${usuarioId}/rating`,
    datos
  );
}

/** Autentica un piloto contra el servidor central Kestrel / PostgreSQL */
export async function autenticarUsuario(
  credenciales: LoginApiRequest
): Promise<RespuestaApi<LoginRespuestaApiDto>> {
  return solicitarPost<LoginRespuestaApiDto, LoginApiRequest>(
    "/api/auth/login",
    credenciales
  );
}

/** Registra un nuevo piloto en el servidor central Kestrel / PostgreSQL con hash BCrypt */
export async function registrarUsuario(
  datos: RegistroApiRequest
): Promise<RespuestaApi<LoginRespuestaApiDto>> {
  return solicitarPost<LoginRespuestaApiDto, RegistroApiRequest>(
    "/api/auth/registro",
    datos
  );
}
