"use client";

import { PanelLeft, PanelLeftClose } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

interface BotonColapsarSidebarProps {
  className?: string;
}

export function BotonColapsarSidebar({ className = "" }: BotonColapsarSidebarProps) {
  const { sidebarColapsado, alternarColapsoSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={alternarColapsoSidebar}
      title={sidebarColapsado ? "Expandir barra lateral" : "Colapsar barra lateral en iconos"}
      aria-label={sidebarColapsado ? "Expandir barra lateral" : "Colapsar barra lateral en iconos"}
      className={`hidden md:inline-flex items-center justify-center p-2 rounded-lg text-[#8e8e93] hover:text-white hover:bg-white/[0.04] border border-[#262626] hover:border-[#3c3c3c] transition-colors cursor-pointer shrink-0 ${className}`}
    >
      {sidebarColapsado ? (
        <PanelLeft className="w-4 h-4 text-[#0066b1]" />
      ) : (
        <PanelLeftClose className="w-4 h-4" />
      )}
    </button>
  );
}
