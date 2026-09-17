import { sql } from "drizzle-orm";

import { createDbClient } from "./client";

export interface ConnectionCheckResult {
  connected: boolean;
  error?: string;
}

/**
 * Opens a short-lived connection, runs `select 1`, and always closes it.
 * Kept separate from `client.ts` (SRP) so both the connectivity test and
 * any future health-check endpoint can reuse it without holding onto the
 * pooled singleton connection.
 */
export async function checkDatabaseConnection(
  connectionString?: string
): Promise<ConnectionCheckResult> {
  let handle: ReturnType<typeof createDbClient>;

  try {
    handle = createDbClient(connectionString);
  } catch (error) {
    return { connected: false, error: (error as Error).message };
  }

  try {
    await handle.db.execute(sql`select 1`);
    return { connected: true };
  } catch (error) {
    return { connected: false, error: (error as Error).message };
  } finally {
    await handle.client.end({ timeout: 5 });
  }
}
