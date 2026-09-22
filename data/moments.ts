import type { CreditSlug } from "@/data/credits";

/**
 * Everything the Memories section shows: photographs from Wikimedia Commons
 * and video embedded from its uploader's channel.
 *
 * Every video id was resolved by search and then confirmed through YouTube's
 * oEmbed endpoint, which reports the owning channel. Award-show *performances*
 * are deliberately absent: the only copies circulating are fan re-uploads of
 * broadcast footage, so the speeches and the interviews stand in their place.
 *
 * Captions describe what the source records — the event, the film, who is
 * present. Nothing is inferred about what he felt.
 */
export type MomentCategory = "candid" | "stage" | "screen" | "words";

type Base = {
  id: string;
  title: string;
  context: string;
  category: MomentCategory;
  /** Give the strongest moments a double-width tile. */
  feature?: boolean;
};

/**
 * Footage of the same occasion as a photograph. Its label describes the video
 * in its own words, kept separate from the photo's caption, because the two
 * are not always the same moment: the Raabta still is Kolkata while the clip
 * is the promotional tour generally.
 */
export type Clip = { youtubeId: string; label: string; source: string };

export type Moment =
  | (Base & { kind: "photo"; slug: CreditSlug; clip?: Clip })
  | (Base & { kind: "video"; youtubeId: string; source: string });

export const categories: { id: MomentCategory | "all"; label: string; note: string }[] = [
  { id: "all", label: "Everything", note: "All of it" },
  { id: "screen", label: "On Screen", note: "Scenes and the making of them" },
  { id: "stage", label: "On Stage", note: "Speeches and award nights" },
  { id: "words", label: "In His Words", note: "Interviews and dreams" },
  { id: "candid", label: "Candid", note: "Photographs" },
];

export const moments: Moment[] = [
  // ── On screen ──────────────────────────────────────────────────────────
  {
    id: "kai-po-che-bts",
    kind: "video",
    youtubeId: "NClJPZ0yljY",
    source: "UTV Motion Pictures",
    title: "The irrepressible Sushant",
    context: "Behind the scenes on Kai Po Che!, 2013",
    category: "screen",
    feature: true,
  },
  {
    id: "chhichhore-anni",
    kind: "video",
    youtubeId: "BVH_QN9GR8w",
    source: "Star Studios",
    title: "Introducing Anni",
    context: "Chhichhore, 2019",
    category: "screen",
  },
  {
    id: "dhoni-training",
    kind: "video",
    youtubeId: "ewvYtDFAE0A",
    source: "Star Studios",
    title: "Training days",
    context: "Learning to bat like Dhoni, 2016",
    category: "screen",
  },
  {
    id: "dhoni-follows-mahi",
    kind: "video",
    youtubeId: "wc29LU_dtho",
    source: "Star Studios",
    title: "Following Mahi",
    context: "M.S. Dhoni: The Untold Story, 2016",
    category: "screen",
  },
  {
    id: "pk-ticket",
    kind: "video",
    youtubeId: "wz0zmT1OyiA",
    source: "Rajkumar Hirani Films",
    title: "Sarfaraz and Jaggu",
    context: "PK, 2014",
    category: "screen",
  },
  {
    id: "byomkesh-deleted",
    kind: "video",
    youtubeId: "2MQKXi92Tjs",
    source: "YRF",
    title: "A scene that never made it",
    context: "Deleted from Detective Byomkesh Bakshy!, 2015",
    category: "screen",
  },
  {
    id: "sonchiriya-lakhna",
    kind: "video",
    youtubeId: "zYN6HPrDwLY",
    source: "RSVP Movies",
    title: "As Lakhna",
    context: "Sonchiriya, 2019",
    category: "screen",
  },
  {
    id: "kedarnath-panditji",
    kind: "video",
    youtubeId: "Y02nzrWcwZ8",
    source: "RSVP Movies",
    title: "Panditji senti ho gaye",
    context: "Kedarnath, 2018",
    category: "screen",
  },
  {
    id: "raabta-making",
    kind: "video",
    youtubeId: "KmwbBf6JCFw",
    source: "T-Series",
    title: "Making Paas Aao",
    context: "Raabta, 2017",
    category: "screen",
  },
  {
    id: "pavitra-rishta",
    kind: "video",
    youtubeId: "Qag_h2xQsVA",
    source: "Zee TV",
    title: "Manav",
    context: "Pavitra Rishta — the role that made his name",
    category: "screen",
    feature: true,
  },
  {
    id: "dil-bechara-trailer",
    kind: "video",
    youtubeId: "oIcDxUGts-I",
    source: "DisneyPlus Hotstar",
    title: "Dil Bechara",
    context: "The trailer for his last film, 2020",
    category: "screen",
  },

  // ── On stage ───────────────────────────────────────────────────────────
  {
    id: "screen-award-speech",
    kind: "video",
    youtubeId: "R3kpZezV80o",
    source: "Screen Awards",
    title: "A good artist, and a good human",
    context: "Accepting his award at the Screen Awards",
    category: "stage",
    feature: true,
  },
  {
    id: "iifa-chat",
    kind: "video",
    youtubeId: "gUnNguSnwa8",
    source: "IIFA Awards",
    title: "With Shah Rukh and Shahid",
    context: "Backstage at IIFA",
    category: "stage",
  },
  {
    id: "iifa-moment",
    kind: "video",
    youtubeId: "zkgAMOt_yG4",
    source: "IIFA Awards",
    title: "A moment on stage",
    context: "With Kriti Sanon at IIFA",
    category: "stage",
  },

  // ── In his words ───────────────────────────────────────────────────────
  {
    id: "fifty-dreams",
    kind: "video",
    youtubeId: "E1hiXVOsefc",
    source: "The Quint",
    title: "Fifty dreams",
    context: "The list he wrote of everything he meant to do",
    category: "words",
    feature: true,
  },
  {
    id: "mindrocks",
    kind: "video",
    youtubeId: "EOJucyCcZSI",
    source: "India Today Mindrocks",
    title: "On dreams and philosophy",
    context: "In conversation about the journey",
    category: "words",
  },

  // ── Candid ─────────────────────────────────────────────────────────────
  {
    id: "photo-filmfare",
    kind: "photo",
    slug: "filmfare-2016",
    title: "That smile",
    context: "Filmfare Style Awards, 2016",
    category: "candid",
    clip: {
      youtubeId: "u-9CiOcnnwY",
      label: "On the carpet at the Filmfare Glamour & Style Awards, 2016",
      source: "Bollywood Life",
    },
  },
  {
    id: "photo-premiere",
    kind: "photo",
    slug: "kai-po-che-premiere",
    title: "Where it began",
    context: "With Ankita Lokhande at the Kai Po Che! premiere, 2013",
    category: "candid",
    clip: {
      youtubeId: "o3dbI2CgzAA",
      label: "Arriving at the Kai Po Che! premiere with Ankita Lokhande",
      source: "SEPL Video",
    },
  },
  {
    id: "photo-wift",
    kind: "photo",
    slug: "wift",
    title: "Off camera",
    context: "WIFT felicitation",
    category: "candid",
  },
  {
    id: "photo-masterclass",
    kind: "photo",
    slug: "masterclass",
    title: "Still learning",
    context: "With Shekhar Kapur at a master class, IFFI Goa, 2017",
    category: "candid",
    clip: {
      youtubeId: "C_eSla-emEM",
      label: "The master class with Shekhar Kapur, IFFI 2017",
      source: "Bharti Dubey",
    },
  },
  {
    id: "photo-raabta",
    kind: "photo",
    slug: "raabta",
    title: "On the road",
    context: "Promoting Raabta with Kriti Sanon, Kolkata, 2017",
    category: "candid",
    feature: true,
    clip: {
      youtubeId: "buDuqadHwL0",
      label: "On the Raabta promotional tour with Kriti Sanon",
      source: "MH One News",
    },
  },
  {
    id: "photo-dhoni",
    kind: "photo",
    slug: "dhoni-promo",
    title: "Between takes",
    context: "Promoting M.S. Dhoni: The Untold Story, 2016",
    category: "candid",
    clip: {
      youtubeId: "AA8taRsyR8g",
      label: "The M.S. Dhoni trailer launch, uncut",
      source: "Movie Talkies",
    },
  },
  {
    id: "photo-kedarnath",
    kind: "photo",
    slug: "kedarnath",
    title: "Kedarnath",
    context: "With Sara Ali Khan, 2018",
    category: "candid",
    clip: {
      youtubeId: "CYYGqvqW_Sc",
      label: "The Kedarnath trailer launch with Sara Ali Khan",
      source: "Bollywood Hungama",
    },
  },
  {
    id: "photo-kai-po-che",
    kind: "photo",
    slug: "kai-po-che",
    title: "Kai Po Che!",
    context: "At the premiere, 2013",
    category: "candid",
    clip: {
      youtubeId: "G19faYsLtlc",
      label: "The Kai Po Che! official trailer — his first film",
      source: "Firecracker Productions",
    },
  },
  {
    id: "photo-kangna",
    kind: "photo",
    slug: "kangna-bash",
    title: "Among friends",
    context: "At a birthday celebration",
    category: "candid",
  },
  {
    id: "photo-iifa",
    kind: "photo",
    slug: "hero-portrait",
    title: "IIFA",
    context: "Green carpet, 2017",
    category: "candid",
    clip: {
      youtubeId: "eB_fGMuSteI",
      label: "His journey with IIFA",
      source: "IIFA Awards",
    },
  },
];

/** YouTube's thumbnail. Letterboxed 4:3 — crop past the bars when displaying. */
export const videoThumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

/** Photographs only, for the random-memory section. */
export const photoMoments = moments.filter(
  (m): m is Extract<Moment, { kind: "photo" }> => m.kind === "photo",
);
