import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { AlertCircle, Gauge } from 'lucide-react';

export const PitLimiterFullscreenOverlay: React.FC = () => {
  const pitLimiterActive = useTelemetryStore((s) => s.pitLimiterActive);
  const car = useTelemetryStore((s) => s.telemetry.car);
  const speedUnit = useTelemetryStore((s) => s.speedUnit);

  if (!pitLimiterActive) return null;

  const displaySpeed =
    speedUnit === 'MPH'
      ? (car.speedKmh * 0.621371).toFixed(1)
      : car.speedKmh.toFixed(1);

  const displayLimit = speedUnit === 'MPH' ? '50.0 MPH' : '80.0 KM/H';

  const gearText = car.gear === -1 ? 'R' : car.gear === 0 ? 'N' : String(car.gear);

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-between py-12 px-16 font-mono select-none animate-in fade-in duration-100">
      {/* 1. Header: PIT LIMITER ON (Massive Glowing Blue) */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4 text-cyan-400 animate-pulse">
          <AlertCircle className="w-14 h-14" />
          <h1 className="text-[76px] font-black tracking-widest uppercase leading-none shadow-[0_0_40px_#00E5FF]">
            PIT LIMITER ON
          </h1>
          <AlertCircle className="w-14 h-14" />
        </div>
        <span className="text-[18px] font-bold tracking-widest text-zinc-500 uppercase">
          PIT LANE SPEED REGULATION ACTIVE
        </span>
      </div>

      {/* 2. Middle Row: Gear (Large) + Speed (Colossal with 1 decimal) */}
      <div className="flex items-center justify-center gap-24 my-auto">
        {/* Gear Box */}
        <div className="flex flex-col items-center p-6 rounded-2xl bg-zinc-950 border-2 border-zinc-800 shadow-2xl">
          <span className="text-[16px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
            GEAR
          </span>
          <span className="text-[140px] font-black text-cyan-400 leading-none tabular-nums px-4">
            {gearText}
          </span>
        </div>

        {/* Speed Box */}
        <div className="flex flex-col items-center p-8 rounded-2xl bg-zinc-950 border-2 border-cyan-500/60 shadow-[0_0_50px_rgba(0,229,255,0.25)]">
          <span className="text-[16px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyan-400" />
            CURRENT SPEED
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-[160px] font-black text-white leading-none tabular-nums tracking-tighter">
              {displaySpeed}
            </span>
            <span className="text-[36px] font-black text-cyan-400 tracking-wider">
              {speedUnit}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Footer: Speed Limit Warning */}
      <div className="flex items-center justify-between w-full border-t border-zinc-900 pt-6 px-8 text-zinc-400 font-bold text-[20px]">
        <span>REGULATED PIT LANE ZONE</span>
        <span className="text-cyan-400 font-black tracking-wider">
          SPEED LIMIT: {displayLimit}
        </span>
        <span className="text-zinc-500">DEACTIVATES AT PIT EXIT LINE</span>
      </div>
    </div>
  );
};
