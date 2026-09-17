import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { NavLink } from "@/lib/types/portfolio";

export function SiteNav({ brand, links }: { brand: string; links: NavLink[] }) {
  return (
    <nav className="sticky top-0 z-10 border-b border-line bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-[18px] sm:px-8">
        <div className="font-mono text-sm text-muted-foreground">
          <strong className="font-medium text-foreground">{brand}</strong>@portfolio
        </div>
        <div className="flex items-center gap-6">
          <ul className="flex list-none flex-wrap gap-5 p-0 m-0 sm:gap-7">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
