import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const ZoneDTiming: React.FC = () => {
  const timing = useTelemetryStore((s) => s.telemetry.timing);
  const bestLapTimeStr = useTelemetryStore((s) => s.bestLapTimeStr);
  const lastCompletedLap = useTelemetryStore((s) => s.lastCompletedLap);

  const bestFormatted =
    timing.bestTimeStr && timing.bestTimeStr !== '--:--.---' && timing.bestTimeStr !== '-:--:---'
      ? timing.bestTimeStr
      : bestLapTimeStr && bestLapTimeStr !== '--:--.---' && bestLapTimeStr !== '-:--:---'
      ? bestLapTimeStr
      : '--:--.---';

  const lastLapFormatted =
    timing.lastLapTimeStr && timing.lastLapTimeStr !== '--:--.---' && timing.lastLapTimeStr !== '-:--:---'
      ? timing.lastLapTimeStr
      : lastCompletedLap?.lapTimeStr && lastCompletedLap.lapTimeStr !== '-:--:---'
      ? lastCompletedLap.lapTimeStr
      : '--:--.---';

  const actualStr = timing.lapTimeStr && timing.lapTimeStr !== '-:--:---' ? timing.lapTimeStr : '00:00.000';

  return (
    <div className="w-[480px] h-full py-6 px-10 flex flex-col justify-around items-center border-l border-zinc-800 font-mono tabular-nums select-none">
      {/* 1. LAST (Engrandecido un 35%: etiqueta 22px, número 70px) */}
      <div className="flex flex-col items-center">
        <span className="text-[22px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
          LAST
        </span>
        <span className="text-[70px] font-black text-zinc-200 leading-none tracking-tight mt-1">
          {lastLapFormatted}
        </span>
      </div>

      {/* 2. ACTUAL (Engrandecido un 35%: etiqueta 22px, número 70px) */}
      <div className="flex flex-col items-center">
        <span className="text-[22px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
          ACTUAL
        </span>
        <span className="text-[70px] font-black text-white leading-none tracking-tight mt-1">
          {actualStr}
        </span>
      </div>

      {/* 3. BEST (Engrandecido un 35%: etiqueta 22px, número 70px) */}
      <div className="flex flex-col items-center">
        <span className="text-[22px] font-bold tracking-[0.25em] text-purple-400 uppercase">
          BEST
        </span>
        <span className="text-[70px] font-black text-purple-400 leading-none tracking-tight mt-1 drop-shadow-[0_0_30px_rgba(168,85,247,0.55)]">
          {bestFormatted}
        </span>
      </div>
    </div>
  );
};
