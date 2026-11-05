"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Car, Gauge, ShieldCheck, RefreshCw, Zap, ArrowRight } from "lucide-react";
import { obtenerSesionesPaginadas } from "@/lib/apiClient";
import type { SesionResumenDto } from "@/types/api";

interface VehiculoGaraje {
  id: string;
  nombre: string;
  clase: string;
  potencia: string;
  maxRpm: number;
  peso: string;
  traccion: string;
  vueltasTotales: number;
  kilometros: number;
  activo: boolean;
}

const VEHICULOS_BASE: VehiculoGaraje[] = [
  {
    id: "sf70h",
    nombre: "Ferrari SF70H (F1 2017)",
    clase: "Formula 1 Hybrid",
    potencia: "950 CV",
    maxRpm: 15000,
    peso: "728 kg",
    traccion: "RWD",
    vueltasTotales: 142,
    kilometros: 822.7,
    activo: true,
  },
  {
    id: "488gt3",
    nombre: "Ferrari 488 GT3",
    clase: "FIA GT3",
    potencia: "600 CV",
    maxRpm: 7500,
    peso: "1260 kg",
    traccion: "RWD",
    vueltasTotales: 28,
    kilometros: 162.2,
    activo: true,
  },
  {
    id: "m2cs",
    nombre: "BMW M2 CS Racing",
    clase: "Touring / Cup",
    potencia: "450 CV",
    maxRpm: 7600,
    peso: "1400 kg",
    traccion: "RWD",
    vueltasTotales: 16,
    kilometros: 92.6,
    activo: true,
  },
];

export default function PaginaGaraje() {
  const [vehiculos, setVehiculos] = useState<VehiculoGaraje[]>(VEHICULOS_BASE);
  const [cargando, setCargando] = useState(true);
  const [datosReales, setDatosReales] = useState(false);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);

    obtenerSesionesPaginadas(1, 100)
      .then((res) => {
        if (!cancelado && res.exitoso && res.datos && res.datos.elementos.length > 0) {
          const sesiones: SesionResumenDto[] = res.datos.elementos;

          // Calcular totales agrupados por modelo
          const actualizados = VEHICULOS_BASE.map((auto) => {
            const sesionesAuto = sesiones.filter((s) => {
              const modelo = (s.carModel || s.modeloVehiculo || "").toLowerCase();
              if (auto.id === "sf70h") return modelo.includes("sf70") || modelo.includes("f1");
              if (auto.id === "488gt3") return modelo.includes("488") || modelo.includes("gt3");
              if (auto.id === "m2cs") return modelo.includes("m2") || modelo.includes("bmw");
              return false;
            });

            if (sesionesAuto.length === 0) return auto;

            let totalVueltasSesion = 0;
            let totalKm = 0;

            sesionesAuto.forEach((s) => {
              const vueltas = s.totalLaps ?? s.totalVueltas ?? 0;
              totalVueltasSesion += vueltas;
              // Distancia estimada según pista (Monza 5.793km por vuelta)
              totalKm += vueltas * 5.793;
            });

            return {
              ...auto,
              vueltasTotales: auto.vueltasTotales + totalVueltasSesion,
              kilometros: Math.round((auto.kilometros + totalKm) * 10) / 10,
            };
          });

          setVehiculos(actualizados);
          setDatosReales(true);
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
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262626] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#0066b1] animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
              Garaje Virtual & Odómetro de Monoplazas
            </h1>
          </div>
          <p className="mt-1 text-xs text-[#bbbbbb]">
            Vehículos calibrados con telemetría de suspensiones, odómetro en SQLite y corte de revoluciones.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {datosReales ? (
            <span className="px-2.5 py-1 rounded bg-[#0fa336]/15 border border-[#0fa336]/30 text-[#0fa336] flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Odómetro Dinámico WAL
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded bg-[#1a1a1a] border border-[#3c3c3c] text-[#7e7e7e] flex items-center gap-1.5">
              <RefreshCw className={`w-3.5 h-3.5 ${cargando ? "animate-spin text-[#0066b1]" : ""}`} />
              Telemetría Base
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehiculos.map((auto) => (
          <div
            key={auto.id}
            className="border border-[#262626] bg-[#141414] rounded-xl p-6 flex flex-col justify-between hover:border-[#0066b1] transition-all shadow-lg group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0066b1] bg-[#0066b1]/15 px-2.5 py-1 rounded border border-[#0066b1]/30">
                  {auto.clase}
                </span>
                <span className="text-xs text-[#7e7e7e] font-mono">{auto.traccion}</span>
              </div>

              <h2 className="text-lg font-bold text-white uppercase">{auto.nombre}</h2>

              <div className="mt-4 space-y-2.5 text-xs font-mono border-y border-[#262626] py-4">
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Potencia Motor:</span>
                  <span className="text-white font-bold">{auto.potencia}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Corte Tacómetro:</span>
                  <span className="text-[#e22718] font-bold">{auto.maxRpm} RPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Peso en Vacío:</span>
                  <span className="text-white">{auto.peso}</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#262626] pt-2">
                  <span className="text-[#7e7e7e]">Odómetro Acumulado:</span>
                  <span className="text-[#00E676] font-bold text-sm tabular-nums">
                    {auto.kilometros} km
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#262626] flex items-center justify-between text-xs font-mono text-[#7e7e7e]">
              <span>{auto.vueltasTotales} vueltas computadas</span>
              <Link
                href="/app/analysis"
                className="text-[#0066b1] group-hover:text-white flex items-center gap-1 font-bold text-[11px] uppercase transition-colors"
              >
                Telemetría
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
