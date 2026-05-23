/**
 * סביבת רקע למטריצה 3D — מרחב נתונים, לא גריד גנרי
 */

const BG_TOP = '#0c1224';
const BG_MID = '#131d32';
const BG_BOTTOM = '#182838';
const FOG_COLOR = 0x151f2e;
const FLOOR_BASE = '#141e2c';
const GRID_LINE = 'rgba(90, 120, 155, 0.22)';
const GRID_ACCENT = 'rgba(197, 212, 250, 0.14)';

/** @param {typeof import('three')} THREE */
export function createMatrixBackgroundTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, BG_TOP);
  g.addColorStop(0.42, BG_MID);
  g.addColorStop(1, BG_BOTTOM);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);

  const blobs = [
    { x: 280, y: 120, r: 180, c: 'rgba(79, 94, 127, 0.22)' },
    { x: 720, y: 200, r: 220, c: 'rgba(56, 189, 148, 0.1)' },
    { x: 520, y: 380, r: 260, c: 'rgba(129, 140, 248, 0.12)' },
    { x: 150, y: 340, r: 140, c: 'rgba(234, 179, 8, 0.06)' },
  ];
  blobs.forEach((b) => {
    const rg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    rg.addColorStop(0, b.c);
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, 1024, 512);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.encoding = THREE.sRGBEncoding;
  return tex;
}

/**
 * רצפת מרחב עם גריד עדין וריבועי רביעים
 * @param {typeof import('three')} THREE
 * @param {number} xSplit
 * @param {number} ySplit
 * @param {Record<string, number>} quadrantHex
 */
export function createObservatoryFloor(THREE, xSplit, ySplit, quadrantHex) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const half = size / 2;

  ctx.fillStyle = FLOOR_BASE;
  ctx.fillRect(0, 0, size, size);

  const vignette = ctx.createRadialGradient(half, half, 20, half, half, half * 0.92);
  vignette.addColorStop(0, 'rgba(45, 62, 88, 0.35)');
  vignette.addColorStop(0.55, 'rgba(22, 34, 50, 0.12)');
  vignette.addColorStop(1, 'rgba(8, 12, 20, 0.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, size, size);

  const toPx = (v) => half + (v / 10) * (size * 0.48);
  const xPx = toPx(xSplit);
  const yPx = toPx(ySplit);

  const washes = [
    { x0: 0, y0: 0, x1: xPx, y1: yPx, hex: quadrantHex.quick },
    { x0: xPx, y0: 0, x1: size, y1: yPx, hex: quadrantHex.niche },
    { x0: 0, y0: yPx, x1: xPx, y1: size, hex: quadrantHex.broad },
    { x0: xPx, y0: yPx, x1: size, y1: size, hex: quadrantHex.handoff },
  ];
  washes.forEach((w) => {
    const c = w.hex;
    const r = (c >> 16) & 255;
    const g = (c >> 8) & 255;
    const b = c & 255;
    ctx.fillStyle = `rgba(${r},${g},${b},0.09)`;
    ctx.fillRect(w.x0, w.y0, w.x1 - w.x0, w.y1 - w.y0);
  });

  ctx.strokeStyle = GRID_ACCENT;
  ctx.lineWidth = 1.2;
  ctx.strokeRect(toPx(-5) - 1, toPx(-5) - 1, toPx(5) - toPx(-5) + 2, toPx(5) - toPx(-5) + 2);

  for (let i = -5; i <= 5; i += 1) {
    const p = toPx(i);
    const major = i % 5 === 0;
    ctx.strokeStyle = major ? GRID_ACCENT : GRID_LINE;
    ctx.lineWidth = major ? 1 : 0.6;
    ctx.beginPath();
    ctx.moveTo(p, toPx(-5));
    ctx.lineTo(p, toPx(5));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(toPx(-5), p);
    ctx.lineTo(toPx(5), p);
    ctx.stroke();
  }

  ctx.setLineDash([6, 8]);
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(xPx, toPx(-5));
  ctx.lineTo(xPx, toPx(5));
  ctx.stroke();
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
  ctx.beginPath();
  ctx.moveTo(toPx(-5), yPx);
  ctx.lineTo(toPx(5), yPx);
  ctx.stroke();
  ctx.setLineDash([]);

  const tex = new THREE.CanvasTexture(canvas);
  tex.encoding = THREE.sRGBEncoding;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;

  const geom = new THREE.PlaneGeometry(11.5, 11.5);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.92,
    metalness: 0.08,
    transparent: true,
    opacity: 0.94,
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, -5.02, 0);
  mesh.receiveShadow = false;

  return { mesh, geom, mat, tex };
}

/** @param {typeof import('three')} THREE */
export function createDataCubeFrame(THREE) {
  const group = new THREE.Group();
  group.name = 'dataCubeFrame';

  const boxGeom = new THREE.BoxGeometry(10, 10, 10);
  const edges = new THREE.EdgesGeometry(boxGeom);
  const edgePos = edges.attributes.position.array;
  const colors = [];

  const colorForVertex = (x, y, z) => {
    const r = x > 0 ? 0.45 : 0.25;
    const g = y > 0 ? 0.55 : 0.28;
    const b = z > 0 ? 0.75 : 0.35;
    return new THREE.Color(r * 0.55 + g * 0.2, g * 0.5 + b * 0.15, b * 0.65 + r * 0.2);
  };

  for (let i = 0; i < edgePos.length; i += 3) {
    const c = colorForVertex(edgePos[i], edgePos[i + 1], edgePos[i + 2]);
    colors.push(c.r, c.g, c.b);
  }
  edges.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const boxMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    linewidth: 1,
  });
  const boxFrame = new THREE.LineSegments(edges, boxMat);
  group.add(boxFrame);

  const glowGeom = new THREE.BoxGeometry(10.08, 10.08, 10.08);
  const glowEdges = new THREE.EdgesGeometry(glowGeom);
  const glowMat = new THREE.LineBasicMaterial({
    color: 0x4f5e7f,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glowFrame = new THREE.LineSegments(glowEdges, glowMat);
  group.add(glowFrame);

  const cornerGeom = new THREE.SphereGeometry(0.06, 8, 8);
  const cornerMat = new THREE.MeshBasicMaterial({
    color: 0xc5d4fa,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const corners = [];
  for (let ix = -1; ix <= 1; ix += 2) {
    for (let iy = -1; iy <= 1; iy += 2) {
      for (let iz = -1; iz <= 1; iz += 2) {
        const m = new THREE.Mesh(cornerGeom, cornerMat.clone());
        m.position.set(ix * 5, iy * 5, iz * 5);
        group.add(m);
        corners.push(m);
      }
    }
  }

  return {
    group,
    boxFrame,
    disposables: [
      { geom: boxGeom, mat: boxMat },
      { geom: edges },
      { geom: glowGeom, mat: glowMat },
      { geom: glowEdges },
      { geom: cornerGeom },
      ...corners.map((m) => ({ mat: m.material })),
    ],
  };
}

/** @param {typeof import('three')} THREE */
export function createHorizonRing(THREE) {
  const geom = new THREE.RingGeometry(7.2, 7.55, 64);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x4f5e7f,
    transparent: true,
    opacity: 0.14,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -4.98;
  return { mesh, geom, mat };
}

/** @param {typeof import('three')} THREE */
export function createAmbientDust(THREE, count = 140) {
  const positions = new Float32Array(count * 3);
  const speeds = [];
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
    speeds.push({
      dx: (Math.random() - 0.5) * 0.008,
      dy: (Math.random() - 0.5) * 0.004,
      dz: (Math.random() - 0.5) * 0.008,
      phase: Math.random() * Math.PI * 2,
    });
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xc5d4fa,
    size: 0.06,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geom, mat);

  const update = (t) => {
    const pos = geom.attributes.position.array;
    for (let i = 0; i < count; i += 1) {
      const s = speeds[i];
      pos[i * 3] += s.dx;
      pos[i * 3 + 1] += Math.sin(t * 0.4 + s.phase) * 0.002;
      pos[i * 3 + 2] += s.dz;
      if (pos[i * 3] > 11) pos[i * 3] = -11;
      if (pos[i * 3] < -11) pos[i * 3] = 11;
      if (pos[i * 3 + 2] > 11) pos[i * 3 + 2] = -11;
      if (pos[i * 3 + 2] < -11) pos[i * 3 + 2] = 11;
    }
    geom.attributes.position.needsUpdate = true;
  };

  return { points, geom, mat, update, disposables: [{ geom, mat }] };
}

/** @param {typeof import('three')} THREE */
export function createSoftDivider(THREE, axis, value, colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const r = (colorHex >> 16) & 255;
  const g = (colorHex >> 8) & 255;
  const b = colorHex & 255;
  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
  grad.addColorStop(0.42, `rgba(${r},${g},${b},0.14)`);
  grad.addColorStop(0.5, `rgba(${r},${g},${b},0.2)`);
  grad.addColorStop(0.58, `rgba(${r},${g},${b},0.14)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  const geom = new THREE.PlaneGeometry(10.2, 10.2);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.Mesh(geom, mat);
  if (axis === 'x') {
    mesh.rotation.y = Math.PI / 2;
    mesh.position.set(value, 0, 0);
  } else {
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(0, value, 0);
  }
  return { mesh, geom, mat, tex };
}

/** @param {typeof import('three')} THREE */
export function setupMatrixLighting(THREE, scene) {
  const lights = [];

  const hemi = new THREE.HemisphereLight(0xd8e2ff, 0x1a2420, 0.5);
  scene.add(hemi);
  lights.push(hemi);

  const ambient = new THREE.AmbientLight(0x3d4f6a, 0.22);
  scene.add(ambient);
  lights.push(ambient);

  const key = new THREE.DirectionalLight(0xfff8f0, 0.72);
  key.position.set(10, 20, 12);
  scene.add(key);
  lights.push(key);

  const fill = new THREE.DirectionalLight(0x8fa4c4, 0.28);
  fill.position.set(-12, 6, -8);
  scene.add(fill);
  lights.push(fill);

  const rim = new THREE.DirectionalLight(0x6ee7b7, 0.18);
  rim.position.set(-4, 2, 16);
  scene.add(rim);
  lights.push(rim);

  const core = new THREE.PointLight(0xc5d4fa, 0.35, 28);
  core.position.set(0, 2, 0);
  scene.add(core);
  lights.push(core);

  return lights;
}

/**
 * בונה את כל סביבת הרקע
 * @param {typeof import('three')} THREE
 * @param {import('three').Scene} scene
 * @param {{ xSplit: number, ySplit: number, quadrantColors: Record<string, number> }} opts
 */
export function buildMatrix3DEnvironment(THREE, scene, opts) {
  const { xSplit, ySplit, quadrantColors } = opts;
  const disposables = [];
  const envGroup = new THREE.Group();
  envGroup.name = 'matrixEnvironment';

  const bgTex = createMatrixBackgroundTexture(THREE);
  scene.background = bgTex;
  disposables.push({ tex: bgTex });

  const baseFogDensity = 0.02;
  scene.fog = new THREE.FogExp2(FOG_COLOR, baseFogDensity);

  const floor = createObservatoryFloor(THREE, xSplit, ySplit, quadrantColors);
  envGroup.add(floor.mesh);
  disposables.push(floor);

  const ring = createHorizonRing(THREE);
  envGroup.add(ring.mesh);
  disposables.push(ring);

  const frame = createDataCubeFrame(THREE);
  envGroup.add(frame.group);
  disposables.push(...frame.disposables);

  const dust = createAmbientDust(THREE);
  envGroup.add(dust.points);
  disposables.push(...dust.disposables);

  const divX = createSoftDivider(THREE, 'x', xSplit, 0xeab308);
  const divY = createSoftDivider(THREE, 'y', ySplit, 0x22c55e);
  envGroup.add(divX.mesh);
  envGroup.add(divY.mesh);
  disposables.push(divX, divY);

  setupMatrixLighting(THREE, scene);

  scene.add(envGroup);

  return {
    envGroup,
    boxFrame: frame.boxFrame,
    floorMesh: floor.mesh,
    dividerMeshes: [divX.mesh, divY.mesh],
    baseFogDensity,
    updateEnvironment: (t) => dust.update(t * 0.001),
    disposables,
  };
}
