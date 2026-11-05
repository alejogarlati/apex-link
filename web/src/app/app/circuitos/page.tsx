import Link from "next/link";
import { ArrowRight, Flag, MapPin } from "lucide-react";

export default function PaginaCircuitos() {
  const circuitos = [
    {
      id: "monza",
      nombre: "Autodromo Nazionale Monza",
      pais: "Italia [ITA]",
      longitudMetros: 5793,
      curvas: 11,
      recordStand: "01:21.240",
      pilotoRecord: "Alejo Garlati (Ferrari SF70H)",
      activo: true,
      zonasDrs: 2,
      estadoTexto: "Circuito Activo • GPS 2D",
    },
    {
      id: "spa",
      nombre: "Circuit de Spa-Francorchamps",
      pais: "Bélgica [BEL]",
      longitudMetros: 7004,
      curvas: 19,
      recordStand: "01:42.550",
      pilotoRecord: "Ferrari SF70H Stand",
      activo: false,
      zonasDrs: 2,
      estadoTexto: "Próximamente • En Mapeo",
    },
    {
      id: "redbullring",
      nombre: "Red Bull Ring (Spielberg)",
      pais: "Austria [AUT]",
      longitudMetros: 4318,
      curvas: 10,
      recordStand: "01:05.410",
      pilotoRecord: "Ferrari SF70H Stand",
      activo: false,
      zonasDrs: 3,
      estadoTexto: "Fase 2 • Escaneo Láser",
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
              Base de Datos Oficial de Pistas • FIA & Laser Scan
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-mono">
            Catálogo de Circuitos & Tiempos Récord
          </h1>
          <p className="text-xs sm:text-sm text-[#bbbbbb] font-mono tracking-wide mt-1">
            Pistas digitalizadas con telemetría metro a metro sincronizada con física de neumáticos y corte de vértices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="border border-[#262626] bg-[#141414] px-4 py-2 text-xs font-mono font-bold tracking-[0.15em] text-[#bbbbbb] uppercase rounded-none">
            3 Circuitos Registrados
          </span>
        </div>
      </div>

      {/* Lista de Circuitos (Formato Fila Horizontal Estilo Hub sin Imagen de Fondo) */}
      <div className="flex flex-col gap-4">
        {circuitos.map((pista) => (
          <div
            key={pista.id}
            className={`group relative w-full rounded-none border transition-all duration-200 overflow-hidden ${
              pista.activo
                ? "border-[#262626] bg-[#141414] hover:border-[#3c3c3c]"
                : "border-[#262626] bg-[#0d0d0d] opacity-75 hover:opacity-90"
            }`}
          >
            {/* Franja M en borde izquierdo */}
            <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col group-hover:w-1.5 transition-all">
              <div className="h-1/3 bg-[#0066b1]" />
              <div className="h-1/3 bg-[#1c69d4]" />
              <div className="h-1/3 bg-[#e22718]" />
            </div>

            <div className="p-6 sm:p-7 pl-6 sm:pl-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Información Principal del Circuito */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#bbbbbb] bg-[#0d0d0d] px-2.5 py-0.5 border border-[#262626]">
                    {pista.pais}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 border ${
                      pista.activo
                        ? "bg-[#0fa336]/10 text-[#0fa336] border-[#0fa336]/30"
                        : "bg-[#141414] text-[#7e7e7e] border-[#262626]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        pista.activo ? "bg-[#0fa336] animate-pulse" : "bg-[#7e7e7e]"
                      }`}
                    />
                    {pista.estadoTexto}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white font-mono group-hover:text-white transition-colors">
                    {pista.nombre}
                  </h2>
                  <p className="text-xs text-[#7e7e7e] font-mono mt-1">
                    Configuración Grand Prix Oficial • Escaneo Láser de Vértices
                  </p>
                </div>
              </div>

              {/* Métricas Técnicas en Fila */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-2 lg:py-0 border-y lg:border-y-0 border-[#262626] text-xs font-mono">
                <div className="bg-[#0d0d0d] border border-[#262626] px-4 py-2.5">
                  <span className="text-[10px] uppercase text-[#7e7e7e] block">Longitud</span>
                  <span className="font-bold text-white text-sm sm:text-base">{pista.longitudMetros} m</span>
                </div>
                <div className="bg-[#0d0d0d] border border-[#262626] px-4 py-2.5">
                  <span className="text-[10px] uppercase text-[#7e7e7e] block">Curvas</span>
                  <span className="font-bold text-white text-sm sm:text-base">{pista.curvas} vértices</span>
                </div>
                <div className="bg-[#0d0d0d] border border-[#262626] px-4 py-2.5">
                  <span className="text-[10px] uppercase text-[#7e7e7e] block">Zonas DRS</span>
                  <span className="font-bold text-white text-sm sm:text-base">{pista.zonasDrs} sectores</span>
                </div>
                <div className="bg-[#0d0d0d] border border-[#262626] px-4 py-2.5">
                  <span className="text-[10px] uppercase text-[#7e7e7e] block">Récord Pista</span>
                  <span className={`font-bold text-sm sm:text-base tabular-nums ${pista.activo ? "text-[#0fa336]" : "text-[#bbbbbb]"}`}>
                    {pista.recordStand}
                  </span>
                </div>
              </div>

              {/* Botón de Acción a la Derecha */}
              <div className="shrink-0">
                {pista.activo ? (
                  <Link
                    href="/app/analysis"
                    className="w-full lg:w-auto px-6 py-3.5 rounded-none font-mono font-bold uppercase tracking-[0.15em] text-xs bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <span>Abrir Laboratorio 2D</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full lg:w-auto px-6 py-3.5 rounded-none font-mono font-bold uppercase tracking-[0.15em] text-xs bg-[#141414] border border-[#262626] text-[#666666] flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <span>Mapeo en Fase 2</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
