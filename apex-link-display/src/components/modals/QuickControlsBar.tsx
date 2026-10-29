import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { MockScenario } from '../../types/ddu';
import { Maximize2, Minimize2, Settings2 } from 'lucide-react';

interface Props {
  onOpenDiagnostics: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const QuickControlsBar: React.FC<Props> = ({
  onOpenDiagnostics,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const isMockActive = useTelemetryStore((s) => s.isMockActive);
  const mockScenario = useTelemetryStore((s) => s.mockScenario);
  const setMockScenario = useTelemetryStore((s) => s.setMockScenario);
  const setMockActive = useTelemetryStore((s) => s.setMockActive);
  const pitLimiterActive = useTelemetryStore((s) => s.pitLimiterActive);
  const isInPitLane = useTelemetryStore((s) => s.isInPitLane || s.mockScenario === 'PIT_LANE');
  const setPitLimiter = useTelemetryStore((s) => s.setPitLimiter);
  const setIsInPitLane = useTelemetryStore((s) => s.setIsInPitLane);
  const triggerLapCompleted = useTelemetryStore((s) => s.triggerLapCompleted);
  const currentLap = useTelemetryStore((s) => s.telemetry.timing.currentLap);

  const pills: { key: MockScenario; label: string }[] = [
    { key: 'RACE_STINT', label: '🏁 Monza Vuelta' },
    { key: 'RETTIFILO_BRAKING', label: '🛑 Frenada -2.8G' },
    { key: 'DRS_ZONE', label: '⚡ DRS 320km/h' },
    { key: 'CURVA_GRANDE_ACCEL', label: '🏎️ Curva 2.4G' },
    { key: 'PIT_LANE', label: '🅿️ Pit Limiter' },
  ];

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-md flex items-center gap-2 shadow-2xl font-mono text-[11px] opacity-70 hover:opacity-100 transition-opacity">
      <span className="text-[10px] text-zinc-500 font-black pl-1 uppercase">ESCENARIOS:</span>

      {pills.map((p) => {
        const isActive = isMockActive && mockScenario === p.key;
        return (
          <button
            key={p.key}
            onClick={() => {
              setMockActive(true);
              setMockScenario(p.key);
            }}
            className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
              isActive
                ? 'bg-purple-600 text-white shadow-[0_0_10px_#E040FB]'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {p.label}
          </button>
        );
      })}

      <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

      {/* Quick Pit Lane entry, Limiter toggle & Lap triggers */}
      <button
        onClick={() => {
          if (!isInPitLane) {
            setIsInPitLane(true);
            setPitLimiter(true);
          } else {
            setIsInPitLane(false);
            setPitLimiter(false);
          }
        }}
        title="Entrar o Salir de Boxes (Tecla P / O)"
        className={`px-2 py-0.5 rounded font-black transition-all cursor-pointer ${
          isInPitLane
            ? 'bg-amber-400 text-black shadow-[0_0_8px_#F59E0B]'
            : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800'
        }`}
      >
        🅿️ {isInPitLane ? 'BOXES [ON]' : 'BOXES [OFF]'}
      </button>

      {isInPitLane && (
        <button
          onClick={() => setPitLimiter(!pitLimiterActive)}
          title="Alternar Limitador de Boxes ON/OFF (Tecla P en boxes)"
          className={`px-2 py-0.5 rounded font-black transition-all cursor-pointer ${
            pitLimiterActive
              ? 'bg-cyan-400 text-black shadow-[0_0_8px_#00E5FF]'
              : 'bg-rose-600 text-white shadow-[0_0_8px_#EF4444] animate-pulse'
          }`}
        >
          {pitLimiterActive ? 'LIMITER ON' : 'LIMITER OFF'}
        </button>
      )}

      <button
        onClick={() => {
          triggerLapCompleted({
            type: 'LAP_COMPLETED',
            lapNumber: currentLap,
            lapTimeMs: 80890,
            lapTimeStr: '01:20.890',
            isPersonalBest: true,
            isValidLap: true,
            sectors: [27800, 27150, 25940],
            telemetrySamplesCount: 5120,
            sessionLapId: `lap-fastest-${Date.now()}`,
          });
        }}
        title="Disparar Overlay Vuelta Rápida (Tecla L)"
        className="px-2 py-0.5 rounded font-black bg-zinc-900/90 text-purple-400 hover:text-purple-300 hover:bg-zinc-800 transition-all cursor-pointer"
      >
        ⚡ PB [L]
      </button>

      <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

      {/* Diagnostics Modal Toggle Button */}
      <button
        onClick={onOpenDiagnostics}
        title="Abrir Panel de Diagnóstico y Calibración"
        className="p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
      >
        <Settings2 className="w-4 h-4" />
      </button>

      {/* Fullscreen Button */}
      <button
        onClick={onToggleFullscreen}
        title={isFullscreen ? 'Salir de Pantalla Completa' : 'Modo Kiosco Fullscreen'}
        className="p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  );
};
