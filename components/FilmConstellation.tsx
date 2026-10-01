"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/Icons";
import { films, filmLink, tmdbImage } from "@/data/films";

/** Radius of the reel, in pixels. Larger reads flatter and calmer. */
const RADIUS = 620;
/** Angle between neighbouring films on the arc. */
const STEP = 23;
/** Cards past this many places from centre are not worth drawing. */
const VISIBLE = 4;

/**
 * The filmography as a reel curving through space.
 *
 * Eleven posters cannot all be legible on a flat plane: small enough to fit
 * and they are thumbnails, large enough to read and they occlude each other.
 * An arc gives every film its own angular slot, so one is always face-on and
 * clear while its neighbours turn away — no overlap to resolve, and the depth
 * is real rather than implied.
 *
 * Every card is a link. Clicking a neighbour brings it to the front; clicking
 * the film already at the front opens it.
 */
export function FilmConstellation() {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; from: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  const go = useCallback((next: number) => {
    setActive(Math.max(0, Math.min(films.length - 1, next)));
  }, []);

  /* Arrow keys move along the reel whenever it holds focus. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    }
  };

  /* Dragging scrubs the reel, one film per ~90px of travel. */
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      if (!drag.current) return;
      go(drag.current.from - Math.round((e.clientX - drag.current.x) / 90));
    };
    const stop = () => {
      setDragging(false);
      drag.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
    };
  }, [dragging, go]);

  const film = films[active];

  return (
    <div>
      {/* The reel. Hidden from pointerless and narrow contexts, which get the
          plain grid below instead. */}
      <div
        ref={stage}
        role="group"
        aria-label="Filmography reel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, from: active };
          setDragging(true);
        }}
        className={`relative hidden h-[30rem] w-full touch-pan-y select-none md:block ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ perspective: "1700px", perspectiveOrigin: "50% 42%" }}
      >
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {films.map((f, i) => {
            const offset = i - active;
            if (Math.abs(offset) > VISIBLE) return null;
            const on = offset === 0;
            const angle = offset * STEP;
            // Depth falls away from centre so neighbours sit back, not just aside.
            const depth = -Math.abs(offset) * 70;

            return (
              <a
                key={f.tmdbId}
                href={filmLink(f)}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={on ? 0 : -1}
                aria-hidden={!on}
                title={`${f.title} (${f.year}) — open on ${f.imdbId ? "IMDb" : "TMDB"}`}
                onClick={(e) => {
                  // A neighbour is a seat on the reel, not a destination.
                  if (!on) {
                    e.preventDefault();
                    go(i);
                  }
                }}
                className="group absolute left-1/2 top-1/2 block"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${
                    RADIUS + depth
                  }px) scale(${on ? 1 : 0.9})`,
                  transition: dragging
                    ? "transform .25s ease-out"
                    : "transform .65s cubic-bezier(.22,1,.36,1)",
                  zIndex: 40 - Math.abs(offset),
                }}
              >
                <span
                  className={`relative block h-[21rem] w-56 overflow-hidden rounded-sm border transition-all duration-500 ${
                    on ? "border-[var(--gold)]/70" : "border-[var(--rule-strong)]"
                  }`}
                  style={{
                    boxShadow: on
                      ? "0 50px 110px rgba(0,0,0,.9), 0 0 70px rgba(201,166,100,.2)"
                      : "0 26px 60px rgba(0,0,0,.8)",
                  }}
                >
                  {f.posterPath ? (
                    <Image
                      src={tmdbImage(f.posterPath, "w500")}
                      alt=""
                      fill
                      sizes="320px"
                      className="object-cover"
                      priority={Math.abs(offset) <= 1}
                    />
                  ) : (
                    <span className="grid h-full place-items-center bg-[var(--card)] px-2 text-center">
                      <span className="display text-base leading-tight">{f.title}</span>
                    </span>
                  )}
                  {/* Turned-away cards fall into shadow. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[#060912] transition-opacity duration-500"
                    style={{ opacity: on ? 0 : 0.28 + Math.abs(offset) * 0.14 }}
                  />
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* The film at the front, named once, below the reel. */}
      <div className="mt-2 hidden md:block">
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <p className="display text-3xl leading-tight">{film.title}</p>
            <p className="mt-1.5 text-sm text-[var(--paper-55)]">
              {film.year} &middot; as {film.character}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              aria-label="Previous film"
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--rule-strong)] text-[var(--paper-55)] transition enabled:hover:border-[var(--gold)] enabled:hover:text-[var(--gold)] disabled:opacity-25"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
            </button>
            <span className="w-16 text-center text-[11px] tracking-[.16em] text-[var(--paper-40)]">
              {String(active + 1).padStart(2, "0")} / {films.length}
            </span>
            <button
              type="button"
              onClick={() => go(active + 1)}
              disabled={active === films.length - 1}
              aria-label="Next film"
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--rule-strong)] text-[var(--paper-55)] transition enabled:hover:border-[var(--gold)] enabled:hover:text-[var(--gold)] disabled:opacity-25"
            >
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* A year scrubber, so the whole span is visible at once and any film
            is one click away rather than several. */}
        <ul className="mt-6 flex items-stretch gap-px border-t border-[var(--rule)]">
          {films.map((f, i) => (
            <li key={f.tmdbId} className="flex-1">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`${f.title}, ${f.year}`}
                aria-current={i === active}
                className="group block w-full pt-3 text-left"
              >
                <span
                  className={`block h-px w-full transition-all duration-500 ${
                    i === active
                      ? "h-0.5 bg-[var(--gold)]"
                      : "bg-[var(--rule-strong)] group-hover:bg-[var(--gold)]/60"
                  }`}
                />
                <span
                  className={`mt-2 block text-[10px] tracking-[.1em] transition-colors ${
                    i === active ? "text-[var(--gold)]" : "text-[var(--paper-40)]"
                  }`}
                >
                  {f.year}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile, and the route for anyone without a pointer. */}
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:hidden">
        {films.map((f) => (
          <li key={f.tmdbId}>
            <a href={filmLink(f)} target="_blank" rel="noopener noreferrer" className="block">
              <span className="relative block aspect-[2/3] overflow-hidden rounded-sm border border-[var(--rule)]">
                {f.posterPath && (
                  <Image
                    src={tmdbImage(f.posterPath, "w342")}
                    alt=""
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                )}
              </span>
              <span className="mt-2 block text-xs leading-tight">{f.title}</span>
              <span className="mt-0.5 block text-[10px] text-[var(--paper-40)]">{f.year}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
