import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const ZoneEChassisControls: React.FC = () => {
  const chassis = useTelemetryStore((s) => s.chassis);
  const fuel = useTelemetryStore((s) => s.fuel);
  const setChassisValue = useTelemetryStore((s) => s.setChassisValue);

  const cycleTC = () => {
    const next = chassis.tc >= 8 ? 1 : chassis.tc + 1;
    setChassisValue('tc', next);
  };

  const cycleABS = () => {
    const next = chassis.abs >= 10 ? 1 : chassis.abs + 1;
    setChassisValue('abs', next);
  };

  const cycleBias = (e: React.MouseEvent) => {
    const delta = e.shiftKey ? -0.5 : 0.5;
    let next = Math.round((chassis.brakeBias + delta) * 10) / 10;
    if (next > 68.0) next = 50.0;
    if (next < 50.0) next = 68.0;
    setChassisValue('brakeBias', next);
  };

  const tcDisplay = chassis.tc === 0 ? 'OFF' : chassis.tc === 1 ? 'ON' : String(chassis.tc);
  const absDisplay = chassis.abs === 0 ? 'OFF' : chassis.abs === 1 ? 'ON' : String(chassis.abs);

  return (
    <div className="w-[1920px] h-full grid grid-cols-4 border-t border-zinc-800 font-mono select-none">
      {/* 1. TC */}
      <button
        onClick={cycleTC}
        title="Toca para ajustar TC"
        className="flex flex-col items-center justify-center border-r border-zinc-800/80 hover:bg-zinc-950/40 transition-colors cursor-pointer"
      >
        <span className="text-[22px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
          TC
        </span>
        <span className="text-[65px] font-black text-cyan-400 leading-none mt-1">
          {tcDisplay}
        </span>
      </button>

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
      <button
        onClick={cycleABS}
        title="Toca para ajustar ABS"
        className="flex flex-col items-center justify-center border-r border-zinc-800/80 hover:bg-zinc-950/40 transition-colors cursor-pointer"
      >
        <span className="text-[22px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
          ABS
        </span>
        <span className="text-[65px] font-black text-rose-400 leading-none mt-1">
          {absDisplay}
        </span>
      </button>

      {/* 4. BIAS */}
      <button
        onClick={cycleBias}
        title="Toca para ajustar BIAS (+0.5%, Shift para -0.5%)"
        className="flex flex-col items-center justify-center hover:bg-zinc-950/40 transition-colors cursor-pointer"
      >
        <span className="text-[22px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
          BIAS
        </span>
        <span className="text-[65px] font-black text-white leading-none mt-1 tabular-nums">
          {chassis.brakeBias.toFixed(1)}%
        </span>
      </button>
    </div>
  );
};
