import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteNav } from "@/components/portfolio/site-nav";

const links = [
  { label: "stack", href: "#stack" },
  { label: "work", href: "#work" },
];

describe("SiteNav", () => {
  it("renders the brand and every nav link", () => {
    render(<SiteNav brand="israel" links={links} />);

    expect(screen.getByText("israel")).toBeInTheDocument();
    for (const link of links) {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.href
      );
    }
  });
});
