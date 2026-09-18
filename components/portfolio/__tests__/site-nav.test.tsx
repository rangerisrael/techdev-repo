import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SiteNav } from "@/components/portfolio/site-nav";

const links = [
  { label: "stack", href: "#stack" },
  { label: "work", href: "#work" },
  { label: "blog", href: "/blog" },
];

/** Hash-only hrefs resolve to the homepage section; other hrefs pass through unchanged. */
function expectedHref(href: string): string {
  return href.startsWith("#") ? `/${href}` : href;
}

describe("SiteNav", () => {
  it("renders the brand and every nav link, anchoring hash links to the homepage", () => {
    render(<SiteNav brand="israel" links={links} />);

    expect(screen.getByText("israel")).toBeInTheDocument();
    for (const link of links) {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        expectedHref(link.href)
      );
    }
  });

  it("opens the full-screen menu from the hamburger trigger and every link is reachable", async () => {
    const user = userEvent.setup();
    render(<SiteNav brand="israel" links={links} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const dialog = await screen.findByRole("dialog", {
      name: "Navigation menu",
    });
    for (const link of links) {
      expect(
        within(dialog).getByRole("link", { name: link.label })
      ).toHaveAttribute("href", expectedHref(link.href));
    }
  });

  it("closes the menu when the close button is pressed", async () => {
    const user = userEvent.setup();
    render(<SiteNav brand="israel" links={links} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog", { name: "Navigation menu" });

    await user.click(screen.getByRole("button", { name: "Close menu" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("closes the menu after a link is selected", async () => {
    const user = userEvent.setup();
    render(<SiteNav brand="israel" links={links} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog", {
      name: "Navigation menu",
    });

    await user.click(within(dialog).getByRole("link", { name: "stack" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });
});
