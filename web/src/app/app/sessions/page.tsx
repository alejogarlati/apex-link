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
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  obtenerSesionesPaginadas,
  alternarModoMock,
  eliminarSesion,
} from "@/lib/apiClient";
import {
  obtenerSesionLocal,
  esUsuarioAdmin,
  USUARIO_ALEJO_GARLATI,
} from "@/lib/auth";
import type { PerfilUsuario } from "@/types/usuario";
import type { SesionResumenDto } from "@/types/api";
import { TablaVueltasSesionModal } from "@/components/sessions/TablaVueltasSesionModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/context/ToastContext";

export default function PaginaSesiones() {
  const toast = useToast();
  const [usuario, setUsuario] = useState<PerfilUsuario>(USUARIO_ALEJO_GARLATI);
  const [sesiones, setSesiones] = useState<SesionResumenDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [sesionSeleccionada, setSesionSeleccionada] = useState<SesionResumenDto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [conmutandoMock, setConmutandoMock] = useState(false);

  // Estado para modal de confirmación de eliminación
  const [sesionAEliminar, setSesionAEliminar] = useState<SesionResumenDto | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  const esAdmin = esUsuarioAdmin(usuario);

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
      // Si no es admin, filtramos por usuario.id en el backend. Si es admin, traemos todo el historial
      const usuarioIdFiltro = esAdmin ? undefined : usuario.id;
      const res = await obtenerSesionesPaginadas(pag, 9, usuarioIdFiltro);
      if (res.exitoso && res.datos && res.datos.elementos.length > 0) {
        // Los pilotos regulares solo ven tandas reales de pista (sin datos sintéticos de mock)
        const elementosFiltrados = esAdmin
          ? res.datos.elementos
          : res.datos.elementos.filter((s) => !s.isMockSimulation);

        setSesiones(elementosFiltrados);
        setTotalPaginas(res.datos.totalPaginas || 1);
        setTotalRegistros(res.datos.totalRegistros || elementosFiltrados.length);
      } else {
        setSesiones([]);
        setTotalPaginas(1);
        setTotalRegistros(0);
      }
    } catch {
      setErrorApi("Relay Kestrel desconectado. No se pudieron obtener las tandas del servidor.");
      setSesiones([]);
      setTotalPaginas(1);
      setTotalRegistros(0);
    } finally {
      setCargando(false);
    }
  }, [esAdmin, usuario.id]);

  useEffect(() => {
    cargarSesiones(pagina);
  }, [pagina, cargarSesiones]);

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

  const handleConfirmarEliminacion = async () => {
    if (!sesionAEliminar) return;

    setEliminandoId(sesionAEliminar.id);
    try {
      const res = await eliminarSesion(sesionAEliminar.id);
      if (res.exitoso) {
        toast.success("Tanda eliminada", "La tanda y sus muestras fueron eliminadas permanentemente.");
        setSesionAEliminar(null);
        await cargarSesiones(pagina);
      } else {
        toast.error("Error al eliminar", res.mensaje || "No se pudo eliminar la tanda.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error de comunicación con el servidor.";
      toast.error("Error de eliminación", msg);
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#262626] pb-4 sm:flex-row sm:items-end">
        <div className="flex items-start gap-3.5">
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
          {esAdmin && (
            <button
              onClick={handleAlternarMock}
              disabled={conmutandoMock}
              title="Conmutar modo mock (Solo Administrador)"
              className="px-2.5 py-1 rounded bg-[#f4b400]/20 hover:bg-[#f4b400]/30 text-white font-bold transition-colors cursor-pointer border border-[#f4b400]/40"
            >
              {conmutandoMock ? "Conmutando..." : "Activar Mock (Admin)"}
            </button>
          )}
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

      {/* Grid de Sesiones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sesiones.map((sesion) => {
          const circuitoNombre = sesion.circuit || sesion.circuito || "Circuito";
          const configNombre = sesion.trackConfig || sesion.configuracionCircuito || "GP";
          const autoNombre = sesion.carModel || sesion.modeloVehiculo || "Vehículo Desconocido";
          const fechaStr = formatearFecha(sesion.startTime || sesion.fechaInicio || "");
          const mejorVueltaStr = formatearTiempoMs(sesion.bestLapTimeMs || sesion.mejorTiempoMs || 0);
          const totalV = sesion.totalLaps ?? sesion.totalVueltas ?? 0;

          return (
            <div
              key={sesion.id}
              className="relative border-t border-[#222225] pt-6 pb-4 flex flex-col justify-between group hover:bg-white/[0.015] transition-colors rounded-b-lg"
            >
              {/* Botón flotante para eliminar tanda */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSesionAEliminar(sesion);
                }}
                title="Eliminar esta tanda de prueba"
                className="absolute top-4 right-3 z-10 p-1.5 rounded-md text-[#7e7e7e] hover:text-[#ff4444] hover:bg-[#ff4444]/10 transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <Link
                href={`/app/analysis?sesionId=${sesion.id}`}
                className="block flex-1 pr-8 cursor-pointer"
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
            </div>
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
              className="p-2 rounded bg-[#1a1a1a] hover:bg-[#262626] disabled:opacity-30 disabled:cursor-not-allowed border border-[#3c3c3c] text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-[#141414] border border-[#262626] rounded text-white font-bold">
              {pagina}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina >= totalPaginas}
              className="p-2 rounded bg-[#1a1a1a] hover:bg-[#262626] disabled:opacity-30 disabled:cursor-not-allowed border border-[#3c3c3c] text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar Tanda */}
      {sesionAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#121214] border border-[#ff4444]/30 rounded-xl shadow-2xl p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5 text-[#ff4444]">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-white text-base">¿Eliminar esta tanda?</h3>
              </div>
              <button
                onClick={() => setSesionAEliminar(null)}
                className="p-1 rounded-md text-[#7e7e7e] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-2 text-xs font-mono text-[#bbbbbb]">
              <p className="text-white font-bold text-sm">
                {sesionAEliminar.circuit || sesionAEliminar.circuito} ({sesionAEliminar.trackConfig || sesionAEliminar.configuracionCircuito})
              </p>
              <p>Vehículo: <span className="text-white">{sesionAEliminar.carModel || sesionAEliminar.modeloVehiculo}</span></p>
              <p>Vueltas: <span className="text-white">{sesionAEliminar.totalLaps ?? sesionAEliminar.totalVueltas ?? 0}</span></p>
              <p className="text-[#ff7777] pt-2">
                Esta acción eliminará de forma irreversible la sesión y todas sus muestras de telemetría asociadas en SQLite.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSesionAEliminar(null)}
                disabled={eliminandoId !== null}
                className="px-4 py-2 rounded-lg text-xs font-mono text-[#bbbbbb] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarEliminacion}
                disabled={eliminandoId !== null}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold text-white bg-[#ff4444] hover:bg-[#dd3333] transition-colors cursor-pointer disabled:opacity-50"
              >
                {eliminandoId === sesionAEliminar.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Confirmar Eliminación
                  </>
                )}
              </button>
            </div>
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
