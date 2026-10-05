"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icons";
import { navLinks } from "@/data/nav";

export function SiteHeader() {
  const [active, setActive] = useState<string>("top");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /* 0–1 through the page, drawn as a hairline under the bar. */
  const [progress, setProgress] = useState(0);
  /* Where a link in the phone drawer asked to go, held until it has shut. */
  const pendingJump = useRef<string | null>(null);

  /* Closing the drawer cancels any smooth scroll already under way, so a
     plain anchor in it changed the address and never moved the page. Its
     links close the drawer first and make the jump once it has gone. */
  const jumpFromDrawer = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // Leave modified clicks (new tab, new window) to the browser.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    pendingJump.current = id;
    setMenuOpen(false);
  };

  const finishJump = () => {
    const id = pendingJump.current;
    pendingJump.current = null;
    const target = id && document.getElementById(id);
    if (!target) return;
    // A real history entry, as the anchor would have made, so Back returns.
    history.pushState(history.state, "", `#${id}`);
    // No behaviour given, so the CSS decides: smooth, or instant under
    // reduced motion.
    target.scrollIntoView();
  };

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

    /* The address follows the reader, so a copied URL lands where they
       were. Only once they have scrolled themselves: on arrival at a shared
       /#music the first report is still "top", and writing it would wipe
       the hash before the browser has jumped to it. */
    let reading = false;
    const startReading = () => {
      reading = true;
    };
    const intents = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    intents.forEach((type) => window.addEventListener(type, startReading, { once: true, passive: true }));

    const follow = (id: string) => {
      if (!reading) return;
      const hash = id === "top" ? "" : `#${id}`;
      if (window.location.hash === hash) return;
      // Replace rather than push: scrolling past six sections should not
      // take six presses of Back to undo. history.state is passed through
      // so Next's router state, and an open lightbox's entry, survive.
      history.replaceState(history.state, "", `${location.pathname}${location.search}${hash}`);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        setActive(visible.target.id);
        follow(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      intents.forEach((type) => window.removeEventListener(type, startReading));
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
        <a href="#top" className="-my-3 shrink-0 py-3">
          <p className="text-[11px] font-bold tracking-[.2em]">
            <span className="mr-2 text-[var(--gold)]" aria-hidden>
              ✦
            </span>
            SSR UNIVERSE
          </p>
          <p className="mt-1 hidden text-[10px] tracking-[.08em] text-[var(--paper-40)] sm:block">
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
          className="-mr-2.5 grid h-11 w-11 place-items-center text-lg text-[var(--gold)] lg:hidden"
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

      <AnimatePresence onExitComplete={finishJump}>
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
                    onClick={(e) => jumpFromDrawer(e, id)}
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
