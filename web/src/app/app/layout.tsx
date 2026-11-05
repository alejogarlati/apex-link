"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Gauge,
  Radio,
  LineChart,
  FolderClock,
  MapPin,
  Car,
  User,
  Trophy,
  Settings,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import {
  obtenerSesionLocal,
  cerrarSesion,
  USUARIO_ALEJO_GARLATI,
} from "@/lib/auth";
import type { PerfilUsuario } from "@/types/usuario";
import { UserNavDropdown } from "@/components/layout/UserNavDropdown";
import { useToast } from "@/context/ToastContext";
import { Skeleton } from "@/components/ui/Skeleton";

const ENLACES_NAVEGACION = [
  {
    href: "/app",
    etiqueta: "Dashboard & AI Coach",
    icono: Gauge,
    descripcion: "Resumen y diagnóstico",
  },
  {
    href: "/app/live",
    etiqueta: "Live Pitwall @ 60 Hz",
    icono: Radio,
    descripcion: "Telemetría en tiempo real",
    destacado: true,
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
  const toast = useToast();

  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const [usuario, setUsuario] = useState<PerfilUsuario>(USUARIO_ALEJO_GARLATI);

  useEffect(() => {
    const sincronizarUsuario = () => {
      const sesion = obtenerSesionLocal();
      if (!sesion || !sesion.usuario) {
        router.replace("/login");
        return;
      }
      setUsuario(sesion.usuario);
      setVerificandoSesion(false);
    };

    sincronizarUsuario();
    window.addEventListener("storage", sincronizarUsuario);
    window.addEventListener("apexlink_usuario_cambiado", sincronizarUsuario);

    return () => {
      window.removeEventListener("storage", sincronizarUsuario);
      window.removeEventListener("apexlink_usuario_cambiado", sincronizarUsuario);
    };
  }, [router]);

  const manejarCerrarSesion = () => {
    cerrarSesion();
    toast.info("Sesión finalizada", "Saliste del muro de boxes de forma segura.");
    router.replace("/login");
  };

  const enlaceActivo = ENLACES_NAVEGACION.find((e) => e.href === pathname);

  if (verificandoSesion) {
    return (
      <div className="min-h-screen bg-black text-white p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

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
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            aria-label={sidebarAbierto ? "Cerrar menú lateral" : "Abrir menú lateral"}
            className="md:hidden p-2 rounded-lg bg-black border border-[#3c3c3c] text-white cursor-pointer"
          >
            {sidebarAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/app" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="flex items-center px-2 py-1 bg-[#141414] border border-[#3c3c3c] group-hover:border-[#0066b1] rounded-lg transition-colors">
              <Image
                src="/logos/logo.webp"
                alt="ApexLink"
                width={95}
                height={20}
                className="h-4 sm:h-5 w-auto object-contain"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-white font-mono leading-none flex items-center gap-1.5">
                Pitwall
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0066b1]/20 text-[#81c4ff] border border-[#0066b1]/40 font-mono font-bold">
                  PRO
                </span>
              </span>
              <span className="text-[9px] text-[#7e7e7e] font-mono leading-none mt-1">
                {usuario.vehiculoPrincipal}
              </span>
            </div>
          </Link>

          {/* Breadcrumb de Orientación */}
          {enlaceActivo && (
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[#262626] text-xs font-mono text-[#8a8a8a]">
              <span>Boxes</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#525252]" />
              <span className="text-white font-bold">{enlaceActivo.etiqueta}</span>
            </div>
          )}
        </div>

        {/* Estado de Telemetría y Menú Desplegable del Piloto */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden xl:flex items-center gap-3 text-xs font-mono px-3 py-1.5 rounded-lg bg-black border border-[#262626]">
            <span className="flex items-center gap-1.5 text-[#00E676]">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              60 Hz Shared Memory
            </span>
            <span className="text-[#3c3c3c]">|</span>
            <span className="text-[#bbbbbb]">&lt; 0.8 ms</span>
          </div>

          {/* Menú de Usuario Estándar de Producción */}
          <UserNavDropdown
            usuario={usuario}
            onCerrarSesion={manejarCerrarSesion}
          />
        </div>
      </header>

      {/* Cuerpo Principal: Sidebar + Contenido */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Backdrop móvil */}
        {sidebarAbierto && (
          <div
            aria-hidden="true"
            onClick={() => setSidebarAbierto(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-20 md:hidden"
          />
        )}

        {/* Sidebar Lateral de Boxes */}
        <aside
          aria-label="Navegación principal de boxes"
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0d0d0d] border-r border-[#262626] flex flex-col justify-between pt-16 md:pt-0 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
            sidebarAbierto ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#7e7e7e] px-3 py-2 font-mono">
              Boxes & Telemetría
            </div>

            {ENLACES_NAVEGACION.map((enlace) => {
              const Icono = enlace.icono;
              const activo = pathname === enlace.href;

              return (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  aria-current={activo ? "page" : undefined}
                  onClick={() => setSidebarAbierto(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all group outline-none focus-visible:ring-2 focus-visible:ring-[#0066b1] ${
                    activo
                      ? "bg-[#0066b1] text-white shadow-lg shadow-[#0066b1]/20"
                      : "text-[#bbbbbb] hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icono
                      className={`w-4 h-4 ${
                        activo
                          ? "text-white"
                          : enlace.destacado
                          ? "text-[#0066b1]"
                          : "text-[#7e7e7e] group-hover:text-white"
                      }`}
                    />
                    <span>{enlace.etiqueta}</span>
                  </div>
                  {enlace.destacado && !activo && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0066b1]/20 text-[#81c4ff] border border-[#0066b1]/30">
                      LIVE
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-[#262626] mt-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#7e7e7e] px-3 py-2 font-mono">
                Entorno
              </div>
              <Link
                href="/hub"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#bbbbbb] hover:text-white hover:bg-[#1a1a1a] transition-colors"
              >
                <span>Estado de Enlace Sim</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#7e7e7e]" />
              </Link>
            </div>
          </div>

          {/* Footer de Versión en Sidebar */}
          <div className="p-4 border-t border-[#262626] bg-black/60 text-[11px] text-[#7e7e7e] font-mono">
            <div className="font-bold text-[#bbbbbb]">ApexLink Pitwall v2.4</div>
            <div className="text-[10px] text-[#666666] mt-0.5">
              Licencia: {usuario.alias}
            </div>
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
