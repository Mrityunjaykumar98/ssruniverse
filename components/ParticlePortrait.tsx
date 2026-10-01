"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Sample every Nth pixel. Lower is denser and more expensive. */
const STEP_DESKTOP = 3;
const STEP_MOBILE = 5;

type Cloud = {
  positions: Float32Array;
  targets: Float32Array;
  colors: Float32Array;
  alphas: Float32Array;
  seeds: Float32Array;
  count: number;
  aspect: number;
};

/**
 * Reads the photograph into a point cloud: one particle per sampled pixel,
 * carrying that pixel's colour. Particles start scattered through a sphere and
 * fly to their place in the image, so he assembles out of the field rather
 * than being pasted on top of it.
 */
type Focus = { x: number; y: number; rx: number; ry: number };

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function buildCloud(img: HTMLImageElement, step: number, focus: Focus): Cloud {
  const w = 560;
  const h = Math.round((img.naturalHeight / img.naturalWidth) * w);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const pos: number[] = [];
  const tgt: number[] = [];
  const col: number[] = [];
  const alpha: number[] = [];
  const seed: number[] = [];
  const scale = 8.4 / w; // world units across the plate

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      // The ellipse is a guard, not the silhouette: it keeps the sponsor
      // logos out, and its rim feathers over a wide band so it is never seen.
      const ex = (x / w - focus.x) / focus.rx;
      const ey = (y / h - focus.y) / focus.ry;
      const e = Math.sqrt(ex * ex + ey * ey);
      if (e > 1) continue;
      const guard = 1 - smoothstep(0.5, 1, e);

      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const lum = r * 0.299 + g * 0.587 + b * 0.114;

      // His own lighting defines the shape. The lit face and shirt stay
      // opaque; the dark jacket and backdrop fade into the page.
      const a = guard * smoothstep(0.07, 0.46, lum);
      if (a < 0.025) continue;

      const tx = (x - w / 2) * scale;
      const ty = -(y - h / 2) * scale;
      // Brighter pixels sit slightly proud, so the portrait has relief.
      const tz = (lum - 0.5) * 0.9;

      tgt.push(tx, ty, tz);
      // Start scattered on a shell around where it will end up.
      const phi = Math.random() * Math.PI * 2;
      const b2 = Math.acos(2 * Math.random() - 1);
      const rad = 9 + Math.random() * 14;
      pos.push(
        Math.sin(b2) * Math.cos(phi) * rad,
        Math.sin(b2) * Math.sin(phi) * rad,
        Math.cos(b2) * rad - 6,
      );
      col.push(r, g, b);
      alpha.push(a);
      seed.push(Math.random());
    }
  }

  return {
    positions: new Float32Array(pos),
    targets: new Float32Array(tgt),
    colors: new Float32Array(col),
    alphas: new Float32Array(alpha),
    seeds: new Float32Array(seed),
    count: col.length / 3,
    aspect: h / w,
  };
}

function Portrait({ cloud, onConverging }: { cloud: Cloud; onConverging?: () => void }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  /** 0 = scattered, 1 = fully assembled. */
  const progress = useRef(0);
  const announced = useRef(false);
  const { viewport, gl } = useThree();
  /** 0 when no mouse is over the portrait, 1 when one is. Eased per frame. */
  const strength = useRef(0);
  const wanted = useRef(0);
  const pointer = useRef(new THREE.Vector2());

  // The pointer rests at (0, 0) — dead centre — until something moves it, so
  // an ungated push would punch a permanent hole through his chest for every
  // visitor on load, and for ever on a touch screen. Only push while a real
  // mouse is actually over the canvas, and ease it in and out.
  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      wanted.current = inside ? 1 : 0;
      if (inside) {
        pointer.current.set(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -(((e.clientY - r.top) / r.height) * 2 - 1),
        );
      }
    };
    const away = () => {
      wanted.current = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", away);
    window.addEventListener("blur", away);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", away);
      window.removeEventListener("blur", away);
    };
  }, [gl]);

  // Built once per cloud. (A useRef initialiser would rebuild it every
  // render, since its argument is evaluated each time even though only the
  // first result is kept.)
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(cloud.positions.slice(), 3));
    g.setAttribute("aTarget", new THREE.BufferAttribute(cloud.targets, 3));
    g.setAttribute("aStart", new THREE.BufferAttribute(cloud.positions, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(cloud.colors, 3));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(cloud.alphas, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(cloud.seeds, 1));
    return g;
  }, [cloud]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (!material.current) return;
    // Ease toward assembled, then hold.
    progress.current = Math.min(1, progress.current + delta * 0.42);
    // The cloud is ready long before it is visible. Hand over only once the
    // particles are actually converging, so there is no blank frame between
    // the photo leaving and the portrait arriving.
    if (!announced.current && progress.current > 0.35) {
      announced.current = true;
      onConverging?.();
    }
    const u = material.current.uniforms;
    // Smootherstep so the arrival settles rather than stopping dead.
    const p = progress.current;
    u.uProgress.value = p * p * p * (p * (p * 6 - 15) + 10);
    u.uTime.value += delta;
    strength.current += (wanted.current - strength.current) * Math.min(1, delta * 5);
    u.uPointerStrength.value = strength.current;
    u.uPointer.value.copy(pointer.current);
  });

  return (
    <points frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        // Normal, not additive: additive sums every overlapping particle,
        // so a dense face over-exposes to flat white and loses its features.
        blending={THREE.NormalBlending}
        uniforms={{
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2() },
          uPointerStrength: { value: 0 },
          uPixelRatio: { value: Math.min(2, viewport.dpr) },
        }}
        vertexShader={/* glsl */ `
          attribute vec3 aTarget;
          attribute vec3 aStart;
          attribute vec3 aColor;
          attribute float aAlpha;
          attribute float aSeed;
          uniform float uProgress;
          uniform float uTime;
          uniform vec2 uPointer;
          uniform float uPointerStrength;
          uniform float uPixelRatio;
          varying vec3 vColor;
          varying float vAlpha;

          void main() {
            vColor = aColor;

            // Stagger the arrival so the portrait resolves in waves rather
            // than every particle landing at once.
            float t = clamp((uProgress - aSeed * 0.35) / 0.65, 0.0, 1.0);
            vec3 p = mix(aStart, aTarget, t);

            // Once settled, breathe very slightly, so it is never truly still.
            float breath = sin(uTime * 0.6 + aSeed * 12.0) * 0.045 * t;
            p.z += breath;
            p.x += sin(uTime * 0.4 + aSeed * 9.0) * 0.02 * t;

            // The pointer pushes particles aside, and they return on their own.
            vec2 ptr = uPointer * vec2(4.6, 6.4);
            float d = distance(p.xy, ptr);
            float push = smoothstep(1.7, 0.0, d) * 0.9 * t * uPointerStrength;
            p.xy += normalize(p.xy - ptr + 0.0001) * push;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (2.1 + aSeed * 1.1) * uPixelRatio * (38.0 / -mv.z);
            vAlpha = t * aAlpha;
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={/* glsl */ `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec2 d = gl_PointCoord - vec2(0.5);
            if (dot(d, d) > 0.25) discard;
            float falloff = 1.0 - smoothstep(0.0, 0.25, dot(d, d));
            gl_FragColor = vec4(vColor, falloff * vAlpha);
          }
        `}
      />
    </points>
  );
}

/**
 * The hero portrait, rebuilt as a cloud of light.
 *
 * Falls back to rendering nothing — the plain photograph underneath stays
 * visible — under reduced motion, without WebGL, or on hardware that would
 * struggle. The image is same-origin, so the pixel readback is allowed.
 */
export function ParticlePortrait({
  src,
  focus,
  onConverging,
}: {
  src: string;
  /** Centre and radii of the subject, as fractions of the image. */
  focus: Focus;
  /** Fired once the particles are visibly converging, not when data loads. */
  onConverging?: () => void;
}) {
  const [cloud, setCloud] = useState<Cloud | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cores = navigator.hardwareConcurrency ?? 4;
    if (cores <= 4 && window.innerWidth < 900) return;

    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      const step = window.innerWidth < 900 ? STEP_MOBILE : STEP_DESKTOP;
      setCloud(buildCloud(img, step, focus));
    };
    return () => {
      cancelled = true;
    };
  // focus is a literal at the call site; rebuilding the cloud whenever its
  // identity changes would restart the assembly on every parent render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (!cloud) return null;

  return (
    <div aria-hidden className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 14] }}
      >
        <Portrait cloud={cloud} onConverging={onConverging} />
      </Canvas>
    </div>
  );
}
