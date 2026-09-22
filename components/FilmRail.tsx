"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/Icons";
import { films, filmLink, tmdbImage } from "@/data/films";

export function FilmRail() {
  const rail = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* Disable the arrows at each extreme rather than letting them no-op. */
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const sync = () => {
      setAtStart(el.scrollLeft < 8);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    };
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    // Advance by whole cards so the rail never stops mid-poster.
    const card = el.querySelector("li");
    const step = card ? card.clientWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={rail}
        className="rail flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {films.map((film) => (
          <li key={film.tmdbId} className="w-40 shrink-0 snap-start sm:w-44">
            <a
              href={filmLink(film)}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
              title={`${film.title} on ${film.imdbId ? "IMDb" : "TMDB"}`}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-sm border border-[var(--rule)] bg-[var(--card)] transition duration-500 group-hover:border-[var(--gold)]">
                {film.posterPath ? (
                  <Image
                    src={tmdbImage(film.posterPath, "w342")}
                    alt={`${film.title} poster`}
                    fill
                    sizes="(max-width: 640px) 160px, 176px"
                    className="object-cover transition duration-700 group-hover:scale-[1.06]"
                  />
                ) : (
                  <div className="grid h-full place-items-center px-3 text-center">
                    <span className="display text-xl">{film.title}</span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(4,6,12,.85),transparent_45%)] opacity-0 transition group-hover:opacity-100" />
                {/* Says where the card goes before you commit to the click. */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-3 text-[10px] font-bold tracking-[.14em] text-[var(--gold)] opacity-0 transition group-hover:opacity-100">
                  {film.imdbId ? "IMDb" : "TMDB"}
                  <Icon name="arrow" className="h-3 w-3" />
                </span>
              </div>
              <p className="display mt-3 text-lg leading-tight transition group-hover:text-[var(--gold)]">
                {film.title}
              </p>
              <p className="mt-1 text-[11px] text-[var(--paper-40)]">
                {film.year} &middot; as {film.character}
              </p>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center gap-3">
        {([-1, 1] as const).map((dir) => {
          const disabled = dir === -1 ? atStart : atEnd;
          return (
            <button
              key={dir}
              type="button"
              onClick={() => nudge(dir)}
              disabled={disabled}
              aria-label={dir === -1 ? "Previous films" : "Next films"}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--gold)]/60 text-[var(--gold)] transition enabled:hover:bg-[var(--gold)] enabled:hover:text-[var(--ink)] disabled:opacity-25"
            >
              <Icon name="arrow" className={`h-4 w-4 ${dir === -1 ? "rotate-180" : ""}`} />
            </button>
          );
        })}
        <span className="ml-auto text-[10px] tracking-[.16em] text-[var(--paper-40)]">
          {films.length} FILMS
        </span>
      </div>
    </div>
  );
}
