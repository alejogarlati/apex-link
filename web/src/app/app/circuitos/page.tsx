"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, RefreshCw, Trophy, Flag, ShieldCheck } from "lucide-react";
import { obtenerCircuitos } from "@/lib/apiClient";
import type { CircuitoDto } from "@/types/api";

const CIRCUITOS_FALLBACK: CircuitoDto[] = [
  {
    id: "monza_f1_2025",
    nombre: "Autodromo Nazionale Monza",
    pais: "Italia 🇮🇹",
    codigoPais: "ITA",
    longitudMetros: 5793,
    cantidadCurvas: 11,
    recordVuelta: "01:21.240",
    pilotoRecord: "Alejo Garlati (Ferrari SF70H)",
    zonasDrsCount: 2,
    esOficialFappe: true,
  },
  {
    id: "imola_f1_2025",
    nombre: "Autodromo Internazionale Enzo e Dino Ferrari (Imola)",
    pais: "Italia 🇮🇹",
    codigoPais: "ITA",
    longitudMetros: 4909,
    cantidadCurvas: 19,
    recordVuelta: "01:15.484",
    pilotoRecord: "Ferrari SF70H",
    zonasDrsCount: 1,
    esOficialFappe: true,
  },
  {
    id: "ks_red_bull_ring",
    nombre: "Red Bull Ring (Spielberg)",
    pais: "Austria 🇦🇹",
    codigoPais: "AUT",
    longitudMetros: 4318,
    cantidadCurvas: 10,
    recordVuelta: "01:05.410",
    pilotoRecord: "Ferrari SF70H",
    zonasDrsCount: 3,
    esOficialFappe: true,
  },
];

export default function PaginaCircuitos() {
  const [circuitos, setCircuitos] = useState<CircuitoDto[]>(CIRCUITOS_FALLBACK);
  const [cargando, setCargando] = useState(true);
  const [esDesdeApi, setEsDesdeApi] = useState(false);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);

    obtenerCircuitos()
      .then((res) => {
        if (!cancelado && res.exitoso && Array.isArray(res.datos) && res.datos.length > 0) {
          setCircuitos(res.datos);
          setEsDesdeApi(true);
        }
      })
      .catch(() => {
        // Fallback silencioso a la base local de respaldo
        if (!cancelado) setEsDesdeApi(false);
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
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
              Catálogo de Circuitos
            </h1>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#0066b1]/15 text-[#81c4ff] border border-[#0066b1]/30">
              Laser Scan 1mm
            </span>
          </div>
          <p className="mt-1 text-xs text-[#bbbbbb]">
            Pistas escaneadas por láser con calibración cartográfica map.ini en el Core Relay.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {esDesdeApi ? (
            <span className="px-2.5 py-1 rounded-full bg-[#0fa336]/15 border border-[#0fa336]/30 text-[#0fa336] flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Catálogo FAPPE Activo
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-[#1a1a1a] border border-[#3c3c3c] text-[#7e7e7e] flex items-center gap-1.5">
              <RefreshCw className={`w-3.5 h-3.5 ${cargando ? "animate-spin text-[#0066b1]" : ""}`} />
              Base Local
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {circuitos.map((pista) => {
          const esMonza = pista.id.toLowerCase().includes("monza");

          return (
            <div
              key={pista.id}
              className={`border rounded-xl p-6 flex flex-col justify-between transition-all ${
                esMonza
                  ? "border-[#0066b1] bg-[#1a1a1a] shadow-lg shadow-[#0066b1]/10"
                  : "border-[#262626] bg-[#141414] hover:border-[#3c3c3c]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[#7e7e7e] font-mono flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0066b1]" />
                    {pista.pais}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      esMonza
                        ? "bg-[#0fa336]/15 border-[#0fa336]/30 text-[#0fa336]"
                        : "bg-[#0066b1]/15 border-[#0066b1]/30 text-[#0066b1]"
                    }`}
                  >
                    {esMonza ? "Circuito Activo" : "Calibrado FAPPE"}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white uppercase leading-snug">{pista.nombre}</h2>
                <span className="text-[10px] text-[#7e7e7e] font-mono mt-1 block">ID: {pista.id}</span>

                <div className="mt-4 space-y-2.5 text-xs font-mono border-t border-[#262626] pt-4">
                  <div className="flex justify-between">
                    <span className="text-[#7e7e7e]">Longitud Oficial:</span>
                    <span className="text-white font-bold">{pista.longitudMetros} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7e7e7e]">Curvas Oficiales:</span>
                    <span className="text-white">{pista.cantidadCurvas} curvas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7e7e7e]">Zonas DRS:</span>
                    <span className="text-[#0066b1] font-bold">{pista.zonasDrsCount}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#262626] pt-2">
                    <span className="text-[#7e7e7e] flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-[#f4b400]" />
                      Récord de Pista:
                    </span>
                    <span className="text-[#00E676] font-bold text-sm tabular-nums">
                      {pista.recordVuelta}
                    </span>
                  </div>
                  <div className="text-[10px] text-right text-[#7e7e7e]">
                    {pista.pilotoRecord}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/app/analysis"
                  className="w-full py-2.5 rounded-lg font-bold uppercase tracking-wider text-xs bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-[#0066b1]/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1c69d4]"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Ver Trazada en Boxes
                </Link>

                <Link
                  href={`/app/leaderboards?circuito=${pista.id}`}
                  className="w-full py-2 rounded-lg font-bold uppercase tracking-wider text-[11px] bg-[#1a1a1a] hover:bg-[#262626] border border-[#3c3c3c] text-[#bbbbbb] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0066b1]"
                >
                  <Trophy className="w-3 h-3 text-[#f4b400]" />
                  Ver Leaderboard Oficial
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
