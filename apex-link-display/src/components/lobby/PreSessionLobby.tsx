import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Gamepad2,
  Maximize2,
  Minimize2,
  Play,
  Server,
  Settings2,
  Usb,
} from 'lucide-react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { DiagnosticCard, DiagnosticStatus } from './DiagnosticCard';
import { DriverProfileBadge } from './DriverProfileBadge';
import { MSlantedBadge, MTricolorStripe } from '../common/BmwMComponents';

interface Props {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenDiagnostics: () => void;
}

export const PreSessionLobby: React.FC<Props> = ({
  isFullscreen,
  onToggleFullscreen,
  onOpenDiagnostics,
}) => {
  const isConnected = useTelemetryStore((s) => s.isConnected);
  const isSimulatorConnected = useTelemetryStore((s) => s.isSimulatorConnected);
  const latencyMs = useTelemetryStore((s) => s.latencyMs);
  const pilotProfile = useTelemetryStore((s) => s.pilotProfile);
  const session = useTelemetryStore((s) => s.telemetry.session);
  const setMockActive = useTelemetryStore((s) => s.setMockActive);
  const startCalibration = useTelemetryStore((s) => s.startCalibration);

  const [clockStr, setClockStr] = useState<string>('--:--');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockStr(
        now.toLocaleTimeString('es-AR', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateClock();
    const id = window.setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  const currentHost =
    typeof window !== 'undefined' && window.location?.hostname
      ? window.location.hostname
      : 'localhost';
  const isUsbLoopback = currentHost === 'localhost' || currentHost === '127.0.0.1';

  // 1. Estado USB / Red
  const usbStatus: DiagnosticStatus = isConnected ? 'OK' : 'WAITING';
  const usbStatusLabel = isConnected ? 'CONECTADO' : 'EN ESPERA';
  const usbSubValue = isConnected
    ? `< ${latencyMs} MS · ${isUsbLoopback ? 'USB ADB' : 'LAN'}`
    : isUsbLoopback
    ? 'USB ADB'
    : currentHost;

  // 2. Estado Servidor
  const serverStatus: DiagnosticStatus = isConnected ? 'OK' : 'OFFLINE';
  const serverStatusLabel = isConnected ? 'ONLINE' : 'OFFLINE';
  const serverSubValue = isConnected ? '60 HZ · PORT 8080' : 'BUSCANDO :8080';

  // 3. Estado Simulador (Juego)
  const gameStatus: DiagnosticStatus = isSimulatorConnected
    ? 'OK'
    : isConnected
    ? 'WAITING'
    : 'OFFLINE';
  const gameStatusLabel = isSimulatorConnected
    ? 'EN PISTA'
    : isConnected
    ? 'ESPERANDO PISTA'
    : 'SIN CONEXIÓN';

  const hasValidTrack =
    session.track &&
    session.track.trim() !== '' &&
    !session.track.toLowerCase().includes('desconocido');

  const gameSubValue =
    isSimulatorConnected && hasValidTrack
      ? `${session.track.toUpperCase()}`
      : isConnected
      ? 'INICIE SESIÓN EN JUEGO'
      : 'ASSETTO CORSA';

  return (
    <div className="w-[1920px] h-[864px] bg-[#000000] text-white font-mono select-none flex flex-col justify-between relative overflow-hidden">
      {/* Franja M Tricolor estructural en el borde superior (4px) */}
      <MTricolorStripe height="h-1" />

      <div className="flex-1 flex flex-col justify-between px-12 py-8">
        {/* 1. CABECERA BMW M: ALTO VOLTAJE, TIPOGRAFÍA UPPERCASE Y ROJO M */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-5">
          {/* Marca / Identidad M-Performance */}
          <div className="flex items-center gap-4">
            <MSlantedBadge height="h-10" />
            <div className="flex flex-col">
              <span className="text-[44px] font-black tracking-[0.08em] text-white leading-none uppercase">
                APEXLINK
              </span>
              <span className="text-[12px] font-bold tracking-[0.2em] text-[#e22718] mt-1 uppercase">
                PRE-FLIGHT TELEMETRY SYSTEM
              </span>
            </div>
          </div>

          {/* Perfil de Piloto con silueta rectangular BMW M */}
          <DriverProfileBadge profile={pilotProfile} />

          {/* Monitor de Reloj / Tiempo Local */}
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#7e7e7e] uppercase">
              HORA LOCAL
            </span>
            <div className="text-[42px] font-black text-white tabular-nums leading-none tracking-wider mt-0.5">
              {clockStr}
            </div>
          </div>
        </div>

        {/* 2. TRES PILARES TÉCNICOS INDUSTRIALES (0px Radius, Rojo y Negro Dominante) */}
        <div className="flex-1 my-7 flex items-stretch gap-8">
          <DiagnosticCard
            title="USB / RED"
            status={usbStatus}
            statusLabel={usbStatusLabel}
            secondaryValue={usbSubValue}
            icon={<Usb className="w-20 h-20 stroke-[2]" />}
          />

          <DiagnosticCard
            title="SERVIDOR"
            status={serverStatus}
            statusLabel={serverStatusLabel}
            secondaryValue={serverSubValue}
            icon={<Server className="w-20 h-20 stroke-[2]" />}
          />

          <DiagnosticCard
            title="SIMULADOR"
            status={gameStatus}
            statusLabel={gameStatusLabel}
            secondaryValue={gameSubValue}
            icon={<Gamepad2 className="w-20 h-20 stroke-[2]" />}
          />
        </div>

        {/* 3. BOTONERA DE ACCIÓN: BOTONES RECTANGULARES FLAT, ROJO M Y CONTROLES CIRCULARES */}
        <div className="flex items-center justify-between gap-6 pt-1">
          {/* Botón Secundario: MODO DEMO (Fondo Negro / Borde Hairline con acento rojo) */}
          <button
            onClick={() => setMockActive(true)}
            className="flex-1 h-[88px] rounded-none bg-[#0d0d0d] hover:bg-[#1a1a1a] active:scale-[0.99] text-[#e6e6e6] hover:text-white border border-[#3c3c3c] hover:border-[#e22718] font-bold text-[26px] tracking-[0.15em] uppercase flex items-center justify-center gap-4 cursor-pointer transition-all shadow-md"
          >
            <Cpu className="w-8 h-8 text-[#e22718] stroke-[2.2]" />
            MODO DEMO
          </button>

          {/* Botón Primario: ABRIR COCKPIT DDU (Rojo M #e22718 Sólido, Alto Impacto) */}
          <button
            onClick={() => startCalibration()}
            className="flex-1 h-[88px] rounded-none bg-[#e22718] hover:bg-[#c91f12] active:scale-[0.99] text-white font-black text-[28px] tracking-[0.15em] uppercase flex items-center justify-center gap-4 cursor-pointer transition-all shadow-[0_0_35px_rgba(226,39,24,0.45)] border-2 border-[#e22718]"
          >
            <Play className="w-8 h-8 fill-current" />
            INICIAR COCKPIT DDU
          </button>

          {/* Control Circular: Diagnóstico y Ajustes (button-icon de BMW M) */}
          <button
            onClick={onOpenDiagnostics}
            title="Diagnóstico y Ajustes (Tecla D)"
            className="w-[88px] h-[88px] rounded-full bg-[#121212] hover:bg-[#1a1a1a] text-[#bbbbbb] hover:text-white border border-[#3c3c3c] hover:border-[#e22718] flex items-center justify-center transition-all cursor-pointer shrink-0 hover:shadow-[0_0_15px_rgba(226,39,24,0.3)]"
          >
            <Settings2 className="w-9 h-9" />
          </button>

          {/* Control Circular: Modo Pantalla Completa (button-icon de BMW M) */}
          <button
            onClick={onToggleFullscreen}
            title="Pantalla Completa (Tecla F)"
            className="w-[88px] h-[88px] rounded-full bg-[#121212] hover:bg-[#1a1a1a] text-[#bbbbbb] hover:text-white border border-[#3c3c3c] hover:border-[#e22718] flex items-center justify-center transition-all cursor-pointer shrink-0 hover:shadow-[0_0_15px_rgba(226,39,24,0.3)]"
          >
            {isFullscreen ? (
              <Minimize2 className="w-9 h-9" />
            ) : (
              <Maximize2 className="w-9 h-9" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
