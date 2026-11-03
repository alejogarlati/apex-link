import Link from "next/link";
import { Zap, Play, Gauge } from "lucide-react";
import { MSlantedBadge } from "@/components/landing/MSlantedBadge";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { QuickStartSteps } from "@/components/landing/QuickStartSteps";
import { CtaBand } from "@/components/landing/CtaBand";

export default function PaginaInicio() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-[#e22718] selection:text-white">
      {/* Franja Tricolor BMW M Superior (4px) */}
      <div className="w-full h-1 flex shrink-0 sticky top-0 z-50">
        <div className="flex-1 bg-[#0066b1]" />
        <div className="flex-1 bg-[#1c69d4]" />
        <div className="flex-1 bg-[#e22718]" />
      </div>

      {/* Barra de Navegación (TopNav) */}
      <header className="border-b border-[#262626] bg-black/95 backdrop-blur sticky top-1 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <MSlantedBadge className="h-5" />
            <span className="text-xl font-bold uppercase tracking-[0.15em] text-white font-mono">
              APEX<span className="text-[#e22718]">LINK</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#caracteristicas"
              className="text-xs font-bold uppercase tracking-[0.15em] text-[#bbbbbb] hover:text-white transition-colors"
            >
              Características
            </a>
            <a
              href="#como-funciona"
              className="text-xs font-bold uppercase tracking-[0.15em] text-[#bbbbbb] hover:text-white transition-colors"
            >
              Cómo Funciona
            </a>
            <Link
              href="/hub"
              className="text-xs font-bold uppercase tracking-[0.15em] text-[#bbbbbb] hover:text-white transition-colors"
            >
              En Boxes
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="h-10 px-5 rounded-none bg-[#e22718] hover:bg-[#c91f12] active:scale-[0.99] text-white font-bold text-xs tracking-[0.15em] uppercase flex items-center gap-2 transition-all border border-[#e22718] shadow-[0_0_15px_rgba(226,39,24,0.3)] cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              Probar Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section Principal */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-[#262626] bg-gradient-to-b from-black via-[#0d0d0d] to-black">
        {/* Resplandor sutil rojo M de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#e22718]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Baliza de Estado */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#3c3c3c] text-xs font-bold uppercase tracking-[0.2em] text-[#bbbbbb] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#0fa336] animate-pulse" />
            Sistema Activo · Telemetría en Tiempo Real para Assetto Corsa
          </div>

          {/* Titular Principal */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white max-w-5xl mx-auto leading-[1.05]">
            Telemetría accesible{" "}
            <span className="text-[#e22718] block sm:inline">
              para todo simracer
            </span>
          </h1>

          {/* Bajada */}
          <p className="mt-6 text-base sm:text-lg text-[#bbbbbb] max-w-3xl mx-auto leading-relaxed">
            Conectá tu volante, mirá los datos de tu auto en tiempo real y analizá tus vueltas desde cualquier navegador web. Sin configuraciones complicadas, sin software pesado y compatible con tu equipamiento actual.
          </p>

          {/* Botonera de Acción */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto h-[52px] px-8 rounded-none bg-[#e22718] hover:bg-[#c91f12] active:scale-[0.99] text-white font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all border border-[#e22718] shadow-[0_0_25px_rgba(226,39,24,0.35)] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              PROBAR DEMO EN VIVO
            </Link>

            <Link
              href="/hub"
              className="w-full sm:w-auto h-[52px] px-8 rounded-none bg-[#141414] hover:bg-[#1f1f1f] active:scale-[0.99] text-white font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all border border-[#3c3c3c] hover:border-[#e22718] cursor-pointer"
            >
              <Gauge className="w-4 h-4 text-[#bbbbbb]" />
              VER ENTORNO DE BOXES
            </Link>
          </div>

          {/* Barra de Especificaciones Reales */}
          <div className="mt-16 pt-10 border-t border-[#262626] grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="p-4 bg-black/60 border border-[#262626]">
              <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
                60 <span className="text-xs text-[#0fa336] font-sans">HZ</span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white mt-1">
                En Tiempo Real
              </div>
              <div className="text-[11px] text-[#7e7e7e] mt-0.5">
                Transmisión continua de físicas y chasis
              </div>
            </div>

            <div className="p-4 bg-black/60 border border-[#262626]">
              <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
                ENLACE <span className="text-xs text-[#0066b1] font-sans">DIRECTO</span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white mt-1">
                USB o Red Local
              </div>
              <div className="text-[11px] text-[#7e7e7e] mt-0.5">
                Sin latencia perceptible en cabina
              </div>
            </div>

            <div className="p-4 bg-black/60 border border-[#262626]">
              <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
                NAVEGADOR <span className="text-xs text-[#1c69d4] font-sans">WEB</span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white mt-1">
                Desde Cualquier Dispositivo
              </div>
              <div className="text-[11px] text-[#7e7e7e] mt-0.5">
                Acceso a boxes en PC, tablet o celular
              </div>
            </div>

            <div className="p-4 bg-black/60 border border-[#262626]">
              <div className="text-xl font-bold font-mono text-[#0fa336] flex items-center gap-1.5">
                CERO <span className="text-xs text-[#bbbbbb] font-sans">PLUGINS</span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white mt-1">
                Detección Automática
              </div>
              <div className="text-[11px] text-[#7e7e7e] mt-0.5">
                Listo para girar con Assetto Corsa
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Franja Tricolor M Divisoria */}
      <div className="w-full h-1 flex shrink-0">
        <div className="flex-1 bg-[#0066b1]" />
        <div className="flex-1 bg-[#1c69d4]" />
        <div className="flex-1 bg-[#e22718]" />
      </div>

      {/* Grilla de Características Concretas */}
      <FeaturesGrid />

      {/* Franja Tricolor M Divisoria */}
      <div className="w-full h-1 flex shrink-0">
        <div className="flex-1 bg-[#0066b1]" />
        <div className="flex-1 bg-[#1c69d4]" />
        <div className="flex-1 bg-[#e22718]" />
      </div>

      {/* Cómo Empezar en Tres Pasos */}
      <QuickStartSteps />

      {/* Franja Tricolor M Divisoria */}
      <div className="w-full h-1 flex shrink-0">
        <div className="flex-1 bg-[#0066b1]" />
        <div className="flex-1 bg-[#1c69d4]" />
        <div className="flex-1 bg-[#e22718]" />
      </div>

      {/* Llamado a Probar Demo */}
      <CtaBand />

      {/* Franja Tricolor M Divisoria */}
      <div className="w-full h-1 flex shrink-0">
        <div className="flex-1 bg-[#0066b1]" />
        <div className="flex-1 bg-[#1c69d4]" />
        <div className="flex-1 bg-[#e22718]" />
      </div>

      {/* Pie de Página Oficial (Footer) */}
      <footer className="border-t border-[#262626] bg-black py-16 text-[#7e7e7e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#262626]">
            <div className="flex items-center gap-3">
              <MSlantedBadge className="h-4" />
              <span className="text-base font-bold uppercase text-white font-mono tracking-[0.15em]">
                APEX<span className="text-[#e22718]">LINK</span>
              </span>
              <span className="text-xs text-[#7e7e7e]">
                • Telemetría en Tiempo Real y Análisis de Vueltas
              </span>
            </div>

            <nav className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider">
              <a href="#caracteristicas" className="text-[#bbbbbb] hover:text-white transition-colors">
                Características
              </a>
              <a href="#como-funciona" className="text-[#bbbbbb] hover:text-white transition-colors">
                Cómo Funciona
              </a>
              <Link href="/hub" className="text-[#bbbbbb] hover:text-white transition-colors">
                En Boxes
              </Link>
              <Link href="/login" className="text-[#e22718] hover:text-white transition-colors">
                Acceso a Cabina
              </Link>
            </nav>
          </div>

          {/* Información de Compatibilidad del Ecosistema */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-[#bbbbbb]">
            <div>
              <div className="font-bold uppercase tracking-wider text-white mb-2">
                Simulador Soportado
              </div>
              <p>
                Diseñado para Assetto Corsa con adquisición directa en tiempo real. Próximamente disponible para otros títulos líderes de simracing.
              </p>
            </div>

            <div>
              <div className="font-bold uppercase tracking-wider text-white mb-2">
                Compatibilidad de Volantes y Pantallas
              </div>
              <p>
                Compatible con bases y aros Logitech, Thrustmaster, Fanatec y Direct Drive (Moza, Simagic, Simucube). Visualizable en monitores, tablets o teléfonos móviles.
              </p>
            </div>
          </div>

          {/* Nota Aclaratoria Legal */}
          <div className="pt-6 border-t border-[#1f1f1f] text-[11px] text-[#555555] flex flex-col md:flex-row items-center justify-between gap-4">
            <p>
              ApexLink es una plataforma independiente desarrollada para la comunidad de simracing. No posee afiliación comercial con Kunos Simulazioni ni con fabricantes de hardware.
            </p>
            <p className="shrink-0 font-mono">
              © 2026 APEXLINK · ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
