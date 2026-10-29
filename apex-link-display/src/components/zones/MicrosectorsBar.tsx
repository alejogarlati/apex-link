import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { MicrosectorStatus } from '../../types/ddu';

export const MicrosectorsBar: React.FC = () => {
  const microsectors = useTelemetryStore((s) => s.microsectors);
  const timing = useTelemetryStore((s) => s.telemetry.timing);

  const getStatusColor = (status: MicrosectorStatus) => {
    switch (status) {
      case 'purple':
        return 'bg-purple-600 text-purple-100 shadow-[0_0_12px_rgba(192,38,211,0.7)] border-purple-400/60';
      case 'green':
        return 'bg-emerald-500 text-emerald-950 shadow-[0_0_10px_rgba(16,185,129,0.6)] border-emerald-400/60 font-black';
      case 'yellow':
        return 'bg-amber-400 text-amber-950 shadow-[0_0_8px_rgba(245,158,11,0.5)] border-amber-300 font-black';
      case 'active':
        return 'bg-cyan-400 text-black shadow-[0_0_14px_rgba(0,229,255,0.9)] border-white animate-pulse font-black scale-105 z-10';
      case 'upcoming':
      default:
        return 'bg-zinc-900/90 text-zinc-600 border-zinc-800/80';
    }
  };

  return (
    <div className="w-[1920px] h-[43px] px-4 bg-black border-t border-zinc-800 flex items-center justify-between font-mono select-none">
      {/* Left indicator label */}
      <div className="flex items-center gap-2 mr-3 shrink-0">
        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00E5FF]" />
        <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
          MICROSECTORS
        </span>
        <span className="text-[9px] font-bold text-zinc-600 uppercase">
          (5% SPLITS · S{timing.sector})
        </span>
      </div>

      {/* 20 Microsectors Segments with Macro-sector groups (S1: 0..6, S2: 7..13, S3: 14..19) */}
      <div className="flex-1 h-[26px] flex items-center gap-1.5 justify-center">
        {/* Macro S1 Badge */}
        <span className="text-[9px] font-black text-cyan-400 px-1 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40 shrink-0">
          S1
        </span>

        {/* Sectors 0..6 */}
        {microsectors.slice(0, 7).map((m) => (
          <div
            key={m.id}
            title={`Microsector ${m.id + 1} (S1) - ${m.status.toUpperCase()}${m.deltaMs !== undefined ? ` [${m.deltaMs > 0 ? '+' : ''}${(m.deltaMs / 1000).toFixed(2)}s]` : ''}`}
            className={`flex-1 h-full rounded flex items-center justify-center text-[10px] border transition-all duration-150 ${getStatusColor(
              m.status
            )}`}
          >
            <span className="font-mono font-black">{m.id + 1}</span>
          </div>
        ))}

        {/* Macro S1 -> S2 Divider */}
        <div className="w-[2px] h-[20px] bg-zinc-700 mx-1 shrink-0" />

        {/* Macro S2 Badge */}
        <span className="text-[9px] font-black text-cyan-400 px-1 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40 shrink-0">
          S2
        </span>

        {/* Sectors 7..13 */}
        {microsectors.slice(7, 14).map((m) => (
          <div
            key={m.id}
            title={`Microsector ${m.id + 1} (S2) - ${m.status.toUpperCase()}${m.deltaMs !== undefined ? ` [${m.deltaMs > 0 ? '+' : ''}${(m.deltaMs / 1000).toFixed(2)}s]` : ''}`}
            className={`flex-1 h-full rounded flex items-center justify-center text-[10px] border transition-all duration-150 ${getStatusColor(
              m.status
            )}`}
          >
            <span className="font-mono font-black">{m.id + 1}</span>
          </div>
        ))}

        {/* Macro S2 -> S3 Divider */}
        <div className="w-[2px] h-[20px] bg-zinc-700 mx-1 shrink-0" />

        {/* Macro S3 Badge */}
        <span className="text-[9px] font-black text-cyan-400 px-1 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40 shrink-0">
          S3
        </span>

        {/* Sectors 14..19 */}
        {microsectors.slice(14, 20).map((m) => (
          <div
            key={m.id}
            title={`Microsector ${m.id + 1} (S3) - ${m.status.toUpperCase()}${m.deltaMs !== undefined ? ` [${m.deltaMs > 0 ? '+' : ''}${(m.deltaMs / 1000).toFixed(2)}s]` : ''}`}
            className={`flex-1 h-full rounded flex items-center justify-center text-[10px] border transition-all duration-150 ${getStatusColor(
              m.status
            )}`}
          >
            <span className="font-mono font-black">{m.id + 1}</span>
          </div>
        ))}
      </div>

      {/* Right Legend Key */}
      <div className="flex items-center gap-3 ml-4 shrink-0 text-[9px] font-black">
        <div className="flex items-center gap-1 text-purple-400">
          <span className="w-2 h-2 rounded bg-purple-600" />
          <span>BEST</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400">
          <span className="w-2 h-2 rounded bg-emerald-500" />
          <span>FASTER</span>
        </div>
        <div className="flex items-center gap-1 text-amber-400">
          <span className="w-2 h-2 rounded bg-amber-400" />
          <span>SLOWER</span>
        </div>
      </div>
    </div>
  );
};
