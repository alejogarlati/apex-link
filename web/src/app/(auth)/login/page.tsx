"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gauge, Zap, CheckCircle2, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
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

  // Verificar estado del servidor Kestrel Dev 1 de fondo
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
      {/* Barra de Acento Tricolor BMW M */}
      <div className="h-1.5 w-full flex">
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
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#1a1a1a] border border-[#3c3c3c] text-[#bbbbbb]">
            FAPPE 2026 Edition
          </span>
          {estadoBackend.verificado && (
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded border ${
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
                ? `Kestrel Activo (${estadoBackend.circuito || "Monza"})`
                : "Modo Local Autónomo"}
            </span>
          )}
        </div>
      </header>

      {/* Contenedor Central */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#1a1a1a] border border-[#3c3c3c] rounded-lg shadow-2xl overflow-hidden">
          {/* Header de la Tarjeta */}
          <div className="p-6 border-b border-[#262626] bg-[#0d0d0d]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-black border border-[#3c3c3c]">
                <Gauge className="w-6 h-6 text-[#0066b1]" />
              </div>
              <div>
                <h1 className="text-xl font-bold uppercase tracking-tight text-white">
                  Apex<span className="text-[#0066b1]">Link</span> Pitwall
                </h1>
                <p className="text-xs text-[#7e7e7e]">
                  Autenticación de Ingeniería de Pista y Pilotos
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Opción Rápida Recomendada: 1-Click Stand FAPPE */}
            <div className="bg-black/60 border border-[#0066b1]/50 p-4 rounded-md space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0066b1] bg-[#0066b1]/10 px-2 py-0.5 rounded">
                    <Zap className="w-3 h-3" />
                    Acceso Rápido Oficial
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 uppercase">
                    Piloto Invitado FAPPE 2026
                  </h3>
                  <p className="text-xs text-[#bbbbbb]">
                    Entrada instantánea con telemetría precargada de Monza y telemetría a 60 Hz sin contraseñas.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={manejarLoginInvitado}
                disabled={estaCargando}
                className="w-full py-3 px-4 rounded font-bold uppercase tracking-wider text-xs bg-[#0066b1] hover:bg-[#1c69d4] text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0066b1]/20 active:scale-[0.99] cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                {estaCargando ? "Iniciando cabina..." : "Entrar como Piloto Invitado"}
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
                  Correo del Piloto / Ingeniero
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded bg-black border border-[#3c3c3c] text-sm text-white focus:outline-none focus:border-[#0066b1] transition-colors"
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
                  className="w-full px-3.5 py-2.5 rounded bg-black border border-[#3c3c3c] text-sm text-white focus:outline-none focus:border-[#0066b1] transition-colors uppercase font-mono"
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
                  className="w-full px-3.5 py-2.5 rounded bg-black border border-[#3c3c3c] text-sm text-white focus:outline-none focus:border-[#0066b1] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={estaCargando}
                className="w-full py-2.5 px-4 rounded font-bold uppercase tracking-wider text-xs bg-[#262626] hover:bg-[#3c3c3c] border border-[#3c3c3c] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
        ApexLink Pitwall © 2026 • Proyecto Académico de Ingeniería & SimRacing FAPPE
      </footer>
    </div>
  );
}
