import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Trophy, CheckCircle2, X } from 'lucide-react';
import { MTricolorStripe } from '../common/BmwMComponents';

export const LapCompletedBanner: React.FC = () => {
  const showLapBanner = useTelemetryStore((s) => s.showLapBanner);
  const lastCompletedLap = useTelemetryStore((s) => s.lastCompletedLap);
  const dismissLapBanner = useTelemetryStore((s) => s.dismissLapBanner);

  if (!showLapBanner || !lastCompletedLap) return null;

  return (
    <div
      onClick={dismissLapBanner}
      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-8 cursor-pointer select-none animate-in fade-in duration-200 font-mono"
    >
      <div
        className={`w-[740px] rounded-none border flex flex-col items-center shadow-2xl relative overflow-hidden ${
          lastCompletedLap.isPersonalBest
            ? 'bg-[#0d0d0d] border-[#e22718] shadow-[0_0_40px_rgba(226,39,24,0.35)]'
            : 'bg-[#0d0d0d] border-[#3c3c3c]'
        }`}
      >
        {/* Franja M Tricolor estructural en cabecera */}
        <MTricolorStripe height="h-1" />

        <div className="p-8 w-full flex flex-col items-center gap-6">
          {/* Circular close button */}
          <button
            onClick={dismissLapBanner}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#141414] border border-[#3c3c3c] text-zinc-400 hover:text-white hover:border-[#e22718] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Trophy / Header */}
          <div className="flex items-center gap-3">
            {lastCompletedLap.isPersonalBest ? (
              <div className="p-3 rounded-none bg-[#1a1a1a] border border-[#e22718] text-[#e22718] shadow-[0_0_20px_rgba(226,39,24,0.4)]">
                <Trophy className="w-8 h-8" />
              </div>
            ) : (
              <div className="p-3 rounded-none bg-[#1a1a1a] border border-[#3c3c3c] text-white">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            )}
            <div className="flex flex-col text-left">
              <span className="text-[12px] font-bold tracking-[0.15em] text-[#7e7e7e] uppercase">
                {lastCompletedLap.isPersonalBest
                  ? 'RÉCORD PERSONAL ESTABLECIDO'
                  : 'VUELTA COMPLETADA'}
              </span>
              <span
                className={`text-[22px] font-bold tracking-wider uppercase ${
                  lastCompletedLap.isPersonalBest ? 'text-[#e22718]' : 'text-white'
                }`}
              >
                VUELTA #{lastCompletedLap.lapNumber}
              </span>
            </div>
          </div>

          {/* Colossal Time */}
          <div className="flex flex-col items-center my-1">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#7e7e7e] uppercase">
              TIEMPO OFICIAL DE META
            </span>
            <span className="text-[72px] font-black tracking-tight text-white tabular-nums leading-none mt-1">
              {lastCompletedLap.lapTimeStr}
            </span>
          </div>

          {/* Sectors Breakdown */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="p-3.5 rounded-none bg-[#141414] border border-[#262626] flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#7e7e7e] uppercase">
                SECTOR 1
              </span>
              <span className="text-[18px] font-bold text-white tabular-nums mt-0.5">
                {(lastCompletedLap.sectors[0] / 1000).toFixed(3)}s
              </span>
            </div>
            <div className="p-3.5 rounded-none bg-[#141414] border border-[#262626] flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#7e7e7e] uppercase">
                SECTOR 2
              </span>
              <span className="text-[18px] font-bold text-white tabular-nums mt-0.5">
                {(lastCompletedLap.sectors[1] / 1000).toFixed(3)}s
              </span>
            </div>
            <div className="p-3.5 rounded-none bg-[#141414] border border-[#262626] flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#7e7e7e] uppercase">
                SECTOR 3
              </span>
              <span className="text-[18px] font-bold text-white tabular-nums mt-0.5">
                {(lastCompletedLap.sectors[2] / 1000).toFixed(3)}s
              </span>
            </div>
          </div>

          <span className="text-[11px] font-light text-[#7e7e7e] tracking-[0.1em] uppercase">
            Toca la pantalla para cerrar
          </span>
        </div>
      </div>
    </div>
  );
};
