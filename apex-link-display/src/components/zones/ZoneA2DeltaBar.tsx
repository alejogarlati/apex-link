import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const ZoneA2DeltaBar: React.FC = () => {
  const deltaMs = useTelemetryStore((s) => s.telemetry.timing.deltaMs);

  const isFaster = deltaMs < 0;
  const isSlower = deltaMs > 0;
  const deltaSec = (deltaMs / 1000).toFixed(3);
  const formattedDelta = deltaMs === 0 ? '0.000' : isFaster ? `${deltaSec}` : `+${deltaSec}`;

  // Normalize bar width percentage (-1500ms to +1500ms -> 0% to 100% of half bar)
  const clampedDelta = Math.max(-1500, Math.min(1500, deltaMs));
  const barPercent = Math.abs(clampedDelta) / 1500 * 100;

  return (
    <div className="w-[960px] h-[72px] px-6 flex items-center justify-center gap-6 border-b border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm">
      {/* Left side bar (Grows to the left when faster / green) */}
      <div className="w-[280px] h-4 bg-zinc-900/80 rounded-l overflow-hidden flex justify-end border border-zinc-800">
        {isFaster && (
          <div
            style={{ width: `${barPercent}%` }}
            className="h-full bg-gradient-to-l from-emerald-400 to-emerald-600 shadow-[0_0_12px_#00E676] transition-all duration-75"
          />
        )}
      </div>

      {/* Center Numeric Delta Box */}
      <div
        className={`w-[240px] h-[52px] rounded-md flex flex-col items-center justify-center border font-mono tabular-nums transition-colors duration-150 ${
          isFaster
            ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-400 shadow-[0_0_20px_rgba(0,230,118,0.25)]'
            : isSlower
            ? 'bg-rose-950/40 border-rose-500/80 text-rose-500 shadow-[0_0_20px_rgba(255,23,68,0.25)]'
            : 'bg-zinc-900/60 border-zinc-700/60 text-zinc-400'
        }`}
      >
        <div className="text-[10px] tracking-widest font-black uppercase text-zinc-400">
          DELTA / BEST
        </div>
        <div className="text-[28px] font-black leading-none tracking-tight">
          {formattedDelta}
        </div>
      </div>

      {/* Right side bar (Grows to the right when slower / red) */}
      <div className="w-[280px] h-4 bg-zinc-900/80 rounded-r overflow-hidden flex justify-start border border-zinc-800">
        {isSlower && (
          <div
            style={{ width: `${barPercent}%` }}
            className="h-full bg-gradient-to-r from-rose-500 to-rose-700 shadow-[0_0_12px_#FF1744] transition-all duration-75"
          />
        )}
      </div>
    </div>
  );
};
