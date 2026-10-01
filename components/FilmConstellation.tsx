"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { films, filmLink, tmdbImage } from "@/data/films";

/**
 * Where each film hangs: position as a percentage of the plate, depth from 0
 * (far) to 1 (near), and a resting yaw so the cards face slightly inward
 * rather than all squarely at the viewer.
 *
 * Placed by hand — a generated layout reads as a scatter plot, and the
 * overlaps here are deliberate: cards crossing at different depths are what
 * makes this a volume of space rather than a grid.
 */
const SKY: { x: number; y: number; z: number; yaw: number }[] = [
  { x: 6, y: 48, z: 0.45, yaw: 20 }, //  Kai Po Che!          2013
  { x: 15, y: 20, z: 0.75, yaw: 15 }, // Shuddh Desi Romance  2013
  { x: 24, y: 74, z: 0.55, yaw: 12 }, // PK                   2014
  { x: 33, y: 38, z: 0.28, yaw: 8 }, //  Detective Byomkesh   2015
  { x: 43, y: 68, z: 0.95, yaw: 4 }, //  M.S. Dhoni           2016
  { x: 52, y: 24, z: 0.5, yaw: -3 }, //  Raabta               2017
  { x: 61, y: 60, z: 0.7, yaw: -8 }, //  Kedarnath            2018
  // Three films in 2019, so they hang together as a knot.
  { x: 70, y: 28, z: 0.38, yaw: -12 }, // Sonchiriya          2019
  { x: 77, y: 66, z: 0.88, yaw: -15 }, // Chhichhore          2019
  { x: 86, y: 32, z: 0.42, yaw: -18 }, // Drive               2019
  { x: 94, y: 62, z: 0.62, yaw: -22 }, // Dil Bechara         2020
];

export function FilmConstellation() {
  const [active, setActive] = useState<number | null>(null);
  const plate = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  /** Pointer position within the live card, for the per-card tilt. */
  const [local, setLocal] = useState({ x: 0, y: 0 });

  const onPlateMove = (e: React.MouseEvent) => {
    const el = plate.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    });
  };

  const onCardMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setLocal({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    });
  };

  return (
    <div>
      <div
        ref={plate}
        onMouseMove={onPlateMove}
        onMouseLeave={() => {
          setTilt({ x: 0, y: 0 });
          setActive(null);
        }}
        className="relative hidden h-[36rem] w-full md:block"
        style={{ perspective: "1500px", perspectiveOrigin: "50% 45%" }}
      >
        {/* Joining lines, behind the cards, in release order. */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {SKY.slice(0, -1).map((p, i) => {
            const n = SKY[i + 1];
            const lit = i === active || i + 1 === active;
            return (
              <line
                key={i}
                x1={p.x}
                y1={p.y}
                x2={n.x}
                y2={n.y}
                stroke="currentColor"
                // non-scaling-stroke makes this screen pixels, not user units.
                strokeWidth={lit ? 1.5 : 0.75}
                vectorEffect="non-scaling-stroke"
                className={`transition-all duration-500 ${
                  lit ? "text-[var(--gold)]/75" : "text-[var(--gold)]/20"
                }`}
              />
            );
          })}
        </svg>

        {films.map((film, i) => {
          const p = SKY[i];
          const on = active === i;
          const dim = active !== null && !on;
          const scale = 0.6 + p.z * 0.5;
          // Nearer cards swing further with the pointer.
          const dx = tilt.x * (16 + p.z * 50);
          const dy = tilt.y * (9 + p.z * 28);
          // At rest the card keeps its yaw; live, it leans toward the cursor.
          const rotY = on ? p.yaw * 0.25 + local.x * -26 : p.yaw;
          const rotX = on ? local.y * 20 : 4;

          return (
            <a
              key={film.tmdbId}
              href={filmLink(film)}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setActive(i)}
              onMouseMove={onCardMove}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              title={`${film.title} (${film.year}) — open on ${film.imdbId ? "IMDb" : "TMDB"}`}
              className="group absolute block -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                zIndex: on ? 50 : Math.round(p.z * 20),
                transformStyle: "preserve-3d",
                transform: `translate3d(${dx}px, ${dy}px, ${on ? 90 : p.z * 40 - 40}px)
                            rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${scale})`,
                transition: on
                  ? "transform .18s ease-out, opacity .4s"
                  : "transform .7s cubic-bezier(.22,1,.36,1), opacity .4s",
                opacity: dim ? 0.4 : 1,
              }}
            >
              <span
                className={`relative block h-44 w-[7.4rem] overflow-hidden rounded-[3px] border transition-colors duration-500 ${
                  on ? "border-[var(--gold)]/80" : "border-[var(--rule-strong)]"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  // A long shadow cast away from the centre sells the depth.
                  boxShadow: on
                    ? "0 40px 90px rgba(0,0,0,.85), 0 0 50px rgba(201,166,100,.22)"
                    : "0 18px 44px rgba(0,0,0,.72)",
                }}
              >
                {film.posterPath ? (
                  <Image
                    src={tmdbImage(film.posterPath, "w342")}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full place-items-center bg-[var(--card)] px-1.5 text-center">
                    <span className="display text-xs leading-tight">{film.title}</span>
                  </span>
                )}

                {/* Distance haze: far cards sit back, the live one clears. */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[#0b1324] transition-opacity duration-500"
                  style={{ opacity: on ? 0 : 0.52 - p.z * 0.28 }}
                />

                {/* Specular sweep that tracks the tilt, so the card reads as a
                    physical surface catching light rather than a flat image. */}
                <span
                  aria-hidden
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    opacity: on ? 1 : 0,
                    background: `linear-gradient(${105 + local.x * 60}deg, transparent ${
                      34 + local.x * 26
                    }%, rgba(255,250,235,.26) ${50 + local.x * 26}%, transparent ${
                      66 + local.x * 26
                    }%)`,
                  }}
                />
              </span>

              {/* Year always, so no card is ever anonymous. */}
              <span
                className={`absolute left-1/2 top-full mt-2.5 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[.18em] transition-colors duration-300 ${
                  on ? "text-[var(--gold)]" : "text-[var(--paper-40)]"
                }`}
              >
                {film.year}
              </span>
              {/* Title and role lift in on the live card. */}
              <span
                className={`pointer-events-none absolute left-1/2 top-full mt-7 w-48 -translate-x-1/2 text-center transition-all duration-300 ${
                  on ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
                }`}
              >
                <span className="display block text-base leading-tight">{film.title}</span>
                <span className="mt-0.5 block text-[10px] text-[var(--paper-55)]">
                  as {film.character}
                </span>
              </span>
            </a>
          );
        })}
      </div>

      {/* Mobile, and the plain index for anyone not using a pointer. */}
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:hidden">
        {films.map((film) => (
          <li key={film.tmdbId}>
            <a href={filmLink(film)} target="_blank" rel="noopener noreferrer" className="block">
              <span className="relative block aspect-[2/3] overflow-hidden rounded-sm border border-[var(--rule)]">
                {film.posterPath && (
                  <Image
                    src={tmdbImage(film.posterPath, "w342")}
                    alt=""
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                )}
              </span>
              <span className="mt-2 block text-xs leading-tight">{film.title}</span>
              <span className="mt-0.5 block text-[10px] text-[var(--paper-40)]">{film.year}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
