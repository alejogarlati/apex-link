"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  obtenerSesionLocal,
  USUARIO_ALEJO_GARLATI,
} from "@/lib/auth";
import { obtenerPerfilPiloto } from "@/lib/apiClient";
import type {
  PerfilUsuario,
  HabilidadDetalle,
  RecordCircuitoPiloto,
  LogroGamificado,
} from "@/types/usuario";
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
  Zap,
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
/*                                Tipos UI Locales                             */
/* -------------------------------------------------------------------------- */

interface EstadisticaGlobal {
  etiqueta: string;
  valor: string;
  unidad: string;
  detalle: string;
  icono: LucideIcon;
  acento: string;
}

/* -------------------------------------------------------------------------- */
/*                                   Utilidades                                */
/* -------------------------------------------------------------------------- */

function colorPorPuntaje(valor: number): string {
  if (valor >= 90) return COLORES.verde;
  if (valor >= 80) return COLORES.azulOscuro;
  return COLORES.amarillo;
}

function iconoHabilidad(id: string): LucideIcon {
  switch (id) {
    case "frenada":
      return Disc;
    case "traccion":
      return TrendingUp;
    case "apice":
      return Gauge;
    case "consistencia":
      return Repeat;
    case "limites":
      return Flag;
    default:
      return Disc;
  }
}

function iconoLogro(icono: string): LucideIcon {
  switch (icono) {
    case "zap":
      return Zap;
    case "gauge":
      return Gauge;
    case "crosshair":
      return Crosshair;
    case "timer":
      return Timer;
    case "disc":
      return Disc;
    case "shield-check":
      return ShieldCheck;
    case "award":
      return Award;
    default:
      return Trophy;
  }
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
    <div className={`surface-specular ${className}`}>{children}</div>
  );
}

function DatoPiloto({ icono: Icono, etiqueta, valor }: { icono: LucideIcon; etiqueta: string; valor: string }) {
  return (
    <div className="flex items-center gap-3 border border-[#3c3c3c] bg-[#262626] px-3 py-2">
      <Icono className="h-4 w-4 shrink-0 text-[#8a8a8a]" aria-hidden />
      <div className="flex min-w-0 flex-col">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
          {etiqueta}
        </span>
        <span className="truncate text-sm font-bold text-white">{valor}</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         1. Tarjeta principal del piloto                     */
/* -------------------------------------------------------------------------- */

function TarjetaPiloto({
  usuario,
}: {
  usuario: PerfilUsuario;
}) {
  const esGarlati = usuario.id === USUARIO_ALEJO_GARLATI.id || usuario.email.includes("garlati");
  const iniciales = esGarlati ? "AG" : "AS";

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-labelledby="titulo-piloto"
        className="grid gap-px border border-[#3c3c3c] bg-[#3c3c3c] lg:grid-cols-[1fr_320px]"
      >
        {/* Identidad */}
        <div className="flex flex-col gap-6 bg-[#1a1a1a] p-6 sm:flex-row sm:items-center sm:p-8">
          <div
            className="h-28 w-28 shrink-0 p-[3px]"
            style={{
              background: `conic-gradient(${COLORES.azulClaro} 0 120deg, ${COLORES.azulOscuro} 120deg 240deg, ${COLORES.rojoM} 240deg 360deg)`,
            }}
            aria-hidden
          >
            <div className="flex h-full w-full items-center justify-center bg-[#262626]">
              <span className="font-mono text-4xl font-bold tracking-wider text-white">
                {iniciales}
              </span>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="inline-flex w-fit items-center gap-2 border border-[#0fa336] bg-[#0fa336]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#0fa336]">
                <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0fa336]" />
                {usuario.simulador}
              </span>
              <h1
                id="titulo-piloto"
                className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl"
              >
                {usuario.nombre}
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0066b1]">
                  {usuario.licencia}
                </p>
                <span className="text-[#3c3c3c]">|</span>
                <span className="text-xs font-mono font-bold text-[#f4b400]">
                  Pace {usuario.rating.paceRating} · Cat. {usuario.rating.safetyRating}
                </span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <DatoPiloto
                icono={MapPin}
                etiqueta="Nacionalidad"
                valor={`${usuario.nacionalidad} · ${usuario.codigoPais}`}
              />
              <DatoPiloto
                icono={Car}
                etiqueta="Vehículo principal"
                valor={usuario.vehiculoPrincipal}
              />
            </div>
          </div>
        </div>

        {/* Apex Rating */}
        <div className="relative flex flex-col justify-between gap-6 bg-[#262626] p-6 sm:p-8">
          <FranjaM className="absolute inset-x-0 top-0 h-1.5" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white">
              Apex Rating
            </span>
            <Award className="h-5 w-5 text-[#f4b400]" aria-hidden />
          </div>

          <p className="flex items-baseline gap-2">
            <span className="font-mono text-6xl font-bold tabular-nums leading-none text-white">
              {usuario.puntajeGeneral.toFixed(1)}
            </span>
            <span className="font-mono text-lg text-[#8a8a8a]">/ 100</span>
          </p>

          <div className="flex flex-col gap-2">
            <div
              role="meter"
              aria-label="Apex Rating"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={usuario.puntajeGeneral}
              className="h-1.5 w-full bg-black"
            >
              <div
                className="h-full"
                style={{ width: `${usuario.puntajeGeneral}%`, background: GRADIENTE_TRICOLOR }}
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8a8a8a]">
              Calculado sobre {usuario.vueltasTotales} vueltas oficiales ({usuario.rating.nivel})
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          2. Radar de habilidades                            */
/* -------------------------------------------------------------------------- */

function TooltipHabilidad({
  activo,
  habilidad,
}: {
  activo: boolean | undefined;
  habilidad: HabilidadDetalle | undefined;
}) {
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

function SeccionHabilidades({ habilidades }: { habilidades: HabilidadDetalle[] }) {
  const [idActiva, setIdActiva] = useState<string>(habilidades[0]?.id ?? "frenada");

  useEffect(() => {
    if (habilidades.length > 0 && !habilidades.some((h) => h.id === idActiva)) {
      const primera = habilidades[0];
      if (primera) {
        setIdActiva(primera.id);
      }
    }
  }, [habilidades, idActiva]);

  const promedio =
    habilidades.length > 0
      ? habilidades.reduce((suma, h) => suma + h.valor, 0) / habilidades.length
      : 80;

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
              Promedio {promedio.toFixed(1)} / 100
            </span>
          </div>
          <div
            className="px-2 py-4"
            role="img"
            aria-label={`Radar de habilidades: ${habilidades.map((h) => `${h.nombre} ${h.valor}`).join(", ")}`}
          >
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={[...habilidades]} outerRadius="72%">
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
                      habilidad={payload?.[0]?.payload as HabilidadDetalle | undefined}
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
          {habilidades.map((habilidad) => {
            const Icono = iconoHabilidad(habilidad.id);
            const esActiva = habilidad.id === idActiva;
            const color = colorPorPuntaje(habilidad.valor);
            return (
              <li key={habilidad.id}>
                <button
                  type="button"
                  onClick={() => setIdActiva(habilidad.id)}
                  aria-expanded={esActiva}
                  aria-controls={`consejo-${habilidad.id}`}
                  className={`flex w-full flex-col gap-2 px-5 py-4 text-left outline-none transition-colors focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white cursor-pointer ${
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
                        Consejo de ingeniería de pista
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

function SeccionEstadisticas({ estadisticas }: { estadisticas: readonly EstadisticaGlobal[] }) {
  return (
    <section aria-labelledby="titulo-estadisticas">
      <TituloSeccion id="titulo-estadisticas" etiqueta="Carrera" titulo="Estadísticas globales" />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {estadisticas.map((estadistica) => {
          const Icono = estadistica.icono;
          return (
            <li key={estadistica.etiqueta}>
              <Tarjeta className="relative flex h-full flex-col gap-4 p-5">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5"
                  style={{ backgroundColor: estadistica.acento }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                    {estadistica.etiqueta}
                  </span>
                  <Icono className="h-4 w-4" style={{ color: estadistica.acento }} aria-hidden />
                </div>
                <p className="flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-bold tabular-nums text-white">
                    {estadistica.valor}
                  </span>
                  <span className="font-mono text-sm text-[#8a8a8a]">{estadistica.unidad}</span>
                </p>
                <span className="text-xs text-[#a8a8a8]">{estadistica.detalle}</span>
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

function SeccionRecords({ records }: { records: RecordCircuitoPiloto[] }) {
  return (
    <section aria-labelledby="titulo-records">
      <TituloSeccion id="titulo-records" etiqueta="Mejores tiempos" titulo="Récords personales" />
      <Tarjeta className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <caption className="sr-only">Mejores tiempos de vuelta por circuito</caption>
          <thead>
            <tr className="border-b border-[#3c3c3c] bg-[#262626]">
              <th scope="col" className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Circuito
              </th>
              <th scope="col" className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Mejor vuelta (PB)
              </th>
              <th scope="col" className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-[#2a2a2a] last:border-b-0 hover:bg-white/[0.03]">
                <th scope="row" className="px-5 py-4 font-normal">
                  <div className="flex items-center gap-3">
                    <span className="w-9 shrink-0 border border-[#3c3c3c] bg-[#262626] py-0.5 text-center font-mono text-[10px] font-bold text-[#8a8a8a]">
                      {record.pais}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-white">
                      {record.circuito}
                    </span>
                  </div>
                </th>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-lg tabular-nums text-white">{record.tiempo}</span>
                    {record.esRecordSesion && (
                      <span className="inline-flex items-center gap-1 bg-[#0066b1] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white">
                        <Trophy className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                        Récord Personal Oficial
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/app/analysis`}
                    aria-label={`Abrir telemetría de ${record.circuito}`}
                    className="group inline-flex items-center gap-2 border border-[#3c3c3c] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white outline-none transition-colors hover:border-[#0066b1] hover:bg-[#0066b1] focus-visible:ring-1 focus-visible:ring-white"
                  >
                    Abrir telemetría
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
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

function SeccionInsignias({ logros }: { logros: LogroGamificado[] }) {
  return (
    <section aria-labelledby="titulo-insignias">
      <TituloSeccion id="titulo-insignias" etiqueta="Logros técnicos" titulo="Insignias desbloqueadas" />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {logros.map((insignia) => {
          const Icono = iconoLogro(insignia.icono);
          const acento =
            insignia.id.includes("f1") || insignia.id.includes("monza")
              ? COLORES.amarillo
              : insignia.id.includes("freno")
              ? COLORES.rojoM
              : insignia.id.includes("ritmo")
              ? COLORES.azulOscuro
              : COLORES.verde;

          return (
            <li key={insignia.id}>
              <Tarjeta className="flex h-full flex-col items-center gap-4 p-6 text-center">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <span
                    aria-hidden
                    className="absolute inset-0 rotate-45 border-2"
                    style={{ borderColor: acento, backgroundColor: `${acento}1a` }}
                  />
                  <Icono className="relative h-7 w-7" style={{ color: acento }} aria-hidden />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    {insignia.titulo}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#a8a8a8]">{insignia.descripcion}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#0fa336]">
                  <ShieldCheck className="h-3 w-3" aria-hidden />
                  Desbloqueada {insignia.fechaDesbloqueo ? `(${insignia.fechaDesbloqueo})` : ""}
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
  const router = useRouter();
  const [usuario, setUsuario] = useState<PerfilUsuario>(() => {
    const sesion = obtenerSesionLocal();
    return sesion ? sesion.usuario : USUARIO_ALEJO_GARLATI;
  });

  useEffect(() => {
    const sincronizarUsuario = () => {
      const sesion = obtenerSesionLocal();
      if (sesion?.usuario) {
        setUsuario(sesion.usuario);
      }
    };

    sincronizarUsuario();
    window.addEventListener("storage", sincronizarUsuario);
    window.addEventListener("apexlink_usuario_cambiado", sincronizarUsuario);

    return () => {
      window.removeEventListener("storage", sincronizarUsuario);
      window.removeEventListener("apexlink_usuario_cambiado", sincronizarUsuario);
    };
  }, []);

  // Sincronización en vivo con backend Kestrel / PostgreSQL
  useEffect(() => {
    let cancelado = false;
    obtenerPerfilPiloto(usuario.id)
      .then((res) => {
        if (!cancelado && res.exitoso && res.datos) {
          const d = res.datos;
          const evalActual = d.ultimaEvaluacion;
          setUsuario((prev) => ({
            ...prev,
            nombre: d.nombre || prev.nombre,
            alias: d.alias || prev.alias,
            email: d.email || prev.email,
            licencia: d.licencia || prev.licencia,
            vehiculoPrincipal: d.vehiculoPrincipal || prev.vehiculoPrincipal,
            puntajeGeneral: d.puntajeGeneral ?? prev.puntajeGeneral,
            vueltasTotales: d.vueltasTotales ?? prev.vueltasTotales,
            kilometrosTotales: d.kilometrosTotales ?? prev.kilometrosTotales,
            rating: {
              paceRating: d.paceRating ?? prev.rating.paceRating,
              safetyRating: d.safetyRating ?? prev.rating.safetyRating,
              nivel: d.nivel ?? prev.rating.nivel,
              metricas: evalActual
                ? {
                    velocidad: evalActual.velocidad,
                    consistencia: evalActual.consistencia,
                    frenada: evalActual.frenada,
                    control: evalActual.control,
                    agresividad: evalActual.agresividad,
                  }
                : prev.rating.metricas,
            },
            habilidades: evalActual
              ? [
                  {
                    id: "frenada",
                    nombre: "Frenada / Trail Braking",
                    etiquetaCorta: "FRENADA",
                    valor: evalActual.frenada,
                    descripcion: "Modulación de frenada de precisión.",
                    consejo: evalActual.consejoFrenada,
                  },
                  {
                    id: "traccion",
                    nombre: "Tracción / Salida",
                    etiquetaCorta: "TRACCIÓN",
                    valor: evalActual.traccionSalida,
                    descripcion: "Despliegue de potencia a la salida de curvas.",
                    consejo: evalActual.consejoTraccion,
                  },
                  {
                    id: "apice",
                    nombre: "Velocidad en Ápice",
                    etiquetaCorta: "ÁPICE",
                    valor: evalActual.velocidadApice,
                    descripcion: "Paso por curva en vértices.",
                    consejo: evalActual.consejoApice,
                  },
                  {
                    id: "consistencia",
                    nombre: "Consistencia",
                    etiquetaCorta: "CONSISTENCIA",
                    valor: evalActual.consistencia,
                    descripcion: "Dispersión de tiempos entre vueltas.",
                    consejo: evalActual.consejoConsistencia,
                  },
                  {
                    id: "limites",
                    nombre: "Respeto de Límites",
                    etiquetaCorta: "LÍMITES",
                    valor: evalActual.respetoLimites,
                    descripcion: "Uso de pianos y trazada reglamentaria.",
                    consejo: evalActual.consejoLimites,
                  },
                ]
              : prev.habilidades,
            diagnosticoAi: evalActual
              ? {
                  puntoFuerteTitulo: evalActual.puntoFuerteTitulo,
                  puntoFuerteDesc: evalActual.puntoFuerteDesc,
                  oportunidadMejoraTitulo: evalActual.oportunidadMejoraTitulo,
                  oportunidadMejoraDesc: evalActual.oportunidadMejoraDesc,
                }
              : prev.diagnosticoAi,
            records:
              d.records && d.records.length > 0
                ? d.records.map((r) => ({
                    id: r.id,
                    circuito: r.circuito,
                    pais: r.pais,
                    tiempo: r.tiempo,
                    esRecordSesion: r.esRecordSesion,
                  }))
                : prev.records,
            logros:
              d.logros && d.logros.length > 0
                ? d.logros.map((l) => ({
                    id: l.id,
                    titulo: l.titulo,
                    descripcion: l.descripcion,
                    icono: l.icono,
                    desbloqueado: l.desbloqueado,
                    fechaDesbloqueo: l.fechaDesbloqueo,
                  }))
                : prev.logros,
          }));
        }
      })
      .catch(() => {
        // Fallback transparente a estado local si el backend está desconectado
      });

    return () => {
      cancelado = true;
    };
  }, [usuario.id]);

  const esGarlati = usuario.id === USUARIO_ALEJO_GARLATI.id || usuario.email.includes("garlati");

  const estadisticas: readonly EstadisticaGlobal[] = [
    {
      etiqueta: "Kilómetros en pista",
      valor: usuario.kilometrosTotales.toLocaleString("es-AR"),
      unidad: "km",
      detalle: "Distancia total registrada en tandas",
      icono: Route,
      acento: COLORES.azulClaro,
    },
    {
      etiqueta: "Vueltas completadas",
      valor: String(usuario.vueltasTotales),
      unidad: "vueltas",
      detalle: "Sesiones oficiales de simulador",
      icono: Repeat,
      acento: COLORES.azulOscuro,
    },
    {
      etiqueta: "Vueltas válidas",
      valor: esGarlati ? "97.1" : "90.0",
      unidad: "%",
      detalle: "Sin exceder límites de pista",
      icono: ShieldCheck,
      acento: COLORES.verde,
    },
    {
      etiqueta: "Velocidad máxima",
      valor: esGarlati ? "348.5" : "284.2",
      unidad: "km/h",
      detalle: esGarlati ? "Alcanzada en Monza (Rettifilo con DRS)" : "Alcanzada en Monza (Curva Grande)",
      icono: Gauge,
      acento: COLORES.rojoM,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-[#0066b1] selection:text-white">
      <FranjaM className="h-1.5 w-full" />

      <main className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-10 sm:px-6 sm:py-14">
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
            <li aria-current="page" className="text-white">
              Perfil de piloto • {usuario.nombre} ({usuario.alias})
            </li>
          </ol>
        </nav>

        <TarjetaPiloto usuario={usuario} />
        <SeccionHabilidades habilidades={usuario.habilidades} />
        <SeccionEstadisticas estadisticas={estadisticas} />
        <SeccionRecords records={usuario.records} />
        <SeccionInsignias logros={usuario.logros} />
      </main>
    </div>
  );
}
