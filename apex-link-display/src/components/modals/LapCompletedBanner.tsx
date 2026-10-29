import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Trophy, CheckCircle2, X } from 'lucide-react';

export const LapCompletedBanner: React.FC = () => {
  const showLapBanner = useTelemetryStore((s) => s.showLapBanner);
  const lastCompletedLap = useTelemetryStore((s) => s.lastCompletedLap);
  const dismissLapBanner = useTelemetryStore((s) => s.dismissLapBanner);

  if (!showLapBanner || !lastCompletedLap) return null;

  return (
    <div
      onClick={dismissLapBanner}
      className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-8 cursor-pointer select-none animate-in fade-in duration-200"
    >
      <div
        className={`w-[720px] p-8 rounded-2xl border flex flex-col items-center gap-6 font-mono text-center shadow-2xl relative ${
          lastCompletedLap.isPersonalBest
            ? 'bg-zinc-950/90 border-purple-500 animate-pb-glow'
            : 'bg-zinc-950/90 border-zinc-700'
        }`}
      >
        {/* Close hint button */}
        <button
          onClick={dismissLapBanner}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy / Header */}
        <div className="flex items-center gap-3">
          {lastCompletedLap.isPersonalBest ? (
            <div className="p-3 rounded-full bg-purple-900/40 border border-purple-500 shadow-[0_0_20px_#E040FB]">
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
          ) : (
            <div className="p-3 rounded-full bg-emerald-900/40 border border-emerald-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className="text-[12px] font-black tracking-widest text-zinc-400 uppercase">
              {lastCompletedLap.isPersonalBest ? 'RECORD PERSONAL ESTABLECIDO' : 'VUELTA COMPLETADA'}
            </span>
            <span
              className={`text-[20px] font-black tracking-wide ${
                lastCompletedLap.isPersonalBest ? 'text-purple-400' : 'text-emerald-400'
              }`}
            >
              VUELTA #{lastCompletedLap.lapNumber}
            </span>
          </div>
        </div>

        {/* Colossal Time */}
        <div className="flex flex-col items-center my-2">
          <span className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase">
            TIEMPO OFICIAL DE META
          </span>
          <span className="text-[72px] font-black tracking-tighter text-white tabular-nums leading-none mt-1">
            {lastCompletedLap.lapTimeStr}
          </span>
        </div>

        {/* Sectors Breakdown */}
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500">SECTOR 1</span>
            <span className="text-[18px] font-black text-cyan-400">
              {(lastCompletedLap.sectors[0] / 1000).toFixed(3)}s
            </span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500">SECTOR 2</span>
            <span className="text-[18px] font-black text-cyan-400">
              {(lastCompletedLap.sectors[1] / 1000).toFixed(3)}s
            </span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500">SECTOR 3</span>
            <span className="text-[18px] font-black text-cyan-400">
              {(lastCompletedLap.sectors[2] / 1000).toFixed(3)}s
            </span>
          </div>
        </div>

        <span className="text-[11px] text-zinc-500 tracking-wider">
          Toca la pantalla para cerrar antes de 4 segundos
        </span>
      </div>
    </div>
  );
};
