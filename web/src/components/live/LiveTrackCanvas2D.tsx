"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Eye, EyeOff, Navigation, Maximize2 } from "lucide-react";
import type { TelemetriaDinamicas, TelemetriaCronometraje, TelemetriaAuto } from "@/types/telemetria";

interface LiveTrackCanvas2DProps {
  timing: TelemetriaCronometraje;
  dynamics: TelemetriaDinamicas;
  auto: TelemetriaAuto;
  trackName?: string;
}

interface CurvaCircuito {
  nombre: string;
  posicion: [number, number];
  alineacion: "left" | "right" | "top" | "bottom";
}

// Puntos de referencia normalizados de Monza F1
const PUNTOS_MONZA: Array<[number, number]> = [
  [140, 260], // Meta / Línea de llegada
  [140, 160], // Recta principal
  [140, 60],  // Frenada Rettifilo
  [155, 45],  // Chicana Prima Variante (T1-T2)
  [175, 52],  // Salida chicana
  [195, 68],  // Curva Grande / Biassono (T3)
  [215, 92],  // Aceleración plena
  [228, 112], // Entrada Roggia
  [238, 122], // Variante della Roggia (T4-T5)
  [244, 138], // Enlace a Lesmo
  [252, 150], // Prima Curva di Lesmo (T6)
  [256, 172], // Seconda Curva di Lesmo (T7)
  [242, 195], // Bajada Curva del Serraglio (T8)
  [224, 218], // Recta DRS Serraglio
  [202, 238], // Variante Ascari entrada (T9)
  [186, 246], // Variante Ascari vértice (T10)
  [172, 256], // Variante Ascari salida (T11)
  [152, 272], // Rettifilo posteriore (Recta trasera DRS)
  [132, 290], // Entrada Curva Parabolica / Alboreto (T12)
  [124, 280], // Vértice Parabolica
  [130, 265], // Salida Parabolica a recta
  [140, 260], // Cierre de vuelta
];

const CURVAS_MONZA: CurvaCircuito[] = [
  { nombre: "Prima Variante", posicion: [155, 45], alineacion: "top" },
  { nombre: "Curva Biassono", posicion: [195, 68], alineacion: "right" },
  { nombre: "Variante Roggia", posicion: [238, 122], alineacion: "right" },
  { nombre: "Lesmo 1 & 2", posicion: [256, 162], alineacion: "right" },
  { nombre: "Serraglio", posicion: [242, 195], alineacion: "right" },
  { nombre: "Variante Ascari", posicion: [186, 246], alineacion: "bottom" },
  { nombre: "Parabolica Alboreto", posicion: [124, 285], alineacion: "left" },
];

export function LiveTrackCanvas2D({
  timing,
  dynamics,
  auto,
  trackName = "Autodromo Nazionale Monza",
}: LiveTrackCanvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mostrarCurvas, setMostrarCurvas] = useState(true);

  // Bounds para centrar y escalar perfectamente
  const bounds = useMemo(() => {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    for (const [x, y] of PUNTOS_MONZA) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    return { minX, maxX, minY, maxY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajuste de resolución Retina
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Fondo transparente ultra oscuro
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, width, height);

    // Grid técnico sutil de fondo
    ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Transformación de coordenadas normalizadas al viewport
    const padding = 45;
    const escalaX = (width - padding * 2) / (bounds.maxX - bounds.minX);
    const escalaY = (height - padding * 2) / (bounds.maxY - bounds.minY);
    const escala = Math.min(escalaX, escalaY);

    const centroX = (width - (bounds.maxX - bounds.minX) * escala) / 2;
    const centroY = (height - (bounds.maxY - bounds.minY) * escala) / 2;

    const puntoOrigen: [number, number] = [140, 260];
    const transformar = (pt?: [number, number]): [number, number] => {
      const p = pt ?? puntoOrigen;
      const x = centroX + (p[0] - bounds.minX) * escala;
      const y = centroY + (p[1] - bounds.minY) * escala;
      return [x, y];
    };

    // 1. Dibujar pista base (Asfalto ancho)
    const primerPunto = PUNTOS_MONZA[0] ?? puntoOrigen;
    ctx.beginPath();
    const [startPx, startPy] = transformar(primerPunto);
    ctx.moveTo(startPx, startPy);

    for (let i = 1; i < PUNTOS_MONZA.length; i++) {
      const pt = PUNTOS_MONZA[i];
      if (!pt) continue;
      const [px, py] = transformar(pt);
      ctx.lineTo(px, py);
    }
    ctx.closePath();

    ctx.strokeStyle = "#1f1f23";
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Bordes exteriores de la pista
    ctx.strokeStyle = "#2e2e34";
    ctx.lineWidth = 18;
    ctx.stroke();

    ctx.strokeStyle = "#141416";
    ctx.lineWidth = 14;
    ctx.stroke();

    // 2. Colorear Sectores sobre la trazada central
    // S1: 0% a 34% (Azul M #0066b1)
    // S2: 34% a 68% (Cyan #1c69d4)
    // S3: 68% a 100% (Rojo M #e22718)
    const totalPuntos = PUNTOS_MONZA.length - 1;
    for (let i = 0; i < totalPuntos; i++) {
      const pt1 = PUNTOS_MONZA[i];
      const pt2 = PUNTOS_MONZA[i + 1];
      if (!pt1 || !pt2) continue;

      const frac = i / totalPuntos;
      ctx.beginPath();
      const [p1x, p1y] = transformar(pt1);
      const [p2x, p2y] = transformar(pt2);
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);

      if (frac < 0.34) {
        ctx.strokeStyle = "#0066b1";
      } else if (frac < 0.68) {
        ctx.strokeStyle = "#1c69d4";
      } else {
        ctx.strokeStyle = "#e22718";
      }

      ctx.lineWidth = 3.5;
      ctx.stroke();
    }

    // 3. Línea de Meta / Salida
    const [metaX, metaY] = transformar(primerPunto);
    ctx.save();
    ctx.translate(metaX, metaY);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-3, -10, 6, 20);
    ctx.fillStyle = "#000000";
    ctx.fillRect(-3, -5, 3, 5);
    ctx.fillRect(0, 0, 3, 5);
    ctx.restore();

    // Texto de "FINISH / START"
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "bold 9px monospace";
    ctx.fillText("META", metaX + 10, metaY + 3);

    // 4. Nombres de curvas legendarias (anotaciones)
    if (mostrarCurvas) {
      ctx.fillStyle = "#71717a";
      ctx.font = "9px monospace";

      for (const curva of CURVAS_MONZA) {
        const [cx, cy] = transformar(curva.posicion);

        // Pequeño nodo circular
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#3f3f46";
        ctx.fill();

        ctx.fillStyle = "#a1a1aa";
        if (curva.alineacion === "top") {
          ctx.textAlign = "center";
          ctx.fillText(curva.nombre, cx, cy - 8);
        } else if (curva.alineacion === "bottom") {
          ctx.textAlign = "center";
          ctx.fillText(curva.nombre, cx, cy + 14);
        } else if (curva.alineacion === "left") {
          ctx.textAlign = "right";
          ctx.fillText(curva.nombre, cx - 8, cy + 3);
        } else {
          ctx.textAlign = "left";
          ctx.fillText(curva.nombre, cx + 8, cy + 3);
        }
      }
    }

    // 5. Monoplaza en tiempo real
    const progreso = Math.min(1, Math.max(0, timing.lapProgress || 0));
    const totalSegmentos = PUNTOS_MONZA.length - 1;
    const progresoSegmento = progreso * totalSegmentos;
    const indiceActual = Math.floor(progresoSegmento);
    const t = progresoSegmento - indiceActual;

    const p1 = PUNTOS_MONZA[Math.min(indiceActual, totalSegmentos - 1)] ?? puntoOrigen;
    const p2 = PUNTOS_MONZA[Math.min(indiceActual + 1, totalSegmentos)] ?? p1;

    const interX = p1[0] + (p2[0] - p1[0]) * t;
    const interY = p1[1] + (p2[1] - p1[1]) * t;
    const [autoX, autoY] = transformar([interX, interY]);

    // Resplandor de estela neón
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#00E676";

    // Pulso exterior
    ctx.beginPath();
    ctx.arc(autoX, autoY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 230, 118, 0.35)";
    ctx.fill();

    // Círculo central monoplaza
    ctx.beginPath();
    ctx.arc(autoX, autoY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#00E676";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Etiqueta flotante con velocidad y marcha del monoplaza
    const speedStr = `${auto.speedKmh.toFixed(0)} km/h`;
    const gearStr = auto.gear === -1 ? "R" : auto.gear === 0 ? "N" : `${auto.gear}ª`;
    const labelTexto = `${speedStr} • ${gearStr}`;

    ctx.font = "bold 10px monospace";
    const textWidth = ctx.measureText(labelTexto).width;
    const labelX = Math.min(width - textWidth - 14, Math.max(10, autoX + 12));
    const labelY = Math.min(height - 10, Math.max(20, autoY - 10));

    ctx.fillStyle = "rgba(10, 10, 12, 0.85)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(labelX - 4, labelY - 11, textWidth + 8, 16, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(labelTexto, labelX, labelY + 1);

    ctx.restore();
  }, [timing.lapProgress, auto.speedKmh, auto.gear, mostrarCurvas, bounds]);

  return (
    <div className="relative w-full border border-[#222225] rounded-xl overflow-hidden bg-[#09090b]">
      {/* Cabecera integrada en el Canvas */}
      <div className="absolute top-0 inset-x-0 z-10 px-4 py-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              {trackName}
            </span>
          </div>
          <span className="text-[10px] text-[#8e8e93] font-mono block mt-0.5">
            5.793 km • Trazado FIA 2025 • Trazada 2D Live
          </span>
        </div>

        {/* Acciones y Sector Activo */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-xs font-mono">
            <span className="text-[#8e8e93] mr-1">Sector:</span>
            <span
              className={`font-bold ${
                timing.sector === 1
                  ? "text-[#0066b1]"
                  : timing.sector === 2
                  ? "text-[#1c69d4]"
                  : "text-[#e22718]"
              }`}
            >
              S{timing.sector || 1}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMostrarCurvas((prev) => !prev)}
            title={mostrarCurvas ? "Ocultar nombres de curvas" : "Mostrar nombres de curvas"}
            className="p-1.5 rounded bg-black/60 hover:bg-white/10 text-[#8e8e93] hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            {mostrarCurvas ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Canvas 2D Principal */}
      <canvas
        ref={canvasRef}
        className="w-full h-[320px] sm:h-[380px] lg:h-[410px] block"
      />

      {/* Pie de Telemetría sobre el Canvas */}
      <div className="absolute bottom-0 inset-x-0 px-4 py-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-xs font-mono border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="text-[#7e7e7e]">Progreso:</span>
          <span className="text-white font-bold tabular-nums">
            {(timing.lapProgress * 100).toFixed(1)}%
          </span>
          {/* Barra de progreso sutil */}
          <div className="w-24 sm:w-36 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#00E676] transition-all duration-100"
              style={{ width: `${Math.min(100, Math.max(0, timing.lapProgress * 100))}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-0.5 bg-[#0066b1]" />
            <span className="text-[#8e8e93]">S1</span>
            <span className="w-2 h-0.5 bg-[#1c69d4]" />
            <span className="text-[#8e8e93]">S2</span>
            <span className="w-2 h-0.5 bg-[#e22718]" />
            <span className="text-[#8e8e93]">S3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
