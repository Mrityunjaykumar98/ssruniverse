import { FilmRail } from "@/components/FilmRail";
import { PosterWall } from "@/components/PosterWall";

export function MovieCarousel() {
  return (
    <section id="actor" className="section">
      <div className="section-inner grid items-start gap-10 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] lg:gap-14">
        <PosterWall />

        <div>
          <p className="eyebrow rule-lead">01 / Filmography</p>
          <h2 className="display section-title">THE ACTOR</h2>
          <p className="display mt-2 text-2xl italic text-[var(--paper-70)]">
            Stories he left behind.
          </p>
          <p className="section-copy mt-5">
            From <em>Kai Po Che!</em> to <em>Dil Bechara</em>, he brought a restless,
            unguarded honesty to every part he played. Eleven films in seven years.
          </p>

          <div className="mt-10">
            <FilmRail />
          </div>
        </div>
      </div>
    </section>
  );
}
