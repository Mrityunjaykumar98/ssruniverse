"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { films, filmLink, tmdbImage } from "@/data/films";
import { songs } from "@/data/songs";

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

function PauseGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
    </svg>
  );
}

/**
 * A turntable. The record spins only while something plays, and its label is
 * the film's poster. The light catching the grooves is a separate layer that
 * does not turn — on a real record the reflection stays still while the disc
 * spins beneath it, and that is most of what makes one look real.
 */
function Turntable({
  poster,
  title,
  playing,
  onToggle,
}: {
  poster: string | null;
  title: string;
  playing: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="turntable relative mx-auto aspect-[1/0.86] w-full max-w-[34rem] rounded-[14px] p-[6%]">
      {/* Platter */}
      <div className="relative aspect-square w-[78%] rounded-full bg-[#0c0c0d] shadow-[0_0_0_6px_#1c1b1a,0_0_0_7px_#2b2925,0_18px_40px_rgba(0,0,0,.7)]">
        {/* The record. key on the title, so a new film drops a new disc in. */}
        <div
          key={title}
          className={`vinyl absolute inset-[3%] rounded-full ${playing ? "is-spinning" : ""}`}
        >
          <div className="absolute inset-[31%] overflow-hidden rounded-full border-[3px] border-[#16130f] bg-[#2a2219]">
            {poster && (
              <Image
                src={poster}
                alt=""
                fill
                sizes="160px"
                className="object-cover object-top"
              />
            )}
          </div>
          {/* Spindle */}
          <div className="absolute left-1/2 top-1/2 h-[3.2%] w-[3.2%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#e8e2d4,#6e6a62)]" />
        </div>
        {/* The light on the grooves, which stays put. */}
        <div aria-hidden className="vinyl-sheen pointer-events-none absolute inset-[3%] rounded-full" />
      </div>

      {/* Tonearm: rests off the record, swings onto it to play. */}
      <div
        aria-hidden
        className="tonearm absolute right-[9%] top-[9%] h-[62%] w-[6%] origin-[50%_7%]"
        style={{ transform: `rotate(${playing ? 23 : 4}deg)` }}
      >
        <div className="absolute left-1/2 top-0 h-[14%] w-[180%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_40%_35%,#d9d3c6,#5b574f)] shadow-[0_4px_10px_rgba(0,0,0,.6)]" />
        <div className="absolute left-1/2 top-[6%] h-[82%] w-[22%] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,#8d877c,#e4dfd3,#8d877c)]" />
        <div className="absolute bottom-0 left-1/2 h-[14%] w-[110%] -translate-x-1/2 rounded-[3px] bg-[linear-gradient(180deg,#3a3732,#16140f)]" />
      </div>

      {/* The one control on the deck. */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={playing ? "Stop" : "Play"}
        className="absolute bottom-[7%] right-[7%] grid h-14 w-14 place-items-center rounded-full border border-[var(--gold)]/70 bg-[rgba(10,8,6,.7)] text-[var(--gold)] shadow-[0_8px_24px_rgba(0,0,0,.6)] backdrop-blur-sm transition hover:bg-[var(--gold)] hover:text-[var(--ink)]"
      >
        {playing ? <PauseGlyph className="h-5 w-5" /> : <PlayGlyph className="ml-0.5 h-5 w-5" />}
      </button>

      {/* Speed and a power lamp, for the look of the thing. */}
      <div aria-hidden className="absolute bottom-[8.5%] left-[7%] flex items-center gap-3">
        <span
          className={`h-2 w-2 rounded-full transition ${
            playing ? "bg-[#f0b25c] shadow-[0_0_10px_#f0b25c]" : "bg-[#3a3328]"
          }`}
        />
        <span className="text-[10px] font-bold tracking-[.2em] text-[#a39782]">33⅓ RPM</span>
      </div>
    </div>
  );
}

export function MusicSection() {
  /* Films in release order, limited to those that actually have tracks. */
  const filmOrder = useMemo(
    () => films.filter((f) => songs.some((s) => s.film === f.title)),
    [],
  );
  const [filmTitle, setFilmTitle] = useState(filmOrder[0]?.title ?? "");
  const film = filmOrder.find((f) => f.title === filmTitle) ?? filmOrder[0];
  const tracks = useMemo(() => songs.filter((s) => s.film === filmTitle), [filmTitle]);

  const [index, setIndex] = useState(0);
  /* Nothing plays until asked; the embed mounts only then. */
  const [playing, setPlaying] = useState(false);
  const song = tracks[index] ?? tracks[0];

  const pickFilm = (title: string) => {
    setFilmTitle(title);
    setIndex(0);
    setPlaying(false);
  };
  const playTrack = (i: number) => {
    setIndex(i);
    setPlaying(true);
  };

  if (!film || !song) return null;

  // A record has two sides; split the soundtrack across them.
  const half = Math.ceil(tracks.length / 2);
  const sides: { label: string; from: number; list: typeof tracks }[] = [
    { label: "SIDE A", from: 0, list: tracks.slice(0, half) },
    { label: "SIDE B", from: half, list: tracks.slice(half) },
  ].filter((s) => s.list.length > 0);

  return (
    <section
      id="music"
      className="section relative border-y border-[var(--rule)] bg-[rgba(10,14,25,.72)]"
    >
      {/* Music runs warm: an amber light from below, as off a stage. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_25%_100%,rgba(214,150,70,.14),transparent_70%)]"
      />

      <div className="section-inner relative">
        <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]" data-reveal>
          <div>
            <p className="eyebrow rule-lead">02 / Soundtrack</p>
            <h2 className="display section-title">THE MUSIC</h2>
            <p className="display mt-2 text-2xl italic text-[var(--paper-70)]">
              Every soundtrack, on vinyl.
            </p>
          </div>
          <div className="flex items-end gap-6 md:pb-2">
            {[
              [songs.length, "SONGS", "text-[var(--gold)]"],
              [filmOrder.length, "RECORDS", "text-[var(--paper)]/80"],
            ].map(([n, label, color]) => (
              <p key={label as string} className="text-right">
                <span
                  className={`display block text-[clamp(4rem,9vw,7.5rem)] font-light leading-[.8] [font-variant-numeric:lining-nums] ${color}`}
                >
                  {n}
                </span>
                <span className="mt-3 block text-[10px] tracking-[.22em] text-[var(--paper-40)]">
                  {label}
                </span>
              </p>
            ))}
          </div>
        </div>

        <div
          className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-14"
          data-reveal
          style={{ "--delay": "0.08s" } as React.CSSProperties}
        >
          <Turntable
            poster={film.posterPath ? tmdbImage(film.posterPath, "w342") : null}
            title={film.title}
            playing={playing}
            onToggle={() => setPlaying((v) => !v)}
          />

          {/* The back of the sleeve. */}
          <div>
            {/* YouTube's terms do not allow hiding the player, so while a track
                plays the video sits here, in full view, above the tracklist. */}
            {playing && (
              <div className="mb-6 aspect-video overflow-hidden rounded-sm border border-[var(--rule-strong)] bg-black shadow-[0_20px_50px_rgba(0,0,0,.6)]">
                <iframe
                  key={song.youtubeId}
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${song.youtubeId}?autoplay=1&rel=0`}
                  title={`${song.title} — official video`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="flex items-start justify-between gap-4 border-b border-[var(--rule)] pb-5">
              <div className="min-w-0">
                <p className="text-[10px] tracking-[.22em] text-[var(--gold)]">
                  ORIGINAL SOUNDTRACK &middot; {film.year}
                </p>
                <a
                  href={filmLink(film)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="display mt-2 block text-4xl leading-tight transition hover:text-[var(--gold)]"
                >
                  {film.title}
                </a>
                <p className="mt-1.5 text-xs text-[var(--paper-55)]">
                  {tracks.length} {tracks.length === 1 ? "song" : "songs"} &middot; he played{" "}
                  {film.character}
                </p>
              </div>
              <span className="mt-1 shrink-0 text-[10px] tracking-[.16em] text-[var(--paper-40)]">
                {playing ? "NOW PLAYING" : "READY"}
              </span>
            </div>

            {sides.map((side) => (
              <div key={side.label} className="mt-6">
                <p className="mb-2 text-[10px] font-bold tracking-[.24em] text-[var(--paper-40)]">
                  {side.label}
                </p>
                <ol>
                  {side.list.map((track, k) => {
                    const i = side.from + k;
                    const live = playing && i === index;
                    return (
                      <li key={track.youtubeId}>
                        <button
                          type="button"
                          onClick={() => (live ? setPlaying(false) : playTrack(i))}
                          aria-current={i === index ? "true" : undefined}
                          className={`group flex w-full items-center gap-4 border-b border-[var(--rule)] py-3 text-left transition ${
                            i === index ? "text-[var(--gold)]" : "hover:text-[var(--paper)]"
                          }`}
                        >
                          <span className="grid w-6 shrink-0 place-items-center text-[11px] text-[var(--paper-40)]">
                            {live ? (
                              <span className="eq" aria-hidden>
                                <i /> <i /> <i />
                              </span>
                            ) : (
                              <>
                                <span className="group-hover:hidden">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <PlayGlyph className="hidden h-3 w-3 text-[var(--gold)] group-hover:block" />
                              </>
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="display block truncate text-xl leading-tight">
                              {track.title}
                            </span>
                            <span className="mt-0.5 block truncate text-[10px] text-[var(--paper-40)]">
                              {track.singers || film.title} &middot; {track.source}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* The crate. Every film's soundtrack as a sleeve to pull out. */}
        <div className="mt-16" data-reveal style={{ "--delay": "0.14s" } as React.CSSProperties}>
          <div className="mb-5 flex items-baseline justify-between">
            <p className="text-[10px] font-bold tracking-[.24em] text-[var(--paper-40)]">
              THE CRATE &middot; PULL A RECORD
            </p>
            <p className="text-[10px] tracking-[.16em] text-[var(--paper-40)]">
              {filmOrder.findIndex((f) => f.title === film.title) + 1} / {filmOrder.length}
            </p>
          </div>
          <ul className="rail flex gap-4 overflow-x-auto pb-6 pt-20">
            {filmOrder.map((f) => {
              const on = f.title === film.title;
              const count = songs.filter((s) => s.film === f.title).length;
              return (
                <li key={f.tmdbId} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => pickFilm(f.title)}
                    aria-pressed={on}
                    aria-label={`${f.title}, ${count} songs`}
                    className={`sleeve group relative block w-32 text-left sm:w-36 ${on ? "is-out" : ""}`}
                  >
                    {/* The record peeking out of its sleeve. */}
                    <span aria-hidden className="sleeve-disc" />
                    <span className="relative block aspect-square overflow-hidden rounded-[2px] border border-[var(--rule-strong)] bg-[#141210] shadow-[0_14px_30px_rgba(0,0,0,.7)]">
                      {f.posterPath && (
                        <Image
                          src={tmdbImage(f.posterPath, "w342")}
                          alt=""
                          fill
                          sizes="150px"
                          className="object-cover object-top"
                        />
                      )}
                      <span className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.14),transparent_38%)]" />
                    </span>
                    <span className="mt-3 block truncate text-xs">{f.title}</span>
                    <span className="mt-0.5 block text-[10px] text-[var(--paper-40)]">
                      {f.year} &middot; {count} {count === 1 ? "song" : "songs"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-2 text-[10px] leading-5 text-[var(--paper-40)]">
          Each song plays from its rights holder&rsquo;s own channel through YouTube&rsquo;s
          privacy-enhanced embed.
        </p>
      </div>
    </section>
  );
}
