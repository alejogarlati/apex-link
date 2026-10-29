import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Sliders } from 'lucide-react';

export const ChassisFullscreenOverlay: React.FC = () => {
  const timedOverlay = useTelemetryStore((s) => s.timedOverlay);

  if (!timedOverlay || timedOverlay.type !== 'CHASSIS_CHANGE') return null;

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-12 font-mono select-none animate-in fade-in duration-75">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Category Header */}
        <div className="flex items-center gap-3 text-zinc-500 font-black text-[22px] tracking-[0.3em] uppercase">
          <Sliders className="w-7 h-7 text-cyan-400" />
          <span>CHASSIS ELECTRONICS ADJUSTMENT</span>
        </div>

        {/* Parameter Name (e.g. "BRAKE BIAS", "TRACTION CONTROL", "ABS") */}
        <h1 className="text-[64px] font-black tracking-widest text-zinc-200 uppercase mt-2">
          {timedOverlay.parameter}
        </h1>

        {/* Massive Value (e.g. "58.5%", "3", "4") */}
        <div className="my-6">
          <span
            className={`text-[190px] font-black leading-none tabular-nums tracking-tighter ${timedOverlay.color} drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]`}
          >
            {timedOverlay.value}
          </span>
        </div>

        {/* Subtext info */}
        {timedOverlay.subtext && (
          <span className="text-[24px] font-bold tracking-widest text-zinc-400 uppercase border border-zinc-800 px-6 py-2 rounded-full bg-zinc-950">
            {timedOverlay.subtext}
          </span>
        )}
      </div>
    </div>
  );
};
