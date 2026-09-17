import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "@/components/portfolio/hero-section";
import { siteConfig, statusItems } from "@/lib/data/portfolio-data";

describe("HeroSection", () => {
  it("renders the headline and both call-to-action links", () => {
    render(<HeroSection config={siteConfig} statusItems={statusItems} />);

    expect(
      screen.getByRole("heading", { name: siteConfig.headline })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: siteConfig.primaryCta.label })
    ).toHaveAttribute("href", siteConfig.primaryCta.href);
    expect(
      screen.getByRole("link", { name: siteConfig.secondaryCta.label })
    ).toHaveAttribute("href", siteConfig.secondaryCta.href);
  });

  it("renders the status panel rows", () => {
    render(<HeroSection config={siteConfig} statusItems={statusItems} />);

    expect(screen.getByText(statusItems[0].value)).toBeInTheDocument();
  });
});
