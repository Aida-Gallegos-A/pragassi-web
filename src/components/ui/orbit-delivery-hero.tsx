// @ts-nocheck — generated single-file distribution; typed sources live in the app.
// Orbit Delivery — self-contained 3D hero, adapted for Pragassi.
// Dependencies: React, Three.js, @react-three/fiber.
// Drag to rotate. Pause to greet. Supports .dark and data-theme="dark".
// The planet surface height map lives in /public/models/surface.json (generated from the planet mesh).

var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/motion.ts
function stepPlanet(m, dt, auto, reduced, autoRoll = -0.032) {
  m.time += dt;
  if (!auto) {
    m.dragging = false;
    m.planetVelocity = m.pitchVelocity = 0;
    m.dragTarget = m.planetAngle;
    m.pitchTarget = m.pitchAngle;
    return;
  }
  if (m.dragging) {
    const acceleration = 90 * (m.dragTarget - m.planetAngle) - 18 * m.planetVelocity;
    m.planetVelocity += acceleration * dt;
  } else {
    const desired = auto && !reduced && m.time - m.lastInteraction > 3.5 ? autoRoll : 0;
    m.planetVelocity = damp(m.planetVelocity, desired, reduced ? 12 : 5, dt);
  }
  m.planetVelocity = clamp(m.planetVelocity, -1.15, 1.15);
  m.planetAngle += m.planetVelocity * dt;
}
function stepRunner(m, dt, screenTopLocal, reduced) {
  m.characterTarget += Math.atan2(Math.sin(screenTopLocal - m.characterTarget), Math.cos(screenTopLocal - m.characterTarget));
  const error = m.characterTarget - m.characterAngle;
  const stiffness = reduced ? 110 : 48;
  const damping = reduced ? 21 : 11;
  m.characterVelocity += (stiffness * error - damping * m.characterVelocity) * dt;
  m.characterAngle += m.characterVelocity * dt;
  const speed = Math.abs(m.characterVelocity);
  m.activity = damp(m.activity, smoothstep(speed, 4e-3, 0.022), 9, dt);
  if (speed > 0.025) m.direction = Math.sign(m.characterVelocity);
  m.phase += speed * 2.25 / GAIT_DISTANCE * Math.PI * 2 * dt;
}
var clamp, damp, smoothstep, GAIT_DISTANCE, createMotion;
var init_motion = __esm({
  "src/motion.ts"() {
    "use strict";
    clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    damp = (value, target, lambda, dt) => value + (target - value) * (1 - Math.exp(-lambda * dt));
    smoothstep = (value, min, max) => {
      const t = clamp((value - min) / (max - min), 0, 1);
      return t * t * (3 - 2 * t);
    };
    GAIT_DISTANCE = 0.44;
    createMotion = () => ({
      planetAngle: 0,
      planetVelocity: 0,
      dragTarget: 0,
      characterTarget: 0,
      characterAngle: 0,
      characterVelocity: 0,
      phase: 0,
      activity: 0,
      direction: 1,
      time: 0,
      dragging: false,
      lastInteraction: 0,
      pitchAngle: 0,
      pitchVelocity: 0,
      pitchTarget: 0
    });
  }
});

// src/globeMotion.ts
import { Euler, MathUtils, Quaternion, Vector3 } from "three";
function createGlobeMotion() {
  return { delta: new Quaternion(), orientation: new Quaternion().setFromEuler(new Euler(0.1, 0.5, 0)), angular: new Vector3(), route: 0 };
}
function stepGlobeMotion(globe, m, dt, auto, reduced) {
  const roaming = auto && !reduced && !m.dragging && m.time - m.lastInteraction > 3.5;
  if (roaming) globe.route += 0.24 * dt;
  stepPlanet(m, dt, auto, reduced, -0.24 * Math.cos(globe.route));
  if (!auto) {
    globe.angular.set(0, 0, 0);
    return;
  }
  if (m.dragging) m.pitchVelocity += (70 * (m.pitchTarget - m.pitchAngle) - 17 * m.pitchVelocity) * dt;
  else m.pitchVelocity = MathUtils.damp(m.pitchVelocity, roaming ? 0.24 * Math.sin(globe.route) : 0, 6, dt);
  m.pitchVelocity = MathUtils.clamp(m.pitchVelocity, -0.55, 0.55);
  m.pitchAngle += m.pitchVelocity * dt;
  globe.angular.set(m.pitchVelocity, m.planetVelocity * 0.45, -m.planetVelocity);
  const speed = globe.angular.length();
  if (speed > 1e-8) {
    globe.delta.setFromAxisAngle(globe.angular.multiplyScalar(1 / speed), speed * dt);
    globe.orientation.premultiply(globe.delta).normalize();
  }
}
var init_globeMotion = __esm({
  "src/globeMotion.ts"() {
    "use strict";
    init_motion();
  }
});

// src/surfaceMotion.ts
import { Vector3 as Vector32, Quaternion as Quaternion2, MathUtils as MathUtils2 } from "three";
function createSurfaceMotion() {
  return {
    current: new Vector32(0, 1, 0),
    target: new Vector32(0, 1, 0),
    velocity: new Vector32(),
    error: new Vector32(),
    worldNormal: new Vector32(),
    worldVelocity: new Vector32(),
    inverse: new Quaternion2(),
    initialized: false
  };
}
function stepSurface(s, m, rotation, screenUp, dt, reduced, paused = false) {
  s.inverse.copy(rotation).invert();
  s.target.copy(screenUp).applyQuaternion(s.inverse).normalize();
  if (!s.initialized) {
    s.current.copy(s.target);
    s.initialized = true;
  }
  if (paused) {
    s.velocity.set(0, 0, 0);
    s.worldVelocity.set(0, 0, 0);
    s.worldNormal.copy(s.current).applyQuaternion(rotation);
    m.characterVelocity = 0;
    m.activity = MathUtils2.damp(m.activity, 0, 10, dt);
    return;
  }
  const cosine = MathUtils2.clamp(s.current.dot(s.target), -1, 1);
  const angle = Math.acos(cosine);
  s.error.copy(s.target).addScaledVector(s.current, -cosine);
  if (s.error.lengthSq() > 1e-12) s.error.normalize().multiplyScalar(angle);
  const stiffness = reduced ? 110 : 48, damping = reduced ? 21 : 11;
  s.velocity.addScaledVector(s.error, stiffness * dt).multiplyScalar(Math.exp(-damping * dt));
  s.velocity.addScaledVector(s.current, -s.velocity.dot(s.current));
  s.current.addScaledVector(s.velocity, dt).normalize();
  s.velocity.addScaledVector(s.current, -s.velocity.dot(s.current));
  s.worldNormal.copy(s.current).applyQuaternion(rotation);
  s.worldVelocity.copy(s.velocity).applyQuaternion(rotation);
  const speed = s.velocity.length();
  m.characterTarget = Math.atan2(s.target.x, s.target.y);
  m.characterAngle = Math.atan2(s.current.x, s.current.y);
  if (Math.abs(s.worldVelocity.x) > 0.012) m.direction = Math.sign(s.worldVelocity.x);
  m.characterVelocity = speed * m.direction;
  m.activity = MathUtils2.damp(m.activity, MathUtils2.smoothstep(speed, 4e-3, 0.022), 9, dt);
  m.phase += speed * 2.25 / GAIT_DISTANCE * Math.PI * 2 * dt;
}
var init_surfaceMotion = __esm({
  "src/surfaceMotion.ts"() {
    "use strict";
    init_motion();
  }
});

// embedded:assets
import { createContext } from "react";
var AssetBaseContext, surface;
var init_assets = __esm({
  "embedded:assets"() {
    AssetBaseContext = createContext("");
    surface = `${import.meta.env.BASE_URL}models/surface.json`;
  }
});

// src/planetAsset.ts
import { useContext } from "react";
import { useEffect, useState } from "react";
import { FrontSide, Mesh, MeshStandardMaterial, SkinnedMesh, Texture } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
function disposeScene(scene) {
  const textures = /* @__PURE__ */ new Set();
  const materials = /* @__PURE__ */ new Set();
  const geometries = /* @__PURE__ */ new Set();
  const skeletons = /* @__PURE__ */ new Set();
  scene.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    geometries.add(node.geometry);
    if (node instanceof SkinnedMesh) skeletons.add(node.skeleton);
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
      materials.add(material);
      for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value);
    }
  });
  geometries.forEach((geometry) => geometry.dispose());
  skeletons.forEach((skeleton) => skeleton.dispose());
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => {
    texture.dispose();
    if (typeof ImageBitmap !== "undefined" && texture.image instanceof ImageBitmap) texture.image.close();
  });
}
function usePlanetAsset(onReady) {
  const base = useContext(AssetBaseContext);
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const abort = new AbortController();
    const draco = new DRACOLoader().setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/").setDecoderConfig({ type: "wasm" }).setWorkerLimit(2);
    const loader = new GLTFLoader().setDRACOLoader(draco).setMeshoptDecoder(MeshoptDecoder);
    let disposed = false;
    let scene;
    const fetchChecked = async (path) => {
      const response = await fetch(path, { signal: abort.signal });
      if (!response.ok) throw new Error(`Planet asset could not load (${response.status})`);
      return response;
    };
    onReady?.(false);
    Promise.all([
      fetchChecked(`${base}models/whimsical-world.glb`).then((response) => response.arrayBuffer()),
      fetchChecked(surface).then((response) => response.json())
    ]).then(async ([buffer, surface2]) => {
      if (disposed) return;
      const gltf = await loader.parseAsync(buffer, `${base}models/`);
      scene = gltf.scene;
      if (disposed) {
        disposeScene(scene);
        return;
      }
      scene.traverse((node) => {
        node.updateMatrix();
        node.matrixAutoUpdate = false;
        if (!(node instanceof Mesh)) return;
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        for (const mat of materials) if (mat instanceof MeshStandardMaterial) {
          mat.side = FrontSide;
          mat.metalness = 0;
          mat.roughness = 0.86;
          mat.normalScale.setScalar(0.65);
          if (mat.map) {
            mat.map.anisotropy = 4;
            mat.emissive.set("#ffffff");
            mat.emissiveMap = mat.map;
            mat.emissiveIntensity = 0.16;
          }
          mat.onBeforeCompile = (shader) => {
            shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n  float lumaPragassi = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));\n  diffuseColor.rgb = max(mix(vec3(lumaPragassi), diffuseColor.rgb, 1.38), 0.0) * 1.06;").replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n  float rimPragassi = pow(1.0 - clamp(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 3.0);\n  totalEmissiveRadiance += vec3(0.55, 0.86, 1.0) * rimPragassi * 0.85;");
          };
        }
      });
      setAsset({ scene, surface: surface2 });
      onReady?.(true);
    }).catch((reason) => {
      if (!disposed) setError(reason instanceof Error ? reason : new Error(String(reason)));
    }).finally(() => {
      if (!disposed) draco.dispose();
    });
    return () => {
      disposed = true;
      abort.abort();
      draco.dispose();
      if (scene) disposeScene(scene);
    };
  }, [onReady, base]);
  if (error) throw error;
  return asset;
}
function surfaceRadius(surface2, x, y, z) {
  const u = (Math.atan2(x, z) / (2 * Math.PI) % 1 + 1) % 1 * surface2.width;
  const v = Math.acos(Math.max(-1, Math.min(1, y))) / Math.PI * (surface2.height - 1);
  const x0 = Math.floor(u), x1 = (x0 + 1) % surface2.width;
  const y0 = Math.floor(v), y1 = Math.min(y0 + 1, surface2.height - 1);
  const tx = u - x0, ty = v - y0;
  const a = surface2.radii[y0 * surface2.width + x0] * (1 - tx) + surface2.radii[y0 * surface2.width + x1] * tx;
  const b = surface2.radii[y1 * surface2.width + x0] * (1 - tx) + surface2.radii[y1 * surface2.width + x1] * tx;
  return a * (1 - ty) + b * ty;
}
var init_planetAsset = __esm({
  "src/planetAsset.ts"() {
    "use strict";
    init_assets();
  }
});

// src/runCycle.ts
import { AnimationClip, Quaternion as Quaternion3 } from "three";
function makeSeamlessRun(source) {
  const reference = source.tracks.reduce((best, track) => track.times.length > best.times.length ? track : best);
  const start = reference.times[0];
  const last = reference.times[reference.times.length - 1];
  const intervals = Array.from(reference.times).slice(1).map((time, i) => time - reference.times[i]).sort((a, b) => a - b);
  const step = intervals.length ? intervals[Math.floor(intervals.length / 2)] : 1 / 24;
  const period = Math.max(step, last - start + step);
  const frames = Math.max(40, Math.ceil(period * 120));
  const quaternion = new Quaternion3();
  const tracks = source.tracks.map((track) => {
    const count = track.times.length, size = track.getValueSize();
    const knots = Array.from(track.times, (time) => time - start);
    const samples = Array.from(track.values);
    const isRotation = track.name.endsWith(".quaternion");
    const isMorph = track.name.endsWith(".morphTargetInfluences");
    if (isRotation) for (let i = 1; i < count; i++) {
      let dot = 0;
      for (let c = 0; c < 4; c++) dot += samples[(i - 1) * 4 + c] * samples[i * 4 + c];
      if (dot < 0) for (let c = 0; c < 4; c++) samples[i * 4 + c] *= -1;
    }
    const times = [], values = [];
    for (let frame = 0; frame <= frames; frame++) {
      const time = frame === frames ? 0 : frame / frames * period;
      times.push(frame / frames * period);
      let index = 0;
      while (index < count - 1 && knots[index + 1] <= time) index++;
      const previous = (index - 1 + count) % count, next = (index + 1) % count, after = (index + 2) % count;
      const t1 = knots[index], t2 = next === 0 ? period + knots[0] : knots[next];
      const t0 = previous > index ? knots[previous] - period : knots[previous];
      const t3 = after <= next ? knots[after] + period : knots[after];
      const afterTime = t3 <= t2 ? t3 + period : t3;
      const length = Math.max(t2 - t1, 1e-6), u = Math.max(0, Math.min(1, (time - t1) / length));
      for (let c = 0; c < size; c++) {
        const p0 = samples[previous * size + c], p1 = samples[index * size + c], p2 = samples[next * size + c], p3 = samples[after * size + c];
        const a = count < 3 ? 0 : (p2 - p0) / Math.max(t2 - t0, 1e-6) * length;
        const b = count < 3 ? 0 : (p3 - p1) / Math.max(afterTime - t1, 1e-6) * length;
        values.push(count === 1 ? p1 : isMorph ? p1 + (p2 - p1) * u : (2 * u ** 3 - 3 * u ** 2 + 1) * p1 + (u ** 3 - 2 * u ** 2 + u) * a + (-2 * u ** 3 + 3 * u ** 2) * p2 + (u ** 3 - u ** 2) * b);
      }
      if (isRotation) {
        quaternion.fromArray(values, values.length - 4).normalize();
        quaternion.toArray(values, values.length - 4);
      }
    }
    const result = track.clone();
    result.times = new Float32Array(times);
    result.values = new Float32Array(values);
    return result;
  });
  return new AnimationClip("Courier_Run_Seamless", period, tracks);
}
var init_runCycle = __esm({
  "src/runCycle.ts"() {
    "use strict";
  }
});

// src/bagSuspension.ts
import { Bone, Euler as Euler2, MathUtils as MathUtils3, Matrix4, Quaternion as Quaternion4, Vector3 as Vector33 } from "three";
var BagSuspension;
var init_bagSuspension = __esm({
  "src/bagSuspension.ts"() {
    "use strict";
    BagSuspension = class {
      constructor(scene) {
        this.scene = scene;
        const bone = scene.getObjectByName("CourierBag");
        if (!(bone instanceof Bone)) throw new Error("Courier bag attachment is missing.");
        this.bone = bone;
        scene.updateWorldMatrix(true, true);
        scene.getWorldQuaternion(this.sceneOrientation);
        bone.getWorldQuaternion(this.restOrientation);
        this.restOrientation.premultiply(this.sceneOrientation.invert());
        this.inverseRest.copy(this.restOrientation).invert();
      }
      bone;
      restOrientation = new Quaternion4();
      animatedOrientation = new Quaternion4();
      animatedPosition = new Vector33();
      localAnchor = new Vector33();
      gravityTilt = new Quaternion4();
      pelvisYaw = new Quaternion4();
      inverseRest = new Quaternion4();
      xAxis = new Vector33(1, 0, 0);
      hangingOrientation = new Quaternion4();
      sceneOrientation = new Quaternion4();
      parentOrientation = new Quaternion4();
      swing = new Quaternion4();
      angles = new Euler2();
      inverseScene = new Matrix4();
      anchor = new Vector33();
      previousAnchor = new Vector33();
      velocity = new Vector33();
      previousVelocity = new Vector33();
      acceleration = new Vector33();
      initialized = false;
      applied = false;
      pitch = 0;
      roll = 8e-3;
      pitchVelocity = 0;
      rollVelocity = 0;
      restore() {
        if (!this.applied) return;
        this.bone.position.copy(this.animatedPosition);
        this.bone.quaternion.copy(this.animatedOrientation);
        this.applied = false;
      }
      update(dt, activity, _phase, turnRate, reduced, bodyLean = 0) {
        if (dt <= 0 || !this.bone.parent) return;
        this.animatedPosition.copy(this.bone.position);
        this.animatedOrientation.copy(this.bone.quaternion);
        this.inverseScene.copy(this.scene.matrixWorld).invert();
        this.bone.getWorldPosition(this.anchor).applyMatrix4(this.inverseScene);
        if (!this.initialized) {
          this.previousAnchor.copy(this.anchor);
          this.initialized = true;
        }
        this.velocity.copy(this.anchor).sub(this.previousAnchor).divideScalar(dt);
        this.acceleration.copy(this.velocity).sub(this.previousVelocity).divideScalar(dt);
        this.previousVelocity.lerp(this.velocity, 1 - Math.exp(-14 * dt));
        this.previousAnchor.copy(this.anchor);
        const gravity = Math.max(4, 9.81 + this.acceleration.y);
        const targetPitch = reduced ? 0 : MathUtils3.clamp(
          Math.atan2(this.acceleration.z, gravity),
          -0.1,
          0.1
        );
        const targetRoll = reduced ? 0 : MathUtils3.clamp(
          Math.atan2(-this.acceleration.x, gravity) + Math.abs(turnRate) * 1e-3,
          -0.012,
          0.045
        );
        const steps = Math.ceil(dt / (1 / 120)), h = dt / steps;
        for (let i = 0; i < steps; i++) {
          this.pitchVelocity += ((targetPitch - this.pitch) * 72 - this.pitchVelocity * 11) * h;
          this.rollVelocity += ((targetRoll - this.roll) * 64 - this.rollVelocity * 10) * h;
          this.pitch = MathUtils3.clamp(this.pitch + this.pitchVelocity * h, -0.12, 0.12);
          this.roll = MathUtils3.clamp(this.roll + this.rollVelocity * h, -0.012, 0.05);
        }
        this.scene.getWorldQuaternion(this.sceneOrientation);
        this.bone.getWorldQuaternion(this.pelvisYaw).premultiply(this.parentOrientation.copy(this.sceneOrientation).invert()).multiply(this.inverseRest);
        this.pelvisYaw.set(0, this.pelvisYaw.y, 0, this.pelvisYaw.w).normalize();
        this.bone.parent.getWorldQuaternion(this.parentOrientation).invert();
        this.swing.setFromEuler(this.angles.set(this.pitch, 0, this.roll));
        this.gravityTilt.setFromAxisAngle(this.xAxis, -bodyLean);
        this.hangingOrientation.copy(this.parentOrientation).multiply(this.sceneOrientation).multiply(this.gravityTilt).multiply(this.pelvisYaw).multiply(this.swing).multiply(this.restOrientation);
        this.bone.quaternion.copy(this.animatedOrientation).slerp(this.hangingOrientation, 1 - activity * 0.3);
        this.localAnchor.copy(this.anchor).addScaledVector(this.xAxis, -9e-3 * (1 - activity * 0.5));
        this.localAnchor.y -= 0.027;
        this.localAnchor.applyMatrix4(this.scene.matrixWorld);
        this.bone.parent.worldToLocal(this.localAnchor);
        this.bone.position.copy(this.localAnchor);
        this.bone.updateWorldMatrix(false, true);
        this.applied = true;
      }
    };
  }
});

// src/courierGreeting.ts
import { Bone as Bone2, MathUtils as MathUtils4, Quaternion as Quaternion5, Vector3 as Vector34 } from "three";
var up, CourierGreeting;
var init_courierGreeting = __esm({
  "src/courierGreeting.ts"() {
    "use strict";
    up = new Vector34(0, 1, 0);
    CourierGreeting = class {
      constructor(scene) {
        this.scene = scene;
        scene.updateWorldMatrix(true, true);
        const inverseScene = scene.getWorldQuaternion(new Quaternion5()).invert();
        this.joints = ["RightArm", "RightForeArm", "RightHand"].map((name) => {
          const bone = scene.getObjectByName(name);
          if (!(bone instanceof Bone2)) throw new Error(`Greeting joint ${name} is missing.`);
          const rest = bone.getWorldQuaternion(new Quaternion5()).premultiply(inverseScene);
          const direction = up.clone().applyQuaternion(rest).normalize();
          const palm = new Vector34(1, 0, 0).addScaledVector(direction, -direction.x).normalize();
          return { bone, rest, direction, palm, animated: bone.quaternion.clone() };
        });
        this.restBendNormal.crossVectors(this.joints[0].direction, this.joints[1].direction).normalize();
      }
      joints;
      sceneRotation = new Quaternion5();
      inverseParent = new Quaternion5();
      aim = new Quaternion5();
      twist = new Quaternion5();
      target = new Quaternion5();
      direction = new Vector34();
      palm = new Vector34();
      wantedPalm = new Vector34();
      cross = new Vector34();
      restBendNormal = new Vector34();
      bendNormal = new Vector34();
      upperDirection = new Vector34(-0.55, -0.65, 0.52).normalize();
      forearmDirection = new Vector34();
      phase = 0;
      applied = false;
      weight = 0;
      restore() {
        if (!this.applied) return;
        for (const joint of this.joints) joint.bone.quaternion.copy(joint.animated);
        this.applied = false;
      }
      step(dt, ready, reduced) {
        this.weight = MathUtils4.damp(this.weight, ready ? 1 : 0, ready ? 4 : 9, dt);
        if (this.weight < 1e-4) {
          this.weight = 0;
          this.phase = 0;
        }
        if (ready && this.weight > 0.85 && !reduced) this.phase += dt * Math.PI * 2 * 0.9;
      }
      apply(reduced) {
        if (this.weight === 0) return;
        this.scene.getWorldQuaternion(this.sceneRotation);
        const wave = Math.sin(this.phase) * (reduced ? 0 : 0.12) * MathUtils4.smoothstep(this.weight, 0.85, 0.99);
        this.forearmDirection.set(-0.08 + wave * 0.35, 0.94, 0.33).normalize();
        this.bendNormal.crossVectors(this.upperDirection, this.forearmDirection).normalize();
        this.joints.forEach((joint, index) => {
          joint.animated.copy(joint.bone.quaternion);
          if (index === 0) this.direction.copy(this.upperDirection);
          else if (index === 1) this.direction.copy(this.forearmDirection);
          else this.direction.set(-0.06 + wave, 0.97, 0.22);
          this.direction.normalize();
          this.aim.setFromUnitVectors(joint.direction, this.direction);
          this.target.copy(this.aim).multiply(joint.rest);
          this.palm.copy(this.restBendNormal).addScaledVector(joint.direction, -this.restBendNormal.dot(joint.direction)).normalize().applyQuaternion(this.aim);
          this.wantedPalm.copy(this.bendNormal).addScaledVector(this.direction, -this.bendNormal.dot(this.direction)).normalize();
          const angle = Math.atan2(this.direction.dot(this.cross.crossVectors(this.palm, this.wantedPalm)), this.palm.dot(this.wantedPalm));
          this.twist.setFromAxisAngle(this.direction, angle);
          this.target.premultiply(this.twist);
          joint.bone.parent.getWorldQuaternion(this.inverseParent).invert();
          this.target.premultiply(this.sceneRotation).premultiply(this.inverseParent);
          joint.bone.quaternion.slerp(this.target, this.weight);
          joint.bone.updateWorldMatrix(false, true);
        });
        this.applied = true;
      }
    };
  }
});

// src/sceneOptimization.ts
import { Matrix4 as Matrix42, Mesh as Mesh2, SkinnedMesh as SkinnedMesh2 } from "three";
function optimizeRigidBag(scene) {
  scene.updateWorldMatrix(true, true);
  const candidates = [];
  scene.traverse((node) => {
    if (node instanceof SkinnedMesh2 && node.name.startsWith("Delivery_Bag")) candidates.push(node);
  });
  for (const mesh of candidates) {
    if (Object.keys(mesh.geometry.morphAttributes).length) continue;
    const weights = mesh.geometry.getAttribute("skinWeight");
    const indices = mesh.geometry.getAttribute("skinIndex");
    if (!weights || !indices) continue;
    let joint = -1, rigid = true;
    for (let vertex = 0; vertex < weights.count && rigid; vertex++) {
      let total = 0;
      for (let channel = 0; channel < 4; channel++) {
        const weight = weights.getComponent(vertex, channel);
        if (weight < 1e-6) continue;
        const index = indices.getComponent(vertex, channel);
        if (joint < 0) joint = index;
        if (index !== joint) {
          rigid = false;
          break;
        }
        total += weight;
      }
      if (Math.abs(total - 1) > 1e-4) rigid = false;
    }
    if (!rigid || joint < 0) continue;
    const bone = mesh.skeleton.bones[joint];
    const bind = new Matrix42().multiplyMatrices(mesh.skeleton.boneInverses[joint], mesh.bindMatrix);
    const geometry = mesh.geometry.clone().applyMatrix4(bind);
    geometry.deleteAttribute("skinIndex");
    geometry.deleteAttribute("skinWeight");
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    const bag = new Mesh2(geometry, mesh.material);
    bag.name = mesh.name;
    bag.castShadow = mesh.castShadow;
    bag.receiveShadow = mesh.receiveShadow;
    bag.renderOrder = mesh.renderOrder;
    bag.matrixAutoUpdate = false;
    mesh.removeFromParent();
    bone.add(bag);
    let shared = false;
    scene.traverse((node) => {
      if (node instanceof Mesh2 && node.geometry === mesh.geometry) shared = true;
    });
    if (!shared) mesh.geometry.dispose();
  }
}
var init_sceneOptimization = __esm({
  "src/sceneOptimization.ts"() {
    "use strict";
  }
});

// src/Courier.tsx
import { useContext as useContext2 } from "react";
import { useEffect as useEffect2, useRef, useState as useState2 } from "react";
import { useFrame } from "@react-three/fiber";
import { AnimationClip as AnimationClip2, AnimationMixer, Bone as Bone3, LoopRepeat, MathUtils as MathUtils5, Mesh as Mesh3, MeshStandardMaterial as MeshStandardMaterial2, NumberKeyframeTrack, Quaternion as Quaternion6, QuaternionKeyframeTrack, SkinnedMesh as SkinnedMesh3, Vector3 as Vector35, VectorKeyframeTrack } from "three";
import { GLTFLoader as GLTFLoader2 } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader as DRACOLoader2 } from "three/examples/jsm/loaders/DRACOLoader.js";
function makeIdle(scene) {
  const tracks = [];
  const breath = new Quaternion6().setFromAxisAngle(new Vector35(1, 0, 0), 9e-3);
  scene.traverse((node) => {
    if (node instanceof Mesh3 && node.morphTargetInfluences?.length) {
      const zeros = new Array(node.morphTargetInfluences.length).fill(0);
      tracks.push(new NumberKeyframeTrack(`${node.name}.morphTargetInfluences`, [0, 3], [...zeros, ...zeros]));
    }
    if (!(node instanceof Bone3)) return;
    const q = node.quaternion.clone(), middle = q.clone();
    if (node.name === "Spine02" || node.name === "neck") middle.multiply(breath);
    tracks.push(new QuaternionKeyframeTrack(`${node.name}.quaternion`, [0, 1.5, 3], [...q.toArray(), ...middle.toArray(), ...q.toArray()]));
    const p = node.position.clone(), inhale = p.clone();
    if (node.name === "Hips") inhale.y += 4e-3;
    tracks.push(new VectorKeyframeTrack(`${node.name}.position`, [0, 1.5, 3], [...p.toArray(), ...inhale.toArray(), ...p.toArray()]));
    tracks.push(new VectorKeyframeTrack(`${node.name}.scale`, [0, 3], [...node.scale.toArray(), ...node.scale.toArray()]));
  });
  return new AnimationClip2("Courier_Idle", 3, tracks);
}
function Courier({ motion, paused, reduced, onReady }) {
  const base = useContext2(AssetBaseContext);
  const facing = useRef(null), lean = useRef(null);
  const greetingTurn = useRef(false);
  const turnVelocity = useRef(0);
  const [asset, setAsset] = useState2(null);
  const [error, setError] = useState2(null);
  useEffect2(() => {
    const abort = new AbortController();
    const draco = new DRACOLoader2().setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/").setDecoderConfig({ type: "wasm" }).setWorkerLimit(1);
    const loader = new GLTFLoader2().setDRACOLoader(draco).setMeshoptDecoder(MeshoptDecoder);
    let cancelled = false;
    let owned;
    onReady?.(false);
    const modelFile = "courier.glb";
    fetch(`${base}models/${modelFile}`, { signal: abort.signal }).then(async (response) => {
      if (!response.ok) throw new Error(`Courier could not load (${response.status})`);
      const data = await response.arrayBuffer();
      if (cancelled) return;
      const gltf = await loader.parseAsync(data, `${base}models/`);
      if (cancelled) {
        disposeScene(gltf.scene);
        return;
      }
      optimizeRigidBag(gltf.scene);
      gltf.scene.traverse((node) => {
        if (!(node instanceof Mesh3)) return;
        node.morphTargetInfluences?.fill(0);
        if (node instanceof SkinnedMesh3) node.frustumCulled = false;
        for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
          if (material instanceof MeshStandardMaterial2) {
            material.metalness = 0;
            material.roughness = 0.9;
            material.roughnessMap = null;
            material.normalScale.setScalar(0.25);
            if (material.map) material.map.anisotropy = 8;

          }
        }
      });
      const clips = gltf.animations.filter((animation) => animation.duration > 0.3);
      if (!clips.length) {
        disposeScene(gltf.scene);
        throw new Error("The courier run animation is missing.");
      }
      const clip = new AnimationClip2("Courier_Run_Source", -1, clips.flatMap((animation) => animation.tracks));
      const mixer = new AnimationMixer(gltf.scene);
      const bag = new BagSuspension(gltf.scene);
      const greeting = new CourierGreeting(gltf.scene);
      const idle = mixer.clipAction(makeIdle(gltf.scene)).play();
      const seamless = makeSeamlessRun(clip);
      const run = mixer.clipAction(seamless).setLoop(LoopRepeat, Infinity).play();
      run.zeroSlopeAtStart = false;
      run.zeroSlopeAtEnd = false;
      run.setEffectiveTimeScale(0);
      run.setEffectiveWeight(0);
      mixer.update(0);
      owned = { scene: gltf.scene, mixer, idle, run, duration: seamless.duration, bag, greeting };
      setAsset(owned);
      onReady?.(true);
    }).catch((reason) => {
      if (!cancelled) setError(reason instanceof Error ? reason : new Error(String(reason)));
    }).finally(() => {
      if (!cancelled) draco.dispose();
    });
    return () => {
      cancelled = true;
      abort.abort();
      draco.dispose();
      if (owned) {
        owned.mixer.stopAllAction();
        owned.mixer.uncacheRoot(owned.scene);
        disposeScene(owned.scene);
      }
    };
  }, [onReady, base]);
  useFrame((_, delta) => {
    if (!asset) return;
    const dt = Math.min(delta, 0.05), m = motion.current;
    if (!paused) greetingTurn.current = false;
    else if (m.activity < 0.06) greetingTurn.current = true;
    const desired = paused ? greetingTurn.current ? m.cameraHeading ?? 0 : facing.current.rotation.y : (m.heading ?? 0) + Math.PI / 2;
    const turn = Math.atan2(Math.sin(desired - facing.current.rotation.y), Math.cos(desired - facing.current.rotation.y));
    if (paused) {
      const acceleration = MathUtils5.clamp(18 * turn - 8.5 * turnVelocity.current, -5.5, 5.5);
      turnVelocity.current = MathUtils5.clamp(turnVelocity.current + acceleration * dt, -2.2, 2.2);
      if (Math.abs(turn) < 3e-3 && Math.abs(turnVelocity.current) < 0.025) turnVelocity.current = 0;
      facing.current.rotation.y += turnVelocity.current * dt;
    } else {
      const rotation = turn * (1 - Math.exp(-12 * dt));
      facing.current.rotation.y += rotation;
      turnVelocity.current = rotation / dt;
    }
    const turning = paused && greetingTurn.current && !reduced ? MathUtils5.smoothstep(Math.abs(turnVelocity.current), 0.08, 1.2) : 0;
    asset.greeting.step(dt, paused && greetingTurn.current && Math.abs(turn) < 0.055 && Math.abs(turnVelocity.current) < 0.13, reduced);
    lean.current.rotation.x = MathUtils5.damp(lean.current.rotation.x, Math.min(Math.abs(m.characterVelocity) * 0.065, 0.09) * (reduced ? 0.35 : 1), 9, dt);
    const activity = Math.max(m.activity, turning * 0.3) * (1 - asset.greeting.weight);
    asset.run.setEffectiveWeight(activity);
    asset.idle.setEffectiveWeight(1 - activity);
    asset.idle.paused = reduced;
    const playback = Math.max(Math.abs(m.characterVelocity) * 2.25 / GAIT_DISTANCE * asset.duration, turning * 0.72);
    asset.run.setEffectiveTimeScale(MathUtils5.damp(asset.run.timeScale, playback, 10, dt));
    asset.greeting.restore();
    asset.bag.restore();
    asset.mixer.update(dt);
    asset.scene.updateWorldMatrix(true, true);
    asset.greeting.apply(reduced);
    asset.bag.update(dt, activity, m.phase, turnVelocity.current, reduced, lean.current.rotation.x);
  });
  if (error) throw error;
  return <group ref={facing} rotation={[0, Math.PI / 2, 0]}><group ref={lean}><group scale={MODEL_SCALE}>{asset && <primitive object={asset.scene} dispose={null} />}</group></group></group>;
}
var MODEL_SCALE;
var init_Courier = __esm({
  "src/Courier.tsx"() {
    "use strict";
    init_assets();
    init_planetAsset();
    init_motion();
    init_runCycle();
    init_bagSuspension();
    init_courierGreeting();
    init_sceneOptimization();
    MODEL_SCALE = 0.76 / 1.7;
  }
});

// src/renderQuality.ts
function chooseRenderQuality() {
  if (typeof navigator === "undefined") return "low";
  const device = navigator;
  const preference = new URLSearchParams(location.search).get("quality");
  if (preference === "high") return "high";
  if (preference === "low") return "low";
  const mobile = matchMedia("(pointer: coarse)").matches && Math.min(screen.width, screen.height) < 900;
  const limited = (device.hardwareConcurrency || 4) <= 4 || device.deviceMemory !== void 0 && device.deviceMemory <= 4;
  const slowConnection = device.connection?.saveData || /(^|-)2g$/.test(device.connection?.effectiveType || "");
  return mobile || limited || slowConnection ? "low" : "high";
}
var renderQuality;
var init_renderQuality = __esm({
  "src/renderQuality.ts"() {
    "use strict";
    renderQuality = chooseRenderQuality();
  }
});

// src/AdaptiveResolution.tsx
import { useEffect as useEffect4, useRef as useRef3 } from "react";
import { useFrame as useFrame3, useThree as useThree2 } from "@react-three/fiber";
function AdaptiveResolution({ active }) {
  const setDpr = useThree2((state) => state.setDpr);
  const maximum = Math.min((typeof window !== "undefined" ? window.devicePixelRatio : 1) || 1, renderQuality === "low" ? 1.25 : 2);
  const minimum = Math.min(maximum, renderQuality === "low" ? 1 : 1.25);
  const sample = useRef3({ warmup: 3, time: 0, frames: 0, goodWindows: 0, dpr: maximum });
  useEffect4(() => {
    sample.current.warmup = 3;
    sample.current.time = 0;
    sample.current.frames = 0;
    sample.current.goodWindows = 0;
  }, [active]);
  useFrame3((state, delta) => {
    const s = sample.current;
    if (!active || delta <= 0) return;
    if (s.warmup > 0) {
      s.warmup -= Math.min(delta, 0.1);
      return;
    }
    if (delta > 0.12) {
      s.time = 0;
      s.frames = 0;
      return;
    }
    s.time += delta;
    s.frames++;
    if (s.time < 2) return;
    const frameTime = s.time / s.frames;
    s.dpr = state.viewport.dpr;
    let next = s.dpr;
    if (frameTime > 1 / 48) {
      next = Math.max(minimum, s.dpr - 0.25);
      s.goodWindows = 0;
    } else if (frameTime < 1 / 57) {
      if (++s.goodWindows >= 4) {
        next = Math.min(maximum, s.dpr + 0.25);
        s.goodWindows = 0;
      }
    } else s.goodWindows = 0;
    s.time = 0;
    s.frames = 0;
    if (next !== s.dpr) {
      s.dpr = next;
      setDpr(next);
      s.warmup = 1;
    }
  });
  return null;
}
var init_AdaptiveResolution = __esm({
  "src/AdaptiveResolution.tsx"() {
    "use strict";
    init_renderQuality();
  }
});

// src/PlanetScene.tsx
var PlanetScene_exports = {};
__export(PlanetScene_exports, {
  default: () => PlanetScene2
});
import { useEffect as useEffect5, useMemo, useRef as useRef4, useState as useState3 } from "react";
import { Canvas as Canvas2, useFrame as useFrame4, useThree as useThree3 } from "@react-three/fiber";
import { AdditiveBlending, BackSide, Color, MathUtils as MathUtils6, Quaternion as Quaternion8, Vector3 as Vector37 } from "three";
function ResponsiveCamera() {
  const { size, camera } = useThree3();
  useEffect5(() => {
    const ortho = camera;
    ortho.zoom = size.width / (size.width < 700 ? 5.65 : 5.25);
    ortho.updateProjectionMatrix();
  }, [size.width, size.height, camera]);
  return null;
}
function World2({ motion, auto, reduced, onReady }) {
  const planet = useRef4(null), runner = useRef4(null), root = useRef4(null), rim = useRef4(null), halo = useRef4(null), intro = useRef4(0);
  const asset = usePlanetAsset();
  const [courierReady, setCourierReady] = useState3(false);
  useEffect5(() => {
    onReady?.(!!asset && courierReady);
  }, [asset, courierReady, onReady]);
  const radius = useRef4(2.2);
  const surface2 = useRef4(createSurfaceMotion());
  const globe = useMemo(createGlobeMotion, []);
  const frame = useMemo(() => ({ screenUp: new Vector37(), localVelocity: new Vector37(), cameraFront: new Vector37(), inverseRunner: new Quaternion8() }), []);
  const size = useThree3((state) => state.size);
  const small = size.width < 700;
  const zoom = size.width / (small ? 5.65 : 5.25);
  const centerY = size.height / zoom * (small ? 0.08 : 0.19) - 2.17;
  useFrame4(({ camera }, delta) => {
    if (!asset || !courierReady) return;
    const m = motion.current;
    const elapsed = Math.min(delta, 0.05), count = Math.ceil(elapsed / (1 / 120));
    // Entrance: the planet rises with a gentle overshoot, the atmosphere flashes, then the courier appears.
    intro.current = reduced ? 1 : Math.min(1, intro.current + elapsed / 1.7);
    const t = intro.current, back = 1.35;
    const rise = 1 + (back + 1) * Math.pow(t - 1, 3) + back * Math.pow(t - 1, 2);
    root.current.position.y = centerY - (1 - rise) * 2.8;
    planet.current.scale.setScalar(2.25 * (0.9 + 0.1 * Math.min(1, t * 1.4)));
    runner.current.visible = t > 0.62;
    const flash = reduced ? 0 : Math.sin(Math.PI * MathUtils6.clamp((t - 0.55) / 0.45, 0, 1)) * 0.9;
    const glow = Math.min(1, t * 1.6) + flash;
    if (rim.current) rim.current.uniforms.uIntensity.value = glow;
    if (halo.current) halo.current.uniforms.uIntensity.value = glow;
    frame.screenUp.copy(up3).applyQuaternion(camera.quaternion);
    for (let i = 0; i < count; i++) {
      const dt = elapsed / count;
      stepGlobeMotion(globe, m, dt, auto, reduced);
      stepSurface(surface2.current, m, globe.orientation, frame.screenUp, dt, reduced, !auto);
    }
    planet.current.quaternion.copy(globe.orientation);
    const s = surface2.current;
    const r = surfaceRadius(asset.surface, s.current.x, s.current.y, s.current.z) * 2.25;
    radius.current = MathUtils6.damp(radius.current, r + 8e-3, 25, elapsed);
    runner.current.position.copy(s.worldNormal).multiplyScalar(radius.current);
    runner.current.quaternion.setFromUnitVectors(up3, s.worldNormal);
    frame.inverseRunner.copy(runner.current.quaternion).invert();
    frame.cameraFront.set(0, 0, 1).applyQuaternion(camera.quaternion).applyQuaternion(frame.inverseRunner);
    m.cameraHeading = Math.atan2(frame.cameraFront.x, frame.cameraFront.z);
    if (s.velocity.lengthSq() > 1e-4) {
      frame.localVelocity.copy(s.worldVelocity).applyQuaternion(frame.inverseRunner);
      m.heading = Math.atan2(-frame.localVelocity.z, frame.localVelocity.x);
    }
  }, -1);
  return <group ref={root} position={[0, centerY - 2.8, 0]}>
    <group ref={planet} scale={2.25}>{asset && <primitive object={asset.scene} dispose={null} />}</group>
    {asset && <Atmosphere rimRef={rim} haloRef={halo} />}
    <group ref={runner} visible={false}><Courier motion={motion} paused={!auto} reduced={reduced} onReady={setCourierReady} /></group>
  </group>;
}
// Atmosphere: a Fresnel rim over the planet edge plus a soft halo that fades outward (orthographic camera looks down -Z).
var PLANET_R = 2.25 * 1.045;
var HALO_R = 2.25 * 1.3;
var atmosphereVertex = `varying vec2 vXY; varying vec3 vN; void main(){ vXY = position.xy; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
function Atmosphere({ rimRef, haloRef }) {
  const rimUniforms = useMemo(() => ({ uColor: { value: new Color("#bdefff") }, uIntensity: { value: 0 } }), []);
  const haloUniforms = useMemo(() => ({ uColor: { value: new Color("#38bff0") }, uInner: { value: 2.25 * 0.985 }, uOuter: { value: HALO_R }, uIntensity: { value: 0 } }), []);
  return <>
    <mesh renderOrder={2}>
      <sphereGeometry args={[PLANET_R, 96, 64]} />
      <shaderMaterial ref={rimRef} uniforms={rimUniforms} transparent premultipliedAlpha depthWrite={false} side={BackSide} blending={AdditiveBlending}
        vertexShader={atmosphereVertex}
        fragmentShader={`uniform vec3 uColor; uniform float uIntensity; varying vec3 vN; void main(){ float f = pow(1.0 - abs(vN.z), 2.6) * 1.2 * uIntensity; gl_FragColor = vec4(uColor * f, clamp(f, 0.0, 1.0)); }`} />
    </mesh>
    <mesh renderOrder={1}>
      <sphereGeometry args={[HALO_R, 96, 64]} />
      <shaderMaterial ref={haloRef} uniforms={haloUniforms} transparent depthWrite={false} side={BackSide}
        vertexShader={atmosphereVertex}
        fragmentShader={`uniform vec3 uColor; uniform float uInner; uniform float uOuter; uniform float uIntensity; varying vec2 vXY; void main(){ float d = length(vXY); float t = clamp((d - uInner) / (uOuter - uInner), 0.0, 1.0); float a = pow(1.0 - t, 2.4) * smoothstep(uInner * 0.97, uInner, d) * 0.62 * uIntensity; gl_FragColor = vec4(uColor, a); }`} />
    </mesh>
  </>;
}
function PlanetScene2(props) {
  const lowPower = renderQuality === "low";
  return <Canvas2 orthographic camera={{ position: [0, 0, 9], zoom: 150, near: 0.1, far: 30 }} dpr={lowPower ? [1, 1.25] : [1, 2]} frameloop={props.active ? "always" : "never"} gl={{ antialias: true, alpha: true, toneMappingExposure: 1.12, powerPreference: lowPower ? "low-power" : "high-performance" }}>
    <ResponsiveCamera />
    <AdaptiveResolution active={props.active} />
    <ambientLight intensity={0.85} /><hemisphereLight args={["#f4f9ff", "#6fa9d6", 1.45]} />
    {/* Dawn lighting: warm golden key from upper-left, cool cyan backlight for a rim of light */}
    <directionalLight position={[-4, 5, 5]} intensity={2.9} color="#ffe3b8" />
    <directionalLight position={[4, 1.5, -3]} intensity={2.6} color="#7fd6ff" />
    <directionalLight position={[2.5, -1, 4]} intensity={0.7} color="#cfe0ff" />
    <World2 {...props} />
  </Canvas2>;
}
var up3;
var init_PlanetScene = __esm({
  "src/PlanetScene.tsx"() {
    "use strict";
    init_globeMotion();
    init_surfaceMotion();
    init_planetAsset();
    init_Courier();
    init_renderQuality();
    init_AdaptiveResolution();
    up3 = new Vector37(0, 1, 0);
  }
});

// src/App.tsx — Pragassi hero
init_motion();
import { Component, Suspense, lazy, useEffect as useEffect6, useRef as useRef5, useState as useState4 } from "react";
var PlanetScene3 = lazy(() => Promise.resolve().then(() => (init_PlanetScene(), PlanetScene_exports)));
var WHATSAPP_URL = "https://wa.me/525546591720?text=Hola%20Pragassi%2C%20me%20interesa%20cotizar%20un%20estudio";
var NAV = [["Precios", "#precios"], ["Verifica", "#verifica"], ["Servicios", "#servicios"], ["Proceso", "#proceso"], ["Nosotros", "#nosotros"], ["Contacto", "#contacto"]];
function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
var SceneBoundary = class extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error, _info) {
    console.error("3D scene failed:", error);
  }
  render() {
    return this.state.failed ? <div className="scene-fallback"><p>No pudimos cargar la escena 3D.</p><button onClick={() => location.reload()}>Reintentar</button></div> : this.props.children;
  }
};
// Glass tags that float around the planet and cycle through what Pragassi verifies.
var TAG_LABELS = [
  { text: "Laboral", kind: "check" },
  { text: "Crediticio", kind: "check" },
  { text: "Visita domiciliaria", kind: "check" },
  { text: "Escolar", kind: "check" },
  { text: "Verifica · 8.2 / 10", kind: "score" },
  { text: "Telefónico", kind: "check" },
  { text: "Socioeconómico", kind: "check" },
  { text: "Cobertura nacional", kind: "pin" },
];
var TAG_SLOTS = ["slot-a", "slot-b", "slot-c", "slot-d"];
function TagIcon({ kind }) {
  if (kind === "score") return <span className="tag-icon tag-score">8.2</span>;
  if (kind === "pin") return <span className="tag-icon tag-pin"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="9.5" r="2.4" fill="currentColor" /></svg></span>;
  return <span className="tag-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 12.5 4 4 8-9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
}
function FloatingTags({ reduced }) {
  const [slots, setSlots] = useState4([0, 1, 4, 7]);
  const [hidden, setHidden] = useState4(-1);
  useEffect6(() => {
    if (reduced) return;
    let turn = 0, next = 2;
    const id = window.setInterval(() => {
      const slot = turn % TAG_SLOTS.length;
      setHidden(slot);
      window.setTimeout(() => {
        setSlots((current) => {
          const copy = [...current];
          do { next = (next + 1) % TAG_LABELS.length; } while (copy.includes(next));
          copy[slot] = next;
          return copy;
        });
        setHidden(-1);
      }, 450);
      turn++;
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduced]);
  return <div className="planet-tags" aria-hidden="true">{TAG_SLOTS.map((slot, i) => {
    const label = TAG_LABELS[slots[i]];
    return <div key={slot} className={`planet-tag ${slot} ${hidden === i ? "is-out" : ""}`} style={{ animationDelay: `${0.9 + i * 0.25}s, ${i * -1.7}s` }}><TagIcon kind={label.kind} /><span>{label.text}</span></div>;
  })}</div>;
}
function App() {
  const motion = useRef5(createMotion());
  const interaction = useRef5(null);
  const drag = useRef5(null);
  const [visible, setVisible] = useState4(true), [tabVisible, setTabVisible] = useState4(true);
  const [reduced, setReduced] = useState4(false);
  const [sceneMounted, setSceneMounted] = useState4(false);
  const [auto, setAuto] = useState4(true), [dragging, setDragging] = useState4(false), [ready, setReady] = useState4(false);
  const [menuOpen, setMenuOpen] = useState4(false);
  useEffect6(() => {
    setTabVisible(!document.hidden);
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    change();
    query.addEventListener("change", change);
    const onVisibility = () => {
      setTabVisible(!document.hidden);
      if (document.hidden) {
        motion.current.dragging = false;
        drag.current = null;
        setDragging(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 });
    if (interaction.current) observer.observe(interaction.current);
    return () => {
      query.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);
  useEffect6(() => {
    let frame = 0, timeout = 0;
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        timeout = window.setTimeout(() => setSceneMounted(true), 100);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, []);
  const release = (id) => {
    if (drag.current?.id !== id) return;
    drag.current = null;
    motion.current.dragging = false;
    motion.current.lastInteraction = motion.current.time;
    setDragging(false);
  };
  const toggleMotion = () => {
    const next = !auto;
    setAuto(next);
    const m = motion.current;
    m.dragging = false;
    if (drag.current && interaction.current?.hasPointerCapture(drag.current.id)) interaction.current.releasePointerCapture(drag.current.id);
    drag.current = null;
    setDragging(false);
    m.planetVelocity = m.pitchVelocity = 0;
    m.dragTarget = m.planetAngle;
    m.pitchTarget = m.pitchAngle;
    if (next) m.lastInteraction = m.time - 4;
  };
  const nudge = (direction) => {
    if (!auto) return;
    motion.current.planetVelocity += direction * 0.65;
    motion.current.lastInteraction = motion.current.time;
  };
  return <div className="page">
    <header className="site-header">
      <a href="#inicio" className="wordmark" aria-label="Pragassi Consultoría RH, inicio"><img src="/logo-pragassi.png" alt="Pragassi Consultoría RH" width="1200" height="518" /></a>
      <nav aria-label="Navegación principal">{NAV.map(([label, href]) => <a key={href} href={href}>{label}{href === "#verifica" && <sup className="nav-new">Nuevo</sup>}</a>)}</nav>
      <a className="header-cta" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Cotiza por WhatsApp</a>
      <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    </header>
    {menuOpen && <nav id="mobile-menu" className="mobile-menu" aria-label="Menú móvil">{NAV.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<Arrow /></a>)}<a className="mobile-menu-cta" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Cotiza por WhatsApp</a></nav>}
    <main><section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <a className="hero-announce" href="#verifica"><span>Nuevo</span>Verifica · test de confianza desde $400<Arrow /></a>
        <p className="eyebrow">Sector seguridad · México</p>
        <h1 id="hero-title">Contrata<br />con certeza.<br /><em>Sin atajos.</em></h1>
        <p className="hero-description">Pragassi es el aliado que tu empresa necesita en Recursos Humanos. Estudios de antecedentes a escala nacional y capacitación en normatividad para el sector seguridad.</p>
        <div className="hero-actions">
          <a className="explore-button" href="#contacto">Consulta gratuita <Arrow /></a>
          <a className="ghost-button" href="#precios">Ver precios</a>
        </div>
        <ul className="hero-proof" aria-label="Datos clave">
          <li><strong>15</strong> años</li>
          <li><strong>+500</strong> empresas</li>
          <li><strong>Desde $580</strong> MXN</li>
        </ul>
      </div>
      <div className={`visual-column ${ready ? "is-ready" : ""}`}><div className="planet-glow" aria-hidden="true" />{ready && <FloatingTags reduced={reduced} />}
        <div
    ref={interaction}
    id="planet"
    className={`planet-stage ${dragging ? "dragging" : ""}`}
    tabIndex={0}
    role="group"
    aria-roledescription="planeta 3D interactivo"
    aria-label="Gira el planeta"
    aria-describedby="planet-instructions"
    onPointerDown={(event) => {
      if (!auto || !event.isPrimary || event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
      const m = motion.current;
      m.dragTarget = m.planetAngle;
      m.pitchTarget = m.pitchAngle;
      m.dragging = true;
      m.lastInteraction = m.time;
      setDragging(true);
    }}
    onPointerMove={(event) => {
      if (!auto || drag.current?.id !== event.pointerId) return;
      const dx = event.clientX - drag.current.x, dy = event.clientY - drag.current.y;
      const sensitivity = 5 / Math.max(360, event.currentTarget.clientWidth);
      const m = motion.current;
      m.dragTarget = Math.max(m.planetAngle - 0.5, Math.min(m.planetAngle + 0.5, m.dragTarget + dx * sensitivity));
      m.pitchTarget = Math.max(m.pitchAngle - 0.4, Math.min(m.pitchAngle + 0.4, m.pitchTarget + dy * sensitivity * 0.7));
      drag.current.x = event.clientX;
      drag.current.y = event.clientY;
      m.lastInteraction = m.time;
    }}
    onPointerUp={(event) => release(event.pointerId)}
    onPointerCancel={(event) => release(event.pointerId)}
    onLostPointerCapture={(event) => release(event.pointerId)}
    onKeyDown={(event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        nudge(event.key === "ArrowRight" ? 1 : -1);
      }
      if (auto && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        event.preventDefault();
        motion.current.pitchVelocity += event.key === "ArrowDown" ? 0.4 : -0.4;
        motion.current.lastInteraction = motion.current.time;
      }
      if (event.key === " ") {
        event.preventDefault();
        if (!event.repeat) toggleMotion();
      }
    }}
  >
          {sceneMounted && <SceneBoundary><Suspense fallback={null}><PlanetScene3 motion={motion} active={visible && tabVisible} auto={auto} reduced={reduced} onReady={setReady} /></Suspense></SceneBoundary>}
          {!ready && <div className="loading" role="status"><span />Preparando cobertura nacional…</div>}
        </div>
      </div>
      <div className={`planet-caption ${dragging ? "is-dragging" : ""}`} aria-hidden="true"><p>{!auto ? "Presiona continuar" : dragging ? "Cobertura nacional." : "Arrastra para"}<br />{!auto ? "para seguir" : dragging ? "Sin subcontratar." : "recorrer México"}</p><svg viewBox="0 0 180 165" fill="none"><path d="M161 148C137 82 103 39 28 14m0 0 6 16m-6-16 19-2" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      <p id="planet-instructions" className="sr-only">Arrastra en cualquier dirección, o usa las flechas del teclado, para girar el planeta 3D. La barra espaciadora pausa el planeta y el verificador saluda; presiona de nuevo para continuar. En pantallas táctiles, desliza fuera del planeta para desplazarte por la página.</p>
      <div className="cloud-bank" aria-hidden="true"><i /><i /><i /><i /><i /></div>
    </section></main>
    <footer className="site-footer"><p className="footer-left">Sin atajos<br />en la verificación</p><button className="motion-button" onClick={toggleMotion} aria-pressed={!auto} aria-label={auto ? "Pausar y saludar al verificador" : "Continuar"}>{auto ? <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5v10m6-10v10" stroke="currentColor" strokeWidth="1.5" /></svg> : <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 8 6-8 6Z" fill="currentColor" /></svg>}<span>{auto ? "Pausa" : "Continuar"}</span></button><p className="footer-right">Cobertura<br />nacional<br />México</p></footer>
  </div>;
}

// <stdin>
init_assets();
var css = `.orbit-delivery{font-family:'DM Sans',sans-serif;background:#f7f9fd;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;font-weight:400;color-scheme:light}
.orbit-delivery *{box-sizing:border-box}.orbit-delivery button,.orbit-delivery a{-webkit-tap-highlight-color:transparent}.orbit-delivery button{font:inherit;color:inherit;cursor:pointer;border:0;background:none}.orbit-delivery button:focus-visible,.orbit-delivery a:focus-visible{outline:2px solid var(--orbit-gold);outline-offset:6px}.orbit-delivery a{color:inherit;text-decoration:none}.orbit-delivery svg{display:block}.orbit-delivery a svg,.orbit-delivery button svg{width:22px;height:22px}
.orbit-delivery .page{height:100svh;min-height:760px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.orbit-delivery .site-header{height:104px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:0 6.5%;position:relative;z-index:6}
.orbit-delivery .wordmark{display:flex;align-items:center}.orbit-delivery .wordmark img{display:block;height:74px;width:auto}
.orbit-delivery .planet-glow{position:absolute;left:50%;bottom:-18%;width:min(88%,980px);aspect-ratio:1;transform:translateX(-50%);border-radius:50%;pointer-events:none;background:radial-gradient(circle at 50% 50%,rgba(22,177,230,.34) 0%,rgba(22,177,230,.16) 38%,rgba(120,200,255,.08) 55%,transparent 70%);filter:blur(10px);animation:glowPulse 7s ease-in-out infinite}
.orbit-delivery .planet-glow{opacity:0;transition:opacity .6s}.orbit-delivery .visual-column.is-ready .planet-glow{opacity:1;animation:glowIn 2.2s cubic-bezier(.2,.7,.2,1) both,glowPulse 7s ease-in-out 2.2s infinite}
@keyframes glowIn{0%{opacity:0;transform:translateX(-50%) scale(.6)}55%{opacity:1;transform:translateX(-50%) scale(1.14)}100%{opacity:.9;transform:translateX(-50%) scale(1)}}
.orbit-delivery .planet-tags{position:absolute;inset:0;z-index:3;pointer-events:none}
.orbit-delivery .planet-tag{position:absolute;display:flex;align-items:center;gap:10px;padding:9px 16px 9px 9px;border-radius:999px;background:linear-gradient(135deg,#ffffffd9,#ffffff99);border:1px solid #ffffffe6;box-shadow:0 18px 40px -18px #0f2a4a66,inset 0 1px 0 #fff;backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4);font-size:14px;font-weight:500;color:#0b1b33;white-space:nowrap;animation:tagIn .9s cubic-bezier(.2,.7,.2,1) backwards,tagFloat 6s ease-in-out infinite;transition:opacity .45s,filter .45s,transform .45s}
.orbit-delivery .planet-tag.is-out{opacity:0;filter:blur(6px);transform:translateY(8px) scale(.94)}
.orbit-delivery .tag-icon{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#34d399,#10b981);color:#fff;box-shadow:0 6px 14px -6px #10b981}.orbit-delivery .tag-icon svg{width:15px;height:15px}
.orbit-delivery .tag-icon.tag-score{background:linear-gradient(135deg,#16b1e6,#1b6fd0);font-size:10px;font-weight:700;box-shadow:0 6px 14px -6px #16b1e6}.orbit-delivery .tag-icon.tag-pin{background:linear-gradient(135deg,#e2bd62,#b08a3e);box-shadow:0 6px 14px -6px #b08a3e}
.orbit-delivery .slot-a{left:14%;top:36%}.orbit-delivery .slot-b{right:12%;top:43%}.orbit-delivery .slot-c{left:22%;top:63%}.orbit-delivery .slot-d{right:22%;top:70%}
@keyframes tagIn{from{opacity:0;transform:translateY(18px) scale(.9);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
@keyframes tagFloat{0%,100%{translate:0 0}50%{translate:0 -10px}}
@keyframes heroIn{from{opacity:0;transform:translateY(22px);filter:blur(6px)}to{opacity:1;transform:none;filter:none}}
.orbit-delivery .hero-copy>*{animation:heroIn .95s cubic-bezier(.2,.7,.2,1) both}.orbit-delivery .hero-copy>*:nth-child(2){animation-delay:.08s}.orbit-delivery .hero-copy>*:nth-child(3){animation-delay:.16s}.orbit-delivery .hero-copy>*:nth-child(4){animation-delay:.26s}.orbit-delivery .hero-copy>*:nth-child(5){animation-delay:.36s}.orbit-delivery .hero-copy>*:nth-child(6){animation-delay:.46s}
.orbit-delivery .site-header{animation:heroIn .9s cubic-bezier(.2,.7,.2,1) both}
@media(max-width:1150px){.orbit-delivery .planet-tag{font-size:12px;padding:7px 13px 7px 7px}.orbit-delivery .tag-icon{width:24px;height:24px}}
@media(max-width:759px){.orbit-delivery .slot-a{left:20%;top:30%}.orbit-delivery .slot-b{right:18%;top:40%}.orbit-delivery .slot-c,.orbit-delivery .slot-d{display:none}.orbit-delivery .planet-tag{font-size:11px}}@keyframes glowPulse{0%,100%{opacity:.85;transform:translateX(-50%) scale(1)}50%{opacity:1;transform:translateX(-50%) scale(1.04)}}
.orbit-delivery .brand-type{display:flex;flex-direction:column;line-height:1;gap:5px}.orbit-delivery .brand-type small{font-size:8px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--orbit-gold);margin-left:2px}
.orbit-delivery .site-header nav{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:40px;align-items:center}.orbit-delivery .site-header nav a{font-size:15px;color:var(--orbit-nav);padding:12px 0;transition:color .2s;position:relative}.orbit-delivery .site-header nav a::after{content:'';position:absolute;left:0;right:0;bottom:6px;height:1px;background:var(--orbit-gold);transform:scaleX(0);transform-origin:left;transition:transform .3s}.orbit-delivery .site-header nav a:hover{color:var(--orbit-ink)}.orbit-delivery .site-header nav a:hover::after{transform:scaleX(1)}
.orbit-delivery .header-cta{display:inline-flex;align-items:center;background:var(--orbit-navy);color:white;border-radius:23px;padding:15px 22px;font-size:13px;box-shadow:inset 0 1px 0 #ffffff26,0 10px 30px -12px #0f2a4a80;transition:background .2s,transform .2s}.orbit-delivery .header-cta:hover,.orbit-delivery .explore-button:hover{background:var(--orbit-royal)}
.orbit-delivery .menu-toggle{display:none;width:44px;height:44px;border-radius:50%;border:1px solid #0f2a4a1f;position:relative}.orbit-delivery .menu-toggle span{position:absolute;left:13px;right:13px;height:1.5px;background:var(--orbit-ink);transition:transform .25s}.orbit-delivery .menu-toggle span:first-child{top:18px}.orbit-delivery .menu-toggle span:last-child{top:25px}.orbit-delivery .menu-toggle[aria-expanded=true] span:first-child{transform:translateY(3.5px) rotate(45deg)}.orbit-delivery .menu-toggle[aria-expanded=true] span:last-child{transform:translateY(-3.5px) rotate(-45deg)}
.orbit-delivery .mobile-menu{position:absolute;top:84px;left:16px;right:16px;z-index:7;background:#ffffffe6;backdrop-filter:blur(18px);border:1px solid #0f2a4a14;border-radius:24px;padding:10px;box-shadow:0 30px 80px -30px #0f2a4a55;display:flex;flex-direction:column}.orbit-delivery .mobile-menu a{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;font-size:17px;border-bottom:1px solid #0f2a4a0f;color:var(--orbit-ink)}.orbit-delivery .mobile-menu a svg{width:18px;height:18px;color:var(--orbit-gold)}.orbit-delivery .mobile-menu .mobile-menu-cta{margin-top:8px;justify-content:center;border:0;border-radius:18px;background:var(--orbit-navy);color:#fff}
.orbit-delivery main{flex:1;min-height:0;display:flex}.orbit-delivery .hero{width:100%;position:relative}
.orbit-delivery .hero-copy{position:relative;z-index:3;margin-left:6.5%;padding-top:clamp(56px,9.5vh,120px);width:45%;pointer-events:none}.orbit-delivery .hero-copy a{pointer-events:auto}
.orbit-delivery .hero-announce{display:inline-flex;align-items:center;gap:10px;margin:0 0 26px;padding:6px 14px 6px 6px;border-radius:999px;background:#ffffffb3;border:1px solid #16b1e633;backdrop-filter:blur(10px);font-size:13px;color:var(--orbit-ink);box-shadow:0 10px 30px -18px #16b1e6aa;transition:border-color .2s,transform .2s}.orbit-delivery .hero-announce:hover{border-color:#16b1e6;transform:translateY(-1px)}.orbit-delivery .hero-announce span{background:linear-gradient(135deg,#16b1e6,#2a3aa8);color:#fff;border-radius:999px;padding:4px 10px;font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}.orbit-delivery .hero-announce svg{width:15px;height:15px;color:#2a3aa8}.orbit-delivery .nav-new{margin-left:4px;font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#0c7fae;vertical-align:super}
.orbit-delivery .eyebrow{text-transform:uppercase;letter-spacing:.36em;font-size:12px;font-weight:500;color:var(--orbit-gold);margin:0 0 21px;display:flex;align-items:center;gap:12px}.orbit-delivery .eyebrow::before{content:'';width:28px;height:1px;background:currentColor}
.orbit-delivery h1{font-family:inherit;font-size:clamp(62px,5.4vw,98px);font-weight:550;letter-spacing:-.064em;line-height:1.03;margin:0 0 26px;color:var(--orbit-ink)}.orbit-delivery h1 em{font-family:'Libre Caslon Text',Georgia,serif;font-size:1.1em;font-weight:400;letter-spacing:-.035em;color:var(--orbit-accent);line-height:.92;font-style:italic}
.orbit-delivery .hero-description{color:var(--orbit-muted);font-size:clamp(16px,1.2vw,19px);line-height:1.55;letter-spacing:-.2px;margin:0 0 30px;max-width:470px}
.orbit-delivery .hero-actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.orbit-delivery .explore-button{display:inline-flex;align-items:center;justify-content:center;gap:13px;padding:17px 29px;border-radius:32px;background:var(--orbit-navy);color:white;font-size:16px;min-height:55px;box-shadow:inset 0 1px 0 #ffffff30,0 18px 40px -18px #0f2a4a99;transition:background .2s,transform .2s}.orbit-delivery .explore-button:hover{transform:translateY(-2px)}.orbit-delivery .explore-button:active{transform:translateY(0)}
.orbit-delivery .ghost-button{display:inline-flex;align-items:center;min-height:55px;padding:17px 26px;border-radius:32px;border:1px solid #0f2a4a26;background:#ffffff8c;backdrop-filter:blur(10px);color:var(--orbit-ink);font-size:16px;transition:border-color .2s,background .2s}.orbit-delivery .ghost-button:hover{border-color:var(--orbit-gold);background:#fff}
.orbit-delivery .hero-proof{list-style:none;display:flex;gap:26px;margin:34px 0 0;padding:0;color:var(--orbit-muted);font-size:13px}.orbit-delivery .hero-proof li{display:flex;align-items:baseline;gap:6px}.orbit-delivery .hero-proof li+li{padding-left:26px;border-left:1px solid #0f2a4a1f}.orbit-delivery .hero-proof strong{color:var(--orbit-ink);font-size:17px;font-weight:600;letter-spacing:-.02em}
.orbit-delivery .visual-column{position:absolute;right:-5%;top:0;width:76%;height:calc(100% + 12px);z-index:1}.orbit-delivery .planet-stage{height:100%;width:100%;position:relative;cursor:grab;touch-action:none;user-select:none;outline:none}.orbit-delivery .planet-stage:focus-visible{outline:1px dashed #b08a3e88;outline-offset:-15px;border-radius:36px}.orbit-delivery .planet-stage.dragging{cursor:grabbing}
.orbit-delivery .planet-caption{position:absolute;right:6.2%;top:17%;z-index:3;width:160px;pointer-events:none;color:#9fb0cf;transition:opacity .2s}.orbit-delivery .planet-caption p{font-size:15px;line-height:1.35;font-style:italic;text-align:right;margin:0}.orbit-delivery .planet-caption svg{width:160px;height:149px;margin-top:-17px;margin-left:-32px}.orbit-delivery .planet-caption.is-dragging{opacity:.6}
.orbit-delivery .cloud-bank{position:absolute;z-index:2;inset:auto -12% -90px 24%;height:250px;pointer-events:none;filter:blur(17px);opacity:var(--orbit-cloud)}.orbit-delivery .cloud-bank i{position:absolute;bottom:0;background:radial-gradient(ellipse at 42% 34%,#fffdfb 27%,#f3f7ff 59%,#e5edfc88 75%,transparent 80%);border-radius:50%}.orbit-delivery .cloud-bank i:nth-child(1){width:390px;height:200px;left:0;bottom:-28px;transform:rotate(-25deg)}.orbit-delivery .cloud-bank i:nth-child(2){width:265px;height:195px;left:14%;bottom:32px}.orbit-delivery .cloud-bank i:nth-child(3){width:270px;height:170px;left:29%;bottom:-2px}.orbit-delivery .cloud-bank i:nth-child(4){width:350px;height:200px;right:7%;bottom:-20px}.orbit-delivery .cloud-bank i:nth-child(5){width:280px;height:215px;right:-2%;bottom:70px}
.orbit-delivery .site-footer{position:absolute;bottom:43px;left:6.5%;right:5.1%;z-index:4;display:flex;align-items:flex-end;justify-content:space-between;pointer-events:none}.orbit-delivery .site-footer p{margin:0;text-transform:uppercase;font-size:10px;letter-spacing:.25em;line-height:1.8;color:#8d9dbd}.orbit-delivery .footer-left::before{content:'';display:block;width:25px;height:1px;background:var(--orbit-gold);margin-bottom:14px}.orbit-delivery .footer-right{text-align:right}
.orbit-delivery .motion-button{display:flex;gap:7px;align-items:center;color:#6f82a8;pointer-events:auto;font-size:10px;letter-spacing:.02em;opacity:.85;padding:8px}.orbit-delivery .motion-button:hover{opacity:1}.orbit-delivery .motion-button svg{width:15px;height:15px}
.orbit-delivery .loading{position:absolute;top:42%;left:25%;right:20%;display:flex;align-items:center;justify-content:center;gap:12px;color:#7a8bab;font-size:12px;pointer-events:none}.orbit-delivery .loading>span{width:17px;height:17px;border:1px solid #d8e3f5;border-top-color:var(--orbit-gold);border-radius:50%;animation:loading 1.2s linear infinite}@keyframes loading{to{transform:rotate(360deg)}}
.orbit-delivery .scene-fallback{position:absolute;inset:35% 20%;font-size:15px;text-align:center;color:#7588b4;z-index:5}.orbit-delivery .scene-fallback button{background:var(--orbit-navy);border-radius:20px;color:white;padding:10px 20px}
.orbit-delivery .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@media(min-width:1800px){.orbit-delivery .hero-copy{padding-top:13vh}.orbit-delivery .page{min-height:950px}}
@media(max-width:1150px){.orbit-delivery .site-header{height:90px;padding:0 5%}.orbit-delivery .site-header nav{gap:24px}.orbit-delivery .site-header nav a{font-size:13px}.orbit-delivery .wordmark img{height:62px}.orbit-delivery .header-cta{font-size:12px;padding:13px 18px}.orbit-delivery .hero-copy{margin-left:5%;padding-top:70px;width:50%}.orbit-delivery h1{font-size:62px}.orbit-delivery .hero-description{font-size:15px;max-width:380px}.orbit-delivery .planet-caption{right:4%;top:18%;width:115px}.orbit-delivery .planet-caption p{font-size:12px}.orbit-delivery .planet-caption svg{width:130px;margin-left:-24px}.orbit-delivery .site-footer{left:5%}.orbit-delivery .explore-button,.orbit-delivery .ghost-button{font-size:15px}}
@media(max-width:900px){.orbit-delivery .site-header nav{display:none}}
@media(min-width:760px) and (max-height:900px){.orbit-delivery .hero-copy{padding-top:clamp(20px,4vh,48px)}.orbit-delivery h1{font-size:clamp(52px,4.6vw,80px);margin-bottom:20px}.orbit-delivery .hero-announce{margin-bottom:20px}.orbit-delivery .eyebrow{margin-bottom:16px}.orbit-delivery .hero-description{margin-bottom:24px}.orbit-delivery .hero-proof{margin-top:24px}.orbit-delivery .site-footer{bottom:26px}}
@media(min-width:760px) and (max-height:780px){.orbit-delivery .footer-left{display:none}}
@media(max-width:759px){.orbit-delivery .page{height:auto;min-height:100svh}.orbit-delivery .site-header{height:84px;padding:0 20px}.orbit-delivery .header-cta{display:none}.orbit-delivery .menu-toggle{display:block}.orbit-delivery .wordmark img{height:54px}.orbit-delivery .planet-glow{width:92%;bottom:-8%}.orbit-delivery main{display:block}.orbit-delivery .hero{display:flex;flex-direction:column}.orbit-delivery .hero-copy{width:calc(100% - 40px);margin:0 20px;padding-top:28px;pointer-events:auto}.orbit-delivery .hero-announce{display:inline-flex;align-items:center;gap:10px;margin:0 0 26px;padding:6px 14px 6px 6px;border-radius:999px;background:#ffffffb3;border:1px solid #16b1e633;backdrop-filter:blur(10px);font-size:13px;color:var(--orbit-ink);box-shadow:0 10px 30px -18px #16b1e6aa;transition:border-color .2s,transform .2s}.orbit-delivery .hero-announce:hover{border-color:#16b1e6;transform:translateY(-1px)}.orbit-delivery .hero-announce span{background:linear-gradient(135deg,#16b1e6,#2a3aa8);color:#fff;border-radius:999px;padding:4px 10px;font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}.orbit-delivery .hero-announce svg{width:15px;height:15px;color:#2a3aa8}.orbit-delivery .nav-new{margin-left:4px;font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#0c7fae;vertical-align:super}
.orbit-delivery .eyebrow{font-size:10px;letter-spacing:.3em;margin-bottom:18px}.orbit-delivery .hero-announce{font-size:12px;margin-bottom:20px}.orbit-delivery h1{font-size:clamp(48px,13vw,76px);margin-bottom:22px;line-height:1.02}.orbit-delivery .hero-description{font-size:15px;line-height:1.6;margin-bottom:24px}.orbit-delivery .explore-button,.orbit-delivery .ghost-button{padding:14px 22px;min-height:50px;font-size:14px}.orbit-delivery .hero-proof{gap:14px;font-size:11px;margin-top:26px;flex-wrap:wrap}.orbit-delivery .hero-proof li+li{padding-left:14px}.orbit-delivery .hero-proof strong{font-size:15px}.orbit-delivery .visual-column{position:relative;width:134%;right:auto;left:-17%;height:clamp(420px,108vw,640px);margin-top:-8px}.orbit-delivery .planet-caption{top:auto;bottom:260px;right:18px;width:96px}.orbit-delivery .planet-caption p{font-size:11px}.orbit-delivery .planet-caption svg{width:92px;height:94px;margin-left:-13px;margin-top:-3px}.orbit-delivery .cloud-bank{left:-20%;right:-20%;height:185px;bottom:-50px;filter:blur(14px)}.orbit-delivery .cloud-bank i:nth-child(1){width:210px;height:140px;left:-10%;bottom:12px}.orbit-delivery .cloud-bank i:nth-child(2){width:170px;height:150px;left:10%;bottom:-32px}.orbit-delivery .cloud-bank i:nth-child(3){width:180px;height:130px;left:35%;bottom:-35px}.orbit-delivery .cloud-bank i:nth-child(4){width:210px;height:160px;right:-5%;bottom:-5px}.orbit-delivery .cloud-bank i:nth-child(5){width:120px;height:120px;right:8%;bottom:0}.orbit-delivery .site-footer{bottom:23px;left:20px;right:20px}.orbit-delivery .site-footer p{font-size:8px;letter-spacing:.18em}.orbit-delivery .footer-left::before{margin-bottom:9px;width:20px}.orbit-delivery .motion-button{font-size:0;gap:0;padding:8px}.orbit-delivery .motion-button svg{width:18px;height:18px}}
@media(prefers-reduced-motion:reduce){.orbit-delivery *,.orbit-delivery *::before,.orbit-delivery *::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}.orbit-delivery .explore-button:hover{transform:none}}

/* Pragassi identity: navy + gold over the airy blue-white art direction. */
.orbit-delivery{width:100%;isolation:isolate;--orbit-bg:radial-gradient(ellipse at 6% 15%,#fffdf7 0%,#fafbfe 38%,#ecf2fb 100%);--orbit-ink:#0b1b33;--orbit-muted:#5d6c8a;--orbit-nav:#42526f;--orbit-accent:#9a7428;--orbit-gold:#a8822f;--orbit-navy:#0f2a4a;--orbit-royal:#072da8;--orbit-cloud:.95;color:var(--orbit-ink)}
:is(.dark,[data-theme="dark"]) .orbit-delivery:not([data-theme="light"]),.orbit-delivery[data-theme="dark"]{--orbit-bg:radial-gradient(ellipse at 6% 15%,#151e32 0%,#0d1526 50%,#101e38 100%);--orbit-ink:#f3f6ff;--orbit-muted:#b0bed9;--orbit-nav:#becbe6;--orbit-accent:#d6b36a;--orbit-gold:#d6b36a;--orbit-navy:#2c5189;--orbit-cloud:.14;color-scheme:dark}
.orbit-delivery .page{background:var(--orbit-bg);color:var(--orbit-ink)}
.orbit-delivery .wordmark{color:var(--orbit-ink)}
`;
function OrbitDeliveryHero({ theme = "auto", assetBaseUrl = import.meta.env.BASE_URL }) {
  return <AssetBaseContext.Provider value={assetBaseUrl.replace(/\/$/, "") + "/"}><div id="inicio" className="orbit-delivery" data-theme={theme}><style>{css}</style><App /></div></AssetBaseContext.Provider>;
}
export {
  OrbitDeliveryHero as default
};
