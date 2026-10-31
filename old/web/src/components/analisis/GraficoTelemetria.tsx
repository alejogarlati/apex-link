"use client";

import { useMemo } from "react";
import { Activity } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MuestraTelemetria } from "@/types/telemetria";

export interface GraficoTelemetriaProps {
  muestrasVueltaA: MuestraTelemetria[];
  muestrasVueltaB?: MuestraTelemetria[];
  nombreVueltaA?: string;
  nombreVueltaB?: string;
  distanciaActiva?: number | null;
  onHoverDistancia?: (distancia: number | null) => void;
}

/* -------------------------------------------------------------------------- */
/*                                   Constantes                                */
/* -------------------------------------------------------------------------- */

const COLORES = {
  vueltaA: "#ffffff",
  vueltaB: "#0066b1",
  acelerador: "#0fa336",
  freno: "#e22718",
  grilla: "#2a2a2a",
  ejes: "#8a8a8a",
  borde: "#3c3c3c",
  cursor: "#bbbbbb",
} as const;

const ID_SINCRONIZACION = "telemetria-sync";
/** Ancho fijo del eje Y en ambos gráficos para que queden alineados verticalmente. */
const ANCHO_EJE_Y = 44;
/** Tope de puntos renderizados (rendimiento de Recharts con SVG). */
const MAX_PUNTOS = 1500;
const MARGEN_GRAFICO = { top: 8, right: 12, bottom: 0, left: 0 };
const ALTO_VELOCIDAD = 260;
const ALTO_PEDALES = 170;

const ESTILO_TICK = {
  fill: COLORES.ejes,
  fontSize: 11,
  fontFamily: "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)",
};

/* -------------------------------------------------------------------------- */
/*                         Modelo de datos del gráfico                         */
/* -------------------------------------------------------------------------- */

/**
 * Punto sobre una grilla común de distancia. Ambas vueltas se remuestrean
 * sobre la misma grilla para que el cursor sincronizado (syncId) y el tooltip
 * comparen exactamente la misma posición de pista.
 */
interface PuntoGrafico {
  distancia: number;
  velocidadA: number | null;
  velocidadB: number | null;
  aceleradorA: number | null; // 0 a 100
  frenoA: number | null; // 0 a 100
  aceleradorB: number | null;
  frenoB: number | null;
  marchaA: number | null;
  marchaB: number | null;
}

interface SerieTelemetria {
  puntos: PuntoGrafico[];
  distanciaMin: number;
  distanciaMax: number;
}

interface ValoresInterpolados {
  velocidad: number;
  acelerador: number;
  freno: number;
  marcha: number;
}

const limitar = (valor: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, valor));

const interpolarLineal = (a: number, b: number, t: number): number => a + (b - a) * t;

function ordenarPorDistancia(muestras: readonly MuestraTelemetria[]): MuestraTelemetria[] {
  return [...muestras]
    .filter((m) => Number.isFinite(m.distanciaMetros))
    .sort((a, b) => a.distanciaMetros - b.distanciaMetros);
}

/**
 * Devuelve un interpolador lineal por distancia. Debe consultarse con
 * distancias crecientes: avanza un puntero interno (O(n) total).
 */
function crearInterpolador(
  muestras: readonly MuestraTelemetria[],
): (distancia: number) => ValoresInterpolados | null {
  let indice = 0;

  return (distancia: number): ValoresInterpolados | null => {
    const primera = muestras[0];
    const ultima = muestras[muestras.length - 1];
    if (!primera || !ultima) return null;
    if (distancia < primera.distanciaMetros || distancia > ultima.distanciaMetros) return null;

    while (indice < muestras.length - 2) {
      const siguiente = muestras[indice + 1];
      if (!siguiente || siguiente.distanciaMetros >= distancia) break;
      indice++;
    }

    const a = muestras[indice] ?? primera;
    const b = muestras[indice + 1] ?? a;
    const tramo = b.distanciaMetros - a.distanciaMetros;
    const t = tramo > 0 ? limitar((distancia - a.distanciaMetros) / tramo, 0, 1) : 0;

    return {
      velocidad: interpolarLineal(a.velocidadKmh, b.velocidadKmh, t),
      acelerador: limitar(interpolarLineal(a.acelerador, b.acelerador, t), 0, 1) * 100,
      freno: limitar(interpolarLineal(a.freno, b.freno, t), 0, 1) * 100,
      // La marcha es discreta: se toma la muestra más cercana.
      marcha: t < 0.5 ? a.marcha : b.marcha,
    };
  };
}

function construirSerie(
  muestrasA: readonly MuestraTelemetria[],
  muestrasB: readonly MuestraTelemetria[] | undefined,
): SerieTelemetria {
  const ordenA = ordenarPorDistancia(muestrasA);
  const ordenB = muestrasB ? ordenarPorDistancia(muestrasB) : [];
  const conDatos = [ordenA, ordenB].filter((serie) => serie.length > 0);

  if (ordenA.length === 0 || conDatos.length === 0) {
    return { puntos: [], distanciaMin: 0, distanciaMax: 0 };
  }

  const distanciaMin = Math.min(...conDatos.map((s) => s[0]?.distanciaMetros ?? 0));
  const distanciaMax = Math.max(...conDatos.map((s) => s[s.length - 1]?.distanciaMetros ?? 0));
  const cantidad = limitar(Math.max(ordenA.length, ordenB.length), 2, MAX_PUNTOS);
  const paso = (distanciaMax - distanciaMin) / (cantidad - 1);

  const interpolarA = crearInterpolador(ordenA);
  const interpolarB = ordenB.length > 0 ? crearInterpolador(ordenB) : null;

  const puntos: PuntoGrafico[] = [];
  for (let i = 0; i < cantidad; i++) {
    const distancia = i === cantidad - 1 ? distanciaMax : distanciaMin + paso * i;
    const a = interpolarA(distancia);
    const b = interpolarB ? interpolarB(distancia) : null;

    puntos.push({
      distancia,
      velocidadA: a?.velocidad ?? null,
      velocidadB: b?.velocidad ?? null,
      aceleradorA: a?.acelerador ?? null,
      frenoA: a?.freno ?? null,
      aceleradorB: b?.acelerador ?? null,
      frenoB: b?.freno ?? null,
      marchaA: a?.marcha ?? null,
      marchaB: b?.marcha ?? null,
    });
  }

  return { puntos, distanciaMin, distanciaMax };
}

function velocidadMaxima(muestras: readonly MuestraTelemetria[] | undefined): number | null {
  if (!muestras || muestras.length === 0) return null;
  return muestras.reduce((max, m) => Math.max(max, m.velocidadKmh), Number.NEGATIVE_INFINITY);
}

/* -------------------------------------------------------------------------- */
/*                                   Formato                                   */
/* -------------------------------------------------------------------------- */

const formatearMetros = (metros: number): string => `${Math.round(metros)} m`;

function formatearValor(valor: number | null, decimales: number, unidad: string): string {
  return valor === null ? "—" : `${valor.toFixed(decimales)}${unidad}`;
}

function formatearMarcha(marcha: number | null): string {
  if (marcha === null) return "—";
  if (marcha === 0) return "N";
  if (marcha < 0) return "R";
  return String(marcha);
}

function formatearDeltaVelocidad(delta: number): string {
  const signo = delta > 0 ? "+" : delta < 0 ? "-" : "±";
  return `${signo}${Math.abs(delta).toFixed(1)} km/h`;
}

/* -------------------------------------------------------------------------- */
/*                                   Tooltip                                   */
/* -------------------------------------------------------------------------- */

type VarianteTooltip = "velocidad" | "pedales";

interface FilaTooltipProps {
  color: string;
  etiqueta: string;
  valor: string;
  discontinua?: boolean;
  colorValor?: string;
}

function FilaTooltip({ color, etiqueta, valor, discontinua = false, colorValor }: FilaTooltipProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-0.5">
      <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#bbbbbb]">
        <span
          aria-hidden
          className={discontinua ? "w-3 border-t-2 border-dashed" : "h-0.5 w-3"}
          style={discontinua ? { borderColor: color } : { backgroundColor: color }}
        />
        {etiqueta}
      </span>
      <span
        className="font-mono text-xs tabular-nums"
        style={{ color: colorValor ?? COLORES.vueltaA }}
      >
        {valor}
      </span>
    </div>
  );
}

interface TooltipTelemetriaProps {
  activo: boolean | undefined;
  punto: PuntoGrafico | undefined;
  variante: VarianteTooltip;
  nombreA: string;
  nombreB: string;
  hayVueltaB: boolean;
}

function TooltipTelemetria({
  activo,
  punto,
  variante,
  nombreA,
  nombreB,
  hayVueltaB,
}: TooltipTelemetriaProps) {
  if (!activo || !punto) return null;

  const deltaVelocidad =
    punto.velocidadA !== null && punto.velocidadB !== null
      ? punto.velocidadB - punto.velocidadA
      : null;

  return (
    <div className="min-w-[200px] border border-[#3c3c3c] bg-[#1a1a1a] px-3 py-2 shadow-2xl shadow-black/60">
      <div className="mb-1.5 flex items-center justify-between gap-6 border-b border-[#3c3c3c] pb-1.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8a8a8a]">
          Distancia
        </span>
        <span className="font-mono text-xs tabular-nums text-white">
          {formatearMetros(punto.distancia)}
        </span>
      </div>

      {variante === "velocidad" ? (
        <>
          <FilaTooltip
            color={COLORES.vueltaA}
            etiqueta={`${nombreA} · ${formatearMarcha(punto.marchaA)}`}
            valor={formatearValor(punto.velocidadA, 1, " km/h")}
          />
          {hayVueltaB && (
            <FilaTooltip
              color={COLORES.vueltaB}
              etiqueta={`${nombreB} · ${formatearMarcha(punto.marchaB)}`}
              valor={formatearValor(punto.velocidadB, 1, " km/h")}
            />
          )}
          {hayVueltaB && deltaVelocidad !== null && (
            <div className="mt-1 border-t border-[#2a2a2a] pt-1">
              <FilaTooltip
                color="transparent"
                etiqueta="Δ B − A"
                valor={formatearDeltaVelocidad(deltaVelocidad)}
                colorValor={
                  deltaVelocidad > 0
                    ? COLORES.acelerador
                    : deltaVelocidad < 0
                      ? COLORES.freno
                      : COLORES.ejes
                }
              />
            </div>
          )}
        </>
      ) : (
        <>
          <FilaTooltip
            color={COLORES.acelerador}
            etiqueta={`Acel · ${nombreA}`}
            valor={formatearValor(punto.aceleradorA, 0, "%")}
          />
          <FilaTooltip
            color={COLORES.freno}
            etiqueta={`Freno · ${nombreA}`}
            valor={formatearValor(punto.frenoA, 0, "%")}
          />
          {hayVueltaB && (
            <div className="mt-1 border-t border-[#2a2a2a] pt-1">
              <FilaTooltip
                color={COLORES.acelerador}
                etiqueta={`Acel · ${nombreB}`}
                valor={formatearValor(punto.aceleradorB, 0, "%")}
                discontinua
              />
              <FilaTooltip
                color={COLORES.freno}
                etiqueta={`Freno · ${nombreB}`}
                valor={formatearValor(punto.frenoB, 0, "%")}
                discontinua
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Subcomponentes                                */
/* -------------------------------------------------------------------------- */

function FranjaM() {
  return (
    <div aria-hidden className="flex h-1 w-12">
      <span className="flex-1 bg-[#81c4ff]" />
      <span className="flex-1 bg-[#16588e]" />
      <span className="flex-1 bg-[#e22718]" />
    </div>
  );
}

function ItemLeyenda({
  color,
  etiqueta,
  discontinua = false,
}: {
  color: string;
  etiqueta: string;
  discontinua?: boolean;
}) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#bbbbbb]">
      <span
        aria-hidden
        className={discontinua ? "w-4 border-t-2 border-dashed" : "h-0.5 w-4"}
        style={discontinua ? { borderColor: color } : { backgroundColor: color }}
      />
      {etiqueta}
    </span>
  );
}

function Metrica({ etiqueta, valor, color }: { etiqueta: string; valor: string; color?: string }) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
        {etiqueta}
      </span>
      <span className="font-mono text-sm tabular-nums" style={{ color: color ?? COLORES.vueltaA }}>
        {valor}
      </span>
    </div>
  );
}

function EncabezadoPanel({ titulo, unidad }: { titulo: string; unidad: string }) {
  return (
    <div className="flex items-baseline gap-2 px-4 pb-1 pt-3">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">{titulo}</h3>
      <span className="font-mono text-[10px] uppercase text-[#6a6a6a]">{unidad}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Componente                                  */
/* -------------------------------------------------------------------------- */

export function GraficoTelemetria({
  muestrasVueltaA,
  muestrasVueltaB,
  nombreVueltaA = "Vuelta A",
  nombreVueltaB = "Vuelta B",
  distanciaActiva,
  onHoverDistancia,
}: GraficoTelemetriaProps) {
  const hayVueltaB = (muestrasVueltaB?.length ?? 0) > 0;

  const { puntos, distanciaMin, distanciaMax } = useMemo(
    () => construirSerie(muestrasVueltaA, muestrasVueltaB),
    [muestrasVueltaA, muestrasVueltaB],
  );

  const vmaxA = useMemo(() => velocidadMaxima(muestrasVueltaA), [muestrasVueltaA]);
  const vmaxB = useMemo(() => velocidadMaxima(muestrasVueltaB), [muestrasVueltaB]);

  /** Techo del eje de velocidad redondeado a múltiplos de 20 km/h con margen. */
  const techoVelocidad = useMemo(() => {
    const maximo = Math.max(vmaxA ?? 0, vmaxB ?? 0);
    return Math.max(100, Math.ceil(maximo / 20) * 20 + 20);
  }, [vmaxA, vmaxB]);

  if (puntos.length === 0) {
    return (
      <section className="flex min-h-[320px] flex-col items-center justify-center gap-3 border border-[#3c3c3c] bg-[#1a1a1a] text-center">
        <Activity className="h-7 w-7 text-[#5a5a5a]" aria-hidden />
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8a8a8a]">
          Seleccioná una vuelta para ver la telemetría
        </p>
      </section>
    );
  }

  const dominioX: [number, number] = [distanciaMin, distanciaMax];
  const deltaVmax = vmaxA !== null && vmaxB !== null ? vmaxB - vmaxA : null;

  const manejarMovimientoGrafico = (estado: {
    activeTooltipIndex?: number | unknown;
    activeLabel?: string | number;
  }) => {
    if (typeof estado?.activeTooltipIndex === "number" && estado.activeTooltipIndex >= 0) {
      const punto = puntos[estado.activeTooltipIndex];
      if (punto && Number.isFinite(punto.distancia)) {
        onHoverDistancia?.(punto.distancia);
        return;
      }
    }
    if (typeof estado?.activeLabel === "number" && Number.isFinite(estado.activeLabel)) {
      onHoverDistancia?.(estado.activeLabel);
    }
  };

  return (
    <section
      className="flex flex-col border border-[#3c3c3c] bg-[#1a1a1a] text-white"
      aria-labelledby="titulo-grafico-telemetria"
    >
      {/* Encabezado */}
      <header className="flex flex-col gap-3 border-b border-[#3c3c3c] px-4 pb-3 pt-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <FranjaM />
          <h2
            id="titulo-grafico-telemetria"
            className="text-xs font-bold uppercase tracking-[0.25em] text-white"
          >
            Telemetría
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <ItemLeyenda color={COLORES.vueltaA} etiqueta={nombreVueltaA} />
            {hayVueltaB && <ItemLeyenda color={COLORES.vueltaB} etiqueta={nombreVueltaB} />}
            <ItemLeyenda color={COLORES.acelerador} etiqueta="Acelerador" />
            <ItemLeyenda color={COLORES.freno} etiqueta="Freno" />
            {hayVueltaB && <ItemLeyenda color={COLORES.ejes} etiqueta="Pedales B" discontinua />}
          </div>
        </div>

        <div className="flex items-end gap-5">
          <Metrica etiqueta="Distancia" valor={formatearMetros(distanciaMax - distanciaMin)} />
          <Metrica etiqueta="Vmáx A" valor={formatearValor(vmaxA, 1, "")} />
          {hayVueltaB && (
            <Metrica etiqueta="Vmáx B" valor={formatearValor(vmaxB, 1, "")} color={COLORES.vueltaB} />
          )}
          {deltaVmax !== null && (
            <Metrica
              etiqueta="Δ Vmáx"
              valor={`${deltaVmax > 0 ? "+" : ""}${deltaVmax.toFixed(1)}`}
              color={deltaVmax > 0 ? COLORES.acelerador : deltaVmax < 0 ? COLORES.freno : COLORES.ejes}
            />
          )}
        </div>
      </header>

      {/* Gráfico superior: velocidad */}
      <div role="img" aria-label="Velocidad en km/h según la distancia recorrida">
        <EncabezadoPanel titulo="Velocidad" unidad="km/h" />
        <ResponsiveContainer width="100%" height={ALTO_VELOCIDAD}>
          <LineChart
            data={puntos}
            syncId={ID_SINCRONIZACION}
            margin={MARGEN_GRAFICO}
            onMouseMove={manejarMovimientoGrafico}
          >
            <CartesianGrid stroke={COLORES.grilla} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="distancia"
              type="number"
              domain={dominioX}
              allowDataOverflow
              hide
            />
            <YAxis
              width={ANCHO_EJE_Y}
              domain={[0, techoVelocidad]}
              tick={ESTILO_TICK}
              tickLine={false}
              axisLine={{ stroke: COLORES.borde }}
              tickCount={6}
              allowDecimals={false}
            />
            <Tooltip
              isAnimationActive={false}
              cursor={{ stroke: COLORES.cursor, strokeWidth: 1, strokeDasharray: "4 4" }}
              content={({ active, payload }) => (
                <TooltipTelemetria
                  activo={active}
                  punto={payload?.[0]?.payload as PuntoGrafico | undefined}
                  variante="velocidad"
                  nombreA={nombreVueltaA}
                  nombreB={nombreVueltaB}
                  hayVueltaB={hayVueltaB}
                />
              )}
            />
            {distanciaActiva !== null && distanciaActiva !== undefined && Number.isFinite(distanciaActiva) && (
              <ReferenceLine
                x={distanciaActiva}
                stroke={COLORES.vueltaB}
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            )}
            {hayVueltaB && (
              <Line
                type="linear"
                dataKey="velocidadB"
                name={nombreVueltaB}
                stroke={COLORES.vueltaB}
                strokeWidth={1.75}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0, fill: COLORES.vueltaB }}
                isAnimationActive={false}
                connectNulls={false}
              />
            )}
            <Line
              type="linear"
              dataKey="velocidadA"
              name={nombreVueltaA}
              stroke={COLORES.vueltaA}
              strokeWidth={1.75}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0, fill: COLORES.vueltaA }}
              isAnimationActive={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mx-4 border-t border-[#2a2a2a]" aria-hidden />

      {/* Gráfico inferior: pedales */}
      <div role="img" aria-label="Acelerador y freno en porcentaje según la distancia recorrida">
        <EncabezadoPanel titulo="Pedales" unidad="0–100 %" />
        <ResponsiveContainer width="100%" height={ALTO_PEDALES}>
          <LineChart
            data={puntos}
            syncId={ID_SINCRONIZACION}
            margin={{ ...MARGEN_GRAFICO, bottom: 8 }}
            onMouseMove={manejarMovimientoGrafico}
          >
            <CartesianGrid stroke={COLORES.grilla} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="distancia"
              type="number"
              domain={dominioX}
              allowDataOverflow
              tickFormatter={formatearMetros}
              tick={ESTILO_TICK}
              tickLine={false}
              axisLine={{ stroke: COLORES.borde }}
              tickCount={8}
              minTickGap={24}
            />
            <YAxis
              width={ANCHO_EJE_Y}
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickFormatter={(valor: number) => `${valor}%`}
              tick={ESTILO_TICK}
              tickLine={false}
              axisLine={{ stroke: COLORES.borde }}
            />
            <Tooltip
              isAnimationActive={false}
              cursor={{ stroke: COLORES.cursor, strokeWidth: 1, strokeDasharray: "4 4" }}
              content={({ active, payload }) => (
                <TooltipTelemetria
                  activo={active}
                  punto={payload?.[0]?.payload as PuntoGrafico | undefined}
                  variante="pedales"
                  nombreA={nombreVueltaA}
                  nombreB={nombreVueltaB}
                  hayVueltaB={hayVueltaB}
                />
              )}
            />
            {distanciaActiva !== null && distanciaActiva !== undefined && Number.isFinite(distanciaActiva) && (
              <ReferenceLine
                x={distanciaActiva}
                stroke={COLORES.vueltaB}
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            )}
            {hayVueltaB && (
              <Line
                type="linear"
                dataKey="aceleradorB"
                name={`Acelerador ${nombreVueltaB}`}
                stroke={COLORES.acelerador}
                strokeOpacity={0.5}
                strokeWidth={1.25}
                strokeDasharray="4 3"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
                connectNulls={false}
              />
            )}
            {hayVueltaB && (
              <Line
                type="linear"
                dataKey="frenoB"
                name={`Freno ${nombreVueltaB}`}
                stroke={COLORES.freno}
                strokeOpacity={0.5}
                strokeWidth={1.25}
                strokeDasharray="4 3"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
                connectNulls={false}
              />
            )}
            <Line
              type="linear"
              dataKey="aceleradorA"
              name={`Acelerador ${nombreVueltaA}`}
              stroke={COLORES.acelerador}
              strokeWidth={1.75}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0, fill: COLORES.acelerador }}
              isAnimationActive={false}
              connectNulls={false}
            />
            <Line
              type="linear"
              dataKey="frenoA"
              name={`Freno ${nombreVueltaA}`}
              stroke={COLORES.freno}
              strokeWidth={1.75}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0, fill: COLORES.freno }}
              isAnimationActive={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default GraficoTelemetria;
