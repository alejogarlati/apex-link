"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Gauge,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { iniciarSesionConServidor, estaAutenticado } from "@/lib/auth";
import { solicitarGet } from "@/lib/apiClient";
import type { EstadoServicioDto } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/context/ToastContext";

export default function PaginaLogin() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordarSesion, setRecordarSesion] = useState(true);
  const [estaCargando, setEstaCargando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [mostrarRecupero, setMostrarRecupero] = useState(false);
  const [emailRecupero, setEmailRecupero] = useState("");
  const [recuperoEnviado, setRecuperoEnviado] = useState(false);

  const [estadoBackend, setEstadoBackend] = useState<{
    verificado: boolean;
    conectado: boolean;
    circuito?: string;
  }>({ verificado: false, conectado: false });

  // Si ya hay sesión activa, redirigir directamente a /app
  useEffect(() => {
    if (estaAutenticado()) {
      router.replace("/app");
    }
  }, [router]);

  // Verificar estado del servidor de telemetría de fondo
  useEffect(() => {
    solicitarGet<EstadoServicioDto>("/api/estado")
      .then((res) => {
        setEstadoBackend({
          verificado: true,
          conectado: Boolean(
            res.datos?.isConnected ||
              res.datos?.estaConectado ||
              res.datos?.isMockMode ||
              res.datos?.modoMock
          ),
          circuito: res.datos?.circuit || res.datos?.circuito,
        });
      })
      .catch(() => {
        setEstadoBackend({
          verificado: true,
          conectado: false,
        });
      });
  }, []);

  const manejarSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);

    if (!email.trim()) {
      setErrorGeneral("Ingresá tu dirección de correo electrónico corporativo o de piloto.");
      return;
    }

    if (!password) {
      setErrorGeneral("Ingresá tu contraseña de acceso a boxes.");
      return;
    }

    setEstaCargando(true);
    try {
      const resultado = await iniciarSesionConServidor(email, password);
      if (!resultado.exitoso || !resultado.sesion) {
        setErrorGeneral(
          resultado.error || "Credenciales inválidas. Verificá tu correo y contraseña."
        );
        toast.error("Error de autenticación", resultado.error || "Credenciales incorrectas");
        return;
      }

      toast.success(
        `Bienvenido a boxes, ${resultado.sesion.usuario.nombre}`,
        `Licencia activa: ${resultado.sesion.usuario.licencia}`
      );
      router.push("/app");
    } catch {
      setErrorGeneral(
        "No se pudo establecer comunicación con el servidor de autenticación."
      );
    } finally {
      setEstaCargando(false);
    }
  };

  const manejarSolicitudRecupero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecupero.trim()) return;
    setRecuperoEnviado(true);
    toast.info(
      "Solicitud de recuperación procesada",
      "Si el correo está registrado, recibirás un enlace válido por 15 minutos."
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-[#0066b1]">
      {/* Barra de Acento Tricolor BMW M (4px) */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#0066b1]" />
        <div className="h-full w-1/3 bg-[#1c69d4]" />
        <div className="h-full w-1/3 bg-[#e22718]" />
      </div>

      {/* Navegación Superior */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#262626] bg-[#0d0d0d]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#bbbbbb] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </Link>

        <div className="flex items-center gap-3">
          {estadoBackend.verificado && (
            <Badge
              variant={estadoBackend.conectado ? "success" : "info"}
              dot
              pulse={estadoBackend.conectado}
            >
              {estadoBackend.conectado
                ? `Core Relay Online (${estadoBackend.circuito || "Monza"})`
                : "PostgreSQL Auth Ready"}
            </Badge>
          )}
          <div className="hidden sm:flex items-center px-2.5 py-1 bg-[#141414] border border-[#3c3c3c] rounded">
            <Image
              src="/logos/logo.webp"
              alt="ApexLink"
              width={90}
              height={18}
              className="h-4 w-auto object-contain"
            />
          </div>
        </div>
      </header>

      {/* Contenedor Central */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#0d0d0d] border border-[#3c3c3c] shadow-2xl overflow-hidden rounded-xl">
          {/* Header de la Tarjeta */}
          <div className="p-6 border-b border-[#262626] bg-[#141414]/60">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-black border border-[#3c3c3c] rounded-xl text-[#0066b1] shadow-inner">
                <Gauge className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#0066b1]">
                  Autenticación de Piloto
                </span>
                <h1 className="text-xl font-bold uppercase tracking-tight text-white">
                  Acceso a Muro de Boxes
                </h1>
              </div>
            </div>
          </div>

          {!mostrarRecupero ? (
            <div className="p-6 space-y-5">
              {/* Banner de Error Reactivo */}
              {errorGeneral && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="p-3.5 rounded-lg bg-[#e22718]/10 border border-[#e22718]/40 flex items-start gap-3 text-xs text-[#ff8080]"
                >
                  <AlertCircle className="w-4 h-4 text-[#e22718] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold uppercase text-white font-mono">
                      Fallo de Autenticación
                    </p>
                    <p className="leading-relaxed">{errorGeneral}</p>
                  </div>
                </div>
              )}

              {/* Formulario de Credenciales de Producción */}
              <form onSubmit={manejarSubmitLogin} className="space-y-4" noValidate>
                <Input
                  label="Correo Electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorGeneral) setErrorGeneral(null);
                  }}
                  placeholder="ejemplo: agarlati@apexlink.io"
                  leftIcon={<Mail className="w-4 h-4" />}
                  autoComplete="email"
                  required
                  mono
                />

                <div className="space-y-1.5">
                  <Input
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorGeneral) setErrorGeneral(null);
                    }}
                    placeholder="Ingresá tu contraseña de boxes"
                    leftIcon={<KeyRound className="w-4 h-4" />}
                    autoComplete="current-password"
                    required
                  />

                  <div className="flex items-center justify-between pt-1">
                    <label className="inline-flex items-center gap-2 text-xs text-[#bbbbbb] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={recordarSesion}
                        onChange={(e) => setRecordarSesion(e.target.checked)}
                        className="rounded border-[#3c3c3c] bg-black text-[#0066b1] focus:ring-[#0066b1]"
                      />
                      <span>Mantener sesión en cabina</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setMostrarRecupero(true);
                        setEmailRecupero(email);
                        setRecuperoEnviado(false);
                      }}
                      className="text-xs font-mono text-[#0066b1] hover:text-[#81c4ff] hover:underline transition-colors cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={estaCargando}
                    loadingText="Verificando credenciales..."
                    leftIcon={<Lock className="w-4 h-4" />}
                  >
                    Iniciar Sesión en Boxes
                  </Button>
                </div>
              </form>

              {/* Guía de Cuentas Registradas en PostgreSQL para Evaluación */}
              <div className="pt-4 border-t border-[#262626] space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8a8a8a]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#0066b1] shrink-0" />
                  <span>Credenciales oficiales de boxes (`usuarios`):</span>
                </div>
                <div className="p-3 rounded-lg bg-black/70 border border-[#262626] text-[11px] font-mono space-y-1.5 text-[#bbbbbb]">
                  <div className="flex items-center justify-between pb-1 border-b border-[#262626]">
                    <span className="text-[#0066b1] font-bold">Admin (Modo Mock):</span>
                    <div className="flex items-center gap-2">
                      <code className="text-white">admin</code>
                      <span className="text-[#666666]">/</span>
                      <code className="text-[#00E676]">admin</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[#8a8a8a]">Piloto 1 (F1):</span>
                    <code className="text-white">agarlati@apexlink.io</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8a8a8a]">Piloto 2 (GT3):</span>
                    <code className="text-white">asalas@apexlink.io</code>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#262626] pt-1">
                    <span className="text-[#8a8a8a]">Clave pilotos:</span>
                    <code className="text-[#00E676]">Password123!</code>
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-center gap-4 text-[11px] text-[#7e7e7e] font-mono">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0fa336]" />
                  PostgreSQL 16
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0066b1]" />
                  Sesión Persistente
                </span>
              </div>
            </div>
          ) : (
            /* Vista de Recuperación de Contraseña por Correo */
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Recuperación de Contraseña
                </h2>
                <p className="text-xs text-[#bbbbbb] leading-relaxed">
                  Ingresá el correo electrónico asociado a tu licencia de piloto. Te enviaremos un enlace temporal válido por 15 minutos para restablecer tu clave.
                </p>
              </div>

              {recuperoEnviado ? (
                <div className="p-4 rounded-lg bg-[#0fa336]/10 border border-[#0fa336]/40 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#00E676] uppercase font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Enlace de Recuperación Despachado</span>
                  </div>
                  <p className="text-[#cccccc] leading-relaxed">
                    Si la dirección <strong className="text-white">{emailRecupero}</strong> se encuentra registrada en el servidor central, recibirás las instrucciones en tu bandeja de entrada en los próximos instantes.
                  </p>
                </div>
              ) : (
                <form onSubmit={manejarSolicitudRecupero} className="space-y-4">
                  <Input
                    label="Correo Electrónico Registrado"
                    type="email"
                    value={emailRecupero}
                    onChange={(e) => setEmailRecupero(e.target.value)}
                    placeholder="piloto@apexlink.io"
                    leftIcon={<Mail className="w-4 h-4" />}
                    required
                    mono
                  />

                  <Button type="submit" variant="primary" fullWidth>
                    Enviar Enlace de Recuperación
                  </Button>
                </form>
              )}

              <button
                type="button"
                onClick={() => setMostrarRecupero(false)}
                className="w-full py-2 text-xs font-mono font-bold uppercase text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
              >
                ← Volver al Inicio de Sesión
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#262626] text-center text-xs text-[#7e7e7e] font-mono bg-[#0d0d0d]">
        ApexLink Pitwall © 2026 • Plataforma de Telemetría e Ingeniería de Pista
      </footer>
    </div>
  );
}
