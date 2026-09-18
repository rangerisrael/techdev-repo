import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/types/portfolio";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="relative border-b border-line py-6 transition-colors first:pt-0 last:border-b-0 hover:bg-surface-2/40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {post.badge ? (
            <div className="mb-3 inline-flex rounded-md bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              {post.badge}
            </div>
          ) : null}

          <div className="mb-2 flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="text-foreground">{post.author.name}</span>
            <span aria-hidden>·</span>
            <span>{post.date}</span>
          </div>

          <h3 className="mb-3 text-lg font-semibold text-foreground sm:text-xl">
            <Link
              href={`/blog/${post.slug}`}
              className="after:absolute after:inset-0 after:content-[''] hover:text-primary"
            >
              {post.title}
            </Link>
          </h3>
        </div>

        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host
          <img
            src={post.coverImageUrl}
            alt=""
            className="hidden h-20 w-28 shrink-0 rounded-md border border-line object-cover sm:block"
          />
        ) : null}
      </div>

      <div className="relative z-10 mb-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="rounded-md border-line font-mono text-xs font-normal text-amber hover:underline"
            render={<Link href={`/blog?tag=${encodeURIComponent(tag)}`} />}
          >
            #{tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Heart className="size-3.5" aria-hidden />
          {post.reactions} reactions
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="size-3.5" aria-hidden />
          {post.comments} comments
        </span>
        <span>{post.readTime}</span>
      </div>
    </article>
  );
}
