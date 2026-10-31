import React from 'react';
import { PitLimiterFullscreenOverlay } from './PitLimiterFullscreenOverlay';
import { ChassisFullscreenOverlay } from './ChassisFullscreenOverlay';
import { FastestLapFullscreenOverlay } from './FastestLapFullscreenOverlay';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const FullscreenOverlayHost: React.FC = () => {
  const isInPitLane = useTelemetryStore(
    (s) => s.isInPitLane || s.mockScenario === 'PIT_LANE'
  );
  const pitLimiterActive = useTelemetryStore((s) => s.pitLimiterActive);
  const timedOverlay = useTelemetryStore((s) => s.timedOverlay);
  const car = useTelemetryStore((s) => s.telemetry.car);

  // El overlay de boxes se activa si el limitador está activo O si el auto rueda en el carril de boxes
  const showPitOverlay = pitLimiterActive || (isInPitLane && car.speedKmh > 2.0);

  // Si ni el overlay de boxes ni un overlay temporal están activos, no renderizar nada
  if (!showPitOverlay && !timedOverlay) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {/* El overlay de boxes tiene precedencia sobre los carteles temporales */}
      {showPitOverlay ? (
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
