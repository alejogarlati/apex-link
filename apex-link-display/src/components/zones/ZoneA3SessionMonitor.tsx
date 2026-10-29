import React, { useEffect, useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Maximize2, Minimize2, Trophy } from 'lucide-react';

interface Props {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const ZoneA3SessionMonitor: React.FC<Props> = ({ isFullscreen, onToggleFullscreen }) => {
  const session = useTelemetryStore((s) => s.telemetry.session);
  const timing = useTelemetryStore((s) => s.telemetry.timing);

  const [sessionTime, setSessionTime] = useState('00:45:23');

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - start) / 1000);
      const hours = String(Math.floor(elapsedSec / 3600)).padStart(2, '0');
      const mins = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, '0');
      const secs = String(elapsedSec % 60).padStart(2, '0');
      setSessionTime(`${hours}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[480px] h-[72px] px-5 flex items-center justify-between border-b border-l border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm font-mono tabular-nums">
      {/* Session Type & Timer */}
      <div className="flex flex-col">
        <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
          SESSION
        </span>
        <span className="text-[14px] font-bold text-zinc-300">
          RACE {sessionTime}
        </span>
      </div>

      {/* Lap Counter */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
          LAP
        </span>
        <span className="text-[16px] font-black text-cyan-400">
          {String(timing.currentLap).padStart(2, '0')} <span className="text-zinc-600 text-[12px]">/ 24</span>
        </span>
      </div>

      {/* Position Badge */}
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-black ${
            session.position === 1
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,214,0,0.3)]'
              : 'bg-zinc-900 border-zinc-700 text-white'
          }`}
        >
          {session.position === 1 && <Trophy className="w-4 h-4 text-amber-400" />}
          <span className="text-[20px] leading-none">
            P{String(session.position).padStart(2, '0')}
          </span>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Salir de Pantalla Completa' : 'Modo Kiosco Pantalla Completa'}
          className="p-2 rounded bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
