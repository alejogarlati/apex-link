"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  Car,
  ChevronRight,
  Crosshair,
  Disc,
  Flag,
  Gauge,
  Lightbulb,
  MapPin,
  Repeat,
  Route,
  ShieldCheck,
  Timer,
  TrendingUp,
  Trophy,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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
  superficie: "#1a1a1a",
  superficieAlta: "#262626",
  textoSecundario: "#a8a8a8",
  textoTenue: "#8a8a8a",
} as const;

const GRADIENTE_TRICOLOR = `linear-gradient(to right, ${COLORES.azulClaro} 0 33.33%, ${COLORES.azulOscuro} 33.33% 66.66%, ${COLORES.rojoM} 66.66% 100%)`;

/* -------------------------------------------------------------------------- */
/*                                Modelo de datos                              */
/* -------------------------------------------------------------------------- */

interface PerfilPiloto {
  nombre: string;
  iniciales: string;
  licencia: string;
  nacionalidad: string;
  codigoPais: string;
  vehiculoPrincipal: string;
  simulador: string;
  apexRating: number;
  vueltasEvaluadas: number;
}

interface Habilidad {
  id: string;
  nombre: string;
  etiquetaCorta: string;
  valor: number;
  icono: LucideIcon;
  descripcion: string;
  consejo: string;
}

interface EstadisticaGlobal {
  etiqueta: string;
  valor: string;
  unidad: string;
  detalle: string;
  icono: LucideIcon;
  acento: string;
}

interface RecordCircuito {
  id: string;
  circuito: string;
  pais: string;
  tiempo: string;
  esRecordSesion: boolean;
}

interface Insignia {
  id: string;
  nombre: string;
  descripcion: string;
  icono: LucideIcon;
  acento: string;
}

/* -------------------------------------------------------------------------- */
/*                         Datos de ejemplo del perfil                         */
/* -------------------------------------------------------------------------- */

const PERFIL: PerfilPiloto = {
  nombre: "Alejo Salas",
  iniciales: "AS",
  licencia: "Licencia Apex Pro-Am",
  nacionalidad: "Argentina",
  codigoPais: "ARG",
  vehiculoPrincipal: "Ferrari 488 GT3",
  simulador: "Assetto Corsa · Shared Memory Activo",
  apexRating: 88.5,
  vueltasEvaluadas: 284,
};

const HABILIDADES: readonly Habilidad[] = [
  {
    id: "frenada",
    nombre: "Frenada / Trail Braking",
    etiquetaCorta: "FRENADA",
    valor: 86,
    icono: Disc,
    descripcion:
      "Mide el pico de presión inicial y qué tan progresiva es la liberación del freno mientras girás hacia el ápice.",
    consejo:
      "Soltá el freno de forma más lineal en los últimos 30 m antes del ápice: estás liberando de golpe y el auto subvira en la entrada.",
  },
  {
    id: "traccion",
    nombre: "Tracción / Salida",
    etiquetaCorta: "TRACCIÓN",
    valor: 91,
    icono: TrendingUp,
    descripcion:
      "Evalúa la progresividad del acelerador a la salida de curva y la ausencia de picos que provoquen patinaje.",
    consejo:
      "Es tu punto fuerte. Probá adelantar la apertura del acelerador unos metros en curvas lentas sin perder la progresividad.",
  },
  {
    id: "apice",
    nombre: "Velocidad en Ápice",
    etiquetaCorta: "ÁPICE",
    valor: 78,
    icono: Gauge,
    descripcion:
      "Compara tu velocidad mínima en cada curva contra tu mejor vuelta de referencia en el mismo micro-sector.",
    consejo:
      "Llevás demasiada velocidad sobrante al frenar y la perdés en el ápice. Frená un poco antes y rodá más velocidad por el medio de la curva.",
  },
  {
    id: "consistencia",
    nombre: "Consistencia",
    etiquetaCorta: "CONSISTENCIA",
    valor: 94,
    icono: Repeat,
    descripcion:
      "Dispersión de tiempos de vuelta, puntos de frenada y velocidades mínimas entre vueltas consecutivas.",
    consejo:
      "Ritmo muy repetible. Usá esa base para experimentar con una sola variable por stint y medir su efecto con claridad.",
  },
  {
    id: "limites",
    nombre: "Respeto de Límites",
    etiquetaCorta: "LÍMITES",
    valor: 84,
    icono: Flag,
    descripcion:
      "Porcentaje de vueltas sin exceder los límites de pista y cantidad de excursiones por micro-sector.",
    consejo:
      "La mayoría de tus excursiones ocurren a la salida de Ascari. Dejá medio metro de margen al apoyar el piano exterior.",
  },
];

const ESTADISTICAS: readonly EstadisticaGlobal[] = [
  {
    etiqueta: "Kilómetros en pista",
    valor: "1.480",
    unidad: "km",
    detalle: "Distancia total registrada",
    icono: Route,
    acento: COLORES.azulClaro,
  },
  {
    etiqueta: "Vueltas completadas",
    valor: "284",
    unidad: "vueltas",
    detalle: "En todas las sesiones",
    icono: Repeat,
    acento: COLORES.azulOscuro,
  },
  {
    etiqueta: "Vueltas válidas",
    valor: "94.2",
    unidad: "%",
    detalle: "Sin exceder límites de pista",
    icono: ShieldCheck,
    acento: COLORES.verde,
  },
  {
    etiqueta: "Velocidad máxima",
    valor: "334.8",
    unidad: "km/h",
    detalle: "Alcanzada en Monza",
    icono: Gauge,
    acento: COLORES.rojoM,
  },
];

const RECORDS: readonly RecordCircuito[] = [
  {
    id: "monza",
    circuito: "Autodromo Nazionale Monza",
    pais: "ITA",
    tiempo: "01:20.940",
    esRecordSesion: true,
  },
  {
    id: "spa",
    circuito: "Circuit de Spa-Francorchamps",
    pais: "BEL",
    tiempo: "02:18.420",
    esRecordSesion: false,
  },
  {
    id: "nurburgring",
    circuito: "Nürburgring GP",
    pais: "GER",
    tiempo: "01:54.110",
    esRecordSesion: false,
  },
];

const INSIGNIAS: readonly Insignia[] = [
  {
    id: "freno-precision",
    nombre: "Freno de Precisión",
    descripcion: "Trail braking óptimo en la Variante del Rettifilo.",
    icono: Disc,
    acento: COLORES.rojoM,
  },
  {
    id: "ritmo-quirurgico",
    nombre: "Ritmo Quirúrgico",
    descripcion: "10 vueltas seguidas dentro de un delta de ±0.2 s.",
    icono: Crosshair,
    acento: COLORES.azulOscuro,
  },
  {
    id: "sub-121-monza",
    nombre: "Sub 1:21 Monza",
    descripcion: "Vuelta rápida en configuración GT3.",
    icono: Timer,
    acento: COLORES.amarillo,
  },
  {
    id: "cero-incidentes",
    nombre: "Cero Incidentes",
    descripcion: "100% de vueltas válidas sin exceder los límites de pista.",
    icono: ShieldCheck,
    acento: COLORES.verde,
  },
];

/* -------------------------------------------------------------------------- */
/*                                   Utilidades                                */
/* -------------------------------------------------------------------------- */

function colorPorPuntaje(valor: number): string {
  if (valor >= 90) return COLORES.verde;
  if (valor >= 80) return COLORES.azulOscuro;
  return COLORES.amarillo;
}

/* -------------------------------------------------------------------------- */
/*                               Componentes base                              */
/* -------------------------------------------------------------------------- */

function FranjaM({ className = "h-1 w-16" }: { className?: string }) {
  return <div aria-hidden className={className} style={{ background: GRADIENTE_TRICOLOR }} />;
}

function TituloSeccion({ id, etiqueta, titulo }: { id: string; etiqueta: string; titulo: string }) {
  return (
    <header className="mb-6 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <FranjaM className="h-1 w-8" />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[#8a8a8a]">
          {etiqueta}
        </span>
      </div>
      <h2 id={id} className="text-xl font-bold uppercase tracking-wider text-white sm:text-2xl">
        {titulo}
      </h2>
    </header>
  );
}

function Tarjeta({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card-cockpit-gradient border border-[#262626] rounded-none border-sheen shadow-xl ${className}`}>{children}</div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         1. Tarjeta principal del piloto                     */
/* -------------------------------------------------------------------------- */

function DatoPiloto({ icono: Icono, etiqueta, valor }: { icono: LucideIcon; etiqueta: string; valor: string }) {
  return (
    <div className="flex items-center gap-3 border border-[#262626] bg-[#0a0a0a] rounded-none px-3 py-2">
      <Icono className="h-4 w-4 shrink-0 text-[#8a8a8a]" aria-hidden />
      <div className="flex min-w-0 flex-col">
        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
          {etiqueta}
        </span>
        <span className="truncate text-sm font-bold text-white font-mono">{valor}</span>
      </div>
    </div>
  );
}

function TarjetaPiloto({ perfil }: { perfil: PerfilPiloto }) {
  return (
    <section
      aria-labelledby="titulo-piloto"
      className="card-cockpit-gradient border border-[#262626] rounded-none border-sheen grid gap-px bg-[#262626] lg:grid-cols-[1fr_340px] shadow-2xl"
    >
      {/* Identidad */}
      <div className="flex flex-col gap-6 bg-[#0d0d0d] p-8 sm:flex-row sm:items-center sm:p-10">
        <div
          className="h-28 w-28 shrink-0 p-[3px] shadow-[0_0_20px_rgba(0,102,177,0.3)]"
          style={{
            background: `conic-gradient(${COLORES.azulClaro} 0 120deg, ${COLORES.azulOscuro} 120deg 240deg, ${COLORES.rojoM} 240deg 360deg)`,
          }}
          aria-hidden
        >
          <div className="flex h-full w-full items-center justify-center bg-[#141414]">
            <span className="font-mono text-4xl font-black tracking-wider text-white">
              {perfil.iniciales}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-2 border border-[#10b981] bg-[#10b981]/15 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-[#10b981]" />
              {perfil.simulador}
            </span>
            <h1
              id="titulo-piloto"
              className="text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
            >
              {perfil.nombre}
            </h1>
            <p className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#0066b1]">
              {perfil.licencia}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 pt-1">
            <DatoPiloto
              icono={MapPin}
              etiqueta="Nacionalidad"
              valor={`${perfil.nacionalidad} · ${perfil.codigoPais}`}
            />
            <DatoPiloto icono={Car} etiqueta="Vehículo principal" valor={perfil.vehiculoPrincipal} />
          </div>
        </div>
      </div>

      {/* Apex Rating */}
      <div className="relative flex flex-col justify-between gap-6 bg-[#141414] p-8 sm:p-10 border-t lg:border-t-0 lg:border-l border-[#262626]">
        <FranjaM className="absolute inset-x-0 top-0 h-1.5" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#0066b1]">
            Apex Rating
          </span>
          <Award className="h-5 w-5 text-[#f59e0b] drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" aria-hidden />
        </div>

        <p className="flex items-baseline gap-2">
          <span className="font-mono text-6xl font-black tabular-nums leading-none text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {perfil.apexRating.toFixed(1)}
          </span>
          <span className="font-mono text-lg text-[#8a8a8a]">/ 100</span>
        </p>

        <div className="flex flex-col gap-2">
          <div
            role="meter"
            aria-label="Apex Rating"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={perfil.apexRating}
            className="h-2 w-full bg-black border border-[#262626]"
          >
            <div
              className="h-full shadow-[0_0_10px_rgba(0,102,177,0.5)]"
              style={{ width: `${perfil.apexRating}%`, background: GRADIENTE_TRICOLOR }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8a8a]">
            Calculado sobre {perfil.vueltasEvaluadas} vueltas
          </span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                          2. Radar de habilidades                            */
/* -------------------------------------------------------------------------- */

function TooltipHabilidad({ activo, habilidad }: { activo: boolean | undefined; habilidad: Habilidad | undefined }) {
  if (!activo || !habilidad) return null;
  return (
    <div className="border border-[#3c3c3c] bg-[#1a1a1a] px-3 py-2 shadow-2xl shadow-black/60">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
        {habilidad.nombre}
      </p>
      <p className="font-mono text-lg font-bold tabular-nums text-white">
        {habilidad.valor}
        <span className="text-xs text-[#8a8a8a]"> / 100</span>
      </p>
    </div>
  );
}

function SeccionHabilidades() {
  const [idActiva, setIdActiva] = useState<string>(HABILIDADES[0]?.id ?? "");

  const promedio =
    HABILIDADES.reduce((suma, habilidad) => suma + habilidad.valor, 0) / HABILIDADES.length;

  return (
    <section aria-labelledby="titulo-habilidades">
      <TituloSeccion id="titulo-habilidades" etiqueta="Apex Rating" titulo="Perfil de habilidades" />

      <div className="grid gap-px border border-[#3c3c3c] bg-[#3c3c3c] lg:grid-cols-[1.1fr_1fr]">
        {/* Radar */}
        <div className="flex flex-col bg-[#1a1a1a]">
          <div className="flex items-center justify-between border-b border-[#3c3c3c] px-5 py-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white">
              Radar técnico
            </span>
            <span className="font-mono text-xs tabular-nums text-[#8a8a8a]">
              Promedio {promedio.toFixed(1)}
            </span>
          </div>
          <div
            className="px-2 py-4"
            role="img"
            aria-label={`Radar de habilidades: ${HABILIDADES.map((h) => `${h.nombre} ${h.valor}`).join(", ")}`}
          >
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={[...HABILIDADES]} outerRadius="72%">
                <PolarGrid stroke={COLORES.borde} />
                <PolarAngleAxis
                  dataKey="etiquetaCorta"
                  tick={{ fill: "#bbbbbb", fontSize: 11, fontWeight: 700 }}
                />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  tickCount={5}
                  angle={90}
                  axisLine={false}
                  tick={{ fill: "#5a5a5a", fontSize: 10 }}
                />
                <Tooltip
                  isAnimationActive={false}
                  content={({ active, payload }) => (
                    <TooltipHabilidad
                      activo={active}
                      habilidad={payload?.[0]?.payload as Habilidad | undefined}
                    />
                  )}
                />
                <Radar
                  name="Habilidad"
                  dataKey="valor"
                  stroke={COLORES.azulClaro}
                  strokeWidth={2}
                  fill={COLORES.azulClaro}
                  fillOpacity={0.35}
                  dot={{ r: 4, fill: "#ffffff", stroke: COLORES.azulClaro, strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#ffffff", stroke: COLORES.azulClaro, strokeWidth: 2 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leyenda lateral */}
        <ul className="flex flex-col divide-y divide-[#3c3c3c] bg-[#1a1a1a]">
          {HABILIDADES.map((habilidad) => {
            const Icono = habilidad.icono;
            const esActiva = habilidad.id === idActiva;
            const color = colorPorPuntaje(habilidad.valor);
            return (
              <li key={habilidad.id}>
                <button
                  type="button"
                  onClick={() => setIdActiva(habilidad.id)}
                  aria-expanded={esActiva}
                  aria-controls={`consejo-${habilidad.id}`}
                  className={`flex w-full flex-col gap-2 px-5 py-4 text-left outline-none transition-colors focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white ${
                    esActiva ? "bg-[#262626]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icono
                      className="h-4 w-4 shrink-0"
                      style={{ color: esActiva ? COLORES.azulClaro : COLORES.textoTenue }}
                      aria-hidden
                    />
                    <span className="flex-1 text-sm font-bold uppercase tracking-wider text-white">
                      {habilidad.nombre}
                    </span>
                    <span className="font-mono text-base font-bold tabular-nums" style={{ color }}>
                      {habilidad.valor}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 text-[#5a5a5a] transition-transform ${
                        esActiva ? "rotate-90" : ""
                      }`}
                      aria-hidden
                    />
                  </div>
                  <div className="h-0.5 w-full bg-black" aria-hidden>
                    <div className="h-full" style={{ width: `${habilidad.valor}%`, backgroundColor: color }} />
                  </div>
                  <p className="text-xs leading-relaxed text-[#a8a8a8]">{habilidad.descripcion}</p>
                </button>
                {esActiva && (
                  <div
                    id={`consejo-${habilidad.id}`}
                    className="mx-5 mb-4 flex gap-3 border-l-2 border-[#0066b1] bg-[#0066b1]/10 px-3 py-2.5"
                  >
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#0066b1]" aria-hidden />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066b1]">
                        Consejo de ingeniería
                      </span>
                      <p className="text-xs leading-relaxed text-white">{habilidad.consejo}</p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                        3. Grid de estadísticas globales                     */
/* -------------------------------------------------------------------------- */

function SeccionEstadisticas() {
  return (
    <section aria-labelledby="titulo-estadisticas">
      <TituloSeccion id="titulo-estadisticas" etiqueta="Carrera" titulo="Estadísticas globales" />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ESTADISTICAS.map((estadistica) => {
          const Icono = estadistica.icono;
          return (
            <li key={estadistica.etiqueta}>
              <Tarjeta className="relative flex h-full flex-col gap-4 p-6 sm:p-7 shadow-xl">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: estadistica.acento }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                    {estadistica.etiqueta}
                  </span>
                  <Icono className="h-4 w-4" style={{ color: estadistica.acento }} aria-hidden />
                </div>
                <p className="flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl sm:text-4xl font-black tabular-nums text-white">
                    {estadistica.valor}
                  </span>
                  <span className="font-mono text-xs text-[#8a8a8a]">{estadistica.unidad}</span>
                </p>
                <span className="text-xs text-[#a8a8a8] font-mono">{estadistica.detalle}</span>
              </Tarjeta>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                       4. Récords personales por circuito                    */
/* -------------------------------------------------------------------------- */

function SeccionRecords() {
  return (
    <section aria-labelledby="titulo-records">
      <TituloSeccion id="titulo-records" etiqueta="Mejores tiempos" titulo="Récords personales" />
      <Tarjeta className="overflow-x-auto shadow-2xl">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <caption className="sr-only">Mejores tiempos de vuelta por circuito</caption>
          <thead>
            <tr className="border-b border-[#262626] bg-[#0d0d0d]">
              <th scope="col" className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Circuito
              </th>
              <th scope="col" className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Mejor vuelta
              </th>
              <th scope="col" className="px-6 py-4 text-right text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {RECORDS.map((record) => (
              <tr key={record.id} className="border-b border-[#262626] last:border-b-0 hover:bg-white/[0.03] transition-colors">
                <th scope="row" className="px-6 py-5 font-normal">
                  <div className="flex items-center gap-3">
                    <span className="w-10 shrink-0 border border-[#3c3c3c] bg-[#141414] py-1 text-center font-mono text-[10px] font-bold text-[#e2e8f0]">
                      {record.pais}
                    </span>
                    <span className="text-base font-bold uppercase tracking-wider text-white">
                      {record.circuito}
                    </span>
                  </div>
                </th>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xl font-bold tabular-nums text-[#10b981]">{record.tiempo}</span>
                    {record.esRecordSesion && (
                      <span className="inline-flex items-center gap-1.5 bg-[#0066b1] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-white shadow-[0_0_12px_rgba(0,102,177,0.4)]">
                        <Trophy className="h-3 w-3 text-[#f59e0b]" strokeWidth={2.5} aria-hidden />
                        Récord de sesión
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <Link
                    href="/app/analysis"
                    aria-label={`Abrir telemetría de ${record.circuito}`}
                    className="group inline-flex items-center gap-2 border border-[#3c3c3c] hover:border-[#0066b1] bg-[#141414] hover:bg-[#0066b1] px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white outline-none transition-all shadow-md"
                  >
                    Abrir telemetría
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 text-[#0066b1] group-hover:text-white" aria-hidden />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Tarjeta>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                         5. Insignias y logros técnicos                      */
/* -------------------------------------------------------------------------- */

function SeccionInsignias() {
  return (
    <section aria-labelledby="titulo-insignias">
      <TituloSeccion id="titulo-insignias" etiqueta="Logros técnicos" titulo="Insignias desbloqueadas" />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {INSIGNIAS.map((insignia) => {
          const Icono = insignia.icono;
          return (
            <li key={insignia.id}>
              <Tarjeta className="flex h-full flex-col items-center gap-5 p-8 text-center shadow-xl">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <span
                    aria-hidden
                    className="absolute inset-0 rotate-45 border-2 shadow-lg"
                    style={{ borderColor: insignia.acento, backgroundColor: `${insignia.acento}1a` }}
                  />
                  <Icono className="relative h-7 w-7" style={{ color: insignia.acento }} aria-hidden />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    {insignia.nombre}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#a8a8a8]">{insignia.descripcion}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#10b981]">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                  Desbloqueada
                </span>
              </Tarjeta>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Página                                   */
/* -------------------------------------------------------------------------- */

export default function PaginaPerfil() {
  return (
    <div className="space-y-10 sm:space-y-12 max-w-7xl mx-auto pb-16">
      <nav aria-label="Ruta de navegación">
        <ol className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
          <li>
            <Link href="/app" className="outline-none transition-colors hover:text-white focus-visible:text-white">
              Boxes
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3 w-3" />
          </li>
          <li aria-current="page" className="text-[#0066b1]">
            Perfil de piloto
          </li>
        </ol>
      </nav>

      <TarjetaPiloto perfil={PERFIL} />
      <SeccionHabilidades />
      <SeccionEstadisticas />
      <SeccionRecords />
      <SeccionInsignias />
    </div>
  );
}
