import { Gauge, Flame, LineChart, Zap, Eye, Trophy } from "lucide-react";

export function FeaturesGrid() {
  const caracteristicas = [
    {
      icono: Gauge,
      etiqueta: "En Cabina · Pantalla DDU",
      titulo: "Toda la información por el rabillo del ojo",
      descripcion:
        "Marcha colosal en el centro para no desviar la mirada de la pista. 15 luces de cambio progresivas (5 verdes, 5 rojas, 5 azules) y barra de delta en vivo en verde o rojo para saber al instante si vas ganando o perdiendo tiempo.",
      color: "text-[#e22718]",
      bordeHover: "hover:border-[#e22718]",
    },
    {
      icono: Flame,
      etiqueta: "Chasis y Neumáticos",
      titulo: "Sabé cuándo apurar y cuándo cuidar el auto",
      descripcion:
        "Colores térmicos en las 4 ruedas (azul si están frías tras salir de boxes, verde en ventana óptima de agarre y rojo intermitente si las estás sobrecalentando). Control de presiones en PSI y cálculo exacto de nafta restante por vuelta.",
      color: "text-[#e22718]",
      bordeHover: "hover:border-[#e22718]",
    },
    {
      icono: LineChart,
      etiqueta: "Post-Sesión · Plataforma en Boxes",
      titulo: "Encontrá dónde perdiste las décimas",
      descripcion:
        "Trazada 2D del circuito con frenadas en rojo y aceleraciones a fondo en verde. Superponé tu mejor vuelta contra tu rival o referencia para ver con precisión quirúrgica en qué metro frenaste antes o abriste tarde el acelerador.",
      color: "text-[#0066b1]",
      bordeHover: "hover:border-[#0066b1]",
    },
    {
      icono: Zap,
      etiqueta: "Conexión Cableada Directa",
      titulo: "Cero retardo y máxima estabilidad en pista",
      descripcion:
        "Enlace directo por cable USB sin depender de señales Wi-Fi hogareñas saturadas. Latencia inferior a 0.8 ms garantizada y carga continua de batería durante carreras largas de resistencia.",
      color: "text-[#0fa336]",
      bordeHover: "hover:border-[#0fa336]",
    },
    {
      icono: Eye,
      etiqueta: "Contraste Puro AMOLED",
      titulo: "Diseñado para competir en la oscuridad",
      descripcion:
        "Lienzo negro absoluto (#000000) que apaga los píxeles en pantallas OLED. Elimina el encandilamiento visual en simuladores oscuros y mantiene el teléfono a baja temperatura durante tandas exigentes.",
      color: "text-[#1c69d4]",
      bordeHover: "hover:border-[#1c69d4]",
    },
    {
      icono: Trophy,
      etiqueta: "Diagnóstico de Pilotaje",
      titulo: "Consistencia, frenada y ritmo medidos",
      descripcion:
        "Análisis de tus 5 dimensiones al volante: velocidad punta, consistencia de vuelta a vuelta, control en el umbral de bloqueo de freno, aplomo del chasis y agresividad en curvas cerradas.",
      color: "text-[#f4b400]",
      bordeHover: "hover:border-[#f4b400]",
    },
  ];

  return (
    <section id="volante" className="py-20 bg-[#0d0d0d] border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e22718] mb-3">
            Los Tres Momentos de la Carrera
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">
            Del Volante al Muro de Boxes
          </h2>
          <p className="text-[#bbbbbb] text-sm sm:text-base mt-4 leading-relaxed">
            Cada pantalla cumple una función crítica: respuesta visual instantánea mientras pilotás, y precisión analítica metro a metro apenas volvés al pitlane.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caracteristicas.map((item, idx) => {
            const Icono = item.icono;
            return (
              <div
                key={idx}
                className="bg-black border border-[#262626] hover:border-[#3c3c3c] p-8 flex flex-col justify-between transition-colors relative overflow-hidden group"
              >
                {/* Indicador superior al hacer hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e22718] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7e7e7e]">
                      {item.etiqueta}
                    </span>
                    <div className="w-10 h-10 bg-[#141414] border border-[#3c3c3c] flex items-center justify-center">
                      <Icono className={`w-5 h-5 ${item.color}`} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-3">
                    {item.titulo}
                  </h3>

                  <p className="text-xs leading-relaxed text-[#bbbbbb]">
                    {item.descripcion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
