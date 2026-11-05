"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { VUELTAS_MOCK_MONZA, generarTelemetriaMonza } from "@/lib/mockTelemetria";
import { SelectorVueltas } from "@/components/analisis/SelectorVueltas";
import { GraficoTelemetria } from "@/components/analisis/GraficoTelemetria";
import { MapaCircuitoCanvas } from "@/components/analisis/MapaCircuitoCanvas";
import {
  Database,
  Flag,
  Gauge,
  Loader2,
  RefreshCw,
  Sparkles,
  Layers,
} from "lucide-react";
import {
  obtenerSesionesPaginadas,
  obtenerVueltasSesion,
  obtenerTelemetriaVuelta,
} from "@/lib/apiClient";
import type { ResumenVuelta, MuestraTelemetria } from "@/types/telemetria";
import { mapearMuestraDtoAMuestra } from "@/types/telemetria";
import type { VueltaDto } from "@/types/api";

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

  const [vueltas, setVueltas] = useState<ResumenVuelta[]>(VUELTAS_MOCK_MONZA);
  const [esModoReal, setEsModoReal] = useState(false);
  const [cargandoVueltas, setCargandoVueltas] = useState(false);
  const [cargandoTelemetriaA, setCargandoTelemetriaA] = useState(false);
  const [cargandoTelemetriaB, setCargandoTelemetriaB] = useState(false);

  const [vueltaAId, setVueltaAId] = useState<string | null>(vueltaIdParam || "lap-monza-04");
  const [vueltaBId, setVueltaBId] = useState<string | null>("lap-monza-02");
  const [distanciaActiva, setDistanciaActiva] = useState<number | null>(0);
  const [ranuraMapa, setRanuraMapa] = useState<"A" | "B">("A");

  // Muestras cargadas desde API o generadas
  const [muestrasRealesA, setMuestrasRealesA] = useState<MuestraTelemetria[] | null>(null);
  const [muestrasRealesB, setMuestrasRealesB] = useState<MuestraTelemetria[] | null>(null);

  // Cargar catálogo de vueltas de la sesión activa o la más reciente
  useEffect(() => {
    let cancelado = false;

    async function cargarCatalogoVueltas() {
      setCargandoVueltas(true);
      try {
        let idSesion = sesionIdParam;

        // Si no vino parámetro de sesión, consultar la sesión más reciente
        if (!idSesion) {
          const resSesiones = await obtenerSesionesPaginadas(1, 1);
          if (
            resSesiones.exitoso &&
            resSesiones.datos &&
            resSesiones.datos.elementos.length > 0
          ) {
            const primerElemento = resSesiones.datos.elementos[0];
            if (primerElemento) {
              idSesion = primerElemento.id;
            }
          }
        }

        if (idSesion) {
          const resVueltas = await obtenerVueltasSesion(idSesion);
          if (!cancelado && resVueltas.exitoso && Array.isArray(resVueltas.datos) && resVueltas.datos.length > 0) {
            const catalogo = resVueltas.datos.map(mapearVueltaDtoAResumen);
            setVueltas(catalogo);
            setEsModoReal(true);

            // Seleccionar vuelta inicial
            const vueltaTarget = vueltaIdParam
              ? catalogo.find((v) => v.id === vueltaIdParam)?.id
              : catalogo.find((v) => v.esMejorVuelta)?.id || catalogo[0]?.id;

            if (vueltaTarget) {
              setVueltaAId(vueltaTarget);
            }
            setVueltaBId(null);
            return;
          }
        }

        // Fallback a mock si no hay sesiones reales
        if (!cancelado) {
          setVueltas(VUELTAS_MOCK_MONZA);
          setEsModoReal(false);
          setVueltaAId(vueltaIdParam || "lap-monza-04");
          setVueltaBId("lap-monza-02");
        }
      } catch {
        if (!cancelado) {
          setVueltas(VUELTAS_MOCK_MONZA);
          setEsModoReal(false);
        }
      } finally {
        if (!cancelado) setCargandoVueltas(false);
      }
    }

    cargarCatalogoVueltas();

    return () => {
      cancelado = true;
    };
  }, [sesionIdParam, vueltaIdParam]);

  // Cargar telemetría para Vuelta A
  useEffect(() => {
    if (!vueltaAId) {
      setMuestrasRealesA(null);
      return;
    }

    // Si es ID mock
    if (vueltaAId.startsWith("lap-monza")) {
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
            setMuestrasRealesA(null);
          }
        }
      })
      .catch(() => {
        if (!cancelado) setMuestrasRealesA(null);
      })
      .finally(() => {
        if (!cancelado) setCargandoTelemetriaA(false);
      });

    return () => {
      cancelado = true;
    };
  }, [vueltaAId]);

  // Cargar telemetría para Vuelta B
  useEffect(() => {
    if (!vueltaBId) {
      setMuestrasRealesB(null);
      return;
    }

    if (vueltaBId.startsWith("lap-monza")) {
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

  const muestrasVueltaA = useMemo(() => {
    if (muestrasRealesA && muestrasRealesA.length > 0) return muestrasRealesA;
    if (!vueltaAId) return [];
    const factor = vueltaAId === "lap-monza-04" ? 1.0 : 0.95;
    return generarTelemetriaMonza(factor);
  }, [muestrasRealesA, vueltaAId]);

  const muestrasVueltaB = useMemo(() => {
    if (!vueltaBId) return undefined;
    if (muestrasRealesB && muestrasRealesB.length > 0) return muestrasRealesB;
    return generarTelemetriaMonza(0.91);
  }, [muestrasRealesB, vueltaBId]);

  const vueltaA = vueltas.find((v) => v.id === vueltaAId);
  const vueltaB = vueltas.find((v) => v.id === vueltaBId);

  const ranuraEfectiva = vueltaB ? ranuraMapa : "A";
  const muestrasMapa = ranuraEfectiva === "B" && muestrasVueltaB ? muestrasVueltaB : muestrasVueltaA;

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
              Autodromo Nazionale Monza
            </span>
            <span className="text-[#7e7e7e]">•</span>
            <span className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-[#7e7e7e]" />
              Ferrari SF70H / GT3
            </span>
            <span className="text-[#7e7e7e]">•</span>
            <span className="flex items-center gap-1.5 text-[#0fa336]">
              <Database className="h-3.5 w-3.5" />
              {vueltas.length} Vueltas Registradas
            </span>
          </div>
        </div>
      </div>
    </div>

      <div className="space-y-6">
        {/* 2. Selector de Vueltas Superior */}
        <section className="relative">
          {cargandoVueltas && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
              <Loader2 className="w-6 h-6 animate-spin text-[#0066b1]" />
            </div>
          )}
          <SelectorVueltas
            vueltas={vueltas}
            vueltaAId={vueltaAId}
            vueltaBId={vueltaBId}
            enSeleccionarVueltaA={setVueltaAId}
            enSeleccionarVueltaB={setVueltaBId}
          />
        </section>

        {/* 3. Core Central de Análisis: Mapa de Trazadas 2D */}
        <section className="relative">
          {(cargandoTelemetriaA || cargandoTelemetriaB) && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1 bg-black/80 border border-[#0066b1] rounded text-xs text-[#0066b1] font-mono">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Descargando series métricas...
            </div>
          )}
          <MapaCircuitoCanvas
            muestras={muestrasMapa}
            muestrasComparativas={muestrasVueltaB}
            distanciaSeleccionada={distanciaActiva}
            onSeleccionarDistancia={setDistanciaActiva}
            nombreCircuito="Autodromo Nazionale Monza"
            longitudMetros={5793}
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
