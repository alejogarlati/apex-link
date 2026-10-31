import axios, { AxiosInstance, AxiosResponse } from "axios";
import type { RespuestaApi } from "@/types/api";

const URL_BASE_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const clienteHttp: AxiosInstance = axios.create({
  baseURL: URL_BASE_API,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
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
