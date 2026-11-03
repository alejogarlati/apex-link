import { Gauge, Activity, LineChart, Cpu, Zap, Trophy } from "lucide-react";

export function FeaturesGrid() {
  const caracteristicas = [
    {
      icono: Gauge,
      etiqueta: "Módulo 2 • Dev 2",
      titulo: "Cockpit DDU Ultra Reactivo",
      descripcion:
        "Display de volante con renderizado fluido a 60-144 FPS, Shift Lights de corte estroboscópicos estilo FIA GT3 y fondo negro AMOLED sin consumo excesivo.",
      color: "text-[#0066b1]",
      borde: "border-[#0066b1]/30",
    },
    {
      icono: Activity,
      etiqueta: "Módulo 3 • En Vivo",
      titulo: "Live Pitwall a 60 Hz",
      descripcion:
        "Telemetría en tiempo real para el muro de boxes: barras de acelerador/freno con retención de picos, diagrama de fuerzas Kamm G-G y telemetría térmica de neumáticos.",
      color: "text-[#0fa336]",
      borde: "border-[#0fa336]/30",
    },
    {
      icono: LineChart,
      etiqueta: "Módulo 3 • Post-Sesión",
      titulo: "Laboratorio Analítico 2D",
      descripcion:
        "Normalización métrica metro a metro (0 a L_pista). Comparativa de vuelta rápida vs referencia con deltas exactos y mapa de calor de acelerador/freno sobre Canvas 2D.",
      color: "text-[#e22718]",
      borde: "border-[#e22718]/30",
    },
    {
      icono: Cpu,
      etiqueta: "Módulo 1 • Dev 1",
      titulo: "Win32 MMF & Clean Architecture",
      descripcion:
        "Lector de memoria compartida C++ a 60 Hz con protocolo SeqLock optimista, persistencia SQLite WAL y servidor WebSocket determinístico sin caídas.",
      color: "text-[#1c69d4]",
      borde: "border-[#1c69d4]/30",
    },
    {
      icono: Zap,
      etiqueta: "Infraestructura",
      titulo: "Túnel USB Sin Wi-Fi",
      descripcion:
        "Transmisión mediante ADB reverse directo por cable USB. Latencia inferior a 0.8 ms, inmune a interferencias de radiofrecuencia en ferias y eventos masivos.",
      color: "text-[#f4b400]",
      borde: "border-[#f4b400]/30",
    },
    {
      icono: Trophy,
      etiqueta: "Gamificación",
      titulo: "Apex Rating & Stand Leaderboards",
      descripcion:
        "Algoritmo de puntuación de pilotos en 5 dimensiones (Velocidad, Consistencia, Frenada, Control y Agresividad) con tablas de récord para el stand de FAPPE 2026.",
      color: "text-[#0066b1]",
      borde: "border-[#0066b1]/30",
    },
  ];

  return (
    <section className="py-20 bg-[#0d0d0d] border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-[#bbbbbb] mb-2">
            Ingeniería Automovilística Distribuida
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
            Los Pilares de la Suite <span className="text-[#0066b1]">ApexLink</span>
          </h2>
          <p className="text-[#7e7e7e] text-sm mt-3">
            Tres módulos sincronizados en tiempo real bajo contratos sagrados DTO para brindar una experiencia de ingeniería de competición completa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caracteristicas.map((item, idx) => {
            const Icono = item.icono;
            return (
              <div
                key={idx}
                className={`bg-[#1a1a1a] border border-[#3c3c3c] hover:${item.borde} p-6 rounded-lg transition-all duration-200 flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e7e7e] font-mono">
                      {item.etiqueta}
                    </span>
                    <div className="p-2 rounded bg-black border border-[#262626] group-hover:border-[#3c3c3c] transition-colors">
                      <Icono className={`w-5 h-5 ${item.color}`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
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
