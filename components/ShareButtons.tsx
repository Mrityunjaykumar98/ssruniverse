"use client";

import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/Icons";

const TEXT = "SSR Universe — a fan-made tribute to Sushant Singh Rajput. Keep looking up. ✦";
const HASHTAGS = ["SushantSinghRajput", "ForeverInOurHearts"];

const circle =
  "grid h-11 w-11 place-items-center rounded-full border border-[var(--rule-strong)] text-[var(--paper-55)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] focus-visible:border-[var(--gold)] focus-visible:text-[var(--gold)]";

/**
 * Shares the site itself. Each network gets its own share intent; Instagram
 * has none on the web, so phones also get the system share sheet, which
 * reaches it and everything else installed.
 */
export function ShareButtons({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  /* Only known after mount, so the server and first client render agree. */
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a browser capability, only readable on the client
    setCanShare(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(t);
  }, [copied]);

  const u = encodeURIComponent(url);
  const intents: { icon: IconName; label: string; href: string }[] = [
    { icon: "whatsapp", label: "Share on WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${TEXT} ${url}`)}` },
    {
      icon: "x",
      label: "Share on X",
      href: `https://x.com/intent/post?text=${encodeURIComponent(TEXT)}&url=${u}&hashtags=${HASHTAGS.join(",")}`,
    },
    { icon: "facebook", label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // No async clipboard (an insecure context, or permission refused):
      // fall back to a selection copy.
      const field = document.createElement("textarea");
      field.value = url;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
  };

  const nativeShare = () => {
    // A dismissed sheet rejects; that is not an error worth surfacing.
    navigator.share({ title: "SSR Universe", text: TEXT, url }).catch(() => {});
  };

  return (
    <>
      <ul className="mt-4 flex gap-3 md:justify-end">
        {intents.map(({ icon, label, href }) => (
          <li key={icon}>
            <a href={href} target="_blank" rel="noopener noreferrer" title={label} className={circle}>
              <span className="sr-only">{label}</span>
              <Icon name={icon} className="h-4 w-4" />
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={copy}
            title={copied ? "Link copied" : "Copy link"}
            className={`${circle} ${copied ? "border-[var(--gold)] text-[var(--gold)]" : ""}`}
          >
            <span className="sr-only">Copy link</span>
            <Icon name={copied ? "check" : "link"} className="h-4 w-4" />
          </button>
        </li>
        {canShare && (
          <li>
            <button type="button" onClick={nativeShare} title="More ways to share" className={circle}>
              <span className="sr-only">More ways to share</span>
              <Icon name="share" className="h-4 w-4" />
            </button>
          </li>
        )}
      </ul>
      {/* Confirms the copy for everyone, not only those who can see the tick. */}
      <p aria-live="polite" className="mt-2 h-4 text-[11px] tracking-[.14em] text-[var(--gold)]">
        {copied ? "LINK COPIED" : ""}
      </p>
    </>
  );
}
