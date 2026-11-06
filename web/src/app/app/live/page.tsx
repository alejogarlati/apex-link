"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flag,
  Gauge,
  LineChart,
  Radio,
  RefreshCw,
  Trophy,
  Zap,
} from "lucide-react";
import { useLiveTelemetryWebSocket } from "@/hooks/useLiveTelemetryWebSocket";
import { PedalTelemetryBars } from "@/components/live/PedalTelemetryBars";
import { KammFrictionCircle } from "@/components/live/KammFrictionCircle";
import { TyreThermalsMatrix } from "@/components/live/TyreThermalsMatrix";
import { LiveMapaCircuitoCanvas } from "@/components/live/LiveMapaCircuitoCanvas";
import { LiveLapTimesList, type VueltaRegistrada } from "@/components/live/LiveLapTimesList";
import { solicitarPost, obtenerEstadoServicio } from "@/lib/apiClient";
import { obtenerSesionLocal, esUsuarioAdmin, USUARIO_ALEJO_GARLATI } from "@/lib/auth";
import type { PerfilUsuario } from "@/types/usuario";
import type { EstadoMockDto, EstadoServicioDto } from "@/types/api";

export default function PaginaLivePitwall() {
  const [usuario, setUsuario] = useState<PerfilUsuario>(() => {
    const sesion = obtenerSesionLocal();
    return sesion ? sesion.usuario : USUARIO_ALEJO_GARLATI;
  });

  useEffect(() => {
    const sincronizar = () => {
      const sesion = obtenerSesionLocal();
      if (sesion?.usuario) setUsuario(sesion.usuario);
    };
    sincronizar();
    window.addEventListener("storage", sincronizar);
    window.addEventListener("apexlink_usuario_cambiado", sincronizar);
    return () => {
      window.removeEventListener("storage", sincronizar);
      window.removeEventListener("apexlink_usuario_cambiado", sincronizar);
    };
  }, []);

  const esAdmin = esUsuarioAdmin(usuario);

  const {
    conectado,
    frame,
    ultimoEventoVuelta,
    latenciaMs,
    fpsEstimado,
    totalCuadrosRecibidos,
    reconectar,
  } = useLiveTelemetryWebSocket();

  const [estadoServicio, setEstadoServicio] = useState<EstadoServicioDto | null>(null);

  useEffect(() => {
    let cancelado = false;
    const consultar = async () => {
      const res = await obtenerEstadoServicio().catch(() => null);
      if (!cancelado && res?.exitoso && res.datos) {
        setEstadoServicio(res.datos);
      }
    };
    consultar();
    const interval = setInterval(consultar, 3000);
    return () => {
      cancelado = true;
      clearInterval(interval);
    };
  }, []);

  const [conmutandoMock, setConmutandoMock] = useState(false);
  const [vueltasSesion, setVueltasSesion] = useState<VueltaRegistrada[]>([]);

  // Aislar datos del modo mock: los pilotos regulares no ingieren vueltas sintéticas
  const simulacionMockActiva = Boolean(estadoServicio?.isMockMode);
  const telemetriaValidaParaUsuario = esAdmin || (!simulacionMockActiva && conectado);
  const frameEfectivo = telemetriaValidaParaUsuario ? frame : null;

  // Mantener la velocidad actual en ref para evitar re-ejecuciones de effect en cada frame
  const velocidadAutoRef = useRef(frameEfectivo?.car.speedKmh ?? 0);
  useEffect(() => {
    velocidadAutoRef.current = frameEfectivo?.car.speedKmh ?? 0;
  }, [frameEfectivo?.car.speedKmh]);

  // Sincronizar automáticamente nuevas vueltas cruzadas por meta vía WebSocket
  useEffect(() => {
    if (!ultimoEventoVuelta) return;
    if (!esAdmin && simulacionMockActiva) return;

    setVueltasSesion((prev) => {
      if (prev.some((v) => v.lapNumber === ultimoEventoVuelta.lapNumber)) {
        return prev;
      }

      const nuevaVuelta: VueltaRegistrada = {
        lapNumber: ultimoEventoVuelta.lapNumber,
        lapTimeMs: ultimoEventoVuelta.lapTimeMs,
        lapTimeStr: ultimoEventoVuelta.lapTimeStr,
        isPersonalBest: ultimoEventoVuelta.isPersonalBest,
        isValidLap: ultimoEventoVuelta.isValidLap,
        sectors: ultimoEventoVuelta.sectors,
        topSpeedKmh: Math.round(velocidadAutoRef.current),
      };

      const listaBase = ultimoEventoVuelta.isPersonalBest
        ? prev.map((v) => ({ ...v, isPersonalBest: false }))
        : [...prev];

      return [nuevaVuelta, ...listaBase];
    });
  }, [ultimoEventoVuelta, esAdmin, simulacionMockActiva]);

  const manejarAlternarMock = async () => {
    try {
      setConmutandoMock(true);
      const res = await solicitarPost<EstadoMockDto>("/api/mock/alternar", {});
      if (res.exitoso && res.datos) {
        const activo = res.datos.modoMockActivo ?? res.datos.isMockActive ?? false;
        setEstadoServicio((prev) =>
          prev
            ? { ...prev, isMockMode: activo, isConnected: activo || prev.isConnected }
            : null
        );
      }
    } catch {
      // Manejado defensivamente
    } finally {
      setConmutandoMock(false);
    }
  };

  // Valores de fallback cuando no hay frame activo
  const auto = frameEfectivo?.car ?? {
    speedKmh: 0,
    rpms: 0,
    maxRpm: 13000,
    gear: 0,
    throttle: 0,
    brake: 0,
    steer: 0,
    drsAvailable: false,
    drsEnabled: false,
  };

  const timing = frameEfectivo?.timing ?? {
    lapTimeMs: 0,
    lapTimeStr: "--:--.---",
    bestTimeMs: 0,
    bestTimeStr: "--:--.---",
    deltaMs: 0,
    currentLap: 0,
    sector: 1,
    lapProgress: 0,
  };

  const neumaticos = frameEfectivo?.tyres ?? {
    pressurePsi: [27.5, 27.8, 27.6, 27.9],
    tempCoreC: [85.0, 92.0, 86.0, 93.0],
    wear: [98, 97, 98, 97],
  };

  const dinamicas = frameEfectivo?.dynamics ?? {
    gForce: { lat: 0, lon: 0, vert: 1 },
    worldPos: { x: 0, y: 12, z: 0 },
  };

  const sesion = frameEfectivo?.session ?? {
    flag: "GREEN",
    position: 1,
    track: "monza",
    carModel: usuario.vehiculoPrincipal || "Ferrari SF70H",
  };

  const deltaNegativo = timing.deltaMs < 0;
  const deltaStr = (timing.deltaMs / 1000).toFixed(3);
  const deltaColor = deltaNegativo ? "text-[#0fa336]" : "text-[#e22718]";
  const deltaFondo = deltaNegativo ? "bg-[#0fa336]/10" : "bg-[#e22718]/10";
  const deltaBorde = deltaNegativo ? "border-[#0fa336]/30" : "border-[#e22718]/30";

  const longitudCircuito = 5793;
  const distanciaEstimada = (timing.lapProgress || 0) * longitudCircuito;

  const circuitoIdEnVivo = sesion.track.toLowerCase().includes("imola")
    ? ("imola" as const)
    : sesion.track.toLowerCase().includes("rbr") || sesion.track.toLowerCase().includes("redbull")
    ? ("rbr" as const)
    : ("monza" as const);

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto">
      {/* Layout Principal: 50% Margen Izquierdo (Demás Información) + 50% Derecha (Canvas 2D + Tiempos) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* COLUMNA IZQUIERDA (Demás Información) */}
        <div className="space-y-6">
          {/* 1. Header con Telemetría en Vivo e Indicador de Estado */}
          <div className="pb-5 border-b border-[#222225] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={telemetriaValidaParaUsuario ? "text-[#0fa336]" : "text-[#f4b400]"}>
                <Radio className={`w-5 h-5 ${telemetriaValidaParaUsuario ? "animate-pulse" : ""}`} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white">
                    {telemetriaValidaParaUsuario
                      ? `Autodromo Nazionale Monza • ${sesion.carModel}`
                      : "Muro de Boxes • Esperando Assetto Corsa (ACS.exe)"}
                  </h1>
                  {telemetriaValidaParaUsuario ? (
                    <span className="flex items-center gap-1.5 text-xs font-mono text-[#0fa336] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#0fa336] animate-pulse" />
                      {simulacionMockActiva && esAdmin
                        ? `Mock (Admin) ${fpsEstimado} FPS`
                        : `Live ACS.exe ${fpsEstimado} FPS`}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-mono text-[#f4b400] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#f4b400]" />
                      Standby
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#bbbbbb] font-mono mt-0.5">
                  {telemetriaValidaParaUsuario
                    ? simulacionMockActiva && esAdmin
                      ? "Generador Mock Sintético @ 60 Hz (Exclusivo Administrador)"
                      : "Canal compartido Win32 MMF @ 60 Hz"
                    : "Esperando inicio de tanda en Assetto Corsa (Win32 MMF Standby)"}
                </p>
              </div>
            </div>

            {/* Controles de Conexión y Ping */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#7e7e7e]">
                <span>Ping: <strong className="text-white">{telemetriaValidaParaUsuario ? latenciaMs : 0} ms</strong></span>
                <span className="text-[#3c3c3c]">|</span>
                <span>Cuadros: <strong className="text-[#0066b1]">{telemetriaValidaParaUsuario ? totalCuadrosRecibidos : 0}</strong></span>
              </div>

              {esAdmin && (
                <button
                  onClick={manejarAlternarMock}
                  disabled={conmutandoMock}
                  title="Conmutar generador sintético Mock (Exclusivo Administrador)"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase border border-amber-500/30 hover:border-amber-500/60 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5 text-[#f4b400]" />
                  {conmutandoMock ? "..." : "Mock (Admin)"}
                </button>
              )}

              {!conectado && (
                <button
                  onClick={reconectar}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reconectar
                </button>
              )}
            </div>
          </div>

          {/* 2. Banner de Notificación de Vuelta Récord (si ocurrió evento) */}
          {ultimoEventoVuelta && telemetriaValidaParaUsuario && (
            <div className="py-3 px-4 border border-[#0066b1]/30 rounded-lg flex items-center justify-between bg-[#0066b1]/5">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-[#f4b400] shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066b1] font-mono">
                    {ultimoEventoVuelta.isPersonalBest ? "¡Récord Personal (PB) Registrado!" : "Vuelta Completada"}
                  </span>
                  <div className="text-base font-bold font-mono text-white tabular-nums">
                    Vuelta {ultimoEventoVuelta.lapNumber} • {ultimoEventoVuelta.lapTimeStr}
                  </div>
                </div>
              </div>

              <Link
                href="/app/analysis"
                className="px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all flex items-center gap-1.5"
              >
                <LineChart className="w-3.5 h-3.5" />
                uPlot
              </Link>
            </div>
          )}

          {/* 3. Instrumental Dinámico HUD (Sin cards pesadas, dividores sutiles) */}
          <div className="py-5 border-y border-[#222225] grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#222225]">
            {/* Velocidad */}
            <div className="sm:pr-3">
              <span className="text-[10px] uppercase font-bold text-[#7e7e7e] font-mono tracking-wider">
                Velocidad
              </span>
              <div className="text-3xl font-bold font-mono text-white mt-1 tabular-nums tracking-tight">
                {auto.speedKmh.toFixed(0)}
                <span className="text-xs text-[#7e7e7e] ml-1 font-normal">km/h</span>
              </div>
            </div>

            {/* Marcha */}
            <div className="sm:px-3">
              <span className="text-[10px] uppercase font-bold text-[#7e7e7e] font-mono tracking-wider">
                Marcha
              </span>
              <div className="text-3xl font-bold font-mono text-[#0066b1] mt-1 tabular-nums tracking-tight">
                {auto.gear === -1 ? "R" : auto.gear === 0 ? "N" : auto.gear}
              </div>
            </div>

            {/* Régimen de Giro / RPM */}
            <div className="pt-3 sm:pt-0 sm:px-3">
              <span className="text-[10px] uppercase font-bold text-[#7e7e7e] font-mono tracking-wider">
                Régimen
              </span>
              <div className="text-3xl font-bold font-mono text-white mt-1 tabular-nums tracking-tight">
                {auto.rpms.toLocaleString("es-AR")}
                <span className="text-xs text-[#7e7e7e] ml-1 font-normal">RPM</span>
              </div>
            </div>

            {/* Cronómetro y Delta */}
            <div className="pt-3 sm:pt-0 sm:pl-3">
              <span className="text-[10px] uppercase font-bold text-[#7e7e7e] font-mono tracking-wider">
                Vuelta {timing.currentLap} • Delta
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
                  {timing.lapTimeStr}
                </span>
                <span className={`text-xs font-bold font-mono ${deltaColor} tabular-nums`}>
                  {deltaNegativo ? deltaStr : `+${deltaStr}`}s
                </span>
              </div>
            </div>
          </div>

          {/* 4. Módulos Físicos de Telemetría (Pedales, Círculo de Kamm, Neumáticos) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <PedalTelemetryBars car={auto} />
            <KammFrictionCircle dynamics={dinamicas} />
            <TyreThermalsMatrix tyres={neumaticos} />
          </div>
        </div>

        {/* COLUMNA DERECHA (50% Ancho hacia la derecha: Canvas 2D del Laboratorio Analítico + Tiempos de Vuelta) */}
        <div className="space-y-6">
          {/* Canvas 2D en Vivo como Sección Principal */}
          <div className="border border-[#222225] rounded-xl overflow-hidden bg-[#09090b]">
            <LiveMapaCircuitoCanvas
              distanciaSeleccionada={distanciaEstimada}
              nombreCircuito={sesion.track.toUpperCase().includes("IMOLA") ? "Autodromo Enzo e Dino Ferrari" : sesion.track.toUpperCase().includes("RBR") ? "Red Bull Ring GP" : "Autodromo Nazionale Monza"}
              longitudMetros={longitudCircuito}
              circuitoInicial={circuitoIdEnVivo}
              telemetriaAuto={auto}
            />
          </div>

          {/* Debajo, Lista de Tiempos de Vuelta */}
          <LiveLapTimesList
            timing={timing}
            vueltas={vueltasSesion}
            topSpeedActual={auto.speedKmh}
          />
        </div>
      </div>
    </div>
  );
}
