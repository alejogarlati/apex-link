import { useEffect, useRef } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { LapCompletedEvent, TelemetryFrame, TelemetrySocketMessage } from '../types/telemetry';

const getWsUrl = (): string => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    return `ws://${host}:8080/ws/telemetry`;
  }
  return 'ws://localhost:8080/ws/telemetry';
};

export const useTelemetryWebSocket = () => {
  const updateTelemetry = useTelemetryStore((s) => s.updateTelemetry);
  const triggerLapCompleted = useTelemetryStore((s) => s.triggerLapCompleted);
  const setConnectionStatus = useTelemetryStore((s) => s.setConnectionStatus);
  const isMockActive = useTelemetryStore((s) => s.isMockActive);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // If user explicitly activated mock simulation, WebSocket can idle or attempt background connection
    if (isMockActive) {
      setConnectionStatus(true, 1);
      return;
    }

    let isUnmounted = false;

    const connect = () => {
      if (isUnmounted) return;

      try {
        const url = getWsUrl();
        const ws = new WebSocket(url);
        socketRef.current = ws;

        ws.onopen = () => {
          if (isUnmounted) return;
          setConnectionStatus(true, 1);
        };

        ws.onmessage = (event) => {
          if (isUnmounted) return;
          try {
            const data: TelemetrySocketMessage = JSON.parse(event.data);
            if (data.type === 'FRAME') {
              updateTelemetry(data as TelemetryFrame);
            } else if (data.type === 'LAP_COMPLETED') {
              triggerLapCompleted(data as LapCompletedEvent);
            }
          } catch {
            // Ignore malformed packets silently
          }
        };

        ws.onerror = () => {
          if (isUnmounted) return;
          setConnectionStatus(false);
        };

        ws.onclose = () => {
          if (isUnmounted) return;
          setConnectionStatus(false);
          // Try reconnecting after 1s
          reconnectTimeoutRef.current = window.setTimeout(connect, 1000);
        };
      } catch {
        setConnectionStatus(false);
        reconnectTimeoutRef.current = window.setTimeout(connect, 1000);
      }
    };

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [isMockActive, updateTelemetry, triggerLapCompleted, setConnectionStatus]);
};
