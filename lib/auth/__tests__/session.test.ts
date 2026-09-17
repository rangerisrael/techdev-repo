import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createSessionToken, verifySessionToken } from "../session";

describe("session tokens", () => {
  const originalSecret = process.env.ADMIN_SESSION_SECRET;

  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env.ADMIN_SESSION_SECRET = originalSecret;
    vi.useRealTimers();
  });

  it("verifies a token it just created", () => {
    const token = createSessionToken();
    expect(verifySessionToken(token)).toBe(true);
  });

  it("rejects a missing token", () => {
    expect(verifySessionToken(undefined)).toBe(false);
  });

  it("rejects a malformed token", () => {
    expect(verifySessionToken("not-a-real-token")).toBe(false);
  });

  it("rejects a token signed with a different secret", () => {
    const token = createSessionToken();
    process.env.ADMIN_SESSION_SECRET = "a-different-secret";
    expect(verifySessionToken(token)).toBe(false);
  });

  it("rejects a tampered payload even with a matching-length signature", () => {
    const token = createSessionToken();
    const [, signature] = token.split(".");
    const tamperedBody = Buffer.from(
      JSON.stringify({ role: "admin", exp: Date.now() + 999_999_999 })
    ).toString("base64url");
    expect(verifySessionToken(`${tamperedBody}.${signature}`)).toBe(false);
  });

  it("rejects an expired token", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const token = createSessionToken();

    vi.setSystemTime(new Date("2026-02-01T00:00:00Z"));
    expect(verifySessionToken(token)).toBe(false);
  });

  it("throws when ADMIN_SESSION_SECRET is unset while creating a token", () => {
    delete process.env.ADMIN_SESSION_SECRET;
    expect(() => createSessionToken()).toThrow(/ADMIN_SESSION_SECRET/);
  });

  it("returns false (not throw) when ADMIN_SESSION_SECRET is unset while verifying", () => {
    const token = createSessionToken();
    delete process.env.ADMIN_SESSION_SECRET;
    expect(verifySessionToken(token)).toBe(false);
  });
});
