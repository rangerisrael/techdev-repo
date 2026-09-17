import "server-only";

import crypto from "node:crypto";

/**
 * Constant-time comparison against ADMIN_PASSWORD, so response timing
 * doesn't leak how many leading characters of a guess were correct.
 */
export function verifyAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Copy .env.example to .env and set an " +
        "admin password."
    );
  }

  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  if (candidateBuffer.length !== expectedBuffer.length) {
    // Run timingSafeEqual anyway (against a same-length buffer) so a
    // length mismatch doesn't short-circuit faster than a content mismatch.
    crypto.timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }

  return crypto.timingSafeEqual(candidateBuffer, expectedBuffer);
}
