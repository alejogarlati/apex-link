import { useState } from 'react';
import { LetterboxContainer } from './components/common/LetterboxContainer';
import { TopDeltaBar } from './components/zones/TopDeltaBar';
import { ZoneBTyresAndBrakes } from './components/zones/ZoneBTyresAndBrakes';
import { ZoneCCentralColumn } from './components/zones/ZoneCCentralColumn';
import { ZoneDTiming } from './components/zones/ZoneDTiming';
import { ZoneEChassisControls } from './components/zones/ZoneEChassisControls';
import { SectorsBar } from './components/zones/SectorsBar';
import { FullscreenOverlayHost } from './components/overlays/FullscreenOverlayHost';
import { DiagnosticsModal } from './components/modals/DiagnosticsModal';
import { QuickControlsBar } from './components/modals/QuickControlsBar';
import { useMockTelemetry } from './hooks/useMockTelemetry';
import { useTelemetryWebSocket } from './hooks/useTelemetryWebSocket';
import { useScreenWakeLock } from './hooks/useScreenWakeLock';
import { useKioskMode } from './hooks/useKioskMode';
import { useDDUKeyboardControls } from './hooks/useDDUKeyboardControls';

export function App() {
  // Telemetry loop hooks
  useMockTelemetry();
  useTelemetryWebSocket();

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
      {/* 1. Top Header Row: Minimal Delta Bar without boxes (72px) */}
      <TopDeltaBar
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
      />

      {/* 2. Middle Core Body Row: Tyres (B) + Central Column (C) + Timing (D) = 610px */}
      <div className="w-[1920px] h-[610px] flex items-center justify-between shrink-0">
        <ZoneBTyresAndBrakes />
        <ZoneCCentralColumn />
        <ZoneDTiming />
      </div>

      {/* 3. Bottom Row: Chassis Electronics & Fuel (134px) */}
      <div className="w-[1920px] h-[134px] shrink-0">
        <ZoneEChassisControls />
      </div>

      {/* 4. Official 3 Sectors Bar (S1, S2, S3) (48px) */}
      <SectorsBar />

      {/* 5. 100% Fullscreen Overlays (Pit Limiter, Chassis Change, Fastest Lap) */}
      <FullscreenOverlayHost />

      {/* 6. Diagnostics Modal */}
      <DiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

      {/* 7. Discreet Demonstration & Quick Scenario Switcher */}
      <QuickControlsBar
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
    </LetterboxContainer>
  );
}

export default App;
