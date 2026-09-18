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
  it("renders the role, date and description as plain text when there are no bullets", () => {
    render(<TimelineItem item={item} />);

    expect(screen.getByText(item.date)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: item.role })).toBeInTheDocument();
    expect(screen.getByText(item.description)).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders a bullet-separated description as an unordered list", () => {
    const bulletItem: ExperienceItem = {
      ...item,
      description: "Shipped the payment flow • Reviewed pull requests • On-call for production",
    };

    render(<TimelineItem item={bulletItem} />);

    const list = screen.getByRole("list");
    const items = screen.getAllByRole("listitem");
    expect(list.tagName).toBe("UL");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("Shipped the payment flow");
    expect(items[1]).toHaveTextContent("Reviewed pull requests");
    expect(items[2]).toHaveTextContent("On-call for production");
  });
});
