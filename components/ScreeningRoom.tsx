"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { films, tmdbImage } from "@/data/films";
import { screenings } from "@/data/screenings";

const thumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

/**
 * A small cinema for the works that can legitimately be watched here in full.
 *
 * Choosing a programme parts the curtains; the player only mounts once they
 * have opened, so nothing loads until someone asks for it. Switching programme
 * closes the curtains, swaps the reel, and opens them again.
 */
export function ScreeningRoom() {
  const [index, setIndex] = useState(0);
  /** Curtains apart. */
  const [open, setOpen] = useState(false);
  /** The player is mounted — only once the curtains have finished parting. */
  const [rolling, setRolling] = useState(false);
  const show = screenings[index];

  useEffect(() => {
    if (!open) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setRolling(true), reduced ? 0 : 1300);
    return () => window.clearTimeout(t);
  }, [open, index]);

  const choose = (i: number) => {
    if (i === index && open) return;
    setRolling(false);
    setOpen(false);
    setIndex(i);
  };

  return (
    <section id="screening" className="section relative overflow-hidden">
      {/* The room is lit by its own screen: a cool spill when the film runs. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-[1600ms]"
        style={{
          opacity: rolling ? 1 : 0.35,
          background:
            "radial-gradient(ellipse 60% 45% at 50% 46%, rgba(170,190,255,.16), transparent 70%)",
        }}
      />

      <div className="section-inner relative">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <p className="eyebrow">Now showing</p>
          <h2 className="display section-title">THE SCREENING ROOM</h2>
          <p className="display mt-2 text-2xl italic text-[var(--paper-70)]">
            Two you can watch here, in full.
          </p>
        </div>

        {/* The screen, framed by a proscenium and its curtains. */}
        <div
          className="cinema relative mx-auto mt-12 max-w-5xl"
          data-reveal
          style={{ "--delay": "0.08s" } as React.CSSProperties}
        >
          <div className="cinema-pelmet" aria-hidden />
          {/* Drapes gathered either side of the proscenium. They stay outside
              the screen, so the parted curtains never cover YouTube's own
              controls — its fullscreen button sits in the corner. */}
          <div aria-hidden className="drape drape-left" />
          <div aria-hidden className="drape drape-right" />
          <div className="relative overflow-hidden rounded-[3px] bg-black shadow-[0_0_0_10px_#120e0c,0_40px_90px_rgba(0,0,0,.85)]">
            <div className="relative aspect-video">
              {rolling ? (
                <iframe
                  key={show.youtubeId}
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${show.youtubeId}?autoplay=1&rel=0`}
                  title={`${show.title} — published by ${show.source}`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <Image
                    key={show.youtubeId}
                    src={thumb(show.youtubeId)}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 64rem"
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_30%,rgba(0,0,0,.75))]" />
                </>
              )}

              {/* Curtains. They draw across the screen, not over the page. */}
              <div aria-hidden className={`curtain curtain-left ${open ? "is-open" : ""}`} />
              <div aria-hidden className={`curtain curtain-right ${open ? "is-open" : ""}`} />

              {!open && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="group absolute inset-0 z-10 grid place-items-center"
                >
                  <span className="text-center">
                    <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-[var(--gold)] bg-[rgba(10,6,4,.6)] text-[var(--gold)] backdrop-blur-sm transition duration-500 group-hover:scale-110 group-hover:bg-[var(--gold)] group-hover:text-[var(--ink)]">
                      <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor" aria-hidden>
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                    </span>
                    <span className="mt-4 block text-[11px] font-bold tracking-[.24em] text-[#f1e2c4] [text-shadow:0_2px_12px_#000]">
                      RAISE THE CURTAIN
                    </span>
                    <span className="sr-only">Play {show.title}</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tonight's programme, as tickets. */}
        <ul
          className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2"
          data-reveal
          style={{ "--delay": "0.14s" } as React.CSSProperties}
        >
          {screenings.map((s, i) => {
            const on = i === index;
            const f = s.film ? films.find((x) => x.title === s.film) : undefined;
            return (
              <li key={s.youtubeId}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  aria-pressed={on}
                  className={`ticket group flex w-full text-left ${on ? "is-on" : ""}`}
                >
                  <span className="relative block w-24 shrink-0 overflow-hidden border-r border-dashed border-[#5a4a35] sm:w-28">
                    <Image
                      src={f?.posterPath ? tmdbImage(f.posterPath, "w342") : thumb(s.youtubeId)}
                      alt=""
                      fill
                      sizes="112px"
                      className={`object-cover sepia-[.25] ${f?.posterPath ? "" : "scale-[1.36]"}`}
                    />
                  </span>
                  <span className="min-w-0 flex-1 p-4 sm:p-5">
                    <span className="flex items-center justify-between gap-3 text-[9px] font-bold tracking-[.2em] text-[#8c7552]">
                      <span>ADMIT ONE &middot; {s.kind.toUpperCase()}</span>
                      <span>{s.year}</span>
                    </span>
                    <span className="display mt-2 block text-2xl leading-tight text-[#2b2218]">
                      {s.title}
                    </span>
                    <span className="mt-1.5 block text-xs leading-snug text-[#5d4f3c]">{s.note}</span>
                    <span className="mt-3 block text-[10px] tracking-[.12em] text-[#8c7552]">
                      {s.runtime} &middot; {s.source.toUpperCase()}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[11px] leading-relaxed text-[var(--paper-40)]">
          {show.rights} These are the only works of his published in full by their rights
          holders. His other films are on paid streaming services; copies elsewhere on YouTube
          are unofficial, so they are not shown here.
        </p>
      </div>
    </section>
  );
}
