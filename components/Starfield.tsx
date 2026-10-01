"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A seeded generator, so the field is identical on every render and between
 * server and client. Math.random in a useMemo would reshuffle every star if
 * the memo ever re-ran, and React's purity rule rightly refuses it.
 */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** How deep the field is. Stars wrap within this distance, so it never ends. */
const DEPTH = 220;
const NEAR = 6;

/**
 * Stars are placed once and never touched again. Travel is a single uniform
 * and the wrap is done in the vertex shader with a modulo, so the CPU does no
 * per-star work at all — which is what makes 14,000 of them cheap.
 */
function Stars({ count, travel }: { count: number; travel: React.RefObject<number> }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { pointer, viewport } = useThree();

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const tints = new Float32Array(count);
    const spread = 150;
    const rand = mulberry32(0x5f3a21);

    for (let i = 0; i < count; i++) {
      // Hollow out the centre so stars do not sit on top of the camera.
      const r = 12 + Math.pow(rand(), 0.6) * spread;
      const theta = rand() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = (Math.sin(theta) * r) / 1.7;
      positions[i * 3 + 2] = -rand() * DEPTH;

      // A few large stars carry the field; most are dust.
      sizes[i] = rand() < 0.025 ? 2.0 + rand() * 1.4 : 0.45 + rand() * 0.85;
      // Mostly cold white, a minority gold, matching the palette.
      tints[i] = rand() < 0.16 ? 1 : 0;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aTint", new THREE.BufferAttribute(tints, 1));
    return g;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uTravel.value = travel.current ?? 0;
    u.uTime.value += delta;
    // Drift the field very slightly with the pointer, for depth on a still page.
    u.uParallax.value.set(pointer.x * 1.6, pointer.y * 1.1);
  });

  return (
    <points frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTravel: { value: 0 },
          uTime: { value: 0 },
          uParallax: { value: new THREE.Vector2() },
          uDepth: { value: DEPTH },
          uNear: { value: NEAR },
          uPixelRatio: { value: Math.min(2, viewport.dpr) },
          uWarm: { value: new THREE.Color("#e3c07f") },
          uCool: { value: new THREE.Color("#cfe0ff") },
        }}
        vertexShader={/* glsl */ `
          attribute float aSize;
          attribute float aTint;
          uniform float uTravel;
          uniform float uTime;
          uniform float uDepth;
          uniform float uNear;
          uniform float uPixelRatio;
          uniform vec2 uParallax;
          varying float vAlpha;
          varying float vTint;

          void main() {
            vTint = aTint;
            vec3 p = position;

            // Wrap the star through the field instead of moving the camera,
            // so the tunnel is endless and nothing is ever recycled on the CPU.
            float z = mod(p.z + uTravel, uDepth);
            p.z = z - uDepth + uNear;
            p.xy += uParallax * (1.0 - z / uDepth) * 2.0;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            float dist = -mv.z;

            // Fade in from the far plane and out as a star passes the camera,
            // so nothing pops into or out of existence.
            vAlpha = smoothstep(uDepth, uDepth * 0.55, dist) * smoothstep(0.0, uNear * 2.2, dist);
            // A slow twinkle, offset per star so they do not pulse together.
            vAlpha *= 0.72 + 0.28 * sin(uTime * 1.1 + p.x * 1.7 + p.y * 0.9);
            vAlpha *= 0.46;

            gl_PointSize = aSize * uPixelRatio * (190.0 / dist);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uWarm;
          uniform vec3 uCool;
          varying float vAlpha;
          varying float vTint;

          void main() {
            // Round the square point sprite and give it a soft falloff.
            vec2 d = gl_PointCoord - vec2(0.5);
            float r = dot(d, d);
            if (r > 0.25) discard;
            float falloff = 1.0 - smoothstep(0.0, 0.25, r);
            vec3 col = mix(uCool, uWarm, vTint);
            gl_FragColor = vec4(col, falloff * falloff * vAlpha);
          }
        `}
      />
    </points>
  );
}

/** Nudges the camera with the pointer so the field has parallax, not just drift. */
function CameraRig() {
  useFrame((state) => {
    const { camera, pointer } = state;
    camera.position.x += (pointer.x * 1.4 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.9 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, -40);
  });
  return null;
}

/**
 * The field the whole page sits inside. Fixed behind the content, ignoring
 * pointer events, with scroll driving travel through it.
 *
 * Renders nothing at all under reduced motion or without WebGL — the sections
 * each carry their own background, so the page simply looks as it did before.
 */
export function Starfield() {
  const travel = useRef(0);
  /** null until the client has decided; a number once the field is wanted. */
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // A soft capability check: no point mounting three on a device that will
    // crawl through it.
    const cores = navigator.hardwareConcurrency ?? 4;
    const small = window.innerWidth < 760;
    if (small && cores <= 4) return;
    // Deciding this during render would mean reading window on the server and
    // mismatching on hydration, so it has to happen once, after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(small ? 4500 : cores >= 8 ? 14000 : 9000);

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // Travel is in world units, tuned so a full page is a long journey.
        travel.current = window.scrollY * 0.055;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  if (count === null) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ contain: "strict" }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        camera={{ fov: 70, near: 0.1, far: 400, position: [0, 0, 0] }}
        // Pause entirely when the tab is hidden.
        frameloop="always"
      >
        <Stars count={count} travel={travel} />
        <CameraRig />
      </Canvas>

      {/* Sits over the field, under the page: keeps the centre calm enough to
          read against while leaving the edges open. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(7,10,18,.58)_0%,rgba(7,10,18,.3)_55%,transparent_100%)]" />
    </div>
  );
}
