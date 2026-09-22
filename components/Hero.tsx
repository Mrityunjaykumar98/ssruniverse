import { Photo } from "@/components/Photo";

/* Deterministic field so server and client markup agree. */
const stars = Array.from({ length: 70 }, (_, i) => ({
  left: `${(i * 37.6) % 100}%`,
  top: `${(i * 61.3) % 100}%`,
  scale: 0.5 + ((i * 7) % 10) / 10,
  dur: `${3 + (i % 5)}s`,
  delay: `${(i % 11) / 4}s`,
}));

/**
 * Rendered on the server: the entrance motion is CSS, so the hero reads
 * correctly before hydration and for anyone without JS.
 */
export function Hero() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-[var(--ink)]">
      {/* Night sky: a real deep-space plate, dimmed and pushed to the right
          so the left column stays dark enough to carry the type. The CSS
          stars sit on top to give the still image a little life. */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <Photo
          slug="cosmos"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-[62%_45%] opacity-[.6] contrast-[1.2]"
        />
        {/* Deepen the left edge behind the headline. */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,#04060c_14%,rgba(6,9,18,.82)_38%,rgba(8,12,24,.35)_70%,rgba(4,6,12,.6)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_40%,transparent_20%,rgba(4,6,12,.72)_85%)]" />
        {stars.map((s, i) => (
          <i
            key={i}
            className="star"
            style={
              {
                left: s.left,
                top: s.top,
                scale: s.scale,
                "--dur": s.dur,
                "--delay": s.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Portrait, bled into the sky from the right and graded to the
          night palette so it sits inside the scene rather than on top of it. */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-full opacity-40 md:w-[56%] md:opacity-100 lg:w-[50%]"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,.5) 26%, #000 62%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,.5) 26%, #000 62%)",
        }}
      >
        <div className="relative h-full w-full">
          <Photo
            slug="dreamer"
            alt="Sushant Singh Rajput at the International Film Festival of India, 2017"
            fill
            preload
            sizes="(max-width: 768px) 100vw, 55vw"
            className="scale-[1.18] object-cover object-[48%_10%] contrast-[1.05] saturate-[.72]"
          />
          {/* Cool the frame toward the sky, then sink its edges into the page. */}
          <div className="absolute inset-0 bg-[#0d1b33] mix-blend-color opacity-70" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,#04060c_0%,rgba(4,6,12,.72)_30%,transparent_62%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--ink)_1%,transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_35%,rgba(4,6,12,.75)_100%)]" />
        </div>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[var(--shell)] flex-col justify-center px-5 pb-24 pt-32 md:px-8">
        <div className="max-w-2xl">
          <p
            className="rise display text-xl italic leading-snug text-[var(--paper-70)] md:text-2xl"
            style={{ "--delay": "0.1s" } as React.CSSProperties}
          >
            Some souls don&rsquo;t just live,
            <br />
            they inspire generations.
          </p>

          <h1
            className="rise display mt-7 text-[clamp(2.9rem,7.5vw,6.2rem)] font-light leading-[.95] tracking-[.1em] [text-shadow:0_2px_30px_rgba(4,6,12,.9)]"
            style={{ "--delay": "0.25s" } as React.CSSProperties}
          >
            SUSHANT SINGH
            <br />
            RAJPUT
          </h1>

          <p
            className="rise mt-7 text-[11px] tracking-[.28em] text-[var(--paper-55)]"
            style={{ "--delay": "0.4s" } as React.CSSProperties}
          >
            21 JAN 1986 &nbsp;&mdash;&nbsp; 14 JUN 2020
          </p>

          <p
            className="rise script mt-6 text-4xl text-[var(--gold)] md:text-5xl"
            style={{ "--delay": "0.55s" } as React.CSSProperties}
          >
            Keep looking up.
          </p>

          <a
            href="#actor"
            aria-label="Scroll to explore"
            className="rise mt-10 grid h-12 w-12 place-items-center rounded-full border border-[var(--gold)] text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--ink)]"
            style={{ "--delay": "0.7s" } as React.CSSProperties}
          >
            <span className="nudge" aria-hidden>
              ↓
            </span>
          </a>
        </div>

        {/* Margin quote — steps aside below xl. The wrapper owns the
            centering transform, since .rise resets transform when it lands. */}
        <div className="absolute bottom-20 right-8 hidden w-60 xl:block">
        <figure
          className="rise rounded-sm bg-[rgba(4,6,12,.42)] p-4 backdrop-blur-[2px]"
          style={{ "--delay": "0.85s" } as React.CSSProperties}
        >
          <blockquote className="display text-lg italic leading-relaxed text-[var(--paper)] [text-shadow:0_2px_18px_rgba(4,6,12,.95)]">
            &ldquo;The sky is not the limit, it&rsquo;s just the beginning.&rdquo;
          </blockquote>
          <figcaption className="mt-3 text-[10px] tracking-[.16em] text-[var(--paper-55)]">
            &mdash; SUSHANT SINGH RAJPUT
          </figcaption>
        </figure>
        </div>
      </div>
    </section>
  );
}
