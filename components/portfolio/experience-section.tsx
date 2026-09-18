"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/portfolio/stagger-in";
import { TimelineItem } from "@/components/portfolio/timeline-item";
import type { ExperienceItem } from "@/lib/types/portfolio";

export function ExperienceSection({ items }: { items: ExperienceItem[] }) {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start center", "end center"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });
  const height = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <section id="experience" className="border-t border-line py-16 sm:py-18">
      <SectionHeading number="03" title="Experience" />
      <div ref={lineRef} className="relative">
        <motion.div
          className="pointer-events-none absolute left-0 top-0 w-px origin-top bg-primary/70 shadow-[0_0_1px_1px_color-mix(in_srgb,var(--primary)_45%,transparent)]"
          style={{ height }}
        />
        <StaggerGroup className="relative border-l border-line pl-7">
          {items.map((item) => (
            <StaggerItem key={item.role}>
              <TimelineItem item={item} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
