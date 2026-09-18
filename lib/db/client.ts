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
  // `max: 5` bounds each process's own connection pool (each parallel
  // `next build` static-generation worker gets its own) well below the
  // postgres.js default of 10, without pinning it to a single connection —
  // a page that fires off several queries concurrently via `Promise.all`
  // needs more than one, or they end up serialized onto the same socket
  // and can stall waiting on the transaction-mode pooler.
  const client = postgres(connectionString, { prepare: false, max: 5 });
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
