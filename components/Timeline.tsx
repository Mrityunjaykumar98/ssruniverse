import { timeline } from "@/data/timeline";

export function Timeline() {
  return (
    <section id="journey" className="section border-t border-[var(--rule)]">
      <div className="section-inner" data-reveal>
        <p className="eyebrow rule-lead">05 / A journey</p>
        <h2 className="display section-title">THE JOURNEY</h2>
        <p className="display mt-2 text-2xl italic text-[var(--paper-70)]">
          A life of dreams, courage and purpose.
        </p>
      </div>

      {/* The rail bleeds past the shell so the line runs to the screen edge,
          with its own padding restoring the gutter at the ends. The spine
          draws itself and the markers pop in behind it as it passes. */}
      <div className="rail mt-14 overflow-x-auto pb-4" data-reveal>
        <ol className="relative mx-auto flex min-w-max gap-0 px-5 md:px-8">
          <li
            aria-hidden
            className="spine absolute left-5 right-5 top-[7px] h-px bg-[linear-gradient(90deg,transparent,var(--gold-dim)_6%,var(--gold-dim)_94%,transparent)] md:left-8 md:right-8"
          />
          {timeline.map((item, i) => (
            <li
              key={item.year + item.title}
              className="group relative w-44 shrink-0 pr-6"
              // Each marker lands just after the spine reaches it.
              style={{ "--dot-delay": `${0.25 + i * 0.1}s` } as React.CSSProperties}
            >
              <span className="relative block h-4">
                <span className="dot absolute left-0 top-[3px] h-2.5 w-2.5 rounded-full bg-[var(--gold)] ring-4 ring-[var(--ink)] transition-transform duration-500 group-hover:scale-150" />
              </span>
              <p className="mt-4 text-[11px] font-bold tracking-[.16em] text-[var(--gold)]">
                {item.year}
              </p>
              <p className="display mt-1.5 text-xl leading-tight transition-colors duration-300 group-hover:text-[var(--gold)]">
                {item.title}
              </p>
              <p className="mt-1.5 text-[11px] leading-snug text-[var(--paper-40)]">
                {item.note}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="section-inner mt-8">
        <p className="text-[10px] tracking-[.16em] text-[var(--paper-40)]">
          SCROLL THE TIMELINE &rarr;
        </p>
      </div>
    </section>
  );
}
