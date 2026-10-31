"use client";

import { useState } from "react";
import Link from "next/link";
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
    etiqueta: "Stand FAPPE Ranking",
    icono: Trophy,
    descripcion: "Tiempos del jurado",
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
      {/* Barra Tricolor M Superior */}
      <div className="h-1 w-full flex sticky top-0 z-50">
        <div className="h-full w-1/3 bg-[#0066b1]" />
        <div className="h-full w-1/3 bg-[#1c69d4]" />
        <div className="h-full w-1/3 bg-[#e22718]" />
      </div>

      {/* Header Superior de Mando */}
      <header className="border-b border-[#262626] bg-[#0d0d0d] px-4 sm:px-6 py-2.5 flex items-center justify-between z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            className="md:hidden p-2 rounded bg-black border border-[#3c3c3c] text-white"
          >
            {sidebarAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/hub" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded bg-black border border-[#3c3c3c] group-hover:border-[#0066b1] transition-colors">
              <Gauge className="w-4 h-4 text-[#0066b1]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-tight text-white font-mono leading-none">
                Apex<span className="text-[#0066b1]">Link</span> Pitwall
              </span>
              <span className="text-[9px] text-[#7e7e7e] font-mono leading-none mt-1">
                Assetto Corsa • Monza F1 2025
              </span>
            </div>
          </Link>
        </div>

        {/* Indicadores de Enlace */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:flex items-center gap-3 text-xs font-mono px-3 py-1 rounded bg-black border border-[#262626]">
            <span className="flex items-center gap-1.5 text-[#0fa336]">
              <span className="w-2 h-2 rounded-full bg-[#0fa336] animate-pulse" />
              60 Hz Win32 OK
            </span>
            <span className="text-[#3c3c3c]">|</span>
            <span className="text-[#bbbbbb]">&lt; 0.8 ms USB</span>
          </div>

          {/* Perfil del Piloto */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#262626]">
            <div className="w-7 h-7 rounded bg-[#1a1a1a] border border-[#3c3c3c] flex items-center justify-center text-[#0066b1]">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white leading-none">
                {usuario.nombre}
              </div>
              <div className="text-[10px] text-[#0fa336] font-mono mt-0.5">
                Rating {usuario.rating.paceRating}
              </div>
            </div>

            <button
              onClick={manejarCerrarSesion}
              title="Cerrar Sesión"
              className="p-1.5 rounded bg-black hover:bg-[#262626] border border-[#3c3c3c] text-[#bbbbbb] hover:text-white transition-colors cursor-pointer ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Cuerpo Principal: Sidebar + Contenido */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Lateral de Boxes */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0d0d0d] border-r border-[#262626] flex flex-col justify-between pt-16 md:pt-0 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
            sidebarAbierto ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#7e7e7e] px-3 py-2">
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-bold transition-all group ${
                    activo
                      ? "bg-[#0066b1] text-white shadow-lg shadow-[#0066b1]/20"
                      : "text-[#bbbbbb] hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icono
                      className={`w-4 h-4 ${
                        activo ? "text-white" : enlace.destacado ? "text-[#0066b1]" : "text-[#7e7e7e] group-hover:text-white"
                      }`}
                    />
                    <span>{enlace.etiqueta}</span>
                  </div>
                  {enlace.destacado && !activo && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0066b1]/20 text-[#0066b1] border border-[#0066b1]/30">
                      CORE
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-[#262626] mt-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#7e7e7e] px-3 py-2">
                Simulador
              </div>
              <Link
                href="/hub"
                className="flex items-center justify-between px-3 py-2 rounded text-xs text-[#bbbbbb] hover:text-white hover:bg-[#1a1a1a] transition-colors"
              >
                <span>Cambiar Simulador</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#7e7e7e]" />
              </Link>
            </div>
          </div>

          {/* Footer de Versión en Sidebar */}
          <div className="p-4 border-t border-[#262626] bg-black text-[11px] text-[#7e7e7e]">
            <div className="font-bold text-[#bbbbbb]">ApexLink SaaS v2.0</div>
            <div>Edición FAPPE 2026 • SDD</div>
          </div>
        </aside>

        {/* Contenido Dinámico */}
        <div className="flex-1 overflow-y-auto bg-black p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
