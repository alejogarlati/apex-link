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

  // Buffer y rAF para desacoplar el flujo de frames de 60 Hz del ciclo de renderizado de React
  const ultimoFrameRef = useRef<TelemetryFrame | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const deltaServidorRef = useRef<number>(0);

  // Mantener urlWs fija mediante ref para evitar recreaciones de conectar
  const urlWsRef = useRef(urlWs);
  useEffect(() => {
    urlWsRef.current = urlWs;
  }, [urlWs]);

  const conectar = useCallback(() => {
    if (typeof window === "undefined") return;

    // Cancelar cualquier temporizador de reconexión pendiente
    if (reconectarTimeoutRef.current) {
      clearTimeout(reconectarTimeoutRef.current);
      reconectarTimeoutRef.current = null;
    }

    // Desconectar socket previo anulando listeners para evitar disparos en bucle
    if (socketRef.current) {
      try {
        socketRef.current.onopen = null;
        socketRef.current.onmessage = null;
        socketRef.current.onerror = null;
        socketRef.current.onclose = null;
        socketRef.current.close();
      } catch {
        // Ignorar fallo al cerrar socket previo
      }
      socketRef.current = null;
    }

    try {
      const ws = new WebSocket(urlWsRef.current);
      socketRef.current = ws;

      ws.onopen = () => {
        setConectado(true);
      };

      ws.onmessage = (event) => {
        try {
          const mensaje: MensajeWebSocketTelemetria = JSON.parse(event.data);
          const ahora = Date.now();

          if (mensaje.type === "FRAME") {
            ultimoFrameRef.current = mensaje;
            contadorFramesRef.current += 1;

            if (mensaje.timestamp) {
              const deltaServidor = ahora - mensaje.timestamp;
              if (deltaServidor >= 0 && deltaServidor < 5000) {
                deltaServidorRef.current = deltaServidor;
              }
            }

            ultimoTimestampFrameRef.current = ahora;

            // Despachar a React sincronizado con la tasa de refresco (60-144 FPS)
            if (rafIdRef.current === null) {
              rafIdRef.current = requestAnimationFrame(() => {
                rafIdRef.current = null;
                if (ultimoFrameRef.current) {
                  setFrame(ultimoFrameRef.current);
                  setTotalCuadros(contadorFramesRef.current);
                  setLatenciaMs(deltaServidorRef.current);
                }
              });
            }
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
  }, []);

  useEffect(() => {
    conectar();

    // Medidor de FPS cada segundo
    intervaloFpsRef.current = setInterval(() => {
      setFpsEstimado(contadorFramesRef.current);
      contadorFramesRef.current = 0;
    }, 1000);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (reconectarTimeoutRef.current) clearTimeout(reconectarTimeoutRef.current);
      if (intervaloFpsRef.current) clearInterval(intervaloFpsRef.current);
      if (socketRef.current) {
        socketRef.current.onopen = null;
        socketRef.current.onmessage = null;
        socketRef.current.onerror = null;
        socketRef.current.onclose = null;
        socketRef.current.close();
        socketRef.current = null;
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
