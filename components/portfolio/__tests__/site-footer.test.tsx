import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/portfolio/site-footer";

describe("SiteFooter", () => {
  it("renders the copyright and the supplied note", () => {
    render(<SiteFooter note="built with Node, React, and too much coffee" />);

    expect(screen.getByText(/© \d{4} Israel/)).toBeInTheDocument();
    expect(
      screen.getByText("built with Node, React, and too much coffee")
    ).toBeInTheDocument();
  });
});
