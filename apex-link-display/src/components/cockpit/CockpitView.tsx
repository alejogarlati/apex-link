import React from 'react';
import { TopDeltaBar } from '../zones/TopDeltaBar';
import { ZoneBTyresAndBrakes } from '../zones/ZoneBTyresAndBrakes';
import { ZoneCCentralColumn } from '../zones/ZoneCCentralColumn';
import { ZoneDTiming } from '../zones/ZoneDTiming';
import { ZoneEChassisControls } from '../zones/ZoneEChassisControls';
import { SectorsBar } from '../zones/SectorsBar';
import { FullscreenOverlayHost } from '../overlays/FullscreenOverlayHost';

interface Props {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenDiagnostics: () => void;
}

export const CockpitView: React.FC<Props> = ({
  isFullscreen,
  onToggleFullscreen,
  onOpenDiagnostics,
}) => {
  return (
    <div className="w-[1920px] h-[864px] flex flex-col justify-between relative bg-black">
      {/* 1. Top Header Row: Minimal Delta Bar without boxes (72px) */}
      <TopDeltaBar
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        onOpenDiagnostics={onOpenDiagnostics}
      />

      {/* 2. Middle Core Body Row: Tyres (B) + Central Column (C) + Timing (D) = 610px */}
      <div className="w-[1920px] h-[610px] flex items-center justify-between shrink-0">
        <ZoneBTyresAndBrakes />
        <ZoneCCentralColumn />
        <ZoneDTiming />
      </div>

      {/* 3. Bottom Row: Chassis Electronics (139px) */}
      <div className="w-[1920px] h-[139px] shrink-0">
        <ZoneEChassisControls />
      </div>

      {/* 4. Bottom 3 Macro-Sectors Bar (S1, S2, S3) = 43px */}
      <SectorsBar />

      {/* 5. 100% Fullscreen Overlays (Pit Limiter, Chassis Change, Fastest Lap) */}
      <FullscreenOverlayHost />
    </div>
  );
};
