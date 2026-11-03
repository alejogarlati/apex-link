import { Trophy } from "lucide-react";

export default function PaginaLeaderboards() {
  const ranking = [
    { posicion: 1, piloto: "Alejo Garlati (Dev 3)", tiempo: "01:21.240", delta: "Ref", auto: "Ferrari SF70H", vueltas: 18 },
    { posicion: 2, piloto: "Prof. Evaluador FAPPE", tiempo: "01:22.450", delta: "+1.210 s", auto: "Ferrari SF70H", vueltas: 8 },
    { posicion: 3, piloto: "Estudiante Ing. UTN", tiempo: "01:24.110", delta: "+2.870 s", auto: "Ferrari SF70H", vueltas: 14 },
    { posicion: 4, piloto: "Piloto Visitante Stand 4", tiempo: "01:25.890", delta: "+4.650 s", auto: "Ferrari SF70H", vueltas: 6 },
    { posicion: 5, piloto: "Invitado Demo FAPPE", tiempo: "01:27.420", delta: "+6.180 s", auto: "Ferrari SF70H", vueltas: 5 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#262626] pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#0066b1]" />
          <h1 className="text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
            Leaderboard Oficial • Stand FAPPE 2026
          </h1>
        </div>
        <p className="mt-1 text-xs text-[#bbbbbb]">
          Tiempos registrados en el simulador durante la feria. Autodromo Nazionale Monza • Ferrari SF70H.
        </p>
      </div>

      <div className="border border-[#3c3c3c] bg-[#1a1a1a] rounded-lg overflow-hidden">
        <div className="p-4 bg-[#0d0d0d] border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#f4b400]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Clasificación General del Stand
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0fa336]/15 text-[#0fa336] border border-[#0fa336]/30">
            Actualización en Vivo
          </span>
        </div>

        <div className="divide-y divide-[#262626]">
          {ranking.map((item) => (
            <div
              key={item.posicion}
              className={`p-4 flex items-center justify-between transition-colors ${
                item.posicion === 1 ? "bg-[#0066b1]/10" : "hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-xs ${
                    item.posicion === 1
                      ? "bg-[#f4b400] text-black"
                      : item.posicion === 2
                      ? "bg-[#bbbbbb] text-black"
                      : item.posicion === 3
                      ? "bg-[#e22718] text-white"
                      : "bg-[#262626] text-[#7e7e7e]"
                  }`}
                >
                  {item.posicion}
                </span>

                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {item.piloto}
                    {item.posicion === 1 && (
                      <span className="text-[9px] bg-[#0066b1] text-white font-mono px-1.5 py-0.5 rounded uppercase">
                        PB Stand
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#7e7e7e] font-mono">
                    {item.auto} • {item.vueltas} vueltas rodadas
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-base font-bold text-[#0fa336]">{item.tiempo}</div>
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
