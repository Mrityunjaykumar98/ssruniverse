"use client";

import { useCallback, useState } from "react";
import { ParticlePortrait } from "@/components/ParticlePortrait";
import { Photo } from "@/components/Photo";
import { credits } from "@/data/credits";

/**
 * The flat photograph renders first, so the hero is never empty while three.js
 * and the image load, and it remains the whole hero wherever the particles
 * decline to start.
 *
 * It is the same photograph the particles are built from. Once they are
 * visibly converging, it dissolves out underneath them — so the picture reads
 * as turning into light rather than one image being swapped for another.
 */
export function HeroPortrait() {
  const [handover, setHandover] = useState(false);
  const converging = useCallback(() => setHandover(true), []);

  return (
    <div className="relative h-full w-full">
      {/* The same feathered ellipse the particles use, so the sponsor wall is
          gone from the very first frame, not only after the handover. */}
      <div
        className="absolute inset-0 transition-opacity ease-out"
        style={{
          opacity: handover ? 0 : 1,
          transitionDuration: "1400ms",
          maskImage: "radial-gradient(ellipse 30% 54% at 51% 42%, #000 46%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 30% 54% at 51% 42%, #000 46%, transparent 100%)",
        }}
      >
        <Photo
          slug="hero-portrait"
          alt="Sushant Singh Rajput on the green carpet at IIFA, 2017"
          fill
          preload
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover object-[50%_18%] contrast-[1.05] saturate-[.7]"
        />
      </div>

      {/* Face at (0.50, 0.27) in the source, shirt down the centre, sponsor
          logos from x 0.69. Tall and narrow keeps him and drops the wall. */}
      <ParticlePortrait
        src={credits["hero-portrait"].src}
        focus={{ x: 0.51, y: 0.42, rx: 0.27, ry: 0.52 }}
        onConverging={converging}
      />
    </div>
  );
}
