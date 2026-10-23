import React from 'react';

interface RevLedsProps {
  rpms: number;
  maxRpm: number;
}

export const RevLeds: React.FC<RevLedsProps> = ({ rpms, maxRpm }) => {
  const totalLeds = 15;
  // El rango de LEDs arranca en 70% del maxRpm y llega al corte en 98%
  const startRpm = maxRpm * 0.70;
  const redlineRpm = maxRpm * 0.96;

  const rpmProgress = Math.max(0, Math.min(1, (rpms - startRpm) / (redlineRpm - startRpm)));
  const activeCount = Math.floor(rpmProgress * totalLeds);
  const isShiftAlert = rpms >= redlineRpm;

  return (
    <div className={`w-full flex items-center justify-between gap-1 sm:gap-2 px-2 py-1 transition-all ${
      isShiftAlert ? 'bg-blue-600/30 animate-pulse' : 'bg-neutral-950'
    }`}>
      {Array.from({ length: totalLeds }).map((_, index) => {
        let activeColor = 'bg-green-500 shadow-[0_0_10px_#22c55e]';
        if (index >= 5 && index < 10) {
          activeColor = 'bg-red-500 shadow-[0_0_10px_#ef4444]';
        } else if (index >= 10) {
          activeColor = 'bg-blue-500 shadow-[0_0_12px_#3b82f6]';
        }

        const isActive = index < activeCount || isShiftAlert;

        return (
          <div
            key={index}
            className={`flex-1 h-3 sm:h-5 rounded-sm transition-all duration-75 ${
              isActive ? activeColor : 'bg-neutral-800 border border-neutral-700/40'
            }`}
          />
        );
      })}
    </div>
  );
};
