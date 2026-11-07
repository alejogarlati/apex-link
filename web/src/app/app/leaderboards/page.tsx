"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { Trophy, RefreshCw, Car, Loader2, Gauge, Timer, Users } from "lucide-react";
import { obtenerLeaderboard } from "@/lib/apiClient";
import type { LeaderboardItemDto } from "@/types/api";

const CIRCUITO_MONZA = {
  id: "monza",
  nombre: "Autodromo Nazionale Monza",
  sub: "Grand Prix · 5.793 m",
};

function ContenidoLeaderboards() {
  const [ranking, setRanking] = useState<LeaderboardItemDto[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarLeaderboard = useCallback(() => {
    setCargando(true);
    obtenerLeaderboard(CIRCUITO_MONZA.id, 20)
      .then((res) => {
        if (res.exitoso && Array.isArray(res.datos)) {
          setRanking(res.datos);
        } else {
          setRanking([]);
        }
      })
      .catch(() => {
        setRanking([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  useEffect(() => {
    cargarLeaderboard();
    const recargar = () => cargarLeaderboard();
    window.addEventListener("apexlink_leaderboard_actualizado", recargar);
    return () => {
      window.removeEventListener("apexlink_leaderboard_actualizado", recargar);
    };
  }, [cargarLeaderboard]);

  const mejorVueltaStand = ranking[0]?.tiempo || "--:--.---";
  const totalVueltasStand = ranking.reduce((acc, curr) => acc + (curr.vueltas || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Oficial FAPPE 2026 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262626] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
            Torneo Fappe 2026 - Leaderboard
          </h1>
          <p className="mt-1 text-xs text-[#bbbbbb]">
            Clasificación oficial en vivo del simulador en {CIRCUITO_MONZA.nombre} ({CIRCUITO_MONZA.sub}) para la feria universitaria FAPPE 2026.
          </p>
        </div>

        <button
          onClick={cargarLeaderboard}
          disabled={cargando}
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#3c3c3c] text-xs font-mono font-bold uppercase text-[#bbbbbb] hover:text-white hover:border-[#0066b1] hover:bg-[#0066b1]/10 transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${cargando ? "animate-spin text-[#0066b1]" : ""}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* 3 Estadísticas Dinámicas del Torneo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Mejor Tiempo (Récord de entre todas las sesiones de los pilotos) */}
        <div className="border border-[#262626] bg-[#141414] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#7e7e7e]">
              Mejor Tiempo
            </span>
            <Timer className="w-4 h-4 text-[#0fa336]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#0fa336] tabular-nums tracking-tight">
              {cargando ? "--:--.---" : mejorVueltaStand}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#262626] flex flex-col gap-0.5">
            <span className="text-[10px] text-[#7e7e7e] font-mono uppercase tracking-wider">
              Récord de entre todas las sesiones de los pilotos
            </span>
            <span className="text-xs text-[#bbbbbb] font-mono truncate">
              {ranking[0]?.piloto ? `${ranking[0].piloto} · ${ranking[0].auto}` : "Sin tiempo de referencia"}
            </span>
          </div>
        </div>

        {/* 2. Pilotos Clasificados (Total de competidores) */}
        <div className="border border-[#262626] bg-[#141414] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#7e7e7e]">
              Pilotos Clasificados
            </span>
            <Users className="w-4 h-4 text-[#0066b1]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
              {cargando ? "--" : ranking.length}
            </span>
            <span className="text-xs text-[#7e7e7e] font-mono">
              {ranking.length === 1 ? "competidor" : "competidores"}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#262626] flex flex-col gap-0.5">
            <span className="text-[10px] text-[#7e7e7e] font-mono uppercase tracking-wider">
              Total de competidores
            </span>
            <span className="text-xs text-[#bbbbbb] font-mono">
              {ranking.length > 0 ? "En Autodromo Nazionale Monza" : "Esperando clasificados"}
            </span>
          </div>
        </div>

        {/* 3. Cantidad de Vueltas Registradas */}
        <div className="border border-[#262626] bg-[#141414] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#7e7e7e]">
              Vueltas Registradas
            </span>
            <Gauge className="w-4 h-4 text-[#1c69d4]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
              {cargando ? "--" : totalVueltasStand}
            </span>
            <span className="text-xs text-[#7e7e7e] font-mono">vueltas</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#262626] flex flex-col gap-0.5">
            <span className="text-[10px] text-[#7e7e7e] font-mono uppercase tracking-wider">
              Cantidad de vueltas registradas
            </span>
            <span className="text-xs text-[#bbbbbb] font-mono">
              {totalVueltasStand > 0 ? "Telemetría oficial en vivo" : "Sin vueltas registradas aún"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabla de Clasificación con fondo invisible y separadores lineales */}
      <div className="border-t border-b border-[#222225]">
        <div className="py-4 border-b border-[#222225] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#f4b400]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Clasificación Oficial Monza GP
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#bbbbbb] uppercase tracking-wider">
            {cargando && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0066b1]" />}
            <span>{CIRCUITO_MONZA.nombre}</span>
          </div>
        </div>

        {cargando ? (
          <div className="py-12 flex flex-col items-center justify-center text-[#7e7e7e]">
            <Loader2 className="w-6 h-6 animate-spin text-[#0066b1] mb-2" />
            <span className="text-xs font-mono">Cargando clasificación oficial...</span>
          </div>
        ) : ranking.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <Trophy className="w-10 h-10 text-[#7e7e7e] mb-3 opacity-30" />
            <h4 className="text-sm font-bold uppercase text-white tracking-wider">
              Sin registros en Monza GP
            </h4>
            <p className="text-xs text-[#7e7e7e] mt-1 max-w-md font-mono">
              Aún no se han registrado tiempos oficiales en este circuito para el Torneo Fappe 2026. Salí a pista en el simulador para inaugurar la tabla.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#222225]">
            {ranking.map((item) => (
              <div
                key={`${item.posicion}-${item.piloto}`}
                className="py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-xs shadow-sm ${
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
                  <div className="text-base font-bold text-[#0fa336] tabular-nums tracking-tight">
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
        )}
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
