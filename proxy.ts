import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

/**
 * Optimistic auth check for /admin/**: reads the session cookie only (no
 * database round trip), matching Next.js's Proxy guidance to keep this
 * fast since it runs on every matched request. The secure check —
 * `requireAdminSession()` — still runs in the admin layout and in every
 * Server Action; this just avoids rendering the dashboard shell for an
 * obviously logged-out visitor.
 */
export function proxy(request: NextRequest) {
  const isLoggedIn = verifySessionToken(
    request.cookies.get(SESSION_COOKIE_NAME)?.value
  );
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
