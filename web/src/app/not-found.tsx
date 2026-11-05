import Link from "next/link";
import { Flag, ArrowLeft, Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-[#0066b1]">
      {/* Barra Tricolor M */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#0066b1]" />
        <div className="h-full w-1/3 bg-[#1c69d4]" />
        <div className="h-full w-1/3 bg-[#e22718]" />
      </div>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-[#141414] border border-[#3c3c3c] rounded-xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#0066b1]/15 border border-[#0066b1]/40 text-[#0066b1] flex items-center justify-center mx-auto mb-6">
            <Compass className="w-8 h-8" />
          </div>

          <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0066b1]">
            Error 404 • Track Limits
          </span>

          <h1 className="mt-2 text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Sector Fuera de Pista
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-[#bbbbbb] leading-relaxed">
            La coordenada o vista que intentás consultar no existe en el trazado oficial de ApexLink. Regresá a boxes para retomar la telemetría.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-colors shadow-md shadow-[#0066b1]/20"
            >
              <Flag className="w-4 h-4" />
              Volver a Boxes (/app)
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#1a1a1a] hover:bg-[#262626] border border-[#3c3c3c] text-[#bbbbbb] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Página Principal
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs font-mono text-[#7e7e7e] border-t border-[#262626]">
        ApexLink Pitwall © 2026
      </footer>
    </div>
  );
}
