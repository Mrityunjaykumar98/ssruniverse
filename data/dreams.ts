import type { IconName } from "@/components/Icons";

/**
 * The themes he returned to in interviews. Written as the subjects that drew
 * him rather than as claims about particular events, so nothing here asserts
 * more than is on the record.
 */
export type Dream = {
  number: string;
  icon: IconName;
  title: string;
  text: string;
};

export const dreams: Dream[] = [
  {
    number: "01",
    icon: "telescope",
    title: "Space & Astronomy",
    text: "He kept a telescope, and he talked about the night sky the way other people talk about home.",
  },
  {
    number: "02",
    icon: "atom",
    title: "Science & Physics",
    text: "An engineering student before he was an actor, and a national physics olympiad winner before that.",
  },
  {
    number: "03",
    icon: "book",
    title: "Books & Reading",
    text: "He read constantly and across everything, and he recommended freely to anyone who asked.",
  },
  {
    number: "04",
    icon: "code",
    title: "Coding & Technology",
    text: "The problem-solving never left him. He stayed curious about how things were built.",
  },
  {
    number: "05",
    icon: "dance",
    title: "Dance",
    text: "Trained with Shiamak Davar and Ashley Lobo, and it showed in the way he moved on screen.",
  },
  {
    number: "06",
    icon: "heart",
    title: "Things he wanted to learn",
    text: "He kept a list of dreams to chase. Flying, travelling, learning — always one more thing.",
  },
];
