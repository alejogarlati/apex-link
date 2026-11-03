import { Award } from "lucide-react";

export function FappeBanner() {
  return (
    <section className="border-y border-[#262626] bg-[#0d0d0d] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black border border-[#3c3c3c] rounded-lg">
              <Award className="w-8 h-8 text-[#0066b1]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#0066b1]/15 text-[#0066b1] border border-[#0066b1]/30">
                  Feria de Proyectos de Ingeniería
                </span>
                <span className="text-xs text-[#7e7e7e] font-mono">FAPPE 2026</span>
              </div>
              <h2 className="text-lg font-bold text-white uppercase tracking-tight mt-1">
                Proyecto Oficial de Innovación SimRacing Distribuida
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-left w-full md:w-auto">
            <div className="border-l border-[#3c3c3c] pl-4">
              <div className="text-[11px] uppercase font-bold text-[#7e7e7e]">Latencia USB</div>
              <div className="text-xl font-bold text-white font-mono flex items-center gap-1">
                &lt; 0.8<span className="text-xs text-[#0fa336]">ms</span>
              </div>
            </div>
            <div className="border-l border-[#3c3c3c] pl-4">
              <div className="text-[11px] uppercase font-bold text-[#7e7e7e]">Frecuencia Core</div>
              <div className="text-xl font-bold text-white font-mono flex items-center gap-1">
                60<span className="text-xs text-[#0066b1]">Hz</span>
              </div>
            </div>
            <div className="border-l border-[#3c3c3c] pl-4 col-span-2 sm:col-span-1">
              <div className="text-[11px] uppercase font-bold text-[#7e7e7e]">Costo Periférico</div>
              <div className="text-xl font-bold text-[#0fa336] font-mono">
                $0 USD
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
