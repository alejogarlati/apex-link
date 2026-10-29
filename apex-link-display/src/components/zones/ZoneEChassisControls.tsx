import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const ZoneEChassisControls: React.FC = () => {
  const chassis = useTelemetryStore((s) => s.chassis);
  const setChassisValue = useTelemetryStore((s) => s.setChassisValue);

  const cycleTC = () => {
    const next = chassis.tc >= 8 ? 1 : chassis.tc + 1;
    setChassisValue('tc', next);
  };

  const cycleTCCut = () => {
    const next = chassis.tcCut >= 8 ? 1 : chassis.tcCut + 1;
    setChassisValue('tcCut', next);
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

  const cycleMap = () => {
    const maps = ['RACE 1', 'QUAL 1', 'MIX 2', 'DEFENSE', 'WET'];
    const currentIndex = maps.indexOf(chassis.engineMap);
    const next = maps[(currentIndex + 1) % maps.length];
    setChassisValue('engineMap', next);
  };

  return (
    <div className="w-[1920px] h-full grid grid-cols-5 border-t border-zinc-800 font-mono select-none">
      {/* 1. TC */}
      <button
        onClick={cycleTC}
        title="Toca para ajustar TC"
        className="flex flex-col items-center justify-center border-r border-zinc-800/80 hover:bg-zinc-950/40 transition-colors cursor-pointer"
      >
        <span className="text-[16px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
          TC
        </span>
        <span className="text-[48px] font-black text-cyan-400 leading-none mt-2">
          {chassis.tc}
        </span>
      </button>

      {/* 2. TC CUT */}
      <button
        onClick={cycleTCCut}
        title="Toca para ajustar TC CUT"
        className="flex flex-col items-center justify-center border-r border-zinc-800/80 hover:bg-zinc-950/40 transition-colors cursor-pointer"
      >
        <span className="text-[16px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
          TC CUT
        </span>
        <span className="text-[48px] font-black text-amber-400 leading-none mt-2">
          {chassis.tcCut}
        </span>
      </button>

      {/* 3. ABS */}
      <button
        onClick={cycleABS}
        title="Toca para ajustar ABS"
        className="flex flex-col items-center justify-center border-r border-zinc-800/80 hover:bg-zinc-950/40 transition-colors cursor-pointer"
      >
        <span className="text-[16px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
          ABS
        </span>
        <span className="text-[48px] font-black text-rose-400 leading-none mt-2">
          {chassis.abs}
        </span>
      </button>

      {/* 4. BIAS */}
      <button
        onClick={cycleBias}
        title="Toca para ajustar BIAS (+0.5%, Shift para -0.5%)"
        className="flex flex-col items-center justify-center border-r border-zinc-800/80 hover:bg-zinc-950/40 transition-colors cursor-pointer"
      >
        <span className="text-[16px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
          BIAS
        </span>
        <span className="text-[48px] font-black text-white leading-none mt-2 tabular-nums">
          {chassis.brakeBias.toFixed(1)}%
        </span>
      </button>

      {/* 5. MAP */}
      <button
        onClick={cycleMap}
        title="Toca para alternar Mapa Motor"
        className="flex flex-col items-center justify-center hover:bg-zinc-950/40 transition-colors cursor-pointer"
      >
        <span className="text-[16px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
          MAP
        </span>
        <span className="text-[40px] font-black text-purple-400 leading-none mt-2 tracking-tight">
          {chassis.engineMap}
        </span>
      </button>
    </div>
  );
};
