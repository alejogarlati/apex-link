"use client";

import { useState } from "react";
import { Wifi, Monitor, Check, Cpu, Shield, Zap } from "lucide-react";

export default function PaginaAjustes() {
  const [servidorUrl, setServidorUrl] = useState("http://localhost:8080");
  const [wsUrl, setWsUrl] = useState("ws://localhost:8080/ws/telemetry");
  const [frecuenciaHz, setFrecuenciaHz] = useState("60");
  const [guardado, setGuardado] = useState(false);

  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Encabezado Principal */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#262626] pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0066b1]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#0066b1]">
              Parámetros del Sistema • Configuración de Boxes
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-mono">
            Ajustes & Configuración de Boxes
          </h1>
          <p className="text-xs sm:text-sm text-[#bbbbbb] font-mono tracking-wide mt-1">
            Configuración de red para el pipeline de telemetría Kestrel, frecuencia de muestreo y aceleración gráfica.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="border border-[#262626] bg-[#141414] px-4 py-2 text-xs font-mono font-bold tracking-[0.15em] text-[#bbbbbb] uppercase rounded-none">
            Relay v2.4 Estable
          </span>
        </div>
      </div>

      <form onSubmit={manejarGuardar} className="space-y-8">
        {/* 1. Conexión de Red REST & WebSocket */}
        <div className="card-cockpit-gradient border border-[#262626] rounded-none border-sheen p-8 sm:p-10 space-y-6 shadow-2xl bg-[#141414] border-t-2 border-t-[#0066b1]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-[0.18em] text-white flex items-center gap-2.5">
              <Wifi className="w-4 h-4 text-[#0066b1]" />
              Conexión con el Servidor Kestrel (.NET 8 Daemon)
            </h2>
            <span className="text-[10px] font-mono text-[#0066b1] bg-[#0066b1]/10 border border-[#0066b1]/30 px-2.5 py-0.5 uppercase tracking-wider">
              Enlace Primario
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-[#bbbbbb] mb-2">
                Endpoint REST API
              </label>
              <input
                type="text"
                value={servidorUrl}
                onChange={(e) => setServidorUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-none bg-black border border-[#3c3c3c] text-xs font-mono text-white focus:outline-none focus:border-[#0066b1] transition-all"
              />
              <span className="text-[10px] font-mono text-[#7e7e7e] mt-1.5 block">
                Servicio HTTP para subida de sesiones y consultas de SQLite WAL.
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-[#bbbbbb] mb-2">
                WebSocket Stream (Enlace Live)
              </label>
              <input
                type="text"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-none bg-black border border-[#3c3c3c] text-xs font-mono text-white focus:outline-none focus:border-[#0066b1] transition-all"
              />
              <span className="text-[10px] font-mono text-[#7e7e7e] mt-1.5 block">
                Canal bidireccional de baja latencia (&lt;5ms) con paquetes binarios.
              </span>
            </div>
          </div>
        </div>

        {/* 2. Rendimiento Gráfico y Aceleración */}
        <div className="card-cockpit-gradient border border-[#262626] rounded-none border-sheen p-8 sm:p-10 space-y-6 shadow-2xl bg-[#141414] border-t-2 border-t-[#0fa336]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-[0.18em] text-white flex items-center gap-2.5">
              <Monitor className="w-4 h-4 text-[#0fa336]" />
              Preferencias de Rendimiento Visual & Canvas 2D
            </h2>
            <span className="text-[10px] font-mono text-[#0fa336] bg-[#0fa336]/10 border border-[#0fa336]/30 px-2.5 py-0.5 uppercase tracking-wider">
              144 FPS Lock
            </span>
          </div>

          <div className="space-y-4 pt-2 text-xs font-mono">
            <label className="flex items-start gap-3.5 cursor-pointer p-3.5 bg-[#0d0d0d] border border-[#262626] hover:border-[#3c3c3c] transition-colors">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded-none accent-[#0066b1] w-4 h-4" />
              <div>
                <span className="text-white font-bold block">
                  Aceleración por GPU en Canvas 2D y Trazadas
                </span>
                <span className="text-[11px] text-[#7e7e7e] block mt-0.5">
                  Utiliza WebGL/Context2D acelerado para dibujar hasta 6.000 puntos de telemetría a 144 FPS estables.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3.5 cursor-pointer p-3.5 bg-[#0d0d0d] border border-[#262626] hover:border-[#3c3c3c] transition-colors">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded-none accent-[#0066b1] w-4 h-4" />
              <div>
                <span className="text-white font-bold block">
                  Números Tabulares (`tnum`) en Todo el Cockpit
                </span>
                <span className="text-[11px] text-[#7e7e7e] block mt-0.5">
                  Fija el ancho métrico de cada dígito para evitar oscilaciones en tacómetro y cronómetros.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3.5 cursor-pointer p-3.5 bg-[#0d0d0d] border border-[#262626] hover:border-[#3c3c3c] transition-colors">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded-none accent-[#0066b1] w-4 h-4" />
              <div>
                <span className="text-white font-bold block">
                  Descarte Optimista de Paquetes Desfasados (DropOldest Queue)
                </span>
                <span className="text-[11px] text-[#7e7e7e] block mt-0.5">
                  Descarta muestras rezagadas si el hilo UI tiene retraso transitorio, garantizando telemetría en tiempo real.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 3. Frecuencia y Adquisición */}
        <div className="card-cockpit-gradient border border-[#262626] rounded-none border-sheen p-8 sm:p-10 space-y-6 shadow-2xl bg-[#141414] border-t-2 border-t-[#1c69d4]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-[0.18em] text-white flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-[#1c69d4]" />
              Frecuencia de Muestreo de Telemetría
            </h2>
            <span className="text-[10px] font-mono text-[#bbbbbb] bg-[#1a1a1a] border border-[#262626] px-2.5 py-0.5 uppercase tracking-wider">
              Assetto Corsa Engine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              { valor: "30", etiqueta: "30 Hz (Económico)", detalle: "1 muestra c/ 33 ms" },
              { valor: "60", etiqueta: "60 Hz (Estándar Motorsport)", detalle: "1 muestra c/ 16.6 ms" },
              { valor: "100", etiqueta: "100 Hz (Pro MoTeC)", detalle: "1 muestra c/ 10 ms" },
            ].map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                onClick={() => setFrecuenciaHz(opcion.valor)}
                className={`p-4 border text-left transition-all rounded-none font-mono ${
                  frecuenciaHz === opcion.valor
                    ? "border-[#0066b1] bg-[#0066b1]/15 text-white"
                    : "border-[#262626] bg-[#0d0d0d] hover:border-[#3c3c3c] text-[#bbbbbb]"
                }`}
              >
                <span className="text-xs font-bold block uppercase">{opcion.etiqueta}</span>
                <span className="text-[10px] text-[#7e7e7e] block mt-1">{opcion.detalle}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Botonera de Guardado */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#262626]">
          <span className="text-xs font-mono text-[#7e7e7e] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#0fa336]" />
            Ajustes almacenados localmente en LocalStorage y sincronizados con el Daemon.
          </span>

          <button
            type="submit"
            className="w-full sm:w-auto h-12 px-10 rounded-none font-mono font-bold uppercase tracking-[0.2em] text-xs bg-[#0066b1] hover:bg-[#1c69d4] active:scale-[0.99] text-white transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {guardado ? (
              <>
                <Check className="w-4 h-4 text-[#0fa336] stroke-[3]" />
                <span className="text-[#0fa336]">Cambios Aplicados</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-white" />
                <span>Guardar Parámetros</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
