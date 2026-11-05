"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorGlobal({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ApexLink Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-[#e22718]">
      {/* Barra Tricolor M */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#0066b1]" />
        <div className="h-full w-1/3 bg-[#1c69d4]" />
        <div className="h-full w-1/3 bg-[#e22718]" />
      </div>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-[#141414] border border-[#3c3c3c] rounded-xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#e22718]/15 border border-[#e22718]/40 text-[#e22718] flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#e22718]">
            Código de Falla en Boxes
          </span>

          <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight text-white">
            Anomalía en la Interfaz de Telemetría
          </h1>

          <p className="mt-3 text-xs text-[#bbbbbb] leading-relaxed">
            Ocurrió una interrupción inesperada al procesar los datos de esta vista. El motor de adquisición sigue intacto; podés reintentar la sincronización o regresar al muro de boxes.
          </p>

          {error.message && (
            <div className="mt-4 p-3 rounded-lg bg-black border border-[#262626] text-left font-mono text-[11px] text-[#ff6b6b] overflow-x-auto">
              {error.message}
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              onClick={reset}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Reintentar Conexión
            </Button>

            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#1a1a1a] hover:bg-[#262626] border border-[#3c3c3c] text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              Ir al Dashboard
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs font-mono text-[#7e7e7e] border-t border-[#262626]">
        ApexLink Pitwall System • Diagnóstico de Resiliencia
      </footer>
    </div>
  );
}
