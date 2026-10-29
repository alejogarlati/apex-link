import { useState } from 'react';
import { LetterboxContainer } from './components/common/LetterboxContainer';
import { TopDeltaBar } from './components/zones/TopDeltaBar';
import { ZoneBTyresAndBrakes } from './components/zones/ZoneBTyresAndBrakes';
import { ZoneCCentralColumn } from './components/zones/ZoneCCentralColumn';
import { ZoneDTiming } from './components/zones/ZoneDTiming';
import { ZoneEChassisControls } from './components/zones/ZoneEChassisControls';
import { MicrosectorsBar } from './components/zones/MicrosectorsBar';
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

      {/* 3. Bottom Row: Chassis Electronics (139px) - Fuel Management Eliminated */}
      <div className="w-[1920px] h-[139px] shrink-0">
        <ZoneEChassisControls />
      </div>

      {/* 4. Bottom Microsectors Bar (5% of 864px = 43px, no texts, only segmented colors) */}
      <MicrosectorsBar />

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
