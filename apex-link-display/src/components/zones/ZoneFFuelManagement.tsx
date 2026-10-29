import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Fuel, Gauge, AlertTriangle } from 'lucide-react';

export const ZoneFFuelManagement: React.FC = () => {
  const fuel = useTelemetryStore((s) => s.fuel);

  const isLowFuel = fuel.lapsAutonomy <= 3;
  const tankPercent = Math.min(100, (fuel.remainingLiters / 105.0) * 100); // 105L max capacity

  return (
    <div className="w-[840px] h-[152px] p-5 flex flex-col justify-between border-t border-zinc-800/80 bg-zinc-950/60 font-mono tabular-nums">
      <div className="flex items-center justify-between text-[11px] font-black tracking-widest text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Fuel className="w-3.5 h-3.5 text-cyan-400" />
          FUEL MANAGEMENT & ESTIMATED AUTONOMY
        </span>
        {isLowFuel ? (
          <span className="flex items-center gap-1 text-rose-500 font-black animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            LOW FUEL WARNING (BOX THIS LAP)
          </span>
        ) : (
          <span className="text-emerald-500 font-bold">STINT GREEN</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Tank Level */}
        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400">
            <span>FUEL IN TANK</span>
            <span className="text-cyan-400 font-bold">{tankPercent.toFixed(0)}%</span>
          </div>
          <div className="text-[30px] font-black text-white leading-none my-0.5">
            {fuel.remainingLiters.toFixed(1)} <span className="text-[16px] text-zinc-500 font-bold">L</span>
          </div>
          {/* Tank Level Bar */}
          <div className="w-full h-1.5 bg-zinc-950 rounded overflow-hidden mt-1">
            <div
              style={{ width: `${tankPercent}%` }}
              className={`h-full transition-all duration-300 ${
                isLowFuel ? 'bg-rose-500 shadow-[0_0_8px_#FF1744]' : 'bg-cyan-400'
              }`}
            />
          </div>
        </div>

        {/* Consumption per Lap */}
        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400">
            <span>CONSUMPTION</span>
            <Gauge className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="text-[30px] font-black text-amber-300 leading-none my-0.5">
            {fuel.consumptionPerLap.toFixed(2)}{' '}
            <span className="text-[16px] text-zinc-500 font-bold">L/LAP</span>
          </div>
          <span className="text-[9px] text-zinc-500 font-semibold">DELTA TARGET: -0.15L</span>
        </div>

        {/* Laps Autonomy */}
        <div
          className={`p-2.5 rounded-lg border flex flex-col justify-between ${
            isLowFuel
              ? 'bg-rose-950/30 border-rose-500/80 text-rose-400 animate-pulse'
              : 'bg-zinc-900/80 border-zinc-700/60'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400">
            <span>PROJECTED LAPS</span>
            <span className="text-[10px] font-black text-purple-400">DELTA: +1.2</span>
          </div>
          <div
            className={`text-[30px] font-black leading-none my-0.5 ${
              isLowFuel ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {fuel.lapsAutonomy} <span className="text-[16px] text-zinc-500 font-bold">LAPS</span>
          </div>
          <span className="text-[9px] text-zinc-500 font-semibold">SAFE WINDOW: LAP 21</span>
        </div>
      </div>
    </div>
  );
};
