import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const ChassisFullscreenOverlay: React.FC = () => {
  const timedOverlay = useTelemetryStore((s) => s.timedOverlay);

  if (!timedOverlay || timedOverlay.type !== 'CHASSIS_CHANGE') return null;

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-12 font-mono select-none animate-in fade-in duration-75">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Título: Parameter Name (e.g. "BRAKE BIAS", "TRACTION CONTROL", "ABS") */}
        <h1 className="text-[72px] font-black tracking-widest text-zinc-300 uppercase">
          {timedOverlay.parameter}
        </h1>

        {/* Valor Masivo (e.g. "58.5%", "3", "4") */}
        <div>
          <span
            className={`text-[220px] font-black leading-none tabular-nums tracking-tighter ${timedOverlay.color} drop-shadow-[0_0_50px_rgba(255,255,255,0.25)]`}
          >
            {timedOverlay.value}
          </span>
        </div>
      </div>
    </div>
  );
};
