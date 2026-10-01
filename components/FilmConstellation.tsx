"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { films, filmLink, tmdbImage } from "@/data/films";

/**
 * Where each film sits in the sky, as a percentage of the plate, plus a depth
 * from 0 (far) to 1 (near) that drives both parallax and scale. Hand-placed
 * rather than generated: a real constellation wanders, a generated one looks
 * like a scatter plot.
 */
const SKY: { x: number; y: number; z: number }[] = [
  { x: 6, y: 57, z: 0.35 }, // Kai Po Che!            2013
  { x: 14, y: 30, z: 0.8 }, // Shuddh Desi Romance    2013
  { x: 26, y: 69, z: 0.5 }, // PK                     2014
  { x: 32, y: 44, z: 0.25 }, // Detective Byomkesh    2015
  { x: 45, y: 22, z: 1 }, // M.S. Dhoni               2016
  { x: 53, y: 62, z: 0.45 }, // Raabta                2017
  { x: 64, y: 35, z: 0.7 }, // Kedarnath              2018
  // Three films in 2019, so they sit together as a knot in the sky.
  { x: 71, y: 71, z: 0.3 }, // Sonchiriya             2019
  { x: 77, y: 52, z: 0.9 }, // Chhichhore             2019
  { x: 84, y: 72, z: 0.4 }, // Drive                  2019
  { x: 94, y: 37, z: 0.6 }, // Dil Bechara            2020
];

export function FilmConstellation() {
  const [active, setActive] = useState(0);
  const plate = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = plate.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    });
  };

  const film = films[active];
  const node = SKY[active];

  return (
    <div>
      {/* The sky. Decorative on its own — every film is also a real link in
          the list below, so nothing here is the only route to anything. */}
      <div
        ref={plate}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="relative hidden aspect-[16/7] w-full md:block"
        style={{ perspective: "1200px" }}
      >
        {/* Lines first, so the stars sit on top of them. Drawn in release
            order: the constellation is the filmography as a path. */}
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
                strokeWidth={lit ? 1.75 : 1}
                className={`transition-all duration-500 ${
                  lit ? "text-[var(--gold)]/80" : "text-[var(--gold)]/30"
                }`}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {films.map((f, i) => {
          const p = SKY[i];
          const on = i === active;
          // Nearer stars move further with the pointer.
          const dx = tilt.x * (10 + p.z * 26);
          const dy = tilt.y * (6 + p.z * 16);
          return (
            <button
              key={f.tmdbId}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`${f.title}, ${f.year}`}
              aria-pressed={on}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `translate3d(${dx}px, ${dy}px, 0)`,
                transition: "transform .5s cubic-bezier(.22,1,.36,1)",
              }}
            >
              <span className="relative grid place-items-center">
                {/* Halo */}
                <span
                  aria-hidden
                  className={`absolute rounded-full bg-[var(--gold)] blur-md transition-all duration-500 ${
                    on ? "h-10 w-10 opacity-60" : "h-5 w-5 opacity-20"
                  }`}
                />
                {/* The star itself */}
                <span
                  aria-hidden
                  className={`relative rounded-full bg-[var(--paper)] transition-all duration-500 ${
                    on ? "h-3 w-3 scale-125" : "h-1.5 w-1.5"
                  }`}
                  style={{ opacity: 0.55 + p.z * 0.45 }}
                />
                {/* Year, only on the live star */}
                <span
                  className={`absolute top-5 whitespace-nowrap text-[10px] tracking-[.16em] transition-all duration-300 ${
                    on ? "text-[var(--gold)] opacity-100" : "opacity-0"
                  }`}
                >
                  {f.year}
                </span>
              </span>
            </button>
          );
        })}

        {/* The live film, drawn beside its star rather than in a fixed panel,
            so the eye never leaves the sky. */}
        <div
          className="pointer-events-none absolute w-56 transition-all duration-500"
          style={{
            left: `${Math.min(node.x, 72)}%`,
            top: `${node.y > 50 ? node.y - 34 : node.y + 12}%`,
            transform: `translate3d(${tilt.x * 18}px, ${tilt.y * 10}px, 0)`,
          }}
        >
          <div className="flex gap-3">
            {film.posterPath && (
              <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-[2px] border border-[var(--gold)]/40 shadow-[0_8px_30px_rgba(0,0,0,.7)]">
                <Image
                  key={film.tmdbId}
                  src={tmdbImage(film.posterPath, "w342")}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 pt-1">
              <p className="display text-lg leading-tight">{film.title}</p>
              <p className="mt-1 text-[11px] leading-snug text-[var(--paper-55)]">
                as {film.character}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Every film, as real links. This is the accessible route and the
          mobile one; the sky above is an alternate view of the same list. */}
      <ul className="rail mt-8 flex gap-2 overflow-x-auto pb-2 md:mt-10">
        {films.map((f, i) => (
          <li key={f.tmdbId}>
            <a
              href={filmLink(f)}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`block shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[11px] tracking-[.06em] transition ${
                i === active
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-[var(--rule-strong)] text-[var(--paper-55)] hover:border-[var(--gold)]/60 hover:text-[var(--paper)]"
              }`}
            >
              {f.title}
              <span className="ml-2 opacity-50">{f.year}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
