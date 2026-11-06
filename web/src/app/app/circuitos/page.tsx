"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Trophy, ArrowRight, Loader2, Flag } from "lucide-react";
import { obtenerCircuitos, obtenerSesionesPaginadas } from "@/lib/apiClient";
import type { CircuitoDto, SesionResumenDto } from "@/types/api";

function formatearTiempoMs(ms: number): string {
  if (!ms || ms <= 0) return "--:--.---";
  const totalSegundos = ms / 1000;
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  return `${minutos.toString().padStart(2, "0")}:${segundos.toFixed(3).padStart(6, "0")}`;
}

export default function PaginaCircuitos() {
  const [circuitos, setCircuitos] = useState<CircuitoDto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);

    Promise.all([
      obtenerCircuitos().catch(() => null),
      obtenerSesionesPaginadas(1, 100).catch(() => null),
    ])
      .then(([resCircuitos, resSesiones]) => {
        if (cancelado) return;

        const listaBase: CircuitoDto[] =
          resCircuitos?.exitoso && Array.isArray(resCircuitos.datos)
            ? resCircuitos.datos
            : [];

        const sesionesReales: SesionResumenDto[] =
          resSesiones?.exitoso && resSesiones.datos?.elementos
            ? resSesiones.datos.elementos.filter((s) => !(s.isMockSimulation ?? s.esSimulacionMock))
            : [];

        const enriquecidos = listaBase.map((pista) => {
          const clave = pista.id.toLowerCase();
          const sesionesPista = sesionesReales.filter((s) => {
            const c = (s.circuit || s.circuito || "").toLowerCase();
            if (clave.includes("monza")) return c.includes("monza");
            if (clave.includes("imola")) return c.includes("imola");
            if (clave.includes("red_bull") || clave.includes("redbull"))
              return c.includes("redbull") || c.includes("spielberg") || c.includes("rbr");
            return c.includes(clave);
          });

          let mejorMs = 0;
          let mejorAuto = "";
          for (const s of sesionesPista) {
            const ms = s.bestLapTimeMs ?? s.mejorTiempoMs ?? 0;
            if (ms > 0 && (mejorMs === 0 || ms < mejorMs)) {
              mejorMs = ms;
              mejorAuto = s.carModel || s.modeloVehiculo || "";
            }
          }

          if (mejorMs > 0) {
            return {
              ...pista,
              recordVuelta: formatearTiempoMs(mejorMs),
              pilotoRecord: mejorAuto ? `Récord en Boxes (${mejorAuto})` : pista.pilotoRecord,
            };
          }

          return pista;
        });

        setCircuitos(enriquecidos);
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
        <div className="flex items-start gap-3.5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
              Catálogo de Circuitos
            </h1>
            <p className="mt-1 text-xs text-[#bbbbbb]">
              Pistas escaneadas por láser con calibración cartográfica en el Core Relay.
            </p>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#7e7e7e]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0066b1] mb-3" />
          <p className="text-xs font-mono uppercase tracking-widest">
            Cargando catálogo cartográfico desde el servidor...
          </p>
        </div>
      ) : circuitos.length === 0 ? (
        <div className="py-20 text-center space-y-3 border border-[#262626] rounded-xl bg-[#0d0d0d] p-8">
          <Flag className="w-8 h-8 text-[#0066b1] mx-auto" />
          <p className="text-xs font-mono uppercase text-[#bbbbbb]">
            No se pudieron obtener los circuitos desde el servidor de telemetría
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {circuitos.map((pista) => (
            <Link
              key={pista.id}
              href={`/app/analysis?circuito=${pista.id}`}
              className="border-t border-[#222225] pt-6 pb-4 flex flex-col justify-between group cursor-pointer block hover:bg-white/[0.015] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[#bbbbbb] font-mono flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0066b1]" />
                    {pista.pais}
                  </span>
                  <span className="text-[11px] font-mono text-[#7e7e7e]">
                    {pista.longitudMetros.toLocaleString("es-AR")} m
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white uppercase leading-snug group-hover:text-[#81c4ff] transition-colors">
                  {pista.nombre}
                </h2>

                <div className="mt-4 space-y-2.5 text-xs font-mono border-t border-white/[0.06] pt-4">
                  <div className="flex justify-between">
                    <span className="text-[#7e7e7e]">Curvas:</span>
                    <span className="text-white">{pista.cantidadCurvas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7e7e7e]">Zonas DRS:</span>
                    <span className="text-[#0066b1] font-bold">{pista.zonasDrsCount}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/[0.06] pt-2">
                    <span className="text-[#7e7e7e] flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-[#f4b400]" />
                      Referencia:
                    </span>
                    <span className="text-[#00E676] font-bold text-sm tabular-nums tracking-tight">
                      {pista.recordVuelta}
                    </span>
                  </div>
                  <div className="text-[10px] text-right text-[#7e7e7e] truncate">
                    {pista.pilotoRecord}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-[#7e7e7e]">Abrir trazada y telemetría</span>
                <span className="text-[#0066b1] group-hover:text-white font-bold uppercase text-[11px] flex items-center gap-1 transition-colors">
                  Laboratorio 2D
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
