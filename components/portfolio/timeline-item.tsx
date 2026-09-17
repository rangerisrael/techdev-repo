import type { ExperienceItem } from "@/lib/types/portfolio";

export function TimelineItem({ item }: { item: ExperienceItem }) {
  return (
    <div className="relative pb-10 last:pb-0 before:absolute before:-left-8.25 before:top-1 before:h-2.25 before:w-2.25 before:rounded-full before:border-2 before:border-background before:bg-primary before:shadow-[0_0_0_1px_var(--primary)] before:content-['']">
      <div className="mb-1.5 font-mono text-xs text-muted-foreground">{item.date}</div>
      <h3 className="mb-2 text-[17px] font-semibold">{item.role}</h3>
      <p className="max-w-[60ch] text-muted-foreground">{item.description}</p>
    </div>
  );
}
