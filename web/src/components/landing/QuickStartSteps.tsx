"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Laptop, Gauge, CheckCircle2 } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const PASOS = [
  {
    numero: "01",
    titulo: "Abrí ApexLink",
    etiqueta: "Inicialización de Enlace",
    descripcion:
      "Iniciá la aplicación en tu computadora. No requiere instalar plugins complejos ni configurar puertos o canales manualmente.",
    icono: Laptop,
    detalleTecnico:
      "Arranque nativo en segundo plano. Detecta automáticamente la memoria compartida de Assetto Corsa.",
    acento: "#0066b1",
  },
  {
    numero: "02",
    titulo: "Salí a pista en el simulador",
    etiqueta: "Acople Automático",
    descripcion:
      "Abrí Assetto Corsa y salí del pitlane. El enlace se acopla automáticamente y empieza a registrar los datos del auto desde la primera curva.",
    icono: Play,
    detalleTecnico:
      "Adquisición continua a 60 Hz de físicas, neumáticos, suspensión y electrónica sin pérdida de paquetes.",
    acento: "#1c69d4",
  },
  {
    numero: "03",
    titulo: "Mirá tu telemetría en tiempo real",
    etiqueta: "Monitoreo en Vivo",
    descripcion:
      "Seguí tus tiempos y el estado del chasis en el display de cabina, o abrí el navegador para monitorear la tanda en vivo desde el muro de boxes.",
    icono: Gauge,
    detalleTecnico:
      "Acceso instantáneo desde cualquier pantalla, tablet o navegador web con retención de picos y círculo de Kamm.",
    acento: "#e22718",
  },
];

export function QuickStartSteps() {
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const pinWrapper = pinWrapperRef.current;
    if (!pinWrapper) return;

    const ctx = gsap.context(() => {
      const items = itemsRef.current.filter((el): el is HTMLDivElement => Boolean(el));
      const totalSteps = PASOS.length;

      // Estado inicial: primer ítem visible, siguientes ocultos abajo
      items.forEach((item, i) => {
        if (!item) return;
        if (i === 0) {
          gsap.set(item, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            pointerEvents: "auto",
          });
        } else {
          gsap.set(item, {
            opacity: 0,
            y: 75,
            scale: 0.96,
            filter: "blur(6px)",
            pointerEvents: "none",
          });
        }
      });

      let lastStep = -1;

      // Timeline de Pin y Scroll con Snap fluido
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapper,
          start: "top 22%",
          end: "+=1800",
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          snap: {
            snapTo: (value) => {
              const stepFraction = 1 / (totalSteps - 1);
              return Math.round(value / stepFraction) * stepFraction;
            },
            duration: { min: 0.2, max: 0.4 },
            ease: "power2.out",
          },
          onUpdate: (self) => {
            const p = self.progress;
            const stepIndex = Math.min(
              totalSteps - 1,
              Math.max(0, Math.round(p * (totalSteps - 1)))
            );
            setActiveStep(stepIndex);

            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.min(
                100,
                Math.max(0, p * 100)
              )}%`;
            }

            // Iluminación dinámica que se mueve suavemente con el paso (throttled por cambio de paso)
            if (spotlightRef.current && stepIndex !== lastStep) {
              lastStep = stepIndex;
              const yOffset = (stepIndex - 1) * 45;
              gsap.to(spotlightRef.current, {
                y: yOffset,
                opacity: 0.35 + (stepIndex % 2) * 0.15,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          },
        },
      });

      // Transiciones verticales sincronizadas entre pasos
      for (let i = 0; i < totalSteps - 1; i++) {
        const currentItem = items[i];
        const nextItem = items[i + 1];
        if (!currentItem || !nextItem) continue;

        tl.to(
          currentItem,
          {
            y: -75,
            opacity: 0,
            scale: 0.96,
            filter: "blur(6px)",
            pointerEvents: "none",
            duration: 1,
            ease: "power2.inOut",
          },
          `step-${i}`
        );

        tl.to(
          nextItem,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            pointerEvents: "auto",
            duration: 1,
            ease: "power2.inOut",
          },
          `step-${i}`
        );
      }
    }, pinWrapperRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="como-funciona"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-[#080808] to-black overflow-visible"
    >
      {/* Resplandor ambiental de fondo a la derecha */}
      <div
        className="absolute top-1/3 right-10 w-[550px] h-[550px] rounded-full blur-[150px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(226,39,24,0.12) 0%, rgba(0,102,177,0.06) 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Encabezado libre de scroll alineado a la derecha */}
        <div className="max-w-3xl mb-14 sm:mb-16 text-right ml-auto flex flex-col items-end">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#3c3c3c] text-[#e22718] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 glow-m-red-subtle">
            Simplicidad Operativa
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white leading-[1.12]">
            Cómo empezar en <span className="text-[#e22718]">tres pasos</span>
          </h2>
          <p className="text-[#bbbbbb] text-sm sm:text-base mt-4 leading-relaxed max-w-2xl text-right">
            Sin configuraciones engorrosas ni exportaciones manuales de archivos. Todo está pensado para que salgas a girar de inmediato.
          </p>
        </div>

        {/* Contenedor Pinneado con Carrusel Vertical alineado a la derecha */}
        <div
          ref={pinWrapperRef}
          className="relative max-w-4xl w-full py-4 flex flex-col items-end ml-auto"
        >
          {/* Luz focal dinámica */}
          <div
            ref={spotlightRef}
            className="absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none transition-all duration-700 ease-out"
            style={{
              background:
                "radial-gradient(circle, rgba(226,39,24,0.2) 0%, rgba(28,105,212,0.1) 45%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* Barra de progreso continua con marcadores */}
          <div className="w-full max-w-xl mb-12 sm:mb-14 ml-auto">
            <div className="relative h-[3px] w-full bg-[#262626] rounded-full overflow-visible">
              <div
                ref={progressBarRef}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718] shadow-[0_0_15px_rgba(226,39,24,0.4)] rounded-full"
                style={{ width: "0%" }}
              />
              <div className="absolute inset-0 flex justify-between items-center -top-[3px]">
                {PASOS.map((paso, i) => (
                  <span
                    key={paso.numero}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i <= activeStep
                        ? "bg-[#e22718] shadow-[0_0_10px_#e22718] scale-125"
                        : "bg-[#3c3c3c] scale-100"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[#7e7e7e] mt-2 font-bold tracking-wider uppercase">
              <span>01 <span className="hidden sm:inline">Inicialización</span></span>
              <span>02 <span className="hidden sm:inline">Enlace</span></span>
              <span>03 <span className="hidden sm:inline">Telemetría</span></span>
            </div>
          </div>

          {/* Escenario del Carrusel Vertical */}
          <div className="relative w-full h-[400px] sm:h-[320px] flex items-center justify-end">
            {PASOS.map((item, index) => {
              const Icono = item.icono;
              return (
                <div
                  key={item.numero}
                  ref={(el) => {
                    itemsRef.current[index] = el;
                  }}
                  style={{
                    opacity: index === 0 ? 1 : 0,
                    pointerEvents: index === 0 ? "auto" : "none",
                  }}
                  className="absolute inset-0 flex flex-col justify-center items-end text-right will-change-[transform,opacity,filter]"
                >
                  {/* Ícono y Badge del Paso invertidos para alineación a la derecha */}
                  <div className="flex flex-row-reverse items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-black/80 border border-[#3c3c3c] shadow-[0_0_24px_rgba(226,39,24,0.25)] flex items-center justify-center shrink-0">
                      <Icono className="w-5 h-5 text-[#e22718]" />
                    </div>

                    <div className="flex flex-col items-end text-right">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#e22718] font-bold">
                        PASO {item.numero} · {item.etiqueta}
                      </span>
                      <span className="text-[11px] text-[#7e7e7e] font-mono uppercase">
                        FASE {index + 1} DE {PASOS.length}
                      </span>
                    </div>
                  </div>

                  {/* Título Principal */}
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-3 text-right">
                    {item.titulo}
                  </h3>

                  {/* Descripción */}
                  <p className="text-sm sm:text-base text-[#bbbbbb] leading-relaxed max-w-2xl mb-5 text-right">
                    {item.descripcion}
                  </p>

                  {/* Bloque de Detalle Técnico con Rayo de Acento M hacia la derecha */}
                  <div className="relative border-r-2 border-[#e22718] pr-4 sm:pr-5 py-2.5 bg-gradient-to-l from-[#e22718]/12 via-[#e22718]/3 to-transparent rounded-l-xl max-w-2xl text-right flex flex-col items-end">
                    <div className="flex flex-row-reverse items-center gap-2 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0fa336]" />
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-white">
                        Ejecución en Cabina
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#bbbbbb] leading-relaxed text-right">
                      {item.detalleTecnico}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
