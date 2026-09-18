import type { BlogComment } from "@/lib/types/portfolio";

function formatCommentDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function BlogCommentList({ comments }: { comments: BlogComment[] }) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No comments yet — be the first to say something.
      </p>
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-4 p-0">
      {comments.map((comment) => (
        <li key={comment.id} className="rounded-lg border border-line bg-card p-4">
          <div className="mb-1.5 flex items-baseline gap-2 font-mono text-xs text-muted-foreground">
            <span className="text-foreground">{comment.authorName}</span>
            <span aria-hidden>·</span>
            <span>{formatCommentDate(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-foreground/90">{comment.message}</p>
        </li>
      ))}
    </ul>
  );
}
