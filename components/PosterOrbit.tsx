import Image from "next/image";
import { Photo } from "@/components/Photo";
import { films, tmdbImage } from "@/data/films";

/**
 * His portrait at the centre, with every poster he appeared on orbiting
 * around and behind him.
 *
 * The ring is a real 3D carousel: each poster sits at rotateY(n) translateZ(r),
 * so perspective does the work and the far side of the orbit recedes properly.
 * The whole ring is tilted back on X, which turns the circle into an ellipse
 * and sends posters sweeping behind his head rather than straight across his
 * face. He is painted above the ring so he is never occluded.
 *
 * Decorative: the navigable filmography is the rail beside this, so the
 * composition is hidden from assistive technology and carries no links — a
 * moving target is a poor thing to ask anyone to click.
 */
export function PosterOrbit() {
  const step = 360 / films.length;

  return (
    <div
      aria-hidden
      className="relative aspect-[3/4] select-none overflow-hidden rounded-sm"
      style={
        {
          perspective: "1100px",
          // Scales with the viewport so the ring never collides with the
          // portrait on narrow screens.
          "--orbit-r": "clamp(118px, 21vw, 178px)",
          "--orbit-dur": "44s",
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(201,166,100,.14),transparent_52%)]" />

      {/* Ring */}
      <div className="absolute inset-0 grid place-items-center">
        <div style={{ transformStyle: "preserve-3d", transform: "rotateX(-15deg)" }}>
          <div
            className="orbit-ring relative grid place-items-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {films.map((film, i) => (
              <div
                key={film.tmdbId}
                className="absolute h-[6.6rem] w-[4.4rem] overflow-hidden rounded-[3px] border border-[var(--rule)] shadow-[0_14px_34px_rgba(0,0,0,.7)] sm:h-[7.8rem] sm:w-[5.2rem]"
                style={{
                  transform: `rotateY(${i * step}deg) translateZ(var(--orbit-r))`,
                  backfaceVisibility: "hidden",
                }}
              >
                {film.posterPath ? (
                  <Image
                    src={tmdbImage(film.posterPath, "w342")}
                    alt=""
                    fill
                    sizes="88px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-[var(--card)] px-1 text-center">
                    <span className="display text-[10px] leading-tight">{film.title}</span>
                  </div>
                )}
                {/* Knock the posters back so he stays the subject. */}
                <div className="absolute inset-0 bg-[#0d1b33] opacity-22 mix-blend-color" />
                <div className="absolute inset-0 bg-[rgba(4,6,12,.16)]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Him, painted over the ring so he is never covered. */}
      <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
        <div className="relative h-40 w-40 sm:h-48 sm:w-48">
          <div className="absolute -inset-5 rounded-full bg-[radial-gradient(circle,rgba(201,166,100,.3),transparent_66%)]" />
          <div className="relative h-full w-full overflow-hidden rounded-full border border-[var(--gold)]/50 shadow-[0_0_56px_rgba(201,166,100,.28)]">
            <Photo
              slug="hero-portrait"
              alt=""
              fill
              sizes="192px"
              className="scale-[1.34] object-cover object-[52%_15%] contrast-[1.06] saturate-[.72]"
            />
            <div className="absolute inset-0 bg-[#0d1b33] opacity-35 mix-blend-color" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_54%,rgba(4,6,12,.7)_100%)]" />
          </div>
        </div>
      </div>

      {/* Fade the orbit into the page at the edges. */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_50%_47%,transparent_56%,var(--ink)_94%)]" />
    </div>
  );
}
