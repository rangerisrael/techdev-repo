import { Badge } from "@/components/ui/badge";

export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Badge
          key={`${tag}-${index}`}
          variant="outline"
          className="rounded-md border-line font-mono text-xs font-normal text-muted-foreground"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
