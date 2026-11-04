"use client";

import { useRef } from "react";
import { Play, Laptop, Gauge } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

export function QuickStartSteps() {
  const containerRef = useRef<HTMLDivElement>(null);

  const pasos = [
    {
      numero: "01",
      titulo: "Abrí ApexLink",
      descripcion:
        "Iniciá la aplicación en tu computadora. No requiere instalar plugins complejos ni configurar puertos o canales manualmente.",
      icono: Laptop,
    },
    {
      numero: "02",
      titulo: "Salí a pista en el simulador",
      descripcion:
        "Abrí Assetto Corsa y salí del pitlane. El enlace se acopla automáticamente y empieza a registrar los datos del auto desde la primera curva.",
      icono: Play,
    },
    {
      numero: "03",
      titulo: "Mirá tu telemetría en tiempo real",
      descripcion:
        "Seguí tus tiempos y el estado del chasis en el display de cabina, o abrí el navegador para monitorear la tanda en vivo desde el muro de boxes.",
      icono: Gauge,
    },
  ];

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Encabezado
      gsap.fromTo(
        ".steps-header",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Tarjetas de pasos con leve stagger
      gsap.fromTo(
        ".step-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );

      // Línea de progreso interactiva que se dibuja al scrollear
      gsap.fromTo(
        ".steps-progress-bar",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: ".steps-cards-container",
            start: "top 80%",
            end: "bottom 70%",
            scrub: 0.6,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="como-funciona"
      ref={containerRef}
      className="py-24 bg-gradient-to-b from-black via-[#080808] to-black relative overflow-hidden"
    >
      {/* Luz difusa de fondo */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-[#e22718]/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="steps-header text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#3c3c3c] text-[#e22718] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 glow-m-red-subtle">
            Simplicidad Operativa
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">
            Cómo empezar en <span className="text-[#e22718]">tres pasos</span>
          </h2>
          <p className="text-[#bbbbbb] text-sm sm:text-base mt-4 leading-relaxed">
            Sin configuraciones engorrosas ni exportaciones manuales de archivos. Todo está pensado para que salgas a girar de inmediato.
          </p>
        </div>

        {/* Línea conectora entre pasos (visible en pantallas medianas y grandes) */}
        <div className="hidden md:block relative mb-6 px-12">
          <div className="h-[2px] w-full bg-[#262626] overflow-hidden">
            <div className="steps-progress-bar h-full w-full bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718]" />
          </div>
        </div>

        <div className="steps-cards-container grid grid-cols-1 md:grid-cols-3 gap-6">
          {pasos.map((paso, idx) => {
            const Icono = paso.icono;
            return (
              <div
                key={idx}
                className="step-card card-cockpit-gradient border-sheen p-8 flex flex-col justify-between relative group hover:glow-m-red-subtle transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Acento superior en hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e22718] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="step-number text-3xl font-mono font-bold text-[#e22718] drop-shadow-[0_0_12px_rgba(226,39,24,0.4)]">
                      {paso.numero}
                    </span>
                    <div className="w-10 h-10 bg-black/70 border border-[#3c3c3c] group-hover:border-[#e22718]/50 flex items-center justify-center transition-colors">
                      <Icono className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold uppercase text-white tracking-tight mb-3">
                    {paso.titulo}
                  </h3>

                  <p className="text-xs leading-relaxed text-[#bbbbbb]">
                    {paso.descripcion}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#262626] text-[10px] uppercase font-bold tracking-wider text-[#7e7e7e]">
                  Paso {paso.numero} de 03
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
