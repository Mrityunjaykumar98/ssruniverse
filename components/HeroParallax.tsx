"use client";

import { useEffect } from "react";

/**
 * Drifts the hero's starfield and portrait at different rates as the page
 * scrolls, so the layers separate in depth instead of moving as one flat
 * image.
 *
 * Writes a CSS variable rather than inline transforms, so the elements keep
 * whatever transform their own classes give them. Updates are coalesced into
 * requestAnimationFrame and stop once the hero has left the screen.
 */
export function HeroParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = document.getElementById("top");
    if (!hero) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y > window.innerHeight) return; // hero is gone; stop paying for it
      hero.style.setProperty("--scroll-y", String(y));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
