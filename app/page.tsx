import { DreamerSection } from "@/components/DreamerSection";
import { Ending } from "@/components/Ending";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { InHisWords } from "@/components/InHisWords";
import { MemoriesSection } from "@/components/MemoriesSection";
import { MovieCarousel } from "@/components/MovieCarousel";
import { MusicSection } from "@/components/MusicSection";
import { ScreeningRoom } from "@/components/ScreeningRoom";
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
        <ScreeningRoom />
        <MusicSection />
        {/* Sourced: his acceptance speech, on the Screen Awards' own channel. */}
        <InHisWords
          parts={[
            { text: "I’d like to become a" },
            { text: "good artist", em: true },
            { text: "and a" },
            { text: "good human", em: true },
            { text: "before leaving from here." },
          ]}
          source="Accepting at the Screen Awards"
        />
        <MemoriesSection />
        <DreamerSection />
        {/* Sourced: @itsSSR, 6 October 2019, as shown in the Film Companion
            piece the Dreamer section embeds. */}
        <InHisWords
          parts={[
            { text: "Every new discovery was once" },
            { text: "against the majority,", em: true },
            { text: "not with it." },
          ]}
          source="On Twitter, 6 October 2019"
          tone="cool"
        />
        <Timeline />
        <Ending />
      </main>
      <Footer />
    </>
  );
}
