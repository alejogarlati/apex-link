import Link from "next/link";
import { Gauge, Zap, ArrowRight } from "lucide-react";
import { FappeBanner } from "@/components/landing/FappeBanner";
import { HardwareComparison } from "@/components/landing/HardwareComparison";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";

export default function PaginaInicio() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-[#0066b1] selection:text-white">
      {/* Franja Tricolor BMW M */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#0066b1]" />
        <div className="h-full w-1/3 bg-[#1c69d4]" />
        <div className="h-full w-1/3 bg-[#e22718]" />
      </div>

      {/* Header Superior */}
      <header className="border-b border-[#262626] bg-black/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1a1a1a] border border-[#3c3c3c] rounded">
              <Gauge className="w-5 h-5 text-[#0066b1]" />
            </div>
            <span className="text-lg font-bold uppercase tracking-tight text-white font-mono">
              Apex<span className="text-[#0066b1]">Link</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#3c3c3c] text-[#bbbbbb]">
              FAPPE 2026
            </span>
          </div>

          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/hub"
              className="text-xs font-bold uppercase tracking-wider text-[#bbbbbb] hover:text-white px-3 py-2 transition-colors"
            >
              Simuladores
            </Link>
            <Link
              href="/login"
              className="text-xs font-bold uppercase tracking-wider text-white bg-[#0066b1] hover:bg-[#1c69d4] px-4 py-2 rounded transition-all shadow-md shadow-[#0066b1]/20 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              Acceso a Boxes
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section Principal */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-[#262626] bg-gradient-to-b from-black via-[#0d0d0d] to-black">
        {/* Glow de Acento Tricolor de Fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#0066b1]/20 via-[#1c69d4]/15 to-[#e22718]/15 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#3c3c3c] text-xs font-bold uppercase tracking-widest text-[#bbbbbb] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#0fa336] animate-pulse" />
            Ecosistema de Telemetría Distribuida para Assetto Corsa
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white max-w-5xl mx-auto leading-[1.05]">
            Telemetría SimRacing de Nivel F1{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718]">
              Sin Barreras de Costo
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#bbbbbb] max-w-3xl mx-auto leading-relaxed">
            Plataforma integral para ingeniería de boxes y cabina de pilotaje. Adquisición Win32 en tiempo real a 60 Hz, túnel USB determinístico de latencia sub-milisegundo y laboratorio analítico 2D sin pagar hardware privativo.
          </p>

          {/* Botones de Llamado a la Acción */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded font-bold uppercase tracking-wider text-xs bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all shadow-xl shadow-[#0066b1]/25 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              Iniciar Demostración en Vivo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/hub"
              className="w-full sm:w-auto px-8 py-3.5 rounded font-bold uppercase tracking-wider text-xs bg-[#1a1a1a] hover:bg-[#262626] border border-[#3c3c3c] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gauge className="w-4 h-4 text-[#bbbbbb]" />
              Selector de Simuladores (Gateway)
            </Link>
          </div>

          {/* Chips de Especificaciones Técnicas */}
          <div className="mt-16 pt-10 border-t border-[#262626] flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-[#bbbbbb]">
            <div className="flex items-center gap-2">
              <span className="text-[#0fa336] font-bold">●</span>
              <span>60 Hz Win32 MMF</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0066b1] font-bold">●</span>
              <span>&lt; 0.8 ms Túnel USB</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#e22718] font-bold">●</span>
              <span>Monza GP (5.793 m)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#f4b400] font-bold">●</span>
              <span>Next.js 15 + C# .NET 8</span>
            </div>
          </div>
        </div>
      </section>

      {/* Banner FAPPE 2026 */}
      <FappeBanner />

      {/* Comparativa de Hardware */}
      <HardwareComparison />

      {/* Grid de 3 Pilares */}
      <FeaturesGrid />

      {/* Footer Oficial */}
      <footer className="border-t border-[#262626] bg-black py-12 text-[#7e7e7e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1a1a1a] border border-[#3c3c3c] rounded">
              <Gauge className="w-4 h-4 text-[#0066b1]" />
            </div>
            <span className="text-sm font-bold uppercase text-white font-mono">
              Apex<span className="text-[#0066b1]">Link</span> Pitwall
            </span>
            <span className="text-xs text-[#7e7e7e]">
              • Proyecto de Ingeniería FAPPE 2026
            </span>
          </div>

          <div className="text-xs text-center md:text-right">
            Desarrollado bajo metodología Spec-Driven Development (SDD) • Dev 1, Dev 2 y Dev 3
          </div>
        </div>
      </footer>
    </div>
  );
}
