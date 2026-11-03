import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { TyreCompound } from '../../types/ddu';

interface TyreGraphicItemProps {
  label: 'FL' | 'FR' | 'RL' | 'RR';
  tempC: number;
  wearPct: number;
  pressurePsi: number;
  tempBrakeC?: number;
  compound: TyreCompound;
}

const TyreGraphicItem: React.FC<TyreGraphicItemProps> = ({
  label,
  tempC,
  wearPct,
  pressurePsi,
  tempBrakeC,
  compound,
}) => {
  // 1. Color de relleno de la cubierta según su temperatura física
  const getThermalFillColor = (temp: number) => {
    if (temp < 75) {
      // Frías (hasta 70-75°C): Azul
      return 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.7)] border-blue-400';
    } else if (temp <= 105) {
      // En temperatura óptima (75°C a 105°C): Verde
      return 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.7)] border-emerald-400';
    } else if (temp <= 115) {
      // Calientes (105°C a 115°C): Naranja
      return 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.7)] border-amber-400';
    } else {
      // Sobrecalentadas / ampolla (115°C o más): Rojo intenso
      return 'bg-rose-600 shadow-[0_0_24px_rgba(225,29,72,0.85)] border-rose-400 animate-pulse';
    }
  };

  // 2. Color oficial del texto de compuesto F1 de Pirelli
  const getCompoundTextColor = (c: TyreCompound) => {
    switch (c) {
      case 'SOFT':
        return 'text-rose-500';
      case 'MEDIUM':
        return 'text-amber-400';
      case 'HARD':
        return 'text-white';
      case 'INTER':
        return 'text-emerald-400';
      case 'WET':
        return 'text-blue-400';
    }
  };

  const thermalFill = getThermalFillColor(tempC);
  const compoundTextColor = getCompoundTextColor(compound);

  return (
    <div className="flex items-center gap-4 select-none py-1">
      {/* 1. Forma de neumático (100% RELLENO según temperatura térmica) */}
      <div
        className={`w-[56px] h-[115px] rounded-[12px] border-2 flex flex-col justify-between items-center py-3 transition-all duration-150 ${thermalFill}`}
      >
        <span className="w-5 h-1.5 rounded-full bg-black/40" />
        <span className="w-5 h-1.5 rounded-full bg-black/40" />
        <span className="w-5 h-1.5 rounded-full bg-black/40" />
      </div>

      {/* 2. Información en orden estricto (Engrandecida un 35%): FL -> TEMP -> PSI -> WEAR -> COMPUESTO */}
      <div className="flex flex-col gap-1 font-mono tabular-nums">
        {/* Posición (Engrandecida: 15px -> 20px) */}
        <span className="text-[20px] font-black tracking-widest text-zinc-400 leading-none">
          {label}
        </span>

        {/* Temperatura de la cubierta (Engrandecida: 26px -> 35px) */}
        <span className="text-[35px] font-black text-white leading-none mt-0.5">
          {tempC.toFixed(0)}°C
        </span>

        {/* Presión en PSI */}
        <span className="text-[20px] font-black text-cyan-400 leading-none mt-0.5">
          {pressurePsi.toFixed(1)} PSI
        </span>

        {/* Desgaste (Engrandecido: 15px -> 20px) */}
        <span className="text-[19px] font-bold text-zinc-400 leading-none mt-0.5">
          {wearPct.toFixed(0)}%
        </span>

        {/* Compuesto F1 oficial (Engrandecido: 13px -> 18px) */}
        <span
          className={`text-[18px] font-black tracking-wider leading-none mt-0.5 ${compoundTextColor}`}
        >
          {compound}
        </span>

        {/* Freno (Disco) si está presente */}
        {tempBrakeC !== undefined && (
          <span className="text-[15px] font-bold text-zinc-500 leading-none mt-0.5">
            BRK {tempBrakeC.toFixed(0)}°C
          </span>
        )}
      </div>
    </div>
  );
};

export const ZoneBTyresAndBrakes: React.FC = () => {
  const tyres = useTelemetryStore((s) => s.telemetry.tyres);
  const compound = useTelemetryStore((s) => s.tyreCompound);

  return (
    <div className="w-[480px] h-full p-8 flex flex-col justify-between border-r border-zinc-800 select-none font-mono">
      {/* Front Axle (FL, FR) */}
      <div className="flex items-center justify-between px-2">
        <TyreGraphicItem
          label="FL"
          tempC={tyres.tempCoreC[0]}
          wearPct={tyres.wear[0]}
          pressurePsi={tyres.pressurePsi[0]}
          tempBrakeC={tyres.tempBrakesC?.[0]}
          compound={compound}
        />
        <TyreGraphicItem
          label="FR"
          tempC={tyres.tempCoreC[1]}
          wearPct={tyres.wear[1]}
          pressurePsi={tyres.pressurePsi[1]}
          tempBrakeC={tyres.tempBrakesC?.[1]}
          compound={compound}
        />
      </div>

      {/* Rear Axle (RL, RR) */}
      <div className="flex items-center justify-between px-2">
        <TyreGraphicItem
          label="RL"
          tempC={tyres.tempCoreC[2]}
          wearPct={tyres.wear[2]}
          pressurePsi={tyres.pressurePsi[2]}
          tempBrakeC={tyres.tempBrakesC?.[2]}
          compound={compound}
        />
        <TyreGraphicItem
          label="RR"
          tempC={tyres.tempCoreC[3]}
          wearPct={tyres.wear[3]}
          pressurePsi={tyres.pressurePsi[3]}
          tempBrakeC={tyres.tempBrakesC?.[3]}
          compound={compound}
        />
      </div>
    </div>
  );
};
