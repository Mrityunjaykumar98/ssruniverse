import type { CreditSlug } from "@/data/credits";

/**
 * Captions describe only what the source file on Wikimedia Commons states —
 * the event, the film, the people present. Nothing is inferred about what he
 * was thinking or feeling.
 *
 * `clip` is footage of the same occasion, embedded from the uploader's
 * channel. Its label describes the video rather than the photograph, because
 * the two are not always the same moment: the Raabta still is from Kolkata
 * while the clip is from the promotional tour generally. Two cards carry no
 * clip at all, since nothing could be found that was both relevant and
 * appropriate for a memorial.
 */
export type Memory = {
  slug: CreditSlug;
  caption: string;
  context: string;
  clip?: {
    youtubeId: string;
    /** What the video shows, in its own words. */
    label: string;
    /** The channel it is embedded from. */
    source: string;
  };
  /** Wider tiles carry the stronger frames. */
  wide?: boolean;
};

export const memories: Memory[] = [
  {
    slug: "filmfare-2016",
    caption: "That smile",
    context: "Filmfare Style Awards, 2016",
    clip: {
      youtubeId: "u-9CiOcnnwY",
      label: "On the carpet at the Filmfare Glamour & Style Awards, 2016",
      source: "Bollywood Life",
    },
  },
  {
    slug: "kai-po-che-premiere",
    caption: "Where it began",
    context: "With Ankita Lokhande at the Kai Po Che! premiere, 2013",
    clip: {
      youtubeId: "o3dbI2CgzAA",
      label: "Arriving at the Kai Po Che! premiere with Ankita Lokhande",
      source: "SEPL Video",
    },
  },
  {
    slug: "wift",
    caption: "Off camera",
    context: "WIFT felicitation",
  },
  {
    slug: "masterclass",
    caption: "Still learning",
    context: "With Shekhar Kapur at a master class, IFFI Goa, 2017",
    clip: {
      youtubeId: "C_eSla-emEM",
      label: "The master class with Shekhar Kapur, IFFI 2017",
      source: "Bharti Dubey",
    },
  },
  {
    slug: "raabta",
    caption: "On the road",
    context: "Promoting Raabta with Kriti Sanon, Kolkata, 2017",
    clip: {
      youtubeId: "buDuqadHwL0",
      label: "On the Raabta promotional tour with Kriti Sanon",
      source: "MH One News",
    },
    wide: true,
  },
  {
    slug: "dhoni-promo",
    caption: "Between takes",
    context: "Promoting M.S. Dhoni: The Untold Story, 2016",
    clip: {
      youtubeId: "AA8taRsyR8g",
      label: "The M.S. Dhoni trailer launch, uncut",
      source: "Movie Talkies",
    },
  },
  {
    slug: "kedarnath",
    caption: "Kedarnath",
    context: "With Sara Ali Khan, 2018",
    clip: {
      youtubeId: "CYYGqvqW_Sc",
      label: "The Kedarnath trailer launch with Sara Ali Khan",
      source: "Bollywood Hungama",
    },
  },
  {
    slug: "kai-po-che",
    caption: "Kai Po Che!",
    context: "At the premiere, 2013",
    clip: {
      youtubeId: "G19faYsLtlc",
      label: "The Kai Po Che! official trailer — his first film",
      source: "Firecracker Productions",
    },
  },
  {
    slug: "kangna-bash",
    caption: "Among friends",
    context: "At a birthday celebration",
  },
  {
    slug: "hero-portrait",
    caption: "IIFA",
    context: "Green carpet, 2017",
    clip: {
      youtubeId: "eB_fGMuSteI",
      label: "His journey with IIFA",
      source: "IIFA Awards",
    },
  },
];
