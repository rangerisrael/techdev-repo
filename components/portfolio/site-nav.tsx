import type { NavLink } from "@/lib/types/portfolio";

export function SiteNav({ brand, links }: { brand: string; links: NavLink[] }) {
  return (
    <nav className="sticky top-0 z-10 border-b border-line bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-[18px] sm:px-8">
        <div className="font-mono text-sm text-muted-foreground">
          <strong className="font-medium text-foreground">{brand}</strong>@portfolio
        </div>
        <ul className="flex list-none gap-7 p-0 m-0">
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
      </div>
    </nav>
  );
}
