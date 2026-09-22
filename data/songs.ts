/**
 * Every track is embedded from its rights holder's own YouTube channel, and
 * every id below was verified against YouTube's oEmbed endpoint so the channel
 * really is the official one. Artwork is YouTube's own thumbnail for the same
 * video. Nothing is re-hosted here.
 */
export type Song = {
  title: string;
  film: string;
  year: string;
  youtubeId: string;
  /** The channel that owns the upload, shown beside the track. */
  source: string;
  singers: string;
};

export const songs: Song[] = [
  { title: "Manjha",      film: "Kai Po Che!",                  year: "2013", youtubeId: "YKcmMmJlKNk", source: "SonyMusicIndiaVEVO", singers: "Amit Trivedi" },
  { title: "Gulabi",      film: "Shuddh Desi Romance",          year: "2013", youtubeId: "Ll-LluZrNqw", source: "YRF",                singers: "Jigar Saraiya, Priya Saraiya" },
  { title: "Chaar Kadam", film: "PK",                           year: "2014", youtubeId: "GDIXUnUkDmk", source: "T-Series",           singers: "Shaan, Shreya Ghoshal" },
  { title: "Kaun Tujhe",  film: "M.S. Dhoni: The Untold Story", year: "2016", youtubeId: "atVof3pjT-I", source: "T-Series",           singers: "Palak Muchhal" },
  { title: "Qaafirana",   film: "Kedarnath",                    year: "2018", youtubeId: "ZmcBC9-wAXM", source: "Zee Music Company",  singers: "Arijit Singh, Nikhita Gandhi" },
  { title: "Khairiyat",   film: "Chhichhore",                   year: "2019", youtubeId: "9-AKLAfpjrI", source: "T-Series",           singers: "Arijit Singh" },
  { title: "Taare Ginn",  film: "Dil Bechara",                  year: "2020", youtubeId: "iktvQ_Nl11M", source: "SonyMusicIndiaVEVO", singers: "Mohit Chauhan, Shreya Ghoshal" },
];

/** YouTube's own thumbnail for a video; hotlinked, never re-hosted. */
export const songArtwork = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
