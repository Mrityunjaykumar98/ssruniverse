"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

/** Tile art: a photograph, or the video's thumbnail cropped past its bars. */
function Thumb({ moment }: { moment: Moment }) {
  if (moment.kind === "photo") {
    return (
      <Photo
        slug={moment.slug}
        alt={moment.context}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover object-[50%_22%] saturate-[.75] transition duration-700 group-hover:scale-[1.06] group-hover:saturate-100"
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
      className="scale-[1.36] object-cover saturate-[.75] transition duration-700 group-hover:scale-[1.44] group-hover:saturate-100"
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

  const close = useCallback(() => {
    setOpen(null);
    setWatching(false);
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

  const playableCount = moments.filter((m) => playableId(m)).length;
  const embedId = showing ? playableId(showing) : null;

  return (
    <section id="memories" className="section">
      <div className="section-inner">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end" data-reveal>
          <div>
            <p className="eyebrow rule-lead">03 / Fragments</p>
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

        <div
          className="rail mt-10 flex gap-2 overflow-x-auto pb-2"
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
                className={`shrink-0 rounded-full border px-4 py-2 text-[11px] tracking-[.08em] transition ${
                  active
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "border-[var(--rule-strong)] text-[var(--paper-55)] hover:border-[var(--gold)]/60 hover:text-[var(--paper)]"
                }`}
              >
                {label}
                <span className="ml-2 opacity-50">{count}</span>
              </button>
            );
          })}
        </div>

        <ul data-reveal style={{ "--delay": "0.08s" } as React.CSSProperties} className="mt-8 grid auto-rows-[13rem] grid-cols-2 gap-3 md:auto-rows-[15rem] md:grid-cols-4">
          {shown.map((moment) => (
            <li key={moment.id} className={moment.feature ? "col-span-2" : undefined}>
              <button
                type="button"
                onClick={() => {
                  setOpen(moment.id);
                  setWatching(false);
                }}
                className="group relative h-full w-full overflow-hidden rounded-sm border border-[var(--rule)] text-left transition hover:border-[var(--gold)]"
              >
                <Thumb moment={moment} />
                <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,6,12,.92),transparent_58%)]" />

                {playableId(moment) && (
                  <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-[var(--paper)]/60 bg-[rgba(4,6,12,.5)] text-[var(--paper)] backdrop-blur-sm transition group-hover:border-[var(--gold)] group-hover:text-[var(--gold)]">
                    <PlayGlyph className="ml-0.5 h-3.5 w-3.5" />
                  </span>
                )}

                <span className="absolute inset-x-3 bottom-3">
                  <span className="display block text-lg leading-tight">{moment.title}</span>
                  <span className="mt-0.5 block text-[10px] leading-tight text-[var(--paper-40)]">
                    {moment.context}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showing && (
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
        </div>
      )}
    </section>
  );
}
