import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusPanel } from "@/components/portfolio/status-panel";

const items = [
  { label: "role", value: "Full-Stack Developer" },
  { label: "focus", value: "marketplace platforms" },
];

describe("StatusPanel", () => {
  it("renders every status row's label and value", () => {
    render(<StatusPanel items={items} />);

    for (const item of items) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    }
  });
});
