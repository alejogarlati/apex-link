"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gauge,
  Lock,
  ArrowRight,
  LogOut,
  Car,
  MapPin,
  Cpu,
  User,
} from "lucide-react";
import { obtenerSesionLocal, cerrarSesion, PILOTO_INVITADO_FAPPE } from "@/lib/auth";
import type { PerfilUsuario } from "@/types/usuario";

interface TarjetaSimulador {
  id: string;
  nombre: string;
  desarrollador: string;
  activo: boolean;
  estadoBadge: string;
  descripcion: string;
  protocolo: string;
  circuitoDemo?: string;
  vehiculoDemo?: string;
}

const SIMULADORES: TarjetaSimulador[] = [
  {
    id: "assetto-corsa",
    nombre: "Assetto Corsa",
    desarrollador: "Kunos Simulazioni",
    activo: true,
    estadoBadge: "🟢 Conectado / Stand FAPPE",
    descripcion:
      "Adquisición determinística directa por Win32 Memory Mapped Files a 60 Hz. Servidor Kestrel local acoplado a la memoria del proceso acs.exe.",
    protocolo: "Win32 MMF + WebSocket 60 Hz",
    circuitoDemo: "Autodromo Nazionale Monza (5.793 m)",
    vehiculoDemo: "Ferrari SF70H / BMW M2 CS",
  },
  {
    id: "acc",
    nombre: "Assetto Corsa Competizione",
    desarrollador: "Kunos Simulazioni / 505 Games",
    activo: false,
    estadoBadge: "🔒 Próximamente (Fase 2)",
    descripcion:
      "Protocolo de broadcast UDP nativo para normativas SRO GT3 & GT4 World Challenge con cálculo de presiones óptimas de neumáticos.",
    protocolo: "ACC Broadcast UDP Packet",
  },
  {
    id: "iracing",
    nombre: "iRacing Motorsport Simulations",
    desarrollador: "iRacing.com",
    activo: false,
    estadoBadge: "🔒 Próximamente (Fase 2)",
    descripcion:
      "Integración con el SDK de memoria compartida de 360 Hz y telemetría histórica basada en archivos binarios .ibt.",
    protocolo: "iRacing Shared Memory 360 Hz",
  },
  {
    id: "f1-24",
    nombre: "EA Sports F1 24",
    desarrollador: "Codemasters / EA Sports",
    activo: false,
    estadoBadge: "🔒 Próximamente (Fase 2)",
    descripcion:
      "Receptor de flujo de paquetes UDP 2024 para telemetría multijugador, despliegue ERS y desgaste dinámico de neumáticos.",
    protocolo: "F1 2024 UDP Telemetry Packet",
  },
];

export default function PaginaHubSimuladores() {
  const router = useRouter();
  const [usuario] = useState<PerfilUsuario>(() => {
    const sesion = obtenerSesionLocal();
    return sesion ? sesion.usuario : PILOTO_INVITADO_FAPPE;
  });

  const manejarCerrarSesion = () => {
    cerrarSesion();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-[#0066b1]">
      {/* Barra de Acento Tricolor BMW M */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#0066b1]" />
        <div className="h-full w-1/3 bg-[#1c69d4]" />
        <div className="h-full w-1/3 bg-[#e22718]" />
      </div>

      {/* Header Superior del Hub */}
      <header className="border-b border-[#262626] bg-[#0d0d0d]/90 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black border border-[#3c3c3c] rounded">
              <Gauge className="w-5 h-5 text-[#0066b1]" />
            </div>
            <div>
              <span className="text-base font-bold uppercase tracking-tight text-white font-mono">
                Apex<span className="text-[#0066b1]">Link</span> Gateway
              </span>
              <span className="text-[10px] text-[#7e7e7e] block uppercase">
                Hub Central de Simulación
              </span>
            </div>
          </div>

          {/* Barra de Perfil Activo */}
          <div className="flex items-center gap-4">
            {usuario && (
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded bg-black border border-[#262626]">
                <div className="w-7 h-7 rounded-full bg-[#0066b1]/20 border border-[#0066b1]/50 flex items-center justify-center text-[#0066b1]">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white leading-none">
                    {usuario.nombre}
                  </div>
                  <div className="text-[10px] text-[#0fa336] font-mono leading-tight mt-0.5">
                    Rating {usuario.rating.paceRating} • Cat. {usuario.rating.safetyRating}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={manejarCerrarSesion}
              title="Cerrar Sesión"
              className="p-2 rounded bg-[#1a1a1a] hover:bg-[#262626] border border-[#3c3c3c] text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0066b1]/15 border border-[#0066b1]/30 text-[#0066b1] text-xs font-bold uppercase tracking-widest mb-2">
            Sim Racing Gateway
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white">
            Selecciona el Simulador de Competición
          </h1>
          <p className="text-sm text-[#bbbbbb] mt-1 max-w-2xl">
            ApexLink opera como pasarela agnóstica de telemetría. Para la exhibición oficial de FAPPE 2026, el motor principal se encuentra acoplado a Assetto Corsa.
          </p>
        </div>

        {/* Grilla de Simuladores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SIMULADORES.map((sim) => (
            <div
              key={sim.id}
              className={`rounded-lg border p-6 flex flex-col justify-between transition-all ${
                sim.activo
                  ? "bg-[#1a1a1a] border-[#0066b1] shadow-xl shadow-[#0066b1]/10"
                  : "bg-[#0d0d0d] border-[#262626] opacity-75"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#262626]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e7e7e]">
                      {sim.desarrollador}
                    </span>
                    <h2 className="text-2xl font-bold uppercase text-white mt-0.5">
                      {sim.nombre}
                    </h2>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
                      sim.activo
                        ? "bg-[#0fa336]/15 border-[#0fa336]/40 text-[#0fa336]"
                        : "bg-[#262626] border-[#3c3c3c] text-[#7e7e7e]"
                    }`}
                  >
                    {sim.estadoBadge}
                  </span>
                </div>

                <p className="text-xs text-[#bbbbbb] mt-4 leading-relaxed">
                  {sim.descripcion}
                </p>

                <div className="mt-6 space-y-2.5 pt-4 border-t border-[#262626]/60">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#7e7e7e] flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      Protocolo:
                    </span>
                    <span className="text-white font-medium">{sim.protocolo}</span>
                  </div>

                  {sim.circuitoDemo && (
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#7e7e7e] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        Pista Activa:
                      </span>
                      <span className="text-white font-medium">{sim.circuitoDemo}</span>
                    </div>
                  )}

                  {sim.vehiculoDemo && (
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#7e7e7e] flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5" />
                        Vehículo:
                      </span>
                      <span className="text-white font-medium">{sim.vehiculoDemo}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#262626]">
                {sim.activo ? (
                  <Link
                    href="/app"
                    className="w-full py-3 px-4 rounded font-bold uppercase tracking-wider text-xs bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0066b1]/20 cursor-pointer"
                  >
                    <Gauge className="w-4 h-4 fill-white" />
                    Entrar a Boxes & Telemetría
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded font-bold uppercase tracking-wider text-xs bg-[#1a1a1a] border border-[#262626] text-[#7e7e7e] flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" />
                    Módulo Bloqueado (Fase 2)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#262626] py-4 px-6 text-center text-xs text-[#7e7e7e]">
        ApexLink SimRacing Gateway • Assetto Corsa Pipeline v1.0 • Stand FAPPE 2026
      </footer>
    </div>
  );
}
