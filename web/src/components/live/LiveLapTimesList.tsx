"use client";

import Link from "next/link";
import { Clock, Trophy, LineChart, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import type { LapCompletedEvent, TelemetriaCronometraje } from "@/types/telemetria";

export interface VueltaRegistrada {
  lapNumber: number;
  lapTimeMs: number;
  lapTimeStr: string;
  isPersonalBest: boolean;
  isValidLap: boolean;
  sectors: [number, number, number]; // tiempos en segundos
  topSpeedKmh?: number;
}

interface LiveLapTimesListProps {
  timing: TelemetriaCronometraje;
  vueltas: VueltaRegistrada[];
  topSpeedActual?: number;
}

export function LiveLapTimesList({
  timing,
  vueltas,
  topSpeedActual,
}: LiveLapTimesListProps) {
  // Mejor tiempo registrado (PB)
  const vueltaPB = vueltas.find((v) => v.isPersonalBest) || vueltas[0];

  const deltaNegativo = timing.deltaMs < 0;
  const deltaStr = (timing.deltaMs / 1000).toFixed(3);

  return (
    <div className="w-full space-y-3">
      {/* Cabecera de la Sección con Estadísticas */}
      <div className="flex items-center justify-between border-b border-[#222225] pb-2.5">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-[#0066b1]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Tiempos de Vuelta • Sesión en Vivo
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-[#7e7e7e]">Total Vueltas:</span>
            <span className="text-white font-bold">{Math.max(timing.currentLap, vueltas.length)}</span>
          </div>
          {vueltaPB && (
            <div className="hidden sm:flex items-center gap-1.5 text-[#00E676]">
              <Trophy className="w-3.5 h-3.5 text-[#f4b400]" />
              <span className="text-[#8e8e93]">PB:</span>
              <span className="font-bold">{vueltaPB.lapTimeStr}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Vueltas (Fondo transparente con separadores lineales) */}
      <div className="divide-y divide-[#1c1c1f] border-b border-[#222225]">
        {/* 1. Vuelta en Curso (En Tiempo Real) */}
        <div className="py-2.5 flex items-center justify-between text-xs font-mono bg-white/[0.02] px-3 rounded-lg border border-[#0066b1]/30">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
            <span className="font-bold text-white">
              V{timing.currentLap || 1}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-[#0066b1]/20 text-[#0066b1] border border-[#0066b1]/40">
              En Pista
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="text-right">
              <span className="text-[10px] text-[#7e7e7e] block">Cronómetro</span>
              <span className="text-sm font-bold text-white tabular-nums tracking-tight">
                {timing.lapTimeStr || "00:00.000"}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#7e7e7e] block">Sector</span>
              <span className="text-xs font-bold text-[#0066b1]">
                S{timing.sector || 1}
              </span>
            </div>

            <div className="text-right min-w-[70px]">
              <span className="text-[10px] text-[#7e7e7e] block">Delta PB</span>
              <span
                className={`text-xs font-bold tabular-nums ${
                  deltaNegativo ? "text-[#0fa336]" : "text-[#e22718]"
                }`}
              >
                {deltaNegativo ? deltaStr : `+${deltaStr}`} s
              </span>
            </div>
          </div>
        </div>

        {/* 2. Vueltas Completadas Anteriores */}
        {vueltas.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#7e7e7e] font-mono">
            Completá la primera vuelta para registrar parciales y récords en el muro.
          </div>
        ) : (
          vueltas.map((v) => {
            const esPB = v.isPersonalBest;
            const deltaConPB = vueltaPB ? ((v.lapTimeMs - vueltaPB.lapTimeMs) / 1000).toFixed(3) : "0.000";
            const esMismoPB = v.lapNumber === vueltaPB?.lapNumber;

            return (
              <div
                key={v.lapNumber}
                className="py-2.5 px-3 flex items-center justify-between text-xs font-mono hover:bg-white/[0.02] transition-colors group"
              >
                {/* Lado izquierdo: Número de Vuelta y Badges de Calidad */}
                <div className="flex items-center gap-3">
                  <span className="text-[#8e8e93] font-semibold w-7">
                    V{v.lapNumber}
                  </span>

                  {esPB ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-[#f4b400]">
                      <Trophy className="w-3 h-3 text-[#f4b400]" />
                      PB
                    </span>
                  ) : v.isValidLap ? (
                    <span className="text-[10px] text-[#7e7e7e]">
                      Válida
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#e22718]">
                      Límites
                    </span>
                  )}
                </div>

                {/* Parciales de Sectores S1 / S2 / S3 */}
                <div className="hidden md:flex items-center gap-4 text-[#8e8e93] text-[11px]">
                  <span>
                    S1: <span className="text-white font-medium">{v.sectors[0]?.toFixed(3) ?? "--.---"}</span>
                  </span>
                  <span className="text-[#3c3c3c]">|</span>
                  <span>
                    S2: <span className="text-white font-medium">{v.sectors[1]?.toFixed(3) ?? "--.---"}</span>
                  </span>
                  <span className="text-[#3c3c3c]">|</span>
                  <span>
                    S3: <span className="text-white font-medium">{v.sectors[2]?.toFixed(3) ?? "--.---"}</span>
                  </span>
                </div>

                {/* Tiempo Total, Delta y Botón Analizar */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <span
                      className={`text-sm font-bold tabular-nums tracking-tight ${
                        esPB ? "text-[#f4b400]" : "text-white"
                      }`}
                    >
                      {v.lapTimeStr}
                    </span>
                    <span className="block text-[10px] text-[#7e7e7e]">
                      {esMismoPB ? "Récord Sesión" : `+${deltaConPB} s`}
                    </span>
                  </div>

                  <Link
                    href={`/app/analysis?vuelta=${v.lapNumber}`}
                    title="Analizar vuelta en uPlot"
                    className="p-1.5 rounded text-[#7e7e7e] hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <LineChart className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
