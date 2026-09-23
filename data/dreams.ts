import type { IconName } from "@/components/Icons";

/**
 * The themes he returned to, each with him talking about it rather than a
 * description written for him. Every id was confirmed through YouTube's
 * oEmbed endpoint; the dance clip is from Shiamak Davar's own channel.
 */
export type Dream = {
  number: string;
  icon: IconName;
  title: string;
  /** A line in his own register, not a claim about him. */
  text: string;
  youtubeId: string;
  source: string;
  /** What the clip is, so the row says what it will play. */
  clipTitle: string;
};

/** Opens the section: the closest thing to a summary of how he thought. */
export const featured = {
  youtubeId: "tcz07ZnWIDM",
  source: "Brut India",
  title: "The understated wisdom of Sushant Singh Rajput",
  blurb:
    "He talked about physics the way other people talk about music, and about wonder as though it were a discipline. Here he is, in his own words.",
};

export const dreams: Dream[] = [
  {
    number: "01",
    icon: "telescope",
    title: "Space & Astronomy",
    text: "He kept a telescope, and he talked about the night sky the way other people talk about home.",
    youtubeId: "KZQNXb2t5CM",
    source: "BiscootTV",
    clipTitle: "Explaining the Moon, Jupiter and the universe",
  },
  {
    number: "02",
    icon: "atom",
    title: "Science & Physics",
    text: "An engineering student before he was an actor, and a national physics olympiad winner before that.",
    youtubeId: "ZadX2J_gyvU",
    source: "Film Companion",
    clipTitle: "Explaining his own tweets, most of which were physics",
  },
  {
    number: "03",
    icon: "book",
    title: "Books & Reading",
    text: "He read constantly and across everything, and he recommended freely to anyone who asked.",
    youtubeId: "7y98M4VkWZA",
    source: "Fun Facts",
    clipTitle: "On Newton's second law, and the book he kept going back to",
  },
  {
    number: "04",
    icon: "code",
    title: "Coding & Technology",
    text: "The problem-solving never left him. He stayed curious about how things were built.",
    youtubeId: "LxWirZt1v4c",
    source: "NotchUp India",
    clipTitle: "On why he thought every child should learn to code",
  },
  {
    number: "05",
    icon: "dance",
    title: "Dance",
    text: "Trained with Shiamak Davar, and it showed in the way he moved on screen.",
    youtubeId: "KuhsaD-tzAM",
    source: "Shiamak TV",
    clipTitle: "Dancing, on Shiamak Davar's own channel",
  },
  {
    number: "06",
    icon: "heart",
    title: "Things he wanted to learn",
    text: "He kept a list of fifty dreams. Flying a plane, teaching children, learning to send a rocket up.",
    youtubeId: "iSixCL0Opx4",
    source: "BBC News Hindi",
    clipTitle: "The fifty dreams, and the ones left unfinished",
  },
];
