import { Activity, LineChart, Gauge } from "lucide-react";

export function RacerManifesto() {
  return (
    <section id="manifiesto" className="border-y border-[#262626] bg-[#0d0d0d] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Manifiesto con franja lateral izquierda en Rojo M */}
          <div className="lg:col-span-7 border-l-4 border-[#e22718] pl-6 sm:pl-8 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e22718]">
              La Ciencia de Limar Décimas
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
              Dejá de adivinar dónde pierdes tiempo. <span className="text-[#e22718]">Medilo.</span>
            </h2>
            <div className="space-y-3 text-sm text-[#bbbbbb] leading-relaxed">
              <p>
                En la Fórmula 1 y el automovilismo de alta competencia, ningún piloto sale a pista a ciegas esperando que el cronómetro baje por casualidad. Cada récord de vuelta es el resultado de una conversación exacta entre el piloto en la cabina y el ingeniero de datos en el muro de boxes.
              </p>
              <p>
                ApexLink traslada esa misma infraestructura al simracing: mientras manejás, tenés la lectura sensorial precisa en el aro de tu volante; mientras rodás en pista, el muro de boxes monitorea en vivo tus presiones térmicas y fuerzas G; y apenas entrás al pitlane, el laboratorio analítico te muestra exactamente en qué metro frenaste antes o en qué curva perdiste la tracción.
              </p>
            </div>
          </div>

          {/* Bloque de Métricas Clave del Ecosistema */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            <div className="p-4 bg-black border border-[#3c3c3c] flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#7e7e7e]">
                  En Vivo en Boxes
                </div>
                <div className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                  60 <span className="text-xs text-[#0fa336] font-sans font-normal">Hz (Live Pitwall)</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-[#141414] border border-[#3c3c3c] flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#0fa336]" />
              </div>
            </div>

            <div className="p-4 bg-black border border-[#3c3c3c] flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#7e7e7e]">
                  Alineación Post-Sesión
                </div>
                <div className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                  0 <span className="text-xs text-[#0066b1] font-sans font-normal">Desfase (Dominio Métrico)</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-[#141414] border border-[#3c3c3c] flex items-center justify-center">
                <LineChart className="w-5 h-5 text-[#0066b1]" />
              </div>
            </div>

            <div className="p-4 bg-black border border-[#3c3c3c] flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#7e7e7e]">
                  Respuesta en Cabina
                </div>
                <div className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                  &lt; 0.8 <span className="text-xs text-[#e22718] font-sans font-normal">ms (Display DDU)</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-[#141414] border border-[#3c3c3c] flex items-center justify-center">
                <Gauge className="w-5 h-5 text-[#e22718]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
