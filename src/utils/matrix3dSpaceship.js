import { easeInOutCubic } from './matrix3dQuadrants.js';

/** שלבי מעבר — רדיפה + שובל */
export const LAUNCH_PREP_END = 0.1;
export const SHIP_FLIGHT_END = 0.72;
export const CHASE_CAMERA_END = 0.68;

const CHASE_DISTANCE = 11.5;
const CHASE_LIFT = 2.4;
const CHASE_SIDE = 2.1;
const MIN_CHASE_RADIUS = 10.5;
const SHIP_IN_FRAME = 0.22;

const ROCKET_RED = 0xff2a00;
const ROCKET_ORANGE = 0xff5500;
const ROCKET_CORE = 0xff8844;

const DOCK_POSITION = { x: -7.4, y: 3.1, z: -3.8 };
const DOCK_ROTATION = { x: 0.15, y: 0.72, z: 0.05 };

const QUADRANT_NUDGE = {
  quick: [-0.55, -0.55, 0.85],
  niche: [-0.55, 0.45, 0.85],
  broad: [0.55, -0.45, 0.85],
  handoff: [0.55, 0.55, 0.85],
};

/** עקומת זמן סינמטית — התחלה וסוף איטיים, אמצע יציב */
export function getCinematicT(rawT) {
  const t = Math.max(0, Math.min(1, rawT));
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function lerpAngleDeg(a, b, t) {
  let d = ((b - a + 540) % 360) - 180;
  return a + d * t;
}

function smootherstep(t) {
  const u = Math.max(0, Math.min(1, t));
  return u * u * u * (u * (u * 6 - 15) + 10);
}

function lerpVec(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

function cubicBezier3(t, p0, p1, p2, p3) {
  const u = 1 - t;
  const u2 = u * u;
  const u3 = u2 * u;
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: u3 * p0.x + 3 * u2 * t * p1.x + 3 * u * t2 * p2.x + t3 * p3.x,
    y: u3 * p0.y + 3 * u2 * t * p1.y + 3 * u * t2 * p2.y + t3 * p3.y,
    z: u3 * p0.z + 3 * u2 * t * p1.z + 3 * u * t2 * p2.z + t3 * p3.z,
  };
}

function buildCinematicPath(from, to) {
  const lift = Math.max(from.y, to.y) + 3.6;
  return {
    p0: from,
    p1: {
      x: from.x + (to.x - from.x) * 0.2,
      y: lift,
      z: from.z + (to.z - from.z) * 0.12,
    },
    p2: {
      x: to.x - (to.x - from.x) * 0.16,
      y: lift * 0.88,
      z: to.z - (to.z - from.z) * 0.1,
    },
    p3: to,
  };
}

function normalizeVec(v) {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function orbitWideChase(pos, forward, sceneFocus, sway = 0) {
  const f = normalizeVec(forward);
  const side = CHASE_SIDE * (1 + sway);
  const cam = {
    x: pos.x - f.x * CHASE_DISTANCE + f.z * side,
    y: pos.y + CHASE_LIFT,
    z: pos.z - f.z * CHASE_DISTANCE - f.x * side,
  };
  const look = {
    x: sceneFocus.x * (1 - SHIP_IN_FRAME) + pos.x * SHIP_IN_FRAME,
    y: sceneFocus.y * (1 - SHIP_IN_FRAME) + pos.y * SHIP_IN_FRAME,
    z: sceneFocus.z * (1 - SHIP_IN_FRAME) + pos.z * SHIP_IN_FRAME,
  };
  const dx = cam.x - look.x;
  const dy = cam.y - look.y;
  const dz = cam.z - look.z;
  let radius = Math.hypot(dx, dy, dz) || 0.001;
  if (radius < MIN_CHASE_RADIUS) {
    const s = MIN_CHASE_RADIUS / radius;
    radius = MIN_CHASE_RADIUS;
    cam.x = look.x + dx * s;
    cam.y = look.y + dy * s;
    cam.z = look.z + dz * s;
  }
  const phi = Math.acos(Math.max(-1, Math.min(1, dy / radius))) * (180 / Math.PI);
  const theta = Math.atan2(dx, dz) * (180 / Math.PI);
  return { theta, phi, radius, lookAt: look };
}

function getSceneFocus(focusTravel, toLook) {
  if (focusTravel.exiting) return toLook;
  if (focusTravel.shipTarget) return focusTravel.shipTarget;
  return toLook;
}

function blendOrbit(a, b, t) {
  return {
    theta: lerpAngleDeg(a.theta, b.theta, t),
    phi: a.phi + (b.phi - a.phi) * t,
    radius: a.radius + (b.radius - a.radius) * t,
    lookAt: lerpVec(a.lookAt, b.lookAt, smootherstep(t)),
  };
}

function presetToOrbit(preset) {
  return {
    theta: preset.theta,
    phi: preset.phi,
    radius: preset.radius,
    lookAt: { x: preset.lookAt.x, y: preset.lookAt.y, z: preset.lookAt.z },
  };
}

export function getJumpProgress(rawT, exiting) {
  const t = Math.max(0, Math.min(1, rawT));
  if (exiting) {
    if (t < 0.4) return 0;
    return easeInOutCubic((t - 0.4) / 0.6);
  }
  if (t < LAUNCH_PREP_END) return 0;
  return easeInOutCubic(Math.min(1, (t - LAUNCH_PREP_END) / (SHIP_FLIGHT_END - LAUNCH_PREP_END)));
}

export function computeChaseCamera(focusTravel, rawT, ship) {
  const t = Math.max(0, Math.min(1, rawT));
  const from = focusTravel.from;
  const to = focusTravel.to;
  const fromLook = { x: from.lookAt.x, y: from.lookAt.y, z: from.lookAt.z };
  const toLook = { x: to.lookAt.x, y: to.lookAt.y, z: to.lookAt.z };
  const presetOrbit = presetToOrbit(to);
  const sway = Math.sin(t * Math.PI) * 0.08;

  const idleOrbit = {
    theta: from.theta,
    phi: from.phi,
    radius: from.radius,
    lookAt: fromLook,
  };

  const finishBlend = (orbit, openQ = 0) => ({
    ...orbit,
    wideFov: false,
    openQuadrant: openQ,
  });

  if (ship?.chaseActive && ship.position && ship.forward) {
    const sceneFocus = getSceneFocus(focusTravel, toLook);
    const chase = orbitWideChase(ship.position, ship.forward, sceneFocus, sway);

    if (focusTravel.exiting) {
      if (t < 0.45) return finishBlend(chase, 1 - t / 0.45);
      const camT = easeInOutCubic((t - 0.45) / 0.55);
      return finishBlend(blendOrbit(chase, presetOrbit, camT), 1 - camT);
    }

    if (t > CHASE_CAMERA_END) {
      const camT = easeInOutCubic((t - CHASE_CAMERA_END) / (1 - CHASE_CAMERA_END));
      return finishBlend(blendOrbit(chase, presetOrbit, camT), easeInOutCubic(camT));
    }

    return { ...chase, wideFov: true, openQuadrant: 0 };
  }

  if (focusTravel.exiting) {
    const camT = easeInOutCubic(Math.min(1, t / 0.5));
    return finishBlend({
      theta: lerpAngleDeg(from.theta, to.theta, camT),
      phi: from.phi + (to.phi - from.phi) * camT,
      radius: from.radius + (to.radius - from.radius) * camT,
      lookAt: lerpVec(fromLook, toLook, camT),
    }, 1 - camT);
  }

  if (t < LAUNCH_PREP_END && ship?.position && ship?.forward) {
    const prep = orbitWideChase(ship.position, ship.forward, getSceneFocus(focusTravel, toLook), 0);
    const prepT = easeInOutCubic(t / LAUNCH_PREP_END);
    return { ...blendOrbit(idleOrbit, prep, prepT), wideFov: true, openQuadrant: 0 };
  }

  if (t > CHASE_CAMERA_END) {
    const camT = easeInOutCubic((t - CHASE_CAMERA_END) / (1 - CHASE_CAMERA_END));
    return finishBlend(blendOrbit(idleOrbit, presetOrbit, camT), easeInOutCubic(camT));
  }

  return { ...idleOrbit, wideFov: t < SHIP_FLIGHT_END, openQuadrant: 0 };
}

export function getSpaceshipTargetForQuadrant(quadrantId, bounds) {
  const c = bounds[quadrantId].center;
  const [nx, ny, nz] = QUADRANT_NUDGE[quadrantId] || [0, 0, 0.5];
  return { x: c.x + nx, y: c.y + ny, z: c.z + nz };
}

export function createSpaceship(THREE, scene) {
  const group = new THREE.Group();
  group.name = 'matrixSpaceship';

  const hullMat = new THREE.MeshStandardMaterial({
    color: 0xb8c5d9,
    metalness: 0.75,
    roughness: 0.28,
    emissive: 0x334155,
    emissiveIntensity: 0.12,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x818cf8,
    metalness: 0.6,
    roughness: 0.25,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.35,
  });

  const fuselage = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 10), hullMat);
  fuselage.rotation.x = Math.PI / 2;
  group.add(fuselage);

  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), accentMat);
  cockpit.position.set(0, 0.12, 0.14);
  group.add(cockpit);

  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.025, 0.2), hullMat);
  wing.position.z = -0.04;
  group.add(wing);

  const engineMat = new THREE.MeshBasicMaterial({
    color: ROCKET_RED,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const engine = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), engineMat);
  engine.position.set(0, 0, -0.3);
  group.add(engine);

  const trailMat = new THREE.MeshBasicMaterial({
    color: ROCKET_ORANGE,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const trail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.1, 0.55, 6), trailMat);
  trail.rotation.x = Math.PI / 2;
  trail.position.z = -0.42;
  group.add(trail);

  const light = new THREE.PointLight(ROCKET_RED, 0.6, 5);
  light.position.set(0, 0, -0.35);
  group.add(light);

  const rocketTrailGroup = new THREE.Group();
  rocketTrailGroup.name = 'rocketExhaustTrail';
  scene.add(rocketTrailGroup);

  const TRAIL_POINTS = 48;
  const trailHistory = [];
  const trailGeom = new THREE.SphereGeometry(0.05, 5, 5);
  const trailSegments = [];
  const trailSmoothPos = [];

  for (let i = 0; i < TRAIL_POINTS; i += 1) {
    const mat = new THREE.MeshBasicMaterial({
      color: ROCKET_RED,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(trailGeom, mat);
    mesh.visible = false;
    rocketTrailGroup.add(mesh);
    trailSegments.push({ mesh, mat });
    trailSmoothPos.push({ x: 0, y: 0, z: 0 });
  }

  const dock = new THREE.Vector3(DOCK_POSITION.x, DOCK_POSITION.y, DOCK_POSITION.z);
  group.position.copy(dock);
  group.rotation.set(DOCK_ROTATION.x, DOCK_ROTATION.y, DOCK_ROTATION.z);
  scene.add(group);

  let flightPath = null;
  let smoothForward = { x: 0.4, y: -0.1, z: 0.9 };
  let smoothExhaust = 0;

  const tempFrom = new THREE.Vector3();
  const tempTo = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();

  const disposables = [
    { geom: fuselage.geometry, mat: hullMat },
    { geom: cockpit.geometry, mat: accentMat },
    { geom: wing.geometry, mat: hullMat },
    { geom: trailGeom },
  ];

  const damp = (current, target, dt, rate) => current + (target - current) * (1 - Math.exp(-rate * dt));

  const setRocketColors = (intensity) => {
    const t = Math.min(1, intensity);
    engineMat.color.setHex(ROCKET_RED);
    trailMat.color.setHex(ROCKET_ORANGE);
    engineMat.opacity = 0.4 + t * 0.5;
    trailMat.opacity = t * 0.5;
    light.intensity = 0.4 + t * 1.2;
    accentMat.emissive.setHex(ROCKET_ORANGE);
    accentMat.emissiveIntensity = 0.18 + t * 0.4;
  };

  const clearRocketTrail = () => {
    trailHistory.length = 0;
    trailSegments.forEach((s, i) => {
      s.mesh.visible = false;
      s.mat.opacity = 0;
      trailSmoothPos[i] = { x: 0, y: 0, z: 0 };
    });
  };

  const pushTrailPoint = (pos, dt) => {
    if (trailHistory.length > 0) {
      const head = trailHistory[0];
      const dist = Math.hypot(head.x - pos.x, head.y - pos.y, head.z - pos.z);
      if (dist < 0.05) {
        head.x = damp(head.x, pos.x, dt, 14);
        head.y = damp(head.y, pos.y, dt, 14);
        head.z = damp(head.z, pos.z, dt, 14);
        return;
      }
    }
    trailHistory.unshift({ x: pos.x, y: pos.y, z: pos.z });
    if (trailHistory.length > TRAIL_POINTS) trailHistory.pop();
  };

  const updateRocketTrail = (intensity, dt) => {
    smoothExhaust = damp(smoothExhaust, intensity, dt, 6);
    if (smoothExhaust < 0.04) {
      clearRocketTrail();
      return;
    }
    const n = trailHistory.length;
    if (n < 2) return;

    for (let i = 0; i < TRAIL_POINTS; i += 1) {
      const seg = trailSegments[i];
      const frac = i / (TRAIL_POINTS - 1);
      const histIdx = frac * (n - 1);
      const i0 = Math.floor(histIdx);
      const i1 = Math.min(n - 1, i0 + 1);
      const blend = histIdx - i0;
      const p0 = trailHistory[i0];
      const p1 = trailHistory[i1];
      const tx = p0.x + (p1.x - p0.x) * blend;
      const ty = p0.y + (p1.y - p0.y) * blend;
      const tz = p0.z + (p1.z - p0.z) * blend;

      const sp = trailSmoothPos[i];
      sp.x = damp(sp.x, tx, dt, 12);
      sp.y = damp(sp.y, ty, dt, 12);
      sp.z = damp(sp.z, tz, dt, 12);

      const age = frac;
      const fade = (1 - age * age) * smoothExhaust;
      const size = 0.03 + (1 - age) * 0.11;
      seg.mesh.visible = fade > 0.02;
      seg.mesh.position.set(sp.x, sp.y, sp.z);
      seg.mesh.scale.setScalar(size);
      seg.mat.opacity = damp(seg.mat.opacity, fade * 0.8, dt, 10);
      const targetColor = age < 0.2 ? ROCKET_CORE : age < 0.5 ? ROCKET_ORANGE : ROCKET_RED;
      seg.mat.color.setHex(targetColor);
    }
  };

  const orientShip = (pos, targetForward, dt) => {
    smoothForward = {
      x: damp(smoothForward.x, targetForward.x, dt, 5.5),
      y: damp(smoothForward.y, targetForward.y, dt, 5.5),
      z: damp(smoothForward.z, targetForward.z, dt, 5.5),
    };
    const f = normalizeVec(smoothForward);
    lookTarget.set(pos.x + f.x, pos.y + f.y, pos.z + f.z);
    group.lookAt(lookTarget);
  };

  const samplePath = (pathT, path) => {
    const pos = cubicBezier3(pathT, path.p0, path.p1, path.p2, path.p3);
    const ahead = cubicBezier3(Math.min(1, pathT + 0.012), path.p0, path.p1, path.p2, path.p3);
    const fwd = normalizeVec({
      x: ahead.x - pos.x,
      y: ahead.y - pos.y,
      z: ahead.z - pos.z,
    });
    return { pos, fwd };
  };

  const hideJumpLane = () => {};

  const tick = (now, focusTravel, focusedQuadrantId, bounds, accentHex, dt = 0.016) => {
    const t = now * 0.001;
    const baseState = {
      chaseActive: false,
      position: { x: group.position.x, y: group.position.y, z: group.position.z },
      forward: { ...smoothForward },
      exhaust: smoothExhaust,
    };

    if (!focusTravel) {
      flightPath = null;
      clearRocketTrail();
      engineMat.color.setHex(0x60a5fa);
      trailMat.color.setHex(0x93c5fd);
      light.color.setHex(0x60a5fa);
      if (accentHex) accentMat.emissive.setHex(accentHex);
      else accentMat.emissive.setHex(0x4f46e5);
      accentMat.emissiveIntensity = 0.35;
      trailMat.opacity *= 0.9;
      engineMat.opacity = 0.35;

      if (focusedQuadrantId && bounds) {
        const target = getSpaceshipTargetForQuadrant(focusedQuadrantId, bounds);
        group.position.lerp(new THREE.Vector3(target.x, target.y, target.z), 0.04);
        const c = bounds[focusedQuadrantId].center;
        tempTo.set(c.x, c.y, c.z).sub(group.position);
        if (tempTo.lengthSq() > 0.0001) {
          orientShip(
            { x: group.position.x, y: group.position.y, z: group.position.z },
            normalizeVec({ x: tempTo.x, y: tempTo.y, z: tempTo.z }),
            dt,
          );
        }
        return { ...baseState, position: { x: group.position.x, y: group.position.y, z: group.position.z }, forward: smoothForward };
      }

      group.position.copy(dock);
      group.position.y += Math.sin(t * 1.2) * 0.07;
      group.rotation.y = DOCK_ROTATION.y + Math.sin(t * 0.5) * 0.08;
      smoothForward = normalizeVec({ x: 0.4, y: -0.1, z: 0.9 });
      return { ...baseState, forward: smoothForward };
    }

    const rawT = Math.min(1, (now - focusTravel.startTime) / focusTravel.duration);
    const jumpT = getJumpProgress(rawT, !!focusTravel.exiting);

    if (focusTravel.exiting) {
      if (jumpT <= 0) {
        const hold = focusTravel.lastQuadrantId && bounds
          ? getSpaceshipTargetForQuadrant(focusTravel.lastQuadrantId, bounds)
          : DOCK_POSITION;
        group.position.set(hold.x, hold.y, hold.z);
        group.scale.setScalar(0.82);
        setRocketColors(0.3);
        return {
          chaseActive: rawT < 0.48,
          position: { x: hold.x, y: hold.y, z: hold.z },
          forward: smoothForward,
          exhaust: smoothExhaust,
        };
      }

      const fromPos = focusTravel.shipFromPos
        || (focusTravel.lastQuadrantId && bounds
          ? getSpaceshipTargetForQuadrant(focusTravel.lastQuadrantId, bounds)
          : DOCK_POSITION);
      if (!flightPath) flightPath = buildCinematicPath(fromPos, DOCK_POSITION);
      group.scale.setScalar(0.78);
      const { pos, fwd } = samplePath(jumpT, flightPath);
      group.position.set(pos.x, pos.y, pos.z);
      orientShip(pos, fwd, dt);
      setRocketColors(jumpT);
      pushTrailPoint(pos, dt);
      updateRocketTrail(jumpT, dt);

      return {
        chaseActive: true,
        position: { x: pos.x, y: pos.y, z: pos.z },
        forward: smoothForward,
        exhaust: jumpT,
      };
    }

    const arcFrom = focusTravel.shipFromPos || DOCK_POSITION;
    const arcTo = focusTravel.shipTarget;
    if (!flightPath) flightPath = buildCinematicPath(arcFrom, arcTo);

    if (rawT < LAUNCH_PREP_END) {
      const charge = easeInOutCubic(rawT / LAUNCH_PREP_END);
      group.position.copy(dock);
      group.scale.setScalar(1 + Math.sin(charge * Math.PI) * 0.05);
      const toward = normalizeVec({
        x: arcTo.x - dock.x,
        y: arcTo.y - dock.y,
        z: arcTo.z - dock.z,
      });
      orientShip({ x: dock.x, y: dock.y, z: dock.z }, toward, dt);
      setRocketColors(charge * 0.7);
      pushTrailPoint({ x: dock.x, y: dock.y, z: dock.z }, dt);
      updateRocketTrail(charge * 0.4, dt);

      return {
        chaseActive: charge > 0.3,
        position: { x: dock.x, y: dock.y, z: dock.z },
        forward: smoothForward,
        exhaust: charge,
      };
    }

    group.scale.setScalar(0.78);
    const { pos, fwd } = samplePath(jumpT, flightPath);
    group.position.set(pos.x, pos.y, pos.z);
    orientShip(pos, fwd, dt);

    const exhaust = 0.5 + jumpT * 0.5;
    setRocketColors(exhaust);
    pushTrailPoint(pos, dt);
    updateRocketTrail(exhaust, dt);

    if (jumpT >= 1) {
      const c = bounds[focusTravel.quadrantId]?.center;
      if (c) group.lookAt(c.x, c.y, c.z);
    }

    return {
      chaseActive: rawT > LAUNCH_PREP_END && rawT < SHIP_FLIGHT_END + 0.08,
      position: { x: pos.x, y: pos.y, z: pos.z },
      forward: smoothForward,
      exhaust,
    };
  };

  const resetToDock = () => {
    flightPath = null;
    clearRocketTrail();
    smoothExhaust = 0;
    group.position.copy(dock);
    group.rotation.set(DOCK_ROTATION.x, DOCK_ROTATION.y, DOCK_ROTATION.z);
    group.scale.setScalar(1);
    trailMat.opacity = 0;
    engineMat.opacity = 0.5;
    engineMat.color.setHex(0x60a5fa);
    trailMat.color.setHex(0x93c5fd);
    light.color.setHex(0x60a5fa);
    light.intensity = 0.35;
    accentMat.emissive.setHex(0x4f46e5);
    accentMat.emissiveIntensity = 0.35;
  };

  const dispose = () => {
    scene.remove(group);
    scene.remove(rocketTrailGroup);
    disposables.forEach((p) => {
      p.geom?.dispose();
      p.mat?.dispose();
    });
    trailSegments.forEach((s) => s.mat.dispose());
  };

  const resetFlightPath = () => {
    flightPath = null;
  };

  return {
    group,
    dock,
    tick,
    resetToDock,
    resetFlightPath,
    dispose,
    hideJumpLane,
    getTarget: getSpaceshipTargetForQuadrant,
  };
}
