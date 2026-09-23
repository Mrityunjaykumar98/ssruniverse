"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icons";
import { navLinks } from "@/data/nav";

export function SiteHeader() {
  const [active, setActive] = useState<string>("top");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /* 0–1 through the page, drawn as a hairline under the bar. */
  const [progress, setProgress] = useState(0);

  /* Highlight the link whose section currently owns the upper third of the
     viewport, and swap the bar to its solid state once the hero is behind us. */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const runway = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(runway > 0 ? Math.min(1, window.scrollY / runway) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = navLinks
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  /* A drawer that outlives the viewport width change would trap focus. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-[var(--rule)] bg-[rgba(7,10,18,.88)] backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[var(--shell)] items-center justify-between gap-6 px-5 py-4 md:px-8">
        <a href="#top" className="shrink-0">
          <p className="text-[11px] font-bold tracking-[.2em]">
            <span className="mr-2 text-[var(--gold)]" aria-hidden>
              ✦
            </span>
            SSR UNIVERSE
          </p>
          <p className="mt-1 hidden text-[9px] tracking-[.08em] text-[var(--paper-40)] sm:block">
            A place to remember. A universe to explore.
          </p>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navLinks.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              className={`relative py-1 text-[11px] font-semibold tracking-[.16em] transition-colors ${
                active === id
                  ? "text-[var(--paper)]"
                  : "text-[var(--paper-55)] hover:text-[var(--paper)]"
              }`}
            >
              {label.toUpperCase()}
              {active === id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 h-px w-full bg-[var(--gold)]"
                />
              )}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="text-lg text-[var(--gold)] lg:hidden"
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <Icon name={menuOpen ? "close" : "menu"} className="h-6 w-6" />
        </button>
      </div>

      {/* Reading progress. Scales rather than animating width, so it stays
          on the compositor and never lays out. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-[linear-gradient(90deg,var(--gold-dim),var(--gold-bright))]"
        style={{ transform: `scaleX(${progress})` }}
      />

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Primary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--rule)] bg-[rgba(7,10,18,.96)] backdrop-blur-md lg:hidden"
          >
            <ul className="px-5 py-2">
              {navLinks.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-[var(--rule)] py-3.5 text-[11px] font-semibold tracking-[.18em] text-[var(--paper-70)] last:border-b-0"
                  >
                    {label.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
