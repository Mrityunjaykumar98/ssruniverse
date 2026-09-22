import { Icon } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { dreams } from "@/data/dreams";

export function DreamerSection() {
  return (
    <section id="dreamer" className="section relative overflow-hidden bg-[var(--navy)]">
      {/* The same deep-space plate as the hero, held right back so the
          section reads as a continuation of it rather than a repeat. */}
      <div aria-hidden className="absolute inset-0">
        <Photo slug="cosmos" alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--ink),rgba(11,16,32,.82)_40%,var(--ink))]" />
      </div>

      <div className="section-inner relative">
        <p className="eyebrow rule-lead">04 / Beyond the frame</p>
        <h2 className="display section-title">THE DREAMER</h2>
        <p className="display mt-2 max-w-xl text-2xl italic leading-snug text-[var(--paper-70)]">
          He wasn&rsquo;t just an actor. He was a curious soul.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[var(--rule)]">
              <Photo
                slug="masterclass"
                alt="Sushant Singh Rajput at a master class with Shekhar Kapur, IFFI Goa, 2017"
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover object-[60%_20%] saturate-[.7]"
              />
              <div className="absolute inset-0 bg-[#0d1b33] opacity-45 mix-blend-color" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,6,12,.92),transparent_55%)]" />
            </div>
            <p className="section-copy mt-6">
              From astronomy to physics to code, his curiosity ran far past the
              silver screen — and he never seemed to think of it as a separate life.
            </p>
          </div>

          <ul className="grid gap-px bg-[var(--rule)] sm:grid-cols-2">
            {dreams.map((dream) => (
              <li
                key={dream.number}
                className="group relative overflow-hidden bg-[var(--navy)] p-6 transition hover:bg-[var(--navy-lift)]"
              >
                <span
                  aria-hidden
                  className="display pointer-events-none absolute -right-3 -top-6 text-8xl text-[var(--paper)]/[.04]"
                >
                  {dream.number}
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--gold)]/50 text-[var(--gold)] transition group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)]/10">
                  <Icon name={dream.icon} className="h-5 w-5" />
                </span>
                <h3 className="display mt-5 text-2xl leading-tight">{dream.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--paper-55)]">
                  {dream.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
