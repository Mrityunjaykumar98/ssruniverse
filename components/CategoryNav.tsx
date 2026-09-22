import { Icon, type IconName } from "@/components/Icons";
import { categories } from "@/data/nav";

export function CategoryNav() {
  return (
    <nav
      aria-label="Explore by theme"
      className="rail overflow-x-auto border-y border-[var(--rule)] bg-[var(--ink-raised)]"
    >
      <ul className="mx-auto flex min-w-[52rem] max-w-[var(--shell)]">
        {categories.map(({ id, icon, label, note }) => (
          <li key={label} className="flex-1 border-r border-[var(--rule)] last:border-r-0">
            <a
              href={`#${id}`}
              className="group flex h-full flex-col items-center justify-start gap-2.5 px-3 py-7 text-center"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--gold)]/60 text-[var(--gold)] transition duration-300 group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)]/10">
                <Icon name={icon as IconName} className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-bold tracking-[.16em] text-[var(--paper)] transition group-hover:text-[var(--gold)]">
                {label.toUpperCase()}
              </span>
              <span className="text-[10px] leading-tight text-[var(--paper-40)]">{note}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
