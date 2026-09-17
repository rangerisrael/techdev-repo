import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeading } from "@/components/portfolio/section-heading";

describe("SectionHeading", () => {
  it("renders the section number and title", () => {
    render(<SectionHeading number="01" title="How it's put together" />);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "How it's put together" })
    ).toBeInTheDocument();
  });
});
