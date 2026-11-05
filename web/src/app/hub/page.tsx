"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LogOut,
  Car,
  MapPin,
  Cpu,
  User,
  Radio,
  Activity,
} from "lucide-react";
import { obtenerSesionLocal, cerrarSesion, PILOTO_INVITADO_FAPPE } from "@/lib/auth";
import type { PerfilUsuario } from "@/types/usuario";

interface SimuladorFila {
  id: string;
  nombre: string;
  desarrollador: string;
  activo: boolean;
  estadoTexto: string;
  descripcion: string;
  protocolo: string;
  imagenFondo: string;
  circuitoDemo?: string;
  vehiculoDemo?: string;
}

const LISTA_SIMULADORES: SimuladorFila[] = [
  {
    id: "assetto-corsa",
    nombre: "Assetto Corsa",
    desarrollador: "Kunos Simulazioni",
    activo: true,
    estadoTexto: "ENLACE DIRECTO · 60 HZ",
    descripcion:
      "Adquisición de chasis, gomas y cinemática en tiempo real mediante memoria compartida Win32 de baja latencia.",
    protocolo: "Win32 MMF Zero-Copy @ 333 Hz",
    imagenFondo: "/images/games/assetto-corsa.jpg",
    circuitoDemo: "Autodromo Nazionale Monza (5.757 m)",
    vehiculoDemo: "Ferrari SF70H / BMW M2 CS Racing",
  },
  {
    id: "acc",
    nombre: "Assetto Corsa Competizione",
    desarrollador: "Kunos Simulazioni / 505 Games",
    activo: false,
    estadoTexto: "FASE 2 · PRÓXIMAMENTE",
    descripcion:
      "Receptor de tramas UDP nativas para normativas SRO GT3 & GT4 World Challenge con cálculo de presiones óptimas.",
    protocolo: "ACC Broadcast UDP Packet",
    imagenFondo: "/images/games/acc.jpg",
  },
  {
    id: "iracing",
    nombre: "iRacing Motorsport Simulations",
    desarrollador: "iRacing.com",
    activo: false,
    estadoTexto: "FASE 2 · PRÓXIMAMENTE",
    descripcion:
      "Integración con el SDK de memoria compartida de alta frecuencia y análisis de telemetría basada en archivos binarios .ibt.",
    protocolo: "iRacing Shared Memory 360 Hz",
    imagenFondo: "/images/games/iracing.jpg",
  },
  {
    id: "f1-24",
    nombre: "EA Sports F1 24",
    desarrollador: "Codemasters / Electronic Arts",
    activo: false,
    estadoTexto: "FASE 2 · PRÓXIMAMENTE",
    descripcion:
      "Decodificador de paquetes UDP 2024 para despliegue de ERS, telemetría multijugador y degradación de neumáticos.",
    protocolo: "F1 2024 UDP Telemetry Packet",
    imagenFondo: "/images/games/f1-24.jpg",
  },
  {
    id: "lmu",
    nombre: "Le Mans Ultimate",
    desarrollador: "Studio 397 / Motorsport Games",
    activo: false,
    estadoTexto: "FASE 2 · PRÓXIMAMENTE",
    descripcion:
      "Protocolo para el Campeonato Mundial de Resistencia FIA WEC, gestión de stint Hypercar y regeneración híbrida LMDh.",
    protocolo: "rF2 Direct Shared Memory Plugin",
    imagenFondo: "/images/games/lmu.jpg",
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
      {/* Barra de Acento Tricolor BMW M (4px) */}
      <div className="h-1 w-full flex sticky top-0 z-50">
        <div className="h-full w-1/3 bg-[#0066b1]" />
        <div className="h-full w-1/3 bg-[#1c69d4]" />
        <div className="h-full w-1/3 bg-[#e22718]" />
      </div>

      {/* Header Superior del Hub con Logo Oficial */}
      <header className="border-b border-[#262626] bg-[#0a0a0a] px-6 py-4 sticky top-1 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            title="Volver a la Página Principal"
            className="flex items-center gap-3.5 group"
          >
            <Image
              src="/logos/logo.webp"
              alt="ApexLink Logo"
              width={140}
              height={28}
              priority
              className="h-7 sm:h-8 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
            <span className="hidden sm:inline-flex items-center text-[10px] font-mono font-bold tracking-[0.2em] text-[#bbbbbb] bg-[#1a1a1a] border border-[#262626] px-2.5 py-0.5 uppercase">
              GATEWAY
            </span>
          </Link>

          {/* Barra de Perfil Activo */}
          <div className="flex items-center gap-4">
            {usuario && (
              <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-none bg-[#141414] border border-[#262626]">
                <div className="w-7 h-7 rounded-none bg-[#1a1a1a] border border-[#3c3c3c] flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left font-mono">
                  <div className="text-xs font-bold text-white uppercase tracking-wider leading-none">
                    {usuario.nombre}
                  </div>
                  <div className="text-[10px] text-[#0fa336] leading-tight mt-0.5 tracking-tight font-bold">
                    Rating {usuario.rating.paceRating} · Cat. {usuario.rating.safetyRating}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={manejarCerrarSesion}
              title="Cerrar Sesión"
              className="p-2 rounded-none bg-[#141414] hover:bg-[#1a1a1a] border border-[#3c3c3c] text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-between">
        <div>
          {/* Encabezado de la Sección */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#0066b1]/15 border border-[#0066b1]/40 text-[#0066b1] text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <Activity className="w-3.5 h-3.5" />
              Sim Racing Ecosystem
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white font-mono">
              Plataformas de Competición
            </h1>
            <p className="text-sm text-[#bbbbbb] mt-2 max-w-3xl leading-relaxed font-mono">
              Selecciona el simulador activo para inicializar el puente de telemetría en tiempo real y habilitar el panel de boxes y análisis telemétrico.
            </p>
          </div>

          {/* Lista de Simuladores de Ancho Completo */}
          <div className="flex flex-col gap-4">
            {LISTA_SIMULADORES.map((sim) => {
              if (sim.activo) {
                return (
                  <Link
                    key={sim.id}
                    href="/app"
                    className="group relative w-full rounded-none border border-[#0066b1] bg-[#0d0d0d] hover:border-[#1c69d4] transition-all duration-200 overflow-hidden shadow-xl cursor-pointer"
                  >
                    {/* Imagen de Fondo Dinámica */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out saturate-75 brightness-75 group-hover:scale-[1.02] group-hover:saturate-100 group-hover:brightness-90"
                      style={{ backgroundImage: `url('${sim.imagenFondo}')` }}
                    />

                    {/* Overlay con degradado para garantizar legibilidad técnica */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40 transition-opacity duration-300" />

                    {/* Banda Tricolor BMW M en el borde izquierdo */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col group-hover:w-1.5 transition-all">
                      <div className="h-1/3 bg-[#0066b1]" />
                      <div className="h-1/3 bg-[#1c69d4]" />
                      <div className="h-1/3 bg-[#e22718]" />
                    </div>

                    {/* Contenido de la Fila */}
                    <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pl-6 sm:pl-8">
                      {/* Información Izquierda */}
                      <div className="space-y-3 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0066b1]">
                            {sim.desarrollador}
                          </span>

                          <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-none border border-[#0fa336]/40 bg-[#0fa336]/10 text-[#0fa336] text-[10px] font-mono font-bold uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0fa336] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0fa336]"></span>
                            </span>
                            {sim.estadoTexto}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white font-mono group-hover:text-white transition-colors">
                          {sim.nombre}
                        </h2>

                        <p className="text-xs sm:text-sm text-[#bbbbbb] leading-relaxed">
                          {sim.descripcion}
                        </p>

                        {/* Metadatos Técnicos */}
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs font-mono text-[#bbbbbb]">
                          <span className="flex items-center gap-1.5 bg-black/70 px-3 py-1 border border-[#262626]">
                            <Cpu className="w-3.5 h-3.5 text-[#0066b1]" />
                            <span className="text-[#7e7e7e]">Protocolo:</span>
                            <span className="text-white font-medium">{sim.protocolo}</span>
                          </span>

                          {sim.circuitoDemo && (
                            <span className="flex items-center gap-1.5 bg-black/70 px-3 py-1 border border-[#262626]">
                              <MapPin className="w-3.5 h-3.5 text-[#0066b1]" />
                              <span className="text-[#7e7e7e]">Trazado:</span>
                              <span className="text-white font-medium">{sim.circuitoDemo}</span>
                            </span>
                          )}

                          {sim.vehiculoDemo && (
                            <span className="flex items-center gap-1.5 bg-black/70 px-3 py-1 border border-[#262626]">
                              <Car className="w-3.5 h-3.5 text-[#0066b1]" />
                              <span className="text-[#7e7e7e]">Monoplaza:</span>
                              <span className="text-white font-medium">{sim.vehiculoDemo}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botón de Acción Derecha */}
                      <div className="flex items-center lg:self-center shrink-0">
                        <div className="w-full lg:w-auto px-7 py-3.5 rounded-none bg-[#0066b1] group-hover:bg-[#1c69d4] text-white font-mono font-bold uppercase text-xs tracking-[0.15em] transition-all flex items-center justify-center gap-3">
                          <Radio className="w-4 h-4 animate-pulse" />
                          <span>Ingresar a Boxes</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }

              {/* Fila Deshabilitada / Bloqueada */}
              return (
                <div
                  key={sim.id}
                  className="group relative w-full rounded-none overflow-hidden border border-[#262626] bg-[#0d0d0d] transition-all duration-300"
                >
                  {/* Imagen de Fondo en Blanco y Negro Difuminada */}
                  <div
                    className="absolute inset-0 bg-cover bg-center grayscale contrast-125 brightness-25 blur-[1px] scale-100"
                    style={{ backgroundImage: `url('${sim.imagenFondo}')` }}
                  />

                  {/* Overlay oscuro para acentuar el aspecto offline */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />

                  {/* Borde sutil izquierdo */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#262626]" />

                  {/* Contenido de la Fila Bloqueada */}
                  <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pl-6 sm:pl-8 opacity-70 group-hover:opacity-85 transition-opacity">
                    {/* Información Izquierda */}
                    <div className="space-y-3 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7e7e7e]">
                          {sim.desarrollador}
                        </span>

                        <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-none border border-[#3c3c3c] bg-[#141414] text-[#7e7e7e] text-[10px] font-mono font-bold uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-[#7e7e7e]" />
                          {sim.estadoTexto}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white font-mono">
                        {sim.nombre}
                      </h2>

                      <p className="text-xs sm:text-sm text-[#7e7e7e] leading-relaxed">
                        {sim.descripcion}
                      </p>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs font-mono text-[#7e7e7e]">
                        <span className="flex items-center gap-1.5 bg-black/70 px-3 py-1 border border-[#262626]">
                          <Cpu className="w-3.5 h-3.5 text-[#555555]" />
                          <span>Protocolo:</span>
                          <span className="text-[#bbbbbb] font-medium">{sim.protocolo}</span>
                        </span>
                      </div>
                    </div>

                    {/* Botón Inactivo Derecha */}
                    <div className="flex items-center lg:self-center shrink-0">
                      <div className="w-full lg:w-auto px-7 py-3.5 rounded-none bg-[#141414] border border-[#262626] text-[#666666] font-mono font-bold uppercase text-xs tracking-[0.15em] flex items-center justify-center gap-2 cursor-not-allowed">
                        <span>Fase 2 Próximamente</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer del Hub */}
        <footer className="mt-12 pt-6 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#7e7e7e]">
          <div>ApexLink SimRacing Gateway • Arquitectura Kestrel Win32 Zero-Copy</div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>•</span>
            <Link href="/app" className="hover:text-white transition-colors">Boxes</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
