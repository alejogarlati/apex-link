"use client";

import { useMemo } from "react";
import { GitCompareArrows, Trophy, TriangleAlert, X, Check } from "lucide-react";
import type { ResumenVuelta } from "@/types/telemetria";
import { cn } from "@/lib/utils";

export interface SelectorVueltasProps {
  vueltas: ResumenVuelta[];
  vueltaAId: string | null;
  vueltaBId: string | null;
  enSeleccionarVueltaA: (id: string) => void;
  enSeleccionarVueltaB: (id: string | null) => void;
}

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
      <span className="flex-1 bg-[#0066b1]" />
      <span className="flex-1 bg-[#1c69d4]" />
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

  return (
    <div className="card-cockpit-gradient border border-[#262626] rounded-none border-sheen p-6 sm:p-8 space-y-6">
      {/* Encabezado Superior: Título, Resumen de Comparación y Mejor Vuelta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#262626]">
        <div className="flex items-center gap-3">
          <FranjaM />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2.5 font-mono">
              <span>Selección de Vueltas de Telemetría</span>
              <span className="px-2.5 py-0.5 rounded-none bg-[#262626] text-[10px] text-[#bbbbbb] font-mono tracking-wider border border-[#3c3c3c]">
                {vueltas.length} {vueltas.length === 1 ? "VUELTA REGISTRADA" : "VUELTAS REGISTRADAS"}
              </span>
            </h2>
          </div>
        </div>

        {/* Chips de Ranuras Activas y Mejor Vuelta */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Chip Vuelta A (Base) */}
          <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#3c3c3c] px-3 py-1.5 rounded-none text-white font-mono tracking-wider">
            <span className="w-4 h-4 rounded-none bg-white text-black font-black text-[10px] flex items-center justify-center">
              A
            </span>
            <span className="font-bold text-xs">
              {vueltaA ? `${formatearNumeroVuelta(vueltaA.numeroVuelta)} (${vueltaA.tiempoVueltaStr})` : "Sin Base"}
            </span>
          </div>

          {/* Chip Vuelta B (Comparativa) */}
          {vueltaB ? (
            <div className="flex items-center gap-2 bg-[#0066b1]/15 border border-[#0066b1] px-3 py-1.5 rounded-none text-white font-mono tracking-wider">
              <span className="w-4 h-4 rounded-none bg-[#0066b1] text-white font-black text-[10px] flex items-center justify-center">
                B
              </span>
              <span className="font-bold text-xs">
                {formatearNumeroVuelta(vueltaB.numeroVuelta)} ({vueltaB.tiempoVueltaStr})
              </span>
              <button
                type="button"
                onClick={() => enSeleccionarVueltaB(null)}
                title="Quitar vuelta de comparación"
                className="ml-1 text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#141414] border border-[#262626] px-3 py-1.5 rounded-none text-[#7e7e7e] font-mono text-xs tracking-wider">
              <GitCompareArrows className="w-4 h-4 text-[#555555]" />
              <span>Sin comparativa (clic en "+ VS B")</span>
            </div>
          )}

          {/* Badge Mejor Vuelta de Sesión */}
          {mejorVuelta && (
            <div className="flex items-center gap-2 bg-[#f4b400]/10 border border-[#f4b400]/40 px-3 py-1.5 rounded-none text-[#f4b400] text-xs font-mono tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-[#f4b400]" />
              <span className="text-[10px] uppercase font-bold">Récord:</span>
              <span className="font-bold text-white">{mejorVuelta.tiempoVueltaStr}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lista Vertical de Vueltas (Formato Fila Horizontal Estilo Hub sin Imagen de Fondo) */}
      <div className="flex flex-col gap-3">
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
                "group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-none border transition-all cursor-pointer select-none gap-4",
                esA
                  ? "bg-[#1a1a1a] border-l-4 border-l-white border-y border-r border-[#3c3c3c]"
                  : esB
                  ? "bg-[#0066b1]/15 border-l-4 border-l-[#0066b1] border-y border-r border-[#0066b1]/60"
                  : "bg-[#141414] border-l-4 border-l-transparent border-y border-r border-[#262626] hover:border-[#3c3c3c]"
              )}
            >
              {/* Información Izquierda: Número de Vuelta, Récord, Estado */}
              <div className="flex items-center gap-4">
                <span className="font-mono text-base sm:text-lg font-bold text-white w-12">
                  {formatearNumeroVuelta(vuelta.numeroVuelta)}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {vuelta.esMejorVuelta && (
                    <span className="inline-flex items-center gap-1.5 bg-[#f4b400]/10 border border-[#f4b400]/40 px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider text-[#f4b400]">
                      <Trophy className="w-3 h-3 text-[#f4b400]" />
                      Récord
                    </span>
                  )}

                  {!vuelta.esVueltaValida && (
                    <span className="inline-flex items-center gap-1 border border-[#e22718]/40 bg-[#e22718]/10 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider text-[#e22718]">
                      <TriangleAlert className="w-3 h-3" />
                      Inválida
                    </span>
                  )}

                  {esA && (
                    <span className="px-2.5 py-0.5 rounded-none bg-white text-black text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Base A
                    </span>
                  )}

                  {esB && (
                    <span className="px-2.5 py-0.5 rounded-none bg-[#0066b1] text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Comp B
                    </span>
                  )}
                </div>
              </div>

              {/* Centro: Tiempo de Vuelta & Delta */}
              <div className="flex items-baseline sm:items-center gap-6 font-mono">
                <div>
                  <span className="text-[10px] text-[#7e7e7e] uppercase block sm:hidden">Tiempo</span>
                  <span
                    className={cn(
                      "font-mono text-lg sm:text-xl font-bold tracking-tight",
                      vuelta.esVueltaValida ? "text-white" : "text-[#7e7e7e] line-through decoration-[#e22718]"
                    )}
                  >
                    {vuelta.tiempoVueltaStr}
                  </span>
                </div>

                <div className="text-right sm:text-left min-w-[90px]">
                  <span className="text-[10px] text-[#7e7e7e] uppercase block sm:hidden">Delta</span>
                  {esReferencia ? (
                    <span className="font-mono text-xs font-bold text-[#bbbbbb] uppercase tracking-wider">
                      Referencia
                    </span>
                  ) : deltaMs !== null ? (
                    <span
                      className={cn(
                        "font-mono text-sm font-bold tabular-nums",
                        deltaMs < 0 ? "text-[#0fa336]" : "text-[#e22718]"
                      )}
                    >
                      {formatearDelta(deltaMs)}
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-[#555555]">—</span>
                  )}
                </div>
              </div>

              {/* Botonera de Acción a la Derecha */}
              <div className="flex items-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#262626]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    manejarSeleccionA(vuelta.id);
                  }}
                  className={cn(
                    "py-2 px-3.5 rounded-none text-xs font-mono font-bold uppercase tracking-[0.12em] text-center transition-all cursor-pointer",
                    esA
                      ? "bg-white text-black font-black"
                      : "bg-[#0d0d0d] hover:bg-[#1a1a1a] text-[#bbbbbb] hover:text-white border border-[#3c3c3c]"
                  )}
                >
                  {esA ? "Base Activa (A)" : "Elegir Base (A)"}
                </button>

                <button
                  type="button"
                  onClick={(e) => manejarAlternarB(vuelta.id, e)}
                  disabled={esA}
                  className={cn(
                    "py-2 px-3.5 rounded-none text-xs font-mono font-bold uppercase tracking-[0.12em] transition-all cursor-pointer",
                    esA
                      ? "opacity-30 cursor-not-allowed bg-[#0d0d0d] text-[#555555] border border-transparent"
                      : esB
                      ? "bg-[#0066b1] text-white hover:bg-[#1c69d4] border border-[#0066b1]"
                      : "bg-[#0d0d0d] border border-[#3c3c3c] hover:border-[#0066b1] text-[#bbbbbb] hover:text-white"
                  )}
                >
                  {esB ? "Quitar B" : "+ VS B"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SelectorVueltas;
