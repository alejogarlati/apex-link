import React from 'react';

export type DiagnosticStatus = 'OK' | 'WAITING' | 'OFFLINE';

interface Props {
  title: string;
  status: DiagnosticStatus;
  statusLabel: string;
  secondaryValue: string;
  icon: React.ReactNode;
}

export const DiagnosticCard: React.FC<Props> = ({
  title,
  status,
  statusLabel,
  secondaryValue,
  icon,
}) => {
  // Configuración de estilos bajo BMW M Design System (Rojo M #e22718 + Negro)
  const styles = {
    OK: {
      border: 'border-[#3c3c3c] hover:border-[#e22718] transition-colors',
      topStripe: 'bg-[#e22718] shadow-[0_0_16px_rgba(226,39,24,0.6)]',
      iconBox:
        'bg-[#1a1a1a] border-[#3c3c3c] text-white shadow-[0_0_20px_rgba(226,39,24,0.15)]',
      statusText: 'text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.25)]',
      badge: 'bg-[#e22718] text-white',
      dot: 'bg-[#e22718] shadow-[0_0_10px_#e22718]',
    },
    WAITING: {
      border: 'border-[#3c3c3c]',
      topStripe: 'bg-[#f4b400] shadow-[0_0_14px_rgba(244,180,0,0.5)] animate-pulse',
      iconBox:
        'bg-[#141414] border-[#3c3c3c] text-[#f4b400] animate-pulse',
      statusText: 'text-[#f4b400]',
      badge: 'bg-[#f4b400] text-black',
      dot: 'bg-[#f4b400] shadow-[0_0_10px_#f4b400] animate-pulse',
    },
    OFFLINE: {
      border: 'border-[#262626]',
      topStripe: 'bg-[#3c3c3c]',
      iconBox: 'bg-[#101010] border-[#262626] text-[#7e7e7e]',
      statusText: 'text-[#7e7e7e]',
      badge: 'bg-[#262626] text-[#7e7e7e]',
      dot: 'bg-[#3c3c3c]',
    },
  }[status];

  return (
    <div
      className={`flex-1 h-full rounded-none bg-[#0d0d0d] border flex flex-col justify-between text-center select-none relative overflow-hidden transition-all duration-200 ${styles.border}`}
    >
      {/* 1. Franja Superior de Acento Técnico (4px) */}
      <div className={`w-full h-1.5 ${styles.topStripe}`} />

      <div className="flex-1 px-8 py-8 flex flex-col items-center justify-between">
        {/* 2. Título de Especificación Técnica (BMW Type Next Upper 1.5px tracking) */}
        <div className="flex items-center gap-3">
          <span className={`w-3.5 h-3.5 rounded-none ${styles.dot}`} />
          <span className="text-[26px] font-bold tracking-[0.15em] text-[#e6e6e6] uppercase">
            {title}
          </span>
        </div>

        {/* 3. Módulo Central del Sensor / Dispositivo */}
        <div
          className={`w-36 h-36 rounded-none border-2 flex items-center justify-center my-auto transition-transform duration-200 ${styles.iconBox}`}
        >
          {icon}
        </div>

        {/* 4. Telemetría de Estado y Subvalor Técnico */}
        <div className="flex flex-col items-center gap-2">
          <span
            className={`text-[46px] font-black tracking-tight uppercase leading-none ${styles.statusText}`}
          >
            {statusLabel}
          </span>
          <span className="text-[24px] font-light text-[#bbbbbb] tracking-[0.1em] uppercase tabular-nums">
            {secondaryValue}
          </span>
        </div>
      </div>
    </div>
  );
};
