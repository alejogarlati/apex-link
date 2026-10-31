import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { MicrosectorStatus } from '../../types/ddu';

export const MicrosectorsBar: React.FC = () => {
  const microsectors = useTelemetryStore((s) => s.microsectors);

  const getStatusColor = (status: MicrosectorStatus) => {
    switch (status) {
      case 'purple': // Récord de sector: morado
        return 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.7)] border-purple-400/60';
      case 'green': // Mejora: verde
        return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] border-emerald-400/60';
      case 'yellow': // No mejora: gris oscuro
        return 'bg-zinc-700 border-zinc-600';
      case 'active': // Actual: gris claro con pulso
        return 'bg-zinc-200 shadow-[0_0_14px_rgba(255,255,255,0.85)] border-white animate-pulse z-10';
      case 'upcoming': // No transitado: negro
      default:
        return 'bg-black border border-zinc-900';
    }
  };

  return (
    <div className="w-[1920px] h-[43px] px-6 bg-black border-t border-zinc-800 flex items-center justify-center select-none">
      <div className="w-full h-[22px] flex items-center gap-1.5">
        {/* Sector 1: Segments 0..6 */}
        {microsectors.slice(0, 7).map((m) => (
          <div
            key={m.id}
            className={`flex-1 h-full rounded-[2px] border transition-all duration-150 ${getStatusColor(
              m.status
            )}`}
          />
        ))}

        {/* Macro S1 / S2 divider */}
        <div className="w-[2px] h-[18px] bg-zinc-800 mx-1 shrink-0" />

        {/* Sector 2: Segments 7..13 */}
        {microsectors.slice(7, 14).map((m) => (
          <div
            key={m.id}
            className={`flex-1 h-full rounded-[2px] border transition-all duration-150 ${getStatusColor(
              m.status
            )}`}
          />
        ))}

        {/* Macro S2 / S3 divider */}
        <div className="w-[2px] h-[18px] bg-zinc-800 mx-1 shrink-0" />

        {/* Sector 3: Segments 14..19 */}
        {microsectors.slice(14, 20).map((m) => (
          <div
            key={m.id}
            className={`flex-1 h-full rounded-[2px] border transition-all duration-150 ${getStatusColor(
              m.status
            )}`}
          />
        ))}
      </div>
    </div>
  );
};
