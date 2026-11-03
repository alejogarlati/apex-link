import Link from "next/link";
import { Play, Gauge } from "lucide-react";

export function CtaBand() {
  return (
    <section className="py-20 bg-[#0d0d0d] border-t border-[#262626] relative overflow-hidden">
      {/* Resplandor sutil rojo M en el fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#e22718]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black border border-[#3c3c3c] text-xs font-bold uppercase tracking-[0.2em] text-[#bbbbbb]">
          <span className="w-2 h-2 rounded-full bg-[#0fa336] animate-pulse" />
          Listo para Competir
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">
          Montá tu pantalla y <span className="text-[#e22718]">salí a pista</span>
        </h2>

        <p className="text-[#bbbbbb] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Enchufá tu teléfono a la computadora por cable USB, abrí el simulador y experimentá la telemetría en tiempo real desde la primera curva.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto h-[52px] px-8 rounded-none bg-[#e22718] hover:bg-[#c91f12] active:scale-[0.99] text-white font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all border border-[#e22718] shadow-[0_0_25px_rgba(226,39,24,0.35)] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            ENTRAR A PISTA (MODO DEMO)
          </Link>

          <Link
            href="/hub"
            className="w-full sm:w-auto h-[52px] px-8 rounded-none bg-[#141414] hover:bg-[#1f1f1f] active:scale-[0.99] text-white font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all border border-[#3c3c3c] hover:border-[#e22718] cursor-pointer"
          >
            <Gauge className="w-4 h-4 text-[#bbbbbb]" />
            VER MURO DE TELEMETRÍA EN BOXES
          </Link>
        </div>
      </div>
    </section>
  );
}
