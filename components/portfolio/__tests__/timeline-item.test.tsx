import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TimelineItem } from "@/components/portfolio/timeline-item";
import type { ExperienceItem } from "@/lib/types/portfolio";

const item: ExperienceItem = {
  date: "2024 — Present",
  role: "Full-Stack Developer, Scrub Technologies Inc.",
  description: "Building and maintaining Scrub.ph end to end.",
};

describe("TimelineItem", () => {
  it("renders the role, date and description", () => {
    render(<TimelineItem item={item} />);

    expect(screen.getByText(item.date)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: item.role })).toBeInTheDocument();
    expect(screen.getByText(item.description)).toBeInTheDocument();
  });
});
