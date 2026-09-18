import Link from "next/link";
import type { TagCount } from "@/lib/blog/content";
import { cn } from "@/lib/utils";

export function BlogTagsSidebar({ tags, activeTag }: { tags: TagCount[]; activeTag?: string }) {
  return (
    <div className="rounded-lg border border-line bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          Popular tags
        </h2>
        {activeTag ? (
          <Link
            href="/blog"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Clear
          </Link>
        ) : null}
      </div>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {tags.map(({ tag, count }) => (
          <li key={tag} className="flex items-center justify-between gap-2">
            <Link
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className={cn(
                "font-mono text-sm transition-colors hover:text-amber",
                tag === activeTag ? "font-semibold text-amber" : "text-muted-foreground"
              )}
            >
              #{tag}
            </Link>
            <span className="font-mono text-xs text-muted-foreground">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
