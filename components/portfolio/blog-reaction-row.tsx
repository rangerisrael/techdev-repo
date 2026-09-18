import type { BlogReaction } from "@/lib/types/portfolio";

export function BlogReactionRow({ reactions }: { reactions: BlogReaction[] }) {
  if (reactions.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {reactions.map((reaction) => (
        <span
          key={reaction.emoji}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1 text-sm"
        >
          <span aria-hidden>{reaction.emoji}</span>
          <span className="font-mono text-xs text-muted-foreground">{reaction.count}</span>
        </span>
      ))}
    </div>
  );
}
