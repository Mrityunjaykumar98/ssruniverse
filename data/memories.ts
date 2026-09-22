import type { CreditSlug } from "@/data/credits";

/**
 * Captions describe only what the source file on Wikimedia Commons states —
 * the event, the film, the people present. Nothing is inferred about what he
 * was thinking or feeling.
 */
export type Memory = {
  slug: CreditSlug;
  caption: string;
  context: string;
  /** Wider tiles carry the stronger frames. */
  wide?: boolean;
};

export const memories: Memory[] = [
  {
    slug: "filmfare-2016",
    caption: "That smile",
    context: "Filmfare Style Awards, 2016",
  },
  {
    slug: "kai-po-che-premiere",
    caption: "Where it began",
    context: "With Ankita Lokhande at the Kai Po Che! premiere, 2013",
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
  },
  {
    slug: "raabta",
    caption: "On the road",
    context: "Promoting Raabta with Kriti Sanon, Kolkata, 2017",
    wide: true,
  },
  {
    slug: "dhoni-promo",
    caption: "Between takes",
    context: "Promoting M.S. Dhoni: The Untold Story, 2016",
  },
  {
    slug: "kedarnath",
    caption: "Kedarnath",
    context: "With Sara Ali Khan, 2018",
  },
  {
    slug: "kai-po-che",
    caption: "Kai Po Che!",
    context: "At the premiere, 2013",
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
  },
];
