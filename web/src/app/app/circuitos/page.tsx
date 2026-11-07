"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { obtenerCircuitos } from "@/lib/apiClient";
import type { CircuitoDto } from "@/types/api";

const CIRCUITOS_CATALOGO: CircuitoDto[] = [
  {
    id: "monza_f1_2025",
    nombre: "Autodromo Nazionale Monza",
    pais: "Italia",
    codigoPais: "IT",
    longitudMetros: 5793,
    cantidadCurvas: 11,
    recordVuelta: "01:21.046",
    pilotoRecord: "Rubens Barrichello (Ferrari F2004)",
    zonasDrsCount: 2,
    esOficialFappe: true,
  },
  {
    id: "fn_imola",
    nombre: "Autodromo Internazionale Enzo e Dino Ferrari",
    pais: "Italia",
    codigoPais: "IT",
    longitudMetros: 4909,
    cantidadCurvas: 19,
    recordVuelta: "01:15.484",
    pilotoRecord: "Lewis Hamilton (Mercedes W11)",
    zonasDrsCount: 1,
    esOficialFappe: false,
  },
  {
    id: "ks_red_bull_ring",
    nombre: "Red Bull Ring Spielberg",
    pais: "Austria",
    codigoPais: "AT",
    longitudMetros: 4318,
    cantidadCurvas: 10,
    recordVuelta: "01:05.619",
    pilotoRecord: "Carlos Sainz (McLaren MCL35)",
    zonasDrsCount: 3,
    esOficialFappe: false,
  },
  {
    id: "spa_francorchamps",
    nombre: "Circuit de Spa-Francorchamps",
    pais: "Bélgica",
    codigoPais: "BE",
    longitudMetros: 7004,
    cantidadCurvas: 19,
    recordVuelta: "01:46.286",
    pilotoRecord: "Valtteri Bottas (Mercedes W09)",
    zonasDrsCount: 2,
    esOficialFappe: false,
  },
];

export default function PaginaCircuitos() {
  const [circuitos, setCircuitos] = useState<CircuitoDto[]>(CIRCUITOS_CATALOGO);

  useEffect(() => {
    let cancelado = false;
    obtenerCircuitos()
      .then((res) => {
        if (!cancelado && res?.exitoso && Array.isArray(res.datos) && res.datos.length > 0) {
          const ids = new Set(res.datos.map((d) => d.id.toLowerCase()));
          const combinados = [...res.datos];
          for (const c of CIRCUITOS_CATALOGO) {
            if (!ids.has(c.id.toLowerCase())) {
              combinados.push(c);
            }
          }
          setCircuitos(combinados);
        }
      })
      .catch(() => {
        // Fallback activo sin interrupción
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header en Blanco y Negro */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262626] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
            Catálogo de Circuitos
          </h1>
          <p className="mt-1 text-xs text-[#bbbbbb]">
            Mapeo cartográfico escaneado por láser y telemetría de sectores.
          </p>
        </div>

        <div className="text-left sm:text-right font-mono text-xs text-[#0066b1]">
          <span>Monza desbloqueado • Otros trazados en preparación</span>
        </div>
      </div>

      {/* Tablas / Listas de Circuitos en Blanco y Negro, sin botones hacia ninguna sección */}
      <div className="space-y-4">
        {circuitos.map((pista) => {
          const esMonza =
            pista.id.toLowerCase().includes("monza") || Boolean(pista.esOficialFappe);

          return (
            <div
              key={pista.id}
              className={`border p-6 sm:p-7 relative select-none transition-colors ${
                esMonza
                  ? "border-[#3c3c3c] bg-[#141414]"
                  : "border-[#222225] bg-[#0d0d0d] opacity-60"
              }`}
            >
              {/* Cabecera del circuito */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222225]">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#7e7e7e] shrink-0" />
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">
                      {pista.nombre}
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#7e7e7e] mt-0.5">
                      <span>{pista.pais}</span>
                      <span>•</span>
                      <span className="text-[#bbbbbb]">
                        {pista.longitudMetros.toLocaleString("es-AR")} metros
                      </span>
                    </div>
                  </div>
                </div>

                <div className="self-start sm:self-auto">
                  {esMonza ? (
                    <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-2.5 py-1 border border-white bg-white text-[#0066b1]">
                      Desbloqueado
                    </span>
                  ) : (
                    <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-2.5 py-1 border border-white/20 bg-white/[0.04] text-[#bbbbbb]">
                      Próximamente
                    </span>
                  )}
                </div>
              </div>

              {/* Fila técnica (tabla de especificaciones en blanco y negro) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#7e7e7e] block">
                    Curvas Oficiales
                  </span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {pista.cantidadCurvas} giros
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#7e7e7e] block">
                    Zonas DRS
                  </span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {pista.zonasDrsCount} {pista.zonasDrsCount === 1 ? "sector" : "sectores"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#7e7e7e] block">
                    Récord de Referencia
                  </span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {pista.recordVuelta || "--:--.---"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#7e7e7e] block">
                    Piloto / Monoplaza
                  </span>
                  <span
                    className="text-xs text-[#bbbbbb] truncate block"
                    title={pista.pilotoRecord}
                  >
                    {pista.pilotoRecord || "En calibración"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
