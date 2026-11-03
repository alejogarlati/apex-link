import { useState } from 'react';
import { LetterboxContainer } from './components/common/LetterboxContainer';
import { PreSessionLobby } from './components/lobby/PreSessionLobby';
import { CockpitView } from './components/cockpit/CockpitView';
import { DiagnosticsModal } from './components/modals/DiagnosticsModal';
import { useMockTelemetry } from './hooks/useMockTelemetry';
import { useTelemetryWebSocket } from './hooks/useTelemetryWebSocket';
import { useCalibrationSequence } from './hooks/useCalibrationSequence';
import { useScreenWakeLock } from './hooks/useScreenWakeLock';
import { useKioskMode } from './hooks/useKioskMode';
import { useDDUKeyboardControls } from './hooks/useDDUKeyboardControls';
import { useTelemetryStore } from './store/useTelemetryStore';

export function App() {
  const appState = useTelemetryStore((s) => s.appState);

  // Telemetry & Calibration loop hooks
  useMockTelemetry();
  useTelemetryWebSocket();
  useCalibrationSequence();

  // Mobile Hardware hooks
  useScreenWakeLock();
  const { isFullscreen, toggleFullscreen } = useKioskMode();

  // Modal State
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  // Keyboard Shortcuts (P: Pit Limiter, B: Brake Bias, T: TC, A: ABS, L: Lap PB, 1..5: Scenarios)
  useDDUKeyboardControls({
    onToggleDiagnostics: () => setIsDiagnosticsOpen((prev) => !prev),
    onToggleFullscreen: toggleFullscreen,
  });

  return (
    <LetterboxContainer>
      {appState === 'STANDBY' ? (
        <PreSessionLobby
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        />
      ) : (
        <CockpitView
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        />
      )}

      {/* Diagnostics Modal accessible from both Standby and OnSession */}
      <DiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />
    </LetterboxContainer>
  );
}

export default App;
