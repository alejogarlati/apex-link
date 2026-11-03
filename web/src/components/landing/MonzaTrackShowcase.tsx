import { Compass, Flame, ArrowUpRight } from "lucide-react";

export function MonzaTrackShowcase() {
  const puntosClave = [
    {
      curva: "Curva 1 & 2",
      nombre: "Variante del Rettifilo",
      velocidad: "330 → 75 km/h",
      detalle:
        "El DDU te marca el corte exacto en 7ma en la recta; en el Live Pitwall de boxes monitorean la frenada al 100% con retención de pico; y en el Laboratorio 2D inspeccionás si frenaste en el cartel de 150 m o si estiraste a 120 m comparando dos vueltas metro a metro.",
      acento: "text-[#e22718]",
      capas: "Cabina + Pitwall + Laboratorio",
    },
    {
      curva: "Curva 3",
      nombre: "Curva Biassono (Grande)",
      velocidad: "290 km/h sostenidos",
      detalle:
        "Curvón a fondo donde el Círculo de Kamm en el Pitwall mide la aceleración lateral sostenida. El DDU te avisa si el neumático delantero izquierdo supera los 105°C, y el Laboratorio 2D verifica con mapa de calor si tuviste que levantar el acelerador por inestabilidad.",
      acento: "text-[#0fa336]",
      capas: "Fuerzas G + Matriz Térmica",
    },
    {
      curva: "Curva 11",
      nombre: "Parabolica (Alboreto)",
      velocidad: "160 → 280 km/h",
      detalle:
        "La curva que define toda la vuelta. El Corner Delta Inspector del Laboratorio 2D desglosa la velocidad mínima en el vértice y la apertura progresiva del acelerador hacia la recta principal, la clave para limar las décimas que te dan la pole position.",
      acento: "text-[#1c69d4]",
      capas: "Corner Delta Inspector",
    },
  ];

  return (
    <section id="monza" className="py-20 bg-black border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#3c3c3c] text-[#bbbbbb] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
              <Compass className="w-3.5 h-3.5 text-[#e22718]" />
              Caso en Pista: Autodromo Nazionale Monza (5.793 m)
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">
              Las Tres Capas de Telemetría en el <span className="text-[#e22718]">Templo de la Velocidad</span>
            </h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-white">5.793 <span className="text-xs text-[#7e7e7e]">METROS</span></div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7e7e7e]">Longitud Oficial del Trazado</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {puntosClave.map((punto, idx) => (
            <div
              key={idx}
              className="bg-[#0d0d0d] border border-[#262626] p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7e7e7e]">
                    {punto.curva}
                  </span>
                  <span className={`text-xs font-mono font-bold ${punto.acento}`}>
                    {punto.velocidad}
                  </span>
                </div>

                <h3 className="text-lg font-bold uppercase text-white mt-4 mb-3">
                  {punto.nombre}
                </h3>

                <p className="text-xs leading-relaxed text-[#bbbbbb]">
                  {punto.detalle}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1f1f1f] flex items-center justify-between text-[11px] text-[#7e7e7e]">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#bbbbbb]">
                  <Flame className="w-3.5 h-3.5 text-[#e22718]" />
                  {punto.capas}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#7e7e7e]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
