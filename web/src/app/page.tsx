"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Play, Gauge } from "lucide-react";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { QuickStartSteps } from "@/components/landing/QuickStartSteps";
import { CtaBand } from "@/components/landing/CtaBand";
import { gsap, ScrollTrigger, ScrollToPlugin, useGSAP } from "@/lib/gsap";

const HERO_VIDEO_FPS = 24;
const HERO_VIDEO_STOP_FRAME = 300;
const HERO_VIDEO_STOP_TIME = HERO_VIDEO_STOP_FRAME / HERO_VIDEO_FPS;
const HERO_LOCK_SCROLL_PX = 500;   // Bloqueo de 500px tras finalizar el video
const HERO_VIDEO_SCROLL_PX = 1300; // Scroll para el giro del auto
const HERO_TOTAL_PIN_PX = HERO_VIDEO_SCROLL_PX + HERO_LOCK_SCROLL_PX; // 1800px

export default function PaginaInicio() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const topNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Asegurar recálculo de alturas exactas de ScrollTrigger tras montaje y carga
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useGSAP(
    () => {
      // 1. Timeline de entrada inicial del Hero (Badge, H1 y Prompt de scroll)
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(".hero-badge", {
          y: -20,
          opacity: 0,
          duration: 0.6,
          clearProps: "opacity,transform",
        })
        .from(
          ".hero-title",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power4.out",
            clearProps: "opacity,transform",
          },
          "-=0.3"
        )
        .from(
          ".hero-scroll-prompt",
          {
            y: 15,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.2"
        );

      // 2. Control de giro de video (scrub) + Bloqueo de scroll 500px + Fade in de hero-subtitle & CTAs
      const video = heroVideoRef.current;
      const stage = heroStageRef.current;
      let cleanupVideoListeners: (() => void) | undefined;

      if (stage && video) {
        video.pause();
        video.currentTime = 0;

        const playhead = { frame: 0 };
        let desiredTime = 0;

        const syncVideoFrame = () => {
          if (!video) return;
          const duration = video.duration || HERO_VIDEO_STOP_TIME;
          const target = Math.min(Math.max(0, desiredTime), duration);
          if (!video.seeking && Math.abs(video.currentTime - target) > 0.004) {
            try {
              video.currentTime = target;
            } catch {
              // Ignorar buffers transitorios
            }
          }
        };

        const handleSeeked = () => {
          if (!video) return;
          const duration = video.duration || HERO_VIDEO_STOP_TIME;
          const target = Math.min(Math.max(0, desiredTime), duration);
          if (Math.abs(video.currentTime - target) > 0.004) {
            try {
              video.currentTime = target;
            } catch {
              // Ignorar buffers transitorios
            }
          }
        };

        const handleLoadedMetadata = () => {
          video.pause();
          const targetFrame = Math.min(
            HERO_VIDEO_STOP_FRAME,
            Math.max(0, Math.round(playhead.frame))
          );
          desiredTime = targetFrame / HERO_VIDEO_FPS;
          syncVideoFrame();
          ScrollTrigger.refresh();
        };

        video.addEventListener("seeked", handleSeeked);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        if (video.readyState >= 1) {
          handleLoadedMetadata();
        } else {
          video.load();
        }

        // Timeline ScrollTrigger principal que pinnea el Hero
        // Total scroll: HERO_TOTAL_PIN_PX (1300px video + 500px bloqueo/lectura)
        const stageTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: `+=${HERO_TOTAL_PIN_PX}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.35,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 3,
          },
        });

        // 0. Al empezar a scrollear: esconder TopNav rápidamente (primeros 0.1s del TL ~ 130px de scroll)
        if (topNavRef.current) {
          stageTl.to(
            topNavRef.current,
            {
              yPercent: -100,
              opacity: 0,
              duration: 0.1,
              ease: "power2.inOut",
            },
            0
          );
        }

        // Fase 1 (0 -> 1.3s del TL ~ 1300px): Girar auto hasta frame 300 y aplicar zoom de hasta el 30% (scale 1.30)
        stageTl.to(playhead, {
          frame: HERO_VIDEO_STOP_FRAME,
          duration: 1.3,
          ease: "none",
          onUpdate: () => {
            const clampedFrame = Math.min(
              HERO_VIDEO_STOP_FRAME,
              Math.max(0, Math.round(playhead.frame))
            );
            desiredTime = clampedFrame / HERO_VIDEO_FPS;
            syncVideoFrame();
          },
        }, 0);

        // Zoom progresivo de hasta el 30% (scale: 1.3) a medida que avanza el scroll del auto
        stageTl.fromTo(
          video,
          { scale: 1 },
          {
            scale: 1.3,
            duration: 1.3,
            ease: "power1.out",
          },
          0
        );

        // Desvanecer el prompt inicial de scroll
        stageTl.to(".hero-scroll-prompt", {
          opacity: 0,
          y: 8,
          duration: 0.15,
          ease: "power1.in",
        }, 0);

        // Fase 2 (1.3s -> 1.8s del TL ~ 500px): Bloqueo en frame 300 con Fade in SUPERIOR del hero-subtitle y CTAs
        stageTl.fromTo(
          ".hero-interactive-cta",
          {
            opacity: 0,
            y: -24,
            filter: "blur(5px)",
            pointerEvents: "none",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            pointerEvents: "auto",
            duration: 0.2,
            ease: "power2.out",
          },
          1.3
        );


        // Hold para los 300px restantes de bloqueo en estado estático
        stageTl.to({}, { duration: 0.3 }, 1.5);

        cleanupVideoListeners = () => {
          video.removeEventListener("seeked", handleSeeked);
          video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
      }

      // 3. Franjas Tricolor M divisoras que se expanden al scrollear
      gsap.utils.toArray<HTMLElement>(".m-stripe-expand").forEach((stripe) => {
        gsap.fromTo(
          stripe,
          { scaleX: 0, opacity: 0.4 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            transformOrigin: "center center",
            scrollTrigger: {
              trigger: stripe,
              start: "top 92%",
              once: true,
            },
          }
        );
      });

      // 5. Control de visibilidad del TopNav fuera del Hero
      if (topNavRef.current) {
        ScrollTrigger.create({
          trigger: "#caracteristicas",
          start: "top 80px",
          onEnter: () => {
            if (topNavRef.current) {
              gsap.to(topNavRef.current, {
                yPercent: 0,
                opacity: 1,
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          },
          onLeaveBack: () => {
            if (topNavRef.current) {
              gsap.to(topNavRef.current, {
                yPercent: -100,
                opacity: 0,
                duration: 0.25,
                ease: "power2.in",
                overwrite: "auto",
              });
            }
          },
        });
      }

      // 4. Animación de entrada del Footer
      gsap.fromTo(
        ".footer-container",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: "footer",
            start: "top 92%",
            once: true,
          },
        }
      );

      return () => {
        cleanupVideoListeners?.();
      };
    },
    { scope: pageRef }
  );

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetSelector: string
  ) => {
    e.preventDefault();

    if (targetSelector === "#" || targetSelector === "") {
      gsap.to(window, {
        duration: 1.15,
        scrollTo: { y: 0, autoKill: true },
        ease: "power3.inOut",
      });
      if (topNavRef.current) {
        gsap.to(topNavRef.current, {
          yPercent: 0,
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      return;
    }

    const target = document.querySelector(targetSelector);
    if (!target) return;

    // Margen superior de al menos el 15% del viewport para que los títulos respiren debajo del navbar
    const viewportOffset = Math.max(Math.round(window.innerHeight * 0.15), 80);

    gsap.to(window, {
      duration: 1.15,
      scrollTo: {
        y: target,
        offsetY: viewportOffset,
        autoKill: true,
      },
      ease: "power3.inOut",
      onComplete: () => {
        if (window.history?.pushState) {
          window.history.pushState(null, "", targetSelector);
        }
      },
    });
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-canvas-radial text-white flex flex-col selection:bg-[#e22718] selection:text-white"
    >
      {/* Barra de Navegación Superior (TopNav) con Franja Tricolor M */}
      <div
        ref={topNavRef}
        className="top-nav-wrapper fixed top-0 inset-x-0 z-50 will-change-transform"
      >
        {/* Franja Tricolor BMW M Superior (4px) */}
        <div className="w-full h-1 flex shrink-0">
          <div className="flex-1 bg-[#0066b1]" />
          <div className="flex-1 bg-[#1c69d4]" />
          <div className="flex-1 bg-[#e22718]" />
        </div>

        {/* Header con Backdrop Blur */}
        <header className="border-b border-[#262626] bg-black/85 backdrop-blur-md border-sheen transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            onClick={(e) => scrollToSection(e, "#")}
            className="flex items-center group py-1"
          >
            <Image
              src="/logos/logo.webp"
              alt="ApexLink Logo"
              width={160}
              height={32}
              priority
              className="h-7 sm:h-8 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#caracteristicas"
              onClick={(e) => scrollToSection(e, "#caracteristicas")}
              className="text-xs font-bold uppercase tracking-[0.15em] text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
            >
              Características
            </a>
            <a
              href="#como-funciona"
              onClick={(e) => scrollToSection(e, "#como-funciona")}
              className="text-xs font-bold uppercase tracking-[0.15em] text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
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
      </div>

      {/* Escenario Continuo: Hero Pinneado con Rotación de Auto y Bloqueo de 500px */}
      <div
        ref={heroStageRef}
        className="hero-turntable-stage relative w-full h-screen h-[100dvh] min-h-[580px] overflow-hidden flex flex-col justify-between sm:justify-start bg-canvas-radial border-b border-[#262626]"
      >
        {/* Halo de luz ambiental M Motorsport */}
        <div className="hero-parallax-glow absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[410px] bg-gradient-to-r from-[#0066b1]/15 via-[#e22718]/15 to-[#0066b1]/10 blur-3xl pointer-events-none rounded-full z-0" />

        {/* Video de Fondo con margen superior oscuro para continuar el fondo hacia arriba */}
        <div
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center bg-[#06070e]"
          aria-hidden="true"
        >
          {/* Margen superior oscuro que continúa el fondo hacia arriba detrás del navbar y el titular */}
          <div className="absolute inset-x-0 top-0 h-28 sm:h-96 bg-gradient-to-b from-black via-[#06070e] to-transparent z-10 pointer-events-none" />

          {/* Contenedor del video con ligero desplazamiento hacia abajo para darle aire al titular */}
          <div className="relative w-full h-full flex items-center justify-center sm:translate-y-[50px]">
            <video
              ref={heroVideoRef}
              src="/landing/videos/gemini_generated_video_c76c6af4.mp4"
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              className="w-full h-full object-contain sm:object-cover object-center select-none opacity-90 will-change-transform transform-gpu origin-center"
            />

            {/* Fundido degradé superior para fundir el borde del video con el fondo oscuro superior */}
            <div className="absolute inset-x-0 top-0 h-20 sm:h-64 bg-gradient-to-b from-[#06070e] via-[#06070e]/85 to-transparent z-10 pointer-events-none" />
            {/* Fundidos laterales e inferiores */}
            <div className="absolute inset-x-0 bottom-0 h-16 sm:h-56 bg-gradient-to-t from-black via-black/85 to-transparent z-10" />
            <div className="absolute inset-y-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-black/90 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-black/90 to-transparent z-10" />
            <div
              className="absolute inset-0 z-10"
              style={{
                background:
                  "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)",
              }}
            />
          </div>
        </div>

        {/* Sección Superior: Badge + H1 + Prompt */}
        <div className="hero-section relative z-20 pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto w-full">
          {/* Baliza de Estado Animada */}
          <div className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 bg-[#141414]/90 backdrop-blur-sm border border-[#3c3c3c] text-xs font-bold uppercase tracking-[0.2em] text-[#bbbbbb] mb-6 sm:mb-5 glow-m-red-subtle">
            <span className="w-2 h-2 rounded-full bg-[#0fa336] animate-pulse" />
            READY TO RACE
          </div>

          {/* Titular Principal Animado (H1) */}
          <h1 className="hero-title text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white max-w-5xl mx-auto leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            Telemetría accesible{" "}
            <span className="text-[#e22718] block sm:inline drop-shadow-[0_0_25px_rgba(226,39,24,0.35)]">
              para todo simracer
            </span>
          </h1>

          {/* Indicador de Scroll inicial que se desvanece al girar el auto */}
          <div className="hero-scroll-prompt mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#7e7e7e]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0066b1] animate-ping" />
            Scroll para girar el auto
          </div>

          {/* En DESKTOP (sm:block): Subtítulo y CTAs aparecen justo debajo del H1 */}
          <div
            className="hero-interactive-cta hidden sm:block max-w-3xl mx-auto mt-6 sm:mt-0 will-change-[transform,opacity,filter]"
            style={{ opacity: 0, pointerEvents: "none", transform: "translateY(-24px)" }}
          >
            <p className="hero-subtitle text-base sm:text-lg text-[#bbbbbb] leading-relaxed drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              Mirá tus datos en vivo y analizá cada vuelta desde el navegador, sin configuraciones complejas.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="hero-cta-btn w-full sm:w-auto h-[48px] px-8 rounded-none bg-[#e22718] hover:bg-[#c91f12] active:scale-[0.99] text-white font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all border border-[#e22718] shadow-[0_0_25px_rgba(226,39,24,0.35)] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                PROBAR DEMO EN VIVO
              </Link>

              <Link
                href="/hub"
                className="hero-cta-btn w-full sm:w-auto h-[48px] px-8 rounded-none bg-[#141414]/90 backdrop-blur-md hover:bg-[#1f1f1f] active:scale-[0.99] text-white font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all border border-[#3c3c3c] hover:border-[#e22718] cursor-pointer"
              >
                <Gauge className="w-4 h-4 text-[#bbbbbb]" />
                VER PANEL DE BOXES
              </Link>
            </div>
          </div>
        </div>

        {/* En MOBILE (block sm:hidden): Subtítulo y CTAs ubicados al pie del escenario, justo debajo del auto */}
        <div className="hero-interactive-cta block sm:hidden relative z-20 px-4 pb-4 sm:pb-8 text-center max-w-md mx-auto w-full will-change-[transform,opacity,filter]"
          style={{ opacity: 0, pointerEvents: "none", transform: "translateY(-24px)" }}
        >
          <p className="hero-subtitle text-sm text-[#cccccc] leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            Mirá tus datos en vivo y analizá cada vuelta desde el navegador, sin configuraciones complejas.
          </p>

          <div className="mt-4 flex flex-col items-center justify-center gap-3">
            <Link
              href="/login"
              className="hero-cta-btn w-full h-[46px] px-6 rounded-none bg-[#e22718] hover:bg-[#c91f12] active:scale-[0.99] text-white font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 transition-all border border-[#e22718] shadow-[0_0_20px_rgba(226,39,24,0.35)] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              PROBAR DEMO EN VIVO
            </Link>

            <Link
              href="/hub"
              className="hero-cta-btn w-full h-[46px] px-6 rounded-none bg-[#141414]/90 backdrop-blur-md hover:bg-[#1f1f1f] active:scale-[0.99] text-white font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 transition-all border border-[#3c3c3c] hover:border-[#e22718] cursor-pointer"
            >
              <Gauge className="w-3.5 h-3.5 text-[#bbbbbb]" />
              VER PANEL DE BOXES
            </Link>
          </div>
        </div>
      </div>

      {/* Franja Tricolor M Divisoria con Expansión por Scroll */}
      <div className="m-stripe-expand relative z-10 w-full h-1 flex shrink-0">
        <div className="flex-1 bg-[#0066b1]" />
        <div className="flex-1 bg-[#1c69d4]" />
        <div className="flex-1 bg-[#e22718]" />
      </div>

      {/* Características de Pista con Carrusel Pinneado y ScrollTrigger (donde el auto se frena) */}
      <FeaturesGrid />

      {/* Franja Tricolor M Divisoria con Expansión por Scroll */}
      <div className="m-stripe-expand w-full h-1 flex shrink-0">
        <div className="flex-1 bg-[#0066b1]" />
        <div className="flex-1 bg-[#1c69d4]" />
        <div className="flex-1 bg-[#e22718]" />
      </div>

      {/* Cómo Empezar en Tres Pasos con Carrusel Pinneado y Barra de Progreso */}
      <QuickStartSteps />

      {/* Franja Tricolor M Divisoria con Expansión por Scroll */}
      <div className="m-stripe-expand w-full h-1 flex shrink-0">
        <div className="flex-1 bg-[#0066b1]" />
        <div className="flex-1 bg-[#1c69d4]" />
        <div className="flex-1 bg-[#e22718]" />
      </div>

      {/* Llamado a Probar Demo con Animación y Pulso de Brillo */}
      <CtaBand />

      {/* Franja Tricolor M Divisoria con Expansión por Scroll */}
      <div className="m-stripe-expand w-full h-1 flex shrink-0">
        <div className="flex-1 bg-[#0066b1]" />
        <div className="flex-1 bg-[#1c69d4]" />
        <div className="flex-1 bg-[#e22718]" />
      </div>

      {/* Pie de Página Oficial (Footer) */}
      <footer className="border-t border-[#262626] bg-black py-16 text-[#7e7e7e] relative">
        <div className="footer-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#262626]">
            <div className="flex items-center gap-3">
              <Image
                src="/logos/logo.webp"
                alt="ApexLink Logo"
                width={130}
                height={26}
                className="h-6 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
              <span className="text-xs text-[#7e7e7e]">
                • Telemetría en Tiempo Real y Análisis de Vueltas
              </span>
            </div>

            <nav className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider">
              <a
                href="#caracteristicas"
                onClick={(e) => scrollToSection(e, "#caracteristicas")}
                className="text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
              >
                Características
              </a>
              <a
                href="#como-funciona"
                onClick={(e) => scrollToSection(e, "#como-funciona")}
                className="text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
              >
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
                Diseñado para Assetto Corsa con lectura directa de memoria. Próximamente disponible para más simuladores.
              </p>
            </div>

            <div>
              <div className="font-bold uppercase tracking-wider text-white mb-2">
                Compatibilidad de Volantes y Pantallas
              </div>
              <p>
                Compatible con bases Logitech, Thrustmaster, Fanatec y Direct Drive (Moza, Simagic, Simucube). Abrí la interfaz en monitores, tablets o celulares.
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
