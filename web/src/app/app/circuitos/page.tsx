"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, RefreshCw, Trophy, Flag, ShieldCheck, ArrowRight } from "lucide-react";
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

      {/* Grid de Circuitos: Toda la tarjeta es interactiva sin botones pequeños */}
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
                    Récord:
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
    </div>
  );
}
