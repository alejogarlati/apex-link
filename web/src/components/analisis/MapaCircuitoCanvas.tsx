"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  RotateCcw,
  Play,
  Pause,
  Flame,
  Activity,
  MapPin,
  Radio,
  GitCompare,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CIRCUITS_DATA } from "@/lib/circuitsData";
import type { MuestraTelemetria } from "@/types/telemetria";

export interface VueltaInfoRef {
  ranura: "A" | "B";
  numeroVuelta: number;
  tiempoVueltaStr: string;
}

export interface MapaCircuitoCanvasProps {
  muestras?: MuestraTelemetria[];
  muestrasComparativas?: MuestraTelemetria[];
  distanciaSeleccionada?: number | null;
  onSeleccionarDistancia?: (distancia: number | null) => void;
  nombreCircuito?: string;
  longitudMetros?: number;
  vueltaAInfo?: VueltaInfoRef;
  vueltaBInfo?: VueltaInfoRef;
  ranuraActiva?: "A" | "B";
  onCambiarRanura?: (ranura: "A" | "B") => void;
  circuitoInicial?: "monza" | "imola" | "rbr";
}

type ModoRender = "map_png" | "isometric";
type ModoHeatmap = "throttle_brake" | "speed";
type CircuitoId = "monza" | "imola" | "rbr";

function formatearTimestamp(msTotal: number): string {
  const msSeguro = Math.max(0, Math.floor(msTotal));
  const minutos = Math.floor(msSeguro / 60000);
  const segundos = Math.floor((msSeguro % 60000) / 1000);
  const milisegundos = msSeguro % 1000;
  return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}:${String(milisegundos).padStart(3, "0")}`;
}

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
  circuitoInicial = "monza",
}: MapaCircuitoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Estados React
  const [circuitoActivoId, setCircuitoActivoId] = useState<CircuitoId>(circuitoInicial);
  const [modoRender, setModoRender] = useState<ModoRender>("map_png");
  const [modoHeatmap, setModoHeatmap] = useState<ModoHeatmap>("throttle_brake");
  const [estaReproduciendo, setEstaReproduciendo] = useState<boolean>(false);
  const [velocidadMultiplicador, setVelocidadMultiplicador] = useState<number>(1);
  const velocidadMultRef = useRef<number>(1);
  useEffect(() => {
    velocidadMultRef.current = velocidadMultiplicador;
  }, [velocidadMultiplicador]);

  // Sincronizar si cambia el circuito provisto externamente (ej: Live Pitwall)
  useEffect(() => {
    if (circuitoInicial && (circuitoInicial === "monza" || circuitoInicial === "imola" || circuitoInicial === "rbr")) {
      setCircuitoActivoId((prev) => (prev === circuitoInicial ? prev : circuitoInicial));
    }
  }, [circuitoInicial]);

  // Determinar si hay comparativa activa de dos vueltas
  const tieneComparativa = Boolean(
    vueltaBInfo || (muestrasComparativas && muestrasComparativas.length > 0)
  );

  // Referencias directas para el HUD (actualización ultra fluida a 60-144 FPS sin provocar re-renders)
  const hudSpeedRef = useRef<HTMLSpanElement>(null);
  const hudGearRef = useRef<HTMLSpanElement>(null);
  const hudRpmRef = useRef<HTMLSpanElement>(null);
  const hudGasBarRef = useRef<HTMLDivElement>(null);
  const hudGasTextRef = useRef<HTMLSpanElement>(null);
  const hudBrakeBarRef = useRef<HTMLDivElement>(null);
  const hudBrakeTextRef = useRef<HTMLSpanElement>(null);
  const hudSectionRef = useRef<HTMLSpanElement>(null);
  const hudDrsRef = useRef<HTMLSpanElement>(null);
  const hudElevRef = useRef<HTMLSpanElement>(null);
  const timestampRef = useRef<HTMLSpanElement>(null);
  const deltaBadgeRef = useRef<HTMLDivElement>(null);
  const deltaTextRef = useRef<HTMLSpanElement>(null);

  // Datos del circuito seleccionado
  const circuitoActual = useMemo(() => {
    return CIRCUITS_DATA[circuitoActivoId] || CIRCUITS_DATA.monza;
  }, [circuitoActivoId]);

  // Función que fusiona las muestras de telemetría real (velocidad, freno, acelerador, marcha, RPM)
  // con las coordenadas del circuito, garantizando correspondencia 1:1 con el gráfico y el mapa oficial
  const proyectarTelemetriaSobreCircuito = useCallback(
    (serieMuestras: MuestraTelemetria[] | undefined) => {
      const baseTrack = circuitoActual?.track ?? [];
      if (!serieMuestras || serieMuestras.length <= 5) {
        return null;
      }

      const totalDistCircuito = circuitoActual.lengthMeters || 5793;
      let minX = Infinity;
      let maxX = -Infinity;
      let minZ = Infinity;
      let maxZ = -Infinity;
      let maxDistMuestra = 1;

      for (let i = 0; i < serieMuestras.length; i++) {
        const m = serieMuestras[i]!;
        if (m.posicionMundo.x < minX) minX = m.posicionMundo.x;
        if (m.posicionMundo.x > maxX) maxX = m.posicionMundo.x;
        if (m.posicionMundo.z < minZ) minZ = m.posicionMundo.z;
        if (m.posicionMundo.z > maxZ) maxZ = m.posicionMundo.z;
        if (m.distanciaMetros > maxDistMuestra) maxDistMuestra = m.distanciaMetros;
      }

      const spanX = maxX - minX;
      const spanZ = maxZ - minZ;
      const bounds = circuitoActual.bounds;

      // Verificar si las coordenadas (X, Z) provienen del mundo 3D real de Kunos para este circuito
      const tieneCoordenadasKunosReales =
        spanX >= bounds.width * 0.65 &&
        spanZ >= bounds.depth * 0.65 &&
        minZ <= bounds.minZ * 0.5 &&
        maxZ >= bounds.maxZ * 0.5;

      if (tieneCoordenadasKunosReales) {
        return serieMuestras.map((m, idx) => {
          const ratio = Math.max(0, Math.min(1, m.distanciaMetros / totalDistCircuito));
          const refIdx = Math.min(baseTrack.length - 1, Math.floor(ratio * baseTrack.length));
          const refPt = baseTrack[refIdx];
          return {
            index: idx,
            t: ratio,
            x: m.posicionMundo.x,
            y: m.posicionMundo.y || (refPt?.y ?? 12),
            z: m.posicionMundo.z,
            dist: m.distanciaMetros,
            yaw: refPt?.yaw ?? 0,
            speed: m.velocidadKmh,
            gear: m.marcha,
            rpm: m.rpms,
            throttle: m.acelerador,
            brake: m.freno,
            slope: refPt?.slope ?? 0,
            section: refPt?.section ?? "",
            drs: refPt?.drs ?? false,
          };
        });
      }

      // Si las coordenadas provienen de una sesión cuyas posiciones (x,z) no están calibradas con map.ini,
      // interpolamos la telemetría real (velocidad, freno, acelerador, marcha, RPM) por distancia sobre la geometría oficial
      const escalaDist = maxDistMuestra > totalDistCircuito * 0.5 ? maxDistMuestra : totalDistCircuito;
      let cursorMuestra = 0;

      return baseTrack.map((pt, idx) => {
        const distObjetivo = (pt.dist / totalDistCircuito) * escalaDist;
        while (
          cursorMuestra + 1 < serieMuestras.length &&
          serieMuestras[cursorMuestra + 1]!.distanciaMetros <= distObjetivo
        ) {
          cursorMuestra++;
        }

        const m0 = serieMuestras[cursorMuestra]!;
        const m1 = serieMuestras[Math.min(serieMuestras.length - 1, cursorMuestra + 1)] ?? m0;
        const tramo = m1.distanciaMetros - m0.distanciaMetros;
        const factor = tramo > 0.05 ? Math.max(0, Math.min(1, (distObjetivo - m0.distanciaMetros) / tramo)) : 0;

        return {
          index: idx,
          t: pt.t,
          x: pt.x,
          y: pt.y,
          z: pt.z,
          dist: pt.dist,
          yaw: pt.yaw,
          speed: m0.velocidadKmh + (m1.velocidadKmh - m0.velocidadKmh) * factor,
          gear: factor < 0.5 ? m0.marcha : m1.marcha,
          rpm: Math.round(m0.rpms + (m1.rpms - m0.rpms) * factor),
          throttle: m0.acelerador + (m1.acelerador - m0.acelerador) * factor,
          brake: m0.freno + (m1.freno - m0.freno) * factor,
          slope: pt.slope,
          section: pt.section,
          drs: pt.drs,
        };
      });
    },
    [circuitoActual]
  );

  // Trazada real a partir de telemetría de Vuelta A
  const trackRealA = useMemo(() => {
    return proyectarTelemetriaSobreCircuito(muestras) ?? circuitoActual?.track ?? [];
  }, [muestras, circuitoActual, proyectarTelemetriaSobreCircuito]);

  // Trazada real a partir de telemetría de Vuelta B (comparativa)
  const trackRealB = useMemo(() => {
    return proyectarTelemetriaSobreCircuito(muestrasComparativas);
  }, [muestrasComparativas, proyectarTelemetriaSobreCircuito]);

  // Perfil temporal acumulado del circuito (dx / v a lo largo de cada segmento de pista)
  const tiemposAcumuladosPista = useMemo(() => {
    const track = trackRealA;
    if (track.length === 0) return [];
    const times: number[] = [0];
    let acumSec = 0;
    for (let i = 1; i < track.length; i++) {
      const prev = track[i - 1];
      const curr = track[i];
      if (!prev || !curr) continue;
      const dDist = Math.max(0.1, curr.dist - prev.dist);
      const avgSpeedMs = Math.max(10, ((prev.speed + curr.speed) / 2) / 3.6);
      acumSec += dDist / avgSpeedMs;
      times.push(acumSec * 1000);
    }
    return times;
  }, [trackRealA]);

  // Si se dispone del tiempo oficial de vuelta (ej. "01:21.042"), sincronizar escala exacta de meta
  const duracionObjetivoMs = useMemo(() => {
    if (!vueltaAInfo?.tiempoVueltaStr) return null;
    const partes = vueltaAInfo.tiempoVueltaStr.split(/[:.]/);
    if (partes.length >= 2) {
      const min = parseInt(partes[0] ?? "0", 10) || 0;
      const sec = parseInt(partes[1] ?? "0", 10) || 0;
      const ms = partes[2] ? parseInt(partes[2].padEnd(3, "0").slice(0, 3), 10) || 0 : 0;
      const total = (min * 60 + sec) * 1000 + ms;
      return total > 10000 ? total : null;
    }
    return null;
  }, [vueltaAInfo?.tiempoVueltaStr]);

  const tiemposEscalados = useMemo(() => {
    if (tiemposAcumuladosPista.length === 0) return [];
    const ultimoTiempo = tiemposAcumuladosPista[tiemposAcumuladosPista.length - 1];
    if (duracionObjetivoMs && ultimoTiempo && ultimoTiempo > 0) {
      const factor = duracionObjetivoMs / ultimoTiempo;
      return tiemposAcumuladosPista.map((t) => t * factor);
    }
    return tiemposAcumuladosPista;
  }, [tiemposAcumuladosPista, duracionObjetivoMs]);

  // Variables de cámara y animación (persisten sin re-renderizar)
  const estadoCamara = useRef({
    azimuth: Math.PI / 4,
    pitch: Math.atan(1 / Math.sqrt(2)),
    panX: 0,
    panY: 0,
    zoom: 0.85,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    mapImage: null as HTMLImageElement | null,
    mapLoaded: false,
    carProgressA: 0, // Avance en coma flotante del Monoplaza A
    carProgressB: 0, // Avance en coma flotante del Monoplaza B (Ghost / Comparativo)
    reproduciendo: false,
    ultimoTiempoSync: 0,
  });

  // Mantener sincronizado el ref de reproducción
  useEffect(() => {
    estadoCamara.current.reproduciendo = estaReproduciendo;
  }, [estaReproduciendo]);

  // Carga de la imagen de mapa oficial (map.png)
  useEffect(() => {
    const img = new Image();
    estadoCamara.current.mapLoaded = false;
    img.src = circuitoActual.mapImageUrl;
    img.onload = () => {
      estadoCamara.current.mapImage = img;
      estadoCamara.current.mapLoaded = true;
    };
  }, [circuitoActual.mapImageUrl]);

  // Restablecer la cámara
  const restablecerVista = useCallback(() => {
    estadoCamara.current.azimuth = Math.PI / 4;
    estadoCamara.current.pitch = Math.atan(1 / Math.sqrt(2));
    estadoCamara.current.panX = 0;
    estadoCamara.current.panY = 0;
    estadoCamara.current.zoom = modoRender === "map_png" ? 0.85 : 0.65;
  }, [modoRender]);

  // Restablecer posición y cámara SOLO al cambiar de circuito (Monza -> Imola -> RBR)
  const prevCircuitoIdRef = useRef<CircuitoId>(circuitoActivoId);
  useEffect(() => {
    if (prevCircuitoIdRef.current !== circuitoActivoId) {
      prevCircuitoIdRef.current = circuitoActivoId;
      estadoCamara.current.azimuth = Math.PI / 4;
      estadoCamara.current.pitch = Math.atan(1 / Math.sqrt(2));
      estadoCamara.current.panX = 0;
      estadoCamara.current.panY = 0;
      estadoCamara.current.carProgressA = 0;
      estadoCamara.current.carProgressB = 0;
      if (timestampRef.current) {
        timestampRef.current.textContent = "00:00:000";
      }
    }
  }, [circuitoActivoId]);

  // Al conmutar modo de render (broadcast vs 3d), ajustar zoom/pan de cámara SIN resetear el avance de los autos
  useEffect(() => {
    estadoCamara.current.panX = 0;
    estadoCamara.current.panY = 0;
    estadoCamara.current.zoom = modoRender === "map_png" ? 0.85 : 0.65;
  }, [modoRender]);

  // Sincronizar distancia externa (cuando se hace hover o scrubbing en los gráficos Recharts)
  useEffect(() => {
    if (
      !estadoCamara.current.reproduciendo &&
      typeof distanciaSeleccionada === "number" &&
      Number.isFinite(distanciaSeleccionada) &&
      trackRealA.length > 0
    ) {
      const totalMetros = circuitoActual.lengthMeters || (trackRealA[trackRealA.length - 1]?.dist ?? 1);
      const distClamped = Math.max(0, Math.min(totalMetros, distanciaSeleccionada));

      // Búsqueda binaria o indexada del punto más cercano sobre la trazada real
      let targetPointA = 0;
      for (let i = 0; i < trackRealA.length; i++) {
        if (trackRealA[i]!.dist >= distClamped) {
          targetPointA = i;
          break;
        }
      }
      estadoCamara.current.carProgressA = targetPointA;

      if (trackRealB && trackRealB.length > 0) {
        let targetPointB = 0;
        for (let i = 0; i < trackRealB.length; i++) {
          if (trackRealB[i]!.dist >= distClamped) {
            targetPointB = i;
            break;
          }
        }
        estadoCamara.current.carProgressB = targetPointB;
      } else {
        estadoCamara.current.carProgressB = Math.max(0, targetPointA - 12);
      }

      if (timestampRef.current && tiemposEscalados.length > 0) {
        const idx0 = Math.floor(targetPointA);
        const idx1 = Math.min(tiemposEscalados.length - 1, idx0 + 1);
        const frac = targetPointA - idx0;
        const t0 = tiemposEscalados[idx0] ?? 0;
        const t1 = tiemposEscalados[idx1] ?? t0;
        const ms = t0 + (t1 - t0) * frac;
        timestampRef.current.textContent = formatearTimestamp(ms);
      }
    }
  }, [distanciaSeleccionada, trackRealA, trackRealB, circuitoActual, tiemposEscalados]);

  // 1. Manejo nativo de rueda de ratón con { passive: false } para EVITAR scroll de página
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const manejarWheelNativo = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      estadoCamara.current.zoom = Math.max(0.2, Math.min(3.8, estadoCamara.current.zoom * factor));
    };

    canvas.addEventListener("wheel", manejarWheelNativo, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", manejarWheelNativo);
    };
  }, []);

  // 2. Loop de animación principal a 60-144 FPS con DUAL CAR TRACKING
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000) * velocidadMultRef.current;
      lastTime = now;

      const track = trackRealA;
      const trackB = trackRealB;
      const bounds = circuitoActual.bounds;
      const center = circuitoActual.center;
      const mapConfig = circuitoActual.mapConfig;
      const cam = estadoCamara.current;
      const totalPoints = track.length;

      // Validación estricta para evitar cualquier índice indefinido o división por cero
      if (totalPoints === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Normalización matemática euclidiana segura de avance de los monoplazas
      let safeProgressA = Number.isFinite(cam.carProgressA)
        ? ((cam.carProgressA % totalPoints) + totalPoints) % totalPoints
        : 0;

      const totalPointsB = trackB && trackB.length > 1 ? trackB.length : totalPoints;
      let safeProgressB = Number.isFinite(cam.carProgressB)
        ? ((cam.carProgressB % totalPointsB) + totalPointsB) % totalPointsB
        : 0;

      // Avance simultáneo de ambos monoplazas en carrera virtual
      if (cam.reproduciendo && totalPoints > 1) {
        const metersPerPointA = Math.max(0.1, bounds.totalDistance / totalPoints);

        // Auto A: Ritmo base (Vuelta Rápida / Tanda Real)
        const idxA = Math.floor(safeProgressA);
        const pActualA = track[idxA] ?? track[0];
        if (pActualA) {
          const speedKmhA = Math.max(60, pActualA.speed);
          const puntosAvanzadosA = ((speedKmhA / 3.6) * dt) / metersPerPointA;
          safeProgressA = ((safeProgressA + puntosAvanzadosA) % totalPoints + totalPoints) % totalPoints;
          cam.carProgressA = safeProgressA;

          // Throttle a 100ms para no saturar Recharts
          if (onSeleccionarDistancia && now - cam.ultimoTiempoSync > 100) {
            onSeleccionarDistancia(Math.round(pActualA.dist));
            cam.ultimoTiempoSync = now;
          }
        }

        // Auto B: Ritmo comparativo (según Vuelta B real o Ghost ~93%)
        if (trackB && trackB.length > 1) {
          const metersPerPointB = Math.max(0.1, bounds.totalDistance / totalPointsB);
          const idxB = Math.floor(safeProgressB);
          const pActualB = trackB[idxB] ?? trackB[0];
          if (pActualB) {
            const speedKmhB = Math.max(60, pActualB.speed);
            const puntosAvanzadosB = ((speedKmhB / 3.6) * dt) / metersPerPointB;
            safeProgressB = ((safeProgressB + puntosAvanzadosB) % totalPointsB + totalPointsB) % totalPointsB;
            cam.carProgressB = safeProgressB;
          }
        } else {
          const idxB = Math.floor(safeProgressB);
          const pActualB = track[idxB] ?? track[0];
          if (pActualB) {
            const speedKmhB = Math.max(60, pActualB.speed * 0.935);
            const puntosAvanzadosB = ((speedKmhB / 3.6) * dt) / metersPerPointA;
            safeProgressB = ((safeProgressB + puntosAvanzadosB) % totalPoints + totalPoints) % totalPoints;
            cam.carProgressB = safeProgressB;
          }
        }
      }

      // Interpolación continua (sub-píxel) ultra segura para Monoplaza A
      const idxA0 = Math.floor(safeProgressA);
      const idxA1 = (idxA0 + 1) % totalPoints;
      const fracA = safeProgressA - idxA0;
      const pA0 = track[idxA0] ?? track[0];
      const pA1 = track[idxA1] ?? pA0;

      if (!pA0 || !pA1) {
        animId = requestAnimationFrame(render);
        return;
      }

      const carAX = pA0.x + (pA1.x - pA0.x) * fracA;
      const carAY = pA0.y + (pA1.y - pA0.y) * fracA;
      const carAZ = pA0.z + (pA1.z - pA0.z) * fracA;
      const carASpeed = Math.round(pA0.speed + (pA1.speed - pA0.speed) * fracA);
      const carAGear = pA0.gear;
      const carARpm = Math.round(pA0.rpm + (pA1.rpm - pA0.rpm) * fracA);
      const carAThrottle = pA0.throttle + (pA1.throttle - pA0.throttle) * fracA;
      const carABrake = pA0.brake + (pA1.brake - pA0.brake) * fracA;
      const carASection = pA0.section;
      const carADrs = pA0.drs;
      const carADist = Math.round(pA0.dist + (pA1.dist - pA0.dist) * fracA);

      // Interpolación continua ultra segura para Monoplaza B (Ghost Car o Vuelta B Real)
      const idxB0 = Math.floor(safeProgressB);
      const idxB1 = (idxB0 + 1) % totalPointsB;
      const fracB = safeProgressB - idxB0;
      const pB0 = (trackB ? trackB[idxB0] : track[idxB0]) ?? track[0] ?? pA0;
      const pB1 = (trackB ? trackB[idxB1] : track[idxB1]) ?? pB0;

      const carBX = pB0.x + (pB1.x - pB0.x) * fracB;
      const carBY = pB0.y + (pB1.y - pB0.y) * fracB;
      const carBZ = pB0.z + (pB1.z - pB0.z) * fracB;
      const carBSpeed = Math.round(trackB ? pB0.speed + (pB1.speed - pB0.speed) * fracB : (pB0.speed + (pB1.speed - pB0.speed) * fracB) * 0.935);
      const carBDist = Math.round(pB0.dist + (pB1.dist - pB0.dist) * fracB);

      // Calcular delta métrico entre ambos monoplazas con protección contra velocidad cero
      let deltaMetros = carADist - carBDist;
      const longitudCircuito = circuitoActual.lengthMeters || 5793;
      if (deltaMetros < -longitudCircuito / 2) deltaMetros += longitudCircuito;
      if (deltaMetros > longitudCircuito / 2) deltaMetros -= longitudCircuito;
      const velocidadMs = Math.max(1, carASpeed / 3.6);
      const deltaSegundos = (deltaMetros / velocidadMs).toFixed(3);

      // Determinar cuál es el monoplaza enfocado en el HUD (Ranura A o B)
      const focoEsB = ranuraActiva === "B";
      const carFocoSpeed = focoEsB ? carBSpeed : carASpeed;
      const carFocoGear = focoEsB ? pB0.gear : carAGear;
      const carFocoRpm = focoEsB ? Math.round(pB0.rpm * 0.94) : carARpm;
      const carFocoThrottle = focoEsB ? pB0.throttle : carAThrottle;
      const carFocoBrake = focoEsB ? pB0.brake : carABrake;
      const carFocoElev = focoEsB ? carBY : carAY;

      // Actualizar el HUD directamente en el DOM a 60/144 FPS
      if (hudSpeedRef.current) hudSpeedRef.current.textContent = String(carFocoSpeed);
      if (hudGearRef.current) hudGearRef.current.textContent = `G${carFocoGear}`;
      if (hudRpmRef.current) hudRpmRef.current.textContent = String(carFocoRpm);
      if (hudGasBarRef.current) hudGasBarRef.current.style.width = `${Math.round(carFocoThrottle * 100)}%`;
      if (hudGasTextRef.current) hudGasTextRef.current.textContent = `${Math.round(carFocoThrottle * 100)}%`;
      if (hudBrakeBarRef.current) hudBrakeBarRef.current.style.width = `${Math.round(carFocoBrake * 100)}%`;
      if (hudBrakeTextRef.current) hudBrakeTextRef.current.textContent = `${Math.round(carFocoBrake * 100)}%`;
      if (hudSectionRef.current) hudSectionRef.current.textContent = carASection || "Pista Activa";
      if (hudElevRef.current) hudElevRef.current.textContent = `${carFocoElev.toFixed(1)} m`;

      if (timestampRef.current && tiemposEscalados.length > 0) {
        const t0 = tiemposEscalados[idxA0] ?? 0;
        const t1 = tiemposEscalados[idxA1] ?? t0;
        const msActual = t0 + (t1 - t0) * fracA;
        timestampRef.current.textContent = formatearTimestamp(msActual);
      }

      if (hudDrsRef.current) {
        hudDrsRef.current.style.display = carADrs ? "inline-block" : "none";
      }

      // Actualizar badge de delta flotante
      if (deltaBadgeRef.current && deltaTextRef.current) {
        if (tieneComparativa) {
          deltaBadgeRef.current.style.display = "flex";
          const signo = Number(deltaSegundos) >= 0 ? "+" : "";
          deltaTextRef.current.textContent = `${signo}${deltaSegundos} s (${Math.abs(deltaMetros)} m)`;
        } else {
          deltaBadgeRef.current.style.display = "none";
        }
      }

      // Preparar dimensiones de Canvas con DPR de pantalla Retina
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Fondo oscuro de ingeniería
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#080b11");
      bgGrad.addColorStop(1, "#020305");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const verticalExaggeration = bounds.height >= 50 ? 1.0 : bounds.height >= 25 ? 1.25 : 2.0;

      // Color del Heatmap
      const getColorCalor = (p: (typeof track)[0]) => {
        if (modoHeatmap === "throttle_brake") {
          if (p.brake > 0.15) {
            const alpha = Math.min(1.0, 0.45 + p.brake * 0.55);
            return `rgba(226, 39, 24, ${alpha})`;
          } else if (p.throttle > 0.4) {
            const alpha = Math.min(1.0, 0.5 + p.throttle * 0.5);
            return `rgba(15, 163, 54, ${alpha})`;
          } else {
            return "rgba(0, 102, 177, 0.75)";
          }
        } else {
          const ratio = Math.max(0, Math.min(1, (p.speed - 60) / 280));
          if (ratio < 0.5) {
            const r = Math.round(ratio * 2 * 255);
            return `rgb(${r}, 200, 255)`;
          } else {
            const g = Math.round((1 - (ratio - 0.5) * 2) * 220);
            return `rgb(255, ${g}, 60)`;
          }
        }
      };

      if (modoRender === "map_png" && mapConfig) {
        // =============================================================
        // MODO 1: BROADCAST OFICIAL KUNOS (map.png + map.ini)
        // =============================================================
        const { WIDTH, HEIGHT, MARGIN, SCALE_FACTOR, X_OFFSET, Z_OFFSET } = mapConfig;

        const baseW = cam.mapLoaded && cam.mapImage?.naturalWidth ? cam.mapImage.naturalWidth : WIDTH;
        const baseH = cam.mapLoaded && cam.mapImage?.naturalHeight ? cam.mapImage.naturalHeight : HEIGHT;

        const fitScale = Math.min((width * 0.88) / baseW, (height * 0.88) / baseH) * cam.zoom;
        const renderW = baseW * fitScale;
        const renderH = baseH * fitScale;
        const offsetX = (width - renderW) / 2 + cam.panX;
        const offsetY = (height - renderH) / 2 + cam.panY;

        const projectMap = (x: number, z: number) => {
          const rawPxX = (x + X_OFFSET + MARGIN) / SCALE_FACTOR;
          const rawPxY = (z + Z_OFFSET + MARGIN) / SCALE_FACTOR;
          const normX = rawPxX / WIDTH;
          const normY = rawPxY / HEIGHT;
          return {
            x: offsetX + normX * renderW,
            y: offsetY + normY * renderH,
          };
        };

        // 1. Dibujar Imagen Oficial de Asfalto
        if (cam.mapLoaded && cam.mapImage) {
          ctx.save();
          ctx.shadowColor = "rgba(0, 102, 177, 0.35)";
          ctx.shadowBlur = 12;
          ctx.drawImage(cam.mapImage, offsetX, offsetY, renderW, renderH);
          ctx.restore();
        }

        // 2. Si hay comparativa (Vuelta B), dibujar su trazada en cian punteado
        if (trackB && trackB.length > 1) {
          ctx.save();
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "rgba(147, 197, 253, 0.45)";
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          for (let i = 0; i < trackB.length; i++) {
            const pt = trackB[i]!;
            const pScreen = projectMap(pt.x, pt.z);
            if (i === 0) ctx.moveTo(pScreen.x, pScreen.y);
            else ctx.lineTo(pScreen.x, pScreen.y);
          }
          ctx.stroke();
          ctx.restore();
        }

        // 3. Trazada de Telemetría Real de Vuelta A con Heatmap
        ctx.lineWidth = 3.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const cotaPuntosA = muestras && muestras.length > 5 ? totalPoints - 1 : totalPoints;
        for (let i = 0; i < cotaPuntosA; i++) {
          const ptA = track[i];
          const ptB = track[(i + 1) % totalPoints] ?? ptA;
          if (!ptA || !ptB) continue;
          const pScreenA = projectMap(ptA.x, ptA.z);
          const pScreenB = projectMap(ptB.x, ptB.z);

          ctx.beginPath();
          ctx.moveTo(pScreenA.x, pScreenA.y);
          ctx.lineTo(pScreenB.x, pScreenB.y);
          ctx.strokeStyle = getColorCalor(ptA);
          ctx.stroke();
        }

        const posA = projectMap(carAX, carAZ);
        const posB = projectMap(carBX, carBZ);

        // 3. Si hay comparativa, dibujar línea conectora del delta entre ambos coches
        if (tieneComparativa) {
          const distPx = Math.hypot(posB.x - posA.x, posB.y - posA.y);
          if (distPx > 14) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(posA.x, posA.y);
            ctx.lineTo(posB.x, posB.y);
            ctx.strokeStyle = "rgba(147, 197, 253, 0.55)";
            ctx.setLineDash([3, 3]);
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
          }

          // DIBUJAR COCHE B (Ghost Car · Secundario · Azul Claro)
          dibujarPuck(ctx, posB, "B", true);
        }

        // DIBUJAR COCHE A (Principal · Blanco y Azul M)
        dibujarPuck(ctx, posA, "A", false);

        // Flecha de Dirección del monoplaza activo
        const nextLookIdx = (idxA0 + 8) % totalPoints;
        const nextLookP = track[nextLookIdx] ?? pA0;
        const nextLookPos = projectMap(nextLookP.x, nextLookP.z);
        const angulo = Math.atan2(nextLookPos.y - posA.y, nextLookPos.x - posA.x);

        ctx.save();
        ctx.translate(posA.x, posA.y);
        ctx.rotate(angulo);
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(5, -4);
        ctx.lineTo(5, 4);
        ctx.closePath();
        ctx.fillStyle = "#f4b400";
        ctx.fill();
        ctx.restore();
      } else {
        // =============================================================
        // MODO 2: PROYECCIÓN ISOMÉTRICA 3D CON ALTIMETRÍA REAL
        // =============================================================
        const cx = width / 2 + cam.panX;
        const cy = height / 2 + cam.panY;

        const cosA = Math.cos(cam.azimuth);
        const sinA = Math.sin(cam.azimuth);
        const sinP = Math.sin(cam.pitch);
        const cosP = Math.cos(cam.pitch);

        const maxDim = Math.max(bounds.width, bounds.depth);
        const scale = (cam.zoom * Math.min(width, height)) / (maxDim * 0.95);

        const projectIso = (x: number, y: number, z: number) => {
          const rx = x - center.x;
          const ry = (y - center.y) * verticalExaggeration;
          const rz = z - center.z;

          const rotX = rx * cosA - rz * sinA;
          const rotZ = rx * sinA + rz * cosA;

          const projX = rotX;
          const projY = rotZ * sinP - ry * cosP;

          return {
            x: cx + projX * scale,
            y: cy + projY * scale,
          };
        };

        const floorOffset = Math.max(6, bounds.height * 0.12);
        const floorY = bounds.minY - floorOffset;

        // 1. Sombra en el Suelo
        ctx.beginPath();
        for (let i = 0; i < totalPoints; i++) {
          const p = track[i];
          if (!p) continue;
          const pt = projectIso(p.x, floorY, p.z);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(0, 102, 177, 0.12)";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.strokeStyle = "rgba(0, 102, 177, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Drop-Pins de elevación
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        for (let i = 0; i < totalPoints; i += 30) {
          const p = track[i];
          if (!p) continue;
          const top = projectIso(p.x, p.y, p.z);
          const floor = projectIso(p.x, floorY, p.z);

          ctx.beginPath();
          ctx.moveTo(top.x, top.y);
          ctx.lineTo(floor.x, floor.y);
          ctx.stroke();
        }

        // 3. Cinta de Trazada 3D
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 0; i < totalPoints; i++) {
          const ptA = track[i];
          const ptB = track[(i + 1) % totalPoints] ?? ptA;
          if (!ptA || !ptB) continue;
          const pScreenA = projectIso(ptA.x, ptA.y, ptA.z);
          const pScreenB = projectIso(ptB.x, ptB.y, ptB.z);

          ctx.beginPath();
          ctx.moveTo(pScreenA.x, pScreenA.y);
          ctx.lineTo(pScreenB.x, pScreenB.y);
          ctx.strokeStyle = getColorCalor(ptA);
          ctx.stroke();
        }

        // 4. Marcadores 3D
        const posA = projectIso(carAX, carAY, carAZ);
        const floorA = projectIso(carAX, floorY, carAZ);

        // Drop-Pin a tierra para Coche A
        ctx.beginPath();
        ctx.moveTo(posA.x, posA.y);
        ctx.lineTo(floorA.x, floorA.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Coche B en 3D
        if (tieneComparativa) {
          const posB = projectIso(carBX, carBY, carBZ);
          const floorB = projectIso(carBX, floorY, carBZ);

          ctx.beginPath();
          ctx.moveTo(posB.x, posB.y);
          ctx.lineTo(floorB.x, floorB.y);
          ctx.strokeStyle = "rgba(147, 197, 253, 0.35)";
          ctx.lineWidth = 1.2;
          ctx.setLineDash([2, 2]);
          ctx.stroke();
          ctx.setLineDash([]);

          dibujarPuck(ctx, posB, "B", true);
        }

        dibujarPuck(ctx, posA, "A", false);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [circuitoActual, trackRealA, trackRealB, muestras, modoRender, modoHeatmap, tieneComparativa, ranuraActiva, onSeleccionarDistancia, tiemposEscalados]);

  // Función auxiliar de pintado de Laser Puck
  function dibujarPuck(
    ctx: CanvasRenderingContext2D,
    pos: { x: number; y: number },
    letra: "A" | "B",
    esSecundario: boolean
  ) {
    ctx.save();

    const colorHalo = esSecundario ? "rgba(28, 105, 212, 0.7)" : "rgba(0, 102, 177, 0.85)";
    const colorCore = esSecundario ? "#93c5fd" : "#ffffff";
    const radio = esSecundario ? 5 : 6;

    // Resplandor
    const halo = ctx.createRadialGradient(pos.x, pos.y, 2, pos.x, pos.y, 16);
    halo.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    halo.addColorStop(0.4, colorHalo);
    halo.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
    ctx.fillStyle = halo;
    ctx.fill();

    // Punto central
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radio, 0, Math.PI * 2);
    ctx.fillStyle = colorCore;
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Insignia con Letra A / B
    ctx.beginPath();
    ctx.arc(pos.x, pos.y - 12, 7, 0, Math.PI * 2);
    ctx.fillStyle = esSecundario ? "#1c69d4" : "#0066b1";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letra, pos.x, pos.y - 11.5);

    ctx.restore();
  }

  // Manejo de arrastre de ratón (Orbit y Pan)
  const manejarMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    estadoCamara.current.isDragging = true;
    estadoCamara.current.lastMouseX = e.clientX;
    estadoCamara.current.lastMouseY = e.clientY;
  };

  const manejarMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!estadoCamara.current.isDragging) return;
    const dx = e.clientX - estadoCamara.current.lastMouseX;
    const dy = e.clientY - estadoCamara.current.lastMouseY;
    estadoCamara.current.lastMouseX = e.clientX;
    estadoCamara.current.lastMouseY = e.clientY;

    if (modoRender === "isometric") {
      if (e.buttons === 1) {
        estadoCamara.current.azimuth += dx * 0.008;
        estadoCamara.current.pitch = Math.max(
          0.1,
          Math.min(Math.PI / 2 - 0.05, estadoCamara.current.pitch + dy * 0.008)
        );
      } else if (e.buttons === 2) {
        estadoCamara.current.panX += dx;
        estadoCamara.current.panY += dy;
      }
    } else {
      estadoCamara.current.panX += dx;
      estadoCamara.current.panY += dy;
    }
  };

  const manejarMouseUp = () => {
    estadoCamara.current.isDragging = false;
  };

  return (
    <div
      ref={contenedorRef}
      className="relative flex flex-col rounded-xl border border-[#262626] bg-[#0a0a0a] overflow-hidden shadow-2xl"
    >
      {/* 1. Barra de Acento Tricolor BMW M */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#0066b1]" />
        <div className="h-full w-1/3 bg-[#1c69d4]" />
        <div className="h-full w-1/3 bg-[#e22718]" />
      </div>

      {/* 2. Barra Superior de Control de Ingeniería */}
      <div className="p-3 sm:p-4 border-b border-[#262626] bg-[#0d0d0d]/90 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Identificación del Circuito (El circuito viene del módulo live pitwall) */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#0066b1]" />
          <span className="text-white font-bold uppercase tracking-wider text-xs">
            {nombreCircuito || circuitoActual.displayName}
          </span>
          <span className="text-[10px] text-[#7e7e7e]">
            ({circuitoActual.lengthMeters} m)
          </span>
        </div>

        {/* Pestañas de Comparativa Dual Vuelta A vs Vuelta B (Sin píldora) */}
        {tieneComparativa && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onCambiarRanura?.("A")}
              title="Activar telemetría y mapa de calor de Vuelta A"
              className={cn(
                "px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border",
                ranuraActiva === "A"
                  ? "bg-[#0066b1] border-[#0066b1] text-white"
                  : "bg-[#141414] border-[#262626] text-[#7e7e7e] hover:text-white"
              )}
            >
              <span className="w-3.5 h-3.5 rounded-xs bg-white text-black text-[9px] flex items-center justify-center font-black">
                A
              </span>
              <span>
                {vueltaAInfo
                  ? `V${String(vueltaAInfo.numeroVuelta).padStart(2, "0")} (${vueltaAInfo.tiempoVueltaStr})`
                  : "Vuelta A"}
              </span>
            </button>

            <button
              onClick={() => onCambiarRanura?.("B")}
              title="Activar telemetría y mapa de calor de Vuelta B"
              className={cn(
                "px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border",
                ranuraActiva === "B"
                  ? "bg-[#1c69d4] border-[#1c69d4] text-white"
                  : "bg-[#141414] border-[#262626] text-[#7e7e7e] hover:text-white"
              )}
            >
              <span className="w-3.5 h-3.5 rounded-xs bg-[#93c5fd] text-black text-[9px] flex items-center justify-center font-black">
                B
              </span>
              <span>
                {vueltaBInfo
                  ? `V${String(vueltaBInfo.numeroVuelta).padStart(2, "0")} (${vueltaBInfo.tiempoVueltaStr})`
                  : "Vuelta B"}
              </span>
            </button>
          </div>
        )}

        {/* Margen Derecho: Selector de Heatmap + Switch 2D/3D con botón cubo + Reset */}
        <div className="flex items-center gap-2">
          {/* Selector de Heatmap (Sin píldora) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setModoHeatmap("throttle_brake")}
              title="Colorear por Aceleración y Freno"
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer border ${
                modoHeatmap === "throttle_brake"
                  ? "bg-[#1c69d4] border-[#1c69d4] text-white"
                  : "bg-[#141414] border-[#262626] text-[#7e7e7e] hover:text-white"
              }`}
            >
              <Flame className="w-3 h-3 text-[#e22718]" />
              Freno/Gas
            </button>
            <button
              onClick={() => setModoHeatmap("speed")}
              title="Colorear por Gradiente de Velocidad"
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer border ${
                modoHeatmap === "speed"
                  ? "bg-[#1c69d4] border-[#1c69d4] text-white"
                  : "bg-[#141414] border-[#262626] text-[#7e7e7e] hover:text-white"
              }`}
            >
              <Activity className="w-3 h-3 text-[#0fa336]" />
              Velocidad
            </button>
          </div>

          {/* Switch 2D / 3D en el margen derecho (botón cubo, solo dice 2D y 3D) */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setModoRender("map_png")}
              title="Vista 2D Broadcast"
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                modoRender === "map_png"
                  ? "bg-[#0066b1] border-[#0066b1] text-white"
                  : "bg-[#141414] border-[#262626] text-[#8e8e93] hover:text-white"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>2D</span>
            </button>
            <button
              type="button"
              onClick={() => setModoRender("isometric")}
              title="Vista 3D Isométrica"
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                modoRender === "isometric"
                  ? "bg-[#0066b1] border-[#0066b1] text-white"
                  : "bg-[#141414] border-[#262626] text-[#8e8e93] hover:text-white"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D</span>
            </button>
          </div>

          {/* Botón Reset Cámara (Sin píldora) */}
          <button
            onClick={restablecerVista}
            title="Restablecer Cámara"
            className="p-1.5 bg-[#141414] border border-[#262626] hover:border-[#0066b1] text-[#bbbbbb] hover:text-white rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Área Principal del Canvas (Completamente Despejada y Limpia) */}
      <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] bg-black select-none">
        <canvas
          ref={canvasRef}
          onMouseDown={manejarMouseDown}
          onMouseMove={manejarMouseMove}
          onMouseUp={manejarMouseUp}
          onMouseLeave={manejarMouseUp}
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />

        {/* Badge Flotante Superior Derecho: Delta en tiempo real entre Vuelta A y B */}
        <div
          ref={deltaBadgeRef}
          style={{ display: "none" }}
          className="absolute top-4 right-4 z-20 pointer-events-none bg-[#0a0e14]/90 backdrop-blur-md border border-[#262626] rounded-lg px-3 py-2 text-white font-mono shadow-xl items-center gap-2"
        >
          <GitCompare className="w-4 h-4 text-[#0066b1]" />
          <div>
            <span className="text-[10px] text-[#7e7e7e] block uppercase leading-none">
              Brecha Temporal (A vs B)
            </span>
            <span
              ref={deltaTextRef}
              className="text-sm font-black text-[#0066b1] leading-tight block mt-0.5"
            >
              +0.000 s
            </span>
          </div>
        </div>

        {/* Guía de Controles Inferior Izquierda */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:block bg-black/75 backdrop-blur px-2.5 py-1.5 rounded border border-[#262626] text-[10px] font-mono text-[#7e7e7e]">
          {modoRender === "isometric"
            ? "Clic Izq: Orbitar 3D • Clic Der: Desplazar • Rueda: Zoom (sin scroll)"
            : "Clic Izq / Der: Desplazar • Rueda: Zoom (sin scroll)"}
        </div>
      </div>

      {/* 4. Barra de Monitoreo de Telemetría Dinámica (Ubicada fuera del lienzo para máxima visibilidad) */}
      <div className="border-t border-[#262626] bg-[#0f1217] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-white select-none">
        {/* Sección y DRS */}
        <div className="flex items-center gap-3">
          <span className="text-[#0066b1] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#0066b1]" />
            <span ref={hudSectionRef}>Rettifilo Partenza</span>
          </span>
          <span
            ref={hudDrsRef}
            style={{ display: "none" }}
            className="px-1.5 py-0.5 bg-[#0fa336]/20 border border-[#0fa336] text-[#0fa336] text-[9px] font-bold uppercase tracking-wider rounded"
          >
            DRS ACTIVO
          </span>
          {modoRender === "isometric" && (
            <span className="text-[#7e7e7e] text-[11px] hidden md:inline">
              Cota Y: <span ref={hudElevRef} className="text-white font-bold">-8.4 m</span>
            </span>
          )}
        </div>

        {/* Métricas: Velocidad, Marcha/RPM, Pedales */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] text-[#7e7e7e] uppercase">VEL:</span>
            <span ref={hudSpeedRef} className="text-sm font-black text-white">
              338
            </span>
            <span className="text-[10px] text-[#7e7e7e]">km/h</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] text-[#7e7e7e] uppercase">MARCHA:</span>
            <span ref={hudGearRef} className="text-sm font-black text-[#0066b1]">
              G8
            </span>
            <span className="text-[#3c3c3c]">/</span>
            <span ref={hudRpmRef} className="text-xs text-[#bbbbbb]">
              10816
            </span>
            <span className="text-[10px] text-[#7e7e7e]">RPM</span>
          </div>

          {/* Barra de Gas */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#0fa336]">GAS</span>
            <div className="w-14 sm:w-20 h-1.5 bg-[#1a1a1a] rounded overflow-hidden border border-[#262626]">
              <div ref={hudGasBarRef} className="h-full bg-[#0fa336] w-[30%]" />
            </div>
            <span ref={hudGasTextRef} className="text-[10px] tabular-nums text-[#0fa336] w-6 text-right font-bold">
              30%
            </span>
          </div>

          {/* Barra de Freno */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#e22718]">BRK</span>
            <div className="w-14 sm:w-20 h-1.5 bg-[#1a1a1a] rounded overflow-hidden border border-[#262626]">
              <div ref={hudBrakeBarRef} className="h-full bg-[#e22718] w-[0%]" />
            </div>
            <span ref={hudBrakeTextRef} className="text-[10px] tabular-nums text-[#e22718] w-6 text-right font-bold">
              0%
            </span>
          </div>
        </div>
      </div>

      {/* 5. Dock Flotante de Controles y Barra de Progreso */}
      <div className="border-t border-[#262626] bg-[#0c0c0e] px-4 py-3 select-none space-y-2.5">
        {/* Fila Superior: Scrubber / Barra de Progreso Interactiva */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 flex items-center group">
            <input
              type="range"
              min={0}
              max={longitudMetros ?? circuitoActual.lengthMeters ?? 5793}
              step={1}
              value={Math.max(0, Math.min(longitudMetros ?? circuitoActual.lengthMeters ?? 5793, distanciaSeleccionada ?? 0))}
              onChange={(e) => {
                const nuevaDist = Number(e.target.value);
                onSeleccionarDistancia?.(nuevaDist);
              }}
              className="w-full h-2 bg-[#222225] rounded-lg appearance-none cursor-pointer accent-[#0066b1] hover:accent-[#1c69d4] focus:outline-none transition-all"
            />
          </div>

          <span className="text-[11px] font-mono text-[#bbbbbb] tabular-nums shrink-0">
            {Math.round(distanciaSeleccionada ?? 0)} / {Math.round(longitudMetros ?? circuitoActual.lengthMeters ?? 5793)} m
          </span>
        </div>

        {/* Fila Inferior: Botonera de Control, Velocidades y Métricas */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            {/* Botón Play / Pause */}
            <button
              type="button"
              onClick={() => setEstaReproduciendo(!estaReproduciendo)}
              title={estaReproduciendo ? "Pausar reproducción" : "Reproducir trazada"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0066b1] hover:bg-[#1c69d4] text-white font-bold transition-all cursor-pointer shadow-md shadow-[#0066b1]/20"
            >
              {estaReproduciendo ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Reproducir</span>
                </>
              )}
            </button>

            {/* Botón Reiniciar a Meta */}
            <button
              type="button"
              onClick={() => {
                onSeleccionarDistancia?.(0);
              }}
              title="Volver a la línea de meta (0 m)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] hover:border-white/20 text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px]">Reiniciar</span>
            </button>

            {/* Selector de Velocidad Multiplicadora */}
            <div className="flex items-center rounded-lg border border-[#27272a] bg-[#141416] p-0.5 ml-1">
              {([0.5, 1, 2] as const).map((factor) => (
                <button
                  key={factor}
                  type="button"
                  onClick={() => setVelocidadMultiplicador(factor)}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer",
                    velocidadMultiplicador === factor
                      ? "bg-[#0066b1] text-white"
                      : "text-[#7e7e7e] hover:text-white"
                  )}
                >
                  {factor}x
                </button>
              ))}
            </div>
          </div>

          {/* Timestamp Sincronizado */}
          <div className="flex items-center gap-2">
            <span className="text-[#7e7e7e] text-[10px] uppercase">Tiempo:</span>
            <span
              ref={timestampRef}
              className="text-sm font-mono font-bold text-white tracking-wider tabular-nums select-none"
            >
              00:00:000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapaCircuitoCanvas;
