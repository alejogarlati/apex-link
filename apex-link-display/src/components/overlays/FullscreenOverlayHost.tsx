import React from 'react';
import { PitLimiterFullscreenOverlay } from './PitLimiterFullscreenOverlay';
import { ChassisFullscreenOverlay } from './ChassisFullscreenOverlay';
import { FastestLapFullscreenOverlay } from './FastestLapFullscreenOverlay';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const FullscreenOverlayHost: React.FC = () => {
  const isInPitLane = useTelemetryStore(
    (s) => s.isInPitLane || s.mockScenario === 'PIT_LANE'
  );
  const timedOverlay = useTelemetryStore((s) => s.timedOverlay);

  // If neither in pit lane nor timed overlay is active, render nothing
  if (!isInPitLane && !timedOverlay) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {/* Pit overlay has precedence while in pit lane */}
      {isInPitLane ? (
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
