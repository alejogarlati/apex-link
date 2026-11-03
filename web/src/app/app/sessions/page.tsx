import Link from "next/link";
import { Trophy, Car, ArrowRight, Gauge, Clock } from "lucide-react";

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
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col justify-between gap-4 border-b border-[#262626] pb-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#0066b1]" />
            <h1 className="text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
              Historial de Sesiones & Tandas Registradas
            </h1>
          </div>
          <p className="mt-1 text-xs text-[#bbbbbb]">
            Tandas de telemetría capturadas desde Assetto Corsa persistidas en SQLite WAL.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sesiones.map((sesion) => (
          <div
            key={sesion.id}
            className="border border-[#3c3c3c] bg-[#1a1a1a] rounded-lg p-6 flex flex-col justify-between hover:border-[#0066b1] transition-all group"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="border border-[#0066b1]/40 bg-[#0066b1]/15 px-2.5 py-1 text-[10px] font-bold tracking-widest text-[#0066b1] uppercase rounded">
                  {sesion.circuito.split(" ")[0]} GP
                </span>
                <span className="text-xs text-[#7e7e7e] font-mono">{sesion.fecha}</span>
              </div>

              <h3 className="text-base font-bold text-white uppercase mb-1">
                {sesion.circuito}
              </h3>
              <p className="text-xs text-[#7e7e7e] font-mono mb-4">{sesion.configuracion}</p>

              <div className="space-y-2.5 border-y border-[#262626] py-4 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#bbbbbb]">
                    <Car className="h-4 w-4 text-[#7e7e7e]" />
                    Vehículo:
                  </span>
                  <span className="font-semibold text-white">{sesion.auto}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#bbbbbb]">
                    <Trophy className="h-4 w-4 text-[#f4b400]" />
                    Mejor Vuelta:
                  </span>
                  <span className="font-bold text-[#0fa336]">{sesion.mejorVuelta}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#bbbbbb]">
                    <Clock className="h-4 w-4 text-[#7e7e7e]" />
                    Vueltas:
                  </span>
                  <span className="text-white">
                    {sesion.totalVueltas} ({sesion.vueltasValidas} válidas)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#bbbbbb]">
                    <Gauge className="h-4 w-4 text-[#7e7e7e]" />
                    Top Speed:
                  </span>
                  <span className="text-white">{sesion.topSpeed}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/app/analysis"
                className="w-full py-2.5 rounded font-bold uppercase tracking-wider text-xs bg-[#262626] hover:bg-[#0066b1] border border-[#3c3c3c] hover:border-[#0066b1] text-white transition-all flex items-center justify-center gap-2"
              >
                Cargar en Laboratorio 2D
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
