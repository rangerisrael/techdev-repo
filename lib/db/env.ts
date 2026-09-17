/**
 * Single place that reads DB-related env vars, per the Next.js Data
 * Access Layer guideline: only the DAL touches `process.env` for secrets.
 * No `server-only` marker here — `drizzle.config.ts`, migration scripts,
 * and the connectivity test import this outside of the Next.js server
 * graph, where `server-only` throws unconditionally. The marker lives on
 * `lib/db/repositories/*` instead, which is the boundary Server
 * Components actually import.
 */
export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and set it to your " +
        "Supabase connection string (Project Settings -> Database -> Connection string)."
    );
  }
  return url;
}
