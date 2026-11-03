import { Check, X } from "lucide-react";

export function HardwareComparison() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e22718]/10 border border-[#e22718]/30 text-[#e22718] text-xs font-bold uppercase tracking-widest mb-3">
            Democratización Tecnológica
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
            El Hardware Propietario vs <span className="text-[#0066b1]">ApexLink</span>
          </h2>
          <p className="text-[#bbbbbb] text-sm sm:text-base mt-3">
            Rompemos la barrera de entrada económica del motorsport digital. Rendimiento de Fórmula 1 sin gastar miles de dólares en pantallas propietarias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Tarjeta Tradicional Propietaria */}
          <div className="bg-[#1a1a1a] border border-[#3c3c3c] rounded-lg p-8 flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7e7e7e]">
                    Enfoque Tradicional Comercial
                  </span>
                  <h3 className="text-2xl font-bold uppercase text-white mt-1">
                    Hardware DDU Propietario
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#e22718] font-mono">~$1.350 USD</div>
                  <div className="text-[10px] text-[#7e7e7e] uppercase">Costo Promedio Mercado</div>
                </div>
              </div>

              <ul className="py-6 space-y-4">
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Volante con pantalla integrada:</strong> $800 - $1.400 USD por unidad (Cube Controls, Ascher Racing, Grid Engineering).
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Licencias y software de pago:</strong> Requiere suites propietarias de terceros y cuotas recurrentes.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Latencia e inestabilidad Wi-Fi:</strong> Soluciones móviles genéricas sufren microcortes y pérdida de paquetes.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Análisis complejo (MoTeC):</strong> Curva de aprendizaje empinada, sin correlación automática 2D metro a metro.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded bg-black/60 border border-[#262626] text-xs text-[#7e7e7e] text-center">
              Elevada barrera de acceso para pilotos amateur, clubes y universidades.
            </div>
          </div>

          {/* Tarjeta ApexLink */}
          <div className="bg-[#1a1a1a] border-2 border-[#0066b1] rounded-lg p-8 flex flex-col justify-between shadow-2xl shadow-[#0066b1]/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#0066b1] to-[#1c69d4] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl">
              Solución ApexLink FAPPE
            </div>

            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0066b1]">
                    Arquitectura Distribuida de Alta Fidelidad
                  </span>
                  <h3 className="text-2xl font-bold uppercase text-white mt-1">
                    ApexLink Ecosystem
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#0fa336] font-mono">$0 USD</div>
                  <div className="text-[10px] text-[#0fa336] uppercase font-bold">100% Accesible</div>
                </div>
              </div>

              <ul className="py-6 space-y-4">
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Cualquier Smartphone Android viejo:</strong> Reutiliza celulares en desuso como DDU profesional en el volante.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Túnel USB determinístico (&lt; 0.8 ms):</strong> Comunicación cableada ultra veloz sin necesidad de Wi-Fi.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Ingeniería de Pista en Boxes (Next.js 15):</strong> Plataforma SaaS en cualquier laptop o tablet conectada.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Trazada 2D y Heatmaps nativos:</strong> Telemetría normalizada en dominio de distancia métrica (0 a L_pista metros).
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded bg-[#0066b1]/10 border border-[#0066b1]/30 text-xs text-[#bbbbbb] flex items-center justify-between">
              <span className="font-semibold text-white">Demostrado en FAPPE 2026:</span>
              <span className="text-[#0fa336] font-bold">Ahorro del 100% en periféricos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
