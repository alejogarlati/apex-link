import { Activity, LineChart, Target, Gauge, Brain, Trophy } from "lucide-react";

export function FeaturesGrid() {
  const pilares = [
    {
      icono: Activity,
      etiqueta: "En Vivo · Boxes",
      titulo: "Live Pitwall en Tiempo Real",
      descripcion:
        "Tu puesto de ingeniero de carrera a 60 Hz: monitoreo de pedales con retención de picos, diagrama de fuerzas G de fricción (Círculo de Kamm), temperaturas internas y presiones en las 4 ruedas, más cronometraje de stint con mapa en vivo.",
      color: "text-[#e22718]",
      bordeHover: "hover:border-[#e22718]",
      idAnchor: "pitwall",
    },
    {
      icono: LineChart,
      etiqueta: "Post-Sesión · Análisis",
      titulo: "Laboratorio Analítico 2D",
      descripcion:
        "Telemetría normalizada en dominio de distancia métrica (0 a L metros de pista). Superponé tu vuelta rápida contra tu referencia o rival sin el desfase temporal de los programas viejos. Trazada 2D con mapas de calor de acelerador y freno.",
      color: "text-[#0066b1]",
      bordeHover: "hover:border-[#0066b1]",
      idAnchor: "analisis",
    },
    {
      icono: Target,
      etiqueta: "Post-Sesión · Curvas",
      titulo: "Corner Delta Inspector",
      descripcion:
        "Desglosá cualquier curva del circuito con un solo clic: compará tu velocidad de entrada, el punto exacto donde te paraste sobre el freno, la velocidad mínima en el ápice y cómo abriste el acelerador hacia la recta siguiente.",
      color: "text-[#0fa336]",
      bordeHover: "hover:border-[#0fa336]",
      idAnchor: "inspector",
    },
    {
      icono: Gauge,
      etiqueta: "En Cabina · Volante",
      titulo: "Instrumental Digital DDU",
      descripcion:
        "Cuadro de instrumentos ultrarrápido para el aro del volante: marcha gigante central para no desviar la mirada, 15 luces de corte estroboscópicas progresivas, barra dinámica de delta y fondo negro AMOLED que no encandila de noche.",
      color: "text-[#e22718]",
      bordeHover: "hover:border-[#e22718]",
      idAnchor: "ddu",
    },
    {
      icono: Brain,
      etiqueta: "Driver Intelligence",
      titulo: "AI Race Coach & Diagnósticos",
      descripcion:
        "Detección inteligente de puntos de mejora: el sistema analiza tu tanda y te avisa si estás frenando antes de tiempo, si bloqueás neumáticos en la entrada a curva o si perdés tracción por acelerar con el volante cruzado.",
      color: "text-[#1c69d4]",
      bordeHover: "hover:border-[#1c69d4]",
      idAnchor: "coach",
    },
    {
      icono: Trophy,
      etiqueta: "Plataforma SaaS",
      titulo: "Gestión de Tandas & Clasificación",
      descripcion:
        "Historial completo de sesiones guardadas, clasificación de vueltas válidas, odómetro de tus autos, catálogo de circuitos escaneados por láser y cálculo de Pace Rating y Safety Rating para medir tu evolución como piloto.",
      color: "text-[#f4b400]",
      bordeHover: "hover:border-[#f4b400]",
      idAnchor: "saas",
    },
  ];

  return (
    <section id="pilares" className="py-20 bg-[#0d0d0d] border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e22718] mb-3">
            Suite de Telemetría de 360 Grados
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">
            Los Cuatro Pilares del <span className="text-[#e22718]">Ecosistema</span>
          </h2>
          <p className="text-[#bbbbbb] text-sm sm:text-base mt-4 leading-relaxed">
            Una plataforma unificada que conecta al piloto en la cabina con la ingeniería de pista en el pitwall y el análisis de datos post-sesión.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilares.map((item, idx) => {
            const Icono = item.icono;
            return (
              <div
                key={idx}
                id={item.idAnchor}
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
