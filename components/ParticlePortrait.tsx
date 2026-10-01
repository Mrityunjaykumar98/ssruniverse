"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Grid pitch in resampled source pixels. Fine, so landed dots read as the photo. */
const STEP_DESKTOP = 3;
const STEP_MOBILE = 5;
const SAMPLE_W = 560;
const CAMERA_Z = 14;
const FOV = 50;
/** Seconds the burst takes, there and back. */
const BURST = 3.4;
/** Hold before the burst, so the swap from photo to dots completes first. */
const HOLD = 0.35;
/** Scroll distance, in px, over which he dissolves back into the field. */
const DISSOLVE_PX = 480;

/** Where the photo sits in its box — mirrors the CSS object-position. */
export type Fit = { x: number; y: number };
/** The feathered ellipse the photo is masked by — mirrors the CSS mask. */
export type Mask = { x: number; y: number; rx: number; ry: number; inner: number };

type Cloud = {
  /** Image-space position of each dot, as fractions of the image. */
  uv: Float32Array;
  colors: Float32Array;
  seeds: Float32Array;
  count: number;
  aspect: number;
  step: number;
};

/**
 * Samples the photograph on a fine grid, grading each dot exactly as the CSS
 * grades the photo (saturate .7, contrast 1.05), so that at the moment of
 * handover the dots and the picture are the same image.
 */
function buildCloud(img: HTMLImageElement, step: number): Cloud {
  const w = SAMPLE_W;
  const h = Math.round((img.naturalHeight / img.naturalWidth) * w);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const uv: number[] = [];
  const col: number[] = [];
  const seed: number[] = [];
  const grade = (c: number, lum: number) => {
    const sat = lum + (c - lum) * 0.7; // saturate(.7)
    return Math.max(0, Math.min(1, (sat - 0.5) * 1.05 + 0.5)); // contrast(1.05)
  };

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const lum = r * 0.299 + g * 0.587 + b * 0.114;
      uv.push((x + step / 2) / w, (y + step / 2) / h);
      col.push(grade(r, lum), grade(g, lum), grade(b, lum));
      seed.push(Math.random());
    }
  }

  return {
    uv: new Float32Array(uv),
    colors: new Float32Array(col),
    seeds: new Float32Array(seed),
    count: seed.length,
    aspect: h / w,
    step,
  };
}

function Stardust({
  cloud,
  fit,
  mask,
  onShatter,
  onReform,
}: {
  cloud: Cloud;
  fit: Fit;
  mask: Mask;
  onShatter: () => void;
  onReform: () => void;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const clock = useRef(-HOLD);
  const fade = useRef(1);
  const phase = useRef<"hold" | "burst" | "rest">("hold");
  const dissolve = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      dissolve.current = Math.min(1, Math.max(0, window.scrollY / DISSOLVE_PX));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Lays the dots out with the same arithmetic the browser uses for
   * object-fit: cover, in the same box, so each one lands on the pixel of the
   * photograph it was sampled from. Rebuilt on resize, since cover depends on
   * the box's shape.
   */
  const { geometry, dotPx } = useMemo(() => {
    const visH = 2 * CAMERA_Z * Math.tan(((FOV / 2) * Math.PI) / 180);
    const visW = visH * (size.width / size.height);
    const ia = cloud.aspect;
    const [dW, dH] = visW * ia >= visH ? [visW, visW * ia] : [visH / ia, visH];
    const left = (visW - dW) * fit.x;
    const top = (visH - dH) * fit.y;

    const target: number[] = [];
    const scatter: number[] = [];
    const color: number[] = [];
    const alpha: number[] = [];
    const seed: number[] = [];

    for (let k = 0; k < cloud.count; k++) {
      const cx = left + cloud.uv[k * 2] * dW;
      const cy = top + cloud.uv[k * 2 + 1] * dH;
      const fx = cx / visW;
      const fy = cy / visH;
      if (fx < 0 || fx > 1 || fy < 0 || fy > 1) continue;

      // Linear falloff from the inner stop to the rim, exactly as the CSS
      // radial-gradient on the photo falls off.
      const ex = (fx - mask.x) / mask.rx;
      const ey = (fy - mask.y) / mask.ry;
      const e = Math.sqrt(ex * ex + ey * ey);
      const m = 1 - Math.min(1, Math.max(0, (e - mask.inner) / (1 - mask.inner)));
      if (m < 0.01) continue;

      const s = cloud.seeds[k];
      target.push(cx - visW / 2, visH / 2 - cy, 0);
      // Each dot flies out along its own line from the centre of the face,
      // further for dots near the edge, with a little lift toward the viewer.
      const dx = cx - visW / 2;
      const dy = visH / 2 - cy;
      const len = Math.hypot(dx, dy) + 0.4;
      const reach = 1.4 + s * 4.2;
      scatter.push((dx / len) * reach, (dy / len) * reach, (s - 0.35) * 5);
      color.push(cloud.colors[k * 3], cloud.colors[k * 3 + 1], cloud.colors[k * 3 + 2]);
      alpha.push(m);
      seed.push(s);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(target), 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(new Float32Array(scatter), 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(new Float32Array(color), 3));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array(alpha), 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(new Float32Array(seed), 1));

    // One sample's width on screen, so a landed dot covers its cell.
    const pitchWorld = (cloud.step / SAMPLE_W) * dW;
    return { geometry: g, dotPx: pitchWorld * (size.height / visH) };
  }, [cloud, size, fit, mask]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (!material.current) return;
    clock.current += delta;

    if (phase.current === "hold" && clock.current >= 0) {
      phase.current = "burst";
      onShatter();
    }
    const t = Math.max(0, Math.min(1, clock.current / BURST));
    if (phase.current === "burst" && t >= 1) {
      phase.current = "rest";
      onReform();
    }
    // Once he has reformed, the dots fade and the photograph carries him.
    if (phase.current === "rest") fade.current = Math.max(0, fade.current - delta / 0.9);

    const u = material.current.uniforms;
    u.uT.value = t;
    u.uTime.value += delta;
    u.uFade.value = fade.current;
    u.uDissolve.value = dissolve.current;
    u.uDotPx.value = dotPx;
  });

  return (
    <points frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        // Normal blending, so landed dots composite like the photograph they
        // replace rather than summing to white where they overlap.
        blending={THREE.NormalBlending}
        uniforms={{
          uT: { value: 0 },
          uTime: { value: 0 },
          uFade: { value: 1 },
          uDissolve: { value: 0 },
          uDotPx: { value: 3 },
          uPixelRatio: { value: Math.min(2, viewport.dpr) },
          uCameraZ: { value: CAMERA_Z },
        }}
        vertexShader={/* glsl */ `
          attribute vec3 aScatter;
          attribute vec3 aColor;
          attribute float aAlpha;
          attribute float aSeed;
          uniform float uT;
          uniform float uTime;
          uniform float uFade;
          uniform float uDissolve;
          uniform float uDotPx;
          uniform float uPixelRatio;
          uniform float uCameraZ;
          varying vec3 vColor;
          varying float vAlpha;

          const float PI = 3.14159265;

          vec2 rotate(vec2 v, float a) {
            float c = cos(a), s = sin(a);
            return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
          }

          void main() {
            // Staggered so the shatter starts at the edges and reaches the
            // face last, and the face is first to come back together.
            float local = clamp((uT - aSeed * 0.22) / 0.78, 0.0, 1.0);
            // Out and back: zero at both ends, so a dot starts and finishes
            // on the pixel of the photo it came from.
            float burst = sin(PI * local);
            burst = max(burst, uDissolve);

            vec3 off = aScatter * burst;
            // A slow vortex, so the dust swirls instead of just pulsing.
            off.xy = rotate(off.xy, (1.0 - local) * 1.4 * (aSeed - 0.5) + uDissolve * 0.9);
            // Drift while airborne, so it is never mechanical.
            off.x += sin(uTime * 0.7 + aSeed * 30.0) * 0.18 * burst;
            off.y += cos(uTime * 0.6 + aSeed * 21.0) * 0.18 * burst;

            vec3 p = position + off;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);

            // Landed dots are full size and overlap enough to read as solid
            // photograph; airborne ones shrink to sparks.
            float sizeK = mix(1.45, 0.8, burst);
            gl_PointSize = uDotPx * sizeK * uPixelRatio * (uCameraZ / -mv.z);

            // Sparks glow a little brighter than the skin they came from.
            vColor = aColor * (1.0 + 0.95 * burst);
            vAlpha = aAlpha * max(uFade, uDissolve);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={/* glsl */ `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float r = length(gl_PointCoord - vec2(0.5));
            if (r > 0.5) discard;
            gl_FragColor = vec4(vColor, (1.0 - smoothstep(0.4, 0.5, r)) * vAlpha);
          }
        `}
      />
    </points>
  );
}

/**
 * Shatters the photograph into stardust and reforms it.
 *
 * Particles are the transition, not the resting state: spaced widely enough
 * to read as particles, they cannot carry a face, and for a memorial the face
 * is the one thing that cannot be traded away. So the photograph is what you
 * look at; the dust is what it is made of on the way in, and what it returns
 * to as you scroll past.
 *
 * Renders nothing under reduced motion, without WebGL, or on small four-core
 * devices, and the photograph simply stays put.
 */
export function ParticlePortrait({
  src,
  fit,
  mask,
  onShatter,
  onReform,
}: {
  src: string;
  fit: Fit;
  mask: Mask;
  /** The dots are in place over the photo and the burst is starting. */
  onShatter: () => void;
  /** He has reformed; the photograph should take over again. */
  onReform: () => void;
}) {
  const [cloud, setCloud] = useState<Cloud | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cores = navigator.hardwareConcurrency ?? 4;
    if (cores <= 4 && window.innerWidth < 900) return;

    let cancelled = false;
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      setCloud(buildCloud(img, window.innerWidth < 900 ? STEP_MOBILE : STEP_DESKTOP));
    };
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!cloud) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: FOV, near: 0.1, far: 100, position: [0, 0, CAMERA_Z] }}
      >
        <Stardust
          cloud={cloud}
          fit={fit}
          mask={mask}
          onShatter={onShatter}
          onReform={onReform}
        />
      </Canvas>
    </div>
  );
}
