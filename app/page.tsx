import { DreamerSection } from "@/components/DreamerSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MemoriesSection } from "@/components/MemoriesSection";
import { MovieCarousel } from "@/components/MovieCarousel";
import { MusicSection } from "@/components/MusicSection";
import { RandomMemory } from "@/components/RandomMemory";
import { SiteHeader } from "@/components/SiteHeader";
import { Timeline } from "@/components/Timeline";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#actor">
        Skip to content
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <MovieCarousel />
        <MusicSection />
        <MemoriesSection />
        <DreamerSection />
        <Timeline />
        <RandomMemory />
      </main>
      <Footer />
    </>
  );
}
