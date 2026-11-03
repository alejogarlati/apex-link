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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner de Bienvenida y Diagnóstico Rápido */}
      <div className="bg-[#1a1a1a] border border-[#3c3c3c] rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-black border border-[#3c3c3c] rounded-lg text-[#0066b1]">
            <Gauge className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0066b1]">
                Dashboard de Ingeniería de Pista
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0fa336]/15 text-[#0fa336] border border-[#0fa336]/30">
                Enlace Win32 Activo
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-1">
              Bienvenido, {usuario.nombre}
            </h1>
            <p className="text-xs sm:text-sm text-[#bbbbbb] mt-0.5">
              Sesión activa en el Autodromo Nazionale Monza • Ferrari SF70H (F1)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            href="/app/analysis"
            className="w-full sm:w-auto px-5 py-2.5 rounded font-bold uppercase tracking-wider text-xs bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all shadow-lg shadow-[#0066b1]/20 flex items-center justify-center gap-2 cursor-pointer"
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
        <div className="lg:col-span-2 bg-[#1a1a1a] border border-[#3c3c3c] rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e7e7e]">
                  Última Tanda Registrada
                </span>
                <h2 className="text-lg font-bold uppercase text-white">
                  Autodromo Nazionale Monza (Grand Prix)
                </h2>
              </div>
              <span className="text-xs font-mono text-[#0066b1] bg-[#0066b1]/10 px-2.5 py-1 rounded border border-[#0066b1]/30">
                18 Vueltas
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
              <div className="bg-black/50 border border-[#262626] p-3.5 rounded">
                <div className="text-[10px] uppercase font-bold text-[#7e7e7e]">Mejor Vuelta (PB)</div>
                <div className="text-xl font-bold font-mono text-[#0fa336] mt-1">
                  01:21.240
                </div>
                <div className="text-[10px] text-[#7e7e7e] mt-0.5">Vuelta 3 • 256.4 km/h avg</div>
              </div>

              <div className="bg-black/50 border border-[#262626] p-3.5 rounded">
                <div className="text-[10px] uppercase font-bold text-[#7e7e7e]">Vuelta Óptima (Ideal)</div>
                <div className="text-xl font-bold font-mono text-[#0066b1] mt-1">
                  01:20.810
                </div>
                <div className="text-[10px] text-[#0066b1] mt-0.5">Delta potencial: -0.430s</div>
              </div>

              <div className="bg-black/50 border border-[#262626] p-3.5 rounded">
                <div className="text-[10px] uppercase font-bold text-[#7e7e7e]">Top Speed (Rettifilo)</div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  348.5 <span className="text-xs text-[#7e7e7e]">km/h</span>
                </div>
                <div className="text-[10px] text-[#7e7e7e] mt-0.5">Con DRS activo</div>
              </div>

              <div className="bg-black/50 border border-[#262626] p-3.5 rounded">
                <div className="text-[10px] uppercase font-bold text-[#7e7e7e]">Consistencia</div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  94.4%
                </div>
                <div className="text-[10px] text-[#0fa336] mt-0.5">17 vueltas válidas</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#262626] flex items-center justify-between text-xs">
            <span className="text-[#bbbbbb] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7e7e7e]" />
              Finalizada hoy a las 19:15 UTC • Motor Ferrari SF70H V6 Turbo
            </span>
            <Link
              href="/app/analysis"
              className="text-[#0066b1] hover:underline font-bold uppercase text-[11px] flex items-center gap-1"
            >
              Inspeccionar Telemetría
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Radar de Habilidades del Piloto */}
        <div className="bg-[#1a1a1a] border border-[#3c3c3c] rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e7e7e]">
                  Evaluación de Conducción
                </span>
                <h3 className="text-lg font-bold uppercase text-white">
                  Apex Rating {usuario.rating.paceRating}
                </h3>
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#e22718]/15 text-[#e22718] border border-[#e22718]/30">
                Cat. {usuario.rating.safetyRating}
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[#bbbbbb]">Velocidad Punta & Tracción</span>
                  <span className="text-white font-bold">{metricas.velocidad}%</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-[#0066b1]" style={{ width: `${metricas.velocidad}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[#bbbbbb]">Potencia de Frenada</span>
                  <span className="text-white font-bold">{metricas.frenada}%</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-[#e22718]" style={{ width: `${metricas.frenada}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[#bbbbbb]">Control de Chasis & G-Force</span>
                  <span className="text-white font-bold">{metricas.control}%</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-[#1c69d4]" style={{ width: `${metricas.control}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[#bbbbbb]">Consistencia Vuelta a Vuelta</span>
                  <span className="text-white font-bold">{metricas.consistencia}%</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-[#0fa336]" style={{ width: `${metricas.consistencia}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#262626] text-center">
            <span className="text-[11px] text-[#7e7e7e]">
              Rango de Piloto: <strong className="text-white">{usuario.rating.nivel}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* AI Race Coach: Diagnóstico Heurístico de Telemetría */}
      <div className="bg-[#1a1a1a] border border-[#3c3c3c] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded bg-black border border-[#3c3c3c] text-[#f4b400]">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold uppercase tracking-tight text-white">
              AI Race Coach • Diagnóstico Automático de Telemetría
            </h3>
            <p className="text-xs text-[#7e7e7e]">
              Análisis algorítmico comparando tu vuelta rápida contra la vuelta ideal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded bg-black/60 border border-[#0fa336]/30">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#0fa336] mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Punto Fuerte: Variante Ascari (Curvas 8, 9 y 10)
            </div>
            <p className="text-xs text-[#bbbbbb] leading-relaxed">
              Excelente aplicación progresiva del acelerador al salir de la curva 10. Tu velocidad a la salida es <strong>+4.8 km/h superior</strong> al promedio de la sesión, lo que maximiza tu aceleración a lo largo de la recta de Serraglio.
            </p>
          </div>

          <div className="p-4 rounded bg-black/60 border border-[#e22718]/30">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#e22718] mb-1.5">
              <AlertTriangle className="w-4 h-4" />
              Oportunidad de Mejora: Variante del Rettifilo (Curva 1)
            </div>
            <p className="text-xs text-[#bbbbbb] leading-relaxed">
              Frenada tardía y abrupta en los 150 metros. Mantienes el pedal de freno al 100% hasta el apex, induciendo subviraje. Aplicando un <strong>20% más de trail-braking</strong> podrás adelantar el vértice y ganar aproximadamente <strong>~0.240 s</strong> en el Sector 1.
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard del Stand FAPPE 2026 */}
      <div className="bg-[#1a1a1a] border border-[#3c3c3c] rounded-lg p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-4">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-[#f4b400]" />
            <div>
              <h3 className="text-base font-bold uppercase tracking-tight text-white">
                Tabla de Récords Oficiales • Monza GP
              </h3>
              <p className="text-xs text-[#7e7e7e]">
                Registros en vivo marcados por pilotos en el simulador con telemetría en tiempo real
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#bbbbbb] bg-black px-3 py-1 rounded border border-[#262626]">
            Monza GP • SF70H
          </span>
        </div>

        <div className="divide-y divide-[#262626]">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold font-mono text-[#f4b400] w-6">01</span>
              <div>
                <div className="text-xs font-bold text-white">Alejo Garlati (Piloto Pro)</div>
                <div className="text-[10px] text-[#7e7e7e]">Ferrari SF70H • P.B. Oficial</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold font-mono text-[#0fa336]">01:21.240</div>
              <div className="text-[10px] text-[#7e7e7e]">Récord de Pista</div>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold font-mono text-[#bbbbbb] w-6">02</span>
              <div>
                <div className="text-xs font-bold text-white">Martin Basso (Sim Pro)</div>
                <div className="text-[10px] text-[#7e7e7e]">Ferrari SF70H • Ronda 2</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold font-mono text-white">01:22.450</div>
              <div className="text-[10px] text-[#e22718] font-mono">+1.210 s</div>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold font-mono text-[#e22718] w-6">03</span>
              <div>
                <div className="text-xs font-bold text-white">Lucas Di Grassi (GT3)</div>
                <div className="text-[10px] text-[#7e7e7e]">Ferrari SF70H • Ronda 1</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold font-mono text-white">01:24.110</div>
              <div className="text-[10px] text-[#e22718] font-mono">+2.870 s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
