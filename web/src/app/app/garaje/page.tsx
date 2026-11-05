import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PaginaGaraje() {
  const vehiculos = [
    {
      id: "sf70h",
      nombre: "Ferrari SF70H (F1 2017)",
      clase: "Formula 1 Hybrid",
      potencia: "950 CV",
      maxRpm: 15000,
      peso: "728 kg",
      traccion: "RWD",
      vueltasTotales: 142,
      kilometros: 822.7,
      motor: "1.6L V6 Turbo + MGU-K / MGU-H",
      estado: "Calibración Activa",
    },
    {
      id: "488gt3",
      nombre: "Ferrari 488 GT3",
      clase: "FIA GT3 Pro",
      potencia: "600 CV",
      maxRpm: 7500,
      peso: "1260 kg",
      traccion: "RWD",
      vueltasTotales: 28,
      kilometros: 162.2,
      motor: "3.9L V8 Twin-Turbo",
      estado: "Calibración Activa",
    },
    {
      id: "m2cs",
      nombre: "BMW M2 CS Racing",
      clase: "Touring / Cup",
      potencia: "450 CV",
      maxRpm: 7600,
      peso: "1400 kg",
      traccion: "RWD",
      vueltasTotales: 16,
      kilometros: 92.6,
      motor: "3.0L S55 TwinPower Turbo",
      estado: "Calibración Activa",
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
              Monoplazas & GTs Calibrados • Telemetría de Boxes
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-mono">
            Garaje Virtual & Odómetro de Monoplazas
          </h1>
          <p className="text-xs sm:text-sm text-[#bbbbbb] font-mono tracking-wide mt-1">
            Vehículos con perfil telemétrico configurado para adquisición Win32 y dinámica de suspensiones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="border border-[#262626] bg-[#141414] px-4 py-2 text-xs font-mono font-bold tracking-[0.15em] text-[#bbbbbb] uppercase rounded-none">
            3 Vehículos en Servicio
          </span>
        </div>
      </div>

      {/* Lista de Autos (Formato Fila Horizontal Estilo Hub sin Imagen de Fondo) */}
      <div className="flex flex-col gap-4">
        {vehiculos.map((auto) => (
          <div
            key={auto.id}
            className="group relative w-full rounded-none border border-[#262626] bg-[#141414] hover:border-[#3c3c3c] transition-all duration-200 overflow-hidden"
          >
            {/* Franja M en borde izquierdo */}
            <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col group-hover:w-1.5 transition-all">
              <div className="h-1/3 bg-[#0066b1]" />
              <div className="h-1/3 bg-[#1c69d4]" />
              <div className="h-1/3 bg-[#e22718]" />
            </div>

            <div className="p-6 sm:p-7 pl-6 sm:pl-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Información Principal del Monoplaza */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-none bg-[#0066b1]/15 text-[#0066b1] border border-[#0066b1]/40">
                    {auto.clase}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#bbbbbb] bg-[#0d0d0d] px-2.5 py-0.5 border border-[#262626]">
                    Tracción {auto.traccion}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#0fa336]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0fa336]" />
                    {auto.estado}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white font-mono group-hover:text-white transition-colors">
                    {auto.nombre}
                  </h2>
                  <p className="text-xs text-[#7e7e7e] font-mono mt-1">
                    Motor: {auto.motor} • {auto.vueltasTotales} vueltas computadas en boxes
                  </p>
                </div>
              </div>

              {/* Métricas Técnicas en Fila */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-2 lg:py-0 border-y lg:border-y-0 border-[#262626] text-xs font-mono">
                <div className="bg-[#0d0d0d] border border-[#262626] px-4 py-2.5">
                  <span className="text-[10px] uppercase text-[#7e7e7e] block">Potencia</span>
                  <span className="font-bold text-white text-sm sm:text-base">{auto.potencia}</span>
                </div>
                <div className="bg-[#0d0d0d] border border-[#262626] px-4 py-2.5">
                  <span className="text-[10px] uppercase text-[#7e7e7e] block">Corte RPM</span>
                  <span className="font-bold text-[#e22718] text-sm sm:text-base tabular-nums">{auto.maxRpm.toLocaleString()}</span>
                </div>
                <div className="bg-[#0d0d0d] border border-[#262626] px-4 py-2.5">
                  <span className="text-[10px] uppercase text-[#7e7e7e] block">Peso Vacío</span>
                  <span className="font-bold text-white text-sm sm:text-base">{auto.peso}</span>
                </div>
                <div className="bg-[#0d0d0d] border border-[#262626] px-4 py-2.5">
                  <span className="text-[10px] uppercase text-[#7e7e7e] block">Odómetro</span>
                  <span className="font-bold text-[#0fa336] text-sm sm:text-base tabular-nums">{auto.kilometros} km</span>
                </div>
              </div>

              {/* Botón de Acción a la Derecha */}
              <div className="shrink-0">
                <Link
                  href="/app/analysis"
                  className="w-full lg:w-auto px-6 py-3.5 rounded-none font-mono font-bold uppercase tracking-[0.15em] text-xs bg-[#1a1a1a] hover:bg-[#0066b1] text-white border border-[#3c3c3c] hover:border-[#0066b1] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Ver Telemetría en Pista</span>
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
