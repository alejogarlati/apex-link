import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const ZoneCCentralColumn: React.FC = () => {
  const car = useTelemetryStore((s) => s.telemetry.car);
  const appState = useTelemetryStore((s) => s.appState);
  const calibrationProgress = useTelemetryStore((s) => s.calibrationProgress);
  const speedUnit = useTelemetryStore((s) => s.speedUnit);

  const isCalibrating = appState === 'CALIBRATING';
  const maxRpm = car.maxRpm || 13000;

  // Si estamos en secuencia de calibración, interpolar barrido 0 -> 100% -> 0%
  const activeRpms = isCalibrating
    ? Math.round(calibrationProgress * maxRpm)
    : car.rpms;

  const activeSpeedKmh = isCalibrating
    ? calibrationProgress * 340
    : car.speedKmh;

  const displaySpeed =
    speedUnit === 'MPH'
      ? (activeSpeedKmh * 0.621371).toFixed(1)
      : activeSpeedKmh.toFixed(1);

  // Porcentaje de RPM y corte
  const rpmPercent = isCalibrating
    ? calibrationProgress
    : Math.min(1.0, car.rpms / maxRpm);
  const isCutOff = isCalibrating
    ? calibrationProgress >= 0.96
    : rpmPercent >= 0.96;

  // Marcha actual
  const formattedGear = isCalibrating
    ? calibrationProgress > 0.85
      ? '8'
      : 'N'
    : car.gear === -1
    ? 'R'
    : car.gear === 0
    ? 'N'
    : String(car.gear);

  const gearColor = isCalibrating
    ? calibrationProgress > 0.85
      ? 'text-cyan-300 drop-shadow-[0_0_45px_rgba(0,229,255,0.75)]'
      : 'text-emerald-400 drop-shadow-[0_0_40px_rgba(0,230,118,0.6)]'
    : car.gear === -1
    ? 'text-rose-500 drop-shadow-[0_0_40px_rgba(255,23,68,0.6)]'
    : car.gear === 0
    ? 'text-emerald-400 drop-shadow-[0_0_40px_rgba(0,230,118,0.6)]'
    : 'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]';

  // Barra de 15 luces de cambio (Shift Lights)
  // En calibración barre de 0% a 100%; en sesión normal actúa del 80% al 96%
  const leds = Array.from({ length: 15 }, (_, i) => {
    const ledThreshold = isCalibrating
      ? (i + 1) / 15
      : 0.8 + (i / 14) * 0.16;
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
        className={`w-12 h-6 rounded-[2px] transition-all duration-75 ${colorClass}`}
      />
    );
  });

  const throttlePct = isCalibrating
    ? calibrationProgress * 100
    : Math.min(100, Math.max(0, car.throttle * 100));
  const brakePct = isCalibrating
    ? calibrationProgress * 100
    : Math.min(100, Math.max(0, car.brake * 100));

  const rawClutch = car.clutch ?? 1.0;
  const clutchPct = isCalibrating
    ? calibrationProgress * 100
    : Math.min(100, Math.max(0, (1.0 - rawClutch) * 100));

  const drsCalibrating = isCalibrating && calibrationProgress > 0.5;

  return (
    <div className="w-[960px] h-full px-8 py-3 flex flex-col items-center justify-between border-r border-zinc-800 relative select-none font-mono">
      {/* 1. Barra de Shift Lights (15 LEDs) */}
      <div className="w-full flex items-center justify-center gap-1.5 pt-1">
        {leds}
      </div>

      {/* 2. Columna central Stack principal */}
      <div className="w-full flex-1 flex items-center justify-center relative my-auto">
        <div className="flex flex-col items-center justify-center text-center">
          {/* RPM */}
          <div className="text-[60px] font-black tracking-widest text-zinc-200 tabular-nums leading-none">
            {activeRpms}
          </div>

          {/* Marcha Colosal */}
          <div
            style={{ fontSize: '255px', lineHeight: '0.82' }}
            className={`font-black tracking-tighter my-0.5 tabular-nums ${gearColor}`}
          >
            {formattedGear}
          </div>

          {/* DRS */}
          <div className="h-11 flex items-center justify-center my-0.5">
            {car.drsEnabled || drsCalibrating ? (
              <div className="px-7 py-1 rounded bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_24px_#00E676] animate-pulse">
                <span className="text-[26px] font-black tracking-[0.25em]">
                  DRS
                </span>
              </div>
            ) : car.drsAvailable ? (
              <div className="px-7 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.4)] animate-pulse">
                <span className="text-[24px] font-black tracking-[0.25em]">
                  DRS
                </span>
              </div>
            ) : (
              <div className="px-7 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-700">
                <span className="text-[22px] font-bold tracking-[0.25em]">
                  DRS
                </span>
              </div>
            )}
          </div>

          {/* Velocidad */}
          <div className="flex flex-col items-center">
            <span className="text-[104px] font-black text-white leading-none tracking-tight tabular-nums">
              {displaySpeed}
            </span>
            <span className="text-[18px] font-bold tracking-[0.25em] text-zinc-500 mt-1 uppercase">
              {speedUnit.toLowerCase()}
            </span>
          </div>
        </div>

        {/* 3 Barras verticales de pedales */}
        <div className="absolute right-8 flex items-end gap-3.5 h-[200px]">
          {/* 1. Acelerador: Verde */}
          <div className="w-4 h-[200px] bg-zinc-900 rounded-[2px] overflow-hidden flex flex-col justify-end border border-zinc-800">
            <div
              style={{ height: `${throttlePct}%` }}
              className="w-full bg-emerald-500 shadow-[0_0_10px_#00E676] transition-all duration-75"
            />
          </div>

          {/* 2. Freno: Rojo */}
          <div className="w-4 h-[200px] bg-zinc-900 rounded-[2px] overflow-hidden flex flex-col justify-end border border-zinc-800">
            <div
              style={{ height: `${brakePct}%` }}
              className="w-full bg-rose-500 shadow-[0_0_10px_#FF1744] transition-all duration-75"
            />
          </div>

          {/* 3. Embrague: Azul */}
          <div className="w-4 h-[200px] bg-zinc-900 rounded-[2px] overflow-hidden flex flex-col justify-end border border-zinc-800">
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
