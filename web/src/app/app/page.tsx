"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Gauge,
  LineChart,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Clock,
  Radio,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  obtenerSesionLocal,
  USUARIO_ALEJO_GARLATI,
  USUARIO_ALEJO_SALAS,
} from "@/lib/auth";
import type { PerfilUsuario } from "@/types/usuario";
import {
  obtenerEstadoServicio,
  obtenerSesionesPaginadas,
  obtenerVueltasSesion,
  obtenerLeaderboard,
} from "@/lib/apiClient";
import type { EstadoServicioDto, SesionResumenDto, LeaderboardItemDto } from "@/types/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tooltip } from "@/components/ui/Tooltip";

export default function PaginaDashboardBoxes() {
  const [usuario, setUsuario] = useState<PerfilUsuario>(() => {
    const sesion = obtenerSesionLocal();
    return sesion ? sesion.usuario : USUARIO_ALEJO_GARLATI;
  });

  const [estadoServicio, setEstadoServicio] = useState<EstadoServicioDto | null>(null);
  const [ultimaSesion, setUltimaSesion] = useState<SesionResumenDto | null>(null);
  const [rankingTop, setRankingTop] = useState<LeaderboardItemDto[]>([]);
  const [tiempoIdealStr, setTiempoIdealStr] = useState("01:20.810");
  const [deltaIdealStr, setDeltaIdealStr] = useState("-0.430s");
  const [consistenciaStr, setConsistenciaStr] = useState("94.4%");
  const [vueltasValidasStr, setVueltasValidasStr] = useState("17 vueltas válidas");
  const [cargando, setCargando] = useState(true);

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

  const metricas = usuario.rating.metricas;
  const esGarlati = usuario.id === USUARIO_ALEJO_GARLATI.id || usuario.email.includes("garlati");

  const formatearTiempoMs = (ms: number) => {
    if (!ms || ms <= 0) return "--:--.---";
    const totalSegundos = ms / 1000;
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${segundos.toFixed(3).padStart(6, "0")}`;
  };

  useEffect(() => {
    let cancelado = false;
    setCargando(true);

    async function cargarDatosDashboard() {
      try {
        // 1. Consultar estado del Core Relay
        const resEstado = await obtenerEstadoServicio().catch(() => null);
        if (!cancelado && resEstado?.exitoso && resEstado.datos) {
          setEstadoServicio(resEstado.datos);
        }

        // 2. Consultar la última tanda registrada
        const resSesiones = await obtenerSesionesPaginadas(1, 1).catch(() => null);
        if (!cancelado && resSesiones?.exitoso && resSesiones.datos?.elementos?.length) {
          const sesion = resSesiones.datos.elementos[0];
          if (sesion) {
            setUltimaSesion(sesion);

            // 3. Consultar las vueltas de la sesión para calcular vuelta ideal y consistencia
            const resVueltas = await obtenerVueltasSesion(sesion.id).catch(() => null);
            if (!cancelado && resVueltas?.exitoso && resVueltas.datos?.length) {
              const vueltas = resVueltas.datos;
              const validas = vueltas.filter((v) => v.isValidLap ?? v.esValida ?? true);

              if (validas.length > 0) {
                const s1Min = Math.min(...validas.map((v) => v.sector1Ms).filter((s) => s > 0));
                const s2Min = Math.min(...validas.map((v) => v.sector2Ms).filter((s) => s > 0));
                const s3Min = Math.min(...validas.map((v) => v.sector3Ms).filter((s) => s > 0));

                if (s1Min > 0 && s2Min > 0 && s3Min > 0) {
                  const idealMs = s1Min + s2Min + s3Min;
                  setTiempoIdealStr(formatearTiempoMs(idealMs));
                  const pb = sesion.bestLapTimeMs || sesion.mejorTiempoMs || idealMs;
                  const delta = (idealMs - pb) / 1000;
                  setDeltaIdealStr(`${delta.toFixed(3)}s`);
                }

                const pct = Math.round((validas.length / vueltas.length) * 1000) / 10;
                setConsistenciaStr(`${pct}%`);
                setVueltasValidasStr(`${validas.length} vueltas válidas`);
              }
            }
          }
        }

        // 4. Consultar el top de clasificación de Monza
        const resLeaderboard = await obtenerLeaderboard("monza", 3).catch(() => null);
        if (!cancelado && resLeaderboard?.exitoso && resLeaderboard.datos?.length) {
          setRankingTop(resLeaderboard.datos);
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarDatosDashboard();

    return () => {
      cancelado = true;
    };
  }, []);

  const enlaceActivo = estadoServicio?.isConnected || estadoServicio?.isMockMode || false;
  const esMock = estadoServicio?.isMockMode || false;
  const circuitoActual = estadoServicio?.circuit && estadoServicio.circuit !== "Desconocido / Esperando simulador"
    ? estadoServicio.circuit
    : ultimaSesion?.circuit || ultimaSesion?.circuito || (esGarlati ? "Autodromo Nazionale Monza" : "Autodromo Nazionale Monza");
  const autoActual = estadoServicio?.carModel && estadoServicio.carModel !== "Desconocido"
    ? estadoServicio.carModel
    : ultimaSesion?.carModel || ultimaSesion?.modeloVehiculo || usuario.vehiculoPrincipal;

  const mejorVueltaMs = ultimaSesion?.bestLapTimeMs || ultimaSesion?.mejorTiempoMs || (esGarlati ? 81240 : 107382);
  const totalVueltas = ultimaSesion?.totalLaps ?? ultimaSesion?.totalVueltas ?? usuario.vueltasTotales;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner de Bienvenida y Diagnóstico Rápido */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-black border border-[#262626] rounded-lg text-[#0066b1]">
            <Gauge className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                Bienvenido, {usuario.nombre}
              </h1>
              {enlaceActivo ? (
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0fa336]/15 text-[#0fa336] border border-[#0fa336]/30 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0fa336] animate-pulse" />
                  {esMock ? "Generador Mock @ 60 Hz" : "Enlace Win32 MMF Activo"}
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#f4b400]/15 text-[#f4b400] border border-[#f4b400]/30 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f4b400]" />
                  Standby • Esperando Sim
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#bbbbbb] mt-1 font-mono">
              Sesión activa: <span className="text-white font-bold">{circuitoActual}</span> • <span className="text-[#0066b1]">{autoActual}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            href="/app/live"
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg font-bold uppercase tracking-wider text-xs bg-[#1a1a1a] hover:bg-[#262626] border border-[#3c3c3c] hover:border-[#0066b1] text-white transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0066b1]"
          >
            <Radio className="w-4 h-4 text-[#00E676] animate-pulse" />
            Live Pitwall @ 60 Hz
          </Link>

          <Link
            href="/app/analysis"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider text-xs bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all shadow-lg shadow-[#0066b1]/20 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1c69d4]"
          >
            <LineChart className="w-4 h-4" />
            Laboratorio Analítico 2D
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid Central: Resumen de Tanda + Radar de Habilidades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumen de Última Tanda */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#262626] rounded-xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div className="flex items-center gap-3">
                <h2 className="text-base sm:text-lg font-bold uppercase text-white tracking-tight">
                  {ultimaSesion?.circuit || ultimaSesion?.circuito || "Autodromo Nazionale Monza"}
                </h2>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#262626] text-[#bbbbbb] border border-[#3c3c3c]">
                  Última Tanda
                </span>
              </div>
              <span className="text-xs font-mono text-[#0066b1] bg-[#0066b1]/10 px-2.5 py-1 rounded border border-[#0066b1]/30 font-bold">
                {totalVueltas} Vueltas
              </span>
            </div>

            {cargando ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
                <div className="bg-black/60 border border-[#262626] p-3.5 rounded-lg">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#7e7e7e]">
                    <span>Mejor Vuelta (PB)</span>
                    <Tooltip content="Mejor tiempo oficial de vuelta válida registrado en la sesión." />
                  </div>
                  <div className="text-xl font-bold font-mono text-[#00E676] mt-1 tabular-nums">
                    {formatearTiempoMs(mejorVueltaMs)}
                  </div>
                  <div className="text-[10px] text-[#7e7e7e] mt-0.5 font-mono">SQLite WAL oficial</div>
                </div>

                <div className="bg-black/60 border border-[#262626] p-3.5 rounded-lg">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#7e7e7e]">
                    <span>Vuelta Óptima (Ideal)</span>
                    <Tooltip content="Suma teórica de los 3 mejores sectores individuales del piloto en la tanda." />
                  </div>
                  <div className="text-xl font-bold font-mono text-[#0066b1] mt-1 tabular-nums">
                    {tiempoIdealStr}
                  </div>
                  <div className="text-[10px] text-[#0066b1] mt-0.5 font-mono">Delta: {deltaIdealStr}</div>
                </div>

                <div className="bg-black/60 border border-[#262626] p-3.5 rounded-lg">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#7e7e7e]">
                    <span>Top Speed (Rettifilo)</span>
                    <Tooltip content="Velocidad máxima alcanzada al final de la recta principal antes del punto de frenada." />
                  </div>
                  <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                    {esGarlati ? "348.5" : "284.2"} <span className="text-xs text-[#7e7e7e]">km/h</span>
                  </div>
                  <div className="text-[10px] text-[#7e7e7e] mt-0.5 font-mono">
                    {esGarlati ? "Con DRS activo" : "Curva Grande GT3"}
                  </div>
                </div>

                <div className="bg-black/60 border border-[#262626] p-3.5 rounded-lg">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#7e7e7e]">
                    <span>Consistencia</span>
                    <Tooltip content="Porcentaje de vueltas limpias sin exceder límites de pista y con baja dispersión." />
                  </div>
                  <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                    {consistenciaStr}
                  </div>
                  <div className="text-[10px] text-[#0fa336] mt-0.5 font-mono">{vueltasValidasStr}</div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#262626] flex items-center justify-between text-xs font-mono">
            <span className="text-[#bbbbbb] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7e7e7e]" />
              {ultimaSesion?.carModel || "Ferrari SF70H (F1 2017)"}
            </span>
            <Link
              href="/app/sessions"
              className="text-[#0066b1] hover:underline font-bold uppercase text-[11px] flex items-center gap-1"
            >
              Explorar Historial
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Radar de Habilidades del Piloto */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <h3 className="text-base font-bold uppercase text-white tracking-tight">
                Apex Rating {usuario.rating.paceRating}
              </h3>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#e22718]/15 text-[#e22718] border border-[#e22718]/30">
                Cat. {usuario.rating.safetyRating}
              </span>
            </div>

            <div className="py-4 space-y-3 font-mono">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#bbbbbb]">Velocidad Punta & Tracción</span>
                  <span className="text-white font-bold">{metricas.velocidad}%</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-[#0066b1]" style={{ width: `${metricas.velocidad}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#bbbbbb]">Potencia de Frenada</span>
                  <span className="text-white font-bold">{metricas.frenada}%</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-[#e22718]" style={{ width: `${metricas.frenada}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#bbbbbb]">Control de Chasis & G-Force</span>
                  <span className="text-white font-bold">{metricas.control}%</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-[#1c69d4]" style={{ width: `${metricas.control}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#bbbbbb]">Consistencia Vuelta a Vuelta</span>
                  <span className="text-white font-bold">{metricas.consistencia}%</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-[#0fa336]" style={{ width: `${metricas.consistencia}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#262626] text-center font-mono">
            <span className="text-[11px] text-[#7e7e7e]">
              Rango de Piloto: <strong className="text-white">{usuario.rating.nivel}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* AI Race Coach: Diagnóstico Heurístico de Telemetría */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-black border border-[#262626] text-[#f4b400]">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold uppercase tracking-tight text-white">
              AI Race Coach • Diagnóstico Automático de Telemetría
            </h3>
            <p className="text-xs text-[#7e7e7e] font-mono">
              Análisis comparativo de telemetría en tiempo real sobre el trazado de Monza
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-black/60 border border-[#0fa336]/30">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#0fa336] mb-1.5 font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{usuario.diagnosticoAi.puntoFuerteTitulo}</span>
            </div>
            <p className="text-xs text-[#bbbbbb] leading-relaxed">
              {usuario.diagnosticoAi.puntoFuerteDesc}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-black/60 border border-[#e22718]/30">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#e22718] mb-1.5 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{usuario.diagnosticoAi.oportunidadMejoraTitulo}</span>
            </div>
            <p className="text-xs text-[#bbbbbb] leading-relaxed">
              {usuario.diagnosticoAi.oportunidadMejoraDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard del Stand FAPPE 2026 */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-4">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-[#f4b400]" />
            <div>
              <h3 className="text-base font-bold uppercase tracking-tight text-white">
                Tabla de Récords Oficiales • Monza GP
              </h3>
              <p className="text-xs text-[#7e7e7e] font-mono">
                Registros en vivo marcados por pilotos en el simulador sincronizados con la base de datos
              </p>
            </div>
          </div>
          <Link
            href="/app/leaderboards"
            className="text-xs font-mono text-[#0066b1] hover:underline flex items-center gap-1 font-bold"
          >
            Ver Tabla Completa
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-[#262626]">
          {rankingTop.map((item) => (
            <div key={`${item.posicion}-${item.piloto}`} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold font-mono w-6 ${
                    item.posicion === 1
                      ? "text-[#f4b400]"
                      : item.posicion === 2
                      ? "text-[#bbbbbb]"
                      : "text-[#e22718]"
                  }`}
                >
                  {String(item.posicion).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{item.piloto}</span>
                    {item.esRecord && (
                      <span className="text-[9px] bg-[#0066b1] text-white font-mono px-1.5 py-0.2 rounded font-black uppercase">
                        Record
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#7e7e7e] font-mono">
                    {item.auto} • {item.vueltas} vueltas
                  </div>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-sm font-bold text-[#00E676] tabular-nums">{item.tiempo}</div>
                <div
                  className={`text-[10px] ${
                    item.delta === "Ref" ? "text-[#7e7e7e]" : "text-[#e22718]"
                  }`}
                >
                  {item.delta}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
