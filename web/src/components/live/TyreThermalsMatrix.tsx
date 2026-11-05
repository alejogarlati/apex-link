"use client";

import type { TelemetriaNeumaticos } from "@/types/telemetria";

interface TyreThermalsMatrixProps {
  tyres: TelemetriaNeumaticos;
}

const RUEDAS_CONFIG = [
  { clave: "FL", nombre: "Delantero Izquierdo", indice: 0 },
  { clave: "FR", nombre: "Delantero Derecho", indice: 1 },
  { clave: "RL", nombre: "Trasero Izquierdo", indice: 2 },
  { clave: "RR", nombre: "Trasero Derecho", indice: 3 },
] as const;

function obtenerColorTemperatura(temp: number): { texto: string; fondo: string; borde: string } {
  if (temp < 75) {
    return {
      texto: "text-[#2979FF]",
      fondo: "bg-[#2979FF]/10",
      borde: "border-[#2979FF]/30",
    };
  }
  if (temp <= 100) {
    return {
      texto: "text-[#00E676]",
      fondo: "bg-[#00E676]/10",
      borde: "border-[#00E676]/30",
    };
  }
  return {
    texto: "text-[#FF1744]",
    fondo: "bg-[#FF1744]/15",
    borde: "border-[#FF1744]/40",
  };
}

export function TyreThermalsMatrix({ tyres }: TyreThermalsMatrixProps) {
  return (
    <div className="bg-[#141414] border border-[#262626] rounded-lg p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e7e7e]">
            Compuestos & Térmica
          </span>
          <h3 className="text-sm font-bold uppercase text-white">Matriz de 4 Neumáticos</h3>
        </div>
        <span className="text-xs font-mono text-[#bbbbbb] bg-black/60 px-2 py-0.5 rounded border border-[#262626]">
          4 Canales
        </span>
      </div>

      {/* Grid 2x2 simulando los ejes delantero y trasero */}
      <div className="grid grid-cols-2 gap-3 py-1">
        {RUEDAS_CONFIG.map(({ clave, nombre, indice }) => {
          const temp = tyres.tempCoreC[indice] ?? 0;
          const psi = tyres.pressurePsi[indice] ?? 0;
          const wear = tyres.wear[indice] ?? 100;
          const estiloTemp = obtenerColorTemperatura(temp);

          return (
            <div
              key={clave}
              className={`p-3 rounded border flex flex-col justify-between transition-colors ${estiloTemp.fondo} ${estiloTemp.borde}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase font-mono">{clave}</span>
                <span className={`text-[10px] font-mono font-bold ${estiloTemp.texto}`}>
                  {temp.toFixed(1)}°C
                </span>
              </div>

              <div className="my-2 flex items-baseline justify-between">
                <span className="text-base font-mono font-bold text-white tracking-tight">
                  {psi.toFixed(1)}
                  <span className="text-[10px] text-[#7e7e7e] font-normal ml-0.5">PSI</span>
                </span>
                <span className="text-xs font-mono text-[#bbbbbb]">
                  {wear.toFixed(0)}%
                </span>
              </div>

              {/* Barra de desgaste restante */}
              <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    wear < 70 ? "bg-[#e22718]" : "bg-[#00E676]"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, wear))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Leyenda de temperatura */}
      <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-[10px] font-mono text-[#7e7e7e]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2979FF]" />
          Frío (&lt;75°)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00E676]" />
          Óptimo (75-100°)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF1744]" />
          Caliente (&gt;100°)
        </span>
      </div>
    </div>
  );
}
