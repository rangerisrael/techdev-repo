import { loadEnvConfig } from "@next/env";
import { describe, expect, it } from "vitest";

import { checkDatabaseConnection } from "@/lib/db/check-connection";

loadEnvConfig(process.cwd());

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

describe("checkDatabaseConnection", () => {
  it("reports a clear error for an unreachable database", async () => {
    // Nothing listens on 127.0.0.1:1, so this fails fast (ECONNREFUSED)
    // instead of hanging until postgres.js's connect timeout.
    const result = await checkDatabaseConnection(
      "postgres://invalid:invalid@127.0.0.1:1/doesnotexist"
    );

    expect(result.connected).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it.runIf(hasDatabaseUrl)(
    "connects to the configured Supabase database",
    async () => {
      const result = await checkDatabaseConnection();

      expect(result).toEqual({ connected: true });
    }
  );
});
