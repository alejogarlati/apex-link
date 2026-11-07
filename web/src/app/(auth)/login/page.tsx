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
  UserPlus,
  User,
  Tag,
} from "lucide-react";
import {
  iniciarSesionConServidor,
  registrarPilotoConServidor,
  enviarCodigoRecuperacion,
  restablecerPasswordConCodigo,
  estaAutenticado,
} from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/context/ToastContext";

type ModoAcceso = "login" | "registro";

export default function PaginaLogin() {
  const router = useRouter();
  const toast = useToast();

  const [modo, setModo] = useState<ModoAcceso>("login");

  // Estado Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordarSesion, setRecordarSesion] = useState(true);

  // Estado Registro
  const [nombreRegistro, setNombreRegistro] = useState("");
  const [aliasRegistro, setAliasRegistro] = useState("");
  const [emailRegistro, setEmailRegistro] = useState("");
  const [passwordRegistro, setPasswordRegistro] = useState("");
  const [confirmarPasswordRegistro, setConfirmarPasswordRegistro] = useState("");

  // Estado común y Recuperación de Contraseña (SMTP 2 pasos)
  const [estaCargando, setEstaCargando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [mostrarRecupero, setMostrarRecupero] = useState(false);
  const [emailRecupero, setEmailRecupero] = useState("");
  const [recuperoEnviado, setRecuperoEnviado] = useState(false);
  const [codigoRecupero, setCodigoRecupero] = useState("");
  const [nuevaPasswordRecupero, setNuevaPasswordRecupero] = useState("");
  const [confirmarNuevaPasswordRecupero, setConfirmarNuevaPasswordRecupero] = useState("");

  // Si ya hay sesión activa, redirigir directamente a /app (salvo que venga a registrar nuevo piloto)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("modo") === "registro") {
      setModo("registro");
      return;
    }

    if (estaAutenticado()) {
      router.replace("/app");
    }
  }, [router]);

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

  const manejarSubmitRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);

    const nombreLimpio = nombreRegistro.trim();
    const aliasLimpio = aliasRegistro.trim().toUpperCase();
    const emailLimpio = emailRegistro.trim().toLowerCase();

    if (nombreLimpio.length < 2) {
      setErrorGeneral("Ingresá el nombre y apellido del piloto (mínimo 2 caracteres).");
      return;
    }

    if (aliasLimpio.length < 2 || aliasLimpio.length > 20) {
      setErrorGeneral("El alias de telemetría debe tener entre 2 y 20 caracteres (ej. FC43).");
      return;
    }

    if (!emailLimpio.includes("@") || !emailLimpio.includes(".")) {
      setErrorGeneral("Ingresá una dirección de correo electrónico válida.");
      return;
    }

    if (passwordRegistro.length < 6) {
      setErrorGeneral("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (passwordRegistro !== confirmarPasswordRegistro) {
      setErrorGeneral("Las contraseñas ingresadas no coinciden.");
      return;
    }

    setEstaCargando(true);
    try {
      const resultado = await registrarPilotoConServidor({
        nombre: nombreLimpio,
        alias: aliasLimpio,
        email: emailLimpio,
        password: passwordRegistro,
        nacionalidad: "Argentina",
        codigoPais: "ARG",
      });

      if (!resultado.exitoso || !resultado.sesion) {
        setErrorGeneral(
          resultado.error || "No se pudo completar el registro del piloto."
        );
        toast.error("Error en el registro", resultado.error || "Verificá los datos");
        return;
      }

      toast.success(
        `Licencia emitida para ${resultado.sesion.usuario.nombre}`,
        `Piloto [${resultado.sesion.usuario.alias}] activo en cabina`
      );
      router.push("/app");
    } catch {
      setErrorGeneral(
        "No se pudo establecer comunicación con el servidor de registro."
      );
    } finally {
      setEstaCargando(false);
    }
  };

  const manejarSolicitudRecupero = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);

    const emailLimpio = emailRecupero.trim().toLowerCase();
    if (!emailLimpio || !emailLimpio.includes("@")) {
      setErrorGeneral("Ingresá el correo electrónico válido de tu cuenta.");
      return;
    }

    setEstaCargando(true);
    try {
      const resultado = await enviarCodigoRecuperacion(emailLimpio);
      if (!resultado.exitoso) {
        setErrorGeneral(resultado.mensaje);
        toast.error("No se pudo enviar el código", resultado.mensaje);
        return;
      }

      setRecuperoEnviado(true);
      toast.success("Código enviado por Gmail SMTP", resultado.mensaje);
    } finally {
      setEstaCargando(false);
    }
  };

  const manejarConfirmarRecupero = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);

    if (codigoRecupero.trim().length !== 6) {
      setErrorGeneral("El código recibido por correo debe tener 6 dígitos.");
      return;
    }

    if (nuevaPasswordRecupero.length < 6) {
      setErrorGeneral("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (nuevaPasswordRecupero !== confirmarNuevaPasswordRecupero) {
      setErrorGeneral("Las contraseñas ingresadas no coinciden.");
      return;
    }

    setEstaCargando(true);
    try {
      const resultado = await restablecerPasswordConCodigo({
        email: emailRecupero,
        codigo: codigoRecupero,
        nuevaPassword: nuevaPasswordRecupero,
      });

      if (!resultado.exitoso) {
        setErrorGeneral(resultado.mensaje);
        toast.error("Error de verificación", resultado.mensaje);
        return;
      }

      toast.success("Contraseña actualizada", resultado.mensaje);
      setEmail(emailRecupero.trim());
      setPassword("");
      setMostrarRecupero(false);
      setRecuperoEnviado(false);
      setCodigoRecupero("");
      setNuevaPasswordRecupero("");
      setConfirmarNuevaPasswordRecupero("");
      setModo("login");
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-[#0066b1]">
      {/* Barra de Acento Tricolor BMW M (4px) */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#0066b1]" />
        <div className="h-full w-1/3 bg-[#1c69d4]" />
        <div className="h-full w-1/3 bg-[#e22718]" />
      </div>

      {/* Navegación Superior (Limpia, sin estado del servidor) */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#262626] bg-[#0d0d0d]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#bbbbbb] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center px-2.5 py-1 bg-[#141414] border border-[#3c3c3c] rounded">
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

      {/* Contenedor Central: Dos Cards (Logo ApexLink a la izquierda, Login a la derecha) */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Card Izquierda: Logo y Presentación ApexLink */}
          <div className="w-full bg-[#0d0d0d] border border-[#3c3c3c] shadow-2xl rounded-xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Acento decorativo M tricolor de esquina */}
            <div className="absolute top-0 right-0 w-32 h-1 flex">
              <div className="h-full w-1/3 bg-[#0066b1]" />
              <div className="h-full w-1/3 bg-[#1c69d4]" />
              <div className="h-full w-1/3 bg-[#e22718]" />
            </div>

            <div className="space-y-6">
              {/* Badge superior */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#262626] text-[10px] font-mono uppercase tracking-[0.2em] text-[#bbbbbb]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066b1] animate-pulse" />
                Pitwall & Telemetry Core
              </div>

              {/* Logo ApexLink */}
              <div className="space-y-4">
                <Image
                  src="/logos/logo.webp"
                  alt="ApexLink Telemetry"
                  width={240}
                  height={48}
                  priority
                  className="h-9 sm:h-11 w-auto object-contain"
                />
                <div className="h-0.5 w-16 bg-[#e22718]" />
              </div>

              {/* Copy principal */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                  Ingeniería de Pista y Telemetría en Tiempo Real
                </h2>
                <p className="text-xs sm:text-sm text-[#bbbbbb] leading-relaxed">
                  Conectá tu cabina de simulación, monitoreá los parámetros críticos de pista y analizá tus deltas de vuelta con precisión milimétrica a 60 Hz.
                </p>
              </div>

              {/* Capacidades destacadas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-black/60 border border-[#262626] rounded-lg space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#0066b1] font-bold tracking-wider">
                    Muro de Boxes
                  </span>
                  <p className="text-xs text-white font-medium">Relay en Vivo 60 Hz</p>
                </div>
                <div className="p-3.5 bg-black/60 border border-[#262626] rounded-lg space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#e22718] font-bold tracking-wider">
                    Análisis Delta
                  </span>
                  <p className="text-xs text-white font-medium">Comparativa Métrica</p>
                </div>
              </div>
            </div>

            {/* Footer de la Card Izquierda */}
            <div className="pt-8 mt-6 border-t border-[#262626] flex items-center justify-between text-[11px] font-mono text-[#7e7e7e]">
              <span>Plataforma Oficial ApexLink</span>
              <span className="text-[#0fa336] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0fa336]" />
                Cabina Conectada
              </span>
            </div>
          </div>

          {/* Card Derecha: Formulario de Login / Registro */}
          <div className="w-full bg-[#0d0d0d] border border-[#3c3c3c] shadow-2xl overflow-hidden rounded-xl flex flex-col justify-between">
            {/* Header de la Tarjeta */}
            <div className="p-6 border-b border-[#262626] bg-[#141414]/60">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-black border border-[#3c3c3c] rounded-xl text-[#0066b1] shadow-inner">
                  {modo === "login" ? (
                    <Gauge className="w-6 h-6 text-[#0066b1]" />
                  ) : (
                    <UserPlus className="w-6 h-6 text-[#e22718]" />
                  )}
                </div>
                <div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${
                      modo === "login" ? "text-[#0066b1]" : "text-[#e22718]"
                    }`}
                  >
                    {modo === "login" ? "Autenticación de Piloto" : "Alta de Licencia Oficial"}
                  </span>
                  <h1 className="text-xl font-bold uppercase tracking-tight text-white">
                    {modo === "login" ? "Acceso a Muro de Boxes" : "Registrar Nuevo Piloto"}
                  </h1>
                </div>
              </div>

              {/* Selector de Pestañas Login / Registro */}
              {!mostrarRecupero && (
                <div className="grid grid-cols-2 gap-1.5 p-1 mt-5 bg-black border border-[#262626] rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setModo("login");
                      setErrorGeneral(null);
                    }}
                    className={`py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                      modo === "login"
                        ? "bg-[#0066b1] text-white shadow"
                        : "text-[#8a8a8a] hover:text-white"
                    }`}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModo("registro");
                      setErrorGeneral(null);
                    }}
                    className={`py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                      modo === "registro"
                        ? "bg-[#e22718] text-white font-bold shadow-md shadow-[#e22718]/25"
                        : "text-[#8a8a8a] hover:text-white"
                    }`}
                  >
                    Registrar Piloto
                  </button>
                </div>
              )}
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
                        {modo === "login" ? "Fallo de Autenticación" : "Error de Registro"}
                      </p>
                      <p className="leading-relaxed">{errorGeneral}</p>
                    </div>
                  </div>
                )}

                {modo === "login" ? (
                  <>
                    {/* Formulario de Inicio de Sesión */}
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
                  </>
                ) : (
                  /* Formulario de Registro de Nuevo Piloto (BCrypt en Backend + PostgreSQL) */
                  <form onSubmit={manejarSubmitRegistro} className="space-y-4" noValidate>
                    <Input
                      label="Nombre y Apellido"
                      type="text"
                      value={nombreRegistro}
                      onChange={(e) => {
                        setNombreRegistro(e.target.value);
                        if (errorGeneral) setErrorGeneral(null);
                      }}
                      placeholder="ej: Franco Colapinto"
                      leftIcon={<User className="w-4 h-4" />}
                      autoComplete="name"
                      required
                    />

                    <Input
                      label="Alias de Telemetría (Tag de Clasificación)"
                      type="text"
                      value={aliasRegistro}
                      onChange={(e) => {
                        setAliasRegistro(e.target.value.toUpperCase());
                        if (errorGeneral) setErrorGeneral(null);
                      }}
                      placeholder="ej: COL43"
                      leftIcon={<Tag className="w-4 h-4" />}
                      maxLength={20}
                      required
                      mono
                    />

                    <Input
                      label="Correo Electrónico"
                      type="email"
                      value={emailRegistro}
                      onChange={(e) => {
                        setEmailRegistro(e.target.value);
                        if (errorGeneral) setErrorGeneral(null);
                      }}
                      placeholder="piloto@apexlink.io"
                      leftIcon={<Mail className="w-4 h-4" />}
                      autoComplete="email"
                      required
                      mono
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Contraseña"
                        type="password"
                        value={passwordRegistro}
                        onChange={(e) => {
                          setPasswordRegistro(e.target.value);
                          if (errorGeneral) setErrorGeneral(null);
                        }}
                        placeholder="Mín. 6 caracteres"
                        leftIcon={<KeyRound className="w-4 h-4" />}
                        autoComplete="new-password"
                        required
                      />

                      <Input
                        label="Confirmar Clave"
                        type="password"
                        value={confirmarPasswordRegistro}
                        onChange={(e) => {
                          setConfirmarPasswordRegistro(e.target.value);
                          if (errorGeneral) setErrorGeneral(null);
                        }}
                        placeholder="Repetir contraseña"
                        leftIcon={<Lock className="w-4 h-4" />}
                        autoComplete="new-password"
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={estaCargando}
                        loadingText="Cifrando con BCrypt y registrando..."
                        leftIcon={<UserPlus className="w-4 h-4 text-white" />}
                        className="bg-[#e22718] hover:bg-[#c91f12] text-white border-[#e22718] hover:border-[#c91f12] shadow-md shadow-[#e22718]/25"
                      >
                        Crear Licencia e Ingresar a Cabina
                      </Button>
                    </div>
                  </form>
                )}

                <div className="pt-1 flex items-center justify-center gap-4 text-[11px] text-[#7e7e7e] font-mono">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0fa336]" />
                    PostgreSQL + BCrypt
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0066b1]" />
                    Auto Check-In Cabina
                  </span>
                </div>
              </div>
            ) : (
              /* Vista de Recuperación de Contraseña por Correo (Gmail SMTP + Código 6 Dígitos + BCrypt) */
              <div className="p-6 space-y-5">
                <div className="space-y-1">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                    Recuperación de Contraseña
                  </h2>
                  <p className="text-xs text-[#bbbbbb] leading-relaxed">
                    {!recuperoEnviado
                      ? "Ingresá el correo electrónico asociado a tu licencia de piloto. Te enviaremos un código de 6 dígitos válido por 15 minutos."
                      : `Ingresá el código de 6 dígitos enviado a ${emailRecupero} y definí tu nueva clave de boxes.`}
                  </p>
                </div>

                {errorGeneral && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-lg bg-[#e22718]/10 border border-[#e22718]/40 flex items-start gap-3 text-xs text-[#ff8080]"
                  >
                    <AlertCircle className="w-4 h-4 text-[#e22718] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{errorGeneral}</p>
                  </div>
                )}

                {recuperoEnviado ? (
                  <form onSubmit={manejarConfirmarRecupero} className="space-y-4">
                    <div className="p-3 rounded-lg bg-[#0fa336]/10 border border-[#0fa336]/40 flex items-center gap-2 text-xs text-[#00E676] font-mono">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Código enviado a {emailRecupero}</span>
                    </div>

                    <Input
                      label="Código de 6 Dígitos (Recibido por Email)"
                      type="text"
                      value={codigoRecupero}
                      onChange={(e) => {
                        setCodigoRecupero(e.target.value.replace(/\D/g, "").slice(0, 6));
                        if (errorGeneral) setErrorGeneral(null);
                      }}
                      placeholder="123456"
                      leftIcon={<Tag className="w-4 h-4" />}
                      maxLength={6}
                      required
                      mono
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Nueva Contraseña"
                        type="password"
                        value={nuevaPasswordRecupero}
                        onChange={(e) => {
                          setNuevaPasswordRecupero(e.target.value);
                          if (errorGeneral) setErrorGeneral(null);
                        }}
                        placeholder="Mín. 6 caracteres"
                        leftIcon={<KeyRound className="w-4 h-4" />}
                        required
                      />

                      <Input
                        label="Confirmar Clave"
                        type="password"
                        value={confirmarNuevaPasswordRecupero}
                        onChange={(e) => {
                          setConfirmarNuevaPasswordRecupero(e.target.value);
                          if (errorGeneral) setErrorGeneral(null);
                        }}
                        placeholder="Repetir contraseña"
                        leftIcon={<Lock className="w-4 h-4" />}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      isLoading={estaCargando}
                      loadingText="Verificando código y actualizando..."
                    >
                      Restablecer Contraseña con BCrypt
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={manejarSolicitudRecupero} className="space-y-4">
                    <Input
                      label="Correo Electrónico Registrado"
                      type="email"
                      value={emailRecupero}
                      onChange={(e) => {
                        setEmailRecupero(e.target.value);
                        if (errorGeneral) setErrorGeneral(null);
                      }}
                      placeholder="piloto@gmail.com"
                      leftIcon={<Mail className="w-4 h-4" />}
                      required
                      mono
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      isLoading={estaCargando}
                      loadingText="Despachando correo por Gmail SMTP..."
                    >
                      Enviar Código de 6 Dígitos
                    </Button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMostrarRecupero(false);
                    setRecuperoEnviado(false);
                    setErrorGeneral(null);
                  }}
                  className="w-full py-2 text-xs font-mono font-bold uppercase text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
                >
                  ← Volver al Inicio de Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#262626] text-center text-xs text-[#7e7e7e] font-mono bg-[#0d0d0d]">
        ApexLink Pitwall © 2026 • Plataforma de Telemetría e Ingeniería de Pista
      </footer>
    </div>
  );
}
