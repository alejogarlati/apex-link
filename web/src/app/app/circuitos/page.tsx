import Link from "next/link";

export default function PaginaCircuitos() {
  const circuitos = [
    {
      id: "monza",
      nombre: "Autodromo Nazionale Monza",
      pais: "Italia 🇮🇹",
      longitudMetros: 5793,
      curvas: 11,
      recordStand: "01:21.240",
      pilotoRecord: "Alejo Garlati (Ferrari SF70H)",
      activo: true,
      zonasDrs: 2,
    },
    {
      id: "spa",
      nombre: "Circuit de Spa-Francorchamps",
      pais: "Bélgica 🇧🇪",
      longitudMetros: 7004,
      curvas: 19,
      recordStand: "01:42.550",
      pilotoRecord: "Ferrari SF70H",
      activo: false,
      zonasDrs: 2,
    },
    {
      id: "redbullring",
      nombre: "Red Bull Ring (Spielberg)",
      pais: "Austria 🇦🇹",
      longitudMetros: 4318,
      curvas: 10,
      recordStand: "01:05.410",
      pilotoRecord: "Ferrari SF70H",
      activo: false,
      zonasDrs: 3,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#262626] pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#0066b1]" />
          <h1 className="text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
            Catálogo de Circuitos & Tiempos Récord
          </h1>
        </div>
        <p className="mt-1 text-xs text-[#bbbbbb]">
          Pistas escaneadas por láser compatibles con telemetría metro a metro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {circuitos.map((pista) => (
          <div
            key={pista.id}
            className={`border rounded-lg p-6 flex flex-col justify-between ${
              pista.activo
                ? "border-[#0066b1] bg-[#1a1a1a] shadow-lg shadow-[#0066b1]/10"
                : "border-[#262626] bg-[#0d0d0d] opacity-75"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-[#7e7e7e] font-mono">{pista.pais}</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    pista.activo
                      ? "bg-[#0fa336]/15 border-[#0fa336]/30 text-[#0fa336]"
                      : "bg-[#262626] border-[#3c3c3c] text-[#7e7e7e]"
                  }`}
                >
                  {pista.activo ? "Activo Stand FAPPE" : "Próximamente"}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white uppercase">{pista.nombre}</h2>

              <div className="mt-4 space-y-2 text-xs font-mono border-t border-[#262626] pt-4">
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Longitud:</span>
                  <span className="text-white">{pista.longitudMetros} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Curvas Oficiales:</span>
                  <span className="text-white">{pista.curvas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Zonas DRS:</span>
                  <span className="text-white">{pista.zonasDrs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Récord Stand:</span>
                  <span className="text-[#0fa336] font-bold">{pista.recordStand}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {pista.activo ? (
                <Link
                  href="/app/analysis"
                  className="w-full py-2.5 rounded font-bold uppercase tracking-wider text-xs bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Ver Trazada 2D Monza
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-2.5 rounded font-bold uppercase tracking-wider text-xs bg-[#1a1a1a] border border-[#262626] text-[#7e7e7e] flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  Fase 2
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
