import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Cliente centralizado de Axios para toda la aplicación web.
 * Fuente única de verdad para llamadas HTTP hacia el servidor de telemetría.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});
