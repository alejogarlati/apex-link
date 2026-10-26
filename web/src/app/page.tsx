import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  Check,
  Clock,
  Cpu,
  Disc,
  Flag,
  Gauge,
  Monitor,
  Radio,
  Repeat,
  Route,
  Smartphone,
  TrendingUp,
  Usb,
  Users,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "ApexLink — El sistema Nº1 del SimRacing",
  description:
    "Ecosistema integral de telemetría automovilística y análisis de rendimiento para Assetto Corsa.",
};

/* -------------------------------------------------------------------------- */
/*                                   Tokens                                    */
/* -------------------------------------------------------------------------- */

const COLORES = {
  azulClaro: "#0066b1",
  azulOscuro: "#1c69d4",
  rojoM: "#e22718",
  verde: "#0fa336",
  amarillo: "#f4b400",
  borde: "#3c3c3c",
} as const;

/** Grilla técnica de fondo (papel milimetrado de ingeniería). */
const ESTILO_GRILLA = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
} as const;

/* -------------------------------------------------------------------------- */
/*                               Datos de la página                            */
/* -------------------------------------------------------------------------- */

interface MetricaTicker {
  valor: string;
  etiqueta: string;
  icono: LucideIcon;
}

const METRICAS_TICKER: readonly MetricaTicker[] = [
  { valor: "< 3ms", etiqueta: "Latencia USB", icono: Usb },
  { valor: "60 FPS", etiqueta: "Telemetría en vivo", icono: Activity },
  { valor: "100%", etiqueta: "Local & cero configuración", icono: Cpu },
];

interface CapaEcosistema {
  numero: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  icono: LucideIcon;
  acento: string;
  especificaciones: readonly string[];
}

const CAPAS_ECOSISTEMA: readonly CapaEcosistema[] = [
  {
    numero: "01",
    titulo: "F1 Steering Wheel Display",
    subtitulo: "Display de volante",
    descripcion:
      "Transforma tu smartphone en un display réplica de monoplaza con Shift LEDs y deltas de tiempo, conectado vía USB.",
    icono: Smartphone,
    acento: COLORES.azulClaro,
    especificaciones: ["Shift LEDs", "Delta en vivo", "Conexión USB"],
  },
  {
    numero: "02",
    titulo: "Live Pitwall",
    subtitulo: "Muro de boxes en vivo",
    descripcion:
      "Muro de boxes en tiempo real para que el jurado y el equipo monitoreen pedales, neumáticos y fuerzas G mientras alguien conduce.",
    icono: Radio,
    acento: COLORES.azulOscuro,
    especificaciones: ["Pedales", "Neumáticos", "Fuerzas G"],
  },
  {
    numero: "03",
    titulo: "Análisis Post-Sesión & Trazada 2D",
    subtitulo: "Ingeniería de datos",
    descripcion:
      "Superposición milimétrica de vueltas y mapa de calor de frenadas y aceleración renderizado en Canvas 2D.",
    icono: Route,
    acento: COLORES.rojoM,
    especificaciones: ["Overlay de vueltas", "Mapa de calor", "Canvas 2D"],
  },
];

interface MetricaTecnica {
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
  acento: string;
  /** Puntaje de ejemplo (0–100) para ilustrar el reporte. */
  puntajeEjemplo: number;
}

const METRICAS_TECNICAS: readonly MetricaTecnica[] = [
  {
    titulo: "Eficiencia de frenada",
    descripcion:
      "Evalúa el trail braking: cuánta presión de freno sostenés al entrar en la curva y qué tan progresiva es la liberación hasta el ápice.",
    icono: Disc,
    acento: COLORES.rojoM,
    puntajeEjemplo: 84,
  },
  {
    titulo: "Tracción y aceleración",
    descripcion:
      "Mide la progresividad del acelerador a la salida: aperturas suaves frente a picos que provocan patinaje y pérdida de velocidad.",
    icono: TrendingUp,
    acento: COLORES.verde,
    puntajeEjemplo: 91,
  },
  {
    titulo: "Consistencia entre vueltas",
    descripcion:
      "Compara la dispersión de tiempos, puntos de frenada y velocidades mínimas para saber si tu ritmo es repetible.",
    icono: Repeat,
    acento: COLORES.azulOscuro,
    puntajeEjemplo: 76,
  },
  {
    titulo: "Límites de pista y micro-sectores",
    descripcion:
      "Detecta salidas de los límites de pista y descompone cada vuelta en micro-sectores para mostrar dónde ganás o perdés décimas.",
    icono: Flag,
    acento: COLORES.amarillo,
    puntajeEjemplo: 68,
  },
];

type EstadoSimulador = "activo" | "roadmap";

interface Simulador {
  nombre: string;
  abreviatura: string;
  estado: EstadoSimulador;
  etiquetaEstado: string;
}

const SIMULADORES: readonly Simulador[] = [
  {
    nombre: "Assetto Corsa",
    abreviatura: "AC",
    estado: "activo",
    etiquetaEstado: "Activo / Mock engine conectado",
  },
  {
    nombre: "Assetto Corsa Competizione",
    abreviatura: "ACC",
    estado: "roadmap",
    etiquetaEstado: "En roadmap",
  },
  { nombre: "iRacing", abreviatura: "IR", estado: "roadmap", etiquetaEstado: "En roadmap" },
  { nombre: "EA Sports F1", abreviatura: "F1", estado: "roadmap", etiquetaEstado: "En roadmap" },
  { nombre: "Le Mans Ultimate", abreviatura: "LMU", estado: "roadmap", etiquetaEstado: "En roadmap" },
];

interface RolEquipo {
  area: string;
  descripcion: string;
  icono: LucideIcon;
  acento: string;
}

const ROLES_EQUIPO: readonly RolEquipo[] = [
  {
    area: "Core & Relay de Telemetría",
    descripcion: "Lectura de la memoria compartida del simulador y retransmisión de datos en tiempo real.",
    icono: Cpu,
    acento: COLORES.azulClaro,
  },
  {
    area: "F1 Mobile Display",
    descripcion: "App móvil que replica el display de un volante de Fórmula 1 con baja latencia.",
    icono: Smartphone,
    acento: COLORES.azulOscuro,
  },
  {
    area: "Plataforma Web de Ingeniería",
    descripcion: "Pitwall en vivo, historial de sesiones y análisis post-sesión de telemetría.",
    icono: Monitor,
    acento: COLORES.rojoM,
  },
];

const ENLACES_RAPIDOS = [
  { href: "/analysis", etiqueta: "Análisis de telemetría" },
  { href: "/sessions", etiqueta: "Sesiones registradas" },
] as const;

/* -------------------------------------------------------------------------- */
/*                               Componentes base                              */
/* -------------------------------------------------------------------------- */

function FranjaM({ className = "h-1 w-16" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex ${className}`}>
      <span className="flex-1" style={{ backgroundColor: COLORES.azulClaro }} />
      <span className="flex-1" style={{ backgroundColor: COLORES.azulOscuro }} />
      <span className="flex-1" style={{ backgroundColor: COLORES.rojoM }} />
    </div>
  );
}

function EncabezadoSeccion({
  id,
  etiqueta,
  titulo,
  descripcion,
}: {
  id: string;
  etiqueta: string;
  titulo: string;
  descripcion?: string;
}) {
  return (
    <header className="mb-12 flex max-w-3xl flex-col gap-4">
      <div className="flex items-center gap-3">
        <FranjaM className="h-1 w-10" />
        <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#8a8a8a]">
          {etiqueta}
        </span>
      </div>
      <h2
        id={id}
        className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl"
      >
        {titulo}
      </h2>
      {descripcion && <p className="text-base leading-relaxed text-[#a8a8a8]">{descripcion}</p>}
    </header>
  );
}

/** Traza de telemetría decorativa (velocidad + acelerador + freno). */
function TrazaTelemetria() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 220"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full opacity-60"
    >
      <defs>
        <linearGradient id="desvanecer" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.2" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="0.8" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <mask id="mascara-traza">
          <rect width="1200" height="220" fill="url(#desvanecer)" />
        </mask>
      </defs>
      <g mask="url(#mascara-traza)" fill="none" strokeLinejoin="round">
        {/* Velocidad */}
        <polyline
          stroke="#ffffff"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          points="0,150 80,120 160,70 230,50 260,52 290,110 320,140 350,135 420,90 500,55 580,40 610,42 640,100 670,130 700,128 760,95 840,70 900,60 930,62 960,120 990,150 1020,145 1100,100 1200,70"
        />
        {/* Acelerador */}
        <polyline
          stroke={COLORES.verde}
          strokeOpacity="0.7"
          strokeWidth="1.5"
          points="0,200 250,200 255,214 320,214 340,190 360,200 570,200 600,214 670,214 690,195 710,200 920,200 950,214 1010,214 1030,192 1050,200 1200,200"
        />
        {/* Freno */}
        <polyline
          stroke={COLORES.rojoM}
          strokeOpacity="0.8"
          strokeWidth="1.5"
          points="0,214 255,214 262,178 280,184 300,205 315,214 600,214 606,180 625,188 650,208 665,214 950,214 957,176 975,186 1000,207 1015,214 1200,214"
        />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Secciones                                  */
/* -------------------------------------------------------------------------- */

function SeccionHero() {
  return (
    <section
      aria-labelledby="titulo-hero"
      className="relative overflow-hidden border-b border-[#3c3c3c]"
      style={ESTILO_GRILLA}
    >
      <FranjaM className="h-1.5 w-full" />
      <TrazaTelemetria />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:pb-32">
        <div className="inline-flex w-fit items-center gap-2 border border-[#3c3c3c] bg-[#1a1a1a] px-3 py-1.5">
          <span
            aria-hidden
            className="h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ backgroundColor: COLORES.rojoM }}
          />
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-white">
            FAPPE 2026 — Proyecto Final de Grado
          </span>
        </div>

        <div className="flex max-w-4xl flex-col gap-6">
          <h1
            id="titulo-hero"
            className="text-5xl font-bold uppercase leading-[0.95] tracking-wider text-white sm:text-6xl lg:text-7xl"
          >
            La ciencia detrás de{" "}
            <span className="relative inline-block">
              cada décima
              <span
                aria-hidden
                className="absolute -bottom-2 left-0 h-1 w-full"
                style={{
                  background: `linear-gradient(to right, ${COLORES.azulClaro} 0 33.33%, ${COLORES.azulOscuro} 33.33% 66.66%, ${COLORES.rojoM} 66.66% 100%)`,
                }}
              />
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[#b4b4b4]">
            Ecosistema integral de telemetría automovilística y análisis de rendimiento para
            Assetto Corsa. Democratizando la instrumentación profesional de SimRacing sin
            licencias de $1.000 USD.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/analysis"
            className="group inline-flex items-center justify-center gap-3 bg-[#0066b1] px-6 py-4 text-sm font-bold uppercase tracking-widest text-white outline-none transition-colors hover:bg-[#1c69d4] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Explorar Análisis de Telemetría
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
          <Link
            href="/sessions"
            className="inline-flex items-center justify-center gap-3 border border-[#3c3c3c] bg-[#1a1a1a] px-6 py-4 text-sm font-bold uppercase tracking-widest text-white outline-none transition-colors hover:border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Clock className="h-4 w-4" aria-hidden />
            Ver Sesiones Registradas
          </Link>
        </div>

        <ul
          aria-label="Métricas de rendimiento"
          className="grid grid-cols-1 border border-[#3c3c3c] bg-black/70 backdrop-blur-sm sm:grid-cols-3"
        >
          {METRICAS_TICKER.map(({ valor, etiqueta, icono: Icono }, indice) => (
            <li
              key={etiqueta}
              className={`flex items-center gap-4 px-5 py-4 ${
                indice > 0 ? "border-t border-[#3c3c3c] sm:border-l sm:border-t-0" : ""
              }`}
            >
              <Icono className="h-5 w-5 shrink-0 text-[#0066b1]" aria-hidden />
              <span className="flex flex-col">
                <span className="font-mono text-2xl font-bold tabular-nums text-white">
                  {valor}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                  {etiqueta}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SeccionEcosistema() {
  return (
    <section aria-labelledby="titulo-ecosistema" className="border-b border-[#3c3c3c] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <EncabezadoSeccion
          id="titulo-ecosistema"
          etiqueta="Arquitectura"
          titulo="Ecosistema ApexLink"
          descripcion="Tres capas que trabajan sobre el mismo flujo de datos: del volante al muro de boxes y del muro de boxes al análisis."
        />

        <ol className="grid gap-px border border-[#3c3c3c] bg-[#3c3c3c] lg:grid-cols-3">
          {CAPAS_ECOSISTEMA.map((capa) => {
            const Icono = capa.icono;
            return (
              <li key={capa.numero} className="relative flex flex-col bg-[#1a1a1a]">
                <span
                  aria-hidden
                  className="h-1 w-full"
                  style={{ backgroundColor: capa.acento }}
                />
                <div className="flex flex-1 flex-col gap-6 p-6">
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center border border-[#3c3c3c] bg-[#262626]"
                      style={{ color: capa.acento }}
                    >
                      <Icono className="h-6 w-6" aria-hidden />
                    </div>
                    <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#5a5a5a]">
                      CAPA {capa.numero}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                      {capa.subtitulo}
                    </span>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                      {capa.titulo}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#a8a8a8]">{capa.descripcion}</p>
                  </div>

                  <ul className="mt-auto flex flex-wrap gap-2" aria-label="Especificaciones">
                    {capa.especificaciones.map((especificacion) => (
                      <li
                        key={especificacion}
                        className="border border-[#3c3c3c] bg-[#262626] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#bbbbbb]"
                      >
                        {especificacion}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function SeccionMetricas() {
  return (
    <section
      aria-labelledby="titulo-metricas"
      className="border-b border-[#3c3c3c] bg-[#0a0a0a] py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <EncabezadoSeccion
            id="titulo-metricas"
            etiqueta="El sistema Nº1 de analisis del Motorsport"
            titulo="Métricas que importan"
            descripcion="ApexLink no se queda en el tiempo de vuelta. Analiza cada muestra de telemetría para evaluar la técnica del piloto y convertirla en puntajes claros y accionables."
          />
          <div className="flex items-start gap-3 border-l-2 border-[#0066b1] pl-4">
            <Gauge className="mt-0.5 h-5 w-5 shrink-0 text-[#0066b1]" aria-hidden />
            <p className="text-sm leading-relaxed text-[#a8a8a8]">
              Cada puntaje sale de comparar tu entrada de pedales, velocidad y trazada contra tus
              propias vueltas de referencia.
            </p>
          </div>
        </div>

        <div className="flex flex-col border border-[#3c3c3c] bg-[#1a1a1a]">
          <div className="flex items-center justify-between border-b border-[#3c3c3c] px-5 py-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white">
              Reporte de técnica
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6a6a6a]">
              Valores de ejemplo
            </span>
          </div>

          <ul className="divide-y divide-[#3c3c3c]">
            {METRICAS_TECNICAS.map((metrica) => {
              const Icono = metrica.icono;
              return (
                <li key={metrica.titulo} className="flex gap-4 p-5">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#3c3c3c] bg-[#262626]"
                    style={{ color: metrica.acento }}
                  >
                    <Icono className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                        {metrica.titulo}
                      </h3>
                      <span
                        className="font-mono text-xl font-bold tabular-nums"
                        style={{ color: metrica.acento }}
                      >
                        {metrica.puntajeEjemplo}
                      </span>
                    </div>
                    <div
                      role="meter"
                      aria-label={`${metrica.titulo}: puntaje de ejemplo`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={metrica.puntajeEjemplo}
                      className="h-1 w-full bg-[#262626]"
                    >
                      <div
                        className="h-full"
                        style={{
                          width: `${metrica.puntajeEjemplo}%`,
                          backgroundColor: metrica.acento,
                        }}
                      />
                    </div>
                    <p className="text-sm leading-relaxed text-[#a8a8a8]">{metrica.descripcion}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function SeccionCompatibilidad() {
  return (
    <section aria-labelledby="titulo-compatibilidad" className="border-b border-[#3c3c3c] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <EncabezadoSeccion
          id="titulo-compatibilidad"
          etiqueta="Compatibilidad"
          titulo="Multi-simulador"
          descripcion="Arrancamos por Assetto Corsa y diseñamos la capa de ingesta para sumar nuevos simuladores sin tocar el resto del ecosistema."
        />

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SIMULADORES.map((simulador) => {
            const esActivo = simulador.estado === "activo";
            return (
              <li
                key={simulador.nombre}
                className={`flex flex-col gap-5 border p-5 ${
                  esActivo
                    ? "border-[#0fa336]/60 bg-[#0fa336]/[0.06]"
                    : "border-[#3c3c3c] bg-[#1a1a1a]"
                }`}
              >
                <span
                  className={`font-mono text-3xl font-bold tracking-wider ${
                    esActivo ? "text-white" : "text-[#5a5a5a]"
                  }`}
                  aria-hidden
                >
                  {simulador.abreviatura}
                </span>
                <h3
                  className={`text-sm font-bold uppercase tracking-wider ${
                    esActivo ? "text-white" : "text-[#a8a8a8]"
                  }`}
                >
                  {simulador.nombre}
                </h3>
                <span
                  className={`mt-auto inline-flex w-fit items-center gap-2 border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
                    esActivo
                      ? "border-[#0fa336] text-[#0fa336]"
                      : "border-[#3c3c3c] text-[#8a8a8a]"
                  }`}
                >
                  {esActivo ? (
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0fa336]"
                    />
                  ) : (
                    <Clock className="h-3 w-3" aria-hidden />
                  )}
                  {simulador.etiquetaEstado}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function SeccionInstitucional() {
  return (
    <section
      aria-labelledby="titulo-institucional"
      className="relative overflow-hidden border-b border-[#3c3c3c] py-24"
      style={ESTILO_GRILLA}
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <EncabezadoSeccion
          id="titulo-institucional"
          etiqueta="Quiénes somos"
          titulo="FAPPE 2026"
          descripcion="ApexLink es nuestra presentación para la feria FAPPE 2026. Es un proyecto desarrollado por un equipo de tres desarrolladores, con cada integrante a cargo de una capa del ecosistema."
        />

        <ul className="mb-12 grid gap-px border border-[#3c3c3c] bg-[#3c3c3c] md:grid-cols-3">
          {ROLES_EQUIPO.map((rol, indice) => {
            const Icono = rol.icono;
            return (
              <li key={rol.area} className="flex flex-col gap-4 bg-[#1a1a1a] p-6">
                <div className="flex items-center justify-between">
                  <Icono className="h-6 w-6" style={{ color: rol.acento }} aria-hidden />
                  <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#5a5a5a]">
                    DEV {String(indice + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  {rol.area}
                </h3>
                <p className="text-sm leading-relaxed text-[#a8a8a8]">{rol.descripcion}</p>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col items-start justify-between gap-6 border border-[#3c3c3c] bg-[#1a1a1a] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-4">
            <Users className="mt-1 h-6 w-6 shrink-0 text-[#0066b1]" aria-hidden />
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold uppercase tracking-wider text-white">
                Probalo en la pista
              </p>
              <p className="text-sm text-[#a8a8a8]">
                Entrá al módulo de telemetría y compará tus vueltas.
              </p>
            </div>
          </div>
          <Link
            href="/analysis"
            className="group inline-flex shrink-0 items-center gap-3 bg-[#0066b1] px-6 py-4 text-sm font-bold uppercase tracking-widest text-white outline-none transition-colors hover:bg-[#1c69d4] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Zap className="h-4 w-4" aria-hidden />
            Ir al Módulo de Telemetría
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PiePagina() {
  return (
    <footer className="bg-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <FranjaM className="h-1 w-20" />
          <span className="text-xl font-bold uppercase tracking-[0.3em] text-white">
            ApexLink
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-[#8a8a8a]">
            El sistema Nº1 de anilisis del SimRacing
          </span>
        </div>

        <nav aria-label="Enlaces rápidos">
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#8a8a8a]">
            Enlaces rápidos
          </h2>
          <ul className="flex flex-col gap-2">
            {ENLACES_RAPIDOS.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  className="inline-flex items-center gap-2 text-sm text-[#bbbbbb] outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:underline"
                >
                  <ArrowRight className="h-3.5 w-3.5 text-[#0066b1]" aria-hidden />
                  {enlace.etiqueta}
                  <span className="font-mono text-xs text-[#5a5a5a]">{enlace.href}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-[#3c3c3c]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8a8a8a]">
            FAPPE 2026 — Proyecto Estudiantil de Grado
          </p>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#5a5a5a]">
            <Check className="h-3.5 w-3.5 text-[#0fa336]" aria-hidden />
            100% local · Sin licencias
          </p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Página                                   */
/* -------------------------------------------------------------------------- */

export default function PaginaInicio() {
  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-[#0066b1] selection:text-white">
      <main>
        <SeccionHero />
        <SeccionEcosistema />
        <SeccionMetricas />
        <SeccionCompatibilidad />
        <SeccionInstitucional />
      </main>
      <PiePagina />
    </div>
  );
}
