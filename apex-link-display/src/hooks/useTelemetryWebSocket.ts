import { useEffect, useRef } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { LapCompletedEvent, TelemetryFrame, TelemetrySocketMessage } from '../types/telemetry';

const getHost = (): string => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return window.location.hostname;
  }
  return 'localhost';
};

export const getWsUrl = (): string => `ws://${getHost()}:8080/ws/telemetry`;
export const getApiBaseUrl = (): string => `http://${getHost()}:8080`;

export const useTelemetryWebSocket = () => {
  const updateTelemetry = useTelemetryStore((s) => s.updateTelemetry);
  const triggerLapCompleted = useTelemetryStore((s) => s.triggerLapCompleted);
  const setConnectionStatus = useTelemetryStore((s) => s.setConnectionStatus);
  const setPilotProfile = useTelemetryStore((s) => s.setPilotProfile);
  const setSimulatorConnected = useTelemetryStore((s) => s.setSimulatorConnected);
  const setAppState = useTelemetryStore((s) => s.setAppState);
  const isMockActive = useTelemetryStore((s) => s.isMockActive);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let isUnmounted = false;

    const fetchBackendStatusAndProfile = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/estado`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok || isUnmounted) return;
        const json = await res.json();
        const datos = json?.datos || json?.data;
        if (datos) {
          setPilotProfile({
            name: datos.pilotName || 'Invitado',
            alias: datos.pilotAlias || 'INVITADO',
            isGuest: datos.isGuest ?? true,
          });
          if (typeof datos.isConnected === 'boolean') {
            setSimulatorConnected(datos.isConnected);
          }
        }
      } catch {
        // Fallback silencioso a Invitado si el endpoint no responde
      }
    };

    // Monitorear inactividad de cuadros (retorno automático a STANDBY si se sale de la sesión)
    const watchdogInterval = window.setInterval(() => {
      const store = useTelemetryStore.getState();
      if (store.isMockActive) return;

      const elapsedSinceLastFrame = Date.now() - store.lastFrameReceivedAt;
      if (store.lastFrameReceivedAt > 0 && elapsedSinceLastFrame > 3200) {
        if (store.appState === 'ON_SESSION') {
          setAppState('STANDBY');
        }
        if (store.isSimulatorConnected) {
          setSimulatorConnected(false);
        }
      }

      if (store.isConnected && store.appState === 'STANDBY') {
        fetchBackendStatusAndProfile();
      }
    }, 1500);

    if (isMockActive) {
      setConnectionStatus(true, 1);
      setSimulatorConnected(true);
      return () => {
        isUnmounted = true;
        clearInterval(watchdogInterval);
      };
    }

    const connect = () => {
      if (isUnmounted) return;

      try {
        const url = getWsUrl();
        const ws = new WebSocket(url);
        socketRef.current = ws;

        ws.onopen = () => {
          if (isUnmounted) return;
          setConnectionStatus(true, 1);
          fetchBackendStatusAndProfile();
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
            // Ignorar paquetes malformados
          }
        };

        ws.onerror = () => {
          if (isUnmounted) return;
          setConnectionStatus(false);
        };

        ws.onclose = () => {
          if (isUnmounted) return;
          setConnectionStatus(false);
          setSimulatorConnected(false);
          reconnectTimeoutRef.current = window.setTimeout(connect, 1000);
        };
      } catch {
        setConnectionStatus(false);
        setSimulatorConnected(false);
        reconnectTimeoutRef.current = window.setTimeout(connect, 1000);
      }
    };

    connect();

    return () => {
      isUnmounted = true;
      clearInterval(watchdogInterval);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [
    isMockActive,
    updateTelemetry,
    triggerLapCompleted,
    setConnectionStatus,
    setPilotProfile,
    setSimulatorConnected,
    setAppState,
  ]);
};
