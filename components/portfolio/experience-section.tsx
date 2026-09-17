import { SectionHeading } from "@/components/portfolio/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/portfolio/stagger-in";
import { TimelineItem } from "@/components/portfolio/timeline-item";
import type { ExperienceItem } from "@/lib/types/portfolio";

export function ExperienceSection({ items }: { items: ExperienceItem[] }) {
  return (
    <section id="experience" className="border-t border-line py-16 sm:py-[72px]">
      <SectionHeading number="03" title="Experience" />
      <StaggerGroup className="relative border-l border-line pl-7">
        {items.map((item) => (
          <StaggerItem key={item.role}>
            <TimelineItem item={item} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
