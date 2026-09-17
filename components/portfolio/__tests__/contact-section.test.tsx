import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactSection } from "@/components/portfolio/contact-section";

const links = [
  { label: "email", href: "mailto:you@example.com" },
  { label: "github", href: "https://github.com/example" },
];

describe("ContactSection", () => {
  it("renders the note and every contact link with its href", () => {
    render(<ContactSection note="Open to work." links={links} />);

    expect(screen.getByText("Open to work.")).toBeInTheDocument();
    for (const link of links) {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.href
      );
    }
  });
});
