import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const ZoneCCentralColumn: React.FC = () => {
  const car = useTelemetryStore((s) => s.telemetry.car);
  const speedUnit = useTelemetryStore((s) => s.speedUnit);
  const toggleSpeedUnit = useTelemetryStore((s) => s.toggleSpeedUnit);

  // Speed unit conversion
  const displaySpeed =
    speedUnit === 'MPH' ? Math.round(car.speedKmh * 0.621371) : car.speedKmh;

  // RPM percentage of cut-off
  const maxRpm = car.maxRpm || 13000;
  const rpmPercent = Math.min(1.0, car.rpms / maxRpm);
  const isCutOff = rpmPercent >= 0.96; // Over 96% -> strobe

  // Gear formatting
  const formattedGear =
    car.gear === -1 ? 'R' : car.gear === 0 ? 'N' : String(car.gear);
  const gearColor =
    car.gear === -1
      ? 'text-rose-500 drop-shadow-[0_0_35px_rgba(255,23,68,0.5)]'
      : car.gear === 0
      ? 'text-emerald-400 drop-shadow-[0_0_35px_rgba(0,230,118,0.5)]'
      : 'text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]';

  // 15 Shift LEDs logic
  const leds = Array.from({ length: 15 }, (_, i) => {
    const ledThreshold = 0.8 + (i / 14) * 0.16; // 80% to 96%
    const isLit = rpmPercent >= ledThreshold;

    let colorClass = 'bg-zinc-900 border border-zinc-800';
    if (isCutOff) {
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
        className={`w-12 h-5 rounded-[2px] transition-all duration-75 ${colorClass}`}
      />
    );
  });

  const throttlePct = Math.min(100, Math.max(0, car.throttle * 100));
  const brakePct = Math.min(100, Math.max(0, car.brake * 100));
  const clutchPct = Math.min(100, Math.max(0, (car.clutch ?? 0) * 100));

  return (
    <div className="w-[960px] h-full px-8 py-3 flex flex-col items-center justify-between border-r border-zinc-800 relative select-none font-mono">
      {/* 1. Shift Lights Bar (15 LEDs) */}
      <div className="w-full flex items-center justify-center gap-1.5 pt-2">
        {leds}
      </div>

      {/* 2. Main Central Stack & Side Vertical Pedals */}
      <div className="w-full flex-1 flex items-center justify-center relative my-auto">
        {/* Central Vertical Stack: RPM -> Gear -> DRS ZONE -> Speed -> km/h */}
        <div className="flex flex-col items-center justify-center text-center">
          {/* RPM: Only current number, no max */}
          <div className="text-[44px] font-black tracking-widest text-zinc-200 tabular-nums leading-none">
            {car.rpms}
          </div>

          {/* Colossal Gear */}
          <div
            style={{ fontSize: '190px', lineHeight: '0.85' }}
            className={`font-black tracking-tighter my-1 tabular-nums ${gearColor}`}
          >
            {formattedGear}
          </div>

          {/* DRS: Directly underneath gear with prominent box */}
          <div className="h-10 flex items-center justify-center my-1">
            {car.drsEnabled ? (
              <div className="px-6 py-1 rounded bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_22px_#00E676] animate-pulse">
                <span className="text-[20px] font-black tracking-[0.25em]">
                  DRS
                </span>
              </div>
            ) : car.drsAvailable ? (
              <div className="px-6 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.35)] animate-pulse">
                <span className="text-[18px] font-black tracking-[0.25em]">
                  DRS
                </span>
              </div>
            ) : (
              <div className="px-6 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-700">
                <span className="text-[16px] font-bold tracking-[0.25em]">
                  DRS
                </span>
              </div>
            )}
          </div>

          {/* Speed: Directly underneath DRS */}
          <button
            onClick={toggleSpeedUnit}
            title="Toca para alternar KM/H y MPH"
            className="flex flex-col items-center cursor-pointer group mt-1"
          >
            <span className="text-[76px] font-black text-white leading-none tracking-tight tabular-nums group-hover:text-cyan-300 transition-colors">
              {displaySpeed}
            </span>
            {/* Speed unit: chiquito underneath speed */}
            <span className="text-[13px] font-bold tracking-[0.25em] text-zinc-500 mt-1 uppercase">
              {speedUnit.toLowerCase()}
            </span>
          </button>
        </div>

        {/* 3 Vertical Pedals Bar (Orden estricto izq -> der: ACEL / FREN / EMBR, sin texto) */}
        <div className="absolute right-12 flex items-end gap-3 h-[180px]">
          {/* 1. Acelerador: Verde */}
          <div className="w-3.5 h-[180px] bg-zinc-900 rounded-[2px] overflow-hidden flex flex-col justify-end border border-zinc-800">
            <div
              style={{ height: `${throttlePct}%` }}
              className="w-full bg-emerald-500 shadow-[0_0_10px_#00E676] transition-all duration-75"
            />
          </div>

          {/* 2. Freno: Rojo */}
          <div className="w-3.5 h-[180px] bg-zinc-900 rounded-[2px] overflow-hidden flex flex-col justify-end border border-zinc-800">
            <div
              style={{ height: `${brakePct}%` }}
              className="w-full bg-rose-500 shadow-[0_0_10px_#FF1744] transition-all duration-75"
            />
          </div>

          {/* 3. Embrague: Azul */}
          <div className="w-3.5 h-[180px] bg-zinc-900 rounded-[2px] overflow-hidden flex flex-col justify-end border border-zinc-800">
            <div
              style={{ height: `${clutchPct}%` }}
              className="w-full bg-blue-500 shadow-[0_0_10px_#3B82F6] transition-all duration-75"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
