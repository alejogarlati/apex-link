import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { MicrosectorStatus, TyreCompound } from '../../types/ddu';

interface TyreGraphicItemProps {
  label: 'FL' | 'FR' | 'RL' | 'RR';
  tempC: number;
  wearPct: number;
  compound: TyreCompound;
  onCycleCompound: () => void;
}

const TyreGraphicItem: React.FC<TyreGraphicItemProps> = ({
  label,
  tempC,
  wearPct,
  compound,
  onCycleCompound,
}) => {
  // Official Formula 1 tyre compound solid filled color palette
  const getCompoundColors = (c: TyreCompound) => {
    switch (c) {
      case 'SOFT':
        return {
          fill: 'bg-rose-600 shadow-[0_0_18px_rgba(225,29,72,0.6)] border-rose-400',
          text: 'text-rose-500',
        };
      case 'MEDIUM':
        return {
          fill: 'bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.6)] border-amber-300',
          text: 'text-amber-400',
        };
      case 'HARD':
        return {
          fill: 'bg-white shadow-[0_0_18px_rgba(255,255,255,0.6)] border-zinc-200',
          text: 'text-white',
        };
      case 'INTER':
        return {
          fill: 'bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)] border-emerald-300',
          text: 'text-emerald-400',
        };
      case 'WET':
        return {
          fill: 'bg-blue-600 shadow-[0_0_18px_rgba(37,99,235,0.6)] border-blue-400',
          text: 'text-blue-400',
        };
    }
  };

  const style = getCompoundColors(compound);

  return (
    <div
      onClick={onCycleCompound}
      title="Toca para cambiar compuesto F1"
      className="flex items-center gap-4 cursor-pointer select-none group"
    >
      {/* 1. Base: Forma de neumático (rectángulo redondeado en esquinas, 100% RELLENO) */}
      <div
        className={`w-[46px] h-[96px] rounded-[10px] border-2 flex flex-col justify-between items-center py-2.5 transition-all duration-150 ${style.fill}`}
      >
        <span className="w-4 h-1 rounded-full bg-black/40" />
        <span className="w-4 h-1 rounded-full bg-black/40" />
        <span className="w-4 h-1 rounded-full bg-black/40" />
      </div>

      {/* 2. Información en orden estricto: FL/FR/RL/RR -> TEMP -> WEAR -> COMPUESTO */}
      <div className="flex flex-col gap-1 font-mono tabular-nums">
        {/* 1. Posición */}
        <span className="text-[15px] font-black tracking-widest text-zinc-400 leading-none">
          {label}
        </span>

        {/* 2. TEMP (en grados centígrados) */}
        <span className="text-[26px] font-black text-white leading-none mt-0.5">
          {tempC.toFixed(0)}°C
        </span>

        {/* 3. WEAR (Desgaste) */}
        <span className="text-[15px] font-bold text-zinc-400 leading-none mt-0.5">
          {wearPct.toFixed(0)}%
        </span>

        {/* 4. Compuesto F1 oficial */}
        <span
          className={`text-[13px] font-black tracking-wider leading-none mt-0.5 ${style.text}`}
        >
          {compound}
        </span>
      </div>
    </div>
  );
};

export const ZoneBTyresAndBrakes: React.FC = () => {
  const tyres = useTelemetryStore((s) => s.telemetry.tyres);
  const compound = useTelemetryStore((s) => s.tyreCompound);
  const setTyreCompound = useTelemetryStore((s) => s.setTyreCompound);
  const macroSectors = useTelemetryStore((s) => s.macroSectors);

  const cycleCompound = () => {
    const list: TyreCompound[] = ['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'];
    const idx = list.indexOf(compound);
    setTyreCompound(list[(idx + 1) % list.length]);
  };

  const getSectorStyle = (status: MicrosectorStatus) => {
    switch (status) {
      case 'purple': // Récord de sector: morado
        return 'bg-purple-600 text-purple-100 shadow-[0_0_10px_rgba(147,51,234,0.7)] border-purple-400/60 font-black';
      case 'green': // Mejora: verde
        return 'bg-emerald-500 text-emerald-950 shadow-[0_0_8px_rgba(16,185,129,0.7)] border-emerald-400/60 font-black';
      case 'yellow': // No mejora: gris oscuro
        return 'bg-zinc-700 text-zinc-300 border-zinc-600 font-bold';
      case 'active': // Actual: gris claro
        return 'bg-zinc-200 text-black shadow-[0_0_12px_rgba(255,255,255,0.8)] border-white animate-pulse font-black';
      case 'upcoming': // No transitado: negro
      default:
        return 'bg-black text-zinc-600 border border-zinc-900 font-bold';
    }
  };

  return (
    <div className="w-[480px] h-full p-8 flex flex-col justify-between border-r border-zinc-800 select-none font-mono">
      {/* Front Axle (FL, FR) */}
      <div className="flex items-center justify-between px-2">
        <TyreGraphicItem
          label="FL"
          tempC={tyres.tempCoreC[0]}
          wearPct={tyres.wear[0]}
          compound={compound}
          onCycleCompound={cycleCompound}
        />
        <TyreGraphicItem
          label="FR"
          tempC={tyres.tempCoreC[1]}
          wearPct={tyres.wear[1]}
          compound={compound}
          onCycleCompound={cycleCompound}
        />
      </div>

      {/* Rear Axle (RL, RR) */}
      <div className="flex items-center justify-between px-2">
        <TyreGraphicItem
          label="RL"
          tempC={tyres.tempCoreC[2]}
          wearPct={tyres.wear[2]}
          compound={compound}
          onCycleCompound={cycleCompound}
        />
        <TyreGraphicItem
          label="RR"
          tempC={tyres.tempCoreC[3]}
          wearPct={tyres.wear[3]}
          compound={compound}
          onCycleCompound={cycleCompound}
        />
      </div>

      {/* Debajo de las cubiertas: Estado de los 3 sectores (S1, S2, S3) con la misma regla de colores */}
      <div className="w-full flex items-center justify-between gap-3 pt-4 border-t border-zinc-900">
        <div
          className={`flex-1 h-9 rounded flex items-center justify-center text-[14px] border transition-all duration-150 ${getSectorStyle(
            macroSectors[0]
          )}`}
        >
          S1
        </div>
        <div
          className={`flex-1 h-9 rounded flex items-center justify-center text-[14px] border transition-all duration-150 ${getSectorStyle(
            macroSectors[1]
          )}`}
        >
          S2
        </div>
        <div
          className={`flex-1 h-9 rounded flex items-center justify-center text-[14px] border transition-all duration-150 ${getSectorStyle(
            macroSectors[2]
          )}`}
        >
          S3
        </div>
      </div>
    </div>
  );
};
