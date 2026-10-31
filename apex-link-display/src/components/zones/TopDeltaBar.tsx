import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Maximize2, Minimize2 } from 'lucide-react';

interface Props {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenDiagnostics?: () => void;
}

export const TopDeltaBar: React.FC<Props> = ({
  isFullscreen,
  onToggleFullscreen,
  onOpenDiagnostics,
}) => {
  const deltaMs = useTelemetryStore((s) => s.telemetry.timing.deltaMs);
  const flag = useTelemetryStore((s) => s.telemetry.session.flag);
  const isConnected = useTelemetryStore((s) => s.isConnected);

  const isFaster = deltaMs < 0;
  const isSlower = deltaMs > 0;
  const deltaSec = (deltaMs / 1000).toFixed(3);
  const formattedDelta =
    deltaMs === 0 ? '0.000' : isFaster ? `${deltaSec}` : `+${deltaSec}`;

  // Clamped 0..100% of half-bar (scale +/- 1.5 seconds)
  const clampedDelta = Math.max(-1500, Math.min(1500, deltaMs));
  const barPercent = (Math.abs(clampedDelta) / 1500) * 100;

  return (
    <div className="w-[1920px] h-[72px] px-8 flex items-center justify-between border-b border-zinc-800 bg-black font-mono select-none">
      {/* Left Column (480px): Minimal flag warning if yellow/red */}
      <div className="w-[480px] flex items-center gap-4">
        {/* Subtle connection dot */}
        <button
          onClick={onOpenDiagnostics}
          title="Abrir diagnósticos"
          className="w-3.5 h-3.5 rounded-full cursor-pointer hover:scale-125 transition-transform"
        >
          <span
            className={`block w-full h-full rounded-full ${
              isConnected ? 'bg-emerald-500/80 shadow-[0_0_8px_#10B981]' : 'bg-rose-500'
            }`}
          />
        </button>

        {flag !== 'GREEN' && (
          <span
            className={`text-[20px] font-black tracking-widest uppercase ${
              flag === 'YELLOW' ? 'text-amber-400 animate-pulse' : 'text-rose-500'
            }`}
          >
            {flag}
          </span>
        )}
      </div>

      {/* Center Column (960px): Minimal Delta Bar without boxes */}
      <div className="w-[960px] flex items-center justify-center gap-6">
        {/* Left Green Bar (Faster) */}
        <div className="w-[280px] h-3.5 bg-zinc-900 rounded-l-[2px] overflow-hidden flex justify-end">
          {isFaster && (
            <div
              style={{ width: `${barPercent}%` }}
              className="h-full bg-emerald-500 shadow-[0_0_12px_#00E676] transition-all duration-75"
            />
          )}
        </div>

        {/* Floating Numeric Delta (Engrandecido un 35%: 36px -> 50px) */}
        <div className="w-[220px] flex items-center justify-center">
          <span
            className={`text-[50px] font-black leading-none tabular-nums tracking-tight ${
              isFaster
                ? 'text-emerald-400 drop-shadow-[0_0_20px_rgba(0,230,118,0.5)]'
                : isSlower
                ? 'text-rose-500 drop-shadow-[0_0_20px_rgba(255,23,68,0.5)]'
                : 'text-zinc-500'
            }`}
          >
            {formattedDelta}
          </span>
        </div>

        {/* Right Red Bar (Slower) */}
        <div className="w-[280px] h-3.5 bg-zinc-900 rounded-r-[2px] overflow-hidden flex justify-start">
          {isSlower && (
            <div
              style={{ width: `${barPercent}%` }}
              className="h-full bg-rose-500 shadow-[0_0_12px_#FF1744] transition-all duration-75"
            />
          )}
        </div>
      </div>

      {/* Right Column (480px): Discreet Fullscreen Toggle */}
      <div className="w-[480px] flex items-center justify-end">
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Salir de Pantalla Completa' : 'Modo Pantalla Completa'}
          className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
