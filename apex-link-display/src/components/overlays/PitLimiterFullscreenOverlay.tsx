import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const PitLimiterFullscreenOverlay: React.FC = () => {
  const isInPitLane = useTelemetryStore(
    (s) => s.isInPitLane || s.mockScenario === 'PIT_LANE'
  );
  const pitLimiterActive = useTelemetryStore((s) => s.pitLimiterActive);
  const car = useTelemetryStore((s) => s.telemetry.car);
  const speedUnit = useTelemetryStore((s) => s.speedUnit);

  if (!isInPitLane) return null;

  const displaySpeed =
    speedUnit === 'MPH'
      ? (car.speedKmh * 0.621371).toFixed(1)
      : car.speedKmh.toFixed(1);

  // Speed limit in pit lane (80 km/h or ~50 mph)
  const isOverSpeed = car.speedKmh > 80.05;

  const gearText =
    car.gear === -1 ? 'R' : car.gear === 0 ? 'N' : String(car.gear);

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-12 font-mono select-none animate-in fade-in duration-75">
      <div className="w-full flex flex-col items-center justify-between h-full max-h-[700px] my-auto">
        {/* 1. Header: PIT LIMITER ON (Cyan) o PIT LIMITER OFF (Rojo/Alerta) */}
        <div className="flex flex-col items-center">
          {pitLimiterActive ? (
            <h1 className="text-[84px] font-black tracking-widest text-cyan-400 drop-shadow-[0_0_40px_#00E5FF] uppercase leading-none animate-pulse">
              PIT LIMITER ON
            </h1>
          ) : (
            <h1 className="text-[84px] font-black tracking-widest text-rose-500 drop-shadow-[0_0_45px_rgba(255,23,68,0.9)] uppercase leading-none animate-pulse">
              PIT LIMITER OFF
            </h1>
          )}
        </div>

        {/* 2. Middle Row: Gear (Large) + Speed (Colossal with 1 decimal) */}
        <div className="flex items-center justify-center gap-20 my-auto">
          {/* Gear Box */}
          <div className="flex flex-col items-center justify-center w-[220px] h-[260px] rounded-2xl bg-zinc-950 border-2 border-zinc-800 shadow-2xl">
            <span className="text-[14px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
              GEAR
            </span>
            <span className="text-[150px] font-black text-cyan-400 leading-none tabular-nums">
              {gearText}
            </span>
          </div>

          {/* Speed Box (Se muestra en ROJO alertando si se excede el límite de 80 km/h) */}
          <div
            className={`flex flex-col items-center justify-center min-w-[540px] h-[260px] px-12 rounded-2xl transition-all duration-150 ${
              isOverSpeed
                ? 'bg-rose-950/70 border-4 border-rose-500 shadow-[0_0_70px_rgba(255,23,68,0.9)] animate-pulse'
                : 'bg-zinc-950 border-2 border-cyan-500/60 shadow-[0_0_50px_rgba(0,229,255,0.25)]'
            }`}
          >
            <div className="flex items-baseline gap-4">
              <span
                className={`text-[170px] font-black leading-none tabular-nums tracking-tighter ${
                  isOverSpeed ? 'text-rose-500 drop-shadow-[0_0_30px_#FF1744]' : 'text-white'
                }`}
              >
                {displaySpeed}
              </span>
              <span
                className={`text-[36px] font-black tracking-wider ${
                  isOverSpeed ? 'text-rose-400' : 'text-cyan-400'
                }`}
              >
                {speedUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Marginal empty space to keep vertical balance */}
        <div className="h-4" />
      </div>
    </div>
  );
};
