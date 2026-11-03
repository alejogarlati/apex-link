import React from 'react';
import { UserCheck, UserRound } from 'lucide-react';
import { PilotProfile } from '../../types/ddu';

interface Props {
  profile: PilotProfile;
}

export const DriverProfileBadge: React.FC<Props> = ({ profile }) => {
  const displayName = (profile.name || 'INVITADO').toUpperCase();

  return (
    <div className="flex items-center gap-4 px-8 py-3.5 bg-[#0d0d0d] border border-[#3c3c3c] rounded-none select-none shadow-lg">
      {/* Indicador con acento Rojo M */}
      <div className="w-1.5 h-9 bg-[#e22718] shadow-[0_0_12px_rgba(226,39,24,0.6)]" />

      {profile.isGuest ? (
        <UserRound className="w-8 h-8 text-zinc-400 shrink-0" />
      ) : (
        <UserCheck className="w-8 h-8 text-[#e22718] shrink-0 drop-shadow-[0_0_10px_rgba(226,39,24,0.5)]" />
      )}

      <div className="flex items-baseline gap-3">
        <span className="text-[20px] font-bold tracking-[0.15em] text-[#7e7e7e] uppercase">
          PILOTO
        </span>
        <span
          className={`text-[36px] font-black tracking-wider leading-none uppercase ${
            profile.isGuest ? 'text-zinc-200' : 'text-white'
          }`}
        >
          {displayName}
        </span>
      </div>

      {/* M Red Status Dot */}
      <span
        className={`w-3 h-3 rounded-none ml-2 ${
          profile.isGuest ? 'bg-zinc-600' : 'bg-[#e22718] shadow-[0_0_10px_#e22718]'
        }`}
      />
    </div>
  );
};
