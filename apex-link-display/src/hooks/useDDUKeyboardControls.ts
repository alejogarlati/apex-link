import { useEffect } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { MockScenario } from '../types/ddu';

interface KeyboardControlOptions {
  onToggleDiagnostics?: () => void;
  onToggleFullscreen?: () => void;
}

export const useDDUKeyboardControls = (options?: KeyboardControlOptions) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keystrokes if typing inside an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const store = useTelemetryStore.getState();

      switch (e.key.toLowerCase()) {
        case 'p': {
          // Toggle Pit Limiter
          e.preventDefault();
          const next = !store.pitLimiterActive;
          store.setPitLimiter(next);
          break;
        }

        case 'b': {
          // Adjust Brake Bias (+0.5% or -0.5% with Shift)
          e.preventDefault();
          const delta = e.shiftKey ? -0.5 : 0.5;
          let nextBias = Math.round((store.chassis.brakeBias + delta) * 10) / 10;
          if (nextBias > 68.0) nextBias = 50.0;
          if (nextBias < 50.0) nextBias = 68.0;
          store.setChassisValue('brakeBias', nextBias);
          break;
        }

        case 't': {
          // Cycle Traction Control (1..8)
          e.preventDefault();
          const nextTC = store.chassis.tc >= 8 ? 1 : store.chassis.tc + 1;
          store.setChassisValue('tc', nextTC);
          break;
        }

        case 'a': {
          // Cycle ABS (1..10)
          e.preventDefault();
          const nextABS = store.chassis.abs >= 10 ? 1 : store.chassis.abs + 1;
          store.setChassisValue('abs', nextABS);
          break;
        }

        case 'l': {
          // Trigger fastest lap event (fullscreen overlay)
          e.preventDefault();
          const currentLap = store.telemetry.timing.currentLap;
          const bestLapStr = '01:20.890';
          store.triggerLapCompleted({
            type: 'LAP_COMPLETED',
            lapNumber: currentLap,
            lapTimeMs: 80890,
            lapTimeStr: bestLapStr,
            isPersonalBest: true,
            isValidLap: true,
            sectors: [27800, 27150, 25940],
            telemetrySamplesCount: 5120,
            sessionLapId: `lap-best-${Date.now()}`,
          });
          break;
        }

        case 'd': {
          if (options?.onToggleDiagnostics) {
            e.preventDefault();
            options.onToggleDiagnostics();
          }
          break;
        }

        case 'f': {
          if (options?.onToggleFullscreen) {
            e.preventDefault();
            options.onToggleFullscreen();
          }
          break;
        }

        // Numeric keys 1..5 for quick scenarios
        case '1': {
          store.setMockActive(true);
          store.setMockScenario('RACE_STINT');
          break;
        }
        case '2': {
          store.setMockActive(true);
          store.setMockScenario('RETTIFILO_BRAKING');
          break;
        }
        case '3': {
          store.setMockActive(true);
          store.setMockScenario('DRS_ZONE');
          break;
        }
        case '4': {
          store.setMockActive(true);
          store.setMockScenario('CURVA_GRANDE_ACCEL');
          break;
        }
        case '5': {
          store.setMockActive(true);
          store.setMockScenario('PIT_LANE');
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [options]);
};
