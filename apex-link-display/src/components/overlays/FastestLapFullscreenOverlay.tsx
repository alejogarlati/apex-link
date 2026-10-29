import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const FastestLapFullscreenOverlay: React.FC = () => {
  const timedOverlay = useTelemetryStore((s) => s.timedOverlay);

  if (!timedOverlay || timedOverlay.type !== 'FASTEST_LAP') return null;

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-12 font-mono select-none animate-in fade-in duration-75">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Valor: Lap Time (Massive) */}
        <div>
          <span className="text-[200px] font-black leading-none tabular-nums tracking-tighter text-purple-400 drop-shadow-[0_0_60px_rgba(192,38,211,0.6)]">
            {timedOverlay.lapTimeStr}
          </span>
        </div>

        {/* Título: NEW FASTEST LAP */}
        <h1 className="text-[64px] font-black tracking-[0.25em] text-white uppercase drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
          NEW FASTEST LAP
        </h1>
      </div>
    </div>
  );
};
