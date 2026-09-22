import { CategoryNav } from "@/components/CategoryNav";
import { DreamerSection } from "@/components/DreamerSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MemoriesSection } from "@/components/MemoriesSection";
import { MovieCarousel } from "@/components/MovieCarousel";
import { MusicSection } from "@/components/MusicSection";
import { RandomMemory } from "@/components/RandomMemory";
import { Timeline } from "@/components/Timeline";
export default function Home(){return <main><a className="skip-link" href="#actor">Skip to content</a><Hero/><CategoryNav/><MovieCarousel/><MusicSection/><MemoriesSection/><DreamerSection/><Timeline/><RandomMemory/><Footer/></main>}
