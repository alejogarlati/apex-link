"use client";

import { useEffect, useRef } from "react";
import type { TelemetriaDinamicas } from "@/types/telemetria";

interface KammFrictionCircleProps {
  dynamics: TelemetriaDinamicas;
}

export function KammFrictionCircle({ dynamics }: KammFrictionCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const historialPuntosRef = useRef<Array<{ x: number; y: number }>>([]);

  const gLat = dynamics.gForce.lat;
  const gLon = dynamics.gForce.lon;
  const gTotal = Math.sqrt(gLat * gLat + gLon * gLon);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Agregar punto actual al historial de rastro (ghost trail)
    historialPuntosRef.current.push({ x: gLat, y: gLon });
    if (historialPuntosRef.current.length > 20) {
      historialPuntosRef.current.shift();
    }

    const w = canvas.width;
    const h = canvas.height;
    const centroX = w / 2;
    const centroY = h / 2;
    const maxG = 2.0; // Radio exterior = 2.0G
    const radioPixel = (w / 2) - 15;

    ctx.clearRect(0, 0, w, h);

    // Fondo
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);

    // Círculos concéntricos de referencia (0.5G, 1.0G, 1.5G, 2.0G)
    const radiosG = [0.5, 1.0, 1.5, 2.0];
    radiosG.forEach((g) => {
      const r = (g / maxG) * radioPixel;
      ctx.beginPath();
      ctx.arc(centroX, centroY, r, 0, Math.PI * 2);
      ctx.strokeStyle = g === 1.0 ? "#3c3c3c" : "#1f1f1f";
      ctx.lineWidth = g === 1.0 ? 1.5 : 1;
      ctx.stroke();

      // Etiqueta de G
      ctx.fillStyle = "#666666";
      ctx.font = "9px monospace";
      ctx.fillText(`${g.toFixed(1)}G`, centroX + 4, centroY - r + 10);
    });

    // Ejes cartesianos cruzados
    ctx.beginPath();
    ctx.moveTo(centroX, 10);
    ctx.lineTo(centroX, h - 10);
    ctx.moveTo(10, centroY);
    ctx.lineTo(w - 10, centroY);
    ctx.strokeStyle = "#262626";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Rastro de puntos anteriores (Ghost trail con desvanecimiento alfa)
    historialPuntosRef.current.forEach((pt, index) => {
      const alpha = (index + 1) / historialPuntosRef.current.length;
      const px = centroX + (pt.x / maxG) * radioPixel;
      const py = centroY - (pt.y / maxG) * radioPixel;

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 102, 177, ${alpha * 0.4})`;
      ctx.fill();
    });

    // Punto dinámico activo
    const actualX = centroX + (gLat / maxG) * radioPixel;
    const actualY = centroY - (gLon / maxG) * radioPixel;

    // Resplandor neón
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#0066b1";

    ctx.beginPath();
    ctx.arc(actualX, actualY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#0066b1";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowBlur = 0;
  }, [gLat, gLon]);

  return (
    <div className="surface-specular p-5 flex flex-col justify-between shadow-md">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-2">
        <h3 className="text-sm font-bold uppercase text-white tracking-tight">Círculo de Kamm (G-G)</h3>
        <div className="text-right font-mono">
          <span className="text-xs font-bold text-[#0fa336] tabular-nums">{gTotal.toFixed(2)} G</span>
          <span className="text-[10px] text-[#7e7e7e] block">Total</span>
        </div>
      </div>

      <div className="flex items-center justify-center py-2">
        <canvas
          ref={canvasRef}
          width={210}
          height={210}
          className="rounded-full border border-[#262626] shadow-inner"
        />
      </div>

      <div className="pt-2 border-t border-[#262626] grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="text-center bg-black/40 p-1.5 rounded border border-[#262626]">
          <span className="text-[10px] text-[#7e7e7e] uppercase block">Lateral</span>
          <span className="text-white font-bold">{gLat.toFixed(2)} G</span>
        </div>
        <div className="text-center bg-black/40 p-1.5 rounded border border-[#262626]">
          <span className="text-[10px] text-[#7e7e7e] uppercase block">Longitudinal</span>
          <span className="text-white font-bold">{gLon.toFixed(2)} G</span>
        </div>
      </div>
    </div>
  );
}
