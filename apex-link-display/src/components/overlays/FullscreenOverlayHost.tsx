import React from 'react';
import { PitLimiterFullscreenOverlay } from './PitLimiterFullscreenOverlay';
import { ChassisFullscreenOverlay } from './ChassisFullscreenOverlay';
import { FastestLapFullscreenOverlay } from './FastestLapFullscreenOverlay';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const FullscreenOverlayHost: React.FC = () => {
  const pitLimiterActive = useTelemetryStore((s) => s.pitLimiterActive);
  const timedOverlay = useTelemetryStore((s) => s.timedOverlay);

  // If neither pit limiter nor timed overlay is active, render nothing
  if (!pitLimiterActive && !timedOverlay) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {/* Pit Limiter has precedence if active while in pit lane */}
      {pitLimiterActive ? (
        <PitLimiterFullscreenOverlay />
      ) : (
        <>
          <ChassisFullscreenOverlay />
          <FastestLapFullscreenOverlay />
        </>
      )}
    </div>
  );
};
