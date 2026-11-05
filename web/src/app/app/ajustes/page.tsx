"use client";

import { useState, useEffect } from "react";
import { Wifi, Monitor, Check, Save } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { BotonColapsarSidebar } from "@/components/layout/BotonColapsarSidebar";

export default function PaginaAjustes() {
  const toast = useToast();
  const [servidorUrl, setServidorUrl] = useState("http://localhost:8080");
  const [wsUrl, setWsUrl] = useState("ws://localhost:8080/ws/telemetry");
  const [aceleracionGpu, setAceleracionGpu] = useState(true);
  const [numerosTabulares, setNumerosTabulares] = useState(true);
  const [descarteOptimista, setDescarteOptimista] = useState(true);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    try {
      const config = localStorage.getItem("apexlink_ajustes_boxes");
      if (config) {
        const parsed = JSON.parse(config);
        if (parsed.servidorUrl) setServidorUrl(parsed.servidorUrl);
        if (parsed.wsUrl) setWsUrl(parsed.wsUrl);
        if (typeof parsed.aceleracionGpu === "boolean") setAceleracionGpu(parsed.aceleracionGpu);
        if (typeof parsed.numerosTabulares === "boolean") setNumerosTabulares(parsed.numerosTabulares);
        if (typeof parsed.descarteOptimista === "boolean") setDescarteOptimista(parsed.descarteOptimista);
      }
    } catch {
      // Ignorar fallback
    }
  }, []);

  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        "apexlink_ajustes_boxes",
        JSON.stringify({
          servidorUrl,
          wsUrl,
          aceleracionGpu,
          numerosTabulares,
          descarteOptimista,
        })
      );
    } catch {
      // Ignorar
    }
    setGuardado(true);
    toast.success("Ajustes de Boxes guardados", "Los parámetros de conexión REST y WebSocket se actualizaron.");
    setTimeout(() => setGuardado(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262626] pb-4">
        <div className="flex items-start gap-3.5">
          <BotonColapsarSidebar />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
              Ajustes de Boxes
            </h1>
            <p className="mt-1 text-xs text-[#bbbbbb]">
              Configuración de red, puertos de telemetría y preferencias de visualización.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={manejarGuardar} className="space-y-6">
        <div className="py-6 border-b border-[#222225] space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#0066b1]" />
            Conexión con el Servidor Kestrel (Core Relay)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] mb-1.5 font-mono">
                Endpoint REST API
              </label>
              <input
                type="text"
                value={servidorUrl}
                onChange={(e) => setServidorUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-transparent border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#0066b1] focus:bg-white/[0.02] transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] mb-1.5 font-mono">
                WebSocket Stream (60 Hz)
              </label>
              <input
                type="text"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-transparent border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#0066b1] focus:bg-white/[0.02] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="py-6 border-b border-[#222225] space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Monitor className="w-4 h-4 text-[#0fa336]" />
            Preferencias de Rendimiento Visual
          </h2>

          <div className="space-y-3 pt-2 text-xs font-mono">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={aceleracionGpu}
                onChange={(e) => setAceleracionGpu(e.target.checked)}
                className="rounded accent-[#0066b1] w-4 h-4"
              />
              <span className="text-[#bbbbbb] group-hover:text-white transition-colors">
                Aceleración por GPU en Canvas 2D (Recomendado para 144 FPS estables)
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={numerosTabulares}
                onChange={(e) => setNumerosTabulares(e.target.checked)}
                className="rounded accent-[#0066b1] w-4 h-4"
              />
              <span className="text-[#bbbbbb] group-hover:text-white transition-colors">
                Números tabulares (`tnum`) activos en tacómetro y cronómetros anti-jitter
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={descarteOptimista}
                onChange={(e) => setDescarteOptimista(e.target.checked)}
                className="rounded accent-[#0066b1] w-4 h-4"
              />
              <span className="text-[#bbbbbb] group-hover:text-white transition-colors">
                Descarte optimista de paquetes desfasados (DropOldest @ 60 Hz)
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#7e7e7e] font-mono">
            Configuración persistida en navegador local
          </span>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider text-xs bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all flex items-center gap-2 shadow-lg shadow-[#0066b1]/20 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1c69d4]"
          >
            {guardado ? (
              <>
                <Check className="w-4 h-4 text-[#0fa336]" />
                Guardado
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
