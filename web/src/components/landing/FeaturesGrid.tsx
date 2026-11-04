"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Activity,
  LineChart,
  Gauge,
  Sliders,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const CARACTERISTICAS = [
  {
    numero: "01",
    icono: Gauge,
    etiqueta: "En Cabina · Volante",
    titulo: "Instrumental Digital DDU",
    descripcion:
      "Tablero para el volante o el celular con marcha en grande, barra de delta en vivo contra tu vuelta rápida, luces de corte progresivas y temperatura de cada neumático.",
    especificacion:
      "Refresco continuo a 60 Hz con latencia menor a 16 ms en celulares, tablets o displays dedicados.",
    imagen: "/landing/features/feature-01-ddu.webp",
    imagenAlt: "Instrumental Digital DDU en volante de competición",
    hudTag: "DDU-01 // COCKPIT TELEMETRY",
    color: "text-[#e22718]",
    bordeColor: "border-[#e22718]",
    glowColor: "rgba(226, 39, 24, 0.25)",
    idAnchor: "ddu",
  },
  {
    numero: "02",
    icono: Activity,
    etiqueta: "En Vivo · Boxes",
    titulo: "Live Pitwall",
    descripcion:
      "Seguí la tanda desde el navegador con telemetría de boxes en vivo: barras de acelerador y freno con picos de presión, fuerzas G, presiones de neumáticos y ubicación del auto en el mapa.",
    especificacion:
      "Transmisión por websocket local a 60 Hz. Calcula transferencias de carga y vector de agarre en tiempo real.",
    imagen: "/landing/features/feature-02-pitwall.jpg",
    imagenAlt: "Pantalla de Live Pitwall en tiempo real con telemetría de boxes",
    hudTag: "PIT-02 // LIVE STREAM 60HZ",
    color: "text-[#0fa336]",
    bordeColor: "border-[#0fa336]",
    glowColor: "rgba(15, 163, 54, 0.25)",
    idAnchor: "pitwall",
  },
  {
    numero: "03",
    icono: LineChart,
    etiqueta: "Post-Sesión · Datos",
    titulo: "Telemetría 2D",
    descripcion:
      "Compará tu mejor vuelta contra tu referencia metro a metro en lugar de por tiempo. Superponé velocidad, aceleración y frenada sobre el trazado para ver con exactitud dónde perdiste tiempo.",
    especificacion:
      "Alineación por distancia en pista. Muestra si frenaste antes o si abriste la dirección con menos tracción.",
    imagen: "/landing/features/feature-03-lab2d.jpg",
    imagenAlt: "Gráficos de telemetría normalizada 2D y comparación de vueltas",
    hudTag: "LAB-03 // 2D TRACE MATRIX",
    color: "text-[#0066b1]",
    bordeColor: "border-[#0066b1]",
    glowColor: "rgba(0, 102, 177, 0.25)",
    idAnchor: "analisis",
  },
  {
    numero: "04",
    icono: Trophy,
    etiqueta: "Progreso · Historial",
    titulo: "Ritmo y Consistencia",
    descripcion:
      "Historial completo de tus sesiones: vueltas limpias, tiempos anulados por límites de pista y dispersión de ritmo para verificar si sos constante en tandas largas.",
    especificacion:
      "Desviación estándar de ritmo por sector y registro automático sin exportar planillas de cálculo.",
    imagen: "/landing/features/feature-04-ritmo.jpg",
    imagenAlt: "Historial de vueltas, ritmo y consistencia por tanda",
    hudTag: "RACE-04 // CONSISTENCY INDEX",
    color: "text-[#f4b400]",
    bordeColor: "border-[#f4b400]",
    glowColor: "rgba(244, 180, 0, 0.25)",
    idAnchor: "metricas",
  },
  {
    numero: "05",
    icono: Sliders,
    etiqueta: "Hardware · Pantallas",
    titulo: "Compatibilidad de Hardware",
    descripcion:
      "Funciona con bases Logitech, Thrustmaster, Fanatec y Direct Drive (Moza, Simagic, Simucube). Abrí la interfaz en cualquier teléfono, tablet o monitor sin cables ni apps extras.",
    especificacion:
      "Funciona sobre el navegador web en tu red local, sin instalar software en las pantallas secundarias.",
    imagen: "/landing/features/feature-05-hardware.jpg",
    imagenAlt: "Compatibilidad universal con hardware de simulación y pantallas",
    hudTag: "IO-05 // HARDWARE PROTOCOL",
    color: "text-white",
    bordeColor: "border-[#7e7e7e]",
    glowColor: "rgba(255, 255, 255, 0.2)",
    idAnchor: "compatibilidad",
  },
];

export function FeaturesGrid() {
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const pinWrapper = pinWrapperRef.current;
    if (!pinWrapper) return;

    const ctx = gsap.context(() => {
      const items = itemsRef.current.filter((el): el is HTMLDivElement => Boolean(el));
      const images = imageItemsRef.current.filter((el): el is HTMLDivElement => Boolean(el));
      const totalSteps = CARACTERISTICAS.length;

      // Estado inicial de textos: primer ítem visible, siguientes ocultos abajo con blur
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

      // Estado inicial de imágenes: primera visible con escala 1, siguientes ocultas con blur y escala suave
      images.forEach((img, i) => {
        if (!img) return;
        if (i === 0) {
          gsap.set(img, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            pointerEvents: "auto",
          });
        } else {
          gsap.set(img, {
            opacity: 0,
            scale: 0.98,
            filter: "blur(8px)",
            pointerEvents: "none",
          });
        }
      });

      let lastStep = -1;

      const DWELL_TIME = 0.6; // Umbral de permanencia estática en cada keyframe (scroll threshold)
      const TRANS_TIME = 1.0; // Duración de la transición vertical entre características
      const cycleTime = TRANS_TIME + DWELL_TIME;
      const totalDuration = DWELL_TIME + (totalSteps - 1) * cycleTime;

      // Puntos de snap en el centro de descanso de cada tarjeta
      const snapPoints = Array.from({ length: totalSteps }, (_, i) => {
        if (i === 0) return 0;
        if (i === totalSteps - 1) return 1;
        return (DWELL_TIME / 2 + i * cycleTime) / totalDuration;
      });

      // Timeline de Pin y Scroll con Snap fluido y umbral de bloqueo
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapper,
          start: "top 22%",
          end: "+=3200",
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          snap: {
            snapTo: (value) => {
              return snapPoints.reduce((prev, curr) =>
                Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
              );
            },
            duration: { min: 0.25, max: 0.45 }, // Bloqueo durante medio segundo o menos (estándar)
            delay: 0.05,
            ease: "power2.out",
          },
          onUpdate: (self) => {
            const p = self.progress;

            // Determinar la característica activa según la proximidad a los puntos de snap
            let stepIndex = 0;
            const firstPoint = snapPoints[0] ?? 0;
            let minDistance = Math.abs(p - firstPoint);
            for (let i = 1; i < totalSteps; i++) {
              const currentPoint = snapPoints[i] ?? 0;
              const dist = Math.abs(p - currentPoint);
              if (dist < minDistance) {
                minDistance = dist;
                stepIndex = i;
              }
            }
            setActiveStep(stepIndex);

            if (progressBarRef.current) {
              const cycle = TRANS_TIME + DWELL_TIME;
              const t = Math.max(0, Math.min(1, p)) * totalDuration;
              let barPercent = 0;

              if (t <= DWELL_TIME) {
                // Permanencia en la característica 0 durante el umbral
                barPercent = 0;
              } else {
                const elapsed = t - DWELL_TIME;
                const cycleIndex = Math.floor(elapsed / cycle);
                const cycleTime = elapsed % cycle;

                if (cycleIndex >= totalSteps - 1) {
                  // Permanencia en la última característica tras finalizar
                  barPercent = 100;
                } else {
                  const fromPercent = (cycleIndex / (totalSteps - 1)) * 100;
                  const toPercent = ((cycleIndex + 1) / (totalSteps - 1)) * 100;

                  if (cycleTime < TRANS_TIME) {
                    // Transición sincronizada con la misma curva easing que las tarjetas
                    const rawProgress = cycleTime / TRANS_TIME;
                    const easedProgress =
                      rawProgress < 0.5
                        ? 2 * rawProgress * rawProgress
                        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
                    barPercent =
                      fromPercent + easedProgress * (toPercent - fromPercent);
                  } else {
                    // Umbral de descanso estático en el marcador de la característica
                    barPercent = toPercent;
                  }
                }
              }

              progressBarRef.current.style.width = `${Math.min(
                100,
                Math.max(0, barPercent)
              )}%`;
            }

            // Luz focal que sigue dinámicamente al paso (throttled por cambio de paso)
            if (spotlightRef.current && stepIndex !== lastStep) {
              lastStep = stepIndex;
              const yOffset = (stepIndex - 2.5) * 35;
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

      // 1. Umbral inicial de descanso en la característica 0
      tl.to({}, { duration: DWELL_TIME });

      // 2. Transiciones verticales tipo carrusel sincronizadas entre texto e imagen con umbral
      for (let i = 0; i < totalSteps - 1; i++) {
        const currentItem = items[i];
        const nextItem = items[i + 1];
        const currentImg = images[i];
        const nextImg = images[i + 1];

        if (!currentItem || !nextItem) continue;

        tl.addLabel(`step-${i}-trans`);

        // Animación de salida del texto actual hacia arriba
        tl.to(
          currentItem,
          {
            y: -75,
            opacity: 0,
            scale: 0.96,
            filter: "blur(6px)",
            pointerEvents: "none",
            duration: TRANS_TIME,
            ease: "power2.inOut",
          },
          `step-${i}-trans`
        );

        // Animación de entrada del siguiente texto hacia el centro
        tl.to(
          nextItem,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            pointerEvents: "auto",
            duration: TRANS_TIME,
            ease: "power2.inOut",
          },
          `step-${i}-trans`
        );

        // Animación sincronizada de la imagen actual (fade out suave hacia el fondo negro)
        if (currentImg) {
          tl.to(
            currentImg,
            {
              opacity: 0,
              scale: 0.98,
              filter: "blur(8px)",
              pointerEvents: "none",
              duration: TRANS_TIME,
              ease: "power2.inOut",
            },
            `step-${i}-trans`
          );
        }

        // Animación sincronizada de la imagen entrante (fade in nítido)
        if (nextImg) {
          tl.to(
            nextImg,
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              pointerEvents: "auto",
              duration: TRANS_TIME,
              ease: "power2.inOut",
            },
            `step-${i}-trans`
          );
        }

        // Umbral de retención estática en el keyframe de la tarjeta y la imagen que acaban de entrar
        tl.to({}, { duration: DWELL_TIME });
      }
    }, pinWrapperRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="caracteristicas"
      className="relative pt-16 sm:pt-20 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black/60 via-[#0d0d0d]/70 to-black/95 border-t border-[#262626] overflow-visible scroll-mt-[15vh]"
    >
      {/* Resplandor ambiental de fondo */}
      <div
        className="absolute top-1/3 left-10 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,102,177,0.12) 0%, rgba(226,39,24,0.06) 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Encabezado libre de scroll */}
        <div className="max-w-3xl mb-14 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#3c3c3c] text-[#e22718] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 glow-m-red-subtle">
            Telemetría en Pista y Boxes
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white leading-[1.12]">
            Herramientas para <span className="text-[#e22718]">bajar tus tiempos</span>
          </h2>
          <p className="text-[#bbbbbb] text-sm sm:text-base mt-4 leading-relaxed max-w-2xl">
            Aceleración, frenada, presiones y tiempos por sector. Sin planillas ni rodeos: solo lo que necesitás ver para corregir tu trazada.
          </p>
        </div>

        {/* Contenedor Pinneado con Carrusel Vertical */}
        <div
          ref={pinWrapperRef}
          className="relative w-full py-4 flex flex-col items-start"
        >
          {/* Luz focal dinámica */}
          <div
            ref={spotlightRef}
            className="absolute -left-20 top-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ease-out"
            style={{
              background:
                "radial-gradient(circle, rgba(0,102,177,0.2) 0%, rgba(226,39,24,0.1) 45%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* Barra de progreso continua con 6 marcadores */}
          <div className="w-full max-w-xl mb-10 sm:mb-12">
            <div className="relative h-[3px] w-full bg-[#262626] rounded-full overflow-visible">
              <div
                ref={progressBarRef}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718] shadow-[0_0_15px_rgba(226,39,24,0.4)] rounded-full"
                style={{ width: "0%" }}
              />
              <div className="absolute inset-0 flex justify-between items-center -top-[3px]">
                {CARACTERISTICAS.map((item, i) => (
                  <span
                    key={item.numero}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i <= activeStep
                        ? "bg-[#e22718] shadow-[0_0_10px_#e22718] scale-125"
                        : "bg-[#3c3c3c] scale-100"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#7e7e7e] mt-2 font-bold tracking-wider uppercase">
              <span>01 <span className="hidden sm:inline">DDU</span></span>
              <span>02 <span className="hidden sm:inline">Pitwall</span></span>
              <span>03 <span className="hidden sm:inline">Lab 2D</span></span>
              <span>04 <span className="hidden sm:inline">Consistencia</span></span>
              <span>05 <span className="hidden sm:inline">Hardware</span></span>
            </div>
          </div>

          {/* Escenario del Carrusel: Columna de Texto a la izquierda y Columna de Imágenes en el margen derecho */}
          <div className="relative w-full h-[460px] sm:h-[420px] lg:h-[440px] grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Columna Izquierda: Tarjetas de texto apiladas */}
            <div className="relative w-full h-full md:col-span-7 lg:col-span-6 flex items-center justify-start z-10">
              {CARACTERISTICAS.map((item, index) => {
                const Icono = item.icono;
                return (
                  <div
                    key={item.numero}
                    id={item.idAnchor}
                    ref={(el) => {
                      itemsRef.current[index] = el;
                    }}
                    style={{
                      opacity: index === 0 ? 1 : 0,
                      pointerEvents: index === 0 ? "auto" : "none",
                    }}
                    className="absolute inset-0 flex flex-col justify-center items-start text-left will-change-[transform,opacity,filter]"
                  >
                    {/* Ícono y Badge del Módulo */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 bg-black/80 border border-[#3c3c3c] shadow-[0_0_24px_rgba(226,39,24,0.25)] flex items-center justify-center shrink-0">
                        <Icono className={`w-5 h-5 ${item.color}`} />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#e22718] font-bold">
                          MÓDULO {item.numero} · {item.etiqueta}
                        </span>
                        <span className="text-[11px] text-[#7e7e7e] font-mono uppercase">
                          HERRAMIENTA {index + 1} DE {CARACTERISTICAS.length}
                        </span>
                      </div>
                    </div>

                    {/* Título Principal */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-3">
                      {item.titulo}
                    </h3>

                    {/* Descripción */}
                    <p className="text-sm sm:text-base text-[#bbbbbb] leading-relaxed max-w-xl mb-5">
                      {item.descripcion}
                    </p>

                    {/* Bloque de Detalle Técnico */}
                    <div className="relative border-l-2 border-[#e22718] pl-4 sm:pl-5 py-2.5 bg-gradient-to-r from-[#e22718]/12 via-[#e22718]/3 to-transparent rounded-r-xl max-w-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0fa336]" />
                        <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-white">
                          Especificación de Telemetría
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#bbbbbb] leading-relaxed">
                        {item.especificacion}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Columna Derecha: Imágenes sin caja que ocupan todo el alto del container y se funden con el fondo negro */}
            <div className="relative w-full h-full md:col-span-5 lg:col-span-6 hidden md:flex items-center justify-center overflow-visible pointer-events-none">
              {CARACTERISTICAS.map((item, index) => (
                <div
                  key={`img-${item.numero}`}
                  ref={(el) => {
                    imageItemsRef.current[index] = el;
                  }}
                  style={{
                    opacity: index === 0 ? 1 : 0,
                    pointerEvents: index === 0 ? "auto" : "none",
                  }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center will-change-[transform,opacity,filter]"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Resplandor ambiental de color correspondiente a cada módulo */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-full blur-3xl pointer-events-none opacity-20"
                      style={{ background: item.glowColor }}
                    />

                    {/* Imagen de telemetría con máscara de desvanecimiento total antes de los bordes */}
                    <div
                      className="relative w-full h-full"
                      style={{
                        maskImage:
                          "radial-gradient(ellipse 55% 46% at 50% 50%, black 15%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.12) 75%, transparent 88%)",
                        WebkitMaskImage:
                          "radial-gradient(ellipse 48% 46% at 50% 50%, black 15%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.12) 75%, transparent 88%)",
                      }}
                    >
                      <Image
                        src={item.imagen}
                        alt={item.imagenAlt}
                        fill
                        sizes="(max-width: 1024px) 50vw, 650px"
                        priority={index === 0}
                        className="object-cover object-center filter brightness-[0.95] contrast-[1.08]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
