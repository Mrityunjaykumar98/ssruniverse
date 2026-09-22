"use client";

import { useState } from "react";
import { Photo } from "@/components/Photo";
import { memories, type Memory } from "@/data/memories";

export function RandomMemory() {
  const [memory, setMemory] = useState<Memory | null>(null);

  const surprise = () => {
    setMemory((current) => {
      // Never hand back the one already on screen.
      const pool = current ? memories.filter((m) => m.slug !== current.slug) : memories;
      return pool[Math.floor(Math.random() * pool.length)];
    });
  };

  return (
    <section id="fans" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0">
        <Photo
          slug="cosmos"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--ink),rgba(6,9,18,.78)_45%,var(--ink))]" />
      </div>

      <div className="section-inner relative px-5 py-24 text-center md:py-28">
        <p className="eyebrow">06 / A little orbit</p>
        <h2 className="display mx-auto mt-4 max-w-2xl text-[clamp(2.2rem,5vw,3.6rem)] leading-tight">
          A memory, at random.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-[var(--paper-55)]">
          Feeling nostalgic? Pull a moment from his world.
        </p>

        <button
          type="button"
          onClick={surprise}
          className="mt-8 rounded-full bg-[var(--gold)] px-8 py-3.5 text-xs font-bold tracking-[.18em] text-[var(--ink)] transition hover:bg-[var(--gold-bright)]"
        >
          ✦ SURPRISE ME
        </button>

        {memory && (
          <figure className="rise mx-auto mt-12 grid max-w-3xl gap-6 text-left sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[var(--rule)]">
              <Photo
                slug={memory.slug}
                alt={memory.context}
                fill
                sizes="(max-width: 640px) 100vw, 14rem"
                className="object-cover"
              />
            </div>
            <figcaption>
              <p className="display text-3xl leading-tight">{memory.caption}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--paper-55)]">
                {memory.context}
              </p>
              <p className="script mt-5 text-2xl text-[var(--gold)]">
                Because every memory is a star in his universe &hearts;
              </p>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
