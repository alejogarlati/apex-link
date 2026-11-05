"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Trophy, AlertTriangle, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { obtenerVueltasSesion } from "@/lib/apiClient";
import type { SesionResumenDto, VueltaDto } from "@/types/api";

interface TablaVueltasSesionModalProps {
  sesion: SesionResumenDto | null;
  abierto: boolean;
  alCerrar: () => void;
}

export function TablaVueltasSesionModal({
  sesion,
  abierto,
  alCerrar,
}: TablaVueltasSesionModalProps) {
  const [vueltas, setVueltas] = useState<VueltaDto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!abierto || !sesion) {
      setVueltas([]);
      setError(null);
      return;
    }

    let cancelado = false;
    setCargando(true);
    setError(null);

    obtenerVueltasSesion(sesion.id)
      .then((res) => {
        if (!cancelado) {
          if (res.exitoso && Array.isArray(res.datos)) {
            setVueltas(res.datos);
          } else {
            setError(res.mensaje || "No se pudieron obtener las vueltas de la tanda.");
          }
        }
      })
      .catch((err) => {
        if (!cancelado) {
          setError(err.message || "Error al conectar con el servidor de telemetría.");
        }
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [abierto, sesion]);

  if (!abierto || !sesion) return null;

  const formatearSector = (ms: number) => {
    if (ms <= 0) return "--.---";
    return (ms / 1000).toFixed(3) + "s";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-[#141414] border border-[#262626] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#0d0d0d]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0066b1]" />
              <h2 className="text-base font-bold text-white uppercase tracking-tight">
                Vueltas de la Tanda • {sesion.circuit || sesion.circuito}
              </h2>
            </div>
            <p className="text-xs text-[#7e7e7e] font-mono mt-0.5">
              {sesion.carModel || sesion.modeloVehiculo} • {sesion.trackConfig || sesion.configuracionCircuito}
            </p>
          </div>

          <button
            onClick={alCerrar}
            className="p-1.5 rounded-lg bg-black hover:bg-[#262626] text-[#7e7e7e] hover:text-white border border-[#262626] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Tabla */}
        <div className="flex-1 overflow-y-auto p-6">
          {cargando && (
            <div className="flex flex-col items-center justify-center py-16 text-[#7e7e7e]">
              <Loader2 className="w-8 h-8 animate-spin text-[#0066b1] mb-3" />
              <p className="text-xs font-mono uppercase tracking-wider">
                Recuperando telemetría de vueltas desde SQLite WAL...
              </p>
            </div>
          )}

          {!cargando && error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-10 h-10 text-[#f4b400] mb-3" />
              <p className="text-sm font-bold text-white mb-1">Sin datos de telemetría disponibles</p>
              <p className="text-xs text-[#7e7e7e] max-w-md">{error}</p>
            </div>
          )}

          {!cargando && !error && vueltas.length === 0 && (
            <div className="text-center py-12 text-[#7e7e7e]">
              <p className="text-sm font-mono">No se han registrado vueltas completas en esta tanda.</p>
            </div>
          )}

          {!cargando && !error && vueltas.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-[#262626] text-[#7e7e7e] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Vuelta</th>
                    <th className="py-2.5 px-3">Tiempo Total</th>
                    <th className="py-2.5 px-3">Sector 1</th>
                    <th className="py-2.5 px-3">Sector 2</th>
                    <th className="py-2.5 px-3">Sector 3</th>
                    <th className="py-2.5 px-3">Estado</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {vueltas.map((v) => {
                    const esMejor = v.isBestLap || v.esMejorVuelta;
                    const esValida = v.isValidLap ?? v.esValida ?? true;

                    return (
                      <tr
                        key={v.id}
                        className={`hover:bg-[#1a1a1a] transition-colors ${
                          esMejor ? "bg-[#0066b1]/10" : ""
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-white">
                          #{v.lapNumber || v.numeroVuelta}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-bold tabular-nums text-sm ${
                              esMejor ? "text-[#00E676]" : "text-white"
                            }`}
                          >
                            {v.lapTimeStr || v.tiempoVueltaTexto || "--:--.---"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#bbbbbb] tabular-nums">
                          {formatearSector(v.sector1Ms)}
                        </td>
                        <td className="py-3 px-3 text-[#bbbbbb] tabular-nums">
                          {formatearSector(v.sector2Ms)}
                        </td>
                        <td className="py-3 px-3 text-[#bbbbbb] tabular-nums">
                          {formatearSector(v.sector3Ms)}
                        </td>
                        <td className="py-3 px-3">
                          {esMejor ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#f4b400]/20 text-[#f4b400] border border-[#f4b400]/40 uppercase">
                              <Trophy className="w-3 h-3" />
                              Best
                            </span>
                          ) : esValida ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0fa336]/20 text-[#0fa336] border border-[#0fa336]/40 uppercase">
                              <CheckCircle2 className="w-3 h-3" />
                              Válida
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#e22718]/20 text-[#e22718] border border-[#e22718]/40 uppercase">
                              Invalidada
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Link
                            href={`/app/analysis?vueltaId=${v.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#262626] hover:bg-[#0066b1] text-white text-[11px] font-bold uppercase tracking-wider transition-colors border border-[#3c3c3c]"
                          >
                            Analizar
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#262626] bg-[#0d0d0d] flex justify-between items-center text-xs text-[#7e7e7e]">
          <span>{vueltas.length} vueltas encontradas en la base local WAL</span>
          <button
            onClick={alCerrar}
            className="px-4 py-1.5 rounded bg-[#262626] hover:bg-[#333333] text-white font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
