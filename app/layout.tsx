import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Caveat } from "next/font/google";
import "./globals.css";

/* Display serif for the wordmark and section titles. */
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

/* Interface sans for body copy, labels and navigation. */
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/* Handwriting, used sparingly for the margin notes in the comp. */
const script = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  // The wordmark is "SSR Universe", but the document title keeps his full
  // name so the site is findable by people searching for him.
  title: "SSR Universe — A Sushant Singh Rajput Tribute",
  description:
    "An independent, fan-made tribute to Sushant Singh Rajput — his films, his music, and the curiosity he left behind.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* data-scroll-behavior is required in Next 16 for the framework to
       manage smooth scrolling across navigations. */
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${script.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
