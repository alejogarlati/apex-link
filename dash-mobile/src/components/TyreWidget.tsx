import React from 'react';

interface TyreWidgetProps {
  pressures: [number, number, number, number];
  temps: [number, number, number, number];
}

export const TyreWidget: React.FC<TyreWidgetProps> = ({ pressures, temps }) => {
  const getTempColor = (temp: number) => {
    if (temp < 80) return 'text-cyan-400 border-cyan-500/50';
    if (temp <= 100) return 'text-emerald-400 border-emerald-500/50';
    if (temp <= 108) return 'text-amber-400 border-amber-500/50';
    return 'text-rose-500 border-rose-500 animate-pulse';
  };

  const tyreLabels = ['FL', 'FR', 'RL', 'RR'];

  return (
    <div className="grid grid-cols-2 gap-2 bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800">
      {tyreLabels.map((label, idx) => {
        const temp = temps[idx] ?? 0;
        const psi = pressures[idx] ?? 0;
        const colorClasses = getTempColor(temp);

        return (
          <div
            key={label}
            className={`flex flex-col items-center justify-center p-1.5 rounded border bg-black/60 ${colorClasses}`}
          >
            <span className="text-[10px] font-mono tracking-wider opacity-75">{label}</span>
            <span className="text-base sm:text-lg font-black font-mono leading-none my-0.5">{temp}°C</span>
            <span className="text-xs font-mono opacity-90">{psi.toFixed(1)} <span className="text-[9px]">PSI</span></span>
          </div>
        );
      })}
    </div>
  );
};
