import { NextResponse } from "next/server";

import { checkDatabaseConnection } from "@/lib/db/check-connection";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const result = await checkDatabaseConnection();
  const latencyMs = Date.now() - start;

  return NextResponse.json(
    {
      status: result.connected ? "ok" : "error",
      database: {
        connected: result.connected,
        latencyMs,
        error: result.error,
      },
      timestamp: new Date().toISOString(),
    },
    { status: result.connected ? 200 : 503 }
  );
}
