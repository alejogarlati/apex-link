import Link from 'next/link';
import { Activity, BarChart3, Database, User } from 'lucide-react';

/**
 * Barra de navegación superior con diseño BMW M Motorsport.
 * Muestra el logo con la franja M tricolor y los enlaces principales de navegación.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas/90 backdrop-blur-md">
      {/* Franja M Tricolor superior característica de BMW M */}
      <div className="flex h-1 w-full">
        <div className="h-full w-1/3 bg-m-blue-light" />
        <div className="h-full w-1/3 bg-m-blue-dark" />
        <div className="h-full w-1/3 bg-m-red" />
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Identidad de la marca */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <span className="font-mono text-xl font-bold tracking-widest text-white uppercase">
              APEX<span className="text-m-blue-light">LINK</span>
            </span>
            <span className="rounded border border-hairline bg-surface-card px-2 py-0.5 text-xs font-semibold tracking-wider text-body-secondary uppercase">
              Dev 3
            </span>
          </Link>
        </div>

        {/* Enlaces de navegación */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/analysis"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold tracking-wider uppercase text-body-secondary transition-colors hover:bg-surface-card hover:text-white"
          >
            <BarChart3 className="h-4 w-4 text-m-blue-light" />
            <span>Análisis Telemetría</span>
          </Link>

          <Link
            href="/sessions"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold tracking-wider uppercase text-body-secondary transition-colors hover:bg-surface-card hover:text-white"
          >
            <Database className="h-4 w-4 text-body-muted" />
            <span>Sesiones</span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-md border border-hairline bg-surface-card px-3 py-1.5 text-xs font-bold tracking-wider uppercase text-white transition-colors hover:bg-surface-elevated hover:border-m-blue-light"
          >
            <User className="h-4 w-4 text-m-blue-light" />
            <span>Perfil Piloto</span>
          </Link>

          <div
            title="Módulo en pausa según definición de producto"
            className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-2 text-xs font-bold tracking-wider uppercase text-body-muted opacity-50"
          >
            <Activity className="h-4 w-4" />
            <span>Live Pitwall (Pausado)</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
