"use client";

import { useEffect } from "react";

/**
 * Reveals anything marked `data-reveal` as it scrolls into view.
 *
 * One observer for the whole page rather than a wrapper component per
 * element, so sections stay server components and only this file ships JS.
 * The start state lives in globals.css, so nothing flashes before hydration.
 *
 * Elements are revealed once and then unobserved — content that has already
 * been read should not animate again when scrolled back to.
 */
export function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");

    // Honour the OS setting: reveal everything at rest and do no work.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.setAttribute("data-reveal-in", ""));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal-in", "");
          observer.unobserve(entry.target);
        }
      },
      // Fire a little before the element's top edge arrives, and treat
      // anything already on screen at load as visible.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
