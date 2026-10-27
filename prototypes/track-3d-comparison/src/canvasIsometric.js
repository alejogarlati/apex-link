/**
 * Canvas 2D Renderer for ApexLink
 * Supports:
 * 1. 'map_png': Official Assetto Corsa broadcast map overlay with map.png & map.ini
 * 2. 'isometric': Pure mathematical 3D-to-2D projection with elevation, drop-pins and heatmap.
 */

export class CanvasIsometricViewer {
  constructor(canvas, trackData, mapConfig = null, mapImageUrl = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.trackData = trackData;
    this.track = trackData.track;
    this.center = trackData.center;
    this.bounds = trackData.bounds;
    this.mapConfig = mapConfig;

    this.renderMode = mapConfig ? 'map_png' : 'isometric';

    // Isometric viewing angles
    this.azimuth = Math.PI / 4; 
    this.pitch = Math.atan(1 / Math.sqrt(2));
    
    // Adaptive elevation scaling based on real circuit topography
    this.updateVerticalExaggeration();

    this.panX = 0;
    this.panY = 0;
    this.zoom = 0.65;

    this.heatmapMode = 'throttle_brake';

    this.mapImage = null;
    this.mapLoaded = false;
    if (mapImageUrl) {
      this.loadMapImage(mapImageUrl);
    }

    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.setupInteractions();
    this.resize();
  }

  updateVerticalExaggeration() {
    // Red Bull Ring has 63.5m natural elevation (Styrian mountain) -> 1.0x true scale
    // Imola has 34.3m natural elevation -> 1.25x
    // Monza has only 12.8m (very flat) -> 2.0x so subtle gradient is visible
    if (this.bounds.height >= 50) {
      this.verticalExaggeration = 1.0;
    } else if (this.bounds.height >= 25) {
      this.verticalExaggeration = 1.25;
    } else {
      this.verticalExaggeration = 2.0;
    }
  }

  loadMapImage(url) {
    this.mapLoaded = false;
    this.mapImage = new Image();
    this.mapImage.src = url;
    this.mapImage.onload = () => {
      this.mapLoaded = true;
    };
  }

  setTrackData(trackData, mapConfig = null, mapImageUrl = null) {
    this.trackData = trackData;
    this.track = trackData.track;
    this.center = trackData.center;
    this.bounds = trackData.bounds;
    this.mapConfig = mapConfig;

    this.updateVerticalExaggeration();

    if (mapImageUrl) {
      this.loadMapImage(mapImageUrl);
    }

    if (!mapConfig && this.renderMode === 'map_png') {
      this.renderMode = 'isometric';
    }
    this.resetView();
  }

  setupInteractions() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      if (this.renderMode === 'isometric') {
        if (e.buttons === 1) {
          this.azimuth += dx * 0.008;
          this.pitch = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, this.pitch + dy * 0.008));
        } else if (e.buttons === 2) {
          this.panX += dx;
          this.panY += dy;
        }
      } else {
        this.panX += dx;
        this.panY += dy;
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoom = Math.max(0.15, Math.min(4.0, this.zoom * zoomFactor));
    }, { passive: false });
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  resetView() {
    this.azimuth = Math.PI / 4;
    this.pitch = Math.atan(1 / Math.sqrt(2));
    this.panX = 0;
    this.panY = 0;
    this.zoom = this.renderMode === 'map_png' ? 0.88 : 0.65;
  }

  projectIsometric(x, y, z) {
    const cx = this.width / 2 + this.panX;
    const cy = this.height / 2 + this.panY;

    const rx = x - this.center.x;
    const ry = (y - this.center.y) * this.verticalExaggeration;
    const rz = z - this.center.z;

    const cosA = Math.cos(this.azimuth);
    const sinA = Math.sin(this.azimuth);
    const rotX = rx * cosA - rz * sinA;
    const rotZ = rx * sinA + rz * cosA;

    const sinP = Math.sin(this.pitch);
    const cosP = Math.cos(this.pitch);

    const projX = rotX;
    const projY = rotZ * sinP - ry * cosP;
    const depth = rotZ * cosP + ry * sinP;

    const maxDim = Math.max(this.bounds.width, this.bounds.depth);
    const scale = this.zoom * Math.min(this.width, this.height) / (maxDim * 0.95);

    return {
      screenX: cx + projX * scale,
      screenY: cy + projY * scale,
      depth
    };
  }

  projectMapIni(x, z) {
    if (!this.mapConfig) return { screenX: 0, screenY: 0 };

    const { WIDTH, HEIGHT, MARGIN, SCALE_FACTOR, X_OFFSET, Z_OFFSET } = this.mapConfig;

    const rawPxX = (x + X_OFFSET + MARGIN) / SCALE_FACTOR;
    const rawPxY = (z + Z_OFFSET + MARGIN) / SCALE_FACTOR;

    const baseW = (this.mapLoaded && this.mapImage && this.mapImage.naturalWidth) ? this.mapImage.naturalWidth : WIDTH;
    const baseH = (this.mapLoaded && this.mapImage && this.mapImage.naturalHeight) ? this.mapImage.naturalHeight : HEIGHT;

    const normX = rawPxX / WIDTH;
    const normY = rawPxY / HEIGHT;

    const fitScale = Math.min((this.width * 0.9) / baseW, (this.height * 0.9) / baseH) * this.zoom;
    const renderW = baseW * fitScale;
    const renderH = baseH * fitScale;

    const offsetX = (this.width - renderW) / 2 + this.panX;
    const offsetY = (this.height - renderH) / 2 + this.panY;

    return {
      screenX: offsetX + normX * renderW,
      screenY: offsetY + normY * renderH,
      renderW,
      renderH,
      offsetX,
      offsetY,
      fitScale
    };
  }

  getHeatmapColor(point) {
    if (this.heatmapMode === 'throttle_brake') {
      if (point.brake > 0.15) {
        const alpha = Math.min(1.0, 0.45 + point.brake * 0.55);
        return `rgba(255, 45, 85, ${alpha})`;
      } else if (point.throttle > 0.4) {
        const alpha = Math.min(1.0, 0.5 + point.throttle * 0.5);
        return `rgba(50, 255, 126, ${alpha})`;
      } else {
        return 'rgba(0, 225, 255, 0.7)';
      }
    } else {
      const ratio = Math.max(0, Math.min(1, (point.speed - 60) / 280));
      if (ratio < 0.5) {
        const r = Math.round(ratio * 2 * 255);
        return `rgb(${r}, 225, 255)`;
      } else {
        const g = Math.round((1 - (ratio - 0.5) * 2) * 220);
        return `rgb(255, ${g}, 90)`;
      }
    }
  }

  render(currentCarIndex = 0) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#0a0e16');
    bgGrad.addColorStop(1, '#06080d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    if (this.renderMode === 'map_png' && this.mapConfig) {
      this.renderMapPngMode(currentCarIndex);
    } else {
      this.renderIsometricMode(currentCarIndex);
    }
  }

  renderMapPngMode(currentCarIndex) {
    const ctx = this.ctx;
    const testProj = this.projectMapIni(0, 0);

    // 1. Draw Official map.png Image
    if (this.mapLoaded && this.mapImage) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 225, 255, 0.35)';
      ctx.shadowBlur = 14;
      ctx.drawImage(
        this.mapImage,
        testProj.offsetX,
        testProj.offsetY,
        testProj.renderW,
        testProj.renderH
      );
      ctx.restore();
    }

    // 2. Draw Live Telemetry Line & Heatmap
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < this.track.length; i++) {
      const p1 = this.track[i];
      const p2 = this.track[(i + 1) % this.track.length];

      const proj1 = this.projectMapIni(p1.x, p1.z);
      const proj2 = this.projectMapIni(p2.x, p2.z);

      ctx.beginPath();
      ctx.moveTo(proj1.screenX, proj1.screenY);
      ctx.lineTo(proj2.screenX, proj2.screenY);
      ctx.strokeStyle = this.getHeatmapColor(p1);
      ctx.stroke();
    }

    // 3. Draw Active Car Token
    const carPoint = this.track[currentCarIndex % this.track.length];
    if (carPoint) {
      const carProj = this.projectMapIni(carPoint.x, carPoint.z);

      const haloGrad = ctx.createRadialGradient(
        carProj.screenX, carProj.screenY, 2,
        carProj.screenX, carProj.screenY, 18
      );
      haloGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      haloGrad.addColorStop(0.35, 'rgba(0, 225, 255, 0.8)');
      haloGrad.addColorStop(1, 'rgba(0, 225, 255, 0)');

      ctx.beginPath();
      ctx.arc(carProj.screenX, carProj.screenY, 18, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(carProj.screenX, carProj.screenY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Heading Arrow
      const nextP = this.track[(currentCarIndex + 8) % this.track.length];
      const nextProj = this.projectMapIni(nextP.x, nextP.z);
      const angle = Math.atan2(nextProj.screenY - carProj.screenY, nextProj.screenX - carProj.screenX);

      ctx.save();
      ctx.translate(carProj.screenX, carProj.screenY);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(4, -5);
      ctx.lineTo(4, 5);
      ctx.closePath();
      ctx.fillStyle = '#ffcc00';
      ctx.fill();
      ctx.restore();

      // Telemetry Bubble Tag
      ctx.save();
      ctx.fillStyle = 'rgba(10, 16, 26, 0.88)';
      ctx.strokeStyle = 'rgba(0, 225, 255, 0.4)';
      ctx.lineWidth = 1;
      const tagText = `${carPoint.speed} km/h • G${carPoint.gear} • ${carPoint.section || ''}`;
      ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
      const textW = ctx.measureText(tagText).width;

      const bx = carProj.screenX + 14;
      const by = carProj.screenY - 18;
      ctx.beginPath();
      ctx.roundRect?.(bx, by, textW + 12, 18, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#00e1ff';
      ctx.fillText(tagText, bx + 6, by + 12);
      ctx.restore();
    }
  }

  renderIsometricMode(currentCarIndex) {
    const ctx = this.ctx;
    // Base floor level placed proportionally below minimum elevation
    const floorOffset = Math.max(6, this.bounds.height * 0.12);
    const floorY = this.bounds.minY - floorOffset;

    // 1. Ground Shadow
    ctx.beginPath();
    for (let i = 0; i < this.track.length; i++) {
      const p = this.track[i];
      const proj = this.projectIsometric(p.x, floorY, p.z);
      if (i === 0) ctx.moveTo(proj.screenX, proj.screenY);
      else ctx.lineTo(proj.screenX, proj.screenY);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0, 225, 255, 0.08)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 225, 255, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Altitude Drop Pins (Every 35 points)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < this.track.length; i += 35) {
      const p = this.track[i];
      const topProj = this.projectIsometric(p.x, p.y, p.z);
      const floorProj = this.projectIsometric(p.x, floorY, p.z);

      ctx.beginPath();
      ctx.moveTo(topProj.screenX, topProj.screenY);
      ctx.lineTo(floorProj.screenX, floorProj.screenY);
      ctx.stroke();
    }

    // 3. Track Ribbon with Heatmap
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < this.track.length; i++) {
      const p1 = this.track[i];
      const p2 = this.track[(i + 1) % this.track.length];

      const proj1 = this.projectIsometric(p1.x, p1.y, p1.z);
      const proj2 = this.projectIsometric(p2.x, p2.y, p2.z);

      ctx.beginPath();
      ctx.moveTo(proj1.screenX, proj1.screenY);
      ctx.lineTo(proj2.screenX, proj2.screenY);
      ctx.strokeStyle = this.getHeatmapColor(p1);
      ctx.stroke();
    }

    // 4. Car Marker with Altitude Pin
    const carPoint = this.track[currentCarIndex % this.track.length];
    if (carPoint) {
      const carProj = this.projectIsometric(carPoint.x, carPoint.y, carPoint.z);
      const carFloorProj = this.projectIsometric(carPoint.x, floorY, carPoint.z);

      ctx.beginPath();
      ctx.moveTo(carProj.screenX, carProj.screenY);
      ctx.lineTo(carFloorProj.screenX, carFloorProj.screenY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(carFloorProj.screenX, carFloorProj.screenY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 225, 255, 0.4)';
      ctx.fill();

      const haloGrad = ctx.createRadialGradient(
        carProj.screenX, carProj.screenY, 2,
        carProj.screenX, carProj.screenY, 16
      );
      haloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      haloGrad.addColorStop(0.4, 'rgba(0, 225, 255, 0.7)');
      haloGrad.addColorStop(1, 'rgba(0, 225, 255, 0)');

      ctx.beginPath();
      ctx.arc(carProj.screenX, carProj.screenY, 16, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(carProj.screenX, carProj.screenY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }
}
