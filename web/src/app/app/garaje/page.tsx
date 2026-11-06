"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Car, RefreshCw, ArrowRight, Loader2, Radio } from "lucide-react";
import { obtenerSesionesPaginadas } from "@/lib/apiClient";
import { obtenerSesionLocal, esUsuarioAdmin } from "@/lib/auth";
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
  tandasTotales: number;
  kilometros: number;
  mejorTiempoMs: number;
  ultimaSesionId: string;
}

function obtenerEspecificacionesTecnicas(modeloRaw: string): {
  nombre: string;
  clase: string;
  potencia: string;
  maxRpm: number;
  peso: string;
  traccion: string;
} {
  const m = modeloRaw.toLowerCase();
  if (m.includes("supreme") || m.includes("rss_formula")) {
    return {
      nombre: "Formula RSS Supreme 2025",
      clase: "Super Formula / Single Seater",
      potencia: "650 CV",
      maxRpm: 10500,
      peso: "670 kg",
      traccion: "RWD",
    };
  }
  if (m.includes("sf70") || m.includes("ferrari f1") || m.includes("f1")) {
    return {
      nombre: "Ferrari SF70H",
      clase: "Formula 1 Hybrid",
      potencia: "950 CV",
      maxRpm: 15000,
      peso: "728 kg",
      traccion: "RWD",
    };
  }
  if (m.includes("porsche") && m.includes("gt3")) {
    return {
      nombre: "Porsche 911 GT3 R",
      clase: "FIA GT3",
      potencia: "550 CV",
      maxRpm: 9250,
      peso: "1220 kg",
      traccion: "RWD",
    };
  }
  if (m.includes("488") || m.includes("gt3")) {
    return {
      nombre: "Ferrari 488 GT3",
      clase: "FIA GT3",
      potencia: "600 CV",
      maxRpm: 7500,
      peso: "1260 kg",
      traccion: "RWD",
    };
  }
  if (m.includes("m2") || m.includes("bmw")) {
    return {
      nombre: "BMW M2 CS Racing",
      clase: "Touring / Cup",
      potencia: "450 CV",
      maxRpm: 7600,
      peso: "1400 kg",
      traccion: "RWD",
    };
  }
  if (m.includes("tatuus") || m.includes("fa01")) {
    return {
      nombre: "Tatuus FA01",
      clase: "Formula Abarth",
      potencia: "190 CV",
      maxRpm: 7000,
      peso: "525 kg",
      traccion: "RWD",
    };
  }

  return {
    nombre: modeloRaw.replace(/_/g, " ").trim() || "Vehículo de Telemetría",
    clase: "Simulación Oficial AC",
    potencia: "Telemetría Directa",
    maxRpm: 8500,
    peso: "Homologado FIA",
    traccion: "RWD",
  };
}

function obtenerLongitudCircuitoKm(circuitoRaw: string): number {
  const c = circuitoRaw.toLowerCase();
  if (c.includes("spa")) return 7.004;
  if (c.includes("imola")) return 4.909;
  if (c.includes("redbull") || c.includes("spielberg") || c.includes("rbr")) return 4.318;
  return 5.793;
}

export default function PaginaGaraje() {
  const [vehiculos, setVehiculos] = useState<VehiculoGaraje[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarVehiculosDesdeSesiones = useCallback(async () => {
    setCargando(true);
    try {
      const sesionLocal = obtenerSesionLocal();
      const esAdmin = esUsuarioAdmin(sesionLocal?.usuario);
      const usuarioFiltro = esAdmin ? undefined : sesionLocal?.usuario.id;

      const res = await obtenerSesionesPaginadas(1, 100, usuarioFiltro);
      if (res.exitoso && res.datos && res.datos.elementos.length > 0) {
        const todas: SesionResumenDto[] = res.datos.elementos;
        const sesionesFiltradas = esAdmin
          ? todas
          : todas.filter((s) => !(s.isMockSimulation ?? s.esSimulacionMock));

        const mapaAutos = new Map<string, VehiculoGaraje>();

        for (const s of sesionesFiltradas) {
          const modeloRaw = (s.carModel || s.modeloVehiculo || "").trim();
          if (!modeloRaw) continue;

          const specs = obtenerEspecificacionesTecnicas(modeloRaw);
          const clave = specs.nombre.toLowerCase();
          const vueltas = s.totalLaps ?? s.totalVueltas ?? 0;
          const circuito = s.circuit || s.circuito || "monza";
          const kmSesion = vueltas * obtenerLongitudCircuitoKm(circuito);
          const mejorMs = s.bestLapTimeMs ?? s.mejorTiempoMs ?? 0;

          const existente = mapaAutos.get(clave);
          if (!existente) {
            mapaAutos.set(clave, {
              id: clave.replace(/\s+/g, "-"),
              nombre: specs.nombre,
              clase: specs.clase,
              potencia: specs.potencia,
              maxRpm: specs.maxRpm,
              peso: specs.peso,
              traccion: specs.traccion,
              vueltasTotales: vueltas,
              tandasTotales: 1,
              kilometros: Math.round(kmSesion * 10) / 10,
              mejorTiempoMs: mejorMs,
              ultimaSesionId: s.id,
            });
          } else {
            existente.vueltasTotales += vueltas;
            existente.tandasTotales += 1;
            existente.kilometros = Math.round((existente.kilometros + kmSesion) * 10) / 10;
            if (mejorMs > 0 && (existente.mejorTiempoMs === 0 || mejorMs < existente.mejorTiempoMs)) {
              existente.mejorTiempoMs = mejorMs;
            }
          }
        }

        const listaOrdenada = Array.from(mapaAutos.values()).sort(
          (a, b) => b.vueltasTotales - a.vueltasTotales
        );
        setVehiculos(listaOrdenada);
      } else {
        setVehiculos([]);
      }
    } catch {
      setVehiculos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarVehiculosDesdeSesiones();
    window.addEventListener("apexlink_usuario_cambiado", cargarVehiculosDesdeSesiones);
    return () => {
      window.removeEventListener("apexlink_usuario_cambiado", cargarVehiculosDesdeSesiones);
    };
  }, [cargarVehiculosDesdeSesiones]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262626] pb-4">
        <div className="flex items-start gap-3.5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
              Garaje Virtual
            </h1>
            <p className="mt-1 text-xs text-[#bbbbbb]">
              Vehículos registrados en tus tandas de telemetría con odómetro real y vueltas computadas en SQLite.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={cargarVehiculosDesdeSesiones}
          disabled={cargando}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141414] border border-[#3c3c3c] hover:border-[#0066b1] text-xs font-mono text-[#bbbbbb] hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#0066b1] ${cargando ? "animate-spin" : ""}`} />
          <span>Actualizar Garaje</span>
        </button>
      </div>

      {cargando ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#7e7e7e]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0066b1] mb-3" />
          <p className="text-xs font-mono uppercase tracking-widest">
            Sincronizando unidades registradas en telemetría...
          </p>
        </div>
      ) : vehiculos.length === 0 ? (
        <div className="py-20 text-center space-y-4 border border-[#262626] rounded-xl bg-[#0d0d0d] p-8">
          <div className="inline-flex p-4 rounded-full bg-white/[0.04] border border-white/10 text-[#0066b1]">
            <Car className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-base font-bold uppercase tracking-tight text-white">
              Sin vehículos registrados en este perfil
            </h2>
            <p className="text-xs text-[#8e8e93] leading-relaxed">
              Los autos que conduzcas en Assetto Corsa aparecerán automáticamente aquí con su kilometraje y vueltas reales acumuladas.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app/live"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0066b1] hover:bg-[#1c69d4] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Radio className="w-4 h-4 animate-pulse text-[#00E676]" />
              Salir a Pista (Live Pitwall)
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehiculos.map((auto) => (
            <Link
              key={auto.id}
              href={`/app/analysis?sesionId=${auto.ultimaSesionId}`}
              className="border-t border-[#222225] pt-6 pb-4 flex flex-col justify-between group cursor-pointer block hover:bg-white/[0.015] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="text-[#0066b1] font-bold">{auto.clase}</span>
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
                    <span className="text-[#e22718] font-bold tabular-nums">
                      {auto.maxRpm.toLocaleString("es-AR")} RPM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7e7e7e]">Peso:</span>
                    <span className="text-white">{auto.peso}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7e7e7e]">Tandas registradas:</span>
                    <span className="text-white">{auto.tandasTotales}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/[0.06] pt-2">
                    <span className="text-[#7e7e7e]">Odómetro real:</span>
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
      )}
    </div>
  );
}
