import { Check, X, Shield, Cpu } from "lucide-react";

export function HardwareComparison() {
  return (
    <section id="comparativa" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#3c3c3c] text-[#e22718] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            Evolución del Software de Competición
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">
            Software Tradicional vs <span className="text-[#e22718]">ApexLink Suite</span>
          </h2>
          <p className="text-[#bbbbbb] text-sm sm:text-base mt-4 leading-relaxed">
            El automovilismo digital moderno requiere herramientas ágiles y conectadas. Dejá atrás las suites de telemetría de los 90s, las exportaciones manuales y las aplicaciones desvinculadas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Tarjeta Software Tradicional */}
          <div className="bg-[#0d0d0d] border border-[#262626] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7e7e7e]">
                    Enfoque Tradicional
                  </span>
                  <h3 className="text-2xl font-bold uppercase text-white mt-1">
                    Suites Antiguas y MoTeC
                  </h3>
                  <div className="text-xs text-[#7e7e7e] mt-0.5">
                    Paradigmas de la década de 1990
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-[#e22718] font-mono">Desfasado</div>
                  <div className="text-[10px] text-[#7e7e7e] uppercase font-bold tracking-wider">Flujo Fragmentado</div>
                </div>
              </div>

              <ul className="py-6 space-y-4">
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Curvas desfasadas en el tiempo:</strong> Si vas más rápido, las curvas se desalinean y se vuelve imposible comparar el punto de frenada en la misma curva.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Sin ingeniería en vivo:</strong> Obliga a terminar la sesión, salir del simulador y exportar manualmente archivos binarios (`.ld`) a disco.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Gráficos aislados sin trazada 2D:</strong> Curvas numéricas frías sin mapa interactivo ni correlación visual con las curvas del circuito.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Instrumental de cabina desconectado:</strong> Requiere comprar displays propietarios caros o software de terceros de pago que no se integra al análisis.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#bbbbbb]">
                  <X className="w-5 h-5 text-[#e22718] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Curva de aprendizaje empinada:</strong> Decenas de canales matemáticos confusos que abruman al piloto en lugar de hacerlo más rápido.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-black border border-[#262626] text-xs text-[#7e7e7e] text-center">
              Pérdida de tiempo entre tandas configurando canales en lugar de estar limando décimas en pista.
            </div>
          </div>

          {/* Tarjeta ApexLink Suite */}
          <div className="bg-[#141414] border-2 border-[#e22718] p-8 flex flex-col justify-between shadow-2xl shadow-[#e22718]/10 relative">
            <div className="absolute top-0 right-0 bg-[#e22718] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Ecosistema Integral
            </div>

            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#e22718]">
                    Suite Distribuida de Competición
                  </span>
                  <h3 className="text-2xl font-bold uppercase text-white mt-1">
                    ApexLink Ecosystem
                  </h3>
                  <div className="text-xs text-[#bbbbbb] mt-0.5">
                    Live Pitwall + Laboratorio 2D + DDU + Driver Intelligence
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-[#0fa336] font-mono">Enlace 60 Hz</div>
                  <div className="text-[10px] text-[#0fa336] uppercase font-bold tracking-wider">Flujo Continuo</div>
                </div>
              </div>

              <ul className="py-6 space-y-4">
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Normalización en distancia métrica:</strong> Las vueltas se alinean metro a metro (0 a L metros de pista), comparando la frenada y el acelerador en el punto geográfico exacto.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Live Pitwall a 60 Hz en navegador:</strong> Tu ingeniero de boxes monitorea en vivo el desgaste térmico de gomas, fuerzas Kamm G-G y pedales mientras rodás.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Mapa interactivo 2D y mapas de calor:</strong> Trazada del circuito con zonas de frenada en rojo y aceleración en verde sincronizadas con los gráficos.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Instrumental DDU en cabina integrado:</strong> El display del volante forma parte del ecosistema; respuesta sin retardo con luces de cambio estroboscópicas.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-[#0fa336] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Corner Delta Inspector & AI Coach:</strong> Tocás una curva y ves la velocidad de entrada, el vértice y la ganancia o pérdida de tiempo al instante.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-black border border-[#3c3c3c] text-xs text-[#bbbbbb] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#e22718]" />
                Un solo software que une tu volante, tus boxes y tu análisis
              </span>
              <span className="font-bold text-white uppercase text-[10px] tracking-wider">
                100% Sincronizado
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
