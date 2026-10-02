/**
 * The only full-length works of his that are published on YouTube by their
 * own rights holders. Every one was checked three ways: the channel reported
 * by oEmbed is the rights holder's own, the running time is the full work,
 * and the embed actually plays inside a frame.
 *
 * Everything else turned up by a "full movie" search was a re-upload — fan
 * accounts and movie-aggregator channels, several of them carrying a verified
 * badge, none of them the studio. Those are deliberately not here. Sonchiriya
 * was the closest call: a real distributor's channel, but one whose rights to
 * the film could not be confirmed, and the same upload title appears across
 * four channels.
 */
export type Screening = {
  youtubeId: string;
  title: string;
  year: string;
  kind: "Feature film" | "Television";
  runtime: string;
  /** The channel it is published on, and why that channel is the right one. */
  source: string;
  rights: string;
  note: string;
  /** Matches data/films.ts, so the programme can show the poster. */
  film?: string;
};

export const screenings: Screening[] = [
  {
    youtubeId: "wRKh0-BoyTA",
    title: "Raabta",
    year: "2017",
    kind: "Feature film",
    runtime: "2h 24m",
    source: "T-Series",
    rights: "T-Series co-produced the film and publishes it on its own channel.",
    note: "Two lovers, two lifetimes eight hundred years apart. He plays Shiv in one and Jilaan in the other.",
    film: "Raabta",
  },
  {
    youtubeId: "alBvlAY-hrM",
    title: "Pavitra Rishta — Episode 1",
    year: "2009",
    kind: "Television",
    runtime: "34m",
    source: "Zee Family Tales",
    rights: "Zee produced and broadcast the series, and publishes it on its own channel.",
    note: "The first episode of the show that made him a household name, as Manav Deshmukh.",
  },
];
