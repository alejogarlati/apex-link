import Link from "next/link";
import { ArrowRight, Trophy, Clock, Gauge, Car, Database } from "lucide-react";

export default function PaginaSesiones() {
  const sesiones = [
    {
      id: "sesion-monza-sf70h",
      circuito: "Autodromo Nazionale Monza",
      configuracion: "Grand Prix (5.793 m)",
      fecha: "31 Oct 2026 • 19:15 UTC",
      auto: "Ferrari SF70H (F1)",
      mejorVuelta: "01:21.240",
      totalVueltas: 18,
      vueltasValidas: 17,
      topSpeed: "348.5 km/h",
      chipText: "Monza GP • Formula 1",
    },
    {
      id: "sesion-monza-gt3",
      circuito: "Autodromo Nazionale Monza",
      configuracion: "Grand Prix (5.793 m)",
      fecha: "29 Oct 2026 • 16:40 UTC",
      auto: "Ferrari 488 GT3",
      mejorVuelta: "01:47.382",
      totalVueltas: 8,
      vueltasValidas: 8,
      topSpeed: "282.1 km/h",
      chipText: "Monza GP • FIA GT3",
    },
    {
      id: "sesion-spa-m2",
      circuito: "Circuit de Spa-Francorchamps",
      configuracion: "Grand Prix (7.004 m)",
      fecha: "26 Oct 2026 • 18:20 UTC",
      auto: "BMW M2 CS Racing",
      mejorVuelta: "02:34.190",
      totalVueltas: 12,
      vueltasValidas: 11,
      topSpeed: "244.3 km/h",
      chipText: "Spa Francorchamps • Cup",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Encabezado Principal */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#262626] pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0066b1]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#0066b1]">
              Registro Histórico de Telemetría • SQLite WAL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-mono">
            Historial de Sesiones & Tandas Registradas
          </h1>
          <p className="text-xs sm:text-sm text-[#bbbbbb] font-mono tracking-wide mt-1">
            Tandas de telemetría capturadas desde Assetto Corsa persistidas con muestreo a 60 Hz.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="border border-[#262626] bg-[#141414] px-4 py-2 text-xs font-mono font-bold tracking-[0.15em] text-[#bbbbbb] uppercase rounded-none flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#0066b1]" />
            3 Tandas Persistidas
          </span>
        </div>
      </div>

      {/* Lista de Sesiones (Formato Fila Horizontal Estilo Hub sin Imagen de Fondo) */}
      <div className="flex flex-col gap-4">
        {sesiones.map((sesion) => (
          <div
            key={sesion.id}
            className="group relative w-full rounded-none border border-[#262626] bg-[#141414] hover:border-[#3c3c3c] transition-all duration-200 overflow-hidden"
          >
            {/* Franja M en borde izquierdo */}
            <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col group-hover:w-1.5 transition-all">
              <div className="h-1/3 bg-[#0066b1]" />
              <div className="h-1/3 bg-[#1c69d4]" />
              <div className="h-1/3 bg-[#e22718]" />
            </div>

            <div className="p-6 sm:p-7 pl-6 sm:pl-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Información Principal de la Sesión */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-none bg-[#0066b1]/15 text-[#0066b1] border border-[#0066b1]/40">
                    {sesion.chipText}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#bbbbbb] bg-[#0d0d0d] px-2.5 py-0.5 border border-[#262626]">
                    {sesion.fecha}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white font-mono group-hover:text-white transition-colors">
                    {sesion.circuito}
                  </h2>
                  <p className="text-xs text-[#7e7e7e] font-mono mt-1">
                    {sesion.configuracion} • Vehículo: <span className="text-white font-bold">{sesion.auto}</span>
                  </p>
                </div>
              </div>

              {/* Métricas Técnicas en Fila */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 py-2 lg:py-0 border-y lg:border-y-0 border-[#262626] text-xs font-mono">
                <div className="bg-[#0d0d0d] border border-[#262626] px-4 py-2.5">
                  <span className="text-[10px] uppercase text-[#7e7e7e] block">Mejor Vuelta</span>
                  <span className="font-bold text-[#0fa336] text-sm sm:text-base tabular-nums">{sesion.mejorVuelta}</span>
                </div>
                <div className="bg-[#0d0d0d] border border-[#262626] px-4 py-2.5">
                  <span className="text-[10px] uppercase text-[#7e7e7e] block">Vueltas</span>
                  <span className="font-bold text-white text-sm sm:text-base">{sesion.totalVueltas} ({sesion.vueltasValidas} válidas)</span>
                </div>
                <div className="bg-[#0d0d0d] border border-[#262626] px-4 py-2.5 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase text-[#7e7e7e] block">Top Speed</span>
                  <span className="font-bold text-white text-sm sm:text-base">{sesion.topSpeed}</span>
                </div>
              </div>

              {/* Botón de Acción a la Derecha */}
              <div className="shrink-0">
                <Link
                  href="/app/analysis"
                  className="w-full lg:w-auto px-6 py-3.5 rounded-none font-mono font-bold uppercase tracking-[0.15em] text-xs bg-[#1a1a1a] hover:bg-[#0066b1] text-white border border-[#3c3c3c] hover:border-[#0066b1] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Cargar en Laboratorio 2D</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
