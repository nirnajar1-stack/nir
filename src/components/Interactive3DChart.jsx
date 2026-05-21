import React, { useState, useEffect, useRef, useCallback } from 'react';
import { COLORS, subCategoryData, LABELS } from '../data.js';

const DOMAIN = { familiesMax: 80, slaMax: 40, tasksMax: 220 };
const THRESHOLDS = { families: 32, sla: 20 };
const AXIS_ORIGIN = { x: -5, y: -5, z: -5 };
const AXIS_COLORS = { x: 0xef4444, y: 0x22c55e, z: 0x3b82f6 };
const QUADRANT_COLORS = {
  quick: 0x3b82f6,
  niche: 0xf59e0b,
  broad: 0x10b981,
  handoff: 0xef4444,
};

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
  return createAxisLabelSprite(THREE, text, '#94a3b8', 1.4);
}

function addQuadrantVolume(THREE, scene, min, max, color, opacity) {
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
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2);
  mesh.renderOrder = 0;
  scene.add(mesh);
  return { mesh, geom, mat };
}

function addDividerPlane(THREE, scene, axis, value, color) {
  const geom = new THREE.PlaneGeometry(10, 10);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geom, mat);
  if (axis === 'x') {
    mesh.rotation.y = Math.PI / 2;
    mesh.position.set(value, 0, 0);
  } else {
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(0, value, 0);
  }
  scene.add(mesh);
  return { mesh, geom, mat };
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
  return item.families >= THRESHOLDS.families && item.sla >= THRESHOLDS.sla;
}

export default function Interactive3DChart({ isFullscreen = false }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const hoveredMeshRef = useRef(null);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [projectedLabels, setProjectedLabels] = useState([]);

  const resetCameraRef = useRef(null);

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
    scene.background = new THREE.Color(0x0b1220);
    scene.fog = new THREE.FogExp2(0x0b1220, 0.028);

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

    let radius = isFullscreen ? 15 : 19;
    let theta = 38;
    let phi = 62;
    let targetTheta = theta;
    let targetPhi = phi;
    let targetRadius = radius;

    const updateCamera = () => {
      const phiRad = (phi * Math.PI) / 180;
      const thetaRad = (theta * Math.PI) / 180;
      camera.position.x = radius * Math.sin(phiRad) * Math.sin(thetaRad);
      camera.position.y = radius * Math.cos(phiRad);
      camera.position.z = radius * Math.sin(phiRad) * Math.cos(thetaRad);
      camera.lookAt(0, 0.2, 0);
    };

    resetCameraRef.current = () => {
      targetTheta = 38;
      targetPhi = 62;
      targetRadius = isFullscreen ? 15 : 19;
    };

    updateCamera();

    scene.add(new THREE.HemisphereLight(0xe8eeff, 0x1a2234, 0.55));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
    keyLight.position.set(12, 22, 14);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x8fa4c4, 0.35);
    fillLight.position.set(-14, 8, -10);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0x6b8cce, 0.25);
    rimLight.position.set(0, -8, 18);
    scene.add(rimLight);

    const xSplit = mapX(THRESHOLDS.families);
    const ySplit = mapY(THRESHOLDS.sla);
    const bounds = { min: -5, max: 5 };

    [
      addQuadrantVolume(THREE, scene, { x: bounds.min, y: bounds.min, z: bounds.min }, { x: xSplit, y: ySplit, z: bounds.max }, QUADRANT_COLORS.quick, 0.07),
      addQuadrantVolume(THREE, scene, { x: bounds.min, y: ySplit, z: bounds.min }, { x: xSplit, y: bounds.max, z: bounds.max }, QUADRANT_COLORS.niche, 0.07),
      addQuadrantVolume(THREE, scene, { x: xSplit, y: bounds.min, z: bounds.min }, { x: bounds.max, y: ySplit, z: bounds.max }, QUADRANT_COLORS.broad, 0.07),
      addQuadrantVolume(THREE, scene, { x: xSplit, y: ySplit, z: bounds.min }, { x: bounds.max, y: bounds.max, z: bounds.max }, QUADRANT_COLORS.handoff, 0.11),
    ].filter(Boolean).forEach((q) => disposables.push(q));

    disposables.push(addDividerPlane(THREE, scene, 'x', xSplit, 0xef4444));
    disposables.push(addDividerPlane(THREE, scene, 'y', ySplit, 0x22c55e));

    const boxGeom = new THREE.BoxGeometry(10, 10, 10);
    const edges = new THREE.EdgesGeometry(boxGeom);
    const boxMat = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.35 });
    const boxFrame = new THREE.LineSegments(edges, boxMat);
    scene.add(boxFrame);
    disposables.push({ mesh: boxFrame, geom: boxGeom, mat: boxMat });
    disposables.push({ geom: edges });

    const gridHelper = new THREE.GridHelper(10, 10, 0x475569, 0x1e293b);
    gridHelper.position.y = -5;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.45;
    scene.add(gridHelper);

    const axisArrows = [
      createAxisArrow(THREE, scene, AXIS_ORIGIN, { x: 5, y: -5, z: -5 }, AXIS_COLORS.x),
      createAxisArrow(THREE, scene, AXIS_ORIGIN, { x: -5, y: 5, z: -5 }, AXIS_COLORS.y),
      createAxisArrow(THREE, scene, AXIS_ORIGIN, { x: -5, y: -5, z: 5 }, AXIS_COLORS.z),
    ];

    const axisLabels = [];
    const labelX = createAxisLabelSprite(THREE, 'תפוצה — משפחות', '#ef4444');
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
      mesh.userData = { item, baseScale: 1, risk };

      if (risk) {
        const glowGeom = new THREE.SphereGeometry(size * 1.55, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
          color: 0xef4444,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
        });
        const glow = new THREE.Mesh(glowGeom, glowMat);
        mesh.add(glow);
        disposables.push({ mesh: glow, geom: glowGeom, mat: glowMat });
      }

      spheresGroup.add(mesh);
      sphereDataAssoc.push({ mesh, data: item, mat, geom });
    });
    scene.add(spheresGroup);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let idleFrames = 0;

    const applyPointStyles = (activeMesh) => {
      hoveredMeshRef.current = activeMesh;
      sphereDataAssoc.forEach(({ mesh, mat, data }) => {
        const isActive = mesh === activeMesh;
        const dimmed = activeMesh && !isActive;
        mesh.scale.setScalar(isActive ? 1.4 : 1);
        mat.emissiveIntensity = isActive ? 0.55 : isHandoffQuadrant(data) ? 0.28 : 0.1;
        mat.opacity = dimmed ? 0.28 : 0.92;
        mat.roughness = isActive ? 0.2 : 0.35;
      });
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      idleFrames = 0;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        targetTheta -= deltaX * 0.4;
        targetPhi = Math.max(12, Math.min(168, targetPhi + deltaY * 0.4));
        previousMousePosition = { x: e.clientX, y: e.clientY };
        idleFrames = 0;
      }

      const raycaster = new THREE.Raycaster();
      raycaster.params.Points = { threshold: 0.15 };
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      const intersects = raycaster.intersectObjects(spheresGroup.children, true);

      const findDataMesh = (obj) => {
        let current = obj;
        while (current) {
          if (current.userData?.item) return current;
          current = current.parent;
        }
        return null;
      };

      const hit = intersects.map((i) => findDataMesh(i.object)).find(Boolean);
      if (hit) {
        const collided = sphereDataAssoc.find((s) => s.mesh === hit);
        if (collided) {
          setHoveredPoint(collided.data);
          applyPointStyles(collided.mesh);
          document.body.style.cursor = 'pointer';
          return;
        }
      }

      setHoveredPoint(null);
      applyPointStyles(null);
      document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.body.style.cursor = 'grab';
    };

    const handleWheel = (e) => {
      e.preventDefault();
      targetRadius = Math.max(8, Math.min(32, targetRadius + e.deltaY * 0.022));
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
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        idleFrames += 1;
        if (idleFrames > 120) targetTheta += 0.06;
      }

      theta += (targetTheta - theta) * 0.1;
      phi += (targetPhi - phi) * 0.1;
      radius += (targetRadius - radius) * 0.1;
      updateCamera();

      renderer.render(scene, camera);

      const currWidth = container.clientWidth || width;
      const currHeight = container.clientHeight || height;
      const activeMesh = hoveredMeshRef.current;

      const newLabels = sphereDataAssoc.map((s) => {
        const vector = new THREE.Vector3();
        s.mesh.getWorldPosition(vector);
        vector.project(camera);

        const isBehind = vector.z > 1;
        const dist = camera.position.distanceTo(s.mesh.position);
        const x2d = (vector.x * 0.5 + 0.5) * currWidth;
        const y2d = (-(vector.y * 0.5) + 0.5) * currHeight;
        const isActive = s.mesh === activeMesh;
        const prominent = isActive || (s.data.families > 28 && s.data.sla > 14);

        return {
          id: s.data.sub,
          name: s.data.sub,
          color: COLORS[s.data.main],
          visible: !isBehind && (isActive || prominent),
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
      boxGeom.dispose();
      edges.dispose();
      renderer.dispose();
      resetCameraRef.current = null;
    };
  }, [threeLoaded, isFullscreen]);

  const handleResetView = useCallback(() => {
    resetCameraRef.current?.();
  }, []);

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
      className={`${containerClass} overflow-hidden rounded-none border border-outline-variant/30 bg-[#0b1220] shadow-inner`}
    >
      <canvas ref={canvasRef} className="block h-full w-full cursor-grab active:cursor-grabbing" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {projectedLabels.map((lbl) => {
          if (!lbl.visible) return null;
          return (
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
          );
        })}
      </div>

      <div className="absolute left-4 top-4 flex flex-col gap-2" dir="rtl">
        <button
          type="button"
          onClick={handleResetView}
          className="pointer-events-auto flex items-center gap-1.5 border border-outline-variant/40 bg-inverse-surface/90 px-3 py-2 text-[10px] font-bold text-on-primary backdrop-blur-md transition-colors hover:bg-inverse-surface"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          איפוס זווית
        </button>
      </div>

      <div className="absolute bottom-4 right-4 max-w-[220px] space-y-2 rounded-none border border-outline-variant/30 bg-inverse-surface/90 p-3 text-xs text-outline-variant backdrop-blur-md" dir="rtl">
        <div className="border-b border-outline-variant/30 pb-1 font-bold text-on-primary">{LABELS.axisLegendTitle}</div>
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-red-500" />
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
        <div className="mt-2 space-y-1 border-t border-outline-variant/30 pt-2">
          <p className="text-[10px] font-bold text-on-primary">רביעי מטריצה</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-red-500/80" />
            <span className="text-[10px]">העברת שרביט (גבוה X+Y)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-amber-500/80" />
            <span className="text-[10px]">מומחיות נישה</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-emerald-500/80" />
            <span className="text-[10px]">טיפול שוטף נרחב</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-blue-500/80" />
            <span className="text-[10px]">פעולות בזק</span>
          </div>
        </div>
        <p className="border-t border-outline-variant/30 pt-1 text-[10px] font-medium">
          גרור לסיבוב · גלול לזום · לחיצה כפולה לאיפוס
        </p>
        <p className="text-[10px] text-outline-variant">גודל כדור = נפח משימות</p>
      </div>

      {hoveredPoint && (
        <div className="absolute bottom-4 left-4 min-w-[240px] rounded-none border border-primary/40 bg-inverse-surface/95 p-4 text-right shadow-xl backdrop-blur-md" dir="rtl">
          <p className="mb-1 text-sm font-extrabold text-on-primary">{hoveredPoint.sub}</p>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLORS[hoveredPoint.main] }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[hoveredPoint.main] }} />
            {hoveredPoint.main}
          </p>
          {isHandoffQuadrant(hoveredPoint) && (
            <p className="mb-2 rounded-none bg-red-500/15 px-2 py-1 text-[10px] font-bold text-red-300">
              רביע העברת שרביט — מומלץ רפרנט מקצועי
            </p>
          )}
          <div className="space-y-1.5 border-t border-outline-variant/30 pt-2 text-xs">
            <div className="flex justify-between text-outline-variant">
              <span>{LABELS.hoverX}</span>
              <span className="font-bold text-on-primary">
                {hoveredPoint.families} {LABELS.families}
              </span>
            </div>
            <div className="flex justify-between text-outline-variant">
              <span>{LABELS.hoverY}</span>
              <span className="font-bold text-on-primary">
                {hoveredPoint.sla} {LABELS.days}
              </span>
            </div>
            <div className="flex justify-between text-outline-variant">
              <span>{LABELS.hoverZ}</span>
              <span className="font-bold text-on-primary">
                {hoveredPoint.tasks} {LABELS.inquiries}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
