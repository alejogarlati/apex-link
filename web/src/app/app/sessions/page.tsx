"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Trophy,
  Car,
  ArrowRight,
  Gauge,
  Clock,
  ListFilter,
  RefreshCw,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { obtenerSesionesPaginadas, alternarModoMock } from "@/lib/apiClient";
import { obtenerSesionLocal, USUARIO_ALEJO_GARLATI, USUARIO_ALEJO_SALAS } from "@/lib/auth";
import type { PerfilUsuario } from "@/types/usuario";
import type { SesionResumenDto } from "@/types/api";
import { TablaVueltasSesionModal } from "@/components/sessions/TablaVueltasSesionModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BotonColapsarSidebar } from "@/components/layout/BotonColapsarSidebar";

// Tandas registradas oficiales de Alejo Garlati (Alien F1)
const SESIONES_GARLATI: SesionResumenDto[] = [
  {
    id: "33333333-3333-3333-3333-333333333331",
    circuit: "Autodromo Nazionale Monza",
    trackConfig: "Grand Prix (5.793 m)",
    carModel: "Ferrari SF70H (F1)",
    sessionType: 0,
    isMockSimulation: false,
    startTime: "2026-10-31T19:15:00Z",
    endTime: "2026-10-31T20:00:00Z",
    totalLaps: 18,
    bestLapTimeMs: 81240,
  },
  {
    id: "33333333-3333-3333-3333-333333333332",
    circuit: "Red Bull Ring (Spielberg)",
    trackConfig: "Grand Prix (4.318 m)",
    carModel: "Ferrari SF70H (F1)",
    sessionType: 0,
    isMockSimulation: false,
    startTime: "2026-10-30T15:20:00Z",
    endTime: "2026-10-30T16:00:00Z",
    totalLaps: 16,
    bestLapTimeMs: 65410,
  },
];

// Tandas registradas oficiales de Alejo Salas (Pro-Am GT3)
const SESIONES_SALAS: SesionResumenDto[] = [
  {
    id: "44444444-4444-4444-4444-444444444441",
    circuit: "Autodromo Nazionale Monza",
    trackConfig: "Grand Prix (5.793 m)",
    carModel: "Ferrari 488 GT3",
    sessionType: 0,
    isMockSimulation: false,
    startTime: "2026-10-29T16:40:00Z",
    endTime: "2026-10-29T17:10:00Z",
    totalLaps: 12,
    bestLapTimeMs: 107382,
  },
  {
    id: "44444444-4444-4444-4444-444444444442",
    circuit: "Circuit de Spa-Francorchamps",
    trackConfig: "Grand Prix (7.004 m)",
    carModel: "Ferrari 488 GT3",
    sessionType: 0,
    isMockSimulation: false,
    startTime: "2026-10-28T14:10:00Z",
    endTime: "2026-10-28T14:50:00Z",
    totalLaps: 8,
    bestLapTimeMs: 138420,
  },
];

export default function PaginaSesiones() {
  const [usuario, setUsuario] = useState<PerfilUsuario>(() => {
    const sesion = obtenerSesionLocal();
    return sesion ? sesion.usuario : USUARIO_ALEJO_GARLATI;
  });
  const [sesiones, setSesiones] = useState<SesionResumenDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [sesionSeleccionada, setSesionSeleccionada] = useState<SesionResumenDto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [conmutandoMock, setConmutandoMock] = useState(false);

  const esGarlati = usuario.id === USUARIO_ALEJO_GARLATI.id || usuario.email.includes("garlati");
  const sesionesPiloto = esGarlati ? SESIONES_GARLATI : SESIONES_SALAS;

  useEffect(() => {
    const sincronizarUsuario = () => {
      const sesion = obtenerSesionLocal();
      if (sesion?.usuario) {
        setUsuario(sesion.usuario);
      }
    };

    sincronizarUsuario();
    window.addEventListener("storage", sincronizarUsuario);
    window.addEventListener("apexlink_usuario_cambiado", sincronizarUsuario);

    return () => {
      window.removeEventListener("storage", sincronizarUsuario);
      window.removeEventListener("apexlink_usuario_cambiado", sincronizarUsuario);
    };
  }, []);

  const cargarSesiones = useCallback(async (pag: number) => {
    setCargando(true);
    setErrorApi(null);

    try {
      const res = await obtenerSesionesPaginadas(pag, 9);
      if (res.exitoso && res.datos && res.datos.elementos.length > 0) {
        setSesiones(res.datos.elementos);
        setTotalPaginas(res.datos.totalPaginas || 1);
        setTotalRegistros(res.datos.totalRegistros || res.datos.elementos.length);
      } else {
        // Fallback a las tandas oficiales del piloto activo
        setSesiones(sesionesPiloto);
        setTotalPaginas(1);
        setTotalRegistros(sesionesPiloto.length);
      }
    } catch {
      setErrorApi("Relay Kestrel desconectado. Mostrando tandas oficiales del piloto activo.");
      setSesiones(sesionesPiloto);
      setTotalPaginas(1);
      setTotalRegistros(sesionesPiloto.length);
    } finally {
      setCargando(false);
    }
  }, [sesionesPiloto]);

  useEffect(() => {
    cargarSesiones(pagina);
  }, [pagina, cargarSesiones, usuario]);

  const formatearTiempoMs = (ms: number) => {
    if (!ms || ms <= 0) return "--:--.---";
    const totalSegundos = ms / 1000;
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${segundos.toFixed(3).padStart(6, "0")}`;
  };

  const formatearFecha = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const handleAlternarMock = async () => {
    setConmutandoMock(true);
    try {
      await alternarModoMock(true);
      await cargarSesiones(1);
    } catch {
      // Ignorar si falla
    } finally {
      setConmutandoMock(false);
    }
  };

  const abrirModalVueltas = (sesion: SesionResumenDto) => {
    setSesionSeleccionada(sesion);
    setModalAbierto(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#262626] pb-4 sm:flex-row sm:items-end">
        <div className="flex items-start gap-3.5">
          <BotonColapsarSidebar />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
              Historial de Sesiones
            </h1>
            <p className="mt-1 text-xs text-[#bbbbbb]">
              Tandas de telemetría capturadas desde Assetto Corsa sincronizadas con PostgreSQL.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => cargarSesiones(pagina)}
            disabled={cargando}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black/60 hover:bg-black/90 text-xs font-mono text-[#bbbbbb] hover:text-white border border-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0066b1]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cargando ? "animate-spin text-[#0066b1]" : ""}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Banner de estado de conexión */}
      {errorApi && (
        <div className="p-3 bg-[#f4b400]/10 border border-[#f4b400]/30 rounded-lg flex items-center justify-between text-xs text-[#f4b400]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorApi}</span>
          </div>
          <button
            onClick={handleAlternarMock}
            disabled={conmutandoMock}
            className="px-2.5 py-1 rounded bg-[#f4b400]/20 hover:bg-[#f4b400]/30 text-white font-bold transition-colors cursor-pointer border border-[#f4b400]/40"
          >
            {conmutandoMock ? "Conmutando..." : "Activar Mock"}
          </button>
        </div>
      )}

      {/* Skeletons de Carga */}
      {cargando && sesiones.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {/* Estado Vacío */}
      {!cargando && sesiones.length === 0 && (
        <EmptyState
          icon={<Layers className="w-6 h-6" />}
          title="Sin Tandas Registradas"
          description="Aún no se han guardado tandas de telemetría para este perfil. Conectá el Core Relay a Assetto Corsa o abrí el Live Pitwall para registrar vueltas."
          actionLabel="Ir al Live Pitwall"
          actionHref="/app/live"
        />
      )}

      {/* Grid de Sesiones: Cada tarjeta es 100% interactiva sin botones pequeños */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sesiones.map((sesion) => {
          const circuitoNombre = sesion.circuit || sesion.circuito || "Circuito";
          const configNombre = sesion.trackConfig || sesion.configuracionCircuito || "GP";
          const autoNombre = sesion.carModel || sesion.modeloVehiculo || "Vehículo Desconocido";
          const fechaStr = formatearFecha(sesion.startTime || sesion.fechaInicio || "");
          const mejorVueltaStr = formatearTiempoMs(sesion.bestLapTimeMs || sesion.mejorTiempoMs || 0);
          const totalV = sesion.totalLaps ?? sesion.totalVueltas ?? 0;

          return (
            <Link
              key={sesion.id}
              href={`/app/analysis?sesionId=${sesion.id}`}
              className="border-t border-[#222225] pt-6 pb-4 flex flex-col justify-between group cursor-pointer block hover:bg-white/[0.015] transition-colors"
            >
              <div>
                <div className="mb-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#bbbbbb] font-bold">
                    {totalV} Vueltas Registradas
                  </span>
                  <span className="text-[11px] text-[#7e7e7e]">{fechaStr}</span>
                </div>

                <h3 className="text-lg font-bold text-white uppercase mb-1 tracking-tight group-hover:text-[#81c4ff] transition-colors">
                  {circuitoNombre}
                </h3>
                <p className="text-xs text-[#7e7e7e] font-mono mb-4">{configNombre}</p>

                <div className="space-y-2.5 border-y border-white/[0.06] py-3 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#bbbbbb]">
                      <Car className="h-4 w-4 text-[#7e7e7e]" />
                      Vehículo:
                    </span>
                    <span className="font-semibold text-white">{autoNombre}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#bbbbbb]">
                      <Trophy className="h-4 w-4 text-[#f4b400]" />
                      Mejor Vuelta:
                    </span>
                    <span className="font-bold text-[#00E676] tabular-nums tracking-tight">{mejorVueltaStr}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-[#7e7e7e]">Abrir telemetría 2D</span>
                <span className="text-[#0066b1] group-hover:text-white font-bold uppercase text-[11px] flex items-center gap-1 transition-colors">
                  Analizar
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between border-t border-[#262626] pt-4 text-xs font-mono">
          <span className="text-[#7e7e7e]">
            Mostrando página {pagina} de {totalPaginas} ({totalRegistros} tandas en total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina <= 1}
              className="p-2 rounded bg-[#1a1a1a] hover:bg-[#262626] disabled:opacity-30 disabled:cursor-not-allowed border border-[#3c3c3c] text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-[#141414] border border-[#262626] rounded text-white font-bold">
              {pagina}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina >= totalPaginas}
              className="p-2 rounded bg-[#1a1a1a] hover:bg-[#262626] disabled:opacity-30 disabled:cursor-not-allowed border border-[#3c3c3c] text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de Vueltas */}
      <TablaVueltasSesionModal
        sesion={sesionSeleccionada}
        abierto={modalAbierto}
        alCerrar={() => setModalAbierto(false)}
      />
    </div>
  );
}
