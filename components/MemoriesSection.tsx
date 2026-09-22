"use client";

import { useCallback, useEffect, useState } from "react";
import { Photo, PhotoCredit } from "@/components/Photo";
import { memories } from "@/data/memories";

export function MemoriesSection() {
  const [open, setOpen] = useState<number | null>(null);
  /* The clip mounts only when asked for, so opening a photo never starts a
     video or contacts YouTube. */
  const [watching, setWatching] = useState(false);
  const showing = open === null ? null : memories[open];

  const step = useCallback((delta: number) => {
    setWatching(false);
    setOpen((current) =>
      current === null ? null : (current + delta + memories.length) % memories.length,
    );
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    setWatching(false);
  }, []);

  /* Arrow keys move through the gallery, Escape closes it. */
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    // Stop the page scrolling behind the lightbox.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, step, close]);

  return (
    <section id="memories" className="section">
      <div className="section-inner">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow rule-lead">03 / Fragments</p>
            <h2 className="display section-title">THE MEMORIES</h2>
            <p className="display mt-2 text-2xl italic text-[var(--paper-70)]">
              The Sushant we loved.
            </p>
            <p className="section-copy mt-5">
              The infectious smile, the candid moments, the glimpses between takes.
              Open any frame for its full credit &mdash; and where footage of the
              occasion exists, you can watch it too.
            </p>
          </div>
          <p className="script text-3xl text-[var(--gold)] md:text-4xl">
            That smile &hearts;
          </p>
        </div>

        <ul className="mt-12 grid auto-rows-[13rem] grid-cols-2 gap-3 md:auto-rows-[15rem] md:grid-cols-4">
          {memories.map((memory, i) => (
            <li key={memory.slug} className={memory.wide ? "col-span-2" : undefined}>
              <button
                type="button"
                onClick={() => {
                  setOpen(i);
                  setWatching(false);
                }}
                className="group relative h-full w-full overflow-hidden rounded-sm border border-[var(--rule)] text-left transition hover:border-[var(--gold)]"
              >
                <Photo
                  slug={memory.slug}
                  alt={memory.context}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-[50%_22%] saturate-[.75] transition duration-700 group-hover:scale-[1.06] group-hover:saturate-100"
                />
                <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,6,12,.9),transparent_55%)]" />

                {memory.clip && (
                  <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-[var(--paper)]/60 bg-[rgba(4,6,12,.5)] text-[var(--paper)] backdrop-blur-sm transition group-hover:border-[var(--gold)] group-hover:text-[var(--gold)]">
                    <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5" fill="currentColor" aria-hidden>
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                  </span>
                )}

                <span className="absolute inset-x-3 bottom-3">
                  <span className="display block text-lg leading-tight">{memory.caption}</span>
                  <span className="mt-0.5 block text-[10px] leading-tight text-[var(--paper-40)]">
                    {memory.context}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Lightbox */}
      {showing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={showing.context}
          className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(3,5,10,.94)] p-4 backdrop-blur-sm"
          onClick={close}
        >
          <figure
            className="m-0 w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {watching && showing.clip ? (
              <div className="aspect-video w-full overflow-hidden rounded-sm bg-black">
                <iframe
                  key={showing.clip.youtubeId}
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${showing.clip.youtubeId}?autoplay=1&rel=0`}
                  title={showing.clip.label}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative mx-auto w-fit">
                <Photo
                  slug={showing.slug}
                  alt={showing.context}
                  className="max-h-[68vh] w-auto rounded-sm object-contain"
                />
                {showing.clip && (
                  <button
                    type="button"
                    onClick={() => setWatching(true)}
                    className="absolute inset-0 grid place-items-center"
                  >
                    <span className="sr-only">Watch: {showing.clip.label}</span>
                    <span className="grid h-16 w-16 place-items-center rounded-full border border-[var(--paper)]/70 bg-[rgba(4,6,12,.45)] text-[var(--paper)] backdrop-blur-sm transition hover:scale-105 hover:border-[var(--gold)] hover:text-[var(--gold)]">
                      <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor" aria-hidden>
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                    </span>
                  </button>
                )}
              </div>
            )}

            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <span className="min-w-0">
                <span className="display block text-xl">{showing.caption}</span>
                <span className="mt-1 block text-xs text-[var(--paper-55)]">
                  {showing.context}
                </span>
                {showing.clip && (
                  <span className="mt-2 block text-[11px] text-[var(--paper-40)]">
                    {watching ? "Now playing" : "Footage"}: {showing.clip.label}
                    {" · "}
                    <span className="text-[var(--gold)]/70">{showing.clip.source}</span>
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[var(--paper-40)]">
                <PhotoCredit slug={showing.slug} />
              </span>
            </figcaption>

            {showing.clip && (
              <p className="mt-3 text-[10px] leading-4 text-[var(--paper-40)]">
                Video is embedded from the uploader&rsquo;s channel via YouTube&rsquo;s
                privacy-enhanced player. Copyright remains with its owner.
              </p>
            )}
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
                aria-label={`${label} photograph`}
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
