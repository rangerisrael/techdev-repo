import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { verifyAdminPassword } from "../password";

describe("verifyAdminPassword", () => {
  const originalPassword = process.env.ADMIN_PASSWORD;

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "correct-horse-battery-staple";
  });

  afterEach(() => {
    process.env.ADMIN_PASSWORD = originalPassword;
  });

  it("accepts the correct password", () => {
    expect(verifyAdminPassword("correct-horse-battery-staple")).toBe(true);
  });

  it("rejects an incorrect password of the same length", () => {
    expect(verifyAdminPassword("correct-horse-battery-staplz")).toBe(false);
  });

  it("rejects an incorrect password of a different length", () => {
    expect(verifyAdminPassword("nope")).toBe(false);
  });

  it("rejects an empty password", () => {
    expect(verifyAdminPassword("")).toBe(false);
  });

  it("throws when ADMIN_PASSWORD is unset", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(() => verifyAdminPassword("anything")).toThrow(/ADMIN_PASSWORD/);
  });
});
