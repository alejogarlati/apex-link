import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Clock, Flag, Zap } from 'lucide-react';

export const ZoneDTiming: React.FC = () => {
  const timing = useTelemetryStore((s) => s.telemetry.timing);

  return (
    <div className="w-[480px] h-full p-4 flex flex-col justify-between border-l border-zinc-800/80 bg-zinc-950/20 font-mono tabular-nums">
      {/* Header */}
      <div className="text-[11px] font-black tracking-widest text-zinc-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          OFFICIAL LAP TIMING
        </span>
        <span className="text-purple-400 font-bold">FIA GPS RECOVERY</span>
      </div>

      {/* 1. Current Lap Live Counter */}
      <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            CURRENT LAP TIME
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
            LIVE
          </span>
        </div>
        <div className="text-[40px] font-black text-white leading-none tracking-tight">
          {timing.lapTimeStr}
        </div>
      </div>

      {/* 2. Predicted Lap Time */}
      <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-800/40 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-cyan-400/80 uppercase tracking-wider">
            PREDICTED LAP TIME
          </span>
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="text-[34px] font-black text-cyan-300 leading-none tracking-tight">
          {timing.bestTimeStr !== '--:--.---'
            ? timing.bestTimeStr
            : '01:21.050'}
        </div>
      </div>

      {/* 3. Last Lap Time (Gold) */}
      <div className="p-4 rounded-lg bg-zinc-950/80 border border-amber-500/30 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-400/80 uppercase tracking-wider">
            LAST LAP TIME
          </span>
          <Flag className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="text-[34px] font-black text-amber-300 leading-none tracking-tight">
          {timing.lapTimeStr}
        </div>
      </div>

      {/* 4. Best Lap Time (Purple F1) */}
      <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-500/40 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-purple-400/80 uppercase tracking-wider">
            PERSONAL BEST
          </span>
          <span className="text-[10px] font-black text-purple-400 px-1.5 py-0.5 rounded bg-purple-900/40">
            RECORD
          </span>
        </div>
        <div className="text-[34px] font-black text-purple-300 leading-none tracking-tight">
          {timing.bestTimeStr}
        </div>
      </div>

      {/* 5. Sector Progress & Active Sector Bar */}
      <div className="px-4 py-3 rounded bg-zinc-900/60 border border-zinc-800 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400 font-bold">SECTOR SEGMENTS</span>
          <span className="text-cyan-400 font-black">
            ACTIVE: S{timing.sector}
          </span>
        </div>

        {/* 3 Sector Boxes */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className={`py-1.5 px-2 rounded text-center text-[12px] font-black border ${
              timing.sector === 1
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_#00E5FF]'
                : 'bg-zinc-950 text-zinc-500 border-zinc-800'
            }`}
          >
            S1: 28.1s
          </div>
          <div
            className={`py-1.5 px-2 rounded text-center text-[12px] font-black border ${
              timing.sector === 2
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_#00E5FF]'
                : 'bg-zinc-950 text-zinc-500 border-zinc-800'
            }`}
          >
            S2: 27.4s
          </div>
          <div
            className={`py-1.5 px-2 rounded text-center text-[12px] font-black border ${
              timing.sector === 3
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_#00E5FF]'
                : 'bg-zinc-950 text-zinc-500 border-zinc-800'
            }`}
          >
            S3: 25.6s
          </div>
        </div>
      </div>
    </div>
  );
};
