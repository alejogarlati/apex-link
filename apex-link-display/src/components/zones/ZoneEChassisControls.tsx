import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Sliders, Activity, Disc, Cpu } from 'lucide-react';

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

  const adjustBias = (delta: number) => {
    const next = Math.round((chassis.brakeBias + delta) * 10) / 10;
    if (next >= 50.0 && next <= 68.0) {
      setChassisValue('brakeBias', next);
    }
  };

  const cycleMap = () => {
    const maps = ['RACE 1', 'QUAL 1', 'MIX 2', 'DEFENSE', 'WET'];
    const currentIndex = maps.indexOf(chassis.engineMap);
    const next = maps[(currentIndex + 1) % maps.length];
    setChassisValue('engineMap', next);
  };

  return (
    <div className="w-[1080px] h-full p-3 px-5 flex flex-col justify-between border-t border-r border-zinc-800/80 bg-zinc-950/60 font-mono">
      <div className="flex items-center justify-between text-[11px] font-black tracking-widest text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          CHASSIS ELECTRONICS & CONTROL MATRIX
        </span>
        <span className="text-zinc-600">STEERING WHEEL DIALS ACTIVE</span>
      </div>

      <div className="grid grid-cols-5 gap-3.5">
        {/* TC 1 */}
        <button
          onClick={cycleTC}
          className="p-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 flex flex-col items-center justify-between transition-all cursor-pointer group active:scale-95"
        >
          <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" />
            TC (TRAC)
          </span>
          <span className="text-[28px] font-black text-cyan-400 group-hover:text-cyan-300 leading-none my-0.5">
            {chassis.tc}
          </span>
          <span className="text-[9px] text-zinc-500 font-semibold">1..8 LEVELS</span>
        </button>

        {/* TC CUT */}
        <button
          onClick={cycleTCCut}
          className="p-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 flex flex-col items-center justify-between transition-all cursor-pointer group active:scale-95"
        >
          <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
            <Activity className="w-3 h-3 text-amber-400" />
            TC CUT
          </span>
          <span className="text-[28px] font-black text-amber-400 group-hover:text-amber-300 leading-none my-0.5">
            {chassis.tcCut}
          </span>
          <span className="text-[9px] text-zinc-500 font-semibold">RATE SLIP</span>
        </button>

        {/* ABS */}
        <button
          onClick={cycleABS}
          className="p-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 flex flex-col items-center justify-between transition-all cursor-pointer group active:scale-95"
        >
          <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
            <Disc className="w-3 h-3 text-rose-500" />
            ABS
          </span>
          <span className="text-[28px] font-black text-rose-400 group-hover:text-rose-300 leading-none my-0.5">
            {chassis.abs}
          </span>
          <span className="text-[9px] text-zinc-500 font-semibold">1..10 ANTI-LOCK</span>
        </button>

        {/* BRAKE BIAS */}
        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-700/60 flex flex-col items-center justify-between">
          <div className="flex items-center justify-between w-full text-[10px] font-bold text-zinc-400">
            <span>BRAKE BIAS</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => adjustBias(-0.5)}
                className="w-4 h-4 rounded bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center font-bold text-[10px] cursor-pointer"
              >
                -
              </button>
              <button
                onClick={() => adjustBias(0.5)}
                className="w-4 h-4 rounded bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center font-bold text-[10px] cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
          <span className="text-[26px] font-black text-white tabular-nums leading-none my-0.5">
            {chassis.brakeBias.toFixed(1)}%
          </span>
          <span className="text-[9px] text-zinc-500 font-semibold">FRONT AXLE</span>
        </div>

        {/* ENGINE MAP */}
        <button
          onClick={cycleMap}
          className="p-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 flex flex-col items-center justify-between transition-all cursor-pointer group active:scale-95"
        >
          <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-purple-400" />
            MAP MOTOR
          </span>
          <span className="text-[20px] font-black text-purple-400 group-hover:text-purple-300 leading-none my-1 tracking-tight">
            {chassis.engineMap}
          </span>
          <span className="text-[9px] text-zinc-500 font-semibold">ECU PROFILE</span>
        </button>
      </div>
    </div>
  );
};
