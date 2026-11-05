import { Trophy, Zap } from "lucide-react";

export default function PaginaLeaderboards() {
  const ranking = [
    {
      posicion: 1,
      piloto: "Alejo Garlati",
      rango: "Piloto Pro (Stand)",
      tiempo: "01:21.240",
      delta: "Referencia",
      auto: "Ferrari SF70H (F1)",
      vueltas: 18,
      s1: "26.410",
      s2: "27.180",
      s3: "27.650",
      topSpeed: "348.5 km/h",
    },
    {
      posicion: 2,
      piloto: "Martin Basso",
      rango: "Sim Pro Driver",
      tiempo: "01:22.450",
      delta: "+1.210 s",
      auto: "Ferrari SF70H (F1)",
      vueltas: 8,
      s1: "26.890",
      s2: "27.490",
      s3: "28.070",
      topSpeed: "344.2 km/h",
    },
    {
      posicion: 3,
      piloto: "Lucas Di Grassi",
      rango: "FIA Sim Series",
      tiempo: "01:24.110",
      delta: "+2.870 s",
      auto: "Ferrari SF70H (F1)",
      vueltas: 14,
      s1: "27.350",
      s2: "28.020",
      s3: "28.740",
      topSpeed: "341.0 km/h",
    },
    {
      posicion: 4,
      piloto: "Franco Colapinto",
      rango: "Academy Driver",
      tiempo: "01:25.890",
      delta: "+4.650 s",
      auto: "Ferrari SF70H (F1)",
      vueltas: 6,
      s1: "27.910",
      s2: "28.610",
      s3: "29.370",
      topSpeed: "338.4 km/h",
    },
    {
      posicion: 5,
      piloto: "Piloto Invitado",
      rango: "Demo Session",
      tiempo: "01:27.420",
      delta: "+6.180 s",
      auto: "Ferrari SF70H (F1)",
      vueltas: 5,
      s1: "28.450",
      s2: "29.120",
      s3: "29.850",
      topSpeed: "335.0 km/h",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Encabezado Principal */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#262626] pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f4b400]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#f4b400]">
              Ranking Oficial de Clasificación • Monza GP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-mono">
            Tabla de Récords y Clasificación Oficial
          </h1>
          <p className="text-xs sm:text-sm text-[#bbbbbb] font-mono tracking-wide mt-1">
            Tiempos registrados en el simulador con telemetría en tiempo real. Autodromo Nazionale Monza • Ferrari SF70H.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 border border-[#0fa336]/30 bg-[#0fa336]/10 px-4 py-2 text-xs font-mono font-bold tracking-[0.18em] text-[#0fa336] uppercase rounded-none">
            <span className="w-2 h-2 rounded-full bg-[#0fa336] animate-pulse" />
            Actualización en Tiempo Real
          </span>
        </div>
      </div>

      {/* Contenedor Principal de la Tabla */}
      <div className="card-cockpit-gradient border border-[#262626] rounded-none border-sheen overflow-hidden shadow-2xl bg-[#141414]">
        <div className="p-6 bg-[#0a0a0a] border-b border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-[#f4b400]" />
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-white font-mono block">
                Clasificación General Oficial • Gran Premio de Italia
              </span>
              <span className="text-xs text-[#7e7e7e] font-mono">
                Autodromo Nazionale Monza • Trazada 5.793 m
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#bbbbbb] bg-[#141414] border border-[#3c3c3c] px-3.5 py-1.5 self-start sm:self-auto">
            5 Mejores Registros
          </span>
        </div>

        <div className="divide-y divide-[#262626]">
          {ranking.map((item) => {
            const esP1 = item.posicion === 1;
            const esP2 = item.posicion === 2;
            const esP3 = item.posicion === 3;

            return (
              <div
                key={item.posicion}
                className={`p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all ${
                  esP1
                    ? "bg-[#0d0d0d] border-l-4 border-l-[#f4b400]"
                    : esP2
                    ? "bg-[#141414] border-l-4 border-l-[#bbbbbb]"
                    : esP3
                    ? "bg-[#141414] border-l-4 border-l-[#1c69d4]"
                    : "hover:bg-white/[0.02] border-l-4 border-l-transparent"
                }`}
              >
                {/* Piloto e Información */}
                <div className="flex items-start sm:items-center gap-5">
                  <span
                    className={`w-10 h-10 shrink-0 rounded-none flex items-center justify-center font-mono font-bold text-sm ${
                      esP1
                        ? "bg-[#f4b400] text-black"
                        : esP2
                        ? "bg-[#bbbbbb] text-black"
                        : esP3
                        ? "bg-[#1c69d4] text-white"
                        : "bg-[#141414] text-[#7e7e7e] border border-[#3c3c3c]"
                    }`}
                  >
                    P{item.posicion}
                  </span>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide font-mono">
                        {item.piloto}
                      </h3>
                      {esP1 && (
                        <span className="text-[10px] bg-[#0066b1] text-white font-mono font-bold px-2.5 py-0.5 rounded-none uppercase tracking-[0.18em]">
                          PB Stand
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-[#bbbbbb] uppercase bg-[#141414] border border-[#262626] px-2 py-0.5">
                        {item.rango}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#7e7e7e] font-mono pt-1">
                      <span className="text-[#bbbbbb] font-bold">{item.auto}</span>
                      <span>•</span>
                      <span>{item.vueltas} vueltas rodadas</span>
                      <span>•</span>
                      <span className="text-[#0066b1] flex items-center gap-1 font-bold">
                        <Zap className="w-3 h-3" />
                        {item.topSpeed}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tiempos de Vuelta & Delta */}
                <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center font-mono pt-2 sm:pt-0 border-t sm:border-t-0 border-[#262626]">
                  <div className="text-xl sm:text-2xl font-bold text-[#0fa336] tabular-nums">
                    {item.tiempo}
                  </div>
                  <div
                    className={`text-xs font-bold tabular-nums mt-1 ${
                      item.delta === "Referencia"
                        ? "text-[#0066b1] uppercase tracking-wider"
                        : "text-[#e22718]"
                    }`}
                  >
                    {item.delta}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
