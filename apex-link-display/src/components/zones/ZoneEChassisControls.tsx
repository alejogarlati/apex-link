import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const ZoneEChassisControls: React.FC = () => {
  const chassis = useTelemetryStore((s) => s.chassis);
  const fuel = useTelemetryStore((s) => s.fuel);

  const tcDisplay = chassis.tc === 0 ? 'OFF' : chassis.tc === 1 ? 'ON' : String(chassis.tc);
  const absDisplay = chassis.abs === 0 ? 'OFF' : chassis.abs === 1 ? 'ON' : String(chassis.abs);

  return (
    <div className="w-[1920px] h-full grid grid-cols-4 border-t border-zinc-800 font-mono select-none">
      {/* 1. TC */}
      <div className="flex flex-col items-center justify-center border-r border-zinc-800/80">
        <span className="text-[22px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
          TC
        </span>
        <span className="text-[65px] font-black text-cyan-400 leading-none mt-1">
          {tcDisplay}
        </span>
      </div>

      {/* 2. FUEL RESTANTE (Litros con 1 decimal) */}
      <div className="flex flex-col items-center justify-center border-r border-zinc-800/80">
        <span className="text-[22px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
          FUEL
        </span>
        <span className="text-[65px] font-black text-amber-400 leading-none mt-1 tabular-nums">
          {fuel.remainingLiters.toFixed(1)} L
        </span>
      </div>

      {/* 3. ABS */}
      <div className="flex flex-col items-center justify-center border-r border-zinc-800/80">
        <span className="text-[22px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
          ABS
        </span>
        <span className="text-[65px] font-black text-rose-400 leading-none mt-1">
          {absDisplay}
        </span>
      </div>

      {/* 4. BIAS */}
      <div className="flex flex-col items-center justify-center">
        <span className="text-[22px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
          BIAS
        </span>
        <span className="text-[65px] font-black text-white leading-none mt-1 tabular-nums">
          {chassis.brakeBias.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};
