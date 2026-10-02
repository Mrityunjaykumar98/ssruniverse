"use client";

import { useEffect, useRef, useState } from "react";

const KEY = "ssr-universe:stars";
/** Enough to fill a sky; old ones give way to new so it never clutters. */
const MAX_STARS = 140;

type LitStar = { id: number; x: number; y: number; s: number };

/**
 * The page used to stop at a footer. This is where it lands instead.
 *
 * It closes on the words the hero opened with, and lets a visitor light a star
 * for him — the oldest memorial gesture there is, translated to a site that
 * already lives in a night sky. Stars are kept on the visitor's own device,
 * and the copy says so plainly rather than implying a shared count it does
 * not have.
 */
export function Ending() {
  const [stars, setStars] = useState<LitStar[]>([]);
  const [latest, setLatest] = useState<number | null>(null);
  /** Only persist after the visitor has actually lit something. Saving on
      mount would write the initial empty sky over the stored one before the
      restored stars arrived. */
  const dirty = useRef(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]") as LitStar[];
      if (Array.isArray(saved)) {
        // Reading storage has to wait for the client; doing it during render
        // would mismatch the server's empty sky on hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStars(saved.slice(-MAX_STARS));
      }
    } catch {
      // Private browsing or blocked storage: the sky simply starts empty.
    }
  }, []);

  useEffect(() => {
    if (!dirty.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(stars));
    } catch {
      // Storage full or unavailable; the star still shows for this visit.
    }
  }, [stars]);

  const light = () => {
    const star: LitStar = {
      id: Date.now(),
      // Keep clear of the type in the middle third.
      x: 4 + Math.random() * 92,
      y: Math.random() < 0.5 ? 4 + Math.random() * 26 : 70 + Math.random() * 24,
      s: 0.7 + Math.random() * 0.9,
    };
    dirty.current = true;
    setLatest(star.id);
    setStars((prev) => [...prev, star].slice(-MAX_STARS));
  };

  const count = stars.length;

  return (
    <section
      id="ending"
      className="relative flex min-h-[70svh] items-center overflow-hidden px-5 py-20 md:px-8"
    >
      {/* The visitor's own stars, kept in the sky they lit them in. */}
      <div aria-hidden className="absolute inset-0">
        {stars.map((s) => (
          <span
            key={s.id}
            className={`lit-star ${s.id === latest ? "lit-star-new" : ""}`}
            style={
              {
                left: `${s.x}%`,
                top: `${s.y}%`,
                "--s": s.s,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* A warm wash at the centre: the one place on the page that isn't cold. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(201,166,100,.12),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <h2
          className="display text-[clamp(3.6rem,11vw,9.5rem)] font-light leading-[.88] tracking-[-.02em]"
          data-reveal
          style={{ "--delay": "0.1s" } as React.CSSProperties}
        >
          Keep looking
          <span className="script ml-[.18em] inline-block text-[var(--gold)] [font-size:1.06em]">
            up.
          </span>
        </h2>

        <p
          className="mx-auto mt-10 max-w-lg text-base leading-relaxed text-[var(--paper-55)]"
          data-reveal
          style={{ "--delay": "0.22s" } as React.CSSProperties}
        >
          He spent his life looking at the sky. Light a star for him, and it stays in this one.
        </p>

        <div data-reveal style={{ "--delay": "0.34s" } as React.CSSProperties}>
          <button
            type="button"
            onClick={light}
            className="group relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-full border border-[var(--gold)]/70 px-9 py-4 text-xs font-bold tracking-[.22em] text-[var(--gold)] transition duration-500 hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--ink)]"
          >
            <span aria-hidden className="text-base transition-transform duration-700 group-hover:rotate-[72deg]">
              ✦
            </span>
            LIGHT A STAR
          </button>

          <p className="mt-6 h-5 text-[11px] tracking-[.12em] text-[var(--paper-40)]" aria-live="polite">
            {count === 0
              ? " "
              : `${count} ${count === 1 ? "star" : "stars"} lit from this device · they'll be here when you come back`}
          </p>
        </div>

        <p
          className="mt-16 text-[11px] tracking-[.3em] text-[var(--paper-40)]"
          data-reveal
          style={{ "--delay": "0.44s" } as React.CSSProperties}
        >
          21 JAN 1986 &nbsp;&mdash;&nbsp; 14 JUN 2020
        </p>
      </div>
    </section>
  );
}
