import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const ZoneDTiming: React.FC = () => {
  const timing = useTelemetryStore((s) => s.telemetry.timing);

  const predictedStr =
    timing.bestTimeStr !== '--:--.---' ? timing.bestTimeStr : '01:21.050';

  return (
    <div className="w-[480px] h-full py-6 px-10 flex flex-col justify-around items-center border-l border-zinc-800 font-mono tabular-nums select-none">
      {/* 1. PREDICTED */}
      <div className="flex flex-col items-center">
        <span className="text-[16px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
          PREDICTED
        </span>
        <span className="text-[52px] font-black text-zinc-200 leading-none tracking-tight mt-1">
          {predictedStr}
        </span>
      </div>

      {/* 2. ACTUAL */}
      <div className="flex flex-col items-center">
        <span className="text-[16px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
          ACTUAL
        </span>
        <span className="text-[52px] font-black text-white leading-none tracking-tight mt-1">
          {timing.lapTimeStr}
        </span>
      </div>

      {/* 3. BEST */}
      <div className="flex flex-col items-center">
        <span className="text-[16px] font-bold tracking-[0.25em] text-purple-400 uppercase">
          BEST
        </span>
        <span className="text-[52px] font-black text-purple-400 leading-none tracking-tight mt-1 drop-shadow-[0_0_25px_rgba(168,85,247,0.45)]">
          {timing.bestTimeStr}
        </span>
      </div>
    </div>
  );
};
