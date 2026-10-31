"use client";

import { useState } from "react";
import { Wifi, Monitor, Check } from "lucide-react";

export default function PaginaAjustes() {
  const [servidorUrl, setServidorUrl] = useState("http://localhost:8080");
  const [wsUrl, setWsUrl] = useState("ws://localhost:8080/ws/telemetry");
  const [guardado, setGuardado] = useState(false);

  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-[#262626] pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#0066b1]" />
          <h1 className="text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
            Ajustes & Configuración de Boxes
          </h1>
        </div>
        <p className="mt-1 text-xs text-[#bbbbbb]">
          Configuración de red, puertos de telemetría y preferencias de visualización.
        </p>
      </div>

      <form onSubmit={manejarGuardar} className="space-y-6">
        <div className="border border-[#3c3c3c] bg-[#1a1a1a] rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#0066b1]" />
            Conexión con el Servidor Kestrel (Dev 1)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] mb-1.5">
                Endpoint REST API
              </label>
              <input
                type="text"
                value={servidorUrl}
                onChange={(e) => setServidorUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-black border border-[#3c3c3c] text-xs font-mono text-white focus:outline-none focus:border-[#0066b1]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] mb-1.5">
                WebSocket Stream (60 Hz)
              </label>
              <input
                type="text"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-black border border-[#3c3c3c] text-xs font-mono text-white focus:outline-none focus:border-[#0066b1]"
              />
            </div>
          </div>
        </div>

        <div className="border border-[#3c3c3c] bg-[#1a1a1a] rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Monitor className="w-4 h-4 text-[#0fa336]" />
            Preferencias de Rendimiento Visual
          </h2>

          <div className="space-y-3 pt-2 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-[#0066b1]" />
              <span className="text-[#bbbbbb]">
                Aceleración por GPU en Canvas 2D (Recomendado para 144 FPS estables)
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-[#0066b1]" />
              <span className="text-[#bbbbbb]">
                Números tabulares (`tnum`) activos en tacómetro y cronómetros
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-[#0066b1]" />
              <span className="text-[#bbbbbb]">
                Descarte optimista de paquetes desfasados (DropOldest)
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#7e7e7e]">
            Configuración persistida en navegador local
          </span>

          <button
            type="submit"
            className="px-6 py-2.5 rounded font-bold uppercase tracking-wider text-xs bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all flex items-center gap-2 shadow-lg shadow-[#0066b1]/20 cursor-pointer"
          >
            {guardado ? (
              <>
                <Check className="w-4 h-4 text-[#0fa336]" />
                Guardado
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
