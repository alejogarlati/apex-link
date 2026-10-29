import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Award, Zap } from 'lucide-react';

export const FastestLapFullscreenOverlay: React.FC = () => {
  const timedOverlay = useTelemetryStore((s) => s.timedOverlay);

  if (!timedOverlay || timedOverlay.type !== 'FASTEST_LAP') return null;

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-12 font-mono select-none animate-in fade-in duration-75">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Header Badge */}
        <div className="flex items-center gap-3 text-purple-400 font-black text-[22px] tracking-[0.3em] uppercase bg-purple-950/40 px-6 py-2 rounded-full border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
          <Award className="w-7 h-7 text-purple-400" />
          <span>LAP {timedOverlay.lapNumber} COMPLETED</span>
          <Zap className="w-6 h-6 text-purple-400 animate-pulse" />
        </div>

        {/* Lap Time (Massive) */}
        <div className="my-6">
          <span className="text-[170px] font-black leading-none tabular-nums tracking-tighter text-purple-400 drop-shadow-[0_0_50px_rgba(192,38,211,0.5)]">
            {timedOverlay.lapTimeStr}
          </span>
        </div>

        {/* Text underneath: 'NEW FASTEST LAP' */}
        <h1 className="text-[52px] font-black tracking-[0.25em] text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          NEW FASTEST LAP
        </h1>

        <span className="text-[20px] font-bold tracking-widest text-zinc-500 uppercase mt-2">
          SESSION BEST SECTOR TIMES OVERALL
        </span>
      </div>
    </div>
  );
};
