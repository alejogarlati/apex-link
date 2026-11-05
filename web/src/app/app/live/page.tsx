"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flag,
  Gauge,
  LineChart,
  Radio,
  RefreshCw,
  Trophy,
  Zap,
} from "lucide-react";
import { useLiveTelemetryWebSocket } from "@/hooks/useLiveTelemetryWebSocket";
import { PedalTelemetryBars } from "@/components/live/PedalTelemetryBars";
import { KammFrictionCircle } from "@/components/live/KammFrictionCircle";
import { TyreThermalsMatrix } from "@/components/live/TyreThermalsMatrix";
import { LiveTrackMinimap } from "@/components/live/LiveTrackMinimap";
import { solicitarPost } from "@/lib/apiClient";
import type { EstadoMockDto } from "@/types/api";

export default function PaginaLivePitwall() {
  const {
    conectado,
    frame,
    ultimoEventoVuelta,
    latenciaMs,
    fpsEstimado,
    totalCuadrosRecibidos,
    reconectar,
  } = useLiveTelemetryWebSocket();

  const [conmutandoMock, setConmutandoMock] = useState(false);

  const manejarAlternarMock = async () => {
    try {
      setConmutandoMock(true);
      await solicitarPost<EstadoMockDto>("/api/mock/alternar", {});
    } catch {
      // Manejado defensivamente
    } finally {
      setConmutandoMock(false);
    }
  };

  // Valores de fallback cuando no hay frame activo
  const auto = frame?.car ?? {
    speedKmh: 0,
    rpms: 0,
    maxRpm: 13000,
    gear: 0,
    throttle: 0,
    brake: 0,
    steer: 0,
    drsAvailable: false,
    drsEnabled: false,
  };

  const timing = frame?.timing ?? {
    lapTimeMs: 0,
    lapTimeStr: "--:--.---",
    bestTimeMs: 0,
    bestTimeStr: "--:--.---",
    deltaMs: 0,
    currentLap: 0,
    sector: 1,
    lapProgress: 0,
  };

  const neumaticos = frame?.tyres ?? {
    pressurePsi: [27.5, 27.8, 27.6, 27.9],
    tempCoreC: [85.0, 92.0, 86.0, 93.0],
    wear: [98, 97, 98, 97],
  };

  const dinamicas = frame?.dynamics ?? {
    gForce: { lat: 0, lon: 0, vert: 1 },
    worldPos: { x: 0, y: 12, z: 0 },
  };

  const sesion = frame?.session ?? {
    flag: "GREEN",
    position: 1,
    track: "monza",
    carModel: "ks_ferrari_sf70h",
  };

  const deltaNegativo = timing.deltaMs < 0;
  const deltaStr = (timing.deltaMs / 1000).toFixed(3);
  const deltaColor = deltaNegativo ? "text-[#0fa336]" : "text-[#e22718]";
  const deltaFondo = deltaNegativo ? "bg-[#0fa336]/10" : "bg-[#e22718]/10";
  const deltaBorde = deltaNegativo ? "border-[#0fa336]/30" : "border-[#e22718]/30";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header con Telemetría en Vivo e Indicador de Estado (Separador lineal, sin cards) */}
      <div className="pb-6 border-b border-[#222225] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={conectado ? "text-[#0fa336]" : "text-[#e22718]"}>
            <Radio className={`w-6 h-6 ${conectado ? "animate-pulse" : ""}`} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                Autodromo Nazionale Monza • {sesion.carModel}
              </h1>
              {conectado ? (
                <span className="flex items-center gap-1.5 text-xs font-mono text-[#0fa336] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#0fa336] animate-pulse" />
                  Live {fpsEstimado} FPS
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-mono text-[#e22718] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#e22718]" />
                  Desconectado
                </span>
              )}
            </div>
            <p className="text-xs text-[#bbbbbb] font-mono mt-1">
              Canal compartido Win32 MMF @ 60 Hz
            </p>
          </div>
        </div>

        {/* Panel derecho: Ping, Contador y Conmutador Mock (Sin cards de fondo) */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#7e7e7e]">Ping:</span>
            <span className="text-white font-bold">{latenciaMs} ms</span>
            <span className="text-[#3c3c3c]">|</span>
            <span className="text-[#7e7e7e]">Cuadros:</span>
            <span className="text-[#0066b1] font-bold">{totalCuadrosRecibidos}</span>
          </div>

          <button
            onClick={manejarAlternarMock}
            disabled={conmutandoMock}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono uppercase border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-[#f4b400]" />
            {conmutandoMock ? "Conmutando..." : "Alternar Mock"}
          </button>

          {!conectado && (
            <button
              onClick={reconectar}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono uppercase bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#0066b1]/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reconectar
            </button>
          )}
        </div>
      </div>

      {/* 2. Banner de Notificación de Vuelta Récord / Cruce de Meta */}
      {ultimoEventoVuelta && (
        <div className="py-4 border-b border-[#222225] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-[#f4b400] shrink-0" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066b1] font-mono">
                {ultimoEventoVuelta.isPersonalBest ? "¡Récord Personal (PB)!" : "Vuelta Completada"}
              </span>
              <div className="text-lg font-bold font-mono text-white tabular-nums">
                Vuelta {ultimoEventoVuelta.lapNumber} • {ultimoEventoVuelta.lapTimeStr}
              </div>
            </div>
          </div>

          <Link
            href="/app/analysis"
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1c69d4]"
          >
            <LineChart className="w-3.5 h-3.5" />
            Analizar en uPlot
          </Link>
        </div>
      )}

      {/* 3. Instrumental Superior Unificado (Fondo invisible con separadores lineales) */}
      <div className="py-6 border-b border-[#222225] grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-0 md:divide-x md:divide-[#222225]">
        {/* Velocímetro */}
        <div className="md:pr-5">
          <span className="text-[10px] uppercase font-bold text-[#7e7e7e] font-mono tracking-wider">Velocidad</span>
          <div className="text-3xl font-bold font-mono text-white mt-1 tabular-nums tracking-tight">
            {auto.speedKmh.toFixed(0)}
            <span className="text-xs text-[#7e7e7e] ml-1 font-normal">km/h</span>
          </div>
        </div>

        {/* Marcha */}
        <div className="md:px-5">
          <span className="text-[10px] uppercase font-bold text-[#7e7e7e] font-mono tracking-wider">Marcha</span>
          <div className="text-3xl font-bold font-mono text-[#0066b1] mt-1 tabular-nums tracking-tight">
            {auto.gear === -1 ? "R" : auto.gear === 0 ? "N" : auto.gear}
          </div>
        </div>

        {/* Tacómetro / RPM */}
        <div className="md:px-5">
          <span className="text-[10px] uppercase font-bold text-[#7e7e7e] font-mono tracking-wider">Régimen de Giro</span>
          <div className="text-3xl font-bold font-mono text-white mt-1 tabular-nums tracking-tight">
            {auto.rpms.toLocaleString("es-AR")}
            <span className="text-xs text-[#7e7e7e] ml-1 font-normal">RPM</span>
          </div>
        </div>

        {/* Cronómetro Actual */}
        <div className="md:px-5">
          <span className="text-[10px] uppercase font-bold text-[#7e7e7e] font-mono tracking-wider">Vuelta {timing.currentLap}</span>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums tracking-tight">
            {timing.lapTimeStr}
          </div>
        </div>

        {/* Delta Time */}
        <div className="col-span-2 md:col-span-1 md:pl-5">
          <span className="text-[10px] uppercase font-bold text-[#7e7e7e] font-mono tracking-wider">Delta vs Récord</span>
          <div className={`text-2xl font-bold font-mono mt-1 ${deltaColor} tabular-nums tracking-tight`}>
            {deltaNegativo ? deltaStr : `+${deltaStr}`} s
          </div>
        </div>
      </div>

      {/* 4. Grid Cuádruple de Telemetría (Pedales, Kamm Circle, Neumáticos, Minimap) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PedalTelemetryBars car={auto} />
        <KammFrictionCircle dynamics={dinamicas} />
        <TyreThermalsMatrix tyres={neumaticos} />
        <LiveTrackMinimap timing={timing} dynamics={dinamicas} trackName="Monza F1 2025" />
      </div>
    </div>
  );
}
