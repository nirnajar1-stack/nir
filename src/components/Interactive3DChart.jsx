import React, { useState, useEffect, useRef, useCallback } from 'react';
import { COLORS, subCategoryData, LABELS } from '../data.js';
import {
  THRESHOLDS_3D,
  getQuadrantForItem,
  buildQuadrantBounds,
  QUADRANT_UI,
  TRAVEL_MS,
  EXIT_TRAVEL_MS,
  easeOutCubic,
  easeInOutCubic,
} from '../utils/matrix3dQuadrants.js';
import Matrix3DSubStatsPanel from './Matrix3DSubStatsPanel.jsx';
import {
  createSpaceship,
  computeChaseCamera,
  getSpaceshipTargetForQuadrant,
  lerpAngleDeg,
  LAUNCH_PREP_END,
  SHIP_FLIGHT_END,
} from '../utils/matrix3dSpaceship.js';
import { matrixFlightSound } from '../utils/matrix3dFlightSound.js';
import { buildMatrix3DEnvironment } from '../utils/matrix3dEnvironment.js';

const DOMAIN = { familiesMax: 80, slaMax: 40, tasksMax: 220 };
const THRESHOLDS = THRESHOLDS_3D;
const AXIS_ORIGIN = { x: -5, y: -5, z: -5 };
const AXIS_YELLOW = 0xeab308;
const AXIS_COLORS = { x: AXIS_YELLOW, y: 0x22c55e, z: 0x3b82f6 };
const QUADRANT_COLORS = {
  quick: 0x3b82f6,
  niche: 0xf59e0b,
  broad: 0x10b981,
  handoff: AXIS_YELLOW,
};
const LABEL_MIN_DISTANCE_PX = 76;
const OVERVIEW_CAMERA = { theta: 38, phi: 62, lookAt: { x: 0, y: 0.2, z: 0 } };

const mapX = (v) => (v / DOMAIN.familiesMax) * 10 - 5;
const mapY = (v) => (v / DOMAIN.slaMax) * 10 - 5;
const mapZ = (v) => (v / DOMAIN.tasksMax) * 10 - 5;

function createAxisArrow(THREE, scene, from, to, color) {
  const fromVec = new THREE.Vector3(from.x, from.y, from.z);
  const toVec = new THREE.Vector3(to.x, to.y, to.z);
  const direction = new THREE.Vector3().subVectors(toVec, fromVec);
  const length = direction.length();
  direction.normalize();
  const arrow = new THREE.ArrowHelper(direction, fromVec, length, color, 0.45, 0.28);
  scene.add(arrow);
  return arrow;
}

function createAxisLabelSprite(THREE, text, hexColor, scale = 3.2) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 360;
  canvas.height = 80;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = hexColor;
  ctx.font = 'bold 24px Heebo, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale * 0.28, 1);
  sprite.renderOrder = 10;
  return sprite;
}

function createTickSprite(THREE, text) {
  return createAxisLabelSprite(THREE, text, '#7a8fa8', 1.4);
}

function addQuadrantVolume(THREE, scene, min, max, color, opacity, quadrantId) {
  const w = max.x - min.x;
  const h = max.y - min.y;
  const d = max.z - min.z;
  if (w <= 0 || h <= 0 || d <= 0) return null;

  const geom = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2);
  mesh.renderOrder = 0;
  mesh.userData = { quadrantId, isQuadrant: true };
  scene.add(mesh);
  return { mesh, geom, mat };
}

/** מנהרת תולעת — טבעות ספירליות, הליקס, גלים ופסי מהירות */
function createWormholeTunnel(THREE, camera) {
  const group = new THREE.Group();
  group.visible = false;
  group.name = 'wormholeTunnel';
  camera.add(group);

  const accentColor = new THREE.Color(0x818cf8);
  const whiteColor = new THREE.Color(0xffffff);
  const allParts = [];

  const rings = [];
  const RING_COUNT = 72;
  for (let i = 0; i < RING_COUNT; i += 1) {
    const radius = 0.22 + (i % 8) * 0.038;
    const geom = new THREE.TorusGeometry(radius, 0.012 + (i % 3) * 0.004, 6, 40);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.z = -1.5 - i * 0.45;
    mesh.userData = {
      baseZ: mesh.position.z,
      speed: 0.85 + (i % 7) * 0.14,
      twist: (i / RING_COUNT) * Math.PI * 2,
      alt: i % 2 === 0,
    };
    group.add(mesh);
    rings.push({ mesh, geom, mat });
    allParts.push({ geom, mat });
  }

  const helix = [];
  const HELIX_COUNT = 40;
  for (let i = 0; i < HELIX_COUNT; i += 1) {
    const geom = new THREE.TorusGeometry(0.55 + (i % 5) * 0.08, 0.006, 4, 28);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xc4b5fd,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.x = Math.PI / 2;
    const angle = (i / HELIX_COUNT) * Math.PI * 4;
    mesh.position.set(Math.cos(angle) * 0.35, Math.sin(angle) * 0.35, -2 - i * 0.55);
    mesh.userData = { baseZ: mesh.position.z, helixAngle: angle, speed: 1.1 + (i % 4) * 0.15 };
    group.add(mesh);
    helix.push({ mesh, geom, mat });
    allParts.push({ geom, mat });
  }

  const streaks = [];
  const STREAK_COUNT = 48;
  for (let i = 0; i < STREAK_COUNT; i += 1) {
    const angle = (i / STREAK_COUNT) * Math.PI * 2;
    const geom = new THREE.CylinderGeometry(0.004, 0.035, 2.8, 4);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xa5b4fc,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.z = angle;
    const radial = 0.55 + (i % 6) * 0.22;
    mesh.position.set(Math.cos(angle) * radial, Math.sin(angle) * radial, -2 - (i % 10) * 0.35);
    mesh.userData = { angle, speed: 1.2 + (i % 5) * 0.25, baseZ: mesh.position.z };
    group.add(mesh);
    streaks.push({ mesh, geom, mat });
    allParts.push({ geom, mat });
  }

  const shockwaves = [];
  for (let i = 0; i < 4; i += 1) {
    const geom = new THREE.TorusGeometry(0.5 + i * 0.15, 0.02, 8, 48);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.z = -4 - i * 0.5;
    mesh.userData = { waveIndex: i };
    group.add(mesh);
    shockwaves.push({ mesh, geom, mat });
    allParts.push({ geom, mat });
  }

  const coreGeom = new THREE.CylinderGeometry(0.02, 1.35, 16, 40, 1, true);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x1e1b4b,
    transparent: true,
    opacity: 0,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const core = new THREE.Mesh(coreGeom, coreMat);
  core.rotation.x = Math.PI / 2;
  core.position.z = -8;
  group.add(core);
  allParts.push({ geom: coreGeom, mat: coreMat });

  const update = (intensity, hexAccent, progress = 0) => {
    if (hexAccent) accentColor.setHex(hexAccent);
    group.visible = intensity > 0.02;
    if (!group.visible) return;

    const peak = Math.sin(progress * Math.PI) ** 0.65;
    const rushMult = 0.35 + intensity * 2.2 + peak * 1.8;
    group.rotation.z += 0.045 * intensity + peak * 0.02;
    const now = performance.now() * 0.001;

    rings.forEach((r) => {
      r.mesh.position.z += rushMult * r.mesh.userData.speed * 0.11;
      const depth = -r.mesh.position.z;
      const pulse = Math.sin(depth * 2.2 + now * 6 + r.mesh.userData.twist) * 0.5 + 0.5;
      r.mat.opacity = Math.min(1, depth * 0.24 * intensity) * (0.5 + pulse * 0.5);
      r.mat.color.copy(r.mesh.userData.alt ? whiteColor : accentColor);
      const scale = 0.28 + depth * 0.5 + peak * 0.15;
      r.mesh.scale.set(scale, scale, scale * 0.82);
      r.mesh.rotation.z = r.mesh.userData.twist + now * 1.1 * intensity;
      if (r.mesh.position.z > 2.2) {
        r.mesh.position.z = -1.5 - Math.random() * 28;
      }
    });

    helix.forEach((h) => {
      h.mesh.position.z += rushMult * h.mesh.userData.speed * 0.09;
      const depth = -h.mesh.position.z;
      h.mat.opacity = Math.min(0.75, depth * 0.14 * intensity) * (0.6 + peak * 0.4);
      h.mat.color.copy(accentColor).lerp(whiteColor, 0.35);
      const a = h.mesh.userData.helixAngle + now * 2.5 * intensity;
      h.mesh.position.x = Math.cos(a) * 0.4 * (1 + peak * 0.3);
      h.mesh.position.y = Math.sin(a) * 0.4 * (1 + peak * 0.3);
      h.mesh.rotation.z = a;
      if (h.mesh.position.z > 2) h.mesh.position.z = -2 - Math.random() * 22;
    });

    streaks.forEach((s) => {
      s.mesh.position.z += rushMult * s.mesh.userData.speed * 0.12;
      const depth = -s.mesh.position.z;
      s.mat.opacity = Math.min(0.85, depth * 0.22 * intensity) * (0.7 + peak * 0.3);
      s.mat.color.copy(accentColor);
      s.mesh.scale.y = 1 + peak * 2.5;
      if (s.mesh.position.z > 1.5) s.mesh.position.z = -2 - Math.random() * 20;
    });

    shockwaves.forEach((sw) => {
      const phase = (progress * 3 + sw.mesh.userData.waveIndex * 0.2) % 1;
      sw.mesh.position.z = -3 - phase * 12;
      sw.mat.opacity = (1 - phase) * intensity * 0.55 * peak;
      sw.mesh.scale.setScalar(0.6 + phase * 2.8 + peak);
      sw.mat.color.copy(accentColor).lerp(whiteColor, phase);
    });

    coreMat.opacity = intensity * (0.35 + peak * 0.35);
    coreMat.color.copy(accentColor).multiplyScalar(0.25);
    core.rotation.z = now * 0.65 * intensity;
    core.position.z = -8 + intensity * 2 + peak;
    core.scale.setScalar(1 + peak * 0.4);
  };

  const reset = () => {
    rings.forEach((r) => {
      r.mesh.position.z = r.mesh.userData.baseZ;
      r.mat.opacity = 0;
      r.mesh.scale.set(1, 1, 1);
    });
    helix.forEach((h) => {
      h.mesh.position.z = h.mesh.userData.baseZ;
      h.mat.opacity = 0;
    });
    streaks.forEach((s) => {
      s.mesh.position.z = s.mesh.userData.baseZ;
      s.mat.opacity = 0;
      s.mesh.scale.y = 1;
    });
    shockwaves.forEach((sw) => {
      sw.mat.opacity = 0;
      sw.mesh.scale.setScalar(1);
    });
    core.position.z = -8;
    core.scale.setScalar(1);
    coreMat.opacity = 0;
    group.rotation.z = 0;
  };

  const dispose = () => {
    allParts.forEach((p) => {
      p.geom.dispose();
      p.mat.dispose();
    });
    camera.remove(group);
  };

  return { group, update, reset, dispose };
}

function disposeObject(obj) {
  if (!obj) return;
  if (obj.parent) obj.parent.remove(obj);
  obj.geometry?.dispose();
  if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
  else obj.material?.dispose();
}

function disposeArrow(arrow) {
  if (arrow?.parent) arrow.parent.remove(arrow);
  arrow?.line?.geometry?.dispose();
  arrow?.line?.material?.dispose();
  arrow?.cone?.geometry?.dispose();
  arrow?.cone?.material?.dispose();
}

function isHandoffQuadrant(item) {
  return getQuadrantForItem(item) === 'handoff';
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function Interactive3DChart({ isFullscreen = false }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const hoveredMeshRef = useRef(null);
  const selectedMeshRef = useRef(null);
  const applyStylesRef = useRef(null);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [projectedLabels, setProjectedLabels] = useState([]);
  const [focusQuadrant, setFocusQuadrant] = useState(null);
  const [focusPhase, setFocusPhase] = useState('idle');
  const [soundMuted, setSoundMuted] = useState(() => {
    try {
      return localStorage.getItem('matrix3d-sound-muted') === '1';
    } catch {
      return false;
    }
  });

  const resetCameraRef = useRef(null);
  const startFocusRef = useRef(null);
  const exitFocusRef = useRef(null);
  const focusQuadrantRef = useRef(null);
  const focusPhaseRef = useRef('idle');

  useEffect(() => {
    focusQuadrantRef.current = focusQuadrant;
    focusPhaseRef.current = focusPhase;
  }, [focusQuadrant, focusPhase]);

  useEffect(() => {
    matrixFlightSound.setMuted(soundMuted);
  }, [soundMuted]);

  useEffect(() => {
    matrixFlightSound.load();
  }, []);

  useEffect(() => {
    if (window.THREE) {
      setThreeLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => setThreeLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!threeLoaded || !canvasRef.current || !containerRef.current) return;

    const THREE = window.THREE;
    const container = containerRef.current;
    const disposables = [];

    const getSize = () => ({
      width: container.clientWidth || window.innerWidth,
      height: container.clientHeight || (isFullscreen ? window.innerHeight - 120 : 550),
    });

    let { width, height } = getSize();

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const overviewRadius = isFullscreen ? 15 : 19;
    let radius = overviewRadius;
    let theta = OVERVIEW_CAMERA.theta;
    let phi = OVERVIEW_CAMERA.phi;
    let targetTheta = theta;
    let targetPhi = phi;
    let targetRadius = radius;

    const lookAtPoint = new THREE.Vector3(
      OVERVIEW_CAMERA.lookAt.x,
      OVERVIEW_CAMERA.lookAt.y,
      OVERVIEW_CAMERA.lookAt.z,
    );
    const targetLookAt = lookAtPoint.clone();

    const updateCamera = () => {
      const phiRad = (phi * Math.PI) / 180;
      const thetaRad = (theta * Math.PI) / 180;
      camera.position.x = lookAtPoint.x + radius * Math.sin(phiRad) * Math.sin(thetaRad);
      camera.position.y = lookAtPoint.y + radius * Math.cos(phiRad);
      camera.position.z = lookAtPoint.z + radius * Math.sin(phiRad) * Math.cos(thetaRad);
      camera.lookAt(lookAtPoint);
    };

    updateCamera();

    const xSplit = mapX(THRESHOLDS.families);
    const ySplit = mapY(THRESHOLDS.sla);
    const bounds = buildQuadrantBounds(xSplit, ySplit);

    const matrixEnv = buildMatrix3DEnvironment(THREE, scene, {
      xSplit,
      ySplit,
      quadrantColors: QUADRANT_COLORS,
    });
    const { boxFrame, floorMesh, dividerMeshes, baseFogDensity, updateEnvironment } = matrixEnv;
    disposables.push(...matrixEnv.disposables);

    const wormhole = createWormholeTunnel(THREE, camera);
    const spaceship = createSpaceship(THREE, scene);

    const quadrantMeshes = [];
    const quadrantBaseOpacity = { quick: 0.09, niche: 0.09, broad: 0.09, handoff: 0.13 };

    QUADRANT_UI.forEach((q) => {
      const b = bounds[q.id];
      const vol = addQuadrantVolume(
        THREE,
        scene,
        b.min,
        b.max,
        QUADRANT_COLORS[q.id],
        quadrantBaseOpacity[q.id],
        q.id,
      );
      if (vol) {
        vol.mesh.raycast = () => {};
        quadrantMeshes.push(vol.mesh);
        disposables.push(vol);
      }
    });

    const axisArrows = [
      createAxisArrow(THREE, scene, AXIS_ORIGIN, { x: 5, y: -5, z: -5 }, AXIS_COLORS.x),
      createAxisArrow(THREE, scene, AXIS_ORIGIN, { x: -5, y: 5, z: -5 }, AXIS_COLORS.y),
      createAxisArrow(THREE, scene, AXIS_ORIGIN, { x: -5, y: -5, z: 5 }, AXIS_COLORS.z),
    ];

    const axisLabels = [];
    const labelX = createAxisLabelSprite(THREE, 'תפוצה — משפחות בטיפול', '#eab308');
    labelX.position.set(5.85, -5, -5);
    axisLabels.push(labelX);
    scene.add(labelX);

    const labelY = createAxisLabelSprite(THREE, 'מאמץ — SLA (ימים)', '#22c55e');
    labelY.position.set(-5, 5.85, -5);
    axisLabels.push(labelY);
    scene.add(labelY);

    const labelZ = createAxisLabelSprite(THREE, 'נפח משימות', '#3b82f6');
    labelZ.position.set(-5, -5, 5.85);
    axisLabels.push(labelZ);
    scene.add(labelZ);

    const tickSprites = [];
    [0, 20, 40, 60, 80].forEach((v) => {
      const s = createTickSprite(THREE, String(v));
      s.position.set(mapX(v), -5.15, -5.35);
      tickSprites.push(s);
      scene.add(s);
    });
    [0, 10, 20, 30, 40].forEach((v) => {
      const s = createTickSprite(THREE, String(v));
      s.position.set(-5.55, mapY(v), -5.35);
      tickSprites.push(s);
      scene.add(s);
    });
    [0, 55, 110, 165, 220].forEach((v) => {
      const s = createTickSprite(THREE, String(v));
      s.position.set(-5.55, -5.15, mapZ(v));
      tickSprites.push(s);
      scene.add(s);
    });

    const spheresGroup = new THREE.Group();
    const sphereDataAssoc = [];
    const maxTasks = Math.max(...subCategoryData.map((d) => d.tasks));

    subCategoryData.forEach((item) => {
      const taskNorm = item.tasks / maxTasks;
      const size = 0.14 + taskNorm * 0.42;
      const geom = new THREE.SphereGeometry(size, 24, 24);
      const baseColor = new THREE.Color(COLORS[item.main]);
      const risk = isHandoffQuadrant(item);
      const quadrantId = getQuadrantForItem(item);

      const mat = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.35,
        metalness: 0.2,
        emissive: baseColor.clone(),
        emissiveIntensity: risk ? 0.28 : 0.1,
        transparent: true,
        opacity: 1,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(mapX(item.families), mapY(item.sla), mapZ(item.tasks));
      mesh.userData = { item, baseScale: 1, risk, quadrantId };

      if (risk) {
        const glowGeom = new THREE.SphereGeometry(size * 1.55, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
          color: AXIS_YELLOW,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
        });
        const glow = new THREE.Mesh(glowGeom, glowMat);
        mesh.add(glow);
        disposables.push({ mesh: glow, geom: glowGeom, mat: glowMat });
      }

      spheresGroup.add(mesh);
      sphereDataAssoc.push({ mesh, data: item, mat, geom, quadrantId });
    });
    scene.add(spheresGroup);

    let focusedQuadrant = null;
    let focusTravel = null;
    let lastAnimNow = performance.now();
    let travelFov = 42;
    let travelFogMul = 1;
    let travelExposure = 1.05;

    const getCameraPreset = (quadrantId) => {
      const meta = QUADRANT_UI.find((q) => q.id === quadrantId);
      const center = bounds[quadrantId].center;
      return {
        theta: meta.cam.theta,
        phi: meta.cam.phi,
        radius: meta.cam.radius,
        lookAt: new THREE.Vector3(center.x, center.y, center.z),
      };
    };

    const applyCameraPreset = (preset) => {
      theta = preset.theta;
      phi = preset.phi;
      radius = preset.radius;
      lookAtPoint.copy(preset.lookAt);
      targetTheta = theta;
      targetPhi = phi;
      targetRadius = radius;
      targetLookAt.copy(lookAtPoint);
    };

    const applyFocusVisuals = (activeQuadrant, blend = 1) => {
      const inFocus = activeQuadrant != null;
      quadrantMeshes.forEach((mesh) => {
        const qId = mesh.userData.quadrantId;
        const base = quadrantBaseOpacity[qId];
        if (!inFocus) {
          mesh.material.opacity = base;
        } else if (qId === activeQuadrant) {
          mesh.material.opacity = lerp(base, 0.28, blend);
        } else {
          mesh.material.opacity = lerp(base, 0, blend);
        }
      });

      boxFrame.material.opacity = inFocus ? lerp(0.55, 0.2, blend) : 0.55;
      floorMesh.material.opacity = inFocus ? lerp(0.94, 0.55, blend) : 0.94;
      dividerMeshes.forEach((mesh) => {
        mesh.material.opacity = inFocus ? lerp(0.85, 0.4, blend) : 0.85;
      });

      const selectedMesh = selectedMeshRef.current;
      sphereDataAssoc.forEach(({ mesh, mat, data, quadrantId }) => {
        const isHovered = mesh === hoveredMeshRef.current;
        const isSelected = mesh === selectedMesh;
        const isHighlighted = isHovered || isSelected;
        const inQuadrant = !inFocus || quadrantId === activeQuadrant;
        if (!inQuadrant) {
          mesh.scale.setScalar(1);
          mat.opacity = lerp(0.92, 0.04, blend);
          mat.emissiveIntensity = 0.05;
          return;
        }
        const dimmed = (hoveredMeshRef.current || selectedMesh) && !isHighlighted;
        mesh.scale.setScalar(isHighlighted ? (isSelected ? 1.55 : 1.4) : 1);
        mat.emissiveIntensity = isHighlighted ? 0.6 : isHandoffQuadrant(data) ? 0.28 : 0.1;
        mat.opacity = dimmed ? lerp(0.28, 0.45, 1 - blend) : lerp(0.92, 1, blend);
      });
    };

    const playTravelSoundLocal = (exiting) => {
      matrixFlightSound.resume().then((ok) => {
        if (ok) matrixFlightSound.start({ exiting });
      });
    };

    const beginFocusTravel = (quadrantId) => {
      const preset = getCameraPreset(quadrantId);
      const duration = TRAVEL_MS;
      const shipTarget = getSpaceshipTargetForQuadrant(quadrantId, bounds);
      focusTravel = {
        quadrantId,
        exiting: false,
        startTime: performance.now(),
        duration,
        shipTarget,
        shipFromPos: {
          x: spaceship.group.position.x,
          y: spaceship.group.position.y,
          z: spaceship.group.position.z,
        },
        from: {
          theta,
          phi,
          radius,
          lookAt: lookAtPoint.clone(),
        },
        to: {
          theta: preset.theta,
          phi: preset.phi,
          radius: preset.radius,
          lookAt: preset.lookAt,
        },
      };
      focusedQuadrant = null;
      setSelectedPoint(null);
      selectedMeshRef.current = null;
      wormhole.reset();
      spaceship.resetFlightPath?.();
      spaceship.hideJumpLane?.();
      lastAnimNow = performance.now();
      travelFov = camera.fov;
      travelFogMul = 1;
      travelExposure = renderer.toneMappingExposure;
      setFocusQuadrant(quadrantId);
      setFocusPhase('traveling');
      idleFrames = 0;
      playTravelSoundLocal(false);
    };

    const beginExitTravel = () => {
      const lastQ = focusQuadrantRef.current;
      focusTravel = {
        quadrantId: null,
        lastQuadrantId: lastQ,
        exiting: true,
        startTime: performance.now(),
        duration: EXIT_TRAVEL_MS,
        shipFromPos: {
          x: spaceship.group.position.x,
          y: spaceship.group.position.y,
          z: spaceship.group.position.z,
        },
        from: {
          theta,
          phi,
          radius,
          lookAt: lookAtPoint.clone(),
        },
        to: {
          theta: OVERVIEW_CAMERA.theta,
          phi: OVERVIEW_CAMERA.phi,
          radius: overviewRadius,
          lookAt: new THREE.Vector3(
            OVERVIEW_CAMERA.lookAt.x,
            OVERVIEW_CAMERA.lookAt.y,
            OVERVIEW_CAMERA.lookAt.z,
          ),
        },
      };
      focusedQuadrant = lastQ;
      wormhole.reset();
      spaceship.resetFlightPath?.();
      lastAnimNow = performance.now();
      travelFov = camera.fov;
      travelFogMul = 1;
      travelExposure = renderer.toneMappingExposure;
      setFocusPhase('traveling');
      idleFrames = 0;
      playTravelSoundLocal(true);
    };

    startFocusRef.current = beginFocusTravel;
    exitFocusRef.current = () => {
      if (focusPhaseRef.current === 'idle' && !focusQuadrantRef.current) {
        targetTheta = OVERVIEW_CAMERA.theta;
        targetPhi = OVERVIEW_CAMERA.phi;
        targetRadius = overviewRadius;
        targetLookAt.set(
          OVERVIEW_CAMERA.lookAt.x,
          OVERVIEW_CAMERA.lookAt.y,
          OVERVIEW_CAMERA.lookAt.z,
        );
        return;
      }
      beginExitTravel();
    };

    resetCameraRef.current = () => {
      if (focusQuadrantRef.current || focusPhaseRef.current !== 'idle') {
        exitFocusRef.current?.();
      } else {
        targetTheta = OVERVIEW_CAMERA.theta;
        targetPhi = OVERVIEW_CAMERA.phi;
        targetRadius = overviewRadius;
        targetLookAt.set(
          OVERVIEW_CAMERA.lookAt.x,
          OVERVIEW_CAMERA.lookAt.y,
          OVERVIEW_CAMERA.lookAt.z,
        );
      }
    };

    let isDragging = false;
    let dragDistance = 0;
    let previousMousePosition = { x: 0, y: 0 };
    let idleFrames = 0;
    let autoRotateEnabled = true;

    const applyPointStyles = (activeMesh) => {
      hoveredMeshRef.current = activeMesh;
      applyFocusVisuals(focusedQuadrant ?? focusQuadrantRef.current, 1);
    };
    applyStylesRef.current = applyPointStyles;

    const selectSphere = (data, mesh) => {
      setSelectedPoint(data);
      selectedMeshRef.current = mesh;
      setHoveredPoint(data);
      hoveredMeshRef.current = mesh;
      applyPointStyles(mesh);
    };

    const handleMouseDown = (e) => {
      matrixFlightSound.resume();
      isDragging = true;
      dragDistance = 0;
      idleFrames = 0;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const findDataMesh = (obj) => {
      let current = obj;
      while (current) {
        if (current.userData?.item) return current;
        current = current.parent;
      }
      return null;
    };

    const pickAt = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
      const raycaster = new THREE.Raycaster();
      raycaster.params.Points = { threshold: 0.15 };
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);

      const sphereHits = raycaster.intersectObjects(spheresGroup.children, true);
      for (const hit of sphereHits) {
        const mesh = findDataMesh(hit.object);
        if (mesh) return { type: 'sphere', mesh };
      }
      return null;
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        dragDistance += Math.hypot(deltaX, deltaY);
        if (focusPhaseRef.current !== 'traveling') {
          targetTheta -= deltaX * 0.4;
          targetPhi = Math.max(12, Math.min(168, targetPhi + deltaY * 0.4));
        }
        previousMousePosition = { x: e.clientX, y: e.clientY };
        idleFrames = 0;
      }

      const pick = pickAt(e.clientX, e.clientY);
      if (pick?.type === 'sphere') {
        const collided = sphereDataAssoc.find((s) => s.mesh === pick.mesh);
        if (collided) {
          setHoveredPoint(collided.data);
          applyPointStyles(collided.mesh);
          document.body.style.cursor = 'pointer';
          return;
        }
      }

      setHoveredPoint(null);
      applyPointStyles(selectedMeshRef.current);
      document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
    };

    const handleMouseUp = (e) => {
      const wasDragging = isDragging;
      isDragging = false;
      document.body.style.cursor = 'grab';

      if (dragDistance < 8 && wasDragging && focusPhaseRef.current !== 'traveling') {
        const pick = pickAt(e.clientX, e.clientY);
        if (pick?.type === 'sphere') {
          e.stopPropagation?.();
          const collided = sphereDataAssoc.find((s) => s.mesh === pick.mesh);
          if (collided) selectSphere(collided.data, collided.mesh);
          return;
        }
        setSelectedPoint(null);
        selectedMeshRef.current = null;
        applyPointStyles(null);
        setHoveredPoint(null);
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      if (focusPhaseRef.current !== 'traveling') {
        const maxR = focusedQuadrant ? 14 : 32;
        const minR = focusedQuadrant ? 5.5 : 8;
        targetRadius = Math.max(minR, Math.min(maxR, targetRadius + e.deltaY * 0.022));
      }
      idleFrames = 0;
    };

    const handleDblClick = () => {
      resetCameraRef.current?.();
    };

    const canvasDom = canvasRef.current;
    canvasDom.addEventListener('mousedown', handleMouseDown);
    canvasDom.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvasDom.addEventListener('wheel', handleWheel, { passive: false });
    canvasDom.addEventListener('dblclick', handleDblClick);

    let animationFrameId;

    const damp = (cur, tgt, dt, rate) => cur + (tgt - cur) * (1 - Math.exp(-rate * dt));

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min(0.05, (now - lastAnimNow) / 1000) || 0.016;
      lastAnimNow = now;
      const travelAccent = focusTravel
        ? (focusTravel.exiting
          ? 0x64748b
          : QUADRANT_COLORS[focusTravel.quadrantId] ?? 0x818cf8)
        : null;

      const shipState = spaceship.tick(
        now,
        focusTravel,
        focusedQuadrant ?? focusQuadrantRef.current,
        bounds,
        travelAccent,
        dt,
      );

      if (focusTravel) {
        const elapsed = now - focusTravel.startTime;
        const rawT = Math.min(1, elapsed / focusTravel.duration);
        const trans = computeChaseCamera(focusTravel, rawT, shipState);
        const chaseNow = shipState?.chaseActive && rawT > LAUNCH_PREP_END && rawT < 0.92;
        const snapCam = rawT > 0.94;
        const camRate = snapCam ? 18 : chaseNow ? 7 : 11;
        const a = 1 - Math.exp(-camRate * dt);

        if (snapCam) {
          theta = trans.theta;
          phi = trans.phi;
          radius = trans.radius;
          lookAtPoint.set(trans.lookAt.x, trans.lookAt.y, trans.lookAt.z);
        } else {
          theta = lerpAngleDeg(theta, trans.theta, a);
          phi += (trans.phi - phi) * a;
          radius += (trans.radius - radius) * a;
          lookAtPoint.lerp(
            new THREE.Vector3(trans.lookAt.x, trans.lookAt.y, trans.lookAt.z),
            a,
          );
        }
        targetTheta = theta;
        targetPhi = phi;
        targetRadius = radius;
        targetLookAt.copy(lookAtPoint);

        const targetFov = trans.wideFov ? 50 : 42;
        const targetFog = chaseNow ? 0.82 : 1;
        const targetExp = chaseNow ? 1.08 : 1.05;
        travelFov = damp(travelFov, targetFov, dt, 4);
        travelFogMul = damp(travelFogMul, targetFog, dt, 3);
        travelExposure = damp(travelExposure, targetExp, dt, 3);

        scene.fog.density = baseFogDensity * travelFogMul;
        wormhole.update(0);
        camera.fov = travelFov;
        renderer.toneMappingExposure = travelExposure;
        camera.updateProjectionMatrix();

        const previewQuadrant = focusTravel.exiting ? null : focusTravel.quadrantId;
        const openBlend = trans.openQuadrant;
        applyFocusVisuals(previewQuadrant, openBlend);

        const dimPulse = Math.sin(rawT * Math.PI);
        const dimRest = focusTravel.exiting
          ? rawT < 0.65
          : rawT > LAUNCH_PREP_END && rawT < SHIP_FLIGHT_END;
        if (dimRest) {
          const dim = focusTravel.exiting
            ? 0.5 + rawT * 0.38
            : 0.4 - dimPulse * 0.06;
          sphereDataAssoc.forEach(({ mat }) => {
            mat.opacity = dim;
          });
        }

        quadrantMeshes.forEach((mesh) => {
          const qId = mesh.userData.quadrantId;
          const base = quadrantBaseOpacity[qId];
          if (previewQuadrant === qId) {
            mesh.material.opacity = base + (0.32 - base) * openBlend;
          } else if (dimRest) {
            mesh.material.opacity = base * (0.3 + (1 - dimPulse) * 0.1);
          }
        });

        if (rawT >= 1) {
          if (focusTravel.exiting) {
            applyCameraPreset({
              theta: OVERVIEW_CAMERA.theta,
              phi: OVERVIEW_CAMERA.phi,
              radius: overviewRadius,
              lookAt: new THREE.Vector3(
                OVERVIEW_CAMERA.lookAt.x,
                OVERVIEW_CAMERA.lookAt.y,
                OVERVIEW_CAMERA.lookAt.z,
              ),
            });
            focusedQuadrant = null;
            setFocusQuadrant(null);
            setFocusPhase('idle');
            autoRotateEnabled = true;
            applyFocusVisuals(null, 1);
            spaceship.resetToDock();
          } else {
            applyCameraPreset(getCameraPreset(focusTravel.quadrantId));
            focusedQuadrant = focusTravel.quadrantId;
            setFocusPhase('focused');
            autoRotateEnabled = false;
            applyFocusVisuals(focusedQuadrant, 1);
          }
          focusTravel = null;
          matrixFlightSound.stop();
          scene.fog.density = baseFogDensity;
          travelFov = 42;
          travelFogMul = 1;
          travelExposure = 1.05;
          camera.fov = 42;
          renderer.toneMappingExposure = 1.05;
          camera.updateProjectionMatrix();
          wormhole.update(0);
          spheresGroup.visible = true;
          boxFrame.visible = true;
          floorMesh.visible = true;
          matrixEnv.envGroup.visible = true;
          axisLabels.forEach((s) => { s.visible = true; });
          quadrantMeshes.forEach((m) => { m.visible = true; });
        }
      } else if (!isDragging && autoRotateEnabled && focusPhaseRef.current === 'idle') {
        idleFrames += 1;
        if (idleFrames > 120) targetTheta += 0.06;
        theta += (targetTheta - theta) * 0.1;
        phi += (targetPhi - phi) * 0.1;
        radius += (targetRadius - radius) * 0.1;
        lookAtPoint.lerp(targetLookAt, 0.1);
        wormhole.update(0);
      } else if (!focusTravel) {
        theta += (targetTheta - theta) * 0.1;
        phi += (targetPhi - phi) * 0.1;
        radius += (targetRadius - radius) * 0.1;
        lookAtPoint.lerp(targetLookAt, 0.1);
        wormhole.update(0);
        if (focusedQuadrant) {
          applyFocusVisuals(focusedQuadrant, 1);
        }
      }

      updateEnvironment(now);
      updateCamera();
      renderer.render(scene, camera);

      const currWidth = container.clientWidth || width;
      const currHeight = container.clientHeight || height;
      const activeMesh = hoveredMeshRef.current;
      const activeFocus = focusedQuadrant ?? focusQuadrantRef.current;

      const newLabels = sphereDataAssoc.map((s) => {
        const vector = new THREE.Vector3();
        s.mesh.getWorldPosition(vector);
        vector.project(camera);

        const isBehind = vector.z > 1;
        const dist = camera.position.distanceTo(s.mesh.position);
        const x2d = (vector.x * 0.5 + 0.5) * currWidth;
        const y2d = (-(vector.y * 0.5) + 0.5) * currHeight;
        const isActive = s.mesh === activeMesh;
        const isSelected = s.mesh === selectedMeshRef.current;
        const inFocusQuadrant = !activeFocus || s.quadrantId === activeFocus;
        const prominent = isActive || isSelected || (s.data.families > 38 && s.data.sla > 22);

        return {
          id: s.data.sub,
          name: s.data.sub,
          color: COLORS[s.data.main],
          visible: inFocusQuadrant && !isBehind && (isActive || isSelected || prominent || activeFocus),
          x: x2d,
          y: y2d,
          sla: s.data.sla,
          families: s.data.families,
          tasks: s.data.tasks,
          isActive,
          opacity: isActive ? 1 : Math.max(0.45, 1 - (dist - 12) / 18),
        };
      });
      setProjectedLabels(newLabels);
    };
    animate();

    const resizeRenderer = () => {
      const size = getSize();
      width = size.width;
      height = size.height;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(() => resizeRenderer());
    resizeObserver.observe(container);
    window.addEventListener('resize', resizeRenderer);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resizeRenderer);
      canvasDom.removeEventListener('mousedown', handleMouseDown);
      canvasDom.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvasDom.removeEventListener('wheel', handleWheel);
      canvasDom.removeEventListener('dblclick', handleDblClick);
      document.body.style.cursor = 'default';

      axisArrows.forEach(disposeArrow);
      axisLabels.forEach((sprite) => {
        sprite.material.map?.dispose();
        sprite.material.dispose();
        disposeObject(sprite);
      });
      tickSprites.forEach((sprite) => {
        sprite.material.map?.dispose();
        sprite.material.dispose();
        disposeObject(sprite);
      });
      sphereDataAssoc.forEach(({ mesh, geom, mat }) => {
        mesh.traverse((child) => {
          if (child.geometry && child !== mesh) child.geometry.dispose();
          if (child.material && child !== mesh) child.material.dispose();
        });
        disposeObject(mesh);
        geom.dispose();
        mat.dispose();
      });
      disposables.forEach((d) => {
        if (d?.mesh) disposeObject(d.mesh);
        d?.geom?.dispose();
        d?.mat?.dispose();
      });
      renderer.dispose();
      matrixFlightSound.stop();
      wormhole.dispose();
      spaceship.dispose();
      resetCameraRef.current = null;
      startFocusRef.current = null;
      exitFocusRef.current = null;
    };
  }, [threeLoaded, isFullscreen]);

  const handleResetView = useCallback(() => {
    resetCameraRef.current?.();
  }, []);

  const handleQuadrantSelect = useCallback((id) => {
    if (focusPhase === 'traveling') return;
    matrixFlightSound.resume();
    if (focusQuadrant === id && focusPhase === 'focused') {
      exitFocusRef.current?.();
      return;
    }
    startFocusRef.current?.(id);
  }, [focusPhase, focusQuadrant]);

  const handleExitFocus = useCallback(() => {
    exitFocusRef.current?.();
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('matrix3d-sound-muted', next ? '1' : '0');
      } catch {
        /* ignore */
      }
      matrixFlightSound.setMuted(next);
      return next;
    });
  }, []);

  const focusedMeta = QUADRANT_UI.find((q) => q.id === focusQuadrant);
  const pointsInFocus = focusQuadrant
    ? subCategoryData.filter((d) => getQuadrantForItem(d) === focusQuadrant).length
    : 0;

  const handleCloseStats = useCallback(() => {
    setSelectedPoint(null);
    selectedMeshRef.current = null;
    applyStylesRef.current?.(hoveredMeshRef.current);
  }, []);

  const displayLabels = React.useMemo(() => {
    if (focusPhase === 'traveling') return [];
    const visible = projectedLabels.filter((l) => l.visible);
    if (selectedPoint) {
      return visible.filter((l) => l.id === selectedPoint.sub);
    }
    if (hoveredPoint) {
      return visible.filter((l) => l.id === hoveredPoint.sub);
    }
    const sorted = [...visible].sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      return b.families + b.sla - (a.families + a.sla);
    });
    const placed = [];
    for (const lbl of sorted) {
      const tooClose = placed.some(
        (p) => Math.hypot(p.x - lbl.x, p.y - lbl.y) < LABEL_MIN_DISTANCE_PX,
      );
      if (!tooClose) placed.push(lbl);
    }
    return placed;
  }, [projectedLabels, hoveredPoint, selectedPoint, focusPhase]);

  if (!threeLoaded) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center rounded-none bg-inverse-surface text-on-primary">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-lg">{LABELS.loading3d}</p>
        </div>
      </div>
    );
  }

  const containerClass = isFullscreen
    ? 'absolute inset-0 h-full w-full min-h-0'
    : 'relative h-full min-h-[450px] w-full';

  return (
    <div
      ref={containerRef}
      className={`${containerClass} overflow-hidden rounded-none border border-outline-variant/25 bg-[#131d32] shadow-inner ${focusPhase === 'traveling' ? 'matrix-cinema-mode' : ''}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full cursor-grab active:cursor-grabbing" />

      {focusPhase === 'traveling' && (
        <>
          <div className="matrix-cinema-bars" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 z-30 matrix-rocket-chase-overlay"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-40 flex justify-center matrix-travel-hud">
            <div className="flex items-center gap-2 rounded-none border border-primary/40 bg-inverse-surface/90 px-4 py-2 shadow-lg backdrop-blur-md">
              <div className="relative h-5 w-5">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
                <div className="relative h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
              <p className="text-xs font-bold text-on-primary">{LABELS.matrixFocusTravel}</p>
              {focusQuadrant && (
                <span className="text-xs font-semibold text-primary">
                  {QUADRANT_UI.find((q) => q.id === focusQuadrant)?.label}
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {selectedPoint && focusPhase !== 'traveling' && (
        <Matrix3DSubStatsPanel item={selectedPoint} onClose={handleCloseStats} />
      )}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {displayLabels.map((lbl) => (
          <div
            key={lbl.id}
            className="absolute flex -translate-x-1/2 -translate-y-full select-none flex-col items-center transition-opacity duration-150"
            style={{
              left: `${lbl.x}px`,
              top: `${lbl.y - 14}px`,
              opacity: lbl.opacity,
              zIndex: lbl.isActive ? 20 : 10,
            }}
          >
            <div
              className={`rounded-t-md border px-2.5 py-1 shadow-md ${
                lbl.isActive
                  ? 'border-primary/50 bg-surface-container-lowest'
                  : 'border-outline-variant/20 bg-surface-container-lowest/90'
              }`}
            >
              <span className="whitespace-nowrap text-[10px] font-extrabold text-on-surface">{lbl.name}</span>
            </div>
            <div className="rounded-b-md border-t border-outline-variant/40 bg-inverse-surface px-2 py-1 text-[9px] font-semibold text-on-primary">
              {lbl.sla} {LABELS.dayShort} | {lbl.families} {LABELS.familiesShort} | {lbl.tasks} {LABELS.tasks}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute left-4 top-4 z-30 flex flex-col gap-2" dir="rtl">
        <button
          type="button"
          onClick={handleResetView}
          className="pointer-events-auto flex items-center gap-1.5 border border-outline-variant/40 bg-inverse-surface/90 px-3 py-2 text-[10px] font-bold text-on-primary backdrop-blur-md transition-colors hover:bg-inverse-surface"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          {focusPhase === 'focused' ? LABELS.matrixFocusExit : 'איפוס זווית'}
        </button>
        <button
          type="button"
          onClick={handleToggleSound}
          className="pointer-events-auto flex items-center gap-1.5 border border-outline-variant/40 bg-inverse-surface/90 px-3 py-2 text-[10px] font-bold text-on-primary backdrop-blur-md transition-colors hover:bg-inverse-surface"
          aria-pressed={!soundMuted}
          title={soundMuted ? LABELS.matrix3dSoundUnmute : LABELS.matrix3dSoundMute}
        >
          <span className="material-symbols-outlined text-sm">
            {soundMuted ? 'volume_off' : 'volume_up'}
          </span>
          {soundMuted ? 'צליל כבוי' : 'צליל טיסה'}
        </button>

        {focusPhase === 'focused' && focusedMeta && (
          <div className="pointer-events-auto max-w-[220px] border border-primary/40 bg-inverse-surface/95 p-3 backdrop-blur-md">
            <p className="text-[10px] font-bold text-outline-variant">{LABELS.matrixFocusTitle}</p>
            <p className="mt-1 text-sm font-extrabold" style={{ color: focusedMeta.color }}>
              {focusedMeta.num}. {focusedMeta.label}
            </p>
            <p className="mt-1 text-[10px] text-on-primary">
              {pointsInFocus} {LABELS.matrixFocusPoints}
            </p>
            <button
              type="button"
              onClick={handleExitFocus}
              className="mt-2 flex w-full items-center justify-center gap-1 border border-outline-variant/40 py-1.5 text-[10px] font-bold text-on-primary hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              {LABELS.matrixFocusExit}
            </button>
          </div>
        )}
      </div>

      <div className="absolute right-4 top-4 z-30 flex flex-col gap-1.5" dir="rtl">
        <p className="pointer-events-none mb-1 text-center text-[10px] font-bold text-on-primary/80">רביעי מטריצה</p>
        {QUADRANT_UI.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => handleQuadrantSelect(q.id)}
            disabled={focusPhase === 'traveling'}
            className={`pointer-events-auto flex items-center gap-2 border px-3 py-2 text-[10px] font-bold backdrop-blur-md transition-all ${
              focusQuadrant === q.id && focusPhase === 'focused'
                ? 'border-primary bg-primary/20 text-on-primary shadow-md'
                : 'border-outline-variant/40 bg-inverse-surface/90 text-on-primary hover:bg-inverse-surface'
            } ${focusPhase === 'traveling' ? 'opacity-50' : ''}`}
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-[9px] font-black text-inverse-surface"
              style={{ backgroundColor: q.color }}
            >
              {q.num}
            </span>
            <span className="text-right leading-tight">{q.label}</span>
          </button>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 z-20 max-w-[220px] space-y-2 rounded-none border border-outline-variant/30 bg-inverse-surface/90 p-3 text-xs text-outline-variant backdrop-blur-md" dir="rtl">
        <div className="border-b border-outline-variant/30 pb-1 font-bold text-on-primary">{LABELS.axisLegendTitle}</div>
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-yellow-500" />
          <span>{LABELS.axisX}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-green-500" />
          <span>{LABELS.axisY}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-blue-500" />
          <span>{LABELS.axisZ}</span>
        </div>
        <p className="border-t border-outline-variant/30 pt-1 text-[10px] font-medium">
          {LABELS.matrixFocusHint}
        </p>
        <p className="text-[10px] text-outline-variant">{LABELS.matrix3dClickHint}</p>
        <p className="text-[10px] text-outline-variant">חללית קופצת במסלול — המצלמה נפתחת לרביע</p>
        <p className="text-[10px] text-outline-variant">גודל כדור = נפח משימות</p>
      </div>

      {hoveredPoint && !selectedPoint && focusPhase !== 'traveling' && (
        <div
          className="absolute left-4 top-14 z-30 max-w-[min(220px,calc(100%-1rem))] rounded-none border border-outline-variant/40 bg-inverse-surface/90 px-3 py-2 text-right shadow-lg backdrop-blur-md"
          dir="rtl"
          style={{ marginTop: focusPhase === 'focused' ? '7.5rem' : 0 }}
        >
          <p className="text-xs font-bold text-on-primary">{hoveredPoint.sub}</p>
          <p className="text-[10px] text-outline-variant">{LABELS.matrix3dClickHint}</p>
        </div>
      )}
    </div>
  );
}
