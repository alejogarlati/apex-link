/**
 * Main Application Orchestrator for ApexLink
 * Coordinates Canvas 2D (Official map.png & 3D Math) and Three.js 3D WebGL
 * using authentic Assetto Corsa data for Imola F1 2025, Red Bull Ring GP, and Monza F1 2025.
 */

import { generateTrackTelemetry } from './trackData.js';
import { CIRCUITS_DATA } from './circuitsData.js';
import { CanvasIsometricViewer } from './canvasIsometric.js';
import { ThreeIsometricViewer } from './threeIsometric.js';

// 1. Initial State: Imola F1 2025 as default
const syntheticTrackData = generateTrackTelemetry(1200);
let activeCircuitKey = 'imola';
let activeTrackData = CIRCUITS_DATA.imola;

// 2. DOM Elements
const canvasEl = document.getElementById('canvas2d');
const threeContainer = document.getElementById('threeContainer');
const playPauseBtn = document.getElementById('playPauseBtn');
const scrubber = document.getElementById('scrubber');
const speedSelect = document.getElementById('speedSelect');
const heatmapSelect = document.getElementById('heatmapSelect');
const trackSelect = document.getElementById('trackSelect');
const lapTimeDisplay = document.getElementById('lapTimeDisplay');
const distanceDisplay = document.getElementById('distanceDisplay');
const hudTrackName = document.getElementById('hudTrackName');

// Canvas 2D controls
const toggleCanvasModeBtn = document.getElementById('toggleCanvasMode');
const canvasPanelTag = document.getElementById('canvasPanelTag');
const canvasPanelDesc = document.getElementById('canvasPanelDesc');

// HUD elements
const hudSpeed = document.getElementById('hudSpeed');
const hudGear = document.getElementById('hudGear');
const hudRpmVal = document.getElementById('hudRpmVal');
const hudRpmFill = document.getElementById('hudRpmFill');
const hudThrottleFill = document.getElementById('hudThrottleFill');
const hudBrakeFill = document.getElementById('hudBrakeFill');
const hudElevation = document.getElementById('hudElevation');
const hudSlope = document.getElementById('hudSlope');
const hudSection = document.getElementById('hudSection');
const hudDrs = document.getElementById('hudDrs');

// FPS elements
const fpsCanvasEl = document.getElementById('fpsCanvas');
const fpsThreeEl = document.getElementById('fpsThree');

// 3. Initialize Viewers
const canvasViewer = new CanvasIsometricViewer(
  canvasEl,
  activeTrackData,
  activeTrackData.mapConfig,
  activeTrackData.mapImageUrl
);
const threeViewer = new ThreeIsometricViewer(threeContainer, activeTrackData);

// 4. Playback State
let isPlaying = true;
let currentCarIndex = 0;
let playbackMultiplier = 1.0;
scrubber.max = activeTrackData.track.length - 1;

// FPS tracking
let canvasFrameCount = 0;
let threeFrameCount = 0;
let lastFpsTime = performance.now();

// 5. Setup Controls & Listeners
playPauseBtn.addEventListener('click', () => {
  isPlaying = !isPlaying;
  playPauseBtn.innerHTML = isPlaying ? '❚❚' : '▶';
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    isPlaying = !isPlaying;
    playPauseBtn.innerHTML = isPlaying ? '❚❚' : '▶';
  }
});

scrubber.addEventListener('input', (e) => {
  currentCarIndex = parseInt(e.target.value, 10);
});

speedSelect.addEventListener('change', (e) => {
  playbackMultiplier = parseFloat(e.target.value);
});

heatmapSelect.addEventListener('change', (e) => {
  const mode = e.target.value;
  canvasViewer.heatmapMode = mode;
  threeViewer.heatmapMode = mode;
  threeViewer.updateTrackColors();
});

// Track Switching: Imola / Red Bull Ring / Monza / Synthetic
trackSelect.addEventListener('change', (e) => {
  const selected = e.target.value;
  activeCircuitKey = selected;

  if (CIRCUITS_DATA[selected]) {
    activeTrackData = CIRCUITS_DATA[selected];
    canvasViewer.setTrackData(activeTrackData, activeTrackData.mapConfig, activeTrackData.mapImageUrl);
    threeViewer.setTrackData(activeTrackData);
    hudTrackName.textContent = `${activeTrackData.displayName} • Vuelta Simulada F1`;
    updateCanvasModeLabels();
  } else {
    activeTrackData = syntheticTrackData;
    canvasViewer.setTrackData(activeTrackData, null, null);
    threeViewer.setTrackData(activeTrackData);
    hudTrackName.textContent = 'Pista Sintética con Desnivel Extremo (+58m)';
    updateCanvasModeLabels();
  }

  currentCarIndex = 0;
  scrubber.max = activeTrackData.track.length - 1;
});

// Canvas 2D Mode Toggle
function updateCanvasModeLabels() {
  if (canvasViewer.renderMode === 'map_png') {
    canvasPanelTag.textContent = 'OPCIÓN A: MAPA 2D OFICIAL (map.png + map.ini)';
    canvasPanelDesc.textContent = 'Calibración matemática oficial de Assetto Corsa con trazada en vivo';
    toggleCanvasModeBtn.textContent = '📐 Cambiar a Isométrica 3D';
  } else {
    canvasPanelTag.textContent = 'OPCIÓN A: CANVAS 2D ISOMÉTRICO 3D';
    canvasPanelDesc.textContent = 'Proyección trigonométrica pura en 2D con elevación real';
    toggleCanvasModeBtn.textContent = activeTrackData.mapConfig ? '🗺️ Cambiar a Mapa Oficial' : '📐 Isométrica 3D';
  }
}

toggleCanvasModeBtn.addEventListener('click', () => {
  if (canvasViewer.renderMode === 'map_png') {
    canvasViewer.renderMode = 'isometric';
  } else {
    if (activeTrackData.mapConfig) canvasViewer.renderMode = 'map_png';
  }
  canvasViewer.resetView();
  updateCanvasModeLabels();
});

document.getElementById('resetCanvasView').addEventListener('click', () => {
  canvasViewer.resetView();
});

// View layout switching (Split / Canvas Only / Three Only)
const viewBtns = document.querySelectorAll('.segmented-btn[data-view]');
const canvasPanel = document.getElementById('canvasPanel');
const threePanel = document.getElementById('threePanel');

viewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const view = btn.dataset.view;
    if (view === 'split') {
      canvasPanel.style.display = 'flex';
      canvasPanel.style.flex = '1';
      threePanel.style.display = 'flex';
      threePanel.style.flex = '1';
    } else if (view === 'canvas') {
      canvasPanel.style.display = 'flex';
      canvasPanel.style.flex = '1';
      threePanel.style.display = 'none';
    } else if (view === 'three') {
      canvasPanel.style.display = 'none';
      threePanel.style.display = 'flex';
      threePanel.style.flex = '1';
    }

    setTimeout(() => {
      canvasViewer.resize();
      window.dispatchEvent(new Event('resize'));
    }, 50);
  });
});

// Three.js tools
document.querySelectorAll('[data-three-preset]').forEach(btn => {
  btn.addEventListener('click', () => {
    threeViewer.setCameraPreset(btn.dataset.threePreset);
  });
});

document.getElementById('toggleThreeCam').addEventListener('click', (e) => {
  const newMode = threeViewer.toggleCameraMode();
  e.target.innerText = newMode === 'orthographic' ? '📷 Isométrica' : '🎥 Perspectiva';
});

// 6. HUD Telemetry Update Function
function updateHUD(point) {
  hudSpeed.textContent = point.speed;
  hudGear.textContent = point.gear;
  hudRpmVal.textContent = point.rpm;

  const maxRpm = 12400;
  const minRpm = 5000;
  const rpmPercent = Math.max(0, Math.min(100, ((point.rpm - minRpm) / (maxRpm - minRpm)) * 100));
  hudRpmFill.style.width = `${rpmPercent}%`;

  hudThrottleFill.style.height = `${Math.round(point.throttle * 100)}%`;
  hudBrakeFill.style.height = `${Math.round(point.brake * 100)}%`;

  hudElevation.textContent = `${point.y >= 0 ? '+' : ''}${point.y.toFixed(1)} m`;
  hudSlope.textContent = `${point.slope >= 0 ? '+' : ''}${point.slope.toFixed(1)}%`;

  hudSection.textContent = point.section || 'Recta Principal';

  if (point.drs) {
    hudDrs.textContent = 'DRS ACTIVE';
    hudDrs.classList.add('active');
  } else {
    hudDrs.textContent = 'DRS CLOSED';
    hudDrs.classList.remove('active');
  }

  // Simulated lap time calculation
  const totalLapSecs = activeCircuitKey === 'monza' ? 79.5 : (activeCircuitKey === 'imola' ? 75.8 : 65.2);
  const lapTimeSeconds = point.t * totalLapSecs;
  const mins = Math.floor(lapTimeSeconds / 60);
  const secs = (lapTimeSeconds % 60).toFixed(3).padStart(6, '0');
  lapTimeDisplay.textContent = `0${mins}:${secs}`;

  const currentDistMeters = Math.round(point.t * activeTrackData.bounds.totalDistance);
  distanceDisplay.textContent = `${currentDistMeters} m / ${activeTrackData.bounds.totalDistance} m`;

  scrubber.value = point.index;
}

// 7. Master Synchronized Animation Loop
let lastTime = performance.now();
let accumulator = 0;

function tick(now) {
  requestAnimationFrame(tick);

  const delta = (now - lastTime) / 1000;
  lastTime = now;

  const totalPoints = activeTrackData.track.length;

  if (isPlaying) {
    accumulator += delta * 60 * playbackMultiplier;
    while (accumulator >= 1) {
      currentCarIndex = (currentCarIndex + 1) % totalPoints;
      accumulator -= 1;
    }
  }

  const currentPoint = activeTrackData.track[currentCarIndex % totalPoints];

  if (canvasPanel.style.display !== 'none') {
    canvasViewer.render(currentCarIndex);
    canvasFrameCount++;
  }

  if (threePanel.style.display !== 'none') {
    threeViewer.update(currentCarIndex);
    threeFrameCount++;
  }

  updateHUD(currentPoint);

  if (now - lastFpsTime >= 1000) {
    const elapsedSecs = (now - lastFpsTime) / 1000;
    fpsCanvasEl.textContent = `${Math.round(canvasFrameCount / elapsedSecs)} FPS (Canvas)`;
    fpsThreeEl.textContent = `${Math.round(threeFrameCount / elapsedSecs)} FPS (Three.js WebGL)`;
    canvasFrameCount = 0;
    threeFrameCount = 0;
    lastFpsTime = now;
  }
}

// Start
requestAnimationFrame(tick);
