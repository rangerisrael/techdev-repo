import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const setTheme = vi.fn();
let resolvedTheme = "dark";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme, setTheme }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    setTheme.mockClear();
  });

  it("shows a sun icon and offers light mode when the resolved theme is dark", async () => {
    resolvedTheme = "dark";
    render(<ThemeToggle />);

    const button = await screen.findByRole("button", {
      name: "Switch to light mode",
    });
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("shows a moon icon and offers dark mode when the resolved theme is light", async () => {
    resolvedTheme = "light";
    render(<ThemeToggle />);

    await screen.findByRole("button", { name: "Switch to dark mode" });
  });

  it("calls setTheme with the opposite theme when clicked", async () => {
    resolvedTheme = "dark";
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = await screen.findByRole("button", {
      name: "Switch to light mode",
    });
    await user.click(button);

    await waitFor(() => expect(setTheme).toHaveBeenCalledWith("light"));
  });
});
