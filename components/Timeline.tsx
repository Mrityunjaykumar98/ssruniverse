import Image from "next/image";
import { films, filmLink, tmdbImage } from "@/data/films";
import { timeline } from "@/data/timeline";

/** The film an entry refers to, when it refers to one. */
function filmFor(title?: string) {
  return title ? films.find((f) => f.title === title) : undefined;
}

export function Timeline() {
  return (
    <section id="journey" className="section border-t border-[var(--rule)]">
      <div className="section-inner">
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow rule-lead">A journey</p>
          <h2 className="display section-title">THE JOURNEY</h2>
          <p className="display mt-2 text-2xl italic text-[var(--paper-70)]">
            Patna to Dil Bechara, in eleven steps.
          </p>
        </div>

        {/* Vertical, where everything else on the page runs horizontally — the
            page needed a change of axis, and a life reads better as a descent
            than as a row. */}
        <ol className="relative mt-16">
          {/* The spine the entries hang from. */}
          <li
            aria-hidden
            className="absolute bottom-0 left-[7px] top-0 w-px bg-[linear-gradient(180deg,transparent,var(--gold-dim)_4%,var(--gold-dim)_94%,transparent)] md:left-1/2 md:-translate-x-1/2"
          />

          {timeline.map((item, i) => {
            const film = filmFor(item.film);
            // Alternate sides from the spine on wide screens.
            const right = i % 2 === 1;

            return (
              <li
                key={item.year + item.title}
                className="relative pb-12 pl-10 last:pb-0 md:pb-16 md:pl-0"
                data-reveal={right ? "right" : "left"}
              >
                {/* Marker on the spine. */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 grid h-3.5 w-3.5 place-items-center md:left-1/2 md:-translate-x-1/2"
                >
                  <span className="absolute h-3.5 w-3.5 rounded-full bg-[var(--gold)]/25" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--gold)] ring-4 ring-[var(--ink)]" />
                </span>

                {/* Static class strings on both branches: Tailwind only sees
                    literals, so a template-built class name compiles to nothing. */}
                <div className="md:grid md:grid-cols-2 md:gap-14">
                  <div
                    className={
                      right
                        ? "md:col-start-2 md:pl-4"
                        : "md:col-start-1 md:row-start-1 md:pr-4 md:text-right"
                    }
                  >
                    <p className="text-[11px] font-bold tracking-[.2em] text-[var(--gold)]">
                      {item.year}
                    </p>
                    <h3 className="display mt-2 text-3xl leading-tight md:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--paper-55)] md:inline-block">
                      {item.note}
                    </p>

                    {film && (
                      <a
                        href={filmLink(film)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group mt-5 flex items-center gap-4 ${
                          right ? "" : "md:flex-row-reverse"
                        }`}
                      >
                        <span className="relative block h-28 w-[4.7rem] shrink-0 overflow-hidden rounded-sm border border-[var(--rule-strong)] shadow-[0_14px_36px_rgba(0,0,0,.7)] transition duration-500 group-hover:-translate-y-1 group-hover:border-[var(--gold)]">
                          {film.posterPath && (
                            <Image
                              src={tmdbImage(film.posterPath, "w342")}
                              alt=""
                              fill
                              sizes="110px"
                              className="object-cover"
                            />
                          )}
                        </span>
                        <span className="text-[10px] tracking-[.16em] text-[var(--paper-40)] transition group-hover:text-[var(--gold)]">
                          {film.title.toUpperCase()}
                          <span className="mt-1 block">ON IMDB &rarr;</span>
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
