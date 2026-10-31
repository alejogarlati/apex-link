import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { MockScenario } from '../../types/ddu';
import { Activity, Cpu, Flag, Gauge, RefreshCw, Sliders, Usb, X, Zap } from 'lucide-react';

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
      label: '🏁 Vuelta Completa Monza',
      desc: 'Simulación continua a 60 FPS con aceleraciones, frenadas, marchas 1..8 y cruce de meta.',
    },
    {
      key: 'RETTIFILO_BRAKING',
      label: '🛑 Frenada Extrema Rettifilo',
      desc: 'Frenada crítica 330 -> 75 km/h, -2.85G y discos de freno incandescentes al rojo vivo.',
    },
    {
      key: 'DRS_ZONE',
      label: '⚡ Zona DRS Recta Principal',
      desc: '320 km/h en 7ma marcha con DRS activado en verde neón y corte de revoluciones.',
    },
    {
      key: 'CURVA_GRANDE_ACCEL',
      label: '🏎️ Curva Biassono (Alta G)',
      desc: '290 km/h a fondo hacia la derecha con 2.45G lateral y calentamiento de gomas izquierdas.',
    },
    {
      key: 'PIT_LANE',
      label: '🅿️ Calle de Boxes (Pit Limiter)',
      desc: 'Velocidad regulada a 78 km/h en 1ra marcha con testigo azul parpadeante a 4 Hz.',
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
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-8 select-none">
      <div className="w-[860px] max-h-[780px] p-7 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-6 font-mono shadow-2xl relative overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-black tracking-wide text-white">
                DIAGNÓSTICO Y CONTROL DE ENTORNO DDU
              </span>
              <span className="text-[11px] text-zinc-400">
                Verificación de enlace USB determinístico, WebSockets y escenarios de telemetría
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-700/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col">
            <span className="text-[10px] font-black text-zinc-500 uppercase">ENLACE FÍSICO</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Usb className="w-4 h-4 text-cyan-400" />
              <span className="text-[16px] font-black text-white">USB ADB</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold mt-0.5">LATENCIA: {latencyMs} ms</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col">
            <span className="text-[10px] font-black text-zinc-500 uppercase">WEBSOCKET STATUS</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_8px_#00E676]' : 'bg-rose-500'}`} />
              <span className="text-[16px] font-black text-white">
                {isConnected ? 'CONECTADO' : 'BUSCANDO'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-bold mt-0.5">PORT 8080</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col">
            <span className="text-[10px] font-black text-zinc-500 uppercase">REFRESCO DE PANTALLA</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-[18px] font-black text-emerald-400 tabular-nums">{fps} FPS</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-bold mt-0.5">TARGET 60-144 HZ</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col">
            <span className="text-[10px] font-black text-zinc-500 uppercase">UNIDADES</span>
            <button
              onClick={toggleSpeedUnit}
              className="mt-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[13px] font-black text-cyan-400 flex items-center justify-between cursor-pointer border border-zinc-700"
            >
              <span>{speedUnit}</span>
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-zinc-500 mt-0.5">TOCA PARA CAMBIAR</span>
          </div>
        </div>

        {/* Mock Scenario Switcher */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-black tracking-wider text-zinc-300 uppercase flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              ESCENARIOS DE TELEMETRÍA (MOCK DETERMINÍSTICO)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500 font-bold">MODO MOCK:</span>
              <button
                onClick={() => setMockActive(!isMockActive)}
                className={`px-3 py-1 rounded text-[11px] font-black cursor-pointer border transition-colors ${
                  isMockActive
                    ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-[0_0_10px_#E040FB]'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                }`}
              >
                {isMockActive ? 'ACTIVO' : 'INACTIVO'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {scenarios.map((sc) => (
              <button
                key={sc.key}
                onClick={() => {
                  setMockScenario(sc.key);
                  setMockActive(true);
                  if (sc.key === 'PIT_LANE') setPitLimiter(true);
                  else setPitLimiter(false);
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  mockScenario === sc.key && isMockActive
                    ? 'bg-purple-950/40 border-purple-500/80 shadow-[0_0_15px_rgba(224,64,251,0.25)]'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-white tracking-wide">
                    {sc.label}
                  </span>
                  <span className="text-[11px] text-zinc-400 mt-0.5">{sc.desc}</span>
                </div>
                {mockScenario === sc.key && isMockActive && (
                  <span className="px-2.5 py-1 rounded bg-purple-500 text-black text-[10px] font-black tracking-wider">
                    ACTIVO
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
          <button
            onClick={handleSimulatePB}
            className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-[13px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-[0_0_15px_rgba(224,64,251,0.4)]"
          >
            <Flag className="w-4 h-4" />
            SIMULAR CRUCE DE META CON RÉCORD (PB)
          </button>

          <button
            onClick={() => {
              setPitLimiter(!pitLimiterActive);
            }}
            className={`p-3 rounded-xl font-black text-[13px] flex items-center justify-center gap-2 cursor-pointer transition-colors border ${
              pitLimiterActive
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_#00E5FF]'
                : 'bg-zinc-900 text-cyan-400 border-zinc-700 hover:bg-zinc-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            ALTERNAR PIT LIMITER ({pitLimiterActive ? 'ON' : 'OFF'})
          </button>
        </div>
      </div>
    </div>
  );
};
