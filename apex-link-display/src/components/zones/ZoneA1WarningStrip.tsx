import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { ShieldAlert, Usb, Zap } from 'lucide-react';

interface Props {
  onOpenDiagnostics: () => void;
}

export const ZoneA1WarningStrip: React.FC<Props> = ({ onOpenDiagnostics }) => {
  const car = useTelemetryStore((s) => s.telemetry.car);
  const session = useTelemetryStore((s) => s.telemetry.session);
  const pitLimiterActive = useTelemetryStore((s) => s.pitLimiterActive || s.mockScenario === 'PIT_LANE');
  const isConnected = useTelemetryStore((s) => s.isConnected);
  const isUsbConnected = useTelemetryStore((s) => s.isUsbConnected);
  const latencyMs = useTelemetryStore((s) => s.latencyMs);

  return (
    <div className="w-[480px] h-[72px] px-4 flex items-center justify-between border-b border-r border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm">
      {/* Hidden/Subtle Diagnostics Trigger Button */}
      <button
        onClick={onOpenDiagnostics}
        title="Doble clic o toque para Diagnósticos y Ajustes"
        className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-700/50 transition-colors cursor-pointer"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-emerald-400' : 'bg-rose-500'}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        </span>
        <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider font-semibold text-zinc-300">
          <Usb className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isUsbConnected ? 'USB 0.8ms' : `${latencyMs}ms`}</span>
        </div>
      </button>

      {/* Pit Limiter Box (4 Hz flashing blue when active) */}
      {pitLimiterActive ? (
        <div className="px-3.5 py-1 rounded font-mono text-[13px] font-black tracking-widest animate-pit-limiter">
          PIT LIM
        </div>
      ) : (
        <div className="px-3 py-1 rounded font-mono text-[11px] font-semibold tracking-wider text-zinc-600 border border-zinc-800/60">
          PIT OFF
        </div>
      )}

      {/* DRS Status Box */}
      {car.drsEnabled ? (
        <div className="px-3.5 py-1 rounded font-mono text-[13px] font-black tracking-wider bg-emerald-500 text-black shadow-[0_0_16px_#00E676] flex items-center gap-1">
          <Zap className="w-4 h-4 fill-black" />
          <span>DRS OPEN</span>
        </div>
      ) : car.drsAvailable ? (
        <div className="px-3.5 py-1 rounded font-mono text-[13px] font-black tracking-wider bg-amber-500 text-black animate-pulse flex items-center gap-1">
          <Zap className="w-4 h-4" />
          <span>DRS READY</span>
        </div>
      ) : (
        <div className="px-3 py-1 rounded font-mono text-[11px] font-semibold tracking-wider text-zinc-600 border border-zinc-800/60">
          DRS OFF
        </div>
      )}

      {/* FIA Flag Warning (if Yellow/Blue/Checkered/Penalty) */}
      {session.flag !== 'GREEN' && (
        <div
          className={`px-3 py-1 rounded font-mono text-[12px] font-black tracking-wider flex items-center gap-1 ${
            session.flag === 'YELLOW'
              ? 'bg-amber-400 text-black animate-pulse'
              : session.flag === 'BLUE'
              ? 'bg-blue-600 text-white'
              : session.flag === 'CHECKERED'
              ? 'bg-white text-black'
              : 'bg-rose-600 text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{session.flag}</span>
        </div>
      )}
    </div>
  );
};
