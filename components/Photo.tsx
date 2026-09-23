import Image from "next/image";
import { credits, type CreditSlug } from "@/data/credits";

type PhotoProps = {
  /** Key into data/credits.ts — carries dimensions, blur seed and licence. */
  slug: CreditSlug;
  alt: string;
  className?: string;
  /** Passed through for parallax and other per-instance transforms. */
  style?: React.CSSProperties;
  /** Stretch to the nearest positioned ancestor instead of flowing inline. */
  fill?: boolean;
  sizes?: string;
  /** Eagerly load above-the-fold art. Next 16 renamed `priority` to `preload`. */
  preload?: boolean;
  /** Render the "photo — author / licence" line beneath the image. */
  caption?: boolean;
};

/**
 * Wraps next/image so every photograph on the site carries the attribution its
 * Creative Commons licence requires. Prefer this over <Image> directly.
 */
export function Photo({
  slug,
  alt,
  className,
  style,
  fill,
  sizes,
  preload,
  caption,
}: PhotoProps) {
  const credit = credits[slug];
  const blur = credit.blurDataURL
    ? ({ placeholder: "blur" as const, blurDataURL: credit.blurDataURL })
    : {};

  const image = (
    <Image
      src={credit.src}
      alt={alt}
      className={className}
      style={style}
      preload={preload}
      sizes={sizes ?? (fill ? "100vw" : undefined)}
      {...(fill
        ? { fill: true }
        : { width: credit.width, height: credit.height })}
      {...blur}
    />
  );

  if (!caption) return image;

  return (
    <figure className="m-0">
      {image}
      <figcaption className="mt-2 text-[10px] tracking-[.08em] text-[var(--paper-40)]">
        <PhotoCredit slug={slug} />
      </figcaption>
    </figure>
  );
}

/** The attribution line on its own, for captions and the footer credits list. */
export function PhotoCredit({ slug }: { slug: CreditSlug }) {
  const { author, license, licenseUrl, sourceUrl } = credits[slug];
  return (
    <>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-dotted underline-offset-2 hover:text-[var(--gold)]"
      >
        Photo
      </a>{" "}
      by {author} ·{" "}
      {licenseUrl ? (
        <a
          href={licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:text-[var(--gold)]"
        >
          {license}
        </a>
      ) : (
        license
      )}
    </>
  );
}
