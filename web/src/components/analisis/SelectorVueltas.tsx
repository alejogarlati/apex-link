"use client";

import { useMemo } from "react";
import { GitCompareArrows, Timer, TriangleAlert, Trophy, X } from "lucide-react";
import type { ResumenVuelta } from "@/types/telemetria";

export interface SelectorVueltasProps {
  vueltas: ResumenVuelta[];
  vueltaAId: string | null;
  vueltaBId: string | null;
  enSeleccionarVueltaA: (id: string) => void;
  enSeleccionarVueltaB: (id: string | null) => void;
}

/* -------------------------------------------------------------------------- */
/*                                   Constantes                                */
/* -------------------------------------------------------------------------- */

const COLOR_VUELTA_A = "#ffffff";
const COLOR_VUELTA_B = "#0066b1";

/* -------------------------------------------------------------------------- */
/*                                   Utilidades                                */
/* -------------------------------------------------------------------------- */

function unirClases(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(" ");
}

/** Formatea un delta en milisegundos como "+0.312" / "-0.150" (segundos). */
function formatearDelta(deltaMs: number): string {
  if (Math.abs(deltaMs) < 0.5) return "±0.000";
  const signo = deltaMs > 0 ? "+" : "-";
  return `${signo}${(Math.abs(deltaMs) / 1000).toFixed(3)}`;
}

function formatearNumeroVuelta(numero: number): string {
  return `V${String(numero).padStart(2, "0")}`;
}

/* -------------------------------------------------------------------------- */
/*                               Subcomponentes                                */
/* -------------------------------------------------------------------------- */

function FranjaM() {
  return (
    <div aria-hidden className="flex h-1 w-12">
      <span className="flex-1 bg-[#81c4ff]" />
      <span className="flex-1 bg-[#16588e]" />
      <span className="flex-1 bg-[#e22718]" />
    </div>
  );
}

function BadgeRanura({ ranura }: { ranura: "A" | "B" }) {
  const esA = ranura === "A";
  return (
    <span
      className={unirClases(
        "inline-flex h-5 w-5 items-center justify-center font-mono text-[10px] font-bold",
        esA ? "bg-white text-black" : "bg-[#0066b1] text-white",
      )}
      aria-label={`Vuelta ${ranura}`}
    >
      {ranura}
    </span>
  );
}

function BadgeRecord() {
  return (
    <span className="inline-flex items-center gap-1 bg-[#0066b1] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white">
      <Trophy className="h-3 w-3" strokeWidth={2.5} aria-hidden />
      Récord
    </span>
  );
}

function BadgeInvalida() {
  return (
    <span
      className="inline-flex items-center gap-1 border border-[#e22718]/60 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#e22718]"
      title="Vuelta inválida (track limits / corte)"
    >
      <TriangleAlert className="h-3 w-3" strokeWidth={2.5} aria-hidden />
      Inv
    </span>
  );
}

function Delta({ deltaMs, esReferencia }: { deltaMs: number | null; esReferencia: boolean }) {
  if (esReferencia) {
    return (
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
        Ref
      </span>
    );
  }
  if (deltaMs === null) {
    return <span className="font-mono text-sm text-[#5a5a5a]">—</span>;
  }
  const color =
    Math.abs(deltaMs) < 0.5 ? "text-[#bbbbbb]" : deltaMs < 0 ? "text-[#0fa336]" : "text-[#e22718]";
  return (
    <span className={unirClases("font-mono text-sm tabular-nums", color)}>
      {formatearDelta(deltaMs)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Componente                                  */
/* -------------------------------------------------------------------------- */

export function SelectorVueltas({
  vueltas,
  vueltaAId,
  vueltaBId,
  enSeleccionarVueltaA,
  enSeleccionarVueltaB,
}: SelectorVueltasProps) {
  const vueltasOrdenadas = useMemo(
    () => [...vueltas].sort((a, b) => a.numeroVuelta - b.numeroVuelta),
    [vueltas],
  );

  const mejorVuelta = useMemo(() => vueltas.find((v) => v.esMejorVuelta) ?? null, [vueltas]);

  /** La referencia del delta es la Vuelta A; si no hay, la mejor vuelta de la sesión. */
  const vueltaReferencia = useMemo(
    () => vueltas.find((v) => v.id === vueltaAId) ?? mejorVuelta,
    [vueltas, vueltaAId, mejorVuelta],
  );

  const vueltaB = useMemo(
    () => vueltas.find((v) => v.id === vueltaBId) ?? null,
    [vueltas, vueltaBId],
  );

  const manejarSeleccionA = (id: string): void => {
    // Una misma vuelta no puede ser A y B a la vez.
    if (id === vueltaBId) enSeleccionarVueltaB(null);
    enSeleccionarVueltaA(id);
  };

  const manejarAlternarB = (id: string): void => {
    if (id === vueltaAId) return;
    enSeleccionarVueltaB(id === vueltaBId ? null : id);
  };

  return (
    <section
      className="flex flex-col border border-[#3c3c3c] bg-[#1a1a1a] text-white"
      aria-labelledby="titulo-selector-vueltas"
    >
      {/* Encabezado */}
      <header className="flex flex-col gap-3 border-b border-[#3c3c3c] px-4 pb-3 pt-4">
        <FranjaM />
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2
              id="titulo-selector-vueltas"
              className="text-xs font-bold uppercase tracking-[0.25em] text-white"
            >
              Vueltas
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
              {vueltas.length} {vueltas.length === 1 ? "registrada" : "registradas"}
            </p>
          </div>

          {mejorVuelta && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Mejor vuelta
              </span>
              <span className="font-mono text-base tabular-nums text-white">
                {mejorVuelta.tiempoVueltaStr}
              </span>
            </div>
          )}
        </div>

        {/* Leyenda de ranuras */}
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a8a8a]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2" style={{ backgroundColor: COLOR_VUELTA_A }} aria-hidden />
            A · Base (clic en la fila)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2" style={{ backgroundColor: COLOR_VUELTA_B }} aria-hidden />
            B · Comparación
          </span>
        </div>
      </header>

      {/* Cabecera de columnas */}
      <div className="flex items-center gap-3 border-b border-[#3c3c3c] bg-[#141414] py-2 pl-5 pr-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#6a6a6a]">
        <span className="w-5" aria-hidden />
        <span className="w-9">N°</span>
        <span className="flex-1">Tiempo</span>
        <span className="w-16 text-right">Delta</span>
        <span className="w-9 text-center">Comp</span>
      </div>

      {/* Lista */}
      {vueltasOrdenadas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <Timer className="h-6 w-6 text-[#5a5a5a]" aria-hidden />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
            Sin vueltas en la sesión
          </p>
        </div>
      ) : (
        <ul className="max-h-[480px] overflow-y-auto" role="list">
          {vueltasOrdenadas.map((vuelta) => {
            const esA = vuelta.id === vueltaAId;
            const esB = vuelta.id === vueltaBId;
            const esReferencia = vueltaReferencia?.id === vuelta.id;
            const deltaMs = vueltaReferencia
              ? vuelta.tiempoVueltaMs - vueltaReferencia.tiempoVueltaMs
              : null;

            return (
              <li
                key={vuelta.id}
                className="border-b border-[#2a2a2a] last:border-b-0"
              >
                <div
                  className={unirClases(
                    "relative flex items-stretch transition-colors",
                    esA && "bg-white/[0.06]",
                    esB && "bg-[#0066b1]/[0.12]",
                    !esA && !esB && "hover:bg-white/[0.03]",
                  )}
                >
                  {/* Indicador lateral de ranura */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1"
                    style={{
                      backgroundColor: esA ? COLOR_VUELTA_A : esB ? COLOR_VUELTA_B : "transparent",
                    }}
                  />

                  {/* Selección de Vuelta A */}
                  <button
                    type="button"
                    onClick={() => manejarSeleccionA(vuelta.id)}
                    aria-pressed={esA}
                    aria-label={`Seleccionar vuelta ${vuelta.numeroVuelta} como base, tiempo ${vuelta.tiempoVueltaStr}`}
                    className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-5 pr-2 text-left outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white"
                  >
                    <span className="flex w-5 justify-center">
                      {esA && <BadgeRanura ranura="A" />}
                      {esB && <BadgeRanura ranura="B" />}
                    </span>

                    <span className="w-9 font-mono text-xs tabular-nums text-[#8a8a8a]">
                      {formatearNumeroVuelta(vuelta.numeroVuelta)}
                    </span>

                    <span className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <span
                        className={unirClases(
                          "font-mono text-base tabular-nums",
                          vuelta.esVueltaValida ? "text-white" : "text-[#8a8a8a] line-through decoration-[#e22718]/70",
                        )}
                      >
                        {vuelta.tiempoVueltaStr}
                      </span>
                      {vuelta.esMejorVuelta && <BadgeRecord />}
                      {!vuelta.esVueltaValida && <BadgeInvalida />}
                    </span>

                    <span className="flex w-16 justify-end">
                      <Delta deltaMs={deltaMs} esReferencia={esReferencia} />
                    </span>
                  </button>

                  {/* Alternar Vuelta B */}
                  <button
                    type="button"
                    onClick={() => manejarAlternarB(vuelta.id)}
                    disabled={esA}
                    aria-pressed={esB}
                    aria-label={
                      esB
                        ? `Quitar vuelta ${vuelta.numeroVuelta} de la comparación`
                        : `Comparar vuelta ${vuelta.numeroVuelta} como vuelta B`
                    }
                    title={esA ? "Es la vuelta base" : esB ? "Quitar comparación" : "Comparar como B"}
                    className={unirClases(
                      "my-2 mr-2 flex w-9 items-center justify-center border font-mono text-xs font-bold outline-none transition-colors focus-visible:ring-1 focus-visible:ring-white",
                      esB
                        ? "border-[#0066b1] bg-[#0066b1] text-white"
                        : "border-[#3c3c3c] text-[#8a8a8a] hover:border-[#0066b1] hover:text-white",
                      esA && "cursor-not-allowed opacity-25 hover:border-[#3c3c3c] hover:text-[#8a8a8a]",
                    )}
                  >
                    B
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Pie: estado de la comparación */}
      {vueltaB && (
        <footer className="flex items-center justify-between gap-3 border-t border-[#3c3c3c] bg-[#141414] px-4 py-2.5">
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
            <GitCompareArrows className="h-3.5 w-3.5 text-[#0066b1]" aria-hidden />
            Comparando con
            <span className="font-mono text-xs tracking-normal text-white">
              {formatearNumeroVuelta(vueltaB.numeroVuelta)}
            </span>
          </span>
          <button
            type="button"
            onClick={() => enSeleccionarVueltaB(null)}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a] outline-none transition-colors hover:text-white focus-visible:text-white"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Quitar
          </button>
        </footer>
      )}
    </section>
  );
}

export default SelectorVueltas;
