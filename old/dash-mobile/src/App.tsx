import { useState, useEffect, useRef } from 'react';
import type { TelemetryFrame } from './types/telemetry';
import { RevLeds } from './components/RevLeds';
import { TyreWidget } from './components/TyreWidget';
import { Maximize2, Minimize2, Wifi, WifiOff } from 'lucide-react';

export function App() {
  const [frame, setFrame] = useState<TelemetryFrame | null>(null);
  const [connected, setConnected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Solicitar WakeLock para evitar suspensión de pantalla en Android
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.warn('WakeLock no soportado o bloqueado:', err);
      }
    };
    requestWakeLock();

    return () => {
      if (wakeLock) wakeLock.release();
    };
  }, []);

  useEffect(() => {
    // Conexión por WebSocket (localhost si corre en el teléfono vía adb reverse)
    const host = window.location.hostname || 'localhost';
    const wsUrl = `ws://${host}:8080`;

    let reconnectTimer: any;

    const connect = () => {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'FRAME') {
            setFrame(data);
          }
        } catch (e) {
          console.error('Error parseando telemetría:', e);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimer = setTimeout(connect, 1000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const getGearDisplay = (gear: number) => {
    if (gear === 0) return 'R';
    if (gear === 1) return 'N';
    return String(gear - 1); // 2 -> 1ra, 3 -> 2da...
  };

  const delta = frame?.timing.deltaMs ?? 0;
  const deltaColor = delta <= 0 ? 'text-emerald-400' : 'text-rose-500';
  const deltaStr = `${delta > 0 ? '+' : ''}${(delta / 1000).toFixed(3)}`;

  return (
    <div className="h-screen w-screen flex flex-col justify-between p-2 select-none overflow-hidden bg-black text-white font-sans">
      {/* 1. REV LEDS (SHIFT LIGHTS) */}
      <RevLeds
        rpms={frame?.car.rpms ?? 0}
        maxRpm={frame?.car.maxRpm ?? 13500}
      />

      {/* 2. BARRA DE ESTADO SUPERIOR */}
      <div className="flex items-center justify-between px-3 py-1 bg-neutral-900/80 rounded border border-neutral-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          {connected ? (
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Wifi size={14} /> LIVE USB
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-500 animate-pulse font-bold">
              <WifiOff size={14} /> RECONECTANDO...
            </span>
          )}
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-300 uppercase">{frame?.session.track ?? 'MONZA'}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
            LAP {frame?.timing.currentLap ?? 1}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 active:scale-95 transition"
            title="Pantalla completa"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* 3. NÚCLEO CENTRAL: GEAR & SPEED & DELTA */}
      <div className="flex-1 grid grid-cols-12 gap-2 items-center my-1">
        {/* Lado izquierdo: Neumáticos y Tiempos */}
        <div className="col-span-4 flex flex-col justify-between h-full gap-2">
          <TyreWidget
            pressures={frame?.tyres.pressurePsi ?? [0, 0, 0, 0]}
            temps={frame?.tyres.tempCoreC ?? [0, 0, 0, 0]}
          />

          <div className="bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800 flex flex-col font-mono">
            <span className="text-[10px] text-neutral-400 tracking-wider">LAST LAP</span>
            <span className="text-xl font-bold">{frame?.timing.lapTimeStr ?? '--:--.---'}</span>
            <span className="text-[10px] text-neutral-400 tracking-wider mt-1">BEST LAP</span>
            <span className="text-sm text-purple-400 font-semibold">{frame?.timing.bestTimeStr ?? '--:--.---'}</span>
          </div>
        </div>

        {/* Centro: MARCHA GIGANTE & VELOCÍMETRO */}
        <div className="col-span-4 flex flex-col items-center justify-center bg-neutral-950 rounded-2xl border-2 border-neutral-800 h-full p-2 relative shadow-inner">
          <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
            GEAR
          </div>
          <div className="text-8xl sm:text-9xl font-black font-mono leading-none tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {getGearDisplay(frame?.car.gear ?? 1)}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl sm:text-4xl font-mono font-black text-amber-400">
              {frame?.car.speedKmh ?? 0}
            </span>
            <span className="text-xs font-mono text-neutral-400">KM/H</span>
          </div>

          {/* DRS Indicator */}
          {frame?.car.drsAvailable && (
            <div className={`mt-2 px-3 py-0.5 rounded text-xs font-black tracking-widest font-mono ${
              frame.car.drsEnabled ? 'bg-emerald-500 text-black animate-pulse' : 'bg-neutral-800 text-emerald-400 border border-emerald-500/40'
            }`}>
              DRS
            </div>
          )}
        </div>

        {/* Lado derecho: Delta y Pedales */}
        <div className="col-span-4 flex flex-col justify-between h-full gap-2">
          {/* DELTA WIDGET */}
          <div className="bg-neutral-900/90 p-3 rounded-lg border border-neutral-800 flex flex-col items-center font-mono">
            <span className="text-[11px] text-neutral-400 tracking-wider">DELTA</span>
            <span className={`text-3xl sm:text-4xl font-black ${deltaColor}`}>
              {deltaStr}
            </span>
          </div>

          {/* BARRAS DE PEDALES (THROTTLE / BRAKE) */}
          <div className="bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800 flex flex-col gap-2">
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1 text-neutral-400">
                <span>THROTTLE</span>
                <span className="text-emerald-400 font-bold">{Math.round((frame?.car.throttle ?? 0) * 100)}%</span>
              </div>
              <div className="w-full bg-neutral-950 h-3 rounded overflow-hidden border border-neutral-800">
                <div
                  className="bg-emerald-500 h-full transition-all duration-75"
                  style={{ width: `${(frame?.car.throttle ?? 0) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1 text-neutral-400">
                <span>BRAKE</span>
                <span className="text-rose-500 font-bold">{Math.round((frame?.car.brake ?? 0) * 100)}%</span>
              </div>
              <div className="w-full bg-neutral-950 h-3 rounded overflow-hidden border border-neutral-800">
                <div
                  className="bg-rose-500 h-full transition-all duration-75"
                  style={{ width: `${(frame?.car.brake ?? 0) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PIE DE PÁGINA: BANDERAS Y RPM NUMÉRICO */}
      <div className="flex items-center justify-between px-3 py-1 bg-neutral-900/80 rounded border border-neutral-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">RPM:</span>
          <span className="text-neutral-200 font-bold">{frame?.car.rpms ?? 0}</span>
        </div>
        <div className={`px-3 py-0.5 rounded font-black text-xs ${
          frame?.session.flag === 'YELLOW' ? 'bg-amber-400 text-black' : 'bg-emerald-500 text-black'
        }`}>
          {frame?.session.flag ?? 'FLAG: GREEN'}
        </div>
      </div>
    </div>
  );
}

export default App;
