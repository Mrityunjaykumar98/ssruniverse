type IconProps = { className?: string };

/* A small, uniform line-icon set drawn on a 24×24 grid so every glyph sits
   the same inside the gold circles of the category rail. */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const icons = {
  dance: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <circle cx="13" cy="4.5" r="1.8" />
      <path d="M13 6.5 11 12l3 2.5 1 6M11 12 6.5 10M14.5 14.5 9 21" />
    </svg>
  ),
  telescope: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="m3 13 12-6 2.5 5-12 6L3 13Z" />
      <path d="m17.5 7 3 1.5-1.5 3.5M10 16v5M10 21H7.5M10 21h2.5" />
    </svg>
  ),
  book: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5v-15Z" />
      <path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H19v-3" />
      <path d="M11.5 3v10l2-1.5 2 1.5V3" />
    </svg>
  ),
  heart: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20Z" />
    </svg>
  ),
  atom: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(120 12 12)" />
    </svg>
  ),
  code: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="m8.5 8-4.5 4 4.5 4M15.5 8l4.5 4-4.5 4M13.5 5l-3 14" />
    </svg>
  ),
  menu: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  close: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  /* The X mark: one bar drawn as an outline, the other as two strokes. */
  x: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="M4 4h4.5L20 20h-4.5L4 4Z" />
      <path d="M19.5 4l-6.4 7.2M4.5 20l6.4-7.2" />
    </svg>
  ),
  whatsapp: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="M4 20l1.2-3.6A8.3 8.3 0 1 1 8 19l-4 1Z" />
      <path d="M9.2 8.3c-.4 2.8 3.1 6.5 6.4 6.4l.9-1.5-2-1-.9.8a4.6 4.6 0 0 1-2-2l.8-.9-1-2-1.5.7-.7-.5Z" />
    </svg>
  ),
  facebook: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4a20 20 0 0 0-2.2-.1c-2.2 0-3.9 1.4-3.9 3.9v2.3H9v3h2.5V21" />
    </svg>
  ),
  share: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="M12 15V3.5M8 7.5l4-4 4 4" />
      <path d="M6 11H5v8.5h14V11h-1" />
    </svg>
  ),
  check: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  ),
  link: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-1.2 1.2" />
      <path d="M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l1.2-1.2" />
    </svg>
  ),
  arrow: (p: IconProps) => (
    <svg {...base} {...p} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return icons[name]({ className });
}
