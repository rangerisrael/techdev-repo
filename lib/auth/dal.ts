import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { SESSION_COOKIE_NAME, verifySessionToken } from "./session";

/**
 * Data Access Layer entry point for the admin session, per Next.js's
 * authentication guide: centralize the check here and call it from every
 * admin page/layout and every admin Server Action, rather than trusting
 * that a page was reached through the UI (Server Actions are POST
 * endpoints reachable directly, so render-time gating alone isn't a
 * security boundary).
 */
export const isAdminSession = cache(async (): Promise<boolean> => {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
});

/** Redirects to the login page when there is no valid admin session. */
export async function requireAdminSession(): Promise<void> {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }
}
