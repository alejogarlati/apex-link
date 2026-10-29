import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

interface TyreWidgetProps {
  label: string;
  pressurePsi: number;
  tempC: number;
  wearPct: number;
  brakeTempC: number;
}

const TyreItem: React.FC<TyreWidgetProps> = ({
  label,
  pressurePsi,
  tempC,
  wearPct,
  brakeTempC,
}) => {
  // Thermal color gradient
  const getTempColor = (t: number) => {
    if (t < 75) return 'text-blue-400 border-blue-500/40 bg-blue-950/20';
    if (t <= 100) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    return 'text-rose-500 border-rose-500/60 bg-rose-950/30 shadow-[0_0_12px_rgba(255,23,68,0.3)]';
  };

  const isBrakeGlowing = brakeTempC > 650;

  return (
    <div className="w-[210px] p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex flex-col gap-2 font-mono tabular-nums">
      {/* Header: Wheel Label + Wear */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-black tracking-widest text-zinc-400">
          {label}
        </span>
        <span className={`text-[11px] font-bold ${wearPct < 70 ? 'text-amber-400 animate-pulse' : 'text-zinc-500'}`}>
          {wearPct.toFixed(0)}%
        </span>
      </div>

      {/* Main Wheel Box with Thermal Gradient */}
      <div className={`p-2.5 rounded border flex items-center justify-between ${getTempColor(tempC)}`}>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
            TEMP CORE
          </span>
          <span className="text-[26px] font-black leading-none">
            {tempC.toFixed(0)}<span className="text-[14px]">°C</span>
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
            PRESSURE
          </span>
          <span className="text-[22px] font-black text-cyan-400 leading-none">
            {pressurePsi.toFixed(1)}<span className="text-[11px] text-cyan-600 ml-0.5">PSI</span>
          </span>
        </div>
      </div>

      {/* Brake Disc Temperature Bar */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-zinc-500 font-bold">BRAKE DISC</span>
          <span className={`font-black ${isBrakeGlowing ? 'text-amber-400 animate-pulse' : 'text-zinc-400'}`}>
            {brakeTempC}°C
          </span>
        </div>
        <div className="w-full h-1.5 bg-zinc-900 rounded overflow-hidden">
          <div
            style={{ width: `${Math.min(100, (brakeTempC / 1000) * 100)}%` }}
            className={`h-full transition-all duration-150 ${
              isBrakeGlowing
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_8px_#FF9100]'
                : 'bg-zinc-600'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export const ZoneBTyresAndBrakes: React.FC = () => {
  const tyres = useTelemetryStore((s) => s.telemetry.tyres);
  const brakes = useTelemetryStore((s) => s.brakes);

  return (
    <div className="w-[480px] h-full p-5 flex flex-col justify-between border-r border-zinc-800/80 bg-zinc-950/20">
      <div className="text-[11px] font-mono font-black tracking-widest text-zinc-500 flex items-center justify-between">
        <span>TYRE DYNAMICS & BRAKES</span>
        <span className="text-cyan-400">PIR-F1 SPEC</span>
      </div>

      {/* Front Axle */}
      <div className="flex items-center justify-between">
        <TyreItem
          label="FRONT LEFT (FL)"
          pressurePsi={tyres.pressurePsi[0]}
          tempC={tyres.tempCoreC[0]}
          wearPct={tyres.wear[0]}
          brakeTempC={brakes.tempDiscsC[0]}
        />
        <TyreItem
          label="FRONT RIGHT (FR)"
          pressurePsi={tyres.pressurePsi[1]}
          tempC={tyres.tempCoreC[1]}
          wearPct={tyres.wear[1]}
          brakeTempC={brakes.tempDiscsC[1]}
        />
      </div>

      {/* Rear Axle */}
      <div className="flex items-center justify-between">
        <TyreItem
          label="REAR LEFT (RL)"
          pressurePsi={tyres.pressurePsi[2]}
          tempC={tyres.tempCoreC[2]}
          wearPct={tyres.wear[2]}
          brakeTempC={brakes.tempDiscsC[2]}
        />
        <TyreItem
          label="REAR RIGHT (RR)"
          pressurePsi={tyres.pressurePsi[3]}
          tempC={tyres.tempCoreC[3]}
          wearPct={tyres.wear[3]}
          brakeTempC={brakes.tempDiscsC[3]}
        />
      </div>

      {/* Compound & Wear Summary */}
      <div className="px-4 py-2.5 rounded bg-zinc-900/60 border border-zinc-800 flex items-center justify-between font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#FF1744]" />
          <span className="font-black text-zinc-300">COMPOUND: SOFT (C3)</span>
        </div>
        <span className="text-zinc-500 font-bold">OPTIMAL: 85-100°C</span>
      </div>
    </div>
  );
};
