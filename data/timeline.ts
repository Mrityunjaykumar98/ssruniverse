/**
 * Milestones in order. `film` matches a title in data/films.ts, so the entry
 * can carry that film's poster without duplicating the artwork path here.
 */
export type Milestone = {
  year: string;
  title: string;
  note: string;
  film?: string;
};

export const timeline: Milestone[] = [
  {
    year: "1986",
    title: "Born",
    note: "21 January, in Patna. The youngest of five, and the only boy.",
  },
  {
    year: "2003",
    title: "Engineering",
    note: "Mechanical, at Delhi College of Engineering. He had placed in the national physics olympiad to get there.",
  },
  {
    year: "2005",
    title: "Dance",
    note: "Training under Shiamak Davar, and dancing at the Filmfare Awards and the Commonwealth Games opening.",
  },
  {
    year: "2008",
    title: "Television",
    note: "Kis Desh Mein Hai Meraa Dil. He left engineering unfinished to take it.",
  },
  {
    year: "2009",
    title: "Pavitra Rishta",
    note: "Three years as Manav, and the role that made him a name in every household in the country.",
  },
  {
    year: "2013",
    title: "Kai Po Che!",
    note: "His first film. Three friends, a kite festival, and an ending nobody was ready for.",
    film: "Kai Po Che!",
  },
  {
    year: "2014",
    title: "PK",
    note: "As Sarfaraz, opposite Aamir Khan, in the highest-grossing Indian film of its year.",
    film: "PK",
  },
  {
    year: "2016",
    title: "M.S. Dhoni",
    note: "He trained for months to bat like Dhoni. The helicopter shot is his own.",
    film: "M.S. Dhoni: The Untold Story",
  },
  {
    year: "2018",
    title: "Kedarnath",
    note: "As Mansoor, a porter in the Himalayas, in a love story set against the 2013 floods.",
    film: "Kedarnath",
  },
  {
    year: "2019",
    title: "Three in one year",
    note: "Sonchiriya, Chhichhore and Drive. Chhichhore took the National Award for Best Popular Film.",
    film: "Chhichhore",
  },
  {
    year: "2020",
    title: "Dil Bechara",
    note: "His last film, released after his death. It is the story of someone who knows their time is short.",
    film: "Dil Bechara",
  },
];
