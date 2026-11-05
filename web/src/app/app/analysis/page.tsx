"use client";

import { useState, useMemo } from "react";
import { VUELTAS_MOCK_MONZA, generarTelemetriaMonza } from "@/lib/mockTelemetria";
import { SelectorVueltas } from "@/components/analisis/SelectorVueltas";
import { GraficoTelemetria } from "@/components/analisis/GraficoTelemetria";
import { MapaCircuitoCanvas } from "@/components/analisis/MapaCircuitoCanvas";
import { Database, Flag, Gauge } from "lucide-react";

export default function PaginaAnalisis() {
  const [vueltaAId, setVueltaAId] = useState<string | null>("lap-monza-04");
  const [vueltaBId, setVueltaBId] = useState<string | null>("lap-monza-02");
  const [distanciaActiva, setDistanciaActiva] = useState<number | null>(0);
  const [ranuraMapa, setRanuraMapa] = useState<"A" | "B">("A");

  const vueltas = VUELTAS_MOCK_MONZA;

  const muestrasVueltaA = useMemo(() => {
    if (!vueltaAId) return [];
    const factor = vueltaAId === "lap-monza-04" ? 1.0 : 0.95;
    return generarTelemetriaMonza(factor);
  }, [vueltaAId]);

  const muestrasVueltaB = useMemo(() => {
    if (!vueltaBId) return undefined;
    return generarTelemetriaMonza(0.91);
  }, [vueltaBId]);

  const vueltaA = vueltas.find((v) => v.id === vueltaAId);
  const vueltaB = vueltas.find((v) => v.id === vueltaBId);

  const ranuraEfectiva = vueltaB ? ranuraMapa : "A";
  const muestrasMapa = ranuraEfectiva === "B" && muestrasVueltaB ? muestrasVueltaB : muestrasVueltaA;

  return (
    <div className="space-y-10 sm:space-y-12 max-w-7xl mx-auto pb-16">
      {/* 1. Encabezado de la Sesión de Telemetría con más amplitud */}
      <div className="flex flex-col justify-between gap-6 border-b border-[#262626] pb-6 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0066b1] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#0066b1]">
              Telemetría 2D Normalizada • Laboratorio Analítico
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-mono">
            Laboratorio Analítico 2D & Comparador de Telemetría
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold tracking-[0.15em] uppercase pt-1">
            <span className="flex items-center gap-2 text-white bg-[#141414] border border-[#262626] px-3 py-1.5 rounded-none">
              <Flag className="h-4 w-4 text-[#0066b1]" />
              Autodromo Nazionale Monza
            </span>
            <span className="flex items-center gap-2 text-[#bbbbbb] bg-[#141414] border border-[#262626] px-3 py-1.5 rounded-none">
              <Gauge className="h-4 w-4 text-[#e22718]" />
              Ferrari SF70H (F1)
            </span>
            <span className="flex items-center gap-2 text-[#0fa336] bg-[#0fa336]/10 border border-[#0fa336]/30 px-3 py-1.5 rounded-none">
              <Database className="h-4 w-4 text-[#0fa336]" />
              4 Vueltas • Dominio Métrico 0 - 5.793 m
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 border border-[#0066b1]/50 bg-[#0066b1]/15 px-4 py-2 text-xs font-mono font-bold tracking-[0.18em] text-white uppercase rounded-none">
            <span className="w-2 h-2 rounded-full bg-[#0fa336] animate-ping" />
            Assetto Corsa Relay Activo
          </span>
        </div>
      </div>

      <div className="space-y-10 sm:space-y-12">
        {/* 2. Selector de Vueltas Superior (Organizado horizontalmente con acceso rápido) */}
        <section>
          <SelectorVueltas
            vueltas={vueltas}
            vueltaAId={vueltaAId}
            vueltaBId={vueltaBId}
            enSeleccionarVueltaA={setVueltaAId}
            enSeleccionarVueltaB={setVueltaBId}
          />
        </section>

        {/* 3. Core Central de Análisis: Mapa de Trazadas 2D/3D a Ancho Completo */}
        <section>
          <MapaCircuitoCanvas
            muestras={muestrasMapa}
            muestrasComparativas={muestrasVueltaB}
            distanciaSeleccionada={distanciaActiva}
            onSeleccionarDistancia={setDistanciaActiva}
            nombreCircuito="Autodromo Nazionale Monza"
            longitudMetros={5793}
            vueltaAInfo={
              vueltaA
                ? {
                    ranura: "A",
                    numeroVuelta: vueltaA.numeroVuelta,
                    tiempoVueltaStr: vueltaA.tiempoVueltaStr,
                  }
                : undefined
            }
            vueltaBInfo={
              vueltaB
                ? {
                    ranura: "B",
                    numeroVuelta: vueltaB.numeroVuelta,
                    tiempoVueltaStr: vueltaB.tiempoVueltaStr,
                  }
                : undefined
            }
            ranuraActiva={ranuraEfectiva}
            onCambiarRanura={setRanuraMapa}
          />
        </section>

        {/* 4. Gráficos de Telemetría Sincronizados Multieje */}
        <section>
          <GraficoTelemetria
            muestrasVueltaA={muestrasVueltaA}
            muestrasVueltaB={muestrasVueltaB}
            nombreVueltaA={
              vueltaA ? `V${vueltaA.numeroVuelta} (${vueltaA.tiempoVueltaStr})` : "Vuelta A"
            }
            nombreVueltaB={
              vueltaB ? `V${vueltaB.numeroVuelta} (${vueltaB.tiempoVueltaStr})` : undefined
            }
            distanciaActiva={distanciaActiva}
            onHoverDistancia={setDistanciaActiva}
          />
        </section>
      </div>
    </div>
  );
}
