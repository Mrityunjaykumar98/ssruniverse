import Image from "next/image";
import { Icon, type IconName } from "@/components/Icons";
import { PhotoCredit } from "@/components/Photo";
import { credits, type CreditSlug } from "@/data/credits";

const socials: { icon: IconName; label: string; href: string }[] = [
  { icon: "youtube", label: "YouTube", href: "https://www.youtube.com/results?search_query=sushant+singh+rajput" },
  { icon: "instagram", label: "Instagram", href: "https://www.instagram.com/explore/tags/sushantsinghrajput/" },
  { icon: "x", label: "X", href: "https://x.com/search?q=%23SushantSinghRajput" },
  { icon: "link", label: "Wikipedia", href: "https://en.wikipedia.org/wiki/Sushant_Singh_Rajput" },
];

/* The signature is public domain; the rest need their author shown. */
const photoSlugs = (Object.keys(credits) as CreditSlug[]).filter(
  (slug) => slug !== "signature",
);

export function Footer() {
  return (
    <footer className="border-t border-[var(--rule)] bg-[var(--ink)] px-5 py-16 md:px-8">
      <div className="mx-auto max-w-[var(--shell)]">
        <div className="grid gap-10 md:grid-cols-3 md:items-start">
          <div>
            <p className="text-[11px] font-bold tracking-[.2em]">
              <span className="mr-2 text-[var(--gold)]" aria-hidden>
                ✦
              </span>
              THE SUSHANT UNIVERSE
            </p>
            <p className="mt-2 text-xs text-[var(--paper-40)]">
              A place to remember. A universe to explore.
            </p>
            <Image
              src="/images/signature.svg"
              alt="Sushant Singh Rajput's signature"
              width={160}
              height={79}
              // Next refuses SVG through the image optimizer unless
              // dangerouslyAllowSVG is set globally; this file is trusted and
              // needs no resizing, so skip the optimizer instead.
              unoptimized
              className="mt-6 opacity-45 invert"
            />
          </div>

          <figure className="m-0 text-center">
            <blockquote className="display text-xl italic leading-relaxed text-[var(--paper-70)]">
              &ldquo;Live your dreams,
              <br />
              keep your curiosity alive.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-[10px] tracking-[.16em] text-[var(--paper-40)]">
              &mdash; SUSHANT SINGH RAJPUT
            </figcaption>
          </figure>

          <div className="md:text-right">
            <p className="text-[10px] font-bold tracking-[.18em] text-[var(--paper-55)]">
              SHARE HIS STORY
            </p>
            <ul className="mt-4 flex gap-3 md:justify-end">
              {socials.map(({ icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full border border-[var(--rule-strong)] text-[var(--paper-55)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon name={icon} className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[10px] tracking-[.14em] text-[var(--gold)]/70">
              #SushantSinghRajput &nbsp; #ForeverInOurHearts
            </p>
          </div>
        </div>

        {/* Attribution. These lines are licence terms, not decoration. */}
        <details className="mt-14 border-t border-[var(--rule)] pt-6">
          <summary className="cursor-pointer text-[10px] font-bold tracking-[.18em] text-[var(--paper-55)] hover:text-[var(--gold)]">
            IMAGE CREDITS &amp; SOURCES
          </summary>
          <ul className="mt-4 grid gap-1.5 text-[10px] leading-relaxed text-[var(--paper-40)] sm:grid-cols-2">
            {photoSlugs.map((slug) => (
              <li key={slug}>
                <PhotoCredit slug={slug} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[10px] leading-relaxed text-[var(--paper-40)]">
            Signature: public domain. Poster artwork and film metadata supplied by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-[var(--gold)]"
            >
              TMDB
            </a>
            . This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </details>

        <div className="mt-8 flex flex-wrap justify-between gap-4 border-t border-[var(--rule)] pt-6 text-[10px] tracking-[.14em] text-[var(--paper-40)]">
          <span>MADE WITH ♡ BY FANS, FOR FOREVER</span>
          <span>INDEPENDENT FAN-MADE TRIBUTE. NOT AFFILIATED WITH ANY OFFICIAL ENTITY.</span>
        </div>
      </div>
    </footer>
  );
}
