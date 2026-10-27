/**
 * Punto individual de muestra de telemetría a lo largo de una vuelta.
 * Usado para renderizar gráficas multieje y el mapa 2D de trazada.
 */
export interface MuestraTelemetria {
  timestamp: number;
  distanciaMetros: number;
  velocidadKmh: number;
  rpms: number;
  marcha: number;
  acelerador: number; // 0.0 a 1.0 (Throttle)
  freno: number;      // 0.0 a 1.0 (Brake)
  direccion: number;  // -1.0 a 1.0 (Steer)
  posicionMundo: {
    x: number;
    y: number;
    z: number;
  };
  gForce: {
    lat: number;
    lon: number;
  };
}

/**
 * Resumen de una vuelta registrada en una sesión.
 */
export interface ResumenVuelta {
  id: string;
  numeroVuelta: number;
  tiempoVueltaMs: number;
  tiempoVueltaStr: string; // ej: "01:21.190"
  esMejorVuelta: boolean;
  esVueltaValida: boolean;
  sectoresMs: number[];
  totalMuestras: number;
}
