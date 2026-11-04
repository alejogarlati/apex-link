"use client";

import { useState, useRef, useEffect } from "react";
import {
  Activity,
  LineChart,
  Target,
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
      "Cuadro de instrumentos para el aro del volante: marcha gigante central para lectura inmediata, 15 luces de corte estroboscópicas progresivas, barra dinámica de delta y temperaturas térmicas de cubiertas.",
    especificacion:
      "Latencia sub-16ms. Visualización optimizada para pantallas dedicadas o celulares montados con refresco a 60 Hz.",
    color: "text-[#e22718]",
    bordeColor: "border-[#e22718]",
    glowColor: "rgba(226, 39, 24, 0.25)",
    idAnchor: "ddu",
  },
  {
    numero: "02",
    icono: Activity,
    etiqueta: "En Vivo · Boxes",
    titulo: "Live Pitwall en Tiempo Real",
    descripcion:
      "Monitoreo a 60 Hz desde el navegador: barras de acelerador y freno con retención de picos, fuerzas de aceleración lateral y longitudinal (Círculo de Kamm), presiones de inflado y cronometraje de stint con mapa en vivo.",
    especificacion:
      "Adquisición continua por websocket local. Cálculo dinámico de fuerzas centrífugas y vector de agarre en tiempo real.",
    color: "text-[#0fa336]",
    bordeColor: "border-[#0fa336]",
    glowColor: "rgba(15, 163, 54, 0.25)",
    idAnchor: "pitwall",
  },
  {
    numero: "03",
    icono: LineChart,
    etiqueta: "Post-Sesión · Datos",
    titulo: "Laboratorio Analítico 2D",
    descripcion:
      "Telemetría normalizada en dominio de distancia métrica (0 a L metros de pista). Compará tu vuelta rápida contra tu referencia curva por curva, con trazada 2D y mapas de color continuos de aceleración y frenada.",
    especificacion:
      "Alineación métrica exacta punto a punto. Elimina el desfase temporal para comparar el metro exacto de frenada.",
    color: "text-[#0066b1]",
    bordeColor: "border-[#0066b1]",
    glowColor: "rgba(0, 102, 177, 0.25)",
    idAnchor: "analisis",
  },
  {
    numero: "04",
    icono: Target,
    etiqueta: "Post-Sesión · Curvas",
    titulo: "Inspector de Curvas",
    descripcion:
      "Hacé clic en cualquier curva del trazado y mirá la velocidad de entrada, el metro exacto donde empezaste a frenar, la velocidad mínima en el ápice y cómo abriste el acelerador hacia la recta siguiente.",
    especificacion:
      "Segmentación algorítmica de vértices. Desglose milimétrico de trail braking y punto de aplicación de potencia.",
    color: "text-[#1c69d4]",
    bordeColor: "border-[#1c69d4]",
    glowColor: "rgba(28, 105, 212, 0.25)",
    idAnchor: "inspector",
  },
  {
    numero: "05",
    icono: Trophy,
    etiqueta: "Progreso · Historial",
    titulo: "Métricas y Consistencia",
    descripcion:
      "Registro ordenado de tus tandas en pista, clasificación de vueltas válidas e inválidas, y cálculo de consistencia vuelta a vuelta para identificar errores y evaluar tu evolución como piloto.",
    especificacion:
      "Índice de desviación de ritmo y sectorización automática. Registro persistente sin necesidad de exportar planillas.",
    color: "text-[#f4b400]",
    bordeColor: "border-[#f4b400]",
    glowColor: "rgba(244, 180, 0, 0.25)",
    idAnchor: "metricas",
  },
  {
    numero: "06",
    icono: Sliders,
    etiqueta: "Hardware · Pantallas",
    titulo: "Compatibilidad Universal",
    descripcion:
      "Compatible con bases Logitech, Thrustmaster, Fanatec y Direct Drive (Moza, Simagic, Simucube). Podés ver el instrumental en cualquier celular, tablet o monitor secundario sin necesidad de adaptadores privativos.",
    especificacion:
      "Ecosistema abierto con protocolo estándar. Acceso inmediato desde Chrome, Safari o Firefox en cualquier red.",
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
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const pinWrapper = pinWrapperRef.current;
    if (!pinWrapper) return;

    const ctx = gsap.context(() => {
      const items = itemsRef.current.filter((el): el is HTMLDivElement => Boolean(el));
      const totalSteps = CARACTERISTICAS.length;

      // Estado inicial: primer ítem visible, siguientes ocultos abajo con blur
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

      // 2. Transiciones verticales tipo carrusel entre las 6 características con umbral
      for (let i = 0; i < totalSteps - 1; i++) {
        const currentItem = items[i];
        const nextItem = items[i + 1];
        if (!currentItem || !nextItem) continue;

        tl.addLabel(`step-${i}-trans`);

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

        // Umbral de retención estática en el keyframe de la tarjeta que acaba de entrar
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

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Encabezado libre de scroll */}
        <div className="max-w-3xl mb-14 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#3c3c3c] text-[#e22718] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 glow-m-red-subtle">
            Herramientas Concretas de Pista
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white leading-[1.12]">
            Todo lo que necesitás para <span className="text-[#e22718]">mejorar tus vueltas</span>
          </h2>
          <p className="text-[#bbbbbb] text-sm sm:text-base mt-4 leading-relaxed max-w-2xl">
            Datos claros y precisos organizados para ayudarte a entender qué hace tu auto y cómo optimizar cada sector del circuito.
          </p>
        </div>

        {/* Contenedor Pinneado con Carrusel Vertical */}
        <div
          ref={pinWrapperRef}
          className="relative max-w-4xl w-full py-4 flex flex-col items-start"
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
          <div className="w-full max-w-xl mb-12 sm:mb-14">
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
              <span>04 <span className="hidden sm:inline">Curvas</span></span>
              <span>05 <span className="hidden sm:inline">Métricas</span></span>
              <span>06 <span className="hidden sm:inline">Hardware</span></span>
            </div>
          </div>

          {/* Escenario del Carrusel Vertical */}
          <div className="relative w-full h-[440px] sm:h-[340px] flex items-center justify-start">
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
                  <p className="text-sm sm:text-base text-[#bbbbbb] leading-relaxed max-w-2xl mb-5">
                    {item.descripcion}
                  </p>

                  {/* Bloque de Detalle Técnico */}
                  <div className="relative border-l-2 border-[#e22718] pl-4 sm:pl-5 py-2.5 bg-gradient-to-r from-[#e22718]/12 via-[#e22718]/3 to-transparent rounded-r-xl max-w-2xl">
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
        </div>
      </div>
    </section>
  );
}
