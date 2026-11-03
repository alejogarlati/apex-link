import { Check, X, Shield, Smartphone } from "lucide-react";

export function HardwareComparison() {
  return (
    <section id="comparativa" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#3c3c3c] text-[#e22718] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            Democratización del Puesto de Conducción
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">
            Volantes Comerciales vs <span className="text-[#e22718]">Tu Teléfono</span>
          </h2>
          <p className="text-[#bbbbbb] text-sm sm:text-base mt-4 leading-relaxed">
            Las pantallas de carreras de alta gama ya están en tu bolsillo. No necesitás cambiar de base ni gastar fortunas para tener el instrumental de un auto real.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Tarjeta Tradicional Comercial */}
          <div className="bg-[#0d0d0d] border border-[#262626] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7e7e7e]">
                    Enfoque Tradicional Comercial
                  </span>
                  <h3 className="text-2xl font-bold uppercase text-white mt-1">
                    Volantes Dedicados con Pantalla
                  </h3>
                  <div className="text-xs text-[#7e7e7e] mt-0.5">
                    Cube Controls, Ascher Racing, Fanatec Podium
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-[#e22718] font-mono">~$1.350 USD</div>
                  <div className="text-[10px] text-[#7e7e7e] uppercase font-bold tracking-wider">Costo Promedio Mercado</div>
                </div>
              </div>

              <ul className="py-6 space-y-4">
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Gasto excesivo:</strong> $800 a $2.000 USD por un aro con display integrado que solo sirve para correr.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Pantallas LCD opacas:</strong> Marcos gruesos y fugas de luz nocturna que encandilan la visión del piloto.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Retardo en luces de corte:</strong> Desfase perceptible si el software del fabricante consume recursos en segundo plano.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Inestabilidad por Wi-Fi:</strong> Microcortes y pérdida de paquetes cuando la red hogareña se satura.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Atado a un ecosistema cerrado:</strong> Si cambiás de base de volante (Logitech a Direct Drive), el volante deja de ser compatible.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-black border border-[#262626] text-xs text-[#7e7e7e] text-center">
              Elevada barrera de acceso para pilotos que buscan mejorar sus tiempos sin gastar miles de dólares.
            </div>
          </div>

          {/* Tarjeta ApexLink */}
          <div className="bg-[#141414] border-2 border-[#e22718] p-8 flex flex-col justify-between shadow-2xl shadow-[#e22718]/10 relative">
            <div className="absolute top-0 right-0 bg-[#e22718] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Solución Inteligente
            </div>

            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#e22718]">
                    Instrumental de Competición en Tiempo Real
                  </span>
                  <h3 className="text-2xl font-bold uppercase text-white mt-1">
                    Tu Teléfono con ApexLink
                  </h3>
                  <div className="text-xs text-[#bbbbbb] mt-0.5">
                    Display DDU + Telemetría de Boxes en Navegador
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-[#0fa336] font-mono">$0 USD</div>
                  <div className="text-[10px] text-[#0fa336] uppercase font-bold tracking-wider">Aprovechás lo que tenés</div>
                </div>
              </div>

              <ul className="py-6 space-y-4">
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Cualquier Smartphone Android:</strong> Reutilizás el celular que tenés en el cajón y lo montás al centro del volante.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Pantallas AMOLED / OLED:</strong> Negros puros absolutos con píxeles apagados que eliminan el brillo molesto en carreras nocturnas.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Luces de corte instantáneas:</strong> 15 LEDs estroboscópicos de respuesta inmediata sincronizados con el limitador del motor.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Túnel por cable USB directo:</strong> Retardo imperceptible (&lt; 0.8 ms), inmune a interferencias de Wi-Fi y con batería cargada siempre.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Agnóstico y universal:</strong> Funciona con Logitech (G29, G923, Pro), Thrustmaster, Fanatec y bases Direct Drive (Moza, Simucube, Simagic).
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-black border border-[#3c3c3c] text-xs text-[#bbbbbb] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#e22718]" />
                Montaje universal con cualquier soporte para volante de 10 USD
              </span>
              <span className="font-bold text-white uppercase text-[10px] tracking-wider">
                100% Plug & Play
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
