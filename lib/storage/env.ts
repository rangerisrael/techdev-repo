/**
 * Single place that reads Supabase Storage env vars — mirrors
 * lib/db/env.ts's role for the database connection string. No
 * `server-only` marker here for the same reason: keep this module safe to
 * import from anywhere, and let the actual storage client (which does
 * carry the marker) be the enforced server-only boundary.
 */
export function getSupabaseUrl(): string {
  const url = process.env.SUPABASE_URL;
  if (!url) {
    throw new Error(
      "SUPABASE_URL is not set. Copy it from Project Settings -> API in the Supabase dashboard."
    );
  }
  return url;
}

export function getSupabaseSecretKey(): string {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not set. Copy the secret (service-role) key from " +
        "Project Settings -> API in the Supabase dashboard — needed server-side to " +
        "upload to Storage without going through Row Level Security."
    );
  }
  return key;
}
