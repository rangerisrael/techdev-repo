import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getDatabaseUrl } from "./env";
import * as schema from "./schema";

/**
 * Low-level connection only — no `server-only` marker here on purpose.
 * `drizzle.config.ts`, migration scripts, and the connectivity test all
 * need to create a client outside of the Next.js server graph, where
 * `server-only` would throw. Application code should go through
 * `lib/db/repositories/*` instead of importing this module directly.
 */
export function createDbClient(connectionString = getDatabaseUrl()) {
  // Supabase's pooled connection (pgbouncer, transaction mode) does not
  // support prepared statements, so they're disabled unconditionally.
  const client = postgres(connectionString, { prepare: false });
  return { client, db: drizzle(client, { schema }) };
}

type GlobalWithDb = typeof globalThis & {
  __dbClient?: ReturnType<typeof createDbClient>;
};

const globalForDb = globalThis as GlobalWithDb;

/**
 * Cached across module reloads in dev so `next dev` (Fast Refresh) doesn't
 * open a new Postgres connection on every edit.
 */
export function getDb(): Database {
  if (!globalForDb.__dbClient) {
    globalForDb.__dbClient = createDbClient();
  }
  return globalForDb.__dbClient.db;
}

export type Database = ReturnType<typeof createDbClient>["db"];
