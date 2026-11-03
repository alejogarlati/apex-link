import { useEffect } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

const CALIBRATION_DURATION_MS = 900;

export const useCalibrationSequence = () => {
  const appState = useTelemetryStore((s) => s.appState);
  const setCalibrationProgress = useTelemetryStore((s) => s.setCalibrationProgress);
  const setAppState = useTelemetryStore((s) => s.setAppState);

  useEffect(() => {
    if (appState !== 'CALIBRATING') return;

    let animFrameId: number;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1.0, elapsed / CALIBRATION_DURATION_MS);

      // Curva de barrido de ignición:
      // 0.00 -> 0.45: Subida rápida 0% a 100%
      // 0.45 -> 0.60: Corte máximo estroboscópico al 100%
      // 0.60 -> 1.00: Descenso suave 100% a 0%
      let sweepValue = 0;
      if (rawProgress <= 0.45) {
        sweepValue = rawProgress / 0.45;
      } else if (rawProgress <= 0.6) {
        sweepValue = 1.0;
      } else {
        sweepValue = Math.max(0, 1.0 - (rawProgress - 0.6) / 0.4);
      }

      setCalibrationProgress(sweepValue);

      if (rawProgress < 1.0) {
        animFrameId = requestAnimationFrame(step);
      } else {
        setCalibrationProgress(0);
        setAppState('ON_SESSION');
      }
    };

    animFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [appState, setCalibrationProgress, setAppState]);
};
