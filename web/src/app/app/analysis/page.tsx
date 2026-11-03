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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Encabezado de la Sesión */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#262626] pb-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#0066b1]" />
            <h1 className="text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
              Laboratorio Analítico 2D & Comparador de Telemetría
            </h1>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold tracking-wider text-[#bbbbbb] uppercase">
            <span className="flex items-center gap-1.5 text-white">
              <Flag className="h-3.5 w-3.5 text-[#0066b1]" />
              Autodromo Nazionale Monza
            </span>
            <span className="text-[#7e7e7e]">•</span>
            <span className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-[#7e7e7e]" />
              Ferrari SF70H (F1)
            </span>
            <span className="text-[#7e7e7e]">•</span>
            <span className="flex items-center gap-1.5 text-[#0fa336]">
              <Database className="h-3.5 w-3.5" />
              4 Vueltas Registradas (Dominio Métrica 0 - 5.793 m)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="border border-[#3c3c3c] bg-[#1a1a1a] px-3 py-1 text-xs font-mono font-bold tracking-wider text-[#bbbbbb] uppercase rounded">
            Assetto Corsa Relay
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Fila Superior: Selector de Vueltas (4 cols) y Mapa 2D de Circuito (8 cols) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SelectorVueltas
              vueltas={vueltas}
              vueltaAId={vueltaAId}
              vueltaBId={vueltaBId}
              enSeleccionarVueltaA={setVueltaAId}
              enSeleccionarVueltaB={setVueltaBId}
            />
          </div>

          <div className="lg:col-span-8">
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
          </div>
        </div>

        {/* Fila Inferior: Gráficos de Telemetría Sincronizados */}
        <div>
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
        </div>
      </div>
    </div>
  );
}
