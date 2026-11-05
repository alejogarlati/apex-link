"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Zap, CheckCircle2, ArrowLeft, ShieldCheck, Lock, Gauge } from "lucide-react";
import { iniciarSesionInvitado, iniciarSesionCredenciales } from "@/lib/auth";
import { solicitarGet } from "@/lib/apiClient";
import type { EstadoServicioDto } from "@/types/api";

export default function PaginaLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("piloto@apexlink.io");
  const [alias, setAlias] = useState("PILOTO_BOXES");
  const [password, setPassword] = useState("••••••••");
  const [estaCargando, setEstaCargando] = useState(false);
  const [estadoBackend, setEstadoBackend] = useState<{
    verificado: boolean;
    conectado: boolean;
    circuito?: string;
  }>({ verificado: false, conectado: false });

  // Verificar estado del servidor de telemetría de fondo
  useEffect(() => {
    solicitarGet<EstadoServicioDto>("/api/estado")
      .then((res) => {
        setEstadoBackend({
          verificado: true,
          conectado: res.datos.estaConectado || res.datos.modoMock,
          circuito: res.datos.circuito,
        });
      })
      .catch(() => {
        setEstadoBackend({
          verificado: true,
          conectado: false,
        });
      });
  }, []);

  const manejarLoginInvitado = () => {
    setEstaCargando(true);
    iniciarSesionInvitado();
    setTimeout(() => {
      router.push("/hub");
    }, 300);
  };

  const manejarLoginCredenciales = (e: React.FormEvent) => {
    e.preventDefault();
    setEstaCargando(true);
    iniciarSesionCredenciales(email, alias);
    setTimeout(() => {
      router.push("/hub");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-[#0066b1]">
      {/* Barra de Acento Tricolor BMW M (4px) */}
      <div className="h-1 w-full flex sticky top-0 z-50">
        <div className="h-full w-1/3 bg-[#0066b1]" />
        <div className="h-full w-1/3 bg-[#1c69d4]" />
        <div className="h-full w-1/3 bg-[#e22718]" />
      </div>

      {/* Navegación Superior con Logo Oficial */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#262626] bg-[#0a0a0a]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#bbbbbb] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Inicio
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/logos/logo.webp"
              alt="ApexLink Logo"
              width={130}
              height={26}
              priority
              className="h-6 w-auto object-contain"
            />
          </Link>
          {estadoBackend.verificado && (
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 border ${
                estadoBackend.conectado
                  ? "bg-[#0fa336]/10 border-[#0fa336]/30 text-[#0fa336]"
                  : "bg-[#141414] border-[#3c3c3c] text-[#7e7e7e]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  estadoBackend.conectado ? "bg-[#0fa336] animate-pulse" : "bg-[#7e7e7e]"
                }`}
              />
              {estadoBackend.conectado
                ? `Telemetría Activa (${estadoBackend.circuito || "Monza"})`
                : "Modo Demostración"}
            </span>
          )}
        </div>
      </header>

      {/* Contenedor Central */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md card-cockpit-gradient border border-[#262626] rounded-none border-sheen shadow-2xl overflow-hidden bg-[#141414]">
          {/* Header de la Tarjeta */}
          <div className="p-6 border-b border-[#262626] bg-[#0d0d0d]">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-[#141414] border border-[#3c3c3c]">
                <Gauge className="w-6 h-6 text-[#0066b1]" />
              </div>
              <div>
                <h1 className="text-xl font-bold uppercase tracking-tight text-white font-mono">
                  ApexLink Pitwall
                </h1>
                <p className="text-xs text-[#7e7e7e] font-mono mt-0.5">
                  Acceso a Muro de Telemetría y Perfil de Piloto
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Opción Rápida Recomendada: 1-Click Acceso Directo */}
            <div className="bg-[#0d0d0d] border border-[#0066b1] p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0066b1] bg-[#0066b1]/10 px-2 py-0.5 border border-[#0066b1]/30">
                    <Zap className="w-3 h-3" />
                    Acceso Rápido Recomendado
                  </div>
                  <h3 className="text-sm font-bold text-white mt-2 uppercase font-mono">
                    Piloto de Pruebas
                  </h3>
                  <p className="text-xs text-[#bbbbbb] font-mono mt-1 leading-relaxed">
                    Entrada instantánea con telemetría de Monza y datos en tiempo real listos sin contraseñas.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={manejarLoginInvitado}
                disabled={estaCargando}
                className="w-full h-12 px-4 font-mono font-bold uppercase tracking-[0.15em] text-xs bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                {estaCargando ? "Iniciando cabina..." : "Entrar a Pista Ahora"}
              </button>
            </div>

            {/* Separador */}
            <div className="flex items-center gap-3 text-xs uppercase font-mono font-bold text-[#7e7e7e]">
              <div className="h-[1px] flex-1 bg-[#262626]" />
              <span>O con credenciales</span>
              <div className="h-[1px] flex-1 bg-[#262626]" />
            </div>

            {/* Formulario Tradicional */}
            <form onSubmit={manejarLoginCredenciales} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#bbbbbb] mb-1.5">
                  Correo del Piloto
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-black border border-[#3c3c3c] text-xs font-mono text-white focus:outline-none focus:border-[#0066b1] transition-colors rounded-none"
                  placeholder="piloto@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#bbbbbb] mb-1.5">
                  Alias en Pista
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-black border border-[#3c3c3c] text-xs font-mono text-white focus:outline-none focus:border-[#0066b1] transition-colors uppercase rounded-none"
                  placeholder="PILOTO_01"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#bbbbbb] mb-1.5">
                  Contraseña de Boxes
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-black border border-[#3c3c3c] text-xs font-mono text-white focus:outline-none focus:border-[#0066b1] transition-colors rounded-none"
                />
              </div>

              <button
                type="submit"
                disabled={estaCargando}
                className="w-full h-11 px-4 font-mono font-bold uppercase tracking-[0.15em] text-xs bg-[#1a1a1a] hover:bg-[#262626] border border-[#3c3c3c] hover:border-[#0066b1] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-none"
              >
                <Lock className="w-3.5 h-3.5 text-[#bbbbbb]" />
                Iniciar Sesión Registrada
              </button>
            </form>

            <div className="pt-2 flex items-center justify-center gap-4 text-xs font-mono text-[#7e7e7e]">
              <span className="inline-flex items-center gap-1 text-[#0fa336]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Cifrado Local Seguro
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-[#bbbbbb]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0066b1]" />
                Standalone Ready
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#262626] text-center text-xs font-mono text-[#7e7e7e]">
        ApexLink Pitwall © 2026 • Instrumental de Cabina y Telemetría SimRacing
      </footer>
    </div>
  );
}
