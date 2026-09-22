import { FilmRail } from "@/components/FilmRail";
import { Photo } from "@/components/Photo";

export function MovieCarousel() {
  return (
    <section id="actor" className="section">
      <div className="section-inner grid items-start gap-10 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] lg:gap-14">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-[var(--rule)]">
          <Photo
            slug="actor"
            alt="Sushant Singh Rajput in 2017"
            fill
            sizes="(max-width: 1024px) 100vw, 30vw"
            className="scale-[1.15] object-cover object-[52%_16%] contrast-[1.08] saturate-[.65]"
          />
          {/* Same grade as the hero portrait, so the two read as one set. */}
          <div className="absolute inset-0 bg-[#0d1b33] opacity-60 mix-blend-color" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,6,12,.95),rgba(4,6,12,.25)_55%,rgba(4,6,12,.5))]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,transparent_30%,rgba(4,6,12,.7)_100%)]" />
        </div>

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
