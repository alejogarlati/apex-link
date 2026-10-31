/**
 * Three.js 3D WebGL Isometric & Perspective Renderer for ApexLink
 * Supports real Assetto Corsa 3D splines (Imola, Red Bull Ring, Monza),
 * vertex color heatmaps, glowing vehicle token, light trails, and OrbitControls.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class ThreeIsometricViewer {
  constructor(container, trackData) {
    this.container = container;
    this.trackData = trackData;
    this.track = trackData.track;
    this.center = trackData.center;
    this.bounds = trackData.bounds;

    this.heatmapMode = 'throttle_brake';
    this.cameraMode = 'orthographic';

    this.initScene();
    this.buildTrackGeometry();
    this.buildGroundAndShadow();
    this.buildCarMarker();
    this.setupResize();
    this.setCameraPreset('isometric');
  }

  getYExaggeration() {
    if (this.bounds.height >= 50) return 1.0; // Red Bull Ring 63.5m -> 1.0x true scale
    if (this.bounds.height >= 25) return 1.25; // Imola 34m -> 1.25x
    return 2.0; // Monza 12.8m -> 2.0x
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e14);
    this.scene.fog = new THREE.FogExp2(0x0a0e14, 0.0005);

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;
    const aspect = width / height;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.perspectiveCamera = new THREE.PerspectiveCamera(45, aspect, 1, 8000);

    const frustumSize = Math.max(this.bounds.width, this.bounds.depth) * 1.35;
    this.frustumSize = frustumSize;
    this.orthoCamera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      8000
    );

    this.activeCamera = this.orthoCamera;

    this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight.position.set(400, 800, 400);
    this.scene.add(dirLight);

    const blueRimLight = new THREE.DirectionalLight(0x00e1ff, 0.6);
    blueRimLight.position.set(-500, 400, -500);
    this.scene.add(blueRimLight);
  }

  setTrackData(trackData) {
    this.trackData = trackData;
    this.track = trackData.track;
    this.center = trackData.center;
    this.bounds = trackData.bounds;

    if (this.trackMesh) this.scene.remove(this.trackMesh);
    if (this.grid) this.scene.remove(this.grid);
    if (this.shadowLine) this.scene.remove(this.shadowLine);
    if (this.ribs) this.scene.remove(this.ribs);

    const aspect = this.renderer.domElement.width / this.renderer.domElement.height;
    const frustumSize = Math.max(this.bounds.width, this.bounds.depth) * 1.35;
    this.frustumSize = frustumSize;
    this.orthoCamera.left = (frustumSize * aspect) / -2;
    this.orthoCamera.right = (frustumSize * aspect) / 2;
    this.orthoCamera.top = frustumSize / 2;
    this.orthoCamera.bottom = frustumSize / -2;
    this.orthoCamera.updateProjectionMatrix();

    this.buildTrackGeometry();
    this.buildGroundAndShadow();
    this.setCameraPreset('isometric');
  }

  buildTrackGeometry() {
    const yExaggeration = this.getYExaggeration();

    const points3D = this.track.map(p => new THREE.Vector3(
      p.x - this.center.x,
      (p.y - this.center.y) * yExaggeration,
      p.z - this.center.z
    ));

    this.curve = new THREE.CatmullRomCurve3(points3D, true);

    const tubularSegments = this.track.length;
    const radius = Math.max(2.2, this.bounds.width * 0.0028);
    const radialSegments = 8;
    this.trackGeometry = new THREE.TubeGeometry(this.curve, tubularSegments, radius, radialSegments, true);

    this.updateTrackColors();

    const trackMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.35,
      metalness: 0.25,
      emissive: new THREE.Color(0x001122),
      emissiveIntensity: 0.3
    });

    this.trackMesh = new THREE.Mesh(this.trackGeometry, trackMaterial);
    this.scene.add(this.trackMesh);
  }

  updateTrackColors() {
    const count = this.trackGeometry.attributes.position.count;
    const colors = new Float32Array(count * 3);

    const numPoints = this.track.length;
    const radialSegments = 8;

    for (let i = 0; i <= numPoints; i++) {
      const point = this.track[i % numPoints];
      let r = 0, g = 0.88, b = 1.0;

      if (this.heatmapMode === 'throttle_brake') {
        if (point.brake > 0.15) {
          r = 1.0; g = 0.15; b = 0.3;
        } else if (point.throttle > 0.4) {
          r = 0.2; g = 1.0; b = 0.45;
        } else {
          r = 0.0; g = 0.85; b = 1.0;
        }
      } else {
        const ratio = Math.max(0, Math.min(1, (point.speed - 60) / 280));
        r = Math.min(1.0, ratio * 1.5);
        g = Math.min(1.0, 1.2 - Math.abs(ratio - 0.5) * 1.5);
        b = Math.max(0.1, 1.0 - ratio * 1.2);
      }

      for (let j = 0; j <= radialSegments; j++) {
        const vertexIndex = (i * (radialSegments + 1) + j);
        if (vertexIndex < count) {
          colors[vertexIndex * 3] = r;
          colors[vertexIndex * 3 + 1] = g;
          colors[vertexIndex * 3 + 2] = b;
        }
      }
    }

    this.trackGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.trackGeometry.attributes.color.needsUpdate = true;
  }

  buildGroundAndShadow() {
    const yExaggeration = this.getYExaggeration();
    const floorOffset = Math.max(8, this.bounds.height * 0.15);
    const floorY = (this.bounds.minY - this.center.y) * yExaggeration - floorOffset;
    const gridSize = Math.max(this.bounds.width, this.bounds.depth) * 1.6;

    this.grid = new THREE.GridHelper(gridSize, 36, 0x00e1ff, 0x162232);
    this.grid.position.y = floorY;
    this.grid.material.opacity = 0.22;
    this.grid.material.transparent = true;
    this.scene.add(this.grid);

    const shadowPoints = this.track.map(p => new THREE.Vector3(
      p.x - this.center.x,
      floorY + 0.5,
      p.z - this.center.z
    ));
    shadowPoints.push(shadowPoints[0]);

    const shadowGeo = new THREE.BufferGeometry().setFromPoints(shadowPoints);
    const shadowMat = new THREE.LineBasicMaterial({
      color: 0x00e1ff,
      transparent: true,
      opacity: 0.35
    });
    this.shadowLine = new THREE.Line(shadowGeo, shadowMat);
    this.scene.add(this.shadowLine);

    const ribGeo = new THREE.BufferGeometry();
    const ribPositions = [];
    const step = Math.max(15, Math.floor(this.track.length / 50));

    for (let i = 0; i < this.track.length; i += step) {
      const p = this.track[i];
      ribPositions.push(p.x - this.center.x, (p.y - this.center.y) * yExaggeration, p.z - this.center.z);
      ribPositions.push(p.x - this.center.x, floorY + 0.5, p.z - this.center.z);
    }
    ribGeo.setAttribute('position', new THREE.Float32BufferAttribute(ribPositions, 3));
    const ribMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12
    });
    this.ribs = new THREE.LineSegments(ribGeo, ribMat);
    this.scene.add(this.ribs);
  }

  buildCarMarker() {
    this.carGroup = new THREE.Group();

    const carGeo = new THREE.ConeGeometry(5.0, 14, 4);
    carGeo.rotateX(Math.PI / 2);
    const carMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00e1ff,
      emissiveIntensity: 0.85,
      metalness: 0.8,
      roughness: 0.2
    });
    this.carMesh = new THREE.Mesh(carGeo, carMat);
    this.carGroup.add(this.carMesh);

    this.headlight = new THREE.PointLight(0x00ffff, 3.0, 70);
    this.headlight.position.set(0, 2, 6);
    this.carGroup.add(this.headlight);

    const pinGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -50, 0)
    ]);
    this.pinLine = new THREE.Line(pinGeo, new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 2,
      gapSize: 2,
      opacity: 0.5,
      transparent: true
    }));
    this.pinLine.computeLineDistances();
    this.carGroup.add(this.pinLine);

    this.scene.add(this.carGroup);

    this.trailLength = 40;
    this.trailPositions = new Float32Array(this.trailLength * 3);
    this.trailGeo = new THREE.BufferGeometry();
    this.trailGeo.setAttribute('position', new THREE.BufferAttribute(this.trailPositions, 3));
    this.trailMat = new THREE.LineBasicMaterial({
      color: 0xffcc00,
      linewidth: 3,
      transparent: true,
      opacity: 0.85
    });
    this.trailLine = new THREE.Line(this.trailGeo, this.trailMat);
    this.scene.add(this.trailLine);
  }

  setCameraPreset(preset) {
    const dist = Math.max(this.bounds.width, this.bounds.depth) * 0.95;
    if (preset === 'isometric') {
      this.activeCamera.position.set(dist, dist * 0.82, dist);
    } else if (preset === 'topdown') {
      this.activeCamera.position.set(0, dist * 1.4, 0);
    } else if (preset === 'side') {
      this.activeCamera.position.set(dist * 1.3, dist * 0.15, 0);
    }
    this.activeCamera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  toggleCameraMode() {
    const prevPos = this.activeCamera.position.clone();
    if (this.cameraMode === 'orthographic') {
      this.cameraMode = 'perspective';
      this.activeCamera = this.perspectiveCamera;
    } else {
      this.cameraMode = 'orthographic';
      this.activeCamera = this.orthoCamera;
    }
    this.activeCamera.position.copy(prevPos);
    this.controls.object = this.activeCamera;
    this.controls.update();
    return this.cameraMode;
  }

  setupResize() {
    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      if (!width || !height) return;
      const aspect = width / height;

      this.renderer.setSize(width, height);

      this.perspectiveCamera.aspect = aspect;
      this.perspectiveCamera.updateProjectionMatrix();

      this.orthoCamera.left = (this.frustumSize * aspect) / -2;
      this.orthoCamera.right = (this.frustumSize * aspect) / 2;
      this.orthoCamera.top = this.frustumSize / 2;
      this.orthoCamera.bottom = this.frustumSize / -2;
      this.orthoCamera.updateProjectionMatrix();
    });
  }

  update(currentCarIndex = 0) {
    this.controls.update();

    const carPoint = this.track[currentCarIndex % this.track.length];
    const nextPoint = this.track[(currentCarIndex + 5) % this.track.length];

    if (carPoint && nextPoint) {
      const yExaggeration = this.getYExaggeration();

      const px = carPoint.x - this.center.x;
      const py = (carPoint.y - this.center.y) * yExaggeration;
      const pz = carPoint.z - this.center.z;

      this.carGroup.position.set(px, py, pz);

      const nx = nextPoint.x - this.center.x;
      const ny = (nextPoint.y - this.center.y) * yExaggeration;
      const nz = nextPoint.z - this.center.z;
      this.carGroup.lookAt(nx, ny, nz);

      for (let i = 0; i < this.trailLength; i++) {
        const histIndex = (currentCarIndex - i + this.track.length) % this.track.length;
        const hp = this.track[histIndex];
        this.trailPositions[i * 3] = hp.x - this.center.x;
        this.trailPositions[i * 3 + 1] = (hp.y - this.center.y) * yExaggeration;
        this.trailPositions[i * 3 + 2] = hp.z - this.center.z;
      }
      this.trailGeo.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.activeCamera);
  }
}
