import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseSecretKey, getSupabaseUrl } from "./env";

/**
 * Server-only Supabase client authenticated with the secret (service-role)
 * key, used exclusively for admin-uploaded blog images — it bypasses
 * Storage's Row Level Security, so it must never be created in code that
 * could run in the browser. Cached across module reloads in dev the same
 * way `lib/db/client.ts` caches its Postgres connection.
 */
function createStorageClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: { persistSession: false },
  });
}

type GlobalWithStorage = typeof globalThis & {
  __supabaseStorageClient?: SupabaseClient;
};

const globalForStorage = globalThis as GlobalWithStorage;

export function getStorageClient(): SupabaseClient {
  if (!globalForStorage.__supabaseStorageClient) {
    globalForStorage.__supabaseStorageClient = createStorageClient();
  }
  return globalForStorage.__supabaseStorageClient;
}
