"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/Icons";
import { films, filmLink, tmdbImage } from "@/data/films";
import { songs, songArtwork, type Song } from "@/data/songs";

/**
 * Prefer the film's TMDB backdrop for artwork: YouTube's own thumbnails are
 * label promos with view counts burned into them. Falls back to the video
 * thumbnail when a track has no matching film.
 */
function artworkFor(song: Song) {
  const match = films.find((f) => f.title === song.film);
  return match?.backdropPath
    ? tmdbImage(match.backdropPath, "w780")
    : songArtwork(song.youtubeId);
}

export function MusicSection() {
  /* Films in release order, limited to those that actually have tracks. */
  const filmOrder = useMemo(
    () => films.map((f) => f.title).filter((t) => songs.some((s) => s.film === t)),
    [],
  );
  const [film, setFilm] = useState(filmOrder[0] ?? "");
  const tracks = useMemo(() => songs.filter((s) => s.film === film), [film]);

  const [index, setIndex] = useState(0);
  /* Nothing autoplays on load — the embed mounts only once play is pressed. */
  const [playing, setPlaying] = useState(false);
  const song = tracks[index] ?? tracks[0];

  const pickFilm = (title: string) => {
    setFilm(title);
    setIndex(0);
    setPlaying(false);
  };
  const select = (next: number) => {
    setIndex((next + tracks.length) % tracks.length);
    setPlaying(false);
  };

  if (!song) return null;

  return (
    <section id="music" className="section relative border-y border-[var(--rule)] bg-[rgba(10,14,25,.72)]">
      {/* Music runs warm: an amber light from below, as off a stage. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_25%_100%,rgba(214,150,70,.13),transparent_70%)]"
      />
      <div className="section-inner relative">
        <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]" data-reveal>
          <div>
            <p className="eyebrow rule-lead">02 / Soundtrack</p>
            <h2 className="display section-title">THE MUSIC</h2>
            <p className="display mt-2 text-2xl italic text-[var(--paper-70)]">
              His songs, his emotions.
            </p>
          </div>
          {/* The size of the archive, as an object rather than a clause. */}
          <div className="flex items-end gap-6 md:pb-2">
            <p className="text-right">
              <span className="display block text-[clamp(4rem,9vw,7.5rem)] font-light leading-[.8] [font-variant-numeric:lining-nums] text-[var(--gold)]">
                {songs.length}
              </span>
              <span className="mt-3 block text-[10px] tracking-[.22em] text-[var(--paper-40)]">
                SONGS
              </span>
            </p>
            <p className="text-right">
              <span className="display block text-[clamp(4rem,9vw,7.5rem)] font-light leading-[.8] [font-variant-numeric:lining-nums] text-[var(--paper)]/80">
                {filmOrder.length}
              </span>
              <span className="mt-3 block text-[10px] tracking-[.22em] text-[var(--paper-40)]">
                FILMS
              </span>
            </p>
          </div>
        </div>
        <p className="section-copy mt-6" data-reveal>
          Every soundtrack he was part of. Each song plays from its rights
          holder&rsquo;s own channel.
        </p>

        {/* Film selector */}
        <div
          className="rail mt-10 flex gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Choose a film"
        >
          {filmOrder.map((title) => {
            const active = title === film;
            const count = songs.filter((s) => s.film === title).length;
            return (
              <button
                key={title}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => pickFilm(title)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[11px] tracking-[.08em] transition ${
                  active
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "border-[var(--rule-strong)] text-[var(--paper-55)] hover:border-[var(--gold)]/60 hover:text-[var(--paper)]"
                }`}
              >
                {title}
                <span className="ml-2 opacity-50">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14" data-reveal style={{ "--delay": "0.1s" } as React.CSSProperties}>
          {/* Player */}
          <div className="rounded-sm border border-[var(--rule)] bg-[var(--card)]/60 p-4 sm:p-5">
            <div className="relative aspect-video overflow-hidden rounded-sm bg-black">
              {playing ? (
                <iframe
                  key={song.youtubeId}
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${song.youtubeId}?autoplay=1&rel=0`}
                  title={`${song.title} — official video`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <Image
                    src={artworkFor(song)}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,6,12,.9),transparent_60%)]" />
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="absolute inset-0 grid place-items-center"
                  >
                    <span className="sr-only">Play {song.title}</span>
                    <span className="grid h-16 w-16 place-items-center rounded-full border border-[var(--paper)]/70 bg-[rgba(4,6,12,.45)] text-[var(--paper)] backdrop-blur-sm transition hover:scale-105 hover:border-[var(--gold)] hover:text-[var(--gold)]">
                      <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor" aria-hidden>
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                    </span>
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="display truncate text-2xl">{song.title}</p>
                <p className="mt-1 truncate text-xs text-[var(--paper-40)]">
                  {song.singers || song.film}
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-[var(--paper-40)]">{song.year}</span>
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-[var(--rule)] pt-4">
              <button
                type="button"
                onClick={() => select(index - 1)}
                aria-label="Previous track"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--rule-strong)] text-[var(--paper-55)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                <Icon name="arrow" className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((v) => !v)}
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--gold)] text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--ink)]"
              >
                <span className="sr-only">{playing ? "Stop" : "Play"}</span>
                <span aria-hidden className="text-[11px]">
                  {playing ? "■" : "▶"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => select(index + 1)}
                aria-label="Next track"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--rule-strong)] text-[var(--paper-55)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                <Icon name="arrow" className="h-4 w-4" />
              </button>
              <span className="ml-auto text-[10px] tracking-[.14em] text-[var(--paper-40)]">
                {String(index + 1).padStart(2, "0")} / {String(tracks.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* The film heads its own track list, so the column carries the
              same weight as the player beside it however few songs it has. */}
          <div>
          {(() => {
            const f = films.find((x) => x.title === film);
            return (
              <div className="mb-6 flex items-end gap-5">
                {f?.posterPath && (
                  <a
                    href={filmLink(f)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block h-40 w-[6.8rem] shrink-0 overflow-hidden rounded-sm border border-[var(--rule-strong)] shadow-[0_18px_44px_rgba(0,0,0,.7)] transition duration-500 hover:-translate-y-1 hover:border-[var(--gold)]"
                    title={`${f.title} on IMDb`}
                  >
                    <Image
                      key={f.tmdbId}
                      src={tmdbImage(f.posterPath, "w342")}
                      alt=""
                      fill
                      sizes="110px"
                      className="object-cover"
                    />
                  </a>
                )}
                <div className="min-w-0 pb-1">
                  <p className="text-[10px] tracking-[.2em] text-[var(--gold)]">
                    {f?.year} &middot; {tracks.length} {tracks.length === 1 ? "SONG" : "SONGS"}
                  </p>
                  <p className="display mt-2 text-3xl leading-tight">{film}</p>
                  {f && (
                    <p className="mt-1.5 text-xs text-[var(--paper-55)]">as {f.character}</p>
                  )}
                </div>
              </div>
            );
          })()}
          <ol className="border-t border-[var(--rule)]">
            {tracks.map((track, i) => {
              const active = i === index;
              return (
                <li key={track.youtubeId}>
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-current={active ? "true" : undefined}
                    className={`flex w-full items-center gap-4 border-b border-[var(--rule)] px-1 py-3.5 text-left transition ${
                      active ? "bg-[var(--gold)]/[.07]" : "hover:bg-[var(--paper)]/[.03]"
                    }`}
                  >
                    <span
                      className={`w-5 text-[10px] ${active ? "text-[var(--gold)]" : "text-[var(--paper-40)]"}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm ${active ? "text-[var(--gold)]" : ""}`}>
                        {track.title}
                      </span>
                      <span className="block truncate text-[10px] text-[var(--paper-40)]">
                        {track.singers || track.film} &middot; {track.source}
                      </span>
                    </span>
                    <span className="shrink-0 text-[10px] text-[var(--paper-40)]">{track.year}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          </div>
        </div>

        <p className="mt-6 text-[10px] leading-5 text-[var(--paper-40)]">
          Playback is provided by YouTube&rsquo;s privacy-enhanced embed. Copyright in each
          recording remains with its respective rights holder.
        </p>
      </div>
    </section>
  );
}
