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
      activo: true,
    },
    {
      id: "488gt3",
      nombre: "Ferrari 488 GT3",
      clase: "FIA GT3",
      potencia: "600 CV",
      maxRpm: 7500,
      peso: "1260 kg",
      traccion: "RWD",
      vueltasTotales: 28,
      kilometros: 162.2,
      activo: true,
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
      activo: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#262626] pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#0066b1]" />
          <h1 className="text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
            Garaje Virtual & Odómetro de Monoplazas
          </h1>
        </div>
        <p className="mt-1 text-xs text-[#bbbbbb]">
          Vehículos calibrados con telemetría de suspensiones, corte de RPMs y dinámica de frenado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehiculos.map((auto) => (
          <div
            key={auto.id}
            className="border border-[#3c3c3c] bg-[#1a1a1a] rounded-lg p-6 flex flex-col justify-between hover:border-[#0066b1] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0066b1] bg-[#0066b1]/15 px-2 py-0.5 rounded border border-[#0066b1]/30">
                  {auto.clase}
                </span>
                <span className="text-xs text-[#7e7e7e] font-mono">{auto.traccion}</span>
              </div>

              <h2 className="text-lg font-bold text-white uppercase">{auto.nombre}</h2>

              <div className="mt-4 space-y-2 text-xs font-mono border-y border-[#262626] py-4">
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Potencia Motor:</span>
                  <span className="text-white font-bold">{auto.potencia}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Corte Tacómetro:</span>
                  <span className="text-[#e22718] font-bold">{auto.maxRpm} RPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Peso en Vacío:</span>
                  <span className="text-white">{auto.peso}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7e7e7e]">Odómetro Acumulado:</span>
                  <span className="text-[#0fa336] font-bold">{auto.kilometros} km</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-[#7e7e7e] text-center font-mono">
              {auto.vueltasTotales} vueltas computadas en boxes
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
