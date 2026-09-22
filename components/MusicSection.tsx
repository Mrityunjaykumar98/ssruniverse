"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { songs } from "@/data/songs";

export function MusicSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeSong = activeIndex === null ? null : songs[activeIndex];

  return (
    <section id="music" className="section border-y border-white/10 bg-[#0a0e19]">
      <div className="section-inner grid gap-10 md:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="eyebrow">02 / Soundtrack</p>
          <h2 className="display section-title">THE MUSIC</h2>
          <p className="section-copy">A small, playable selection from verified official uploads. Nothing plays until you choose a track.</p>
        </div>
        <div className="border-t border-white/15">
          {songs.map((song, index) => {
            const isActive = activeIndex === index;
            return <button type="button" key={song.youtubeId} onClick={() => setActiveIndex(isActive ? null : index)} aria-pressed={isActive} className="flex w-full items-center gap-4 border-b border-white/10 py-4 text-left transition hover:bg-white/[.03]">
              <span className="w-5 text-[10px] text-[#c9a664]">{String(index + 1).padStart(2, "0")}</span>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-[#c9a664]/70 text-[10px] text-[#c9a664]">{isActive ? "■" : "▶"}</span>
              <span className="flex-1"><span className="block text-sm">{song.title}</span><span className="block text-[10px] text-white/45">{song.film} · Official upload by {song.source}</span></span>
              <span className="text-[10px] text-white/40">{song.year}</span>
            </button>;
          })}
          <AnimatePresence initial={false}>
            {activeSong && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="my-5 aspect-video overflow-hidden border border-white/15 bg-black">
                <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${activeSong.youtubeId}?autoplay=1&rel=0`} title={`${activeSong.title} official YouTube player`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
              </div>
              <p className="mb-2 text-[10px] leading-5 text-white/40">Playback is provided by YouTube&apos;s privacy-enhanced embed. Copyright remains with the respective rights holder.</p>
            </motion.div>}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
