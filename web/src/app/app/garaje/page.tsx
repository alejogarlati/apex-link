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
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
            Garaje Virtual
          </h1>
          <p className="mt-1 text-xs text-[#bbbbbb]">
            Vehículos calibrados con telemetría de suspensiones, odómetro en SQLite y corte de revoluciones.
          </p>
        </div>
      </div>

      {/* Grid del Garaje: Cada vehículo es una tarjeta 100% interactiva */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehiculos.map((auto) => (
          <Link
            key={auto.id}
            href={`/app/analysis?auto=${auto.id}`}
            className="border-t border-[#222225] pt-6 pb-4 flex flex-col justify-between group cursor-pointer block hover:bg-white/[0.015] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-[#0066b1] font-bold">
                  {auto.clase}
                </span>
                <span className="text-[#7e7e7e]">{auto.traccion}</span>
              </div>

              <h2 className="text-lg font-bold text-white uppercase group-hover:text-[#81c4ff] transition-colors">
                {auto.nombre}
              </h2>

              <div className="mt-4 space-y-2.5 text-xs font-mono border-y border-white/[0.06] py-4">
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Potencia:</span>
                  <span className="text-white font-bold">{auto.potencia}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Corte:</span>
                  <span className="text-[#e22718] font-bold tabular-nums">{auto.maxRpm.toLocaleString("es-AR")} RPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Peso:</span>
                  <span className="text-white">{auto.peso}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/[0.06] pt-2">
                  <span className="text-[#7e7e7e]">Odómetro:</span>
                  <span className="text-[#00E676] font-bold text-sm tabular-nums tracking-tight">
                    {auto.kilometros.toLocaleString("es-AR")} km
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#7e7e7e]">
              <span>{auto.vueltasTotales} vueltas computadas</span>
              <span className="text-[#0066b1] group-hover:text-white flex items-center gap-1 font-bold text-[11px] uppercase transition-colors">
                Telemetría
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
