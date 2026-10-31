"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MapPin, Route, Play, Pause, RotateCcw, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MuestraTelemetria } from "@/types/telemetria";

export interface VueltaInfoRef {
  ranura: "A" | "B";
  numeroVuelta: number;
  tiempoVueltaStr: string;
}

export interface MapaCircuitoCanvasProps {
  muestras: MuestraTelemetria[];
  muestrasComparativas?: MuestraTelemetria[];
  distanciaSeleccionada?: number | null;
  onSeleccionarDistancia?: (distancia: number | null) => void;
  nombreCircuito?: string;
  longitudMetros?: number;
  vueltaAInfo?: VueltaInfoRef;
  vueltaBInfo?: VueltaInfoRef;
  ranuraActiva?: "A" | "B";
  onCambiarRanura?: (ranura: "A" | "B") => void;
}

/* -------------------------------------------------------------------------- */
/*                                Configuración                                */
/* -------------------------------------------------------------------------- */

const COLORES = {
  azulClaro: "#0066b1",
  azulOscuro: "#1c69d4",
  azulApagado: "#16588e",
  rojoM: "#e22718",
  verde: "#0fa336",
  transicion: "#0066b1",
  asfalto: "#262626",
  bordeAsfalto: "#3c3c3c",
  blanco: "#ffffff",
  textoTenue: "#bbbbbb",
} as const;

const GRADIENTE_TRICOLOR = `linear-gradient(to right, ${COLORES.azulClaro} 0 33.33%, ${COLORES.azulOscuro} 33.33% 66.66%, ${COLORES.rojoM} 66.66% 100%)`;

const PADDING_PX = 36;
const UMBRAL_FRENO = 0.3;
const UMBRAL_ACELERADOR = 0.8;
const SALTO_MAXIMO_METROS = 60;
const INVERTIR_EJE_Z = false;

/* -------------------------------------------------------------------------- */
/*                                   Tipos                                     */
/* -------------------------------------------------------------------------- */

type ZonaCalor = "frenada" | "aceleracion" | "transicion";

interface PuntoTrazado {
  x: number;
  z: number;
  distancia: number;
  velocidad: number;
  acelerador: number;
  freno: number;
  marcha: number;
  zona: ZonaCalor;
}

interface CajaLimite {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

interface Trazado {
  puntos: PuntoTrazado[];
  caja: CajaLimite | null;
  longitudCalculada: number;
}

interface Tamano {
  ancho: number;
  alto: number;
}

interface Proyeccion {
  escala: number;
  desplazamientoX: number;
  desplazamientoY: number;
  rotar90?: boolean;
}

interface PuntoCanvas {
  x: number;
  y: number;
}

interface EstiloZona {
  color: string;
  grosor: number;
  brillo: number;
}

const ESTILOS_ZONA: Record<ZonaCalor, EstiloZona> = {
  transicion: { color: COLORES.transicion, grosor: 2.5, brillo: 0 },
  aceleracion: { color: COLORES.verde, grosor: 3, brillo: 0 },
  frenada: { color: COLORES.rojoM, grosor: 4.5, brillo: 12 },
};

const ORDEN_PINTADO: readonly ZonaCalor[] = ["transicion", "aceleracion", "frenada"];

/* -------------------------------------------------------------------------- */
/*                           Preparación de los datos                          */
/* -------------------------------------------------------------------------- */

function clasificarZona(muestra: MuestraTelemetria): ZonaCalor {
  if (muestra.freno > UMBRAL_FRENO) return "frenada";
  if (muestra.acelerador > UMBRAL_ACELERADOR) return "aceleracion";
  return "transicion";
}

function prepararTrazado(muestras: readonly MuestraTelemetria[]): Trazado {
  const puntos: PuntoTrazado[] = muestras
    .filter(
      (m) =>
        Number.isFinite(m.distanciaMetros) &&
        Number.isFinite(m.posicionMundo.x) &&
        Number.isFinite(m.posicionMundo.z),
    )
    .sort((a, b) => a.distanciaMetros - b.distanciaMetros)
    .map((m) => ({
      x: m.posicionMundo.x,
      z: m.posicionMundo.z,
      distancia: m.distanciaMetros,
      velocidad: m.velocidadKmh,
      acelerador: m.acelerador,
      freno: m.freno,
      marcha: m.marcha,
      zona: clasificarZona(m),
    }));

  if (puntos.length === 0) return { puntos, caja: null, longitudCalculada: 0 };

  const caja: CajaLimite = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minZ: Number.POSITIVE_INFINITY,
    maxZ: Number.NEGATIVE_INFINITY,
  };
  let longitudGeometrica = 0;

  puntos.forEach((punto, indice) => {
    caja.minX = Math.min(caja.minX, punto.x);
    caja.maxX = Math.max(caja.maxX, punto.x);
    caja.minZ = Math.min(caja.minZ, punto.z);
    caja.maxZ = Math.max(caja.maxZ, punto.z);

    const anterior = puntos[indice - 1];
    if (anterior) {
      const tramo = Math.hypot(punto.x - anterior.x, punto.z - anterior.z);
      if (tramo <= SALTO_MAXIMO_METROS) longitudGeometrica += tramo;
    }
  });

  const primero = puntos[0];
  const ultimo = puntos[puntos.length - 1];
  const longitudPorDistancia =
    primero && ultimo ? ultimo.distancia - primero.distancia : 0;

  return {
    puntos,
    caja,
    longitudCalculada: longitudPorDistancia > 0 ? longitudPorDistancia : longitudGeometrica,
  };
}

function calcularProyeccion(caja: CajaLimite, tamano: Tamano): Proyeccion {
  const rangoX = Math.max(caja.maxX - caja.minX, 1e-6);
  const rangoZ = Math.max(caja.maxZ - caja.minZ, 1e-6);
  const anchoUtil = Math.max(tamano.ancho - PADDING_PX * 2, 1);
  const altoUtil = Math.max(tamano.alto - PADDING_PX * 2, 1);

  // Escala en orientación normal
  const escalaNormal = Math.min(anchoUtil / rangoX, altoUtil / rangoZ);
  // Escala en orientación rotada 90° (Z pasa al ancho del contenedor)
  const escalaRotada = Math.min(anchoUtil / rangoZ, altoUtil / rangoX);

  // Si rotar 90° aprovecha un 15%+ mejor el espacio horizontal de la tarjeta (ej. Monza)
  const rotar90 = escalaRotada > escalaNormal * 1.15;
  const escala = rotar90 ? escalaRotada : escalaNormal;

  const anchoOcupado = (rotar90 ? rangoZ : rangoX) * escala;
  const altoOcupado = (rotar90 ? rangoX : rangoZ) * escala;

  return {
    rotar90,
    escala,
    desplazamientoX: (tamano.ancho - anchoOcupado) / 2,
    desplazamientoY: (tamano.alto - altoOcupado) / 2,
  };
}

function proyectarPunto(punto: PuntoTrazado, caja: CajaLimite, proyeccion: Proyeccion): PuntoCanvas {
  if (proyeccion.rotar90) {
    const xRel = punto.z - caja.minZ;
    const yRel = punto.x - caja.minX;
    return {
      x: proyeccion.desplazamientoX + xRel * proyeccion.escala,
      y: proyeccion.desplazamientoY + yRel * proyeccion.escala,
    };
  }

  const z = INVERTIR_EJE_Z ? caja.maxZ - punto.z : punto.z - caja.minZ;
  return {
    x: proyeccion.desplazamientoX + (punto.x - caja.minX) * proyeccion.escala,
    y: proyeccion.desplazamientoY + z * proyeccion.escala,
  };
}

function buscarIndiceMasCercano(puntos: readonly PuntoTrazado[], distancia: number): number | null {
  if (puntos.length === 0) return null;
  let bajo = 0;
  let alto = puntos.length - 1;

  while (bajo < alto) {
    const medio = (bajo + alto) >> 1;
    const punto = puntos[medio];
    if (punto && punto.distancia < distancia) bajo = medio + 1;
    else alto = medio;
  }

  const candidato = puntos[bajo];
  const previo = puntos[bajo - 1];
  if (!candidato) return null;
  if (previo && Math.abs(previo.distancia - distancia) < Math.abs(candidato.distancia - distancia)) {
    return bajo - 1;
  }
  return bajo;
}

function hayCorte(a: PuntoTrazado, b: PuntoTrazado): boolean {
  return Math.hypot(b.x - a.x, b.z - a.z) > SALTO_MAXIMO_METROS;
}

/* -------------------------------------------------------------------------- */
/*                                   Dibujo                                    */
/* -------------------------------------------------------------------------- */

function prepararCanvas(
  canvas: HTMLCanvasElement,
  tamano: Tamano,
  dpr: number,
): CanvasRenderingContext2D | null {
  const anchoFisico = Math.max(Math.round(tamano.ancho * dpr), 1);
  const altoFisico = Math.max(Math.round(tamano.alto * dpr), 1);
  if (canvas.width !== anchoFisico) canvas.width = anchoFisico;
  if (canvas.height !== altoFisico) canvas.height = altoFisico;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, tamano.ancho, tamano.alto);
  return ctx;
}

function dibujarAsfalto(
  ctx: CanvasRenderingContext2D,
  puntos: readonly PuntoTrazado[],
  puntosCanvas: readonly PuntoCanvas[],
): void {
  const trazar = (): void => {
    ctx.beginPath();
    puntosCanvas.forEach((p, i) => {
      const punto = puntos[i];
      const anterior = puntos[i - 1];
      if (i === 0 || !punto || !anterior || hayCorte(anterior, punto)) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
  };

  trazar();
  ctx.strokeStyle = COLORES.bordeAsfalto;
  ctx.lineWidth = 14;
  ctx.stroke();

  trazar();
  ctx.strokeStyle = COLORES.asfalto;
  ctx.lineWidth = 10;
  ctx.stroke();
}

function dibujarMapaCalor(
  ctx: CanvasRenderingContext2D,
  puntos: readonly PuntoTrazado[],
  puntosCanvas: readonly PuntoCanvas[],
): void {
  const caminos: Record<ZonaCalor, Path2D> = {
    transicion: new Path2D(),
    aceleracion: new Path2D(),
    frenada: new Path2D(),
  };

  let inicioTramo = 0;
  for (let i = 1; i <= puntos.length; i++) {
    const actual = puntos[i];
    const anterior = puntos[i - 1];
    const inicio = puntos[inicioTramo];
    if (!anterior || !inicio) break;

    const corte = actual !== undefined && hayCorte(anterior, actual);
    const cambiaZona = actual !== undefined && actual.zona !== inicio.zona;
    if (actual !== undefined && !corte && !cambiaZona) continue;

    const fin = actual !== undefined && !corte ? i : i - 1;
    const camino = caminos[inicio.zona];
    const pInicio = puntosCanvas[inicioTramo];
    if (pInicio) {
      camino.moveTo(pInicio.x, pInicio.y);
      for (let j = inicioTramo + 1; j <= fin; j++) {
        const p = puntosCanvas[j];
        if (p) camino.lineTo(p.x, p.y);
      }
      if (fin === inicioTramo) camino.lineTo(pInicio.x + 0.01, pInicio.y);
    }
    inicioTramo = i;
  }

  for (const zona of ORDEN_PINTADO) {
    const estilo = ESTILOS_ZONA[zona];
    ctx.save();
    ctx.strokeStyle = estilo.color;
    ctx.lineWidth = estilo.grosor;
    if (estilo.brillo > 0) {
      ctx.shadowColor = estilo.color;
      ctx.shadowBlur = estilo.brillo;
    }
    ctx.stroke(caminos[zona]);
    ctx.restore();
  }
}

function dibujarLineaMeta(
  ctx: CanvasRenderingContext2D,
  puntos: readonly PuntoTrazado[],
  puntosCanvas: readonly PuntoCanvas[],
): void {
  const origen = puntosCanvas[0];
  const primero = puntos[0];
  if (!origen || !primero) return;

  let destino: PuntoCanvas | undefined;
  for (let i = 1; i < Math.min(puntos.length, 200); i++) {
    const punto = puntos[i];
    if (punto && Math.hypot(punto.x - primero.x, punto.z - primero.z) > 5) {
      destino = puntosCanvas[i];
      break;
    }
  }
  if (!destino) return;

  const dx = destino.x - origen.x;
  const dy = destino.y - origen.y;
  const largo = Math.hypot(dx, dy);
  if (largo === 0) return;

  const perpX = -dy / largo;
  const perpY = dx / largo;
  const semiLargo = 14;
  const segmentos = 6;

  ctx.save();
  ctx.lineCap = "butt";

  ctx.beginPath();
  ctx.moveTo(origen.x - perpX * (semiLargo + 1.5), origen.y - perpY * (semiLargo + 1.5));
  ctx.lineTo(origen.x + perpX * (semiLargo + 1.5), origen.y + perpY * (semiLargo + 1.5));
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 7;
  ctx.stroke();

  for (let s = 0; s < segmentos; s++) {
    const t0 = -semiLargo + (2 * semiLargo * s) / segmentos;
    const t1 = -semiLargo + (2 * semiLargo * (s + 1)) / segmentos;
    ctx.beginPath();
    ctx.moveTo(origen.x + perpX * t0, origen.y + perpY * t0);
    ctx.lineTo(origen.x + perpX * t1, origen.y + perpY * t1);
    ctx.strokeStyle = s % 2 === 0 ? COLORES.blanco : "#1a1a1a";
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  ctx.font = "700 10px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillStyle = COLORES.textoTenue;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("S/F", origen.x + perpX * (semiLargo + 12), origen.y + perpY * (semiLargo + 12));
  ctx.restore();
}

function dibujarMarcadorAuto(
  ctx: CanvasRenderingContext2D,
  posicion: PuntoCanvas,
  etiqueta: "A" | "B",
  esSecundario: boolean = false,
): void {
  ctx.save();

  const colorNucleo = esSecundario ? COLORES.azulApagado : COLORES.azulClaro;
  const colorAnillo = esSecundario ? "#93c5fd" : COLORES.blanco;
  const colorHalo = esSecundario ? "rgba(22, 88, 142, 0.32)" : "rgba(0, 102, 177, 0.28)";

  // 1. Halo exterior suave
  ctx.beginPath();
  ctx.arc(posicion.x, posicion.y, esSecundario ? 8.5 : 10, 0, Math.PI * 2);
  ctx.fillStyle = colorHalo;
  ctx.fill();

  // 2. Borde de contraste negro
  ctx.beginPath();
  ctx.arc(posicion.x, posicion.y, esSecundario ? 6.5 : 7, 0, Math.PI * 2);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = esSecundario ? 3 : 3.5;
  ctx.stroke();

  // 3. Anillo de precisión
  ctx.beginPath();
  ctx.arc(posicion.x, posicion.y, esSecundario ? 5.5 : 6.5, 0, Math.PI * 2);
  ctx.strokeStyle = colorAnillo;
  ctx.lineWidth = esSecundario ? 1.75 : 2;
  ctx.stroke();

  // 4. Núcleo central sólido (Azul M brillante para A, Azul apagado para B)
  ctx.beginPath();
  ctx.arc(posicion.x, posicion.y, esSecundario ? 3.5 : 4, 0, Math.PI * 2);
  ctx.fillStyle = colorNucleo;
  ctx.fill();

  // 5. Pequeño badge indicador con letra "A" o "B" flotante
  const badgeY = posicion.y - (esSecundario ? 11 : 12);
  ctx.fillStyle = esSecundario ? "#16588e" : "#ffffff";
  ctx.fillRect(posicion.x - 5, badgeY - 5, 10, 10);

  ctx.strokeStyle = esSecundario ? "#93c5fd" : "#000000";
  ctx.lineWidth = 1;
  ctx.strokeRect(posicion.x - 5, badgeY - 5, 10, 10);

  ctx.font = "bold 8px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = esSecundario ? "#ffffff" : "#000000";
  ctx.fillText(etiqueta, posicion.x, badgeY + 0.5);

  ctx.restore();
}

/* -------------------------------------------------------------------------- */
/*                                  Formato                                    */
/* -------------------------------------------------------------------------- */

function formatearLongitud(metros: number): string {
  return metros >= 1000 ? `${(metros / 1000).toFixed(3)} km` : `${Math.round(metros)} m`;
}

const ETIQUETA_ZONA: Record<ZonaCalor, string> = {
  frenada: "Frenada",
  aceleracion: "A fondo",
  transicion: "Transición",
};

/* -------------------------------------------------------------------------- */
/*                               Subcomponentes                                */
/* -------------------------------------------------------------------------- */

function ItemLeyenda({ color, grosor, texto }: { color: string; grosor: number; texto: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        aria-hidden
        className="w-5 shrink-0 rounded-full"
        style={{ backgroundColor: color, height: `${grosor}px` }}
      />
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#bbbbbb]">
        {texto}
      </span>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Componente                                  */
/* -------------------------------------------------------------------------- */

export function MapaCircuitoCanvas({
  muestras,
  muestrasComparativas,
  distanciaSeleccionada = null,
  onSeleccionarDistancia,
  nombreCircuito,
  longitudMetros,
  vueltaAInfo,
  vueltaBInfo,
  ranuraActiva = "A",
  onCambiarRanura,
}: MapaCircuitoCanvasProps) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const canvasPistaRef = useRef<HTMLCanvasElement>(null);
  const canvasMarcadorRef = useRef<HTMLCanvasElement>(null);

  const [tamano, setTamano] = useState<Tamano>({ ancho: 0, alto: 0 });
  const [dpr, setDpr] = useState<number>(1);
  const [distanciaLocal, setDistanciaLocal] = useState<number | null>(null);
  const [estaReproduciendo, setEstaReproduciendo] = useState<boolean>(false);
  const [estaArrastrando, setEstaArrastrando] = useState<boolean>(false);

  /* ----------------------------- Datos derivados ---------------------------- */

  const trazado = useMemo(() => prepararTrazado(muestras), [muestras]);

  const puntosCanvas = useMemo<PuntoCanvas[]>(() => {
    const { caja, puntos } = trazado;
    if (!caja || tamano.ancho === 0 || tamano.alto === 0) return [];
    const proyeccion = calcularProyeccion(caja, tamano);
    return puntos.map((punto) => proyectarPunto(punto, caja, proyeccion));
  }, [trazado, tamano]);

  const trazadoB = useMemo(
    () =>
      muestrasComparativas && muestrasComparativas.length >= 2
        ? prepararTrazado(muestrasComparativas)
        : null,
    [muestrasComparativas],
  );

  const puntosCanvasB = useMemo<PuntoCanvas[]>(() => {
    if (!trazadoB || !trazado.caja || tamano.ancho === 0 || tamano.alto === 0) return [];
    const proyeccion = calcularProyeccion(trazado.caja, tamano);
    return trazadoB.puntos.map((punto) => proyectarPunto(punto, trazado.caja!, proyeccion));
  }, [trazadoB, trazado.caja, tamano]);

  const longitud = longitudMetros ?? trazado.longitudCalculada;
  const hayTrazado = trazado.puntos.length >= 2;

  // La distancia activa es la que viene de prop (ej. hover de Recharts) o la local (hover/click en mapa)
  const distanciaActiva = distanciaSeleccionada ?? distanciaLocal ?? (hayTrazado ? 0 : null);

  const distanciaRef = useRef<number>(distanciaActiva ?? 0);
  useEffect(() => {
    distanciaRef.current = distanciaActiva ?? 0;
  }, [distanciaActiva]);

  const indiceSeleccionado = useMemo(
    () =>
      distanciaActiva === null || !Number.isFinite(distanciaActiva)
        ? null
        : buscarIndiceMasCercano(trazado.puntos, distanciaActiva),
    [trazado, distanciaActiva],
  );

  const indiceComparativo = useMemo(() => {
    if (!trazadoB || distanciaActiva === null || !Number.isFinite(distanciaActiva)) return null;
    return buscarIndiceMasCercano(trazadoB.puntos, distanciaActiva);
  }, [trazadoB, distanciaActiva]);

  const puntoSeleccionado =
    indiceSeleccionado === null ? undefined : trazado.puntos[indiceSeleccionado];

  const puntoSeleccionadoB =
    indiceComparativo === null || !trazadoB ? undefined : trazadoB.puntos[indiceComparativo];

  const deltaVelocidad =
    puntoSeleccionado && puntoSeleccionadoB
      ? puntoSeleccionadoB.velocidad - puntoSeleccionado.velocidad
      : null;

  /* ------------------- Interacción directa con el Canvas -------------------- */

  const manejarInteraccionPuntero = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, esClickOArrastre = false) => {
      if (!contenedorRef.current || puntosCanvas.length === 0) return;
      const rect = contenedorRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let menorDistPx = Number.POSITIVE_INFINITY;
      let indiceCercano = -1;

      for (let i = 0; i < puntosCanvas.length; i++) {
        const p = puntosCanvas[i]!;
        const distPx = Math.hypot(p.x - mouseX, p.y - mouseY);
        if (distPx < menorDistPx) {
          menorDistPx = distPx;
          indiceCercano = i;
        }
      }

      // Si hace click o arrastra, cualquier punto del canvas selecciona la curva más cercana.
      // Si solo pasa el cursor (hover), selecciona si está a menos de 140px.
      const umbral = esClickOArrastre ? Number.POSITIVE_INFINITY : 140;
      if (indiceCercano >= 0 && menorDistPx < umbral) {
        const punto = trazado.puntos[indiceCercano];
        if (punto) {
          distanciaRef.current = punto.distancia;
          setDistanciaLocal(punto.distancia);
          onSeleccionarDistancia?.(punto.distancia);
        }
      }
    },
    [puntosCanvas, trazado.puntos, onSeleccionarDistancia],
  );

  /* ----------------------- Reproducción animada de vuelta ------------------- */

  useEffect(() => {
    if (!estaReproduciendo || longitud <= 0) return;

    let animId = 0;
    let ultimoTiempo = performance.now();
    let ultimoEnvioNotificacion = 0;

    const pasoAnimacion = (tiempoActual: number) => {
      const dtSegundos = (tiempoActual - ultimoTiempo) / 1000;
      ultimoTiempo = tiempoActual;

      // Velocidad de simulación: ~200 m/s (~720 km/h virtual para recorrer el circuito en ~25s)
      const avanceMetros = dtSegundos * 220;
      let siguiente = distanciaRef.current + avanceMetros;
      if (siguiente >= longitud) {
        siguiente = 0;
      }
      distanciaRef.current = siguiente;

      setDistanciaLocal(siguiente);

      // Emitimos al padre fuera del setState para no violar las reglas de render de React
      if (tiempoActual - ultimoEnvioNotificacion > 32) {
        ultimoEnvioNotificacion = tiempoActual;
        onSeleccionarDistancia?.(siguiente);
      }

      animId = requestAnimationFrame(pasoAnimacion);
    };

    animId = requestAnimationFrame(pasoAnimacion);
    return () => cancelAnimationFrame(animId);
  }, [estaReproduciendo, longitud, onSeleccionarDistancia]);

  /* ------------------------- Tamaño del contenedor -------------------------- */

  useEffect(() => {
    const contenedor = contenedorRef.current;
    if (!contenedor) return;

    const inicial = contenedor.getBoundingClientRect();
    if (inicial.width > 0 && inicial.height > 0) {
      setTamano({ ancho: inicial.width, alto: inicial.height });
    }

    const observador = new ResizeObserver((entradas) => {
      const entrada = entradas[0];
      if (!entrada) return;
      const { width, height } = entrada.contentRect;
      setTamano((previo) =>
        previo.ancho === width && previo.alto === height ? previo : { ancho: width, alto: height },
      );
    });

    observador.observe(contenedor);
    return () => observador.disconnect();
  }, []);

  /* --------------- Densidad de píxeles (cambio de monitor / zoom) ------------- */

  useEffect(() => {
    let consulta: MediaQueryList | null = null;

    const actualizar = (): void => {
      setDpr(window.devicePixelRatio || 1);
      consulta?.removeEventListener("change", actualizar);
      consulta = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      consulta.addEventListener("change", actualizar);
    };

    actualizar();
    return () => consulta?.removeEventListener("change", actualizar);
  }, []);

  /* ------------------------ Capa estática: el trazado ------------------------ */

  useEffect(() => {
    const canvas = canvasPistaRef.current;
    if (!canvas || tamano.ancho === 0 || tamano.alto === 0) return;

    const ctx = prepararCanvas(canvas, tamano, dpr);
    if (!ctx || !hayTrazado || puntosCanvas.length !== trazado.puntos.length) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    dibujarAsfalto(ctx, trazado.puntos, puntosCanvas);
    dibujarMapaCalor(ctx, trazado.puntos, puntosCanvas);
    dibujarLineaMeta(ctx, trazado.puntos, puntosCanvas);
  }, [trazado, puntosCanvas, tamano, dpr, hayTrazado]);

  /* --------------------- Capa dinámica: marcadores comparativos -------------------- */

  useEffect(() => {
    const canvas = canvasMarcadorRef.current;
    if (!canvas || tamano.ancho === 0 || tamano.alto === 0) return;

    const ctx = prepararCanvas(canvas, tamano, dpr);
    if (!ctx) return;

    const posA = indiceSeleccionado === null ? undefined : puntosCanvas[indiceSeleccionado];
    if (!posA) return;

    const posB = indiceComparativo === null ? undefined : puntosCanvasB[indiceComparativo];

    if (posB) {
      const distPx = Math.hypot(posB.x - posA.x, posB.y - posA.y);

      // Si están muy juntos (a menos de 14px), separamos perpendicularmente para que ambos sean visibles
      if (distPx < 14) {
        const idxSig = Math.min((indiceSeleccionado ?? 0) + 1, puntosCanvas.length - 1);
        const sig = puntosCanvas[idxSig] ?? posA;
        const dx = sig.x - posA.x;
        const dy = sig.y - posA.y;
        const len = Math.hypot(dx, dy) || 1;
        const perpX = -dy / len;
        const perpY = dx / len;

        const posAOffset = { x: posA.x - perpX * 5.5, y: posA.y - perpY * 5.5 };
        const posBOffset = { x: posB.x + perpX * 5.5, y: posB.y + perpY * 5.5 };

        // Auto B (Azul apagado) y Auto A (Blanco / Azul brillante)
        dibujarMarcadorAuto(ctx, posBOffset, "B", true);
        dibujarMarcadorAuto(ctx, posAOffset, "A", false);
      } else {
        // Línea conectora tenue entre ambos en pista
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(posA.x, posA.y);
        ctx.lineTo(posB.x, posB.y);
        ctx.strokeStyle = "rgba(147, 197, 253, 0.45)";
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        dibujarMarcadorAuto(ctx, posB, "B", true);
        dibujarMarcadorAuto(ctx, posA, "A", false);
      }
    } else {
      dibujarMarcadorAuto(ctx, posA, "A", false);
    }
  }, [indiceSeleccionado, indiceComparativo, puntosCanvas, puntosCanvasB, tamano, dpr]);

  /* --------------------------------- Render --------------------------------- */

  return (
    <section
      className="flex flex-col border border-[#3c3c3c] bg-[#1a1a1a] text-white"
      aria-labelledby="titulo-mapa-circuito"
    >
      <div aria-hidden className="h-1 w-full" style={{ background: GRADIENTE_TRICOLOR }} />

      {/* Encabezado con información de vuelta y controles de reproducción */}
      <header className="flex flex-col gap-3 border-b border-[#3c3c3c] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="titulo-mapa-circuito"
              className="text-xs font-bold uppercase tracking-[0.25em] text-white"
            >
              Trazada 2D &amp; Mapa de Calor
            </h2>
            <span className="text-[10px] text-[#5a5a5a]">•</span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#bbbbbb]">
              <span className="text-[#8a8a8a]">Mostrando:</span>
              <strong className={ranuraActiva === "B" ? "text-[#81c4ff]" : "text-white"}>
                {ranuraActiva === "B"
                  ? `Vuelta B ${vueltaBInfo ? `· V${String(vueltaBInfo.numeroVuelta).padStart(2, "0")} (${vueltaBInfo.tiempoVueltaStr})` : ""}`
                  : `Vuelta A ${vueltaAInfo ? `· V${String(vueltaAInfo.numeroVuelta).padStart(2, "0")} (${vueltaAInfo.tiempoVueltaStr})` : ""}`}
              </strong>
            </span>
          </div>
          {nombreCircuito && (
            <p className="flex items-center gap-1.5 truncate text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden />
              {nombreCircuito}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector interactivo de Vuelta A / Vuelta B para el mapa de calor */}
          {vueltaBInfo ? (
            <div className="flex items-center gap-1 border border-[#3c3c3c] bg-[#141414] p-0.5">
              <button
                type="button"
                onClick={() => onCambiarRanura?.("A")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
                  ranuraActiva === "A"
                    ? "bg-white text-black shadow-sm"
                    : "text-[#8a8a8a] hover:text-white",
                )}
                title="Mostrar mapa de calor de la Vuelta A (Base)"
              >
                <span className="font-mono text-[9px] font-black">A</span>
                <span>{vueltaAInfo ? `V${String(vueltaAInfo.numeroVuelta).padStart(2, "0")}` : "Vuelta A"}</span>
              </button>
              <button
                type="button"
                onClick={() => onCambiarRanura?.("B")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
                  ranuraActiva === "B"
                    ? "bg-[#0066b1] text-white shadow-sm"
                    : "text-[#8a8a8a] hover:text-white",
                )}
                title="Mostrar mapa de calor de la Vuelta B (Comparativa)"
              >
                <span className="font-mono text-[9px] font-black">B</span>
                <span>{vueltaBInfo ? `V${String(vueltaBInfo.numeroVuelta).padStart(2, "0")}` : "Vuelta B"}</span>
              </button>
            </div>
          ) : vueltaAInfo ? (
            <div className="flex items-center gap-1.5 border border-[#3c3c3c] bg-[#262626] px-2.5 py-1">
              <span className="inline-flex h-4 w-4 items-center justify-center bg-white font-mono text-[9px] font-black text-black">
                A
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                V{String(vueltaAInfo.numeroVuelta).padStart(2, "0")} ({vueltaAInfo.tiempoVueltaStr})
              </span>
            </div>
          ) : null}

          {/* Botón Play / Pausa para simular la vuelta */}
          <div className="flex items-center gap-1 border border-[#3c3c3c] bg-[#262626] p-0.5">
            <button
              type="button"
              onClick={() => setEstaReproduciendo((prev) => !prev)}
              aria-label={estaReproduciendo ? "Pausar simulación" : "Reproducir vuelta"}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
            >
              {estaReproduciendo ? (
                <>
                  <Pause className="h-3 w-3 text-[#f4b400]" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 text-[#0fa336]" />
                  <span>Animar</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setEstaReproduciendo(false);
                distanciaRef.current = 0;
                setDistanciaLocal(0);
                onSeleccionarDistancia?.(0);
              }}
              title="Reiniciar a la línea de meta"
              className="p-1 text-[#8a8a8a] transition-colors hover:text-white"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>

          {longitud > 0 && (
            <span className="inline-flex w-fit items-center gap-2 border border-[#3c3c3c] bg-[#262626] px-2.5 py-1">
              <Route className="h-3.5 w-3.5 text-[#0066b1]" aria-hidden />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Longitud
              </span>
              <span className="font-mono text-xs tabular-nums text-white">
                {formatearLongitud(longitud)}
              </span>
            </span>
          )}
        </div>
      </header>

      {/* Lienzo Interactivo (Escucha movimientos de cursor, clicks y arrastre) */}
      <div
        ref={contenedorRef}
        onPointerDown={(e) => {
          try {
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          } catch {}
          setEstaArrastrando(true);
          manejarInteraccionPuntero(e, true);
        }}
        onPointerUp={(e) => {
          setEstaArrastrando(false);
          try {
            (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
          } catch {}
        }}
        onPointerCancel={() => setEstaArrastrando(false)}
        onPointerMove={(e) => {
          manejarInteraccionPuntero(e, estaArrastrando);
        }}
        className="relative aspect-[16/10] min-h-[300px] w-full cursor-crosshair bg-[#141414] select-none touch-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        <canvas
          ref={canvasPistaRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          role="img"
          aria-label={
            nombreCircuito
              ? `Trazada del circuito ${nombreCircuito} coloreada por frenada, aceleración y transición`
              : "Trazada del circuito coloreada por frenada, aceleración y transición"
          }
        />
        <canvas
          ref={canvasMarcadorRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        />

        {!hayTrazado && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center pointer-events-none">
            <Route className="h-6 w-6 text-[#5a5a5a]" aria-hidden />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8a8a8a]">
              Sin datos de posición para trazar
            </p>
          </div>
        )}

        {/* HUD de Telemetría Flotante en tiempo real del punto seleccionado */}
        {puntoSeleccionado && (
          <div
            className="pointer-events-none absolute left-3 top-3 flex flex-wrap items-center gap-2.5 border border-[#3c3c3c] bg-[#1a1a1a]/95 px-3 py-2 shadow-xl backdrop-blur-sm"
            aria-live="polite"
          >
            {/* Auto A */}
            <div className="flex items-center gap-1.5">
              <span className="inline-flex h-4 w-4 items-center justify-center bg-white font-mono text-[9px] font-black text-black">
                A
              </span>
              <span className="font-mono text-xs font-semibold tabular-nums text-white">
                {puntoSeleccionado.velocidad.toFixed(0)} km/h
              </span>
              <span className="font-mono text-xs text-[#8a8a8a]">
                M{puntoSeleccionado.marcha}
              </span>
            </div>

            {/* Auto B Comparativo (Azul apagado) */}
            {puntoSeleccionadoB && (
              <>
                <span className="font-mono text-[#3c3c3c]">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex h-4 w-4 items-center justify-center bg-[#16588e] font-mono text-[9px] font-black text-white">
                    B
                  </span>
                  <span className="font-mono text-xs font-semibold tabular-nums text-[#93c5fd]">
                    {puntoSeleccionadoB.velocidad.toFixed(0)} km/h
                  </span>
                  <span className="font-mono text-xs text-[#8a8a8a]">
                    M{puntoSeleccionadoB.marcha}
                  </span>
                </div>

                {deltaVelocidad !== null && (
                  <>
                    <span className="font-mono text-[#3c3c3c]">|</span>
                    <span className="font-mono text-xs font-bold tabular-nums">
                      {deltaVelocidad > 0 ? (
                        <span className="text-[#0fa336]">+{deltaVelocidad.toFixed(0)} km/h</span>
                      ) : deltaVelocidad < 0 ? (
                        <span className="text-[#e22718]">{deltaVelocidad.toFixed(0)} km/h</span>
                      ) : (
                        <span className="text-[#8a8a8a]">0 km/h</span>
                      )}
                    </span>
                  </>
                )}
              </>
            )}

            <span className="font-mono text-[#3c3c3c]">|</span>

            {/* Distancia común */}
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="h-2 w-2 rounded-full bg-[#0066b1] ring-2 ring-white" />
              <span className="font-mono text-xs font-bold tabular-nums text-white">
                {Math.round(puntoSeleccionado.distancia)} m
              </span>
            </span>

            {/* Zona */}
            <span
              className="text-[9px] font-bold uppercase tracking-[0.15em]"
              style={{ color: ESTILOS_ZONA[puntoSeleccionado.zona].color }}
            >
              {ETIQUETA_ZONA[puntoSeleccionado.zona]}
            </span>
          </div>
        )}

        {/* Indicador de ayuda al usuario */}
        <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#6a6a6a]">
          <Compass className="h-3 w-3" />
          <span>Hacé click o arrastrá sobre la pista para inspeccionar</span>
        </div>
      </div>

      {/* Scrubber slider interactivo para recorrer la pista milímetro a milímetro */}
      {longitud > 0 && (
        <div className="border-t border-[#3c3c3c] bg-[#141414] px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#8a8a8a]">
              Scrubber
            </span>
            <input
              type="range"
              min={0}
              max={longitud}
              step={5}
              value={distanciaActiva ?? 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                distanciaRef.current = val;
                setDistanciaLocal(val);
                onSeleccionarDistancia?.(val);
              }}
              className="h-1.5 flex-1 cursor-pointer accent-[#0066b1] bg-[#262626]"
            />
            <span className="font-mono text-xs tabular-nums text-white">
              {Math.round(distanciaActiva ?? 0)} / {Math.round(longitud)} m
            </span>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <footer className="border-t border-[#3c3c3c] px-4 py-2.5">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Leyenda del mapa de calor">
          {/* Indicadores de referencia de los autos */}
          <li className="flex items-center gap-1.5 border-r border-[#3c3c3c] pr-4">
            <span className="inline-flex h-3.5 w-3.5 items-center justify-center bg-white font-mono text-[8px] font-black text-black">
              A
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">
              Auto A (Base)
            </span>
          </li>
          {trazadoB && (
            <li className="flex items-center gap-1.5 border-r border-[#3c3c3c] pr-4">
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center bg-[#16588e] font-mono text-[8px] font-black text-white">
                B
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#93c5fd]">
                Auto B (Comparativa)
              </span>
            </li>
          )}

          <ItemLeyenda
            color={COLORES.verde}
            grosor={ESTILOS_ZONA.aceleracion.grosor}
            texto="Aceleración a fondo (> 80%)"
          />
          <ItemLeyenda
            color={COLORES.rojoM}
            grosor={ESTILOS_ZONA.frenada.grosor}
            texto="Frenada intensa (> 30%)"
          />
          <ItemLeyenda
            color={COLORES.transicion}
            grosor={ESTILOS_ZONA.transicion.grosor}
            texto="Zonas de transición / Vértices"
          />
        </ul>
      </footer>
    </section>
  );
}

export default MapaCircuitoCanvas;
