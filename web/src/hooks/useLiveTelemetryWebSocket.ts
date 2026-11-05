"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { TelemetryFrame, LapCompletedEvent, MensajeWebSocketTelemetria } from "@/types/telemetria";

export interface LiveTelemetryState {
  conectado: boolean;
  frame: TelemetryFrame | null;
  ultimoEventoVuelta: LapCompletedEvent | null;
  latenciaMs: number;
  fpsEstimado: number;
  totalCuadrosRecibidos: number;
  reconectar: () => void;
}

const DEFAULT_WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws/telemetry";

export function useLiveTelemetryWebSocket(urlWs = DEFAULT_WS_URL): LiveTelemetryState {
  const [conectado, setConectado] = useState(false);
  const [frame, setFrame] = useState<TelemetryFrame | null>(null);
  const [ultimoEventoVuelta, setUltimoEventoVuelta] = useState<LapCompletedEvent | null>(null);
  const [latenciaMs, setLatenciaMs] = useState(0);
  const [fpsEstimado, setFpsEstimado] = useState(0);
  const [totalCuadros, setTotalCuadros] = useState(0);

  const socketRef = useRef<WebSocket | null>(null);
  const reconectarTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ultimoTimestampFrameRef = useRef<number>(0);
  const contadorFramesRef = useRef<number>(0);
  const intervaloFpsRef = useRef<NodeJS.Timeout | null>(null);

  const conectar = useCallback(() => {
    if (typeof window === "undefined") return;

    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch {
        // Ignorar fallo al cerrar socket previo
      }
    }

    try {
      const ws = new WebSocket(urlWs);
      socketRef.current = ws;

      ws.onopen = () => {
        setConectado(true);
      };

      ws.onmessage = (event) => {
        try {
          const mensaje: MensajeWebSocketTelemetria = JSON.parse(event.data);
          const ahora = Date.now();

          if (mensaje.type === "FRAME") {
            setFrame(mensaje);
            setTotalCuadros((prev) => prev + 1);
            contadorFramesRef.current += 1;

            if (mensaje.timestamp) {
              const deltaServidor = ahora - mensaje.timestamp;
              if (deltaServidor >= 0 && deltaServidor < 5000) {
                setLatenciaMs(deltaServidor);
              }
            }

            ultimoTimestampFrameRef.current = ahora;
          } else if (mensaje.type === "LAP_COMPLETED") {
            setUltimoEventoVuelta(mensaje);
          }
        } catch {
          // Ignorar cuadros malformados transitorios
        }
      };

      ws.onerror = () => {
        setConectado(false);
      };

      ws.onclose = () => {
        setConectado(false);
        // Reintento automático a los 1.5 segundos
        reconectarTimeoutRef.current = setTimeout(() => {
          conectar();
        }, 1500);
      };
    } catch {
      setConectado(false);
      reconectarTimeoutRef.current = setTimeout(() => {
        conectar();
      }, 2000);
    }
  }, [urlWs]);

  useEffect(() => {
    conectar();

    // Medidor de FPS cada segundo
    intervaloFpsRef.current = setInterval(() => {
      setFpsEstimado(contadorFramesRef.current);
      contadorFramesRef.current = 0;
    }, 1000);

    return () => {
      if (reconectarTimeoutRef.current) clearTimeout(reconectarTimeoutRef.current);
      if (intervaloFpsRef.current) clearInterval(intervaloFpsRef.current);
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
    };
  }, [conectar]);

  return {
    conectado,
    frame,
    ultimoEventoVuelta,
    latenciaMs,
    fpsEstimado,
    totalCuadrosRecibidos: totalCuadros,
    reconectar: conectar,
  };
}
