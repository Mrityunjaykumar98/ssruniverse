"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/Icons";
import { films, tmdbImage } from "@/data/films";
import { songs, songArtwork } from "@/data/songs";

/**
 * Prefer the film's TMDB backdrop for artwork: YouTube's own thumbnails are
 * label promos with view-count graphics burned into them. Falls back to the
 * video thumbnail if a track ever has no matching film.
 */
function artworkFor(film: string, youtubeId: string) {
  const match = films.find((f) => f.title === film);
  return match?.backdropPath
    ? tmdbImage(match.backdropPath, "w780")
    : songArtwork(youtubeId);
}

export function MusicSection() {
  const [index, setIndex] = useState(0);
  /* Nothing autoplays on load — the embed only mounts once someone presses play. */
  const [playing, setPlaying] = useState(false);
  const song = songs[index];

  const select = (next: number) => {
    setIndex((next + songs.length) % songs.length);
    setPlaying(false);
  };

  return (
    <section id="music" className="section border-y border-[var(--rule)] bg-[var(--ink-raised)]">
      <div className="section-inner">
        <p className="eyebrow rule-lead">02 / Soundtrack</p>
        <h2 className="display section-title">THE MUSIC</h2>
        <p className="display mt-2 text-2xl italic text-[var(--paper-70)]">
          His songs, his emotions.
        </p>
        <p className="section-copy mt-5">
          Whether it was love, hope, heartbreak or peace, his songs always found a way
          to reach people. Each one plays here from its rights holder&rsquo;s own channel.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
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
                    src={artworkFor(song.film, song.youtubeId)}
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
                  {song.film} &middot; {song.singers}
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
                <span aria-hidden className="text-[11px]">{playing ? "■" : "▶"}</span>
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
                {String(index + 1).padStart(2, "0")} / {String(songs.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Track list */}
          <ol className="border-t border-[var(--rule)]">
            {songs.map((track, i) => {
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
                    <span className={`w-5 text-[10px] ${active ? "text-[var(--gold)]" : "text-[var(--paper-40)]"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm ${active ? "text-[var(--gold)]" : ""}`}>
                        {track.title}
                      </span>
                      <span className="block truncate text-[10px] text-[var(--paper-40)]">
                        {track.film} &middot; {track.source}
                      </span>
                    </span>
                    <span className="shrink-0 text-[10px] text-[var(--paper-40)]">{track.year}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="mt-6 text-[10px] leading-5 text-[var(--paper-40)]">
          Playback is provided by YouTube&rsquo;s privacy-enhanced embed. Copyright in each
          recording remains with its respective rights holder.
        </p>
      </div>
    </section>
  );
}
