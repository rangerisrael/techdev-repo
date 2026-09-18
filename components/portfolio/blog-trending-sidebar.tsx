import type { BlogDiscussion, BlogResource } from "@/lib/types/portfolio";

export function BlogTrendingSidebar({
  discussions,
  resources,
}: {
  discussions: BlogDiscussion[];
  resources: BlogResource[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-line bg-card p-5">
        <h2 className="mb-4 font-mono text-xs tracking-wide text-muted-foreground uppercase">
          Active discussions
        </h2>
        <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
          {discussions.map((item) => (
            <li key={item.title}>
              <a
                href={item.href}
                className="block text-sm leading-snug text-foreground transition-colors hover:text-primary"
              >
                {item.title}
              </a>
              <span className="font-mono text-xs text-muted-foreground">
                {item.comments} comments
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-line bg-card p-5">
        <h2 className="mb-4 font-mono text-xs tracking-wide text-muted-foreground uppercase">
          Trending guides/resources
        </h2>
        <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
          {resources.map((item) => (
            <li key={item.title}>
              <a
                href={item.href}
                className="block text-sm leading-snug text-foreground transition-colors hover:text-primary"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
