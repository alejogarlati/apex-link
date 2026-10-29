import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

interface TyreItemProps {
  label: string;
  pressurePsi: number;
  tempC: number;
  brakeTempC: number;
}

const MinimalTyreItem: React.FC<TyreItemProps> = ({
  label,
  pressurePsi,
  tempC,
  brakeTempC,
}) => {
  const getTempColor = (t: number) => {
    if (t < 75) return 'text-blue-400';
    if (t <= 100) return 'text-emerald-400';
    return 'text-rose-500 drop-shadow-[0_0_10px_rgba(255,23,68,0.4)]';
  };

  const isBrakeHot = brakeTempC > 650;

  return (
    <div className="w-[180px] flex flex-col gap-1 font-mono tabular-nums select-none">
      {/* Wheel identifier */}
      <span className="text-[12px] font-black tracking-widest text-zinc-500">
        {label}
      </span>

      {/* Temp (Large) & Pressure (Medium Cyan) side by side */}
      <div className="flex items-baseline justify-between">
        <span className={`text-[36px] font-black leading-none ${getTempColor(tempC)}`}>
          {tempC.toFixed(0)}°
        </span>
        <span className="text-[24px] font-bold text-cyan-400 leading-none">
          {pressurePsi.toFixed(1)}
        </span>
      </div>

      {/* Brake Disc Minimal Heat Bar */}
      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mt-1">
        <div
          style={{ width: `${Math.min(100, (brakeTempC / 1000) * 100)}%` }}
          className={`h-full transition-all duration-150 ${
            isBrakeHot
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_6px_#FF1744]'
              : 'bg-zinc-700'
          }`}
        />
      </div>
    </div>
  );
};

export const ZoneBTyresAndBrakes: React.FC = () => {
  const tyres = useTelemetryStore((s) => s.telemetry.tyres);
  const brakes = useTelemetryStore((s) => s.brakes);

  return (
    <div className="w-[480px] h-full p-8 flex flex-col justify-around border-r border-zinc-800 select-none">
      {/* Front Axle (FL, FR) */}
      <div className="flex items-center justify-between px-4">
        <MinimalTyreItem
          label="FL"
          pressurePsi={tyres.pressurePsi[0]}
          tempC={tyres.tempCoreC[0]}
          brakeTempC={brakes.tempDiscsC[0]}
        />
        <MinimalTyreItem
          label="FR"
          pressurePsi={tyres.pressurePsi[1]}
          tempC={tyres.tempCoreC[1]}
          brakeTempC={brakes.tempDiscsC[1]}
        />
      </div>

      {/* Rear Axle (RL, RR) */}
      <div className="flex items-center justify-between px-4">
        <MinimalTyreItem
          label="RL"
          pressurePsi={tyres.pressurePsi[2]}
          tempC={tyres.tempCoreC[2]}
          brakeTempC={brakes.tempDiscsC[2]}
        />
        <MinimalTyreItem
          label="RR"
          pressurePsi={tyres.pressurePsi[3]}
          tempC={tyres.tempCoreC[3]}
          brakeTempC={brakes.tempDiscsC[3]}
        />
      </div>
    </div>
  );
};
