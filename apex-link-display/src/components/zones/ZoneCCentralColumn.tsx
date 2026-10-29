import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const ZoneCCentralColumn: React.FC = () => {
  const car = useTelemetryStore((s) => s.telemetry.car);
  const session = useTelemetryStore((s) => s.telemetry.session);
  const speedUnit = useTelemetryStore((s) => s.speedUnit);
  const toggleSpeedUnit = useTelemetryStore((s) => s.toggleSpeedUnit);

  // Speed unit conversion
  const displaySpeed = speedUnit === 'MPH' ? Math.round(car.speedKmh * 0.621371) : car.speedKmh;

  // RPM percentage of cut-off
  const maxRpm = car.maxRpm || 13000;
  const rpmPercent = Math.min(1.0, car.rpms / maxRpm);
  const isCutOff = rpmPercent >= 0.96; // Over 96% -> 15 Hz strobe!

  // Gear formatting
  const formattedGear = car.gear === -1 ? 'R' : car.gear === 0 ? 'N' : String(car.gear);
  const gearColor =
    car.gear === -1
      ? 'text-rose-500 shadow-[0_0_35px_rgba(255,23,68,0.5)]'
      : car.gear === 0
      ? 'text-emerald-400 shadow-[0_0_35px_rgba(0,230,118,0.5)]'
      : 'text-white shadow-[0_0_25px_rgba(255,255,255,0.4)]';

  // 15 Shift LEDs logic
  // 1-5 (80-88%): Green
  // 6-10 (88-92%): Orange
  // 11-14 (92-96%): Red
  // 15 (>=96%): Full flash strobe
  const leds = Array.from({ length: 15 }, (_, i) => {
    const ledThreshold = 0.80 + (i / 14) * 0.16; // 80% to 96%
    const isLit = rpmPercent >= ledThreshold;

    let colorClass = 'bg-zinc-800';
    if (isCutOff) {
      // 15 Hz Strobe on all LEDs
      colorClass = 'bg-cyan-300 shadow-[0_0_16px_#00E5FF] animate-strobe-fast';
    } else if (isLit) {
      if (i < 5) {
        colorClass = 'bg-emerald-400 shadow-[0_0_12px_#00E676]';
      } else if (i < 10) {
        colorClass = 'bg-amber-400 shadow-[0_0_12px_#FFD600]';
      } else {
        colorClass = 'bg-rose-500 shadow-[0_0_12px_#FF1744]';
      }
    }

    return (
      <div
        key={i}
        className={`w-12 h-6 rounded-sm transition-all duration-75 border border-black/40 ${colorClass}`}
      />
    );
  });

  return (
    <div className="w-[960px] h-full px-8 py-3.5 flex flex-col items-center justify-between bg-black/60 relative">
      {/* 1. Shift Lights Bar (15 LEDs) */}
      <div className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 shadow-inner">
        {leds}
      </div>

      {/* 2. Central Core Display: Gear + Tachometer */}
      <div className="flex flex-col items-center justify-center -my-2 select-none">
        {/* Tachometer RPM in large mono font */}
        <div className="font-mono tabular-nums text-[32px] font-black tracking-widest text-zinc-400 flex items-baseline gap-2">
          <span className="text-white text-[38px]">{car.rpms}</span>
          <span className="text-zinc-600 text-[18px]">/ {maxRpm} RPM</span>
        </div>

        {/* Colossal Gear Number */}
        <div className="relative flex items-center justify-center my-1">
          <div
            style={{ fontSize: '180px', lineHeight: '0.85' }}
            className={`font-mono font-black select-none tracking-tighter ${gearColor}`}
          >
            {formattedGear}
          </div>
        </div>

        {/* Throttle & Brake Micro Bars */}
        <div className="w-[380px] flex items-center gap-4 mt-2">
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-mono font-black text-emerald-400">
              <span>THR</span>
              <span>{(car.throttle * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded overflow-hidden">
              <div
                style={{ width: `${car.throttle * 100}%` }}
                className="h-full bg-emerald-500 shadow-[0_0_10px_#00E676] transition-all duration-75"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-mono font-black text-rose-500">
              <span>BRK</span>
              <span>{(car.brake * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded overflow-hidden">
              <div
                style={{ width: `${car.brake * 100}%` }}
                className="h-full bg-rose-500 shadow-[0_0_10px_#FF1744] transition-all duration-75"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom: Giant Speedometer + Track/Car Indicator */}
      <div className="w-full flex items-center justify-between border-t border-zinc-800/80 pt-3">
        {/* Car Model / Track Info */}
        <div className="flex flex-col font-mono">
          <span className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
            CIRCUIT & CHASSIS
          </span>
          <span className="text-[15px] font-bold text-zinc-200 uppercase">
            {session.track} · {session.carModel}
          </span>
        </div>

        {/* Massive Speed with Unit Toggle */}
        <button
          onClick={toggleSpeedUnit}
          title="Toca para alternar entre KM/H y MPH"
          className="flex items-baseline gap-2 font-mono tabular-nums cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="text-[64px] font-black text-white leading-none tracking-tight">
            {displaySpeed}
          </span>
          <span className="text-[20px] font-black text-cyan-400 tracking-wider">
            {speedUnit}
          </span>
        </button>
      </div>
    </div>
  );
};
