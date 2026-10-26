"use client";

import { useState, useMemo } from 'react';
import { VUELTAS_MOCK_MONZA, generarTelemetriaMonza } from '@/lib/mockTelemetria';
import { SelectorVueltas } from '@/components/analisis/SelectorVueltas';
import { GraficoTelemetria } from '@/components/analisis/GraficoTelemetria';
import { MapaCircuitoCanvas } from '@/components/analisis/MapaCircuitoCanvas';
import { Database, Flag, Gauge } from 'lucide-react';

export default function PaginaAnalisis() {
  // Estado de las vueltas seleccionadas: Vuelta A (Base) y Vuelta B (Comparativa)
  const [vueltaAId, setVueltaAId] = useState<string | null>('lap-monza-04');
  const [vueltaBId, setVueltaBId] = useState<string | null>('lap-monza-02');

  // Estado sincronizado de cursor/distancia activa (compartido entre Mapa 2D y Gráficos)
  const [distanciaActiva, setDistanciaActiva] = useState<number | null>(0);

  // Vuelta activa a mostrar en el mapa de calor 2D (Vuelta A o Vuelta B)
  const [ranuraMapa, setRanuraMapa] = useState<'A' | 'B'>('A');

  const vueltas = VUELTAS_MOCK_MONZA;

  // Generamos o recuperamos las muestras para la Vuelta A
  const muestrasVueltaA = useMemo(() => {
    if (!vueltaAId) return [];
    // Vuelta 4 es la más rápida (factor 1.0)
    const factor = vueltaAId === 'lap-monza-04' ? 1.0 : 0.95;
    return generarTelemetriaMonza(factor);
  }, [vueltaAId]);

  // Generamos o recuperamos las muestras para la Vuelta B (si está seleccionada)
  const muestrasVueltaB = useMemo(() => {
    if (!vueltaBId) return undefined;
    // Factor de frenada ligeramente más conservador para vuelta comparativa
    return generarTelemetriaMonza(0.91);
  }, [vueltaBId]);

  const vueltaA = vueltas.find((v) => v.id === vueltaAId);
  const vueltaB = vueltas.find((v) => v.id === vueltaBId);

  // Si no hay vuelta B seleccionada, el mapa fuerza Vuelta A
  const ranuraEfectiva = vueltaB ? ranuraMapa : 'A';
  const muestrasMapa = ranuraEfectiva === 'B' && muestrasVueltaB ? muestrasVueltaB : muestrasVueltaA;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Encabezado de la Sesión */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-hairline pb-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-m-blue-light" />
            <h1 className="text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
              Análisis Post-Sesión & Comparador de Telemetría
            </h1>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold tracking-wider text-body-secondary uppercase">
            <span className="flex items-center gap-1.5 text-white">
              <Flag className="h-3.5 w-3.5 text-m-blue-light" />
              Autodromo Nazionale Monza
            </span>
            <span className="text-body-muted">•</span>
            <span className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-body-muted" />
              Ferrari 488 GT3
            </span>
            <span className="text-body-muted">•</span>
            <span className="flex items-center gap-1.5 text-telemetry-throttle">
              <Database className="h-3.5 w-3.5" />
              4 Vueltas Registradas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="border border-hairline bg-surface-card px-3 py-1 text-xs font-mono font-bold tracking-wider text-body-secondary uppercase">
            Assetto Corsa Relay
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Fila Superior: Selector de Vueltas (4 cols) y Mapa 2D de Circuito (8 cols) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Selector de Vueltas */}
          <div className="lg:col-span-4">
            <SelectorVueltas
              vueltas={vueltas}
              vueltaAId={vueltaAId}
              vueltaBId={vueltaBId}
              enSeleccionarVueltaA={setVueltaAId}
              enSeleccionarVueltaB={setVueltaBId}
            />
          </div>

          {/* Visualizador 2D de Circuitos con Mapa de Calor e Interacción */}
          <div className="lg:col-span-8">
            <MapaCircuitoCanvas
              muestras={muestrasMapa}
              muestrasComparativas={muestrasVueltaB}
              distanciaSeleccionada={distanciaActiva}
              onSeleccionarDistancia={setDistanciaActiva}
              nombreCircuito="Autodromo Nazionale Monza"
              longitudMetros={5793}
              vueltaAInfo={vueltaA ? {
                ranura: 'A',
                numeroVuelta: vueltaA.numeroVuelta,
                tiempoVueltaStr: vueltaA.tiempoVueltaStr,
              } : undefined}
              vueltaBInfo={vueltaB ? {
                ranura: 'B',
                numeroVuelta: vueltaB.numeroVuelta,
                tiempoVueltaStr: vueltaB.tiempoVueltaStr,
              } : undefined}
              ranuraActiva={ranuraEfectiva}
              onCambiarRanura={setRanuraMapa}
            />
          </div>
        </div>

        {/* Fila Inferior: Gráficos de Telemetría Sincronizados a ancho completo (12 cols) */}
        <div>
          <GraficoTelemetria
            muestrasVueltaA={muestrasVueltaA}
            muestrasVueltaB={muestrasVueltaB}
            nombreVueltaA={vueltaA ? `V${vueltaA.numeroVuelta} (${vueltaA.tiempoVueltaStr})` : 'Vuelta A'}
            nombreVueltaB={vueltaB ? `V${vueltaB.numeroVuelta} (${vueltaB.tiempoVueltaStr})` : undefined}
            distanciaActiva={distanciaActiva}
            onHoverDistancia={setDistanciaActiva}
          />
        </div>
      </div>
    </div>
  );
}
