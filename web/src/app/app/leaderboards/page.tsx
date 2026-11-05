"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Trophy, RefreshCw, Flag, Car, ShieldCheck, Loader2 } from "lucide-react";
import { obtenerLeaderboard } from "@/lib/apiClient";
import type { LeaderboardItemDto } from "@/types/api";
import { BotonColapsarSidebar } from "@/components/layout/BotonColapsarSidebar";

const CIRCUITOS_TABS = [
  { id: "monza", nombre: "Monza GP", sub: "5.793 m" },
  { id: "spa", nombre: "Spa-Francorchamps", sub: "7.004 m" },
  { id: "redbullring", nombre: "Red Bull Ring", sub: "4.318 m" },
];

function ContenidoLeaderboards() {
  const searchParams = useSearchParams();
  const circuitoInicial = searchParams.get("circuito") || "monza";

  const [circuitoActivo, setCircuitoActivo] = useState(
    circuitoInicial.toLowerCase().includes("spa")
      ? "spa"
      : circuitoInicial.toLowerCase().includes("redbull")
      ? "redbullring"
      : "monza"
  );
  const [ranking, setRanking] = useState<LeaderboardItemDto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);

    obtenerLeaderboard(circuitoActivo, 10)
      .then((res) => {
        if (!cancelado && res.exitoso && Array.isArray(res.datos)) {
          setRanking(res.datos);
        }
      })
      .catch(() => {
        // Fallback silencioso
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [circuitoActivo]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262626] pb-4">
        <div className="flex items-start gap-3.5">
          <BotonColapsarSidebar />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
              Tabla de Récords
            </h1>
            <p className="mt-1 text-xs text-[#bbbbbb]">
              Tiempos registrados en el simulador sincronizados con la base de datos central.
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Circuito (Pestañas limpias sin cards de fondo) */}
      <div className="flex flex-wrap items-center gap-2">
        {CIRCUITOS_TABS.map((tab) => {
          const activo = circuitoActivo === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCircuitoActivo(tab.id)}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activo
                  ? "bg-[#0066b1] text-white shadow-md shadow-[#0066b1]/20"
                  : "text-[#8e8e93] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{tab.nombre}</span>
              <span className={`text-[10px] ${activo ? "text-white/80" : "text-[#7e7e7e]"}`}>
                ({tab.sub})
              </span>
            </button>
          );
        })}
      </div>

      {/* Tabla de Clasificación con fondo invisible y separadores lineales */}
      <div className="border-t border-b border-[#222225]">
        <div className="py-4 border-b border-[#222225] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#f4b400]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {CIRCUITOS_TABS.find((t) => t.id === circuitoActivo)?.nombre}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#7e7e7e]">
            {cargando && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0066b1]" />}
            <span>{ranking.length} registros</span>
          </div>
        </div>

        <div className="divide-y divide-[#222225]">
          {ranking.map((item) => (
            <div
              key={`${item.posicion}-${item.piloto}`}
              className="py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shadow-sm ${
                    item.posicion === 1
                      ? "bg-[#f4b400] text-black font-black"
                      : item.posicion === 2
                      ? "bg-[#bbbbbb] text-black font-black"
                      : item.posicion === 3
                      ? "bg-[#e22718] text-white font-black"
                      : "bg-[#262626] text-[#bbbbbb]"
                  }`}
                >
                  {item.posicion}
                </span>

                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{item.piloto}</span>
                  </div>
                  <div className="text-xs text-[#7e7e7e] font-mono flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-[#bbbbbb]">
                      <Car className="w-3 h-3 text-[#0066b1]" />
                      {item.auto}
                    </span>
                    <span>•</span>
                    <span>{item.vueltas} vueltas rodadas</span>
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-base font-bold text-[#00E676] tabular-nums tracking-tight">
                  {item.tiempo}
                </div>
                <div
                  className={`text-[11px] font-bold tabular-nums ${
                    item.delta === "Ref" ? "text-[#7e7e7e]" : "text-[#e22718]"
                  }`}
                >
                  {item.delta}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PaginaLeaderboards() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#7e7e7e]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0066b1] mb-2" />
          <span className="text-xs font-mono">Cargando clasificación oficial...</span>
        </div>
      }
    >
      <ContenidoLeaderboards />
    </Suspense>
  );
}
