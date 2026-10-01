import { DreamerSection } from "@/components/DreamerSection";
import { Ending } from "@/components/Ending";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MemoriesSection } from "@/components/MemoriesSection";
import { MovieCarousel } from "@/components/MovieCarousel";
import { MusicSection } from "@/components/MusicSection";
import { RandomMemory } from "@/components/RandomMemory";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Starfield } from "@/components/Starfield";
import { SiteHeader } from "@/components/SiteHeader";
import { Timeline } from "@/components/Timeline";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#actor">
        Skip to content
      </a>
      {/* The field the whole page sits inside. */}
      <Starfield />
      <SiteHeader />
      <ScrollReveal />
      <main className="relative z-10">
        <Hero />
        <MovieCarousel />
        <MusicSection />
        <MemoriesSection />
        <DreamerSection />
        <Timeline />
        <RandomMemory />
        <Ending />
      </main>
      <Footer />
    </>
  );
}
