import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { MicrosectorStatus } from '../../types/ddu';

export const SectorsBar: React.FC = () => {
  const macroSectors = useTelemetryStore((s) => s.macroSectors);

  const getSectorStyle = (status: MicrosectorStatus) => {
    switch (status) {
      case 'purple': // Récord de sector: púrpura / rosa
        return 'bg-purple-600 border-purple-400 text-white shadow-[0_0_18px_rgba(168,85,247,0.85)]';
      case 'green': // Mejora personal: verde esmeralda
        return 'bg-emerald-500 border-emerald-300 text-black shadow-[0_0_14px_rgba(16,185,129,0.8)]';
      case 'yellow': // Sin mejora / más lento: gris oscuro
        return 'bg-zinc-800 border-zinc-700 text-zinc-400';
      case 'active': // En curso: blanco brillante pulsando
        return 'bg-zinc-100 border-white text-black shadow-[0_0_16px_rgba(255,255,255,0.9)] animate-pulse';
      case 'upcoming': // No recorrido: negro
      default:
        return 'bg-black border-zinc-900 text-zinc-600';
    }
  };

  return (
    <div className="w-[1920px] h-[48px] px-8 bg-black border-t border-zinc-800 flex items-center justify-between gap-4 select-none font-mono">
      {/* Sector 1 */}
      <div
        className={`flex-1 h-[36px] rounded-[4px] border-2 flex items-center justify-center text-[19px] font-black tracking-widest transition-all duration-150 ${getSectorStyle(
          macroSectors[0]
        )}`}
      >
        SECTOR 1
      </div>

      {/* Sector 2 */}
      <div
        className={`flex-1 h-[36px] rounded-[4px] border-2 flex items-center justify-center text-[19px] font-black tracking-widest transition-all duration-150 ${getSectorStyle(
          macroSectors[1]
        )}`}
      >
        SECTOR 2
      </div>

      {/* Sector 3 */}
      <div
        className={`flex-1 h-[36px] rounded-[4px] border-2 flex items-center justify-center text-[19px] font-black tracking-widest transition-all duration-150 ${getSectorStyle(
          macroSectors[2]
        )}`}
      >
        SECTOR 3
      </div>
    </div>
  );
};
