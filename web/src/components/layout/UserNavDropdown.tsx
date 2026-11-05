"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Trophy,
  Car,
  FolderClock,
  ShieldCheck,
} from "lucide-react";
import type { PerfilUsuario } from "@/types/usuario";
import { Badge } from "@/components/ui/Badge";

export interface UserNavDropdownProps {
  usuario: PerfilUsuario;
  onCerrarSesion: () => void;
}

export function UserNavDropdown({
  usuario,
  onCerrarSesion,
}: UserNavDropdownProps) {
  const [abierto, setAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const iniciales = usuario.nombre
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const esF1 = usuario.rating.nivel.toLowerCase().includes("f1");

  useEffect(() => {
    const manejarClickFuera = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };

    const manejarTeclaEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
      }
    };

    if (abierto) {
      document.addEventListener("mousedown", manejarClickFuera);
      document.addEventListener("keydown", manejarTeclaEscape);
    }

    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
      document.removeEventListener("keydown", manejarTeclaEscape);
    };
  }, [abierto]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        aria-expanded={abierto}
        aria-haspopup="menu"
        aria-label="Menú de cuenta del piloto"
        className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] hover:border-[#3c3c3c] transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0066b1]"
      >
        {/* Avatar con anillo de categoría */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold text-white border-2 ${
            esF1
              ? "bg-[#0066b1]/25 border-[#0066b1]"
              : "bg-[#e22718]/25 border-[#e22718]"
          }`}
        >
          {iniciales}
        </div>

        <div className="hidden sm:flex flex-col items-start text-left">
          <span className="text-xs font-bold text-white leading-none">
            {usuario.nombre}
          </span>
          <span className="text-[10px] font-mono text-[#8a8a8a] mt-0.5 leading-none">
            {usuario.alias} · {usuario.rating.paceRating} iR
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#7e7e7e] transition-transform duration-150 ${
            abierto ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      {/* Menú Desplegable */}
      {abierto && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-72 bg-[#0d0d0d] border border-[#3c3c3c] rounded-xl shadow-2xl overflow-hidden z-50"
        >
          {/* Barra superior M Power */}
          <div className="h-1 w-full flex">
            <div className="h-full w-1/3 bg-[#0066b1]" />
            <div className="h-full w-1/3 bg-[#1c69d4]" />
            <div className="h-full w-1/3 bg-[#e22718]" />
          </div>

          {/* Cabecera de identidad del piloto */}
          <div className="p-4 border-b border-[#262626] bg-[#141414]/60">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {usuario.nombre}
                </p>
                <p className="text-xs font-mono text-[#8a8a8a] truncate">
                  {usuario.email}
                </p>
              </div>
              <Badge variant={esF1 ? "info" : "danger"}>{usuario.rating.nivel}</Badge>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#262626] flex items-center justify-between text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-[#bbbbbb]">
                <Car className="w-3.5 h-3.5 text-[#0066b1]" />
                <span className="truncate max-w-[140px]">
                  {usuario.vehiculoPrincipal}
                </span>
              </span>
              <span className="flex items-center gap-1 text-[#f4b400] font-bold">
                <Trophy className="w-3 h-3" />
                {usuario.puntajeGeneral.toFixed(1)} pts
              </span>
            </div>
          </div>

          {/* Enlaces de navegación de cuenta */}
          <div className="p-1.5 space-y-0.5">
            <Link
              href="/app/perfil"
              role="menuitem"
              onClick={() => setAbierto(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#cccccc] hover:text-white hover:bg-[#1a1a1a] transition-colors"
            >
              <User className="w-4 h-4 text-[#0066b1]" />
              <div className="flex flex-col">
                <span className="font-bold">Mi Perfil & Licencia</span>
                <span className="text-[10px] text-[#7e7e7e]">
                  Radar de 5 ejes, récords e insignias
                </span>
              </div>
            </Link>

            <Link
              href="/app/sessions"
              role="menuitem"
              onClick={() => setAbierto(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#cccccc] hover:text-white hover:bg-[#1a1a1a] transition-colors"
            >
              <FolderClock className="w-4 h-4 text-[#1c69d4]" />
              <div className="flex flex-col">
                <span className="font-bold">Mis Tandas Registradas</span>
                <span className="text-[10px] text-[#7e7e7e]">
                  {usuario.vueltasTotales} vueltas oficiales en base
                </span>
              </div>
            </Link>

            <Link
              href="/app/ajustes"
              role="menuitem"
              onClick={() => setAbierto(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#cccccc] hover:text-white hover:bg-[#1a1a1a] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#8a8a8a]" />
              <div className="flex flex-col">
                <span className="font-bold">Ajustes de Boxes</span>
                <span className="text-[10px] text-[#7e7e7e]">
                  Conexión Core Relay y notificaciones
                </span>
              </div>
            </Link>
          </div>

          {/* Pie de menú y Cierre de Sesión */}
          <div className="p-1.5 border-t border-[#262626] bg-black/40">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setAbierto(false);
                onCerrarSesion();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-[#ff6b6b] hover:text-white hover:bg-[#e22718] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4" />
                Cerrar Sesión en Boxes
              </span>
              <span className="text-[10px] font-mono opacity-75">Salir</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
