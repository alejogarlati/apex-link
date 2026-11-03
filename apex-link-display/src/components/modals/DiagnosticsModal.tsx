import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { MockScenario } from '../../types/ddu';
import { Activity, Cpu, Flag, Gauge, RefreshCw, Sliders, Usb, X, Zap } from 'lucide-react';
import { MSlantedBadge, MTricolorStripe } from '../common/BmwMComponents';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const isConnected = useTelemetryStore((s) => s.isConnected);
  const latencyMs = useTelemetryStore((s) => s.latencyMs);
  const fps = useTelemetryStore((s) => s.fps);
  const speedUnit = useTelemetryStore((s) => s.speedUnit);
  const toggleSpeedUnit = useTelemetryStore((s) => s.toggleSpeedUnit);
  const isMockActive = useTelemetryStore((s) => s.isMockActive);
  const setMockActive = useTelemetryStore((s) => s.setMockActive);
  const mockScenario = useTelemetryStore((s) => s.mockScenario);
  const setMockScenario = useTelemetryStore((s) => s.setMockScenario);
  const pitLimiterActive = useTelemetryStore((s) => s.pitLimiterActive);
  const setPitLimiter = useTelemetryStore((s) => s.setPitLimiter);
  const triggerLapCompleted = useTelemetryStore((s) => s.triggerLapCompleted);

  if (!isOpen) return null;

  const scenarios: { key: MockScenario; label: string; desc: string }[] = [
    {
      key: 'RACE_STINT',
      label: 'VUELTA COMPLETA MONZA',
      desc: 'Simulación continua a 60 FPS con aceleraciones, frenadas, marchas 1..8 y cruce de meta.',
    },
    {
      key: 'RETTIFILO_BRAKING',
      label: 'FRENADA EXTREMA RETTIFILO',
      desc: 'Frenada crítica 330 -> 75 km/h, -2.85G y discos de freno incandescentes al rojo vivo.',
    },
    {
      key: 'DRS_ZONE',
      label: 'ZONA DRS RECTA PRINCIPAL',
      desc: '320 km/h en 7ma marcha con DRS activado y corte de revoluciones.',
    },
    {
      key: 'CURVA_GRANDE_ACCEL',
      label: 'CURVA BIASSONO (ALTA G)',
      desc: '290 km/h a fondo hacia la derecha con 2.45G lateral y carga térmica.',
    },
    {
      key: 'PIT_LANE',
      label: 'CALLE DE BOXES (PIT LIMITER)',
      desc: 'Velocidad regulada a 78 km/h en 1ra marcha con testigo parpadeante.',
    },
  ];

  const handleSimulatePB = () => {
    triggerLapCompleted({
      type: 'LAP_COMPLETED',
      lapNumber: 5,
      lapTimeMs: 81120,
      lapTimeStr: '01:21.120',
      isPersonalBest: true,
      isValidLap: true,
      sectors: [28050, 27410, 25660],
      telemetrySamplesCount: 4910,
      sessionLapId: `test-pb-${Date.now()}`,
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-8 select-none font-mono">
      <div className="w-[880px] max-h-[800px] rounded-none bg-[#0a0a0a] border border-[#3c3c3c] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Franja M Tricolor estructural en cabecera del modal */}
        <MTricolorStripe height="h-1" />

        <div className="p-8 flex flex-col gap-6 overflow-y-auto">
          {/* Header BMW M */}
          <div className="flex items-center justify-between border-b border-[#262626] pb-5">
            <div className="flex items-center gap-3.5">
              <MSlantedBadge height="h-8" />
              <div className="flex flex-col">
                <span className="text-[18px] font-bold tracking-[0.12em] text-white uppercase">
                  DIAGNÓSTICO Y CONTROL DE ENTORNO DDU
                </span>
                <span className="text-[12px] font-light text-[#bbbbbb] tracking-wide mt-0.5">
                  Verificación de enlace USB determinístico, WebSockets y escenarios de telemetría
                </span>
              </div>
            </div>

            {/* Circular button-icon de cierre */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#141414] hover:bg-[#262626] border border-[#3c3c3c] hover:border-[#e22718] text-[#bbbbbb] hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Metrics Bar (4 Celdas rectangulares con acento Rojo M y Negro) */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-4 rounded-none bg-[#0d0d0d] border border-[#262626] flex flex-col">
              <span className="text-[11px] font-bold tracking-[0.15em] text-[#7e7e7e] uppercase">
                ENLACE FÍSICO
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <Usb className="w-4 h-4 text-[#e22718]" />
                <span className="text-[16px] font-bold text-white uppercase">USB ADB</span>
              </div>
              <span className="text-[11px] text-[#e22718] font-bold mt-1 tabular-nums">
                LATENCIA: {latencyMs} MS
              </span>
            </div>

            <div className="p-4 rounded-none bg-[#0d0d0d] border border-[#262626] flex flex-col">
              <span className="text-[11px] font-bold tracking-[0.15em] text-[#7e7e7e] uppercase">
                WEBSOCKET
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-none ${
                    isConnected ? 'bg-[#e22718] shadow-[0_0_8px_#e22718]' : 'bg-[#7e7e7e]'
                  }`}
                />
                <span className="text-[16px] font-bold text-white uppercase">
                  {isConnected ? 'CONECTADO' : 'BUSCANDO'}
                </span>
              </div>
              <span className="text-[11px] text-[#7e7e7e] font-light mt-1 uppercase">PORT 8080</span>
            </div>

            <div className="p-4 rounded-none bg-[#0d0d0d] border border-[#262626] flex flex-col">
              <span className="text-[11px] font-bold tracking-[0.15em] text-[#7e7e7e] uppercase">
                REFRESCO
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <Activity className="w-4 h-4 text-white" />
                <span className="text-[18px] font-bold text-white tabular-nums">{fps} FPS</span>
              </div>
              <span className="text-[11px] text-[#7e7e7e] font-light mt-1 uppercase">TARGET 60 HZ</span>
            </div>

            <div className="p-4 rounded-none bg-[#0d0d0d] border border-[#262626] flex flex-col">
              <span className="text-[11px] font-bold tracking-[0.15em] text-[#7e7e7e] uppercase">
                UNIDADES
              </span>
              <button
                onClick={toggleSpeedUnit}
                className="mt-1.5 px-3 py-1 rounded-none bg-[#1a1a1a] hover:bg-[#262626] border border-[#3c3c3c] hover:border-[#e22718] text-[13px] font-bold text-white flex items-center justify-between cursor-pointer transition-colors"
              >
                <span>{speedUnit}</span>
                <RefreshCw className="w-3.5 h-3.5 text-[#e22718]" />
              </button>
              <span className="text-[10px] text-[#7e7e7e] mt-1 uppercase">TOCA PARA CAMBIAR</span>
            </div>
          </div>

          {/* Selector de Escenarios Mock */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#262626] pb-2">
              <span className="text-[13px] font-bold tracking-[0.15em] text-[#e6e6e6] uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#e22718]" />
                ESCENARIOS DE TELEMETRÍA (MOCK DETERMINÍSTICO)
              </span>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] text-[#7e7e7e] font-bold uppercase tracking-wider">
                  MODO MOCK:
                </span>
                <button
                  onClick={() => setMockActive(!isMockActive)}
                  className={`px-3 py-1 rounded-none text-[11px] font-bold tracking-wider cursor-pointer border transition-colors uppercase ${
                    isMockActive
                      ? 'bg-[#e22718] border-[#e22718] text-white shadow-[0_0_12px_rgba(226,39,24,0.5)]'
                      : 'bg-[#141414] border-[#3c3c3c] text-[#7e7e7e]'
                  }`}
                >
                  {isMockActive ? 'ACTIVO' : 'INACTIVO'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {scenarios.map((sc) => {
                const isSelected = mockScenario === sc.key && isMockActive;
                return (
                  <button
                    key={sc.key}
                    onClick={() => {
                      setMockScenario(sc.key);
                      setMockActive(true);
                      if (sc.key === 'PIT_LANE') setPitLimiter(true);
                      else setPitLimiter(false);
                    }}
                    className={`p-3.5 rounded-none border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#141414] border-[#e22718] shadow-[0_0_15px_rgba(226,39,24,0.2)]'
                        : 'bg-[#0d0d0d] border-[#262626] hover:bg-[#141414] hover:border-[#3c3c3c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-1.5 h-10 rounded-none ${
                          isSelected ? 'bg-[#e22718]' : 'bg-transparent'
                        }`}
                      />
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-white tracking-[0.1em] uppercase">
                          {sc.label}
                        </span>
                        <span className="text-[12px] font-light text-[#bbbbbb] mt-0.5">
                          {sc.desc}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="px-3 py-1 rounded-none bg-[#e22718] text-white text-[11px] font-bold tracking-[0.15em] uppercase">
                        ACTIVO
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Atajos de Acción Directa */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#262626]">
            <button
              onClick={handleSimulatePB}
              className="p-3.5 rounded-none bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white font-bold text-[13px] tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 cursor-pointer transition-colors border border-[#3c3c3c] hover:border-[#e22718]"
            >
              <Flag className="w-4 h-4 text-[#e22718]" />
              SIMULAR CRUCE DE META (RÉCORD PB)
            </button>

            <button
              onClick={() => {
                setPitLimiter(!pitLimiterActive);
              }}
              className={`p-3.5 rounded-none font-bold text-[13px] tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 cursor-pointer transition-colors border ${
                pitLimiterActive
                  ? 'bg-[#e22718] text-white border-[#e22718] shadow-[0_0_18px_rgba(226,39,24,0.4)]'
                  : 'bg-[#0d0d0d] text-[#e6e6e6] border-[#3c3c3c] hover:border-[#e22718]'
              }`}
            >
              <Zap className="w-4 h-4 text-[#e22718]" />
              ALTERNAR PIT LIMITER ({pitLimiterActive ? 'ON' : 'OFF'})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
