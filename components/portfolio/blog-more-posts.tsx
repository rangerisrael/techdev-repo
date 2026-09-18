import Link from "next/link";
import type { BlogPost } from "@/lib/types/portfolio";

export function BlogMorePosts({ posts, author }: { posts: BlogPost[]; author: string }) {
  if (posts.length === 0) return null;

  return (
    <div className="rounded-lg border border-line bg-card p-5">
      <h2 className="mb-4 font-mono text-xs tracking-wide text-muted-foreground uppercase">
        More from {author}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block text-sm leading-snug text-foreground transition-colors hover:text-primary"
            >
              {post.title}
            </Link>
            {post.tags[0] ? (
              <Link
                href={`/blog?tag=${encodeURIComponent(post.tags[0])}`}
                className="font-mono text-xs text-amber hover:underline"
              >
                #{post.tags[0]}
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
