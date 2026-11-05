"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  RotateCcw,
  Flame,
  Activity,
  MapPin,
  Radio,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CIRCUITS_DATA } from "@/lib/circuitsData";
import type { MuestraTelemetria } from "@/types/telemetria";

export interface LiveTelemetriaAutoRef {
  speedKmh: number;
  gear: number;
  rpms: number;
  throttle: number;
  brake: number;
  drsEnabled?: boolean;
}

export interface LiveMapaCircuitoCanvasProps {
  muestras?: MuestraTelemetria[];
  distanciaSeleccionada?: number | null;
  nombreCircuito?: string;
  longitudMetros?: number;
  circuitoInicial?: "monza" | "imola" | "rbr";
  telemetriaAuto?: LiveTelemetriaAutoRef;
}

type ModoRender = "map_png" | "isometric";
type ModoHeatmap = "throttle_brake" | "speed";
type CircuitoId = "monza" | "imola" | "rbr";

export function LiveMapaCircuitoCanvas({
  distanciaSeleccionada = null,
  nombreCircuito,
  circuitoInicial = "monza",
  telemetriaAuto,
}: LiveMapaCircuitoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Estados React
  const [circuitoActivoId, setCircuitoActivoId] = useState<CircuitoId>(circuitoInicial);
  const [modoRender, setModoRender] = useState<ModoRender>("map_png");
  const [modoHeatmap, setModoHeatmap] = useState<ModoHeatmap>("throttle_brake");

  // Sincronizar si cambia el circuito provisto externamente desde el backend live
  useEffect(() => {
    if (circuitoInicial && (circuitoInicial === "monza" || circuitoInicial === "imola" || circuitoInicial === "rbr")) {
      setCircuitoActivoId(circuitoInicial);
    }
  }, [circuitoInicial]);

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

  // Datos del circuito seleccionado
  const circuitoActual = useMemo(() => {
    return CIRCUITS_DATA[circuitoActivoId] || CIRCUITS_DATA.monza;
  }, [circuitoActivoId]);

  // Variables de cámara y posición (persisten sin re-renderizar)
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
    carProgressA: 0, // Avance del monoplaza en tiempo real
  });

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

  // Restablecer posición y cámara SOLO al cambiar de circuito
  const prevCircuitoIdRef = useRef<CircuitoId>(circuitoActivoId);
  useEffect(() => {
    if (prevCircuitoIdRef.current !== circuitoActivoId) {
      prevCircuitoIdRef.current = circuitoActivoId;
      estadoCamara.current.azimuth = Math.PI / 4;
      estadoCamara.current.pitch = Math.atan(1 / Math.sqrt(2));
      estadoCamara.current.panX = 0;
      estadoCamara.current.panY = 0;
      estadoCamara.current.carProgressA = 0;
    }
  }, [circuitoActivoId]);

  // Al conmutar modo de render (broadcast vs 3d), ajustar zoom/pan de cámara
  useEffect(() => {
    estadoCamara.current.panX = 0;
    estadoCamara.current.panY = 0;
    estadoCamara.current.zoom = modoRender === "map_png" ? 0.85 : 0.65;
  }, [modoRender]);

  // Sincronizar posición del monoplaza en tiempo real desde los datos del backend (a 60 Hz)
  useEffect(() => {
    if (
      typeof distanciaSeleccionada === "number" &&
      Number.isFinite(distanciaSeleccionada) &&
      circuitoActual.track.length > 0
    ) {
      const totalMetros = circuitoActual.lengthMeters || 1;
      const ratio = Math.max(0, Math.min(1, distanciaSeleccionada / totalMetros));
      const targetPoint = ratio * (circuitoActual.track.length - 1);
      estadoCamara.current.carProgressA = targetPoint;
    }
  }, [distanciaSeleccionada, circuitoActual]);

  // Manejo nativo de rueda de ratón con { passive: false } para EVITAR scroll de página
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

  // Mantener actualizado el ref de telemetría en vivo del auto
  const telemetriaAutoRef = useRef(telemetriaAuto);
  useEffect(() => {
    telemetriaAutoRef.current = telemetriaAuto;
  }, [telemetriaAuto]);

  // Loop de renderizado del Canvas a 60-144 FPS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const track = circuitoActual?.track ?? [];
      const bounds = circuitoActual.bounds;
      const center = circuitoActual.center;
      const mapConfig = circuitoActual.mapConfig;
      const cam = estadoCamara.current;
      const totalPoints = track.length;

      if (totalPoints === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Normalización matemática euclidiana segura de avance del monoplaza
      const safeProgressA = Number.isFinite(cam.carProgressA)
        ? ((cam.carProgressA % totalPoints) + totalPoints) % totalPoints
        : 0;

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

      // Valores finales para el HUD: Si hay telemetría del auto en vivo, usarla directamente
      const autoLive = telemetriaAutoRef.current;
      const focoSpeed = autoLive ? Math.round(autoLive.speedKmh) : carASpeed;
      const focoGear = autoLive
        ? autoLive.gear === -1
          ? "R"
          : autoLive.gear === 0
          ? "N"
          : `G${autoLive.gear}`
        : `G${carAGear}`;
      const focoRpm = autoLive ? Math.round(autoLive.rpms) : carARpm;
      const focoThrottle = autoLive ? Math.max(0, Math.min(1, autoLive.throttle)) : carAThrottle;
      const focoBrake = autoLive ? Math.max(0, Math.min(1, autoLive.brake)) : carABrake;
      const focoDrs = autoLive ? Boolean(autoLive.drsEnabled) : carADrs;

      // Actualizar el HUD directamente en el DOM a 60/144 FPS
      if (hudSpeedRef.current) hudSpeedRef.current.textContent = String(focoSpeed);
      if (hudGearRef.current) hudGearRef.current.textContent = String(focoGear);
      if (hudRpmRef.current) hudRpmRef.current.textContent = String(focoRpm);
      if (hudGasBarRef.current) hudGasBarRef.current.style.width = `${Math.round(focoThrottle * 100)}%`;
      if (hudGasTextRef.current) hudGasTextRef.current.textContent = `${Math.round(focoThrottle * 100)}%`;
      if (hudBrakeBarRef.current) hudBrakeBarRef.current.style.width = `${Math.round(focoBrake * 100)}%`;
      if (hudBrakeTextRef.current) hudBrakeTextRef.current.textContent = `${Math.round(focoBrake * 100)}%`;
      if (hudSectionRef.current) hudSectionRef.current.textContent = carASection || "Pista Activa";
      if (hudElevRef.current) hudElevRef.current.textContent = `${carAY.toFixed(1)} m`;
      if (hudDrsRef.current) {
        hudDrsRef.current.style.display = focoDrs ? "inline-block" : "none";
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

        // 2. Trazada de Telemetría con Heatmap
        ctx.lineWidth = 3.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 0; i < totalPoints; i++) {
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

        // 3. Monoplaza Live en Pista
        const carScreenA = projectMap(carAX, carAZ);

        // Halo de brillo
        const glowGrad = ctx.createRadialGradient(
          carScreenA.x,
          carScreenA.y,
          2,
          carScreenA.x,
          carScreenA.y,
          22
        );
        glowGrad.addColorStop(0, "rgba(0, 102, 177, 0.95)");
        glowGrad.addColorStop(0.5, "rgba(0, 102, 177, 0.35)");
        glowGrad.addColorStop(1, "rgba(0, 102, 177, 0)");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(carScreenA.x, carScreenA.y, 22, 0, Math.PI * 2);
        ctx.fill();

        // Punto central con reborde blanco brillante
        ctx.beginPath();
        ctx.arc(carScreenA.x, carScreenA.y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#0066b1";
        ctx.stroke();

        // Etiqueta distintiva del monoplaza en tiempo real
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.shadowColor = "rgba(0,0,0,0.95)";
        ctx.shadowBlur = 4;
        ctx.fillText("LIVE", carScreenA.x, carScreenA.y - 10);
        ctx.shadowBlur = 0;
      } else {
        // =============================================================
        // MODO 2: ORBITAL ISOMÉTRICO 3D (Cálculo Vectorial Auténtico)
        // =============================================================
        const maxExtent = Math.max(bounds.width, bounds.depth);
        const baseScale = (Math.min(width, height) / maxExtent) * 0.95;
        const effectiveScale = baseScale * cam.zoom;

        const sinAz = Math.sin(cam.azimuth);
        const cosAz = Math.cos(cam.azimuth);
        const sinPt = Math.sin(cam.pitch);
        const cosPt = Math.cos(cam.pitch);

        const project3D = (x: number, y: number, z: number) => {
          const dx = x - center.x;
          const dy = (y - center.y) * verticalExaggeration;
          const dz = z - center.z;

          const rx = dx * cosAz - dz * sinAz;
          const rz = dx * sinAz + dz * cosAz;
          const ry = dy * cosPt - rz * sinPt;
          const depth = dy * sinPt + rz * cosPt;

          return {
            x: width / 2 + rx * effectiveScale + cam.panX,
            y: height / 2 - ry * effectiveScale + cam.panY,
            depth,
          };
        };

        // 1. Rejilla isométrica de referencia
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
        ctx.lineWidth = 1;
        const gridStep = 400;
        const gridMinX = Math.floor(bounds.minX / gridStep) * gridStep - gridStep;
        const gridMaxX = Math.ceil(bounds.maxX / gridStep) * gridStep + gridStep;
        const gridMinZ = Math.floor(bounds.minZ / gridStep) * gridStep - gridStep;
        const gridMaxZ = Math.ceil(bounds.maxZ / gridStep) * gridStep + gridStep;
        const gridY = bounds.minY - 5;

        for (let gx = gridMinX; gx <= gridMaxX; gx += gridStep) {
          const p1 = project3D(gx, gridY, gridMinZ);
          const p2 = project3D(gx, gridY, gridMaxZ);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
        for (let gz = gridMinZ; gz <= gridMaxZ; gz += gridStep) {
          const p1 = project3D(gridMinX, gridY, gz);
          const p2 = project3D(gridMaxX, gridY, gz);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
        ctx.restore();

        // 2. Sombra proyectada del asfalto en el suelo
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < totalPoints; i++) {
          const pt = track[i];
          if (!pt) continue;
          const sp = project3D(pt.x, gridY, pt.z);
          if (i === 0) ctx.moveTo(sp.x, sp.y);
          else ctx.lineTo(sp.x, sp.y);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(0, 102, 177, 0.12)";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();

        // 3. Trazado 3D de la pista con Heatmap
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 0; i < totalPoints; i++) {
          const ptA = track[i];
          const ptB = track[(i + 1) % totalPoints] ?? ptA;
          if (!ptA || !ptB) continue;
          const pScreenA = project3D(ptA.x, ptA.y, ptA.z);
          const pScreenB = project3D(ptB.x, ptB.y, ptB.z);

          ctx.beginPath();
          ctx.moveTo(pScreenA.x, pScreenA.y);
          ctx.lineTo(pScreenB.x, pScreenB.y);
          ctx.strokeStyle = getColorCalor(ptA);
          ctx.lineWidth = 3.5;
          ctx.stroke();
        }

        // 4. Monoplaza Live en el espacio 3D
        const carScreenA = project3D(carAX, carAY, carAZ);

        // Halo de brillo
        const glowGrad = ctx.createRadialGradient(
          carScreenA.x,
          carScreenA.y,
          2,
          carScreenA.x,
          carScreenA.y,
          22
        );
        glowGrad.addColorStop(0, "rgba(0, 102, 177, 0.95)");
        glowGrad.addColorStop(0.5, "rgba(0, 102, 177, 0.35)");
        glowGrad.addColorStop(1, "rgba(0, 102, 177, 0)");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(carScreenA.x, carScreenA.y, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(carScreenA.x, carScreenA.y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#0066b1";
        ctx.stroke();

        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.shadowColor = "rgba(0,0,0,0.95)";
        ctx.shadowBlur = 4;
        ctx.fillText("LIVE", carScreenA.x, carScreenA.y - 10);
        ctx.shadowBlur = 0;
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [circuitoActual, modoRender, modoHeatmap]);

  // Manejadores de interacción de ratón (Orbitar / Desplazar / Pan)
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
        // Clic Izquierdo: Rotación Orbital 3D
        estadoCamara.current.azimuth += dx * 0.008;
        const nuevoPitch = estadoCamara.current.pitch + dy * 0.008;
        estadoCamara.current.pitch = Math.max(0.05, Math.min(Math.PI / 2 - 0.05, nuevoPitch));
      } else if (e.buttons === 2 || e.buttons === 4) {
        // Clic Derecho o Central: Pan / Desplazamiento 3D
        estadoCamara.current.panX += dx;
        estadoCamara.current.panY += dy;
      }
    } else {
      // Modo 2D: Pan con cualquier botón de ratón
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
      className="flex flex-col w-full bg-[#0a0a0c] border border-[#262626] rounded-xl overflow-hidden shadow-2xl relative"
    >
      {/* 1. Barra de Controles Superiores de Ingeniería */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0d0d0f] border-b border-[#262626] text-xs font-mono select-none">
        {/* Información del circuito */}
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#0066b1]" />
          <span className="font-bold text-white text-xs tracking-tight">
            {nombreCircuito || circuitoActual.displayName}
          </span>
          <span className="text-[#7e7e7e] text-[11px] hidden sm:inline">
            ({circuitoActual.lengthMeters} m)
          </span>
        </div>

        {/* Controles de Vista: Heatmap, Reset Cámara y Switch 2D / 3D */}
        <div className="flex items-center gap-2">
          {/* Heatmap Freno/Gas vs Velocidad (Sin píldora) */}
          <div className="flex items-center bg-[#141416] p-0.5 rounded border border-[#262626]">
            <button
              onClick={() => setModoHeatmap("throttle_brake")}
              className={cn(
                "px-2 py-1 text-[11px] font-bold rounded transition-all cursor-pointer flex items-center gap-1",
                modoHeatmap === "throttle_brake"
                  ? "bg-[#0066b1] text-white shadow"
                  : "text-[#7e7e7e] hover:text-white"
              )}
            >
              <Flame className="w-3 h-3 text-[#e22718]" />
              Freno / Gas
            </button>
            <button
              onClick={() => setModoHeatmap("speed")}
              className={cn(
                "px-2 py-1 text-[11px] font-bold rounded transition-all cursor-pointer flex items-center gap-1",
                modoHeatmap === "speed"
                  ? "bg-[#0066b1] text-white shadow"
                  : "text-[#7e7e7e] hover:text-white"
              )}
            >
              <Activity className="w-3 h-3 text-[#0fa336]" />
              Velocidad
            </button>
          </div>

          {/* Switch 2D / 3D en el Margen Derecho (Sin píldora, Botón Cubo) */}
          <button
            onClick={() => setModoRender(modoRender === "map_png" ? "isometric" : "map_png")}
            title="Alternar vista 2D Oficial Broadcast / 3D Isométrica"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141416] hover:bg-[#1f1f23] text-white border border-[#262626] text-xs font-bold font-mono transition-colors cursor-pointer"
          >
            <Box className="w-3.5 h-3.5 text-[#0066b1]" />
            <span>{modoRender === "map_png" ? "3D" : "2D"}</span>
          </button>

          {/* Restablecer Cámara */}
          <button
            onClick={restablecerVista}
            title="Restablecer cámara y zoom"
            className="p-1.5 rounded bg-[#141416] hover:bg-[#1f1f23] text-[#7e7e7e] hover:text-white border border-[#262626] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Área Principal del Canvas (Completamente Despejada y Limpia) */}
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

        {/* Guía de Controles Inferior Izquierda */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:block bg-black/75 backdrop-blur px-2.5 py-1.5 rounded border border-[#262626] text-[10px] font-mono text-[#7e7e7e]">
          {modoRender === "isometric"
            ? "Clic Izq: Orbitar 3D • Clic Der: Desplazar • Rueda: Zoom (sin scroll)"
            : "Clic Izq / Der: Desplazar • Rueda: Zoom (sin scroll)"}
        </div>
      </div>

      {/* 3. Barra de Monitoreo de Telemetría Dinámica en Vivo */}
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
    </div>
  );
}

export default LiveMapaCircuitoCanvas;
