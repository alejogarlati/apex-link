"use client";

import { useMemo } from "react";
import { GitCompareArrows, Trophy, TriangleAlert, X, Flag, Check } from "lucide-react";
import type { ResumenVuelta } from "@/types/telemetria";
import { cn } from "@/lib/utils";

export interface SelectorVueltasProps {
  vueltas: ResumenVuelta[];
  vueltaAId: string | null;
  vueltaBId: string | null;
  enSeleccionarVueltaA: (id: string) => void;
  enSeleccionarVueltaB: (id: string | null) => void;
  orientacion?: "vertical" | "horizontal";
}

const COLOR_VUELTA_A = "#ffffff";
const COLOR_VUELTA_B = "#0066b1";

/** Formatea un delta en milisegundos como "+0.312" / "-0.150" (segundos). */
function formatearDelta(deltaMs: number): string {
  if (Math.abs(deltaMs) < 0.5) return "±0.000 s";
  const signo = deltaMs > 0 ? "+" : "-";
  return `${signo}${(Math.abs(deltaMs) / 1000).toFixed(3)} s`;
}

function formatearNumeroVuelta(numero: number): string {
  return `V${String(numero).padStart(2, "0")}`;
}

function FranjaM() {
  return (
    <div aria-hidden className="flex h-1 w-10 shrink-0">
      <span className="flex-1 bg-[#81c4ff]" />
      <span className="flex-1 bg-[#16588e]" />
      <span className="flex-1 bg-[#e22718]" />
    </div>
  );
}

export function SelectorVueltas({
  vueltas,
  vueltaAId,
  vueltaBId,
  enSeleccionarVueltaA,
  enSeleccionarVueltaB,
  orientacion = "vertical",
}: SelectorVueltasProps) {
  const vueltasOrdenadas = useMemo(
    () => [...vueltas].sort((a, b) => a.numeroVuelta - b.numeroVuelta),
    [vueltas]
  );

  const mejorVuelta = useMemo(() => vueltas.find((v) => v.esMejorVuelta) ?? null, [vueltas]);

  const vueltaReferencia = useMemo(
    () => vueltas.find((v) => v.id === vueltaAId) ?? mejorVuelta,
    [vueltas, vueltaAId, mejorVuelta]
  );

  const vueltaA = useMemo(
    () => vueltas.find((v) => v.id === vueltaAId) ?? null,
    [vueltas, vueltaAId]
  );

  const vueltaB = useMemo(
    () => vueltas.find((v) => v.id === vueltaBId) ?? null,
    [vueltas, vueltaBId]
  );

  const manejarSeleccionA = (id: string): void => {
    if (id === vueltaBId) enSeleccionarVueltaB(null);
    enSeleccionarVueltaA(id);
  };

  const manejarAlternarB = (id: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    if (id === vueltaAId) return;
    enSeleccionarVueltaB(id === vueltaBId ? null : id);
  };

  const esVertical = orientacion === "vertical";

  return (
    <div
      className={cn(
        esVertical
          ? "rounded-xl border border-[#262626] bg-[#0c0c0e] p-3 sm:p-4 space-y-3.5 shadow-xl"
          : "pb-6 border-b border-[#222225] space-y-4"
      )}
    >
      {/* Encabezado: Título, Resumen de Comparación y Mejor Vuelta */}
      <div
        className={cn(
          "flex justify-between gap-3 pb-3 border-b border-[#262626]",
          esVertical ? "flex-col" : "flex-col sm:flex-row sm:items-center"
        )}
      >
        <div className="flex items-center gap-3">
          <FranjaM />
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.18em] text-white flex items-center gap-2">
              <span>{esVertical ? "Vueltas de Tanda" : "Selección de Vueltas de Telemetría"}</span>
              <span className="px-1.5 py-0.5 rounded bg-[#262626] text-[10px] text-[#bbbbbb] font-mono">
                {vueltas.length} {vueltas.length === 1 ? "vuelta" : "vueltas"}
              </span>
            </h2>
          </div>
        </div>

        {/* Chips de Ranuras Activas y Mejor Vuelta */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Chip Vuelta A (Base) */}
          <div className="flex items-center gap-1.5 border border-white/40 px-2 py-0.5 rounded-md text-white font-mono">
            <span className="w-3 h-3 rounded-full bg-white text-black font-black text-[8px] flex items-center justify-center">
              A
            </span>
            <span className="font-bold text-[10px] sm:text-[11px]">
              {vueltaA ? `${formatearNumeroVuelta(vueltaA.numeroVuelta)} (${vueltaA.tiempoVueltaStr})` : "Sin Base"}
            </span>
          </div>

          {/* Chip Vuelta B (Comparativa) */}
          {vueltaB ? (
            <div className="flex items-center gap-1.5 border border-[#1c69d4] px-2 py-0.5 rounded-md text-[#93c5fd] font-mono">
              <span className="w-3 h-3 rounded-full bg-[#1c69d4] text-white font-black text-[8px] flex items-center justify-center">
                B
              </span>
              <span className="font-bold text-[10px] sm:text-[11px]">
                {formatearNumeroVuelta(vueltaB.numeroVuelta)} ({vueltaB.tiempoVueltaStr})
              </span>
              <button
                type="button"
                onClick={() => enSeleccionarVueltaB(null)}
                title="Quitar vuelta de comparación"
                className="ml-0.5 text-[#93c5fd] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 border border-white/10 px-2 py-0.5 rounded-md text-[#7e7e7e] font-mono text-[10px]">
              <GitCompareArrows className="w-3 h-3 text-[#555555]" />
              <span>Sin comparativa (+ VS B)</span>
            </div>
          )}

          {/* Badge Mejor Vuelta de Sesión */}
          {mejorVuelta && (
            <div className="flex items-center gap-1 border border-[#0066b1]/60 px-2 py-0.5 rounded-md text-[#81c4ff] text-[10px] font-mono">
              <Trophy className="w-3 h-3 text-[#f4b400]" />
              <span className="text-[9px] uppercase font-bold text-[#bbbbbb]">Récord:</span>
              <span className="font-bold text-white">{mejorVuelta.tiempoVueltaStr}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Tarjetas de Vuelta */}
      {vueltasOrdenadas.length === 0 ? (
        <div className="py-8 text-center text-xs font-mono text-[#7e7e7e]">
          No hay vueltas registradas en esta tanda para analizar.
        </div>
      ) : (
        <div
          className={cn(
            esVertical
              ? "flex flex-col gap-2 max-h-[calc(100vh-270px)] overflow-y-auto pr-1"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          )}
        >
          {vueltasOrdenadas.map((vuelta) => {
            const esA = vuelta.id === vueltaAId;
            const esB = vuelta.id === vueltaBId;
            const esReferencia = vueltaReferencia?.id === vuelta.id;
            const deltaMs = vueltaReferencia
              ? vuelta.tiempoVueltaMs - vueltaReferencia.tiempoVueltaMs
              : null;

            return (
              <div
                key={vuelta.id}
                onClick={() => manejarSeleccionA(vuelta.id)}
                className={cn(
                  "relative rounded-lg p-2.5 transition-all cursor-pointer border select-none flex flex-col justify-between gap-2 group",
                  esA
                    ? "bg-white/[0.08] border-white ring-1 ring-white/50 shadow-md shadow-white/5"
                    : esB
                    ? "bg-[#1c69d4]/[0.15] border-[#1c69d4] ring-1 ring-[#1c69d4]/60 shadow-md shadow-[#1c69d4]/10"
                    : "border-white/10 hover:border-white/25 hover:bg-white/[0.03] bg-[#121214]"
                )}
              >
                {/* Cabecera de la Tarjeta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-white">
                      {formatearNumeroVuelta(vuelta.numeroVuelta)}
                    </span>
                    {vuelta.esMejorVuelta && (
                      <span className="inline-flex items-center gap-1 bg-[#0066b1] px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider text-white">
                        <Trophy className="w-2.5 h-2.5 text-[#f4b400]" />
                        PB
                      </span>
                    )}
                    {!vuelta.esVueltaValida && (
                      <span className="inline-flex items-center gap-1 border border-[#e22718]/60 bg-[#e22718]/10 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider text-[#e22718]">
                        <TriangleAlert className="w-2.5 h-2.5" />
                        Inv
                      </span>
                    )}
                  </div>

                  {/* Badge de Ranura Asignada */}
                  <div className="flex items-center gap-1">
                    {esA && (
                      <span className="px-1.5 py-0.5 rounded bg-white text-black text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Check className="w-2.5 h-2.5 stroke-[3]" /> Base A
                      </span>
                    )}
                    {esB && (
                      <span className="px-1.5 py-0.5 rounded bg-[#1c69d4] text-white text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Check className="w-2.5 h-2.5 stroke-[3]" /> Comp B
                      </span>
                    )}
                  </div>
                </div>

                {/* Tiempo de Vuelta y Delta */}
                <div className="flex items-baseline justify-between border-t border-[#262626] pt-1.5">
                  <div>
                    <span className="text-[9px] text-[#7e7e7e] block uppercase font-mono leading-none">
                      Tiempo
                    </span>
                    <span
                      className={cn(
                        "font-mono text-base font-black tracking-tight",
                        vuelta.esVueltaValida ? "text-white" : "text-[#8a8a8a] line-through decoration-[#e22718]"
                      )}
                    >
                      {vuelta.tiempoVueltaStr}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-[#7e7e7e] block uppercase font-mono leading-none">
                      Delta
                    </span>
                    {esReferencia ? (
                      <span className="font-mono text-[11px] font-bold text-[#bbbbbb] uppercase tracking-wider">
                        Referencia
                      </span>
                    ) : deltaMs !== null ? (
                      <span
                        className={cn(
                          "font-mono text-[11px] font-bold tabular-nums",
                          deltaMs < 0 ? "text-[#0fa336]" : "text-[#e22718]"
                        )}
                      >
                        {formatearDelta(deltaMs)}
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-[#555555]">—</span>
                    )}
                  </div>
                </div>

                {/* Botonera de Acción */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      manejarSeleccionA(vuelta.id);
                    }}
                    className={cn(
                      "flex-1 py-1 px-2 rounded text-[10px] font-bold uppercase tracking-wider text-center transition-colors cursor-pointer",
                      esA
                        ? "bg-white text-black font-black"
                        : "bg-[#222224] hover:bg-[#2c2c30] text-[#bbbbbb] hover:text-white"
                    )}
                  >
                    {esA ? "Base Activa" : "Elegir Base"}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => manejarAlternarB(vuelta.id, e)}
                    disabled={esA}
                    className={cn(
                      "py-1 px-2 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer",
                      esA
                        ? "opacity-30 cursor-not-allowed bg-[#222224] text-[#666666]"
                        : esB
                        ? "bg-[#1c69d4] text-white hover:bg-[#16588e]"
                        : "border border-[#3c3c3c] hover:border-[#1c69d4] text-[#bbbbbb] hover:text-white"
                    )}
                  >
                    {esB ? "Quitar B" : "+ VS B"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SelectorVueltas;
