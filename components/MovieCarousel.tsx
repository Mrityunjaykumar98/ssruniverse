import { FilmConstellation } from "@/components/FilmConstellation";
import { films } from "@/data/films";

export function MovieCarousel() {
  const span = `${films[0].year}–${films[films.length - 1].year}`;

  return (
    <section id="actor" className="section">
      {/* Full width rather than the split every other section uses: the sky
          needs the room, and the page needs a change of shape. */}
      <div className="section-inner">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-end md:gap-12" data-reveal>
          <div>
            <p className="eyebrow rule-lead">Filmography</p>
            <h2 className="display section-title">THE ACTOR</h2>
          </div>
          <p className="display max-w-md pb-3 text-xl italic leading-snug text-[var(--paper-70)]">
            Eleven films in seven years<span className="hidden md:inline">, on a reel you can turn</span>.
          </p>
        </div>

        <div
          className="mt-4 flex flex-wrap items-baseline gap-x-8 gap-y-2 text-[10px] tracking-[.18em] text-[var(--paper-40)]"
          data-reveal
          style={{ "--delay": "0.06s" } as React.CSSProperties}
        >
          <span>{films.length} FILMS</span>
          <span>{span}</span>
          <span className="hidden md:inline">DRAG, OR USE THE ARROWS &middot; CLICK THE FRONT FILM FOR IMDB</span>
        </div>

        <div className="mt-10" data-reveal style={{ "--delay": "0.12s" } as React.CSSProperties}>
          <FilmConstellation />
        </div>
      </div>
    </section>
  );
}
