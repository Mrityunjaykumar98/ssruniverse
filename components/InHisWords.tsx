import { Fragment } from "react";

/**
 * His own words, set at the scale of a heading rather than buried in body
 * copy, between the sections they belong to.
 *
 * Only quotations that have been sourced go here. Each part may be marked for
 * emphasis, which sets it in gold italic — the type carries the stress the way
 * a voice would. Words arrive one at a time as the band scrolls in.
 */
export type QuotePart = { text: string; em?: boolean };

export function InHisWords({
  parts,
  source,
  tone = "gold",
}: {
  parts: QuotePart[];
  /** Where and when he said it. */
  source: string;
  /** A section-specific accent, so neighbouring bands are not identical. */
  tone?: "gold" | "cool";
}) {
  // Flatten to words, keeping each word's emphasis, so they can be staggered
  // individually while emphasis still spans whole phrases.
  let i = 0;
  const words = parts.flatMap((part) =>
    part.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, em: part.em, n: i++ })),
  );

  const accent = tone === "gold" ? "text-[var(--gold)]" : "text-[#b9cdf2]";
  const glow =
    tone === "gold"
      ? "bg-[radial-gradient(ellipse_at_30%_50%,rgba(201,166,100,.09),transparent_60%)]"
      : "bg-[radial-gradient(ellipse_at_70%_50%,rgba(120,150,220,.1),transparent_60%)]";

  return (
    <section aria-label="In his words" className="relative overflow-hidden px-5 py-16 md:px-8 md:py-20">
      <div aria-hidden className={`absolute inset-0 ${glow}`} />

      <figure className="relative mx-auto max-w-5xl">
        {/* An oversized opening mark, set as an object rather than punctuation. */}
        <span
          aria-hidden
          className={`display pointer-events-none absolute -left-3 -top-20 select-none text-[12rem] leading-none opacity-[.14] md:-left-16 md:-top-32 md:text-[18rem] ${accent}`}
        >
          &ldquo;
        </span>

        <blockquote
          className="display relative text-[clamp(2rem,5vw,4.4rem)] font-light leading-[1.12] tracking-[-.02em]"
          data-reveal="words"
        >
          <p className="words">
            {words.map(({ word, em, n }) => (
              // The space sits between the spans, not inside them: trailing
              // whitespace inside an inline-block is stripped, which ran every
              // word into the next.
              <Fragment key={n}>
                <span
                  className={em ? `italic ${accent}` : undefined}
                  style={{ "--d": `${n * 0.06}s` } as React.CSSProperties}
                >
                  {word}
                </span>{" "}
              </Fragment>
            ))}
          </p>
        </blockquote>

        <figcaption
          className="mt-8 flex items-center gap-4 text-[11px] tracking-[.2em] text-[var(--paper-40)]"
          data-reveal
          style={{ "--delay": `${words.length * 0.06 + 0.2}s` } as React.CSSProperties}
        >
          <span aria-hidden className={`h-px w-10 ${tone === "gold" ? "bg-[var(--gold)]" : "bg-[#b9cdf2]"}`} />
          <span>SUSHANT SINGH RAJPUT &middot; {source.toUpperCase()}</span>
        </figcaption>
      </figure>
    </section>
  );
}
