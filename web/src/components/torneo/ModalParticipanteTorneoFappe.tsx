"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Car,
  Timer,
  CheckCircle2,
  UserPlus,
  UserCheck,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  obtenerSesionRecienteFinalizada,
  atribuirSesionParticipanteTorneo,
} from "@/lib/apiClient";
import type { SesionFinalizadaTorneoDto } from "@/types/api";
import { useToast } from "@/context/ToastContext";

const CLAVE_SESIONES_PROCESADAS = "apexlink_sesiones_torneo_procesadas";

function obtenerSesionesProcesadas(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(CLAVE_SESIONES_PROCESADAS);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

function marcarSesionProcesada(sesionId: string) {
  if (typeof window === "undefined") return;
  try {
    const set = obtenerSesionesProcesadas();
    set.add(sesionId);
    sessionStorage.setItem(
      CLAVE_SESIONES_PROCESADAS,
      JSON.stringify(Array.from(set))
    );
  } catch {
    // Ignorar fallo de sessionStorage
  }
}

export function ModalParticipanteTorneoFappe() {
  const toast = useToast();
  const router = useRouter();
  const inputNombreRef = useRef<HTMLInputElement | null>(null);

  const [sesionPendiente, setSesionPendiente] =
    useState<SesionFinalizadaTorneoDto | null>(null);
  const [modoIngresoNombre, setModoIngresoNombre] = useState(false);
  const [nombreParticipante, setNombreParticipante] = useState("");
  const [enviando, setEnviando] = useState(false);

  const abrirModalConSesion = useCallback(
    (sesion: SesionFinalizadaTorneoDto, forzarApertura = false) => {
      if (!sesion || !sesion.sesionId) return;
      if (!forzarApertura) {
        const procesadas = obtenerSesionesProcesadas();
        if (procesadas.has(sesion.sesionId)) return;
      }

      setSesionPendiente((prev) => {
        if (prev?.sesionId === sesion.sesionId) return prev;
        setModoIngresoNombre(false);
        setNombreParticipante("");
        return sesion;
      });
    },
    []
  );

  // Polling ligero para detectar automáticamente el fin de una sesión en el simulador
  useEffect(() => {
    let cancelado = false;

    const verificarSesionReciente = async () => {
      try {
        const res = await obtenerSesionRecienteFinalizada();
        if (cancelado) return;
        if (res.exitoso && res.datos && res.datos.mejorTiempoMs > 0) {
          abrirModalConSesion(res.datos, false);
        }
      } catch {
        // Silencioso si el relay local está desconectado
      }
    };

    verificarSesionReciente();
    const intervalo = window.setInterval(verificarSesionReciente, 2500);

    const escucharAperturaManual = (e: Event) => {
      const custom = e as CustomEvent<SesionFinalizadaTorneoDto>;
      if (custom.detail) {
        abrirModalConSesion(custom.detail, true);
      }
    };

    window.addEventListener(
      "apexlink_abrir_modal_torneo",
      escucharAperturaManual
    );

    return () => {
      cancelado = true;
      window.clearInterval(intervalo);
      window.removeEventListener(
        "apexlink_abrir_modal_torneo",
        escucharAperturaManual
      );
    };
  }, [abrirModalConSesion]);

  useEffect(() => {
    if (modoIngresoNombre && inputNombreRef.current) {
      inputNombreRef.current.focus();
    }
  }, [modoIngresoNombre]);

  if (!sesionPendiente) {
    return null;
  }

  const manejarConservarEnMiPerfil = async () => {
    if (!sesionPendiente || enviando) return;
    setEnviando(true);
    try {
      await atribuirSesionParticipanteTorneo(
        sesionPendiente.sesionId,
        false
      ).catch(() => {});
      marcarSesionProcesada(sesionPendiente.sesionId);
      setSesionPendiente(null);
      toast.info(
        "Tanda conservada en tu perfil",
        "La sesión quedó registrada en tu historial personal de piloto."
      );
      window.dispatchEvent(new Event("apexlink_leaderboard_actualizado"));
      window.dispatchEvent(new Event("apexlink_sesiones_actualizadas"));
    } finally {
      setEnviando(false);
    }
  };

  const manejarAtribuirAParticipante = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sesionPendiente || enviando) return;

    const nombreLimpio = nombreParticipante.trim();
    if (nombreLimpio.length < 2) {
      toast.error(
        "Nombre requerido",
        "Ingresá el nombre del participante del Torneo Fappe."
      );
      return;
    }

    setEnviando(true);
    try {
      const res = await atribuirSesionParticipanteTorneo(
        sesionPendiente.sesionId,
        true,
        nombreLimpio
      );

      if (res.exitoso) {
        marcarSesionProcesada(sesionPendiente.sesionId);
        const mejorTiempo = sesionPendiente.mejorTiempoTexto;
        setSesionPendiente(null);
        toast.success(
          "¡Participante sumado al Leaderboard!",
          `${nombreLimpio} quedó clasificado con su mejor vuelta limpia (${mejorTiempo}).`
        );
        window.dispatchEvent(new Event("apexlink_leaderboard_actualizado"));
        window.dispatchEvent(new Event("apexlink_sesiones_actualizadas"));
        router.push("/app/leaderboards");
      } else {
        toast.error(
          "No se pudo atribuir la tanda",
          res.mensaje || "Verificá que la sesión tenga vueltas limpias."
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al registrar al participante en el Torneo Fappe.";
      toast.error("Error de registro", msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0d0d0d] border border-[#262626] shadow-2xl overflow-hidden">
        {/* Franja tricolor superior */}
        <div className="h-1 w-full flex">
          <div className="h-full w-1/3 bg-[#0066b1]" />
          <div className="h-full w-1/3 bg-[#1c69d4]" />
          <div className="h-full w-1/3 bg-[#e22718]" />
        </div>

        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#e22718] flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#e22718] block">
                Torneo Fappe 2026 · Fin de Sesión
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">
                ¿Participante del Torneo Fappe?
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={manejarConservarEnMiPerfil}
            disabled={enviando}
            title="Cerrar y mantener en mi perfil"
            className="p-1.5 text-[#7e7e7e] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-[#bbbbbb] leading-relaxed">
            Acaba de finalizar una tanda en el simulador. ¿Esta sesión fue
            conducida por un{" "}
            <span className="text-white font-semibold">
              participante del Torneo Fappe
            </span>
            ? Si es así, ingresá su nombre para atribuirle la tanda y cargar
            automáticamente su mejor vuelta limpia en la Leaderboard oficial.
          </p>

          {/* Resumen de la Tanda Finalizada */}
          <div className="border border-[#262626] bg-[#141414] p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#7e7e7e] block">
                  Circuito Oficial
                </span>
                <span className="text-xs font-bold text-white uppercase">
                  {sesionPendiente.circuito || "Autodromo Nazionale Monza"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#7e7e7e] block">
                  Vueltas Limpias
                </span>
                <span className="text-xs font-bold text-white">
                  {sesionPendiente.vueltasValidas} de{" "}
                  {sesionPendiente.totalVueltas}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-2 text-xs text-[#bbbbbb]">
                <Car className="w-3.5 h-3.5 text-[#0066b1]" />
                <span>{sesionPendiente.modeloVehiculo}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-[#0fa336]" />
                <span className="text-sm font-bold text-[#0fa336] tabular-nums">
                  {sesionPendiente.mejorTiempoTexto}
                </span>
              </div>
            </div>
          </div>

          {!modoIngresoNombre ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={manejarConservarEnMiPerfil}
                disabled={enviando}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-[#3c3c3c] bg-[#141414] hover:bg-[#1f1f1f] hover:border-white/30 text-xs font-mono font-bold uppercase text-[#bbbbbb] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4 text-[#0066b1]" />
                <span>No, es mi sesión</span>
              </button>

              <button
                type="button"
                onClick={() => setModoIngresoNombre(true)}
                disabled={enviando}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#e22718] hover:bg-[#c41e12] text-xs font-mono font-bold uppercase text-white shadow-md shadow-[#e22718]/25 transition-colors cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sí, Torneo Fappe</span>
              </button>
            </div>
          ) : (
            <form onSubmit={manejarAtribuirAParticipante} className="space-y-4">
              <div>
                <label
                  htmlFor="input-nombre-participante-fappe"
                  className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#bbbbbb] mb-2"
                >
                  Nombre y Apellido del Participante
                </label>
                <input
                  id="input-nombre-participante-fappe"
                  ref={inputNombreRef}
                  type="text"
                  value={nombreParticipante}
                  onChange={(e) => setNombreParticipante(e.target.value)}
                  placeholder="Ej: Juan Ignacio Pérez"
                  maxLength={60}
                  disabled={enviando}
                  className="w-full px-3.5 py-2.5 bg-black border border-[#3c3c3c] focus:border-[#0066b1] text-sm font-mono text-white placeholder:text-[#555555] outline-none transition-colors"
                />
                <p className="mt-1.5 text-[11px] font-mono text-[#7e7e7e] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#0fa336] shrink-0" />
                  <span>
                    Se cargará su mejor vuelta limpia (
                    {sesionPendiente.mejorTiempoTexto}) en la Leaderboard.
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setModoIngresoNombre(false)}
                  disabled={enviando}
                  className="px-4 py-2 text-xs font-mono uppercase text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
                >
                  Volver
                </button>

                <button
                  type="submit"
                  disabled={enviando || nombreParticipante.trim().length < 2}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0fa336] hover:bg-[#0c8a2d] text-xs font-mono font-bold uppercase text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {enviando ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Cargar a Leaderboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
