import Image from "next/image";
import { films, tmdbImage } from "@/data/films";

/** Deal the filmography into columns, round-robin so no column is all one era. */
const COLUMNS = 3;
const columns = Array.from({ length: COLUMNS }, (_, c) =>
  films.filter((_, i) => i % COLUMNS === c),
);

/**
 * A wall of every poster he appeared on, drifting slowly in alternating
 * directions. Purely decorative — the filmography itself is the rail beside
 * it — so the whole thing is hidden from assistive technology and the posters
 * are graded down to sit behind the type rather than compete with it.
 */
export function PosterWall() {
  return (
    <div
      aria-hidden
      className="relative aspect-[3/4] overflow-hidden rounded-sm border border-[var(--rule)] bg-[var(--ink)]"
    >
      <div className="absolute inset-0 flex gap-2 p-2">
        {columns.map((column, c) => (
          <div key={c} className="relative flex-1 overflow-hidden">
            <div
              className={`flex flex-col gap-2 ${c % 2 === 0 ? "drift-up" : "drift-down"}`}
              style={{ ["--dur" as string]: `${64 + c * 13}s` }}
            >
              {/* Twice through, so the halfway translate loops without a seam. */}
              {[...column, ...column].map((film, i) => (
                <div
                  key={`${film.tmdbId}-${i}`}
                  className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-[2px]"
                >
                  {film.posterPath ? (
                    <Image
                      src={tmdbImage(film.posterPath, "w342")}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 33vw, 12vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-[var(--card)] px-1 text-center">
                      <span className="display text-[11px] leading-tight">{film.title}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Grade the wall into the page: cool it, darken the edges, and fade the
          top and bottom so the drifting columns have no hard cut. */}
      <div className="absolute inset-0 bg-[#0d1b33] opacity-30 mix-blend-color" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_25%,rgba(4,6,12,.6)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--ink)_0%,transparent_18%,transparent_78%,var(--ink)_100%)]" />
    </div>
  );
}
