"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Gauge,
  LineChart,
  FolderClock,
  MapPin,
  Car,
  User,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { obtenerSesionLocal, cerrarSesion, PILOTO_INVITADO_FAPPE } from "@/lib/auth";
import type { PerfilUsuario } from "@/types/usuario";

const ENLACES_NAVEGACION = [
  {
    href: "/app",
    etiqueta: "Dashboard & AI Coach",
    icono: Gauge,
    descripcion: "Resumen y diagnóstico",
  },
  {
    href: "/app/analysis",
    etiqueta: "Laboratorio Analítico 2D",
    icono: LineChart,
    descripcion: "Telemetría y trazada",
    destacado: true,
  },
  {
    href: "/app/sessions",
    etiqueta: "Historial de Tandas",
    icono: FolderClock,
    descripcion: "Vueltas guardadas",
  },
  {
    href: "/app/circuitos",
    etiqueta: "Circuitos & Tiempos",
    icono: MapPin,
    descripcion: "Monza y récords",
  },
  {
    href: "/app/garaje",
    etiqueta: "Garaje Virtual",
    icono: Car,
    descripcion: "Flota de monoplazas",
  },
  {
    href: "/app/perfil",
    etiqueta: "Perfil & Rating",
    icono: User,
    descripcion: "Apex Rating y trofeos",
  },
  {
    href: "/app/leaderboards",
    etiqueta: "Tabla de Récords",
    icono: Trophy,
    descripcion: "Clasificación y deltas",
  },
  {
    href: "/app/ajustes",
    etiqueta: "Ajustes de Boxes",
    icono: Settings,
    descripcion: "Configuración y red",
  },
];

export default function LayoutAppBoxes({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
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
      {/* Barra Tricolor M Superior + Header Superior de Mando (Sticky) */}
      <div className="sticky top-0 z-40 bg-[#0d0d0d]">
        <div className="h-1 w-full flex">
          <div className="h-full w-1/3 bg-[#0066b1]" />
          <div className="h-full w-1/3 bg-[#1c69d4]" />
          <div className="h-full w-1/3 bg-[#e22718]" />
        </div>

        <header className="border-b border-[#262626] bg-[#0a0a0a] px-6 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSidebarAbierto(!sidebarAbierto)}
              className="md:hidden p-2 rounded-none bg-black border border-[#3c3c3c] text-white cursor-pointer hover:border-[#0066b1] transition-colors"
            >
              {sidebarAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/hub" className="flex items-center gap-3.5 group py-1">
              <Image
                src="/logos/logo.webp"
                alt="ApexLink Logo"
                width={140}
                height={28}
                priority
                className="h-6 sm:h-7 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
              <span className="hidden sm:inline-flex items-center text-[10px] font-mono font-bold tracking-[0.2em] text-[#bbbbbb] bg-[#1a1a1a] border border-[#262626] px-2.5 py-0.5 uppercase">
                BOXES
              </span>
            </Link>
          </div>

          {/* Indicadores de Enlace */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="hidden lg:flex items-center gap-4 text-xs font-mono px-4 py-2 rounded-none bg-[#141414] border border-[#262626] tracking-[0.1em]">
              <span className="flex items-center gap-2 text-[#0fa336] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0fa336] animate-pulse" />
                60 Hz Win32 OK
              </span>
              <span className="text-[#3c3c3c]">|</span>
              <span className="flex items-center gap-1.5 text-[#bbbbbb]">
                &lt; 0.8 ms USB
              </span>
              <span className="text-[#3c3c3c]">|</span>
              <span className="text-[#0066b1] font-bold uppercase tracking-wider">
                Live Feed
              </span>
            </div>

            {/* Perfil del Piloto */}
            <div className="flex items-center gap-3 pl-3 border-l border-[#262626]">
              <div className="w-8 h-8 rounded-none bg-[#1a1a1a] border border-[#3c3c3c] flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-white leading-none">
                  {usuario.nombre}
                </div>
                <div className="text-[10px] text-[#0fa336] font-mono tracking-[0.15em] font-bold mt-1">
                  Rating {usuario.rating.paceRating}
                </div>
              </div>

              <button
                onClick={manejarCerrarSesion}
                title="Cerrar Sesión"
                className="p-2 rounded-none bg-[#141414] hover:bg-[#1a1a1a] border border-[#3c3c3c] hover:border-[#e22718] text-[#bbbbbb] hover:text-white transition-all cursor-pointer ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Cuerpo Principal: Sidebar + Contenido */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Sidebar Lateral de Boxes (Sticky en desktop, acompaña la pantalla al scrollear) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0d0d0d] border-r border-[#262626] flex flex-col justify-between pt-16 md:pt-0 transform transition-transform duration-200 ease-in-out md:sticky md:top-[63px] md:h-[calc(100vh-63px)] md:self-start md:translate-x-0 shrink-0 ${
            sidebarAbierto ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 sm:p-5 space-y-1.5 overflow-y-auto flex-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#7e7e7e] px-4 py-2">
              Boxes & Telemetría
            </div>

            {ENLACES_NAVEGACION.map((enlace) => {
              const Icono = enlace.icono;
              const activo = pathname === enlace.href;

              return (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  onClick={() => setSidebarAbierto(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-none text-xs font-bold uppercase tracking-[0.14em] transition-all group ${
                    activo
                      ? "bg-[#1a1a1a] text-white border-l-2 border-l-[#0066b1]"
                      : "text-[#bbbbbb] hover:text-white hover:bg-[#141414] border-l-2 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-7 h-7 rounded-none flex items-center justify-center transition-all ${
                        activo
                          ? "bg-[#0066b1] text-white"
                          : "bg-[#141414] border border-[#262626] text-[#8a8a8a] group-hover:text-white group-hover:border-[#3c3c3c]"
                      }`}
                    >
                      <Icono className="w-4 h-4" />
                    </div>
                    <span>{enlace.etiqueta}</span>
                  </div>
                  {enlace.destacado && !activo && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-none bg-[#0fa336]/10 text-[#0fa336] border border-[#0fa336]/30 tracking-wider font-bold">
                      LIVE
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-6 border-t border-[#262626] mt-6">
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#7e7e7e] px-4 py-2">
                Simulador
              </div>
              <Link
                href="/hub"
                className="flex items-center justify-between px-4 py-3 rounded-none text-xs uppercase tracking-[0.15em] text-[#bbbbbb] hover:text-white hover:bg-[#141414] border border-transparent hover:border-[#3c3c3c] transition-all"
              >
                <span>Cambiar Simulador</span>
                <ChevronRight className="w-4 h-4 text-[#7e7e7e]" />
              </Link>
            </div>
          </div>

          {/* Footer de Versión en Sidebar */}
          <div className="p-5 border-t border-[#262626] bg-[#0a0a0a] text-[11px] font-mono tracking-[0.12em] text-[#7e7e7e] shrink-0">
            <div className="font-bold uppercase tracking-[0.16em] text-white flex items-center justify-between">
              <span>ApexLink SaaS</span>
              <span className="text-[9px] px-2 py-0.5 bg-[#141414] text-[#bbbbbb] border border-[#3c3c3c]">v2.0</span>
            </div>
            <div className="text-[10px] text-[#7e7e7e] mt-1 uppercase tracking-[0.12em]">Telemetría de Competición</div>
          </div>
        </aside>

        {/* Backdrop en Mobile cuando el sidebar está abierto */}
        {sidebarAbierto && (
          <div
            onClick={() => setSidebarAbierto(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          />
        )}

        {/* Contenido Dinámico */}
        <main className="flex-1 min-w-0 bg-[#000000] p-6 sm:p-10 lg:p-12 xl:p-14">
          {children}
        </main>
      </div>
    </div>
  );
}
