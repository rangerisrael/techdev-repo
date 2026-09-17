import { SectionHeading } from "@/components/portfolio/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/portfolio/stagger-in";
import { TagList } from "@/components/portfolio/tag-list";
import type { StackLayer } from "@/lib/types/portfolio";
import { cn } from "@/lib/utils";

export function StackSection({ layers }: { layers: StackLayer[] }) {
  return (
    <section id="stack" className="border-t border-line py-16 sm:py-[72px]">
      <SectionHeading number="01" title="How it's put together" />
      <StaggerGroup className="grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-3">
        {layers.map((node) => (
          <StaggerItem
            key={node.title}
            className={cn(
              "bg-card p-6",
              node.wide && "sm:col-span-3"
            )}
          >
            <div className="mb-2.5 font-mono text-xs text-amber">{node.layer}</div>
            <h3 className="mb-3 text-base font-semibold">{node.title}</h3>
            <TagList tags={node.tags} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
