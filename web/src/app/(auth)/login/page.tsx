"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Gauge, Zap, CheckCircle2, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { iniciarSesionInvitado, iniciarSesionCredenciales } from "@/lib/auth";
import { solicitarGet } from "@/lib/apiClient";
import type { EstadoServicioDto } from "@/types/api";
import { MSlantedBadge } from "@/components/landing/MSlantedBadge";

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
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-[#e22718]">
      {/* Barra de Acento Tricolor BMW M (4px) */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#0066b1]" />
        <div className="h-full w-1/3 bg-[#1c69d4]" />
        <div className="h-full w-1/3 bg-[#e22718]" />
      </div>

      {/* Navegación Superior */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#262626]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#bbbbbb] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Inicio
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center px-2 py-1 bg-[#141414] border border-[#3c3c3c]">
            <Image
              src="/logos/logo.webp"
              alt="ApexLink"
              width={100}
              height={20}
              className="h-4 w-auto object-contain"
            />
          </div>
          {estadoBackend.verificado && (
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 border ${
                estadoBackend.conectado
                  ? "bg-[#0fa336]/10 border-[#0fa336]/30 text-[#0fa336]"
                  : "bg-[#7e7e7e]/10 border-[#3c3c3c] text-[#bbbbbb]"
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
        <div className="w-full max-w-md bg-[#0d0d0d] border border-[#3c3c3c] shadow-2xl overflow-hidden">
          {/* Header de la Tarjeta */}
          <div className="p-6 border-b border-[#262626] bg-black">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#141414] border border-[#3c3c3c]">
                <Gauge className="w-6 h-6 text-[#e22718]" />
              </div>
              <div>
                <h1 className="text-xl font-bold uppercase tracking-tight text-white font-mono">
                  Apex<span className="text-[#e22718]">Link</span> Pitwall
                </h1>
                <p className="text-xs text-[#7e7e7e]">
                  Acceso a Muro de Telemetría y Perfil de Piloto
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Opción Rápida Recomendada: 1-Click Acceso Directo */}
            <div className="bg-black border-2 border-[#e22718] p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#e22718] bg-[#e22718]/10 px-2 py-0.5">
                    <Zap className="w-3 h-3" />
                    Acceso Rápido Recomendado
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 uppercase">
                    Piloto de Pruebas
                  </h3>
                  <p className="text-xs text-[#bbbbbb]">
                    Entrada instantánea con telemetría de Monza y datos en tiempo real listos sin contraseñas.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={manejarLoginInvitado}
                disabled={estaCargando}
                className="w-full py-3 px-4 font-bold uppercase tracking-wider text-xs bg-[#e22718] hover:bg-[#c91f12] text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#e22718]/25 active:scale-[0.99] cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                {estaCargando ? "Iniciando cabina..." : "Entrar a Pista Ahora"}
              </button>
            </div>

            {/* Separador */}
            <div className="flex items-center gap-3 text-xs uppercase font-bold text-[#7e7e7e]">
              <div className="h-[1px] flex-1 bg-[#262626]" />
              <span>O con credenciales</span>
              <div className="h-[1px] flex-1 bg-[#262626]" />
            </div>

            {/* Formulario Tradicional */}
            <form onSubmit={manejarLoginCredenciales} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] mb-1.5">
                  Correo del Piloto
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-black border border-[#3c3c3c] text-sm text-white focus:outline-none focus:border-[#e22718] transition-colors"
                  placeholder="piloto@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] mb-1.5">
                  Alias en Pista
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-black border border-[#3c3c3c] text-sm text-white focus:outline-none focus:border-[#e22718] transition-colors uppercase font-mono"
                  placeholder="PILOTO_01"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] mb-1.5">
                  Contraseña de Boxes
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-black border border-[#3c3c3c] text-sm text-white focus:outline-none focus:border-[#e22718] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={estaCargando}
                className="w-full py-2.5 px-4 font-bold uppercase tracking-wider text-xs bg-[#141414] hover:bg-[#1f1f1f] border border-[#3c3c3c] hover:border-[#e22718] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#bbbbbb]" />
                Iniciar Sesión Registrada
              </button>
            </form>

            <div className="pt-2 flex items-center justify-center gap-4 text-xs text-[#7e7e7e]">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0fa336]" />
                Cifrado Local Seguro
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0066b1]" />
                Standalone Ready
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#262626] text-center text-xs text-[#7e7e7e]">
        ApexLink Pitwall © 2026 • Instrumental de Cabina y Telemetría SimRacing
      </footer>
    </div>
  );
}
