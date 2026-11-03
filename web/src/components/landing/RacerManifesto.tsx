import { Zap, Timer, DollarSign } from "lucide-react";

export function RacerManifesto() {
  return (
    <section id="manifiesto" className="border-y border-[#262626] bg-[#0d0d0d] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Manifiesto con franja lateral izquierda en Rojo M */}
          <div className="lg:col-span-7 border-l-4 border-[#e22718] pl-6 sm:pl-8 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e22718]">
              El Secreto de los Pilotos Rápidos
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
              Dejá de adivinar dónde pierdes tiempo. <span className="text-[#e22718]">Medilo.</span>
            </h2>
            <div className="space-y-3 text-sm text-[#bbbbbb] leading-relaxed">
              <p>
                Bajar medio segundo en una pista no se logra dando cien vueltas a ciegas esperando que el reloj baje por arte de magia. Los pilotos que pelean la punta saben exactamente qué pasa debajo del chasis: si en la frenada de la curva 1 están parándose sobre el pedal 10 metros antes, si están sobrecalentando el neumático delantero en el apoyo o si están acelerando con las ruedas traseras todavía descargadas.
              </p>
              <p>
                ApexLink pone esa información en dos lugares: en tu volante mientras estás al mando del auto, y en tu navegador apenas entrás a boxes para comparar tu vuelta rápida contra tu referencia curva por curva.
              </p>
            </div>
          </div>

          {/* Bloque de Métricas Clave */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            <div className="p-4 bg-black border border-[#3c3c3c] flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#7e7e7e]">
                  Retardo en Cabina
                </div>
                <div className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                  &lt; 0.8 <span className="text-xs text-[#0fa336] font-sans font-normal">ms (Cable Directo)</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-[#141414] border border-[#3c3c3c] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#0fa336]" />
              </div>
            </div>

            <div className="p-4 bg-black border border-[#3c3c3c] flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#7e7e7e]">
                  Fluidez de Instrumental
                </div>
                <div className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                  60 - 120 <span className="text-xs text-[#0066b1] font-sans font-normal">FPS Nativos</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-[#141414] border border-[#3c3c3c] flex items-center justify-center">
                <Timer className="w-5 h-5 text-[#0066b1]" />
              </div>
            </div>

            <div className="p-4 bg-black border border-[#3c3c3c] flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#7e7e7e]">
                  Inversión en Volante Nuevo
                </div>
                <div className="text-2xl font-bold text-[#0fa336] font-mono tracking-tight mt-0.5">
                  $0 USD <span className="text-xs text-[#bbbbbb] font-sans font-normal">(Tu Móvil)</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-[#141414] border border-[#3c3c3c] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#0fa336]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
