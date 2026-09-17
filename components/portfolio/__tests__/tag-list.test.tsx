import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TagList } from "@/components/portfolio/tag-list";

describe("TagList", () => {
  it("renders one badge per tag", () => {
    render(<TagList tags={["React", "Next.js", "TypeScript"]} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders nothing when given an empty list", () => {
    const { container } = render(<TagList tags={[]} />);
    expect(container.querySelectorAll("span")).toHaveLength(0);
  });
});
