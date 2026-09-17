import "server-only";

import crypto from "node:crypto";

/**
 * Minimal signed-cookie session for the single-admin dashboard (app/admin).
 * There's no user table, so this intentionally skips an auth library: the
 * only thing to authenticate is "knows the admin password." The token is a
 * base64url JSON payload plus an HMAC-SHA256 signature, following the
 * stateless-session pattern in Next.js's authentication guide
 * (node_modules/next/dist/docs/01-app/02-guides/authentication.md).
 */
export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

interface SessionPayload {
  role: "admin";
  exp: number;
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Copy .env.example to .env and set it " +
        "to a random string, e.g. the output of `openssl rand -base64 32`."
    );
  }
  return secret;
}

function sign(value: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

export function createSessionToken(): string {
  const payload: SessionPayload = {
    role: "admin",
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

/**
 * Verifies a session token. Never throws — a missing/misconfigured
 * ADMIN_SESSION_SECRET or a malformed token are both just "not logged in",
 * since this runs on every /admin request from Proxy as well as from the
 * DAL (see lib/auth/dal.ts).
 */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const [body, signature] = token.split(".");
  if (!body || !signature) return false;

  try {
    const expected = sign(body);
    const actual = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (
      actual.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(actual, expectedBuffer)
    ) {
      return false;
    }

    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as SessionPayload;
    return payload.role === "admin" && payload.exp > Date.now();
  } catch (error) {
    console.warn(
      "[admin-auth] session verification failed:",
      error instanceof Error ? error.message : error
    );
    return false;
  }
}
