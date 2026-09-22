/** Milestones in order. `year` sits under the dot; `note` is the detail line. */
export type Milestone = {
  year: string;
  title: string;
  note: string;
};

export const timeline: Milestone[] = [
  { year: "1986", title: "Born", note: "21 January, Patna" },
  { year: "2003", title: "Engineering", note: "Mechanical, Delhi College of Engineering" },
  { year: "2005", title: "Dance", note: "Trained with Shiamak Davar" },
  { year: "2008", title: "Television", note: "Kis Desh Mein Hai Meraa Dil" },
  { year: "2009", title: "Pavitra Rishta", note: "The role that made him a household name" },
  { year: "2013", title: "Kai Po Che!", note: "Film debut, as Ishaan Bhatt" },
  { year: "2014", title: "PK", note: "as Sarfaraz Yousuf" },
  { year: "2015", title: "Byomkesh Bakshy", note: "Bengal's detective, reimagined" },
  { year: "2016", title: "M.S. Dhoni", note: "The Untold Story" },
  { year: "2018", title: "Kedarnath", note: "as Mansoor Khan" },
  { year: "2019", title: "Chhichhore", note: "and Sonchiriya, and Drive" },
  { year: "2020", title: "Dil Bechara", note: "His last film" },
];
