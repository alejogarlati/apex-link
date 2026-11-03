import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { MockScenario } from '../../types/ddu';
import { Home, Maximize2, Minimize2, Settings2 } from 'lucide-react';
import { MSlantedBadge } from '../common/BmwMComponents';

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
  const setAppState = useTelemetryStore((s) => s.setAppState);
  const pitLimiterActive = useTelemetryStore((s) => s.pitLimiterActive);
  const isInPitLane = useTelemetryStore((s) => s.isInPitLane || s.mockScenario === 'PIT_LANE');
  const setPitLimiter = useTelemetryStore((s) => s.setPitLimiter);
  const setIsInPitLane = useTelemetryStore((s) => s.setIsInPitLane);
  const triggerLapCompleted = useTelemetryStore((s) => s.triggerLapCompleted);
  const currentLap = useTelemetryStore((s) => s.telemetry.timing.currentLap);

  const pills: { key: MockScenario; label: string }[] = [
    { key: 'RACE_STINT', label: '🏁 MONZA' },
    { key: 'RETTIFILO_BRAKING', label: '🛑 RETTIFILO -2.8G' },
    { key: 'DRS_ZONE', label: '⚡ DRS 320' },
    { key: 'CURVA_GRANDE_ACCEL', label: '🏎️ CURVA 2.4G' },
    { key: 'PIT_LANE', label: '🅿️ BOXES' },
  ];

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-none bg-[#0a0a0a]/95 border border-[#3c3c3c] backdrop-blur-md flex items-center gap-2.5 shadow-2xl font-mono text-[11px] opacity-80 hover:opacity-100 transition-opacity">
      <MSlantedBadge height="h-4" />

      {/* Botón Volver a STANDBY */}
      <button
        onClick={() => {
          setMockActive(false);
          setAppState('STANDBY');
        }}
        title="Volver a Pantalla Pre-Sesión (Standby)"
        className="px-3 py-1 rounded-none font-bold tracking-[0.1em] uppercase bg-[#141414] text-white hover:bg-[#e22718] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer border border-[#3c3c3c] hover:border-[#e22718]"
      >
        <Home className="w-3.5 h-3.5" />
        STANDBY
      </button>

      <div className="w-[1px] h-4 bg-[#262626] mx-0.5" />

      <span className="text-[10px] text-[#7e7e7e] font-bold tracking-[0.15em] uppercase">
        ESCENARIOS:
      </span>

      {pills.map((p) => {
        const isActive = isMockActive && mockScenario === p.key;
        return (
          <button
            key={p.key}
            onClick={() => {
              setMockActive(true);
              setMockScenario(p.key);
            }}
            className={`px-3 py-1 rounded-none font-bold tracking-wider uppercase transition-all cursor-pointer border ${
              isActive
                ? 'bg-[#e22718] border-[#e22718] text-white shadow-[0_0_10px_rgba(226,39,24,0.5)]'
                : 'bg-[#121212] border-[#262626] text-[#bbbbbb] hover:text-white hover:border-[#3c3c3c]'
            }`}
          >
            {p.label}
          </button>
        );
      })}

      <div className="w-[1px] h-4 bg-[#262626] mx-1" />

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
        className={`px-2.5 py-1 rounded-none font-bold tracking-wider uppercase transition-all cursor-pointer border ${
          isInPitLane
            ? 'bg-[#e22718] text-white border-[#e22718] shadow-[0_0_8px_#e22718]'
            : 'bg-[#121212] border-[#262626] text-[#bbbbbb] hover:text-white hover:border-[#3c3c3c]'
        }`}
      >
        🅿️ {isInPitLane ? 'BOXES [ON]' : 'BOXES [OFF]'}
      </button>

      {isInPitLane && (
        <button
          onClick={() => setPitLimiter(!pitLimiterActive)}
          title="Alternar Limitador de Boxes ON/OFF (Tecla P en boxes)"
          className={`px-2.5 py-1 rounded-none font-bold tracking-wider uppercase transition-all cursor-pointer border ${
            pitLimiterActive
              ? 'bg-[#e22718] text-white border-[#e22718] shadow-[0_0_8px_#e22718]'
              : 'bg-[#121212] border-[#3c3c3c] text-white'
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
        className="px-2.5 py-1 rounded-none font-bold tracking-wider uppercase bg-[#121212] border border-[#262626] text-[#e22718] hover:text-white hover:bg-[#e22718] hover:border-[#e22718] transition-all cursor-pointer"
      >
        ⚡ PB [L]
      </button>

      <div className="w-[1px] h-4 bg-[#262626] mx-1" />

      {/* Circular Diagnostics Button */}
      <button
        onClick={onOpenDiagnostics}
        title="Abrir Panel de Diagnóstico y Calibración"
        className="p-1.5 rounded-full bg-[#121212] hover:bg-[#1f1f1f] border border-[#3c3c3c] hover:border-[#e22718] text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
      >
        <Settings2 className="w-4 h-4" />
      </button>

      {/* Circular Fullscreen Button */}
      <button
        onClick={onToggleFullscreen}
        title={isFullscreen ? 'Salir de Pantalla Completa' : 'Modo Kiosco Fullscreen'}
        className="p-1.5 rounded-full bg-[#121212] hover:bg-[#1f1f1f] border border-[#3c3c3c] hover:border-[#e22718] text-[#bbbbbb] hover:text-white transition-colors cursor-pointer"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  );
};
