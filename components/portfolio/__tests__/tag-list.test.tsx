import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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

  it("renders duplicate tag values without a React duplicate-key warning", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<TagList tags={["stack tag", "stack tag"]} />);

    expect(screen.getAllByText("stack tag")).toHaveLength(2);
    const duplicateKeyWarning = errorSpy.mock.calls.some((call) =>
      String(call[0]).includes("same key")
    );
    expect(duplicateKeyWarning).toBe(false);

    errorSpy.mockRestore();
  });
});
