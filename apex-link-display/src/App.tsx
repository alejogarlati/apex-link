import { useState } from 'react';
import { LetterboxContainer } from './components/common/LetterboxContainer';
import { ZoneA1WarningStrip } from './components/zones/ZoneA1WarningStrip';
import { ZoneA2DeltaBar } from './components/zones/ZoneA2DeltaBar';
import { ZoneA3SessionMonitor } from './components/zones/ZoneA3SessionMonitor';
import { ZoneBTyresAndBrakes } from './components/zones/ZoneBTyresAndBrakes';
import { ZoneCCentralColumn } from './components/zones/ZoneCCentralColumn';
import { ZoneDTiming } from './components/zones/ZoneDTiming';
import { ZoneEChassisControls } from './components/zones/ZoneEChassisControls';
import { ZoneFFuelManagement } from './components/zones/ZoneFFuelManagement';
import { MicrosectorsBar } from './components/zones/MicrosectorsBar';
import { FullscreenOverlayHost } from './components/overlays/FullscreenOverlayHost';
import { LapCompletedBanner } from './components/modals/LapCompletedBanner';
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
      {/* 1. Top Header Row: Status Strip (A1) + Delta Bar (A2) + Session Monitor (A3) = 72px */}
      <div className="w-[1920px] h-[72px] flex items-center justify-between shrink-0">
        <ZoneA1WarningStrip onOpenDiagnostics={() => setIsDiagnosticsOpen(true)} />
        <ZoneA2DeltaBar />
        <ZoneA3SessionMonitor
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>

      {/* 2. Middle Core Body Row: Tyres (B) + Central Column (C) + Timing (D) = 610px */}
      <div className="w-[1920px] h-[610px] flex items-center justify-between shrink-0">
        <ZoneBTyresAndBrakes />
        <ZoneCCentralColumn />
        <ZoneDTiming />
      </div>

      {/* 3. Bottom Row: Chassis Electronics (E) + Fuel Management (F) = 139px */}
      <div className="w-[1920px] h-[139px] flex items-center justify-between shrink-0">
        <ZoneEChassisControls />
        <ZoneFFuelManagement />
      </div>

      {/* 4. Bottom Microsectors Bar (5% of 864px = 43px) */}
      <MicrosectorsBar />

      {/* 5. 100% Fullscreen Overlays (Pit Limiter, Chassis Change, Fastest Lap) */}
      <FullscreenOverlayHost />

      {/* 6. Modals & Notifications */}
      <LapCompletedBanner />

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
