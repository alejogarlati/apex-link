import { Activity, LineChart, Target, Gauge, Sliders, Trophy } from "lucide-react";

export function FeaturesGrid() {
  const caracteristicas = [
    {
      icono: Gauge,
      etiqueta: "En Cabina · Volante",
      titulo: "Instrumental Digital DDU",
      descripcion:
        "Cuadro de instrumentos para el aro del volante: marcha gigante central para lectura inmediata, 15 luces de cambio estroboscópicas progresivas, barra dinámica de delta y temperaturas térmicas de cubiertas.",
      color: "text-[#e22718]",
      idAnchor: "ddu",
    },
    {
      icono: Activity,
      etiqueta: "En Vivo · Boxes",
      titulo: "Live Pitwall en Tiempo Real",
      descripcion:
        "Monitoreo a 60 Hz desde el navegador: barras de acelerador y freno con retención de picos, fuerzas de aceleración lateral y longitudinal (Círculo de Kamm), presiones de inflado y cronometraje de stint con mapa en vivo.",
      color: "text-[#0fa336]",
      idAnchor: "pitwall",
    },
    {
      icono: LineChart,
      etiqueta: "Post-Sesión · Datos",
      titulo: "Laboratorio Analítico 2D",
      descripcion:
        "Telemetría normalizada en dominio de distancia métrica (0 a L metros de pista). Compará tu vuelta rápida contra tu referencia curva por curva, con trazada 2D y mapas de color continuos de aceleración y frenada.",
      color: "text-[#0066b1]",
      idAnchor: "analisis",
    },
    {
      icono: Target,
      etiqueta: "Post-Sesión · Curvas",
      titulo: "Inspector de Curvas",
      descripcion:
        "Hacé clic en cualquier curva del trazado y mirá la velocidad de entrada, el metro exacto donde empezaste a frenar, la velocidad mínima en el ápice y cómo abriste el acelerador hacia la recta siguiente.",
      color: "text-[#1c69d4]",
      idAnchor: "inspector",
    },
    {
      icono: Trophy,
      etiqueta: "Progreso · Historial",
      titulo: "Métricas y Consistencia",
      descripcion:
        "Registro ordenado de tus tandas en pista, clasificación de vueltas válidas e inválidas, y cálculo de consistencia vuelta a vuelta para identificar errores y evaluar tu evolución como piloto.",
      color: "text-[#f4b400]",
      idAnchor: "metricas",
    },
    {
      icono: Sliders,
      etiqueta: "Hardware · Pantallas",
      titulo: "Compatibilidad Universal",
      descripcion:
        "Compatible con bases Logitech, Thrustmaster, Fanatec y Direct Drive (Moza, Simagic, Simucube). Podés ver el instrumental en cualquier celular, tablet o monitor secundario sin necesidad de adaptadores privativos.",
      color: "text-[#bbbbbb]",
      idAnchor: "compatibilidad",
    },
  ];

  return (
    <section id="caracteristicas" className="py-20 bg-[#0d0d0d] border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e22718] mb-3">
            Herramientas Concretas de Pista
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">
            Todo lo que necesitás para <span className="text-[#e22718]">mejorar tus vueltas</span>
          </h2>
          <p className="text-[#bbbbbb] text-sm sm:text-base mt-4 leading-relaxed">
            Datos claros y precisos organizados para ayudarte a entender qué hace tu auto y cómo optimizar cada sector del circuito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caracteristicas.map((item, idx) => {
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
