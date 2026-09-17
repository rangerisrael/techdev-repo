import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SubmitButton } from "@/components/admin/submit-button";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe("SubmitButton", () => {
  it("disables itself and shows the pending label while the form action is in flight", async () => {
    const user = userEvent.setup();
    const { promise, resolve } = deferred<void>();

    render(
      <form action={() => promise}>
        <SubmitButton pendingLabel="Saving…">Save</SubmitButton>
      </form>
    );

    const idleButton = screen.getByRole("button", { name: "Save" });
    expect(idleButton).not.toBeDisabled();

    await user.click(idleButton);

    const pendingButton = await screen.findByRole("button", {
      name: "Saving…",
    });
    expect(pendingButton).toBeDisabled();

    resolve();

    const settledButton = await screen.findByRole("button", { name: "Save" });
    expect(settledButton).not.toBeDisabled();
  });

  it("falls back to the idle label while pending when no pendingLabel is given", async () => {
    const user = userEvent.setup();
    const { promise, resolve } = deferred<void>();

    render(
      <form action={() => promise}>
        <SubmitButton>Add</SubmitButton>
      </form>
    );

    await user.click(screen.getByRole("button", { name: "Add" }));

    const pendingButton = await screen.findByRole("button", { name: "Add" });
    expect(pendingButton).toBeDisabled();

    resolve();
  });
});
