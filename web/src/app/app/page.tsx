"use client";

import { useState } from "react";
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
} from "lucide-react";
import { obtenerSesionLocal, PILOTO_INVITADO_FAPPE } from "@/lib/auth";
import type { PerfilUsuario } from "@/types/usuario";

export default function PaginaDashboardBoxes() {
  const [usuario] = useState<PerfilUsuario>(() => {
    const sesion = obtenerSesionLocal();
    return sesion ? sesion.usuario : PILOTO_INVITADO_FAPPE;
  });

  const metricas = usuario.rating.metricas;

  return (
    <div className="space-y-10 sm:space-y-12 max-w-7xl mx-auto pb-12">
      {/* Banner de Bienvenida y Diagnóstico Rápido */}
      <div className="card-cockpit-gradient border border-[#262626] rounded-none border-sheen p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl relative overflow-hidden bg-[#141414]">
        <div className="flex items-start gap-5">
          <div className="p-4 bg-[#1a1a1a] border border-[#3c3c3c] rounded-none text-white">
            <Gauge className="w-8 h-8 text-[#0066b1]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#0066b1]">
                Dashboard de Ingeniería de Pista
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#0fa336]/10 text-[#0fa336] border border-[#0fa336]/30 text-[10px] font-mono uppercase tracking-[0.18em] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0fa336] animate-pulse" />
                Win32 60Hz Telemetría OK
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white font-mono">
              Bienvenido, {usuario.nombre}
            </h1>
            <p className="text-sm text-[#bbbbbb] font-mono tracking-wide mt-2">
              Sesión activa en el Autodromo Nazionale Monza • Ferrari SF70H (Formula 1 2017)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <Link
            href="/app/analysis"
            className="w-full sm:w-auto h-12 px-8 rounded-none bg-[#0066b1] hover:bg-[#1c69d4] active:scale-[0.99] text-white font-mono font-bold text-xs tracking-[0.16em] uppercase flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <LineChart className="w-4 h-4 text-white" />
            Laboratorio Analítico 2D
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

      {/* Grid Central: Resumen de Tanda + Radar de Habilidades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Resumen de Última Tanda */}
        <div className="lg:col-span-2 card-cockpit-gradient border border-[#262626] rounded-none border-sheen p-8 sm:p-9 flex flex-col justify-between shadow-2xl bg-[#141414]">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-[#262626]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#0066b1] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#0066b1]" />
                  Última Tanda Registrada
                </span>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white font-mono mt-1">
                  Autodromo Nazionale Monza (Grand Prix)
                </h2>
              </div>
              <span className="text-xs font-mono font-bold tracking-[0.18em] text-white bg-[#1a1a1a] px-4 py-1.5 rounded-none border border-[#3c3c3c] uppercase">
                18 Vueltas
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 py-8">
              {/* Stat 1: Mejor Vuelta (Verde Éxito BMW M) */}
              <div className="bg-[#0d0d0d] border border-[#262626] border-t-2 border-t-[#0fa336] p-5 rounded-none">
                <div className="text-[10px] uppercase font-mono font-bold tracking-[0.18em] text-[#0fa336] flex items-center justify-between">
                  <span>Mejor Vuelta</span>
                  <span className="w-2 h-2 rounded-full bg-[#0fa336]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#0fa336] mt-2.5 tabular-nums">
                  01:21.240
                </div>
                <div className="text-[11px] font-mono text-[#7e7e7e] mt-1.5">Vuelta 3 • 256.4 km/h</div>
              </div>

              {/* Stat 2: Vuelta Óptima (BMW Blue) */}
              <div className="bg-[#0d0d0d] border border-[#262626] border-t-2 border-t-[#0066b1] p-5 rounded-none">
                <div className="text-[10px] uppercase font-mono font-bold tracking-[0.18em] text-[#0066b1] flex items-center justify-between">
                  <span>Vuelta Ideal</span>
                  <span className="w-2 h-2 rounded-full bg-[#0066b1]" />
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-2.5 tabular-nums">
                  01:20.810
                </div>
                <div className="text-[11px] font-mono text-[#0066b1] mt-1.5 font-bold">Delta: -0.430s</div>
              </div>

              {/* Stat 3: Top Speed */}
              <div className="bg-[#0d0d0d] border border-[#262626] border-t-2 border-t-[#1c69d4] p-5 rounded-none">
                <div className="text-[10px] uppercase font-mono font-bold tracking-[0.18em] text-[#bbbbbb] flex items-center justify-between">
                  <span>Top Speed</span>
                  <span className="w-2 h-2 rounded-full bg-[#1c69d4]" />
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-2.5 tabular-nums">
                  348.5 <span className="text-xs text-[#7e7e7e] font-sans">km/h</span>
                </div>
                <div className="text-[11px] font-mono text-[#7e7e7e] mt-1.5">Con DRS activo</div>
              </div>

              {/* Stat 4: Consistencia (Amarillo Warning BMW M) */}
              <div className="bg-[#0d0d0d] border border-[#262626] border-t-2 border-t-[#f4b400] p-5 rounded-none">
                <div className="text-[10px] uppercase font-mono font-bold tracking-[0.18em] text-[#f4b400] flex items-center justify-between">
                  <span>Consistencia</span>
                  <span className="w-2 h-2 rounded-full bg-[#f4b400]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#f4b400] mt-2.5 tabular-nums">
                  94.4%
                </div>
                <div className="text-[11px] font-mono text-[#7e7e7e] mt-1.5">17 vueltas válidas</div>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-[#262626] flex items-center justify-between text-xs font-mono">
            <span className="text-[#7e7e7e] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0066b1]" />
              Finalizada hoy 19:15 UTC • Ferrari SF70H V6 Turbo Híbrido
            </span>
            <Link
              href="/app/analysis"
              className="text-white hover:text-[#0066b1] font-bold uppercase tracking-[0.16em] text-xs flex items-center gap-2 transition-colors py-1.5 px-3 bg-[#1a1a1a] border border-[#3c3c3c]"
            >
              Inspeccionar Telemetría
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Radar de Habilidades del Piloto */}
        <div className="card-cockpit-gradient border border-[#262626] rounded-none border-sheen p-8 sm:p-9 flex flex-col justify-between shadow-2xl bg-[#141414]">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#e22718] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#e22718]" />
                  Evaluación de Conducción
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white font-mono mt-1">
                  Apex Rating {usuario.rating.paceRating}
                </h3>
              </div>
              <span className="text-xs font-bold font-mono tracking-[0.18em] px-3 py-1.5 rounded-none bg-[#e22718]/10 text-[#e22718] border border-[#e22718]/30 uppercase">
                Cat. {usuario.rating.safetyRating}
              </span>
            </div>

            <div className="py-6 space-y-5">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#bbbbbb] uppercase tracking-wider text-[11px] font-semibold">Velocidad Punta & Tracción</span>
                  <span className="text-white font-bold tabular-nums text-sm">{metricas.velocidad}%</span>
                </div>
                <div className="h-1.5 bg-[#0d0d0d] rounded-none overflow-hidden border border-[#262626]">
                  <div className="h-full bg-[#0066b1]" style={{ width: `${metricas.velocidad}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#bbbbbb] uppercase tracking-wider text-[11px] font-semibold">Potencia de Frenada</span>
                  <span className="text-white font-bold tabular-nums text-sm">{metricas.frenada}%</span>
                </div>
                <div className="h-1.5 bg-[#0d0d0d] rounded-none overflow-hidden border border-[#262626]">
                  <div className="h-full bg-[#e22718]" style={{ width: `${metricas.frenada}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#bbbbbb] uppercase tracking-wider text-[11px] font-semibold">Control de Chasis & G-Force</span>
                  <span className="text-white font-bold tabular-nums text-sm">{metricas.control}%</span>
                </div>
                <div className="h-1.5 bg-[#0d0d0d] rounded-none overflow-hidden border border-[#262626]">
                  <div className="h-full bg-[#1c69d4]" style={{ width: `${metricas.control}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#bbbbbb] uppercase tracking-wider text-[11px] font-semibold">Consistencia Vuelta a Vuelta</span>
                  <span className="text-white font-bold tabular-nums text-sm">{metricas.consistencia}%</span>
                </div>
                <div className="h-1.5 bg-[#0d0d0d] rounded-none overflow-hidden border border-[#262626]">
                  <div className="h-full bg-[#0fa336]" style={{ width: `${metricas.consistencia}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#262626] text-center">
            <span className="text-xs font-mono tracking-[0.14em] text-[#7e7e7e]">
              Rango de Piloto: <strong className="text-white uppercase font-bold text-sm tracking-[0.18em] ml-1 bg-[#1a1a1a] px-3 py-1 border border-[#3c3c3c]">{usuario.rating.nivel}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* AI Race Coach: Diagnóstico Heurístico de Telemetría */}
      <div className="card-cockpit-gradient border border-[#262626] rounded-none border-sheen p-8 sm:p-10 shadow-2xl bg-[#141414]">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3.5 rounded-none bg-[#1a1a1a] border border-[#3c3c3c] text-white">
            <Lightbulb className="w-6 h-6 text-[#f4b400]" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold uppercase tracking-[0.14em] text-white font-mono">
              AI Race Coach • Diagnóstico Automático de Telemetría
            </h3>
            <p className="text-xs font-mono text-[#7e7e7e] tracking-wider mt-1">
              Análisis algorítmico comparando tu vuelta rápida contra la vuelta ideal metro a metro
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-none bg-[#0d0d0d] border-l-4 border-l-[#0fa336] border-y border-r border-[#262626]">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0fa336] mb-3 font-mono">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Punto Fuerte: Variante Ascari (Curvas 8, 9 y 10)
            </div>
            <p className="text-xs sm:text-sm text-[#bbbbbb] leading-relaxed">
              Excelente aplicación progresiva del acelerador al salir de la curva 10. Tu velocidad a la salida es <strong className="text-[#0fa336] font-bold">+4.8 km/h superior</strong> al promedio de la sesión, lo que maximiza tu aceleración a lo largo de la recta de Serraglio.
            </p>
          </div>

          <div className="p-6 rounded-none bg-[#0d0d0d] border-l-4 border-l-[#e22718] border-y border-r border-[#262626]">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#e22718] mb-3 font-mono">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Oportunidad de Mejora: Variante del Rettifilo (Curva 1)
            </div>
            <p className="text-xs sm:text-sm text-[#bbbbbb] leading-relaxed">
              Frenada tardía y abrupta en los 150 metros. Mantienes el pedal de freno al 100% hasta el apex, induciendo subviraje. Aplicando un <strong className="text-[#e22718] font-bold">20% más de trail-braking</strong> podrás adelantar el vértice y ganar aproximadamente <strong className="text-white font-bold">~0.240 s</strong> en el Sector 1.
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard del Stand FAPPE 2026 */}
      <div className="card-cockpit-gradient border border-[#262626] rounded-none border-sheen p-8 sm:p-10 shadow-2xl bg-[#141414]">
        <div className="flex items-center justify-between pb-6 border-b border-[#262626] mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1a1a1a] border border-[#3c3c3c] text-white">
              <Trophy className="w-6 h-6 text-[#f4b400]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-[0.14em] text-white font-mono">
                Tabla de Récords Oficiales • Monza GP
              </h3>
              <p className="text-xs font-mono text-[#7e7e7e] tracking-wider mt-1">
                Registros en vivo marcados por pilotos en el simulador con telemetría en tiempo real
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold tracking-[0.18em] text-[#f4b400] bg-[#f4b400]/10 px-4 py-2 rounded-none border border-[#f4b400]/30 uppercase">
            Monza GP • SF70H
          </span>
        </div>

        <div className="divide-y divide-[#262626]">
          {/* Puesto 1 (Oro / Campeón) */}
          <div className="py-5 px-4 flex items-center justify-between border-l-4 border-l-[#f4b400] bg-[#0d0d0d] transition-all">
            <div className="flex items-center gap-4">
              <span className="text-base font-bold font-mono text-black bg-[#f4b400] w-8 h-8 flex items-center justify-center">01</span>
              <div>
                <div className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2.5">
                  <span>Alejo Garlati (Piloto Pro)</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-none bg-[#0066b1] text-white uppercase tracking-widest font-bold">
                    PB STAND
                  </span>
                </div>
                <div className="text-xs font-mono text-[#7e7e7e] mt-1">Ferrari SF70H • P.B. Oficial</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-lg font-bold text-[#0fa336] tabular-nums">01:21.240</div>
              <div className="text-[10px] uppercase tracking-wider text-[#0066b1] font-bold">Récord de Pista</div>
            </div>
          </div>

          {/* Puesto 2 (Plata) */}
          <div className="py-5 px-4 flex items-center justify-between border-l-4 border-l-[#bbbbbb] bg-[#141414] transition-all">
            <div className="flex items-center gap-4">
              <span className="text-base font-bold font-mono text-black bg-[#bbbbbb] w-8 h-8 flex items-center justify-center">02</span>
              <div>
                <div className="text-sm font-bold uppercase tracking-wider text-white">Martin Basso (Sim Pro)</div>
                <div className="text-xs font-mono text-[#7e7e7e] mt-1">Ferrari SF70H • Ronda 2</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-lg font-bold text-white tabular-nums">01:22.450</div>
              <div className="text-xs text-[#e22718] tabular-nums font-bold">+1.210 s</div>
            </div>
          </div>

          {/* Puesto 3 (Bronce / BMW Blue) */}
          <div className="py-5 px-4 flex items-center justify-between border-l-4 border-l-[#1c69d4] bg-[#141414] transition-all">
            <div className="flex items-center gap-4">
              <span className="text-base font-bold font-mono text-white bg-[#1c69d4] w-8 h-8 flex items-center justify-center">03</span>
              <div>
                <div className="text-sm font-bold uppercase tracking-wider text-white">Lucas Di Grassi (GT3)</div>
                <div className="text-xs font-mono text-[#7e7e7e] mt-1">Ferrari SF70H • Ronda 1</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-lg font-bold text-white tabular-nums">01:24.110</div>
              <div className="text-xs text-[#e22718] tabular-nums font-bold">+2.870 s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
