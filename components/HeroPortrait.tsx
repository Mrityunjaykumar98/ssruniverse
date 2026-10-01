"use client";

import { useCallback, useState } from "react";
import { ParticlePortrait, type Fit, type Mask } from "@/components/ParticlePortrait";
import { Photo } from "@/components/Photo";
import { credits } from "@/data/credits";

/**
 * One definition of where the photo sits and how it is masked, shared by the
 * CSS and the particles. If they ever disagreed, the dust would land a few
 * pixels off the picture and the handover would show a double image.
 */
const FIT: Fit = { x: 0.5, y: 0.18 };
const MASK: Mask = { x: 0.51, y: 0.42, rx: 0.3, ry: 0.54, inner: 0.46 };

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
const MASK_CSS = `radial-gradient(ellipse ${pct(MASK.rx)} ${pct(MASK.ry)} at ${pct(MASK.x)} ${pct(
  MASK.y,
)}, #000 ${pct(MASK.inner)}, transparent 100%)`;

/**
 * The hero photograph, which shatters into stardust on arrival and reforms.
 *
 * The photograph is always what rests on screen: it renders first, so the hero
 * is never empty, and it remains the whole hero wherever the particles decline
 * to start. When they do start, they take its place for the few seconds of the
 * burst and hand back as he reforms.
 */
export function HeroPortrait() {
  /** Whether the dust currently stands in for the photograph. */
  const [dust, setDust] = useState(false);
  const shatter = useCallback(() => setDust(true), []);
  const reform = useCallback(() => setDust(false), []);

  return (
    <div className="relative h-full w-full">
      {/* Outer: the hand-off to and from the dust. Inner: the scroll-driven
          dissolve, which must track scroll directly, so it has no transition
          of its own. Their opacities multiply. */}
      <div
        className="absolute inset-0 transition-opacity ease-out"
        style={{
          opacity: dust ? 0 : 1,
          // Leaving is quick, because the dots are already exactly over it;
          // returning is slow, so he settles back into the photograph.
          transitionDuration: dust ? "250ms" : "900ms",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            opacity: "calc(1 - min(1, var(--scroll-y, 0) / 480))",
            maskImage: MASK_CSS,
            WebkitMaskImage: MASK_CSS,
          }}
        >
          <Photo
            slug="hero-portrait"
            alt="Sushant Singh Rajput on the green carpet at IIFA, 2017"
            fill
            preload
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover contrast-[1.05] saturate-[.7]"
            style={{ objectPosition: `${pct(FIT.x)} ${pct(FIT.y)}` }}
          />
        </div>
      </div>

      <ParticlePortrait
        src={credits["hero-portrait"].src}
        fit={FIT}
        mask={MASK}
        onShatter={shatter}
        onReform={reform}
      />
    </div>
  );
}
