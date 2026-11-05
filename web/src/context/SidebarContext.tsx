"use client";

import React, { createContext, useContext } from "react";

interface SidebarContextType {
  sidebarColapsado: boolean;
  alternarColapsoSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar debe ser utilizado dentro de un SidebarProvider");
  }
  return context;
}

export function SidebarProvider({
  children,
  sidebarColapsado,
  alternarColapsoSidebar,
}: {
  children: React.ReactNode;
  sidebarColapsado: boolean;
  alternarColapsoSidebar: () => void;
}) {
  return (
    <SidebarContext.Provider value={{ sidebarColapsado, alternarColapsoSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
