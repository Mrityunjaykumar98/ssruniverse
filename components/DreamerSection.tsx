"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { dreams, featured } from "@/data/dreams";

const thumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

export function DreamerSection() {
  /* One row open at a time; nothing plays until a row is opened. */
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [featurePlaying, setFeaturePlaying] = useState(false);

  return (
    <section id="dreamer" className="section relative overflow-hidden bg-[var(--navy)]">
      {/* The same deep-space plate as the hero, held back so the section
          reads as a continuation of it rather than a repeat. */}
      <div aria-hidden className="absolute inset-0">
        <Photo slug="cosmos" alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--ink),rgba(11,16,32,.84)_38%,var(--ink))]" />
      </div>

      <div className="section-inner relative">
        <div data-reveal>
          <p className="eyebrow rule-lead">04 / Beyond the frame</p>
          <h2 className="display section-title">THE DREAMER</h2>
          <p className="display mt-2 max-w-xl text-2xl italic leading-snug text-[var(--paper-70)]">
            He wasn&rsquo;t just an actor. He was a curious soul.
          </p>
        </div>

        {/* Featured film, full width */}
        <div
          className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:items-center"
          data-reveal
          style={{ "--delay": "0.08s" } as React.CSSProperties}
        >
          <div className="group relative aspect-video overflow-hidden rounded-sm border border-[var(--rule)] bg-black">
            {featurePlaying ? (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${featured.youtubeId}?autoplay=1&rel=0`}
                title={featured.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setFeaturePlaying(true)}
                className="absolute inset-0"
              >
                <span className="sr-only">Play: {featured.title}</span>
                <Image
                  src={thumb(featured.youtubeId)}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover opacity-70 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-90"
                />
                <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,6,12,.9),transparent_62%)]" />
                <span className="sheen absolute inset-0" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full border border-[var(--gold)]/70 bg-[rgba(4,6,12,.4)] text-[var(--gold)] backdrop-blur-sm transition duration-500 group-hover:scale-110 group-hover:bg-[var(--gold)] group-hover:text-[var(--ink)]">
                    <PlayGlyph className="ml-1 h-8 w-8" />
                  </span>
                </span>
              </button>
            )}
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[.18em] text-[var(--gold)]">
              IN HIS OWN WORDS
            </p>
            <h3 className="display mt-3 text-3xl leading-tight">{featured.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--paper-55)]">
              {featured.blurb}
            </p>
            <p className="mt-4 text-[10px] tracking-[.14em] text-[var(--paper-40)]">
              {featured.source.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Themes — each opens in place to play him talking about it. */}
        <ul className="mt-14 border-t border-[var(--rule)]">
          {dreams.map((dream, i) => {
            const open = openRow === dream.number;
            return (
              <li
                key={dream.number}
                className="border-b border-[var(--rule)]"
                data-reveal
                style={{ "--delay": `${0.05 * i}s` } as React.CSSProperties}
              >
                <button
                  type="button"
                  onClick={() => setOpenRow(open ? null : dream.number)}
                  aria-expanded={open}
                  className="group flex w-full items-center gap-5 py-6 text-left transition"
                >
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border transition duration-500 ${
                      open
                        ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--gold)]"
                        : "border-[var(--gold)]/40 text-[var(--gold)] group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)]/10"
                    }`}
                  >
                    <Icon name={dream.icon} className="h-5 w-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-3">
                      <span className="text-[10px] tracking-[.16em] text-[var(--gold)]/60">
                        {dream.number}
                      </span>
                      <span
                        className={`display text-2xl leading-tight transition-colors duration-300 md:text-3xl ${
                          open ? "text-[var(--gold)]" : "group-hover:text-[var(--gold)]"
                        }`}
                      >
                        {dream.title}
                      </span>
                    </span>
                    <span className="mt-1.5 block max-w-2xl text-sm leading-relaxed text-[var(--paper-55)]">
                      {dream.text}
                    </span>
                  </span>

                  <span className="hidden shrink-0 items-center gap-2 text-[10px] tracking-[.14em] text-[var(--paper-40)] sm:flex">
                    {open ? "CLOSE" : "WATCH"}
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full border border-[var(--rule-strong)] transition duration-500 ${
                        open ? "rotate-45 border-[var(--gold)] text-[var(--gold)]" : "group-hover:border-[var(--gold)] group-hover:text-[var(--gold)]"
                      }`}
                      aria-hidden
                    >
                      {open ? "×" : <PlayGlyph className="ml-0.5 h-3 w-3" />}
                    </span>
                  </span>
                </button>

                <div className="drawer" {...(open ? { "data-open": "" } : {})}>
                  <div>
                    <div className="grid gap-5 pb-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end">
                      <div className="aspect-video overflow-hidden rounded-sm border border-[var(--rule)] bg-black">
                        {/* Mount the player only while the row is open, so
                            closing it actually stops playback. */}
                        {open && (
                          <iframe
                            className="h-full w-full"
                            src={`https://www.youtube-nocookie.com/embed/${dream.youtubeId}?autoplay=1&rel=0`}
                            title={dream.clipTitle}
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--paper-55)]">
                        {dream.clipTitle}
                        <span className="mt-2 block text-[10px] tracking-[.14em] text-[var(--paper-40)]">
                          {dream.source.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
