"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SelectorVueltas } from "@/components/analisis/SelectorVueltas";
import { GraficoTelemetria } from "@/components/analisis/GraficoTelemetria";
import { MapaCircuitoCanvas } from "@/components/analisis/MapaCircuitoCanvas";
import {
  Database,
  Flag,
  Gauge,
  Loader2,
  Radio,
  RefreshCw,
} from "lucide-react";
import {
  obtenerSesionesPaginadas,
  obtenerVueltasSesion,
  obtenerTelemetriaVuelta,
} from "@/lib/apiClient";
import { obtenerSesionLocal, esUsuarioAdmin } from "@/lib/auth";
import type { ResumenVuelta, MuestraTelemetria } from "@/types/telemetria";
import { mapearMuestraDtoAMuestra } from "@/types/telemetria";
import type { VueltaDto, SesionResumenDto } from "@/types/api";

function mapearVueltaDtoAResumen(dto: VueltaDto): ResumenVuelta {
  return {
    id: dto.id,
    numeroVuelta: dto.lapNumber ?? dto.numeroVuelta ?? 1,
    tiempoVueltaMs: dto.lapTimeMs ?? dto.tiempoVueltaMs ?? 0,
    tiempoVueltaStr: dto.lapTimeStr ?? dto.tiempoVueltaTexto ?? "--:--.---",
    esMejorVuelta: dto.isBestLap ?? dto.esMejorVuelta ?? false,
    esVueltaValida: dto.isValidLap ?? dto.esValida ?? true,
    sectoresMs: [dto.sector1Ms, dto.sector2Ms, dto.sector3Ms],
    totalMuestras: 4800,
  };
}

function ContenidoAnalisis() {
  const searchParams = useSearchParams();
  const sesionIdParam = searchParams.get("sesionId");
  const vueltaIdParam = searchParams.get("vueltaId");

  // Estado de tandas disponibles desde el servidor
  const [sesiones, setSesiones] = useState<SesionResumenDto[]>([]);
  const [sesionSeleccionadaId, setSesionSeleccionadaId] = useState<string | null>(sesionIdParam);
  const [cargandoSesiones, setCargandoSesiones] = useState(true);

  // Vueltas reales de la sesión seleccionada
  const [vueltas, setVueltas] = useState<ResumenVuelta[]>([]);
  const [cargandoVueltas, setCargandoVueltas] = useState(false);
  const [cargandoTelemetriaA, setCargandoTelemetriaA] = useState(false);
  const [cargandoTelemetriaB, setCargandoTelemetriaB] = useState(false);

  // Vueltas seleccionadas para análisis comparativo
  const [vueltaAId, setVueltaAId] = useState<string | null>(vueltaIdParam || null);
  const [vueltaBId, setVueltaBId] = useState<string | null>(null);
  const [distanciaActiva, setDistanciaActiva] = useState<number | null>(0);
  const [ranuraMapa, setRanuraMapa] = useState<"A" | "B">("A");

  // Muestras reales cargadas desde API Kestrel (PostgreSQL / SQLite)
  const [muestrasRealesA, setMuestrasRealesA] = useState<MuestraTelemetria[] | null>(null);
  const [muestrasRealesB, setMuestrasRealesB] = useState<MuestraTelemetria[] | null>(null);

  // 1. Cargar el catálogo de tandas del piloto
  useEffect(() => {
    let cancelado = false;
    setCargandoSesiones(true);

    async function cargarSesionesDisponibles() {
      try {
        const res = await obtenerSesionesPaginadas(1, 50);
        if (!cancelado && res.exitoso && res.datos?.elementos?.length) {
          const perfil = obtenerSesionLocal();
          const esAdmin = esUsuarioAdmin(perfil?.usuario);
          const disponibles = esAdmin
            ? res.datos.elementos
            : res.datos.elementos.filter((s) => !s.isMockSimulation);

          setSesiones(disponibles);

          if (sesionIdParam && disponibles.some((s) => s.id === sesionIdParam)) {
            setSesionSeleccionadaId(sesionIdParam);
          } else if (disponibles.length > 0) {
            const conVueltas = disponibles.find((s) => (s.totalLaps ?? 0) > 0);
            setSesionSeleccionadaId(conVueltas ? conVueltas.id : (disponibles[0]?.id ?? null));
          }
        } else if (!cancelado) {
          setSesiones([]);
        }
      } catch {
        if (!cancelado) setSesiones([]);
      } finally {
        if (!cancelado) setCargandoSesiones(false);
      }
    }

    cargarSesionesDisponibles();

    return () => {
      cancelado = true;
    };
  }, [sesionIdParam]);

  // 2. Cargar vueltas de la tanda activa
  useEffect(() => {
    if (!sesionSeleccionadaId) {
      setVueltas([]);
      setVueltaAId(null);
      setVueltaBId(null);
      return;
    }

    let cancelado = false;
    setCargandoVueltas(true);

    async function cargarVueltasDeSesion() {
      try {
        const res = await obtenerVueltasSesion(sesionSeleccionadaId!);
        if (!cancelado && res.exitoso && Array.isArray(res.datos)) {
          const catalogo = res.datos.map(mapearVueltaDtoAResumen);
          setVueltas(catalogo);

          if (catalogo.length > 0) {
            const vueltaTarget = vueltaIdParam
              ? catalogo.find((v) => v.id === vueltaIdParam)?.id
              : catalogo.find((v) => v.esMejorVuelta)?.id || catalogo[0]?.id;

            setVueltaAId(vueltaTarget || (catalogo[0]?.id ?? null));
          } else {
            setVueltaAId(null);
          }
          setVueltaBId(null);
        } else if (!cancelado) {
          setVueltas([]);
          setVueltaAId(null);
          setVueltaBId(null);
        }
      } catch {
        if (!cancelado) {
          setVueltas([]);
          setVueltaAId(null);
          setVueltaBId(null);
        }
      } finally {
        if (!cancelado) setCargandoVueltas(false);
      }
    }

    cargarVueltasDeSesion();

    return () => {
      cancelado = true;
    };
  }, [sesionSeleccionadaId, vueltaIdParam]);

  // 3. Cargar telemetría real para Vuelta A
  useEffect(() => {
    if (!vueltaAId) {
      setMuestrasRealesA(null);
      return;
    }

    let cancelado = false;
    setCargandoTelemetriaA(true);

    obtenerTelemetriaVuelta(vueltaAId)
      .then((res) => {
        if (!cancelado) {
          if (res.exitoso && Array.isArray(res.datos) && res.datos.length > 0) {
            const mapeadas = res.datos.map((d, i) => mapearMuestraDtoAMuestra(d, i));
            setMuestrasRealesA(mapeadas);
          } else {
            setMuestrasRealesA([]);
          }
        }
      })
      .catch(() => {
        if (!cancelado) setMuestrasRealesA([]);
      })
      .finally(() => {
        if (!cancelado) setCargandoTelemetriaA(false);
      });

    return () => {
      cancelado = true;
    };
  }, [vueltaAId]);

  // 4. Cargar telemetría real para Vuelta B
  useEffect(() => {
    if (!vueltaBId) {
      setMuestrasRealesB(null);
      return;
    }

    let cancelado = false;
    setCargandoTelemetriaB(true);

    obtenerTelemetriaVuelta(vueltaBId)
      .then((res) => {
        if (!cancelado) {
          if (res.exitoso && Array.isArray(res.datos) && res.datos.length > 0) {
            const mapeadas = res.datos.map((d, i) => mapearMuestraDtoAMuestra(d, i));
            setMuestrasRealesB(mapeadas);
          } else {
            setMuestrasRealesB(null);
          }
        }
      })
      .catch(() => {
        if (!cancelado) setMuestrasRealesB(null);
      })
      .finally(() => {
        if (!cancelado) setCargandoTelemetriaB(false);
      });

    return () => {
      cancelado = true;
    };
  }, [vueltaBId]);

  const sesionActiva = useMemo(
    () => sesiones.find((s) => s.id === sesionSeleccionadaId) || null,
    [sesiones, sesionSeleccionadaId]
  );

  const muestrasVueltaA = muestrasRealesA ?? [];
  const muestrasVueltaB = muestrasRealesB ?? undefined;

  const vueltaA = vueltas.find((v) => v.id === vueltaAId);
  const vueltaB = vueltas.find((v) => v.id === vueltaBId);

  const ranuraEfectiva = vueltaB ? ranuraMapa : "A";
  const muestrasMapa = ranuraEfectiva === "B" && muestrasVueltaB ? muestrasVueltaB : muestrasVueltaA;

  const circuitoIdNormalizado = sesionActiva?.circuit.toLowerCase().includes("imola")
    ? ("imola" as const)
    : sesionActiva?.circuit.toLowerCase().includes("rbr") || sesionActiva?.circuit.toLowerCase().includes("redbull")
    ? ("rbr" as const)
    : ("monza" as const);

  const longitudMetrosPista = circuitoIdNormalizado === "rbr" ? 4318 : circuitoIdNormalizado === "imola" ? 4909 : 5793;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Encabezado de la Sesión de Telemetría */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#262626] pb-4 sm:flex-row sm:items-end">
        <div className="flex items-start gap-3.5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
              Laboratorio Analítico 2D
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold tracking-wider text-[#bbbbbb] uppercase font-mono">
              <span className="flex items-center gap-1.5 text-white">
                <Flag className="h-3.5 w-3.5 text-[#0066b1]" />
                {sesionActiva?.circuit || "Sin Tanda Activa"}
              </span>
              <span className="text-[#7e7e7e]">•</span>
              <span className="flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-[#7e7e7e]" />
                {sesionActiva?.carModel || "Monoplaza"}
              </span>
              <span className="text-[#7e7e7e]">•</span>
              <span className="flex items-center gap-1.5 text-[#0fa336]">
                <Database className="h-3.5 w-3.5" />
                {vueltas.length} {vueltas.length === 1 ? "Vuelta Registrada" : "Vueltas Registradas"}
              </span>
            </div>
          </div>
        </div>

        {/* Selector de Tanda Activa */}
        {sesiones.length > 0 && (
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono uppercase text-[#8e8e93]">Tanda:</span>
            <select
              value={sesionSeleccionadaId || ""}
              onChange={(e) => setSesionSeleccionadaId(e.target.value)}
              className="bg-[#141414] border border-[#3c3c3c] hover:border-[#0066b1] text-xs font-mono text-white rounded-lg px-3 py-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0066b1]"
            >
              {sesiones.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#141414] text-white">
                  {s.circuit} • {s.carModel} ({s.totalLaps} V)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {cargandoSesiones ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#7e7e7e]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0066b1] mb-3" />
          <p className="text-xs font-mono uppercase tracking-widest">
            Consultando sesiones de telemetría en el servidor central...
          </p>
        </div>
      ) : sesiones.length === 0 ? (
        <div className="py-20 text-center space-y-4 border border-[#262626] rounded-xl bg-[#0d0d0d] p-8">
          <div className="inline-flex p-4 rounded-full bg-white/[0.04] border border-white/10 text-[#0066b1]">
            <Database className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-base font-bold uppercase tracking-tight text-white">
              No hay tandas de telemetría registradas
            </h2>
            <p className="text-xs text-[#8e8e93] leading-relaxed">
              Aún no se han registrado tandas para este perfil. Conectá Assetto Corsa a través del muro de boxes para capturar telemetría a 60 Hz.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app/live"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0066b1] hover:bg-[#1c69d4] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Radio className="w-4 h-4 animate-pulse text-[#00E676]" />
              Ir al Muro de Boxes en Vivo
            </Link>
            <Link
              href="/app/sessions"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/[0.04] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Historial de Sesiones
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 2. Selector de Vueltas Superior */}
          <section className="relative">
            {cargandoVueltas && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
                <Loader2 className="w-6 h-6 animate-spin text-[#0066b1]" />
              </div>
            )}
            {vueltas.length === 0 && !cargandoVueltas ? (
              <div className="py-8 text-center space-y-2 border border-white/10 rounded-xl bg-white/[0.02]">
                <Flag className="w-6 h-6 text-[#7e7e7e] mx-auto" />
                <p className="text-xs font-mono uppercase text-[#bbbbbb]">
                  Esta tanda no contiene vueltas válidas registradas en pista
                </p>
              </div>
            ) : (
              <SelectorVueltas
                vueltas={vueltas}
                vueltaAId={vueltaAId}
                vueltaBId={vueltaBId}
                enSeleccionarVueltaA={setVueltaAId}
                enSeleccionarVueltaB={setVueltaBId}
              />
            )}
          </section>

          {/* 3. Core Central de Análisis: Mapa de Trazadas 2D */}
          <section className="relative">
            {(cargandoTelemetriaA || cargandoTelemetriaB) && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1 bg-black/80 border border-[#0066b1] rounded text-xs text-[#0066b1] font-mono">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Descargando series métricas de boxes...
              </div>
            )}
            <MapaCircuitoCanvas
              muestras={muestrasMapa}
              muestrasComparativas={muestrasVueltaB}
              distanciaSeleccionada={distanciaActiva}
              onSeleccionarDistancia={setDistanciaActiva}
              nombreCircuito={sesionActiva?.circuit || "Circuito"}
              longitudMetros={longitudMetrosPista}
              circuitoInicial={circuitoIdNormalizado}
              vueltaAInfo={
                vueltaA
                  ? {
                      ranura: "A",
                      numeroVuelta: vueltaA.numeroVuelta,
                      tiempoVueltaStr: vueltaA.tiempoVueltaStr,
                    }
                  : undefined
              }
              vueltaBInfo={
                vueltaB
                  ? {
                      ranura: "B",
                      numeroVuelta: vueltaB.numeroVuelta,
                      tiempoVueltaStr: vueltaB.tiempoVueltaStr,
                    }
                  : undefined
              }
              ranuraActiva={ranuraEfectiva}
              onCambiarRanura={setRanuraMapa}
            />
          </section>

          {/* 4. Gráficos de Telemetría Sincronizados Multieje */}
          <section>
            <GraficoTelemetria
              muestrasVueltaA={muestrasVueltaA}
              muestrasVueltaB={muestrasVueltaB}
              nombreVueltaA={
                vueltaA ? `V${vueltaA.numeroVuelta} (${vueltaA.tiempoVueltaStr})` : "Vuelta A"
              }
              nombreVueltaB={
                vueltaB ? `V${vueltaB.numeroVuelta} (${vueltaB.tiempoVueltaStr})` : undefined
              }
              distanciaActiva={distanciaActiva}
              onHoverDistancia={setDistanciaActiva}
            />
          </section>
        </div>
      )}
    </div>
  );
}

export default function PaginaAnalisis() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#7e7e7e]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0066b1] mb-3" />
          <p className="text-xs font-mono uppercase tracking-widest">
            Inicializando Laboratorio Analítico 2D...
          </p>
        </div>
      }
    >
      <ContenidoAnalisis />
    </Suspense>
  );
}
