"use client";

import { useRef } from "react";
import Link from "next/link";
import { Play, Gauge } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

export function CtaBand() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Entrada del bloque principal con suave escala y fade
      gsap.from(".cta-content", {
        scale: 0.94,
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });

      // Pulso suave y continuo del brillo de fondo
      gsap.to(".cta-ambient-glow", {
        scale: 1.15,
        opacity: 0.18,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="py-24 bg-gradient-to-b from-black via-[#0d0d0d] to-black border-t border-[#262626] relative overflow-hidden"
    >
      {/* Resplandor ambiental rojo M con respiración continua */}
      <div className="cta-ambient-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-gradient-to-r from-[#0066b1]/10 via-[#e22718]/15 to-[#0066b1]/10 blur-3xl pointer-events-none rounded-full opacity-10" />

      <div className="cta-content relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#3c3c3c] text-xs font-bold uppercase tracking-[0.2em] text-[#bbbbbb] glow-m-red-subtle">
          <span className="w-2 h-2 rounded-full bg-[#0fa336] animate-pulse" />
          Probá el Sistema en Vivo
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
          Salí a girar con la <span className="text-[#e22718]">telemetría en tiempo real</span>
        </h2>

        <p className="text-[#bbbbbb] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Iniciá la demostración interactiva con datos reales de Assetto Corsa y explorá el instrumental de cabina y el muro de boxes al instante.
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
            VER ENTORNO DE BOXES
          </Link>
        </div>
      </div>
    </section>
  );
}
