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
  Cpu,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Activity,
  Gamepad2,
  UserCircle,
  PanelLeft,
  PanelLeftClose,
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
import { SidebarProvider } from "@/context/SidebarContext";

interface EnlaceNav {
  href: string;
  etiqueta: string;
  icono: React.ComponentType<{ className?: string }>;
  descripcion: string;
  destacado?: boolean;
}

interface GrupoNav {
  id: string;
  titulo: string;
  icono: React.ComponentType<{ className?: string }>;
  enlaces: EnlaceNav[];
}

const GRUPOS_NAVEGACION: GrupoNav[] = [
  {
    id: "live-telemetria",
    titulo: "Telemetría & Live",
    icono: Activity,
    enlaces: [
      {
        href: "/app",
        etiqueta: "Dashboard & AI Coach",
        icono: Gauge,
        descripcion: "Resumen y diagnóstico",
      },
      {
        href: "/app/live",
        etiqueta: "Pitwall en Vivo",
        icono: Radio,
        descripcion: "Telemetría en tiempo real @ 60 Hz",
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
    ],
  },
  {
    id: "simulador-juego",
    titulo: "Simulador & Juego",
    icono: Gamepad2,
    enlaces: [
      {
        href: "/app/garaje",
        etiqueta: "Garaje Virtual",
        icono: Car,
        descripcion: "Flota de monoplazas",
      },
      {
        href: "/app/circuitos",
        etiqueta: "Circuitos & Tiempos",
        icono: MapPin,
        descripcion: "Monza y récords",
      },
      {
        href: "/hub",
        etiqueta: "Enlace de Simulador",
        icono: Cpu,
        descripcion: "Assetto Corsa y Win32 MMF",
      },
    ],
  },
  {
    id: "piloto-perfil",
    titulo: "Piloto & Perfil",
    icono: UserCircle,
    enlaces: [
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
    ],
  },
];

const TODOS_LOS_ENLACES = GRUPOS_NAVEGACION.flatMap((g) => g.enlaces);

export default function LayoutAppBoxes({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [sidebarColapsado, setSidebarColapsado] = useState(false);
  const [gruposAbiertos, setGruposAbiertos] = useState<Record<string, boolean>>({
    "live-telemetria": true,
    "simulador-juego": true,
    "piloto-perfil": true,
  });

  const [usuario, setUsuario] = useState<PerfilUsuario>(() => {
    const sesion = obtenerSesionLocal();
    return sesion?.usuario ?? USUARIO_ALEJO_GARLATI;
  });

  useEffect(() => {
    try {
      const guardado = localStorage.getItem("apexlink_sidebar_colapsado");
      if (guardado === "true") {
        setSidebarColapsado(true);
      }
    } catch {}
  }, []);

  const alternarColapsoSidebar = () => {
    setSidebarColapsado((prev) => {
      const nuevo = !prev;
      try {
        localStorage.setItem("apexlink_sidebar_colapsado", String(nuevo));
      } catch {}
      return nuevo;
    });
  };

  const alternarGrupo = (grupoId: string) => {
    setGruposAbiertos((prev) => ({
      ...prev,
      [grupoId]: !prev[grupoId],
    }));
  };

  useEffect(() => {
    const grupoActivo = GRUPOS_NAVEGACION.find((g) =>
      g.enlaces.some((e) => e.href === pathname)
    );
    if (grupoActivo) {
      setGruposAbiertos((prev) => ({
        ...prev,
        [grupoActivo.id]: true,
      }));
    }
  }, [pathname]);

  useEffect(() => {
    const sincronizarUsuario = () => {
      const sesion = obtenerSesionLocal();
      if (!sesion || !sesion.usuario) {
        router.replace("/login");
        return;
      }
      setUsuario(sesion.usuario);
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

  const enlaceActivo = TODOS_LOS_ENLACES.find((e) => e.href === pathname);
  const grupoActivo = GRUPOS_NAVEGACION.find((g) =>
    g.enlaces.some((e) => e.href === pathname)
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-[#0066b1]">
      {/* Barra Tricolor M Superior */}
      <div className="h-1 w-full flex sticky top-0 z-50">
        <div className="h-full w-1/3 bg-[#0066b1]" />
        <div className="h-full w-1/3 bg-[#1c69d4]" />
        <div className="h-full w-1/3 bg-[#e22718]" />
      </div>

      {/* Header Superior de Mando (Más alto, sin cards de fondo en ningún item) */}
      <header className="border-b border-[#262626] bg-[#0d0d0d] px-6 sm:px-8 py-5 sm:py-6 min-h-[76px] sm:min-h-[82px] flex items-center justify-between z-40">
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            aria-label={sidebarAbierto ? "Cerrar menú lateral" : "Abrir menú lateral"}
            className="md:hidden p-2 text-white hover:text-white/80 cursor-pointer"
          >
            {sidebarAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/app" className="flex items-center gap-3 sm:gap-4 group">
            <Image
              src="/logos/logo.webp"
              alt="ApexLink"
              width={105}
              height={22}
              className="h-5 sm:h-6 w-auto object-contain"
              priority
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-white font-mono leading-none">
                Pitwall
              </span>
              <span className="text-[10px] text-[#7e7e7e] font-mono leading-none mt-1">
                {usuario.vehiculoPrincipal}
              </span>
            </div>
          </Link>

          {/* Breadcrumb de Orientación */}
          {enlaceActivo && (
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#262626] text-xs font-mono text-[#8a8a8a]">
              <span>{grupoActivo?.titulo ?? "Boxes"}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#525252]" />
              <span className="text-white font-bold">{enlaceActivo.etiqueta}</span>
            </div>
          )}
        </div>

        {/* Estado de Telemetría y Menú Desplegable del Piloto (Sin card de fondo) */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden xl:flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#00E676]">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              60 Hz Shared Memory
            </span>
            <span className="text-[#3c3c3c]">|</span>
            <span className="text-[#8e8e93]">&lt; 0.8 ms</span>
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
          className={`fixed inset-y-0 left-0 z-30 bg-[#0d0d0d] border-r border-[#262626] flex flex-col justify-between pt-20 md:pt-0 transform transition-all duration-200 ease-in-out md:relative md:translate-x-0 ${
            sidebarAbierto ? "translate-x-0 w-64" : "-translate-x-full"
          } ${sidebarColapsado ? "md:w-16" : "md:w-64"}`}
        >
          {/* MODO EXPANDIDO: Se muestra en móviles cuando se abre el drawer, o en desktop si no está colapsado */}
          <div
            className={`flex-1 flex flex-col justify-between overflow-y-auto ${
              sidebarColapsado ? "md:hidden" : ""
            }`}
          >
            <div className="p-3 space-y-3">
              {GRUPOS_NAVEGACION.map((grupo, indiceGrupo) => {
                const IconoGrupo = grupo.icono;
                const estaAbierto = gruposAbiertos[grupo.id] ?? true;
                const tieneEnlaceActivo = grupo.enlaces.some((e) => e.href === pathname);

                return (
                  <div key={grupo.id} className="space-y-1">
                    {/* Agrupador genérico sin enrutado (dropdown toggle) */}
                    <button
                      type="button"
                      onClick={() => alternarGrupo(grupo.id)}
                      aria-expanded={estaAbierto}
                      aria-controls={`subgrupo-${grupo.id}`}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-[#0066b1] ${
                        tieneEnlaceActivo
                          ? "text-white bg-[#151518]"
                          : "text-[#88888e] hover:text-[#e0e0e0] hover:bg-[#121214]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <IconoGrupo
                          className={`w-3.5 h-3.5 transition-colors ${
                            tieneEnlaceActivo ? "text-[#0066b1]" : "text-[#5e5e66]"
                          }`}
                        />
                        <span>{grupo.titulo}</span>
                      </div>

                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#66666e] transition-transform duration-200 ${
                          estaAbierto ? "rotate-0" : "-rotate-90"
                        }`}
                      />
                    </button>

                    {/* Submenú desplegable con enlaces enrutados */}
                    {estaAbierto && (
                      <div
                        id={`subgrupo-${grupo.id}`}
                        className="space-y-0.5 pl-2 ml-2.5 border-l border-[#222226]"
                      >
                        {grupo.enlaces.map((enlace) => {
                          const Icono = enlace.icono;
                          const activo = pathname === enlace.href;

                          return (
                            <Link
                              key={enlace.href}
                              href={enlace.href}
                              aria-current={activo ? "page" : undefined}
                              onClick={() => setSidebarAbierto(false)}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all group outline-none focus-visible:ring-1 focus-visible:ring-[#0066b1] ${
                                activo
                                  ? "bg-[#0066b1] text-white shadow-xs shadow-[#0066b1]/30"
                                  : "text-[#a3a3a3] hover:text-white hover:bg-[#18181b]"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Icono
                                  className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                    activo
                                      ? "text-white"
                                      : enlace.destacado
                                      ? "text-[#0066b1] group-hover:text-white"
                                      : "text-[#737373] group-hover:text-white"
                                  }`}
                                />
                                <span className="truncate">{enlace.etiqueta}</span>
                              </div>

                              {enlace.href === "/app/live" && (
                                <span
                                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    activo ? "bg-white" : "bg-[#00E676] animate-pulse"
                                  }`}
                                  title="Canal en vivo @ 60 Hz"
                                />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {indiceGrupo < GRUPOS_NAVEGACION.length - 1 && (
                      <div className="pt-2 border-b border-[#1c1c1f]" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Info de Licencia sutil en Modo Expandido */}
            <div className="px-3.5 py-2 text-[10px] text-[#555555] font-mono truncate">
              Licencia: {usuario.alias}
            </div>
          </div>

          {/* MODO COLAPSADO: Solo se muestra en desktop cuando sidebarColapsado es true */}
          {sidebarColapsado && (
            <div className="hidden md:flex flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden py-3 px-2">
              <div className="flex flex-col items-center space-y-3">
                {GRUPOS_NAVEGACION.map((grupo, indiceGrupo) => {
                  return (
                    <div
                      key={grupo.id}
                      className="w-full flex flex-col items-center space-y-1.5"
                    >
                      {grupo.enlaces.map((enlace) => {
                        const Icono = enlace.icono;
                        const activo = pathname === enlace.href;

                        return (
                          <Link
                            key={enlace.href}
                            href={enlace.href}
                            title={`${enlace.etiqueta} — ${enlace.descripcion}`}
                            aria-label={enlace.etiqueta}
                            aria-current={activo ? "page" : undefined}
                            className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all group outline-none focus-visible:ring-1 focus-visible:ring-[#0066b1] ${
                              activo
                                ? "bg-[#0066b1] text-white shadow-xs shadow-[#0066b1]/30"
                                : "text-[#8e8e93] hover:text-white hover:bg-[#18181b]"
                            }`}
                          >
                            <Icono
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                activo
                                  ? "text-white"
                                  : enlace.destacado
                                  ? "text-[#0066b1] group-hover:text-white"
                                  : "text-[#737373] group-hover:text-white"
                              }`}
                            />

                            {enlace.href === "/app/live" && (
                              <span
                                className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${
                                  activo ? "bg-white" : "bg-[#00E676] animate-pulse"
                                }`}
                                title="Canal en vivo @ 60 Hz"
                              />
                            )}
                          </Link>
                        );
                      })}

                      {indiceGrupo < GRUPOS_NAVEGACION.length - 1 && (
                        <div className="w-6 border-b border-[#222226] my-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botón de Colapsar Sidebar en el Margen Inferior */}
          <div className="border-t border-[#262626] bg-[#09090b] p-2">
            <button
              type="button"
              onClick={alternarColapsoSidebar}
              title={sidebarColapsado ? "Expandir barra lateral" : "Colapsar barra lateral"}
              aria-label={sidebarColapsado ? "Expandir barra lateral" : "Colapsar barra lateral"}
              className={`w-full flex items-center rounded-lg text-xs font-mono font-bold text-[#88888e] hover:text-white hover:bg-[#18181b] transition-all cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#0066b1] select-none ${
                sidebarColapsado
                  ? "justify-center h-10 px-0"
                  : "justify-between px-3 py-2.5"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {sidebarColapsado ? (
                  <PanelLeft className="w-4 h-4 text-[#0066b1]" />
                ) : (
                  <PanelLeftClose className="w-4 h-4 text-[#737373]" />
                )}
                {!sidebarColapsado && (
                  <span className="uppercase tracking-wider text-[11px] text-[#a3a3a3]">
                    Colapsar barra
                  </span>
                )}
              </div>

              {!sidebarColapsado && (
                <span className="text-[10px] text-[#555555] font-mono">v2.4</span>
              )}
            </button>
          </div>
        </aside>

        {/* Contenido Dinámico con Proveedor de Sidebar */}
        <SidebarProvider
          sidebarColapsado={sidebarColapsado}
          alternarColapsoSidebar={alternarColapsoSidebar}
        >
          <main className="flex-1 overflow-y-auto bg-black p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}
