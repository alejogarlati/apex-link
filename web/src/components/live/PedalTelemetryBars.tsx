"use client";

import { useEffect, useRef } from "react";
import type { TelemetriaAuto } from "@/types/telemetria";

interface PedalTelemetryBarsProps {
  car: TelemetriaAuto;
}

export function PedalTelemetryBars({ car }: PedalTelemetryBarsProps) {
  const peakThrottleRef = useRef(0);
  const peakBrakeRef = useRef(0);

  // Peak hold temporal
  useEffect(() => {
    if (car.throttle > peakThrottleRef.current) {
      peakThrottleRef.current = car.throttle;
    } else {
      peakThrottleRef.current = Math.max(car.throttle, peakThrottleRef.current - 0.02);
    }

    if (car.brake > peakBrakeRef.current) {
      peakBrakeRef.current = car.brake;
    } else {
      peakBrakeRef.current = Math.max(car.brake, peakBrakeRef.current - 0.02);
    }
  }, [car.throttle, car.brake]);

  const throttlePercent = Math.min(100, Math.max(0, car.throttle * 100));
  const brakePercent = Math.min(100, Math.max(0, car.brake * 100));
  const peakThrottlePercent = Math.min(100, Math.max(0, peakThrottleRef.current * 100));
  const peakBrakePercent = Math.min(100, Math.max(0, peakBrakeRef.current * 100));

  const steerAngleDeg = car.steer * 90;

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 flex flex-col justify-between shadow-md">
      <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
        <h3 className="text-sm font-bold uppercase text-white tracking-tight">Telemetría de Pedales</h3>
        <span className="text-[10px] font-mono font-bold text-[#0066b1] bg-[#0066b1]/10 px-2 py-0.5 rounded border border-[#0066b1]/30">
          60 Hz
        </span>
      </div>

      {/* Barras verticales de Acelerador y Freno */}
      <div className="grid grid-cols-2 gap-4 h-48 py-2">
        {/* Freno */}
        <div className="flex flex-col items-center justify-end h-full">
          <div className="relative w-12 h-36 bg-black/80 rounded border border-[#262626] overflow-hidden flex flex-col justify-end">
            {/* Peak hold line */}
            <div
              className="absolute left-0 right-0 h-0.5 bg-white/70 z-10 transition-all duration-75"
              style={{ bottom: `${peakBrakePercent}%` }}
            />
            {/* Nivel de freno */}
            <div
              className="w-full bg-gradient-to-t from-[#e22718] to-[#ff4d4d] transition-all duration-75"
              style={{ height: `${brakePercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-[#e22718] mt-2">
            {brakePercent.toFixed(0)}%
          </span>
          <span className="text-[10px] uppercase font-bold text-[#bbbbbb]">Freno</span>
        </div>

        {/* Acelerador */}
        <div className="flex flex-col items-center justify-end h-full">
          <div className="relative w-12 h-36 bg-black/80 rounded border border-[#262626] overflow-hidden flex flex-col justify-end">
            {/* Peak hold line */}
            <div
              className="absolute left-0 right-0 h-0.5 bg-white/70 z-10 transition-all duration-75"
              style={{ bottom: `${peakThrottlePercent}%` }}
            />
            {/* Nivel de acelerador */}
            <div
              className="w-full bg-gradient-to-t from-[#0fa336] to-[#20d853] transition-all duration-75"
              style={{ height: `${throttlePercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-[#0fa336] mt-2">
            {throttlePercent.toFixed(0)}%
          </span>
          <span className="text-[10px] uppercase font-bold text-[#bbbbbb]">Gas</span>
        </div>
      </div>

      {/* Indicador de Volante y Dirección */}
      <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-xs font-mono">
        <span className="text-[#7e7e7e]">Volante:</span>
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-black rounded-full overflow-hidden relative border border-[#3c3c3c]">
            <div
              className="absolute top-0 bottom-0 w-2 bg-[#0066b1] transition-all duration-75"
              style={{ left: `calc(50% + ${car.steer * 40}% - 4px)` }}
            />
          </div>
          <span className="text-white w-12 text-right">{steerAngleDeg.toFixed(1)}°</span>
        </div>
      </div>
    </div>
  );
}
