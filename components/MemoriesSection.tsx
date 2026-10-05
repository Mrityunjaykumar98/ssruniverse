"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Photo, PhotoCredit } from "@/components/Photo";
import {
  categories,
  moments,
  videoThumb,
  type Moment,
  type MomentCategory,
} from "@/data/moments";

/**
 * Both kinds of tile can play: a video moment is the video, and a photograph
 * may carry footage of the same occasion. Returns the id to embed, or null
 * when there is nothing to watch.
 */
function playableId(moment: Moment) {
  if (moment.kind === "video") return moment.youtubeId;
  return moment.clip?.youtubeId ?? null;
}

/**
 * A print's resting angle and whether it is taped, derived from its id so the
 * wall looks hand-hung but is identical on every render and on the server.
 */
function tiltFor(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  const u = (n: number) => ((h >>> n) & 0xff) / 255;
  return {
    angle: (u(0) - 0.5) * 7, // between -3.5° and 3.5°
    tape: u(8) > 0.55,
    tapeAngle: (u(16) - 0.5) * 14,
  };
}

/** Tile art: a photograph, or the video's thumbnail cropped past its bars. */
function Thumb({ moment }: { moment: Moment }) {
  if (moment.kind === "photo") {
    return (
      <Photo
        slug={moment.slug}
        alt={moment.context}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover object-[50%_22%] sepia-[.28] saturate-[.8] transition duration-700 group-hover:scale-[1.04] group-hover:sepia-0 group-hover:saturate-100"
      />
    );
  }
  return (
    <Image
      src={videoThumb(moment.youtubeId)}
      alt=""
      fill
      sizes="(max-width: 768px) 50vw, 25vw"
      // hqdefault is 4:3 with letterbox bars; scaling past them recovers a
      // clean 16:9 frame.
      className="scale-[1.36] object-cover sepia-[.28] saturate-[.8] transition duration-700 group-hover:scale-[1.4] group-hover:sepia-0 group-hover:saturate-100"
    />
  );
}

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

export function MemoriesSection() {
  const [filter, setFilter] = useState<MomentCategory | "all">("all");
  const [open, setOpen] = useState<string | null>(null);
  /* The embed mounts only when asked for, so opening a tile starts nothing. */
  const [watching, setWatching] = useState(false);

  const shown = useMemo(
    () => (filter === "all" ? moments : moments.filter((m) => m.category === filter)),
    [filter],
  );

  const index = shown.findIndex((m) => m.id === open);
  const showing = index === -1 ? null : shown[index];

  const step = useCallback(
    (delta: number) => {
      if (index === -1) return;
      const next = (index + delta + shown.length) % shown.length;
      setWatching(false);
      setOpen(shown[next].id);
    },
    [index, shown],
  );

  /** True while a history entry for the open lightbox is on the stack. */
  const pushed = useRef(false);

  /**
   * Opening pushes a history entry, so the browser's Back button — the way
   * most people leave anything on a phone — closes the lightbox instead of
   * taking them off the site.
   */
  const openMoment = useCallback((id: string) => {
    if (!pushed.current) {
      history.pushState({ ssrLightbox: true }, "");
      pushed.current = true;
    }
    setWatching(false);
    setOpen(id);
  }, []);

  /** Closing from the page pops that entry, so history stays as it was. */
  const close = useCallback(() => {
    if (pushed.current) {
      history.back(); // popstate below does the actual closing
      return;
    }
    setOpen(null);
    setWatching(false);
  }, []);

  useEffect(() => {
    const onPop = () => {
      pushed.current = false;
      setOpen(null);
      setWatching(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!showing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [showing, step, close]);

  /** Any one print from the wall as it is currently filtered. */
  const surprise = () => openMoment(shown[Math.floor(Math.random() * shown.length)].id);

  const playableCount = moments.filter((m) => playableId(m)).length;
  const embedId = showing ? playableId(showing) : null;

  return (
    <section id="memories" className="section relative">
      {/* Memories run in sepia: the warmth of old prints, never the cold
          navy of the rest of the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_0%,rgba(206,128,104,.10),transparent_70%),radial-gradient(ellipse_60%_50%_at_10%_100%,rgba(190,140,90,.07),transparent_70%)]"
      />
      <div className="section-inner relative">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end" data-reveal>
          <div>
            <p className="eyebrow rule-lead">Fragments</p>
            <h2 className="display section-title">THE MEMORIES</h2>
            <p className="display mt-2 text-2xl italic text-[var(--paper-70)]">
              The Sushant we loved.
            </p>
            <p className="section-copy mt-5">
              {moments.length} moments &mdash; {playableCount} of them you can watch.
              Scenes and the making of them, what he said on stage and in
              conversation, and the photographs in between.
            </p>
          </div>
          <p className="script text-3xl text-[var(--gold)] md:text-4xl">
            That smile &hearts;
          </p>
        </div>

        {/* The filters scroll; the shuffle stays put beside them. */}
        <div className="mt-10 flex items-start gap-3">
          <div
            className="rail flex min-w-0 flex-1 gap-2 overflow-x-auto pb-2"
            role="tablist"
            aria-label="Filter moments"
          >
            {categories.map(({ id, label, note }) => {
              const active = id === filter;
              const count =
                id === "all" ? moments.length : moments.filter((m) => m.category === id).length;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  title={note}
                  onClick={() => {
                    setFilter(id);
                    close();
                  }}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-[11px] tracking-[.08em] transition ${
                    active
                      ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                      : "border-[var(--rule-strong)] text-[var(--paper-55)] hover:border-[var(--gold)]/60 hover:text-[var(--paper)]"
                  }`}
                >
                  {label}
                  <span className="ml-2 [font-variant-numeric:lining-nums_tabular-nums]">{count}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={surprise}
            title="Open a memory at random"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--gold)] text-[11px] font-bold tracking-[.14em] text-[var(--ink)] transition hover:bg-[var(--gold-bright)] sm:flex sm:w-auto sm:gap-1.5 sm:px-4"
          >
            <span aria-hidden>✦</span>
            {/* On a phone the filters need the row; the star alone will do. */}
            <span className="sr-only sm:not-sr-only">SURPRISE ME</span>
          </button>
        </div>

        {/* A wall of prints rather than a grid of tiles: memories should look
            like things that could be held. CSS columns give the uneven,
            pinned-up rhythm; each print hangs at its own slight angle. */}
        <ul
          data-reveal
          style={{ "--delay": "0.08s" } as React.CSSProperties}
          className="mt-12 columns-2 gap-5 sm:columns-3 lg:columns-4 lg:gap-7"
        >
          {shown.map((moment) => {
            const tilt = tiltFor(moment.id);
            const video = moment.kind === "video";
            return (
              <li key={moment.id} className="mb-7 break-inside-avoid lg:mb-9">
                <button
                  type="button"
                  onClick={() => openMoment(moment.id)}
                  className="print group relative block w-full text-left"
                  style={{ "--r": `${tilt.angle}deg` } as React.CSSProperties}
                >
                  {/* Tape on some prints, never the same two in a row. */}
                  {tilt.tape && (
                    <span
                      aria-hidden
                      className="print-tape"
                      style={{ "--tr": `${tilt.tapeAngle}deg` } as React.CSSProperties}
                    />
                  )}

                  <span
                    className={`relative block overflow-hidden bg-[#1b1a18] ${
                      video ? "aspect-[16/11]" : "aspect-[4/5]"
                    }`}
                  >
                    <Thumb moment={moment} />
                    {playableId(moment) && (
                      <span className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-[rgba(20,16,12,.72)] px-2.5 py-1 text-[10px] font-bold tracking-[.16em] text-[#f3e7cf] backdrop-blur-sm">
                        <PlayGlyph className="h-2.5 w-2.5" />
                        {video ? "FILM" : "FOOTAGE"}
                      </span>
                    )}
                  </span>

                  <span className="block px-1 pb-1 pt-3">
                    <span className="script block text-[1.65rem] leading-[1.05] text-[#2b2620]">
                      {moment.title}
                    </span>
                    <span className="mt-1 block text-[10px] leading-snug text-[#7b6f5f]">
                      {moment.context}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {showing &&
        createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={showing.context}
          className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(3,5,10,.94)] p-4 backdrop-blur-sm"
          onClick={close}
        >
          <figure className="m-0 w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {watching && embedId ? (
              <div className="aspect-video w-full overflow-hidden rounded-sm bg-black">
                <iframe
                  key={embedId}
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${embedId}?autoplay=1&rel=0`}
                  title={showing.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : showing.kind === "video" ? (
              <button
                type="button"
                onClick={() => setWatching(true)}
                className="relative block aspect-video w-full overflow-hidden rounded-sm bg-black"
              >
                <span className="sr-only">Play {showing.title}</span>
                <Image
                  src={videoThumb(showing.youtubeId)}
                  alt=""
                  fill
                  sizes="min(100vw, 56rem)"
                  // This frame is already 16:9, so cover crops the bars away.
                  className="object-cover opacity-75"
                />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full border border-[var(--paper)]/70 bg-[rgba(4,6,12,.45)] text-[var(--paper)] backdrop-blur-sm transition hover:scale-105 hover:border-[var(--gold)] hover:text-[var(--gold)]">
                    <PlayGlyph className="ml-1 h-8 w-8" />
                  </span>
                </span>
              </button>
            ) : (
              /* Photograph, with its footage offered over the top when it has any. */
              <div className="relative mx-auto w-fit">
                <Photo
                  slug={showing.slug}
                  alt={showing.context}
                  className="max-h-[68vh] w-auto rounded-sm object-contain"
                />
                {embedId && (
                  <button
                    type="button"
                    onClick={() => setWatching(true)}
                    className="absolute inset-0 grid place-items-center"
                  >
                    <span className="sr-only">Watch: {showing.clip?.label}</span>
                    <span className="grid h-16 w-16 place-items-center rounded-full border border-[var(--paper)]/70 bg-[rgba(4,6,12,.45)] text-[var(--paper)] backdrop-blur-sm transition hover:scale-105 hover:border-[var(--gold)] hover:text-[var(--gold)]">
                      <PlayGlyph className="ml-1 h-6 w-6" />
                    </span>
                  </button>
                )}
              </div>
            )}

            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <span className="min-w-0">
                <span className="display block text-xl">{showing.title}</span>
                <span className="mt-1 block text-xs text-[var(--paper-55)]">
                  {showing.context}
                </span>
                {showing.kind === "photo" && showing.clip && (
                  <span className="mt-2 block text-[11px] text-[var(--paper-40)]">
                    {watching ? "Now playing" : "Footage"}: {showing.clip.label}
                    {" · "}
                    <span className="text-[var(--gold)]/70">{showing.clip.source}</span>
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[var(--paper-40)]">
                {showing.kind === "photo" ? (
                  <PhotoCredit slug={showing.slug} />
                ) : (
                  <>
                    Video by{" "}
                    <a
                      href={`https://www.youtube.com/watch?v=${showing.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dotted underline-offset-2 hover:text-[var(--gold)]"
                    >
                      {showing.source}
                    </a>{" "}
                    on YouTube
                  </>
                )}
              </span>
            </figcaption>

          </figure>

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-[var(--rule-strong)] text-[var(--paper-70)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
          >
            <span aria-hidden>&times;</span>
          </button>

          {([[-1, "left-4", "Previous"], [1, "right-4", "Next"]] as const).map(
            ([delta, side, label]) => (
              <button
                key={label}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(delta);
                }}
                aria-label={`${label} moment`}
                className={`absolute ${side} top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[var(--rule-strong)] text-[var(--paper-70)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]`}
              >
                <span aria-hidden>{delta === -1 ? "‹" : "›"}</span>
              </button>
            ),
          )}
        </div>,
          document.body,
        )}
    </section>
  );
}
