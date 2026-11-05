"use client";

import { useEffect, useRef } from "react";
import type { TelemetriaDinamicas, TelemetriaCronometraje } from "@/types/telemetria";

interface LiveTrackMinimapProps {
  timing: TelemetriaCronometraje;
  dynamics: TelemetriaDinamicas;
  trackName: string;
}

export function LiveTrackMinimap({ timing, dynamics, trackName }: LiveTrackMinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Fondo
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, w, h);

    // Trazado base aproximado de Monza normalizado
    // Puntos clave de Monza (Recta, Rettifilo, Curva Grande, Roggia, Lesmo 1, Lesmo 2, Serraglio, Ascari, Rettifilo posteriore, Parabolica/Alboreto)
    const puntosMonza: Array<[number, number]> = [
      [140, 260], // Meta / Rettifilo
      [140, 60],  // Frenada Rettifilo
      [155, 50],  // Chicana Rettifilo
      [190, 70],  // Curva Grande / Biassono
      [220, 110], // Entrada Roggia
      [230, 120], // Chicana Roggia
      [240, 140], // Curva di Lesmo 1
      [250, 170], // Curva di Lesmo 2
      [230, 200], // Curva del Serraglio
      [190, 240], // Variante Ascari
      [160, 270], // Recta trasera
      [130, 290], // Curva Parabolica (Alboreto)
      [130, 270], // Salida a recta principal
      [140, 260], // Cierre
    ];

    // Escalar al canvas
    const minX = 100, maxX = 270;
    const minY = 30, maxY = 310;
    const scaleX = (w - 40) / (maxX - minX);
    const scaleY = (h - 40) / (maxY - minY);

    const transformar = (pt?: [number, number]): [number, number] => {
      const p = pt ?? [140, 260];
      const x = 20 + (p[0] - minX) * scaleX;
      const y = 20 + (p[1] - minY) * scaleY;
      return [x, y];
    };

    // Dibujar pista
    ctx.beginPath();
    const [startX, startY] = transformar(puntosMonza[0]);
    ctx.moveTo(startX, startY);

    for (let i = 1; i < puntosMonza.length; i++) {
      const pt = puntosMonza[i];
      if (!pt) continue;
      const [px, py] = transformar(pt);
      ctx.lineTo(px, py);
    }
    ctx.closePath();

    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    ctx.strokeStyle = "#0066b1";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Línea de meta
    const [metaX, metaY] = transformar(puntosMonza[0]);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(metaX - 2, metaY - 7, 4, 14);

    // Calcular posición del auto sobre el trazado según timing.lapProgress (0.0 a 1.0)
    const progreso = Math.min(1, Math.max(0, timing.lapProgress));
    const totalSegmentos = puntosMonza.length - 1;
    const progresoSegmento = progreso * totalSegmentos;
    const indiceActual = Math.floor(progresoSegmento);
    const t = progresoSegmento - indiceActual;

    const fallbackPunto: [number, number] = [140, 260];
    const p1 = puntosMonza[Math.min(indiceActual, totalSegmentos - 1)] ?? puntosMonza[0] ?? fallbackPunto;
    const p2 = puntosMonza[Math.min(indiceActual + 1, totalSegmentos)] ?? p1;

    const interX = p1[0] + (p2[0] - p1[0]) * t;
    const interY = p1[1] + (p2[1] - p1[1]) * t;
    const [autoX, autoY] = transformar([interX, interY]);

    // Resplandor neón del monoplaza
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00E676";

    ctx.beginPath();
    ctx.arc(autoX, autoY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#00E676";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowBlur = 0;
  }, [timing.lapProgress]);

  return (
    <div className="surface-specular p-5 flex flex-col justify-between shadow-md">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-2">
        <h3 className="text-sm font-bold uppercase text-white tracking-tight">{trackName}</h3>
        <div className="text-right font-mono">
          <span className="text-xs font-bold text-[#0066b1] tabular-nums">
            {(timing.lapProgress * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] text-[#7e7e7e] block">Progreso</span>
        </div>
      </div>

      <div className="flex items-center justify-center py-1">
        <canvas
          ref={canvasRef}
          width={240}
          height={210}
          className="rounded border border-[#262626]"
        />
      </div>

      <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-xs font-mono">
        <span className="text-[#7e7e7e]">Sector Activo:</span>
        <span className="px-2 py-0.5 rounded bg-[#0066b1]/20 text-[#0066b1] font-bold border border-[#0066b1]/40">
          SECTOR {timing.sector}
        </span>
      </div>
    </div>
  );
}
