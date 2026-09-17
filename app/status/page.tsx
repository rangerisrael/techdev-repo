import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { checkDatabaseConnection } from "@/lib/db/check-connection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "System status",
  robots: { index: false, follow: false },
};

async function runTimedConnectionCheck() {
  const start = Date.now();
  const connection = await checkDatabaseConnection();
  return { connection, latencyMs: Date.now() - start, checkedAt: new Date() };
}

export default async function StatusPage() {
  const { connection, latencyMs, checkedAt } = await runTimedConnectionCheck();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          System status
        </h1>
        <p className="text-sm text-muted-foreground">
          Live check run on every request — reload to test again after a
          deploy.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">Database</p>
          <Badge variant={connection.connected ? "default" : "destructive"}>
            {connection.connected ? "Connected" : "Unreachable"}
          </Badge>
        </div>

        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-muted-foreground">Checked at</dt>
          <dd className="text-foreground">{checkedAt.toISOString()}</dd>

          <dt className="text-muted-foreground">Latency</dt>
          <dd className="text-foreground">{latencyMs}ms</dd>

          <dt className="text-muted-foreground">Environment</dt>
          <dd className="text-foreground">
            {process.env.NODE_ENV ?? "unknown"}
          </dd>

          {connection.error ? (
            <>
              <dt className="text-muted-foreground">Error</dt>
              <dd className="break-words text-destructive">
                {connection.error}
              </dd>
            </>
          ) : null}
        </dl>
      </div>

      <p className="text-xs text-muted-foreground">
        Machine-readable version at{" "}
        <code className="rounded bg-muted px-1 py-0.5">/api/health</code>{" "}
        (returns 200 when connected, 503 otherwise).
      </p>
    </div>
  );
}
