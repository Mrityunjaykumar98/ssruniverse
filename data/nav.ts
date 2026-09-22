/** Primary navigation. `id` matches the section anchor rendered on the page. */
export const navLinks = [
  { id: "top", label: "Home" },
  { id: "actor", label: "Actor" },
  { id: "music", label: "Music" },
  { id: "memories", label: "Memories" },
  { id: "dreamer", label: "Dreamer" },
  { id: "journey", label: "Journey" },
] as const;

/** The icon rail beneath the hero. */
export const categories = [
  { id: "actor", icon: "clapper", label: "Actor", note: "His films & performances" },
  { id: "music", icon: "note", label: "Music", note: "His voice & songs" },
  { id: "memories", icon: "smile", label: "Memories", note: "His fun side" },
  // Dance and Curious Mind do not have sections of their own yet; they point
  // at their nearest home so the rail never contains a dead anchor.
  { id: "memories", icon: "dance", label: "Dance", note: "His rhythm & moves" },
  { id: "dreamer", icon: "telescope", label: "Dreamer", note: "His love for space & science" },
  { id: "dreamer", icon: "book", label: "Curious Mind", note: "His books & learning" },
  { id: "fans", icon: "heart", label: "Fans", note: "Your love & messages" },
] as const;
