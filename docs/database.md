# Database: Drizzle + Supabase

Drizzle ORM schema and a Data Access Layer (DAL) for storing the portfolio's
content in Supabase Postgres instead of the static object in
`lib/data/portfolio-data.ts`. `app/page.tsx` reads from this layer through
`getPortfolioRepository()`; the static file is kept as a fallback (see
[Fallback behavior](#fallback-behavior)) rather than removed. The content
is edited through the [admin dashboard](./admin-dashboard.md) at `/admin`.

## Why

`lib/data/portfolio-data.ts` hardcodes all content. Moving it to a database
lets content change without a redeploy. Every table here is a 1:1 mirror of
a type in `lib/types/portfolio.ts`, so the DTOs returned by the DAL are
identical in shape to what the components already accept.

## Schema

| Table           | File                                | Mirrors                          |
| --------------- | ------------------------------------ | --------------------------------- |
| `site_config`   | `lib/db/schema/site-config.ts`       | `SiteConfig` (+ `contactNote`)   |
| `nav_links`     | `lib/db/schema/nav-links.ts`         | `NavLink[]`                       |
| `status_items`  | `lib/db/schema/status-items.ts`      | `StatusItem[]`                    |
| `stack_layers`  | `lib/db/schema/stack-layers.ts`      | `StackLayer[]`                    |
| `projects`      | `lib/db/schema/projects.ts`          | `Project[]`                       |
| `experience`    | `lib/db/schema/experience.ts`        | `ExperienceItem[]`                |
| `contact_links` | `lib/db/schema/contact-links.ts`     | `ContactLink[]`                   |

`site_config` is a singleton: the app reads the row with the lowest `id`.
Every list table (`nav_links`, `projects`, ...) has a `position` column used
to preserve the same order the static arrays render in today.

There's also `contact_messages`
(`lib/db/schema/contact-messages.ts`), which has no static mirror — it
holds visitor submissions from the public contact form rather than
authored site content. See [docs/admin-dashboard.md](./admin-dashboard.md#contact-messages).

Import the whole schema from `lib/db/schema` (barrel export) or a single
table from its own file.

## Architecture (why it's split this way)

- **`lib/db/schema/*`** — table definitions only. One file per table
  (single responsibility); adding a table never touches an existing one.
- **`lib/db/env.ts`** — the only module that reads `DATABASE_URL` from
  `process.env`, per Next.js's
  [Data Access Layer guidance](../node_modules/next/dist/docs/01-app/02-guides/data-security.md).
- **`lib/db/client.ts`** — opens the Postgres connection and wraps it with
  Drizzle. No `server-only` marker: `drizzle-kit`, migration scripts, and
  the connectivity test all need to construct a client outside of the
  Next.js server graph, where `server-only` throws unconditionally.
- **`lib/db/check-connection.ts`** — opens a short-lived connection, runs
  `select 1`, and reports whether it succeeded. Kept separate from
  `client.ts` so it doesn't hold onto the pooled singleton connection.
- **`lib/db/repositories/portfolio-repository.ts`** — the `PortfolioRepository`
  interface. This is the abstraction the rest of the app should depend on.
- **`lib/db/repositories/drizzle-portfolio-repository.ts`** — the concrete
  Drizzle implementation. Has the `server-only` marker, since this is the
  boundary Server Components actually import.
- **`lib/db/repositories/fallback-portfolio-repository.ts`** — decorates
  another `PortfolioRepository` (Drizzle, by default) and falls back to the
  static content in `lib/data/portfolio-data.ts`, field by field, if the
  database can't be reached or a table is empty. Has the `server-only`
  marker, same as the Drizzle implementation it wraps.
- **`lib/db/repositories/index.ts`** — `getPortfolioRepository()`, the one
  place that decides which concrete implementation backs the interface.
  Currently returns a `FallbackPortfolioRepository`.

This follows the SOLID principles:

- **Single Responsibility** — each schema file owns one table; `env.ts`
  only reads env vars; `client.ts` only manages the connection;
  `check-connection.ts` only checks connectivity; each repository method
  only fetches and maps one table.
- **Open/Closed** — a new content source (e.g. a cached or REST-backed
  repository) can be added as a new class implementing
  `PortfolioRepository`, without changing existing callers.
- **Liskov Substitution** — any `PortfolioRepository` implementation is a
  drop-in replacement for another; callers only see the interface.
- **Interface Segregation** — `PortfolioRepository` only has the methods
  this one page needs, not a generic CRUD surface.
- **Dependency Inversion** — pages/components should depend on
  `PortfolioRepository` (via `getPortfolioRepository()`), never on
  `DrizzlePortfolioRepository`, `drizzle-orm`, or `postgres` directly. The
  concrete implementation also takes its `Database` handle as a
  constructor parameter, defaulting to the shared singleton, so tests can
  inject a fake instead of hitting a real database.

### Using it from a Server Component

```tsx
import { getPortfolioRepository } from "@/lib/db/repositories";

export default async function Page() {
  const repo = getPortfolioRepository();
  const projects = await repo.getProjects();
  // ...
}
```

Never import `lib/db/client.ts` or `lib/db/schema/*` directly from a page —
go through a repository so the query logic stays in one place.

## Fallback behavior

`getPortfolioRepository()` returns a `FallbackPortfolioRepository`, not the
raw Drizzle one. For each DTO it tries the Drizzle repository first and, if
constructing it fails (e.g. `DATABASE_URL` unset) or the query itself fails
(e.g. Supabase unreachable, or a table has no rows), it logs a `console.warn`
and returns the matching export from `lib/data/portfolio-data.ts` instead.
This is per-field, not all-or-nothing — e.g. `projects` can come from
Supabase while `contactLinks` falls back, if only one table is seeded.

This means the site always renders, in three states:

1. **No `.env` / no `DATABASE_URL`** — every field falls back to static data.
2. **Database reachable but tables empty** — same as above, since each
   Drizzle query throws "table has no rows" (or returns `[]` for list
   tables, which isn't an error — see the caveat below).
3. **Database reachable and seeded** — content is read live from Supabase.

An empty list table (`nav_links`, `projects`, ...) is treated the same as a
failed query: the Drizzle list methods return `[]` rather than throwing, but
`FallbackPortfolioRepository` checks for that and substitutes the static
list instead of rendering an empty section.

## Setup

1. Create a Supabase project (or use an existing one).
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to the project's
   **pooled** connection string (Project Settings → Database → Connection
   string → URI, "Transaction" mode, port `6543`). The pooler is required
   because prepared statements are disabled in `lib/db/client.ts`
   specifically to work with it (pgbouncer in transaction mode doesn't
   support them).
3. Generate and run the initial migration:

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

4. (Optional) Seed the tables with the existing static content from
   `lib/data/portfolio-data.ts` — no seed script is included yet, since no
   page reads from this layer.

## Scripts

| Script             | Purpose                                                |
| ------------------ | ------------------------------------------------------- |
| `pnpm db:generate`  | Diff the schema against `lib/db/migrations` and generate SQL |
| `pnpm db:migrate`   | Apply pending migrations to `DATABASE_URL`             |
| `pnpm db:push`      | Push the schema directly, skipping migration files (prototyping only) |
| `pnpm db:studio`    | Open Drizzle Studio against `DATABASE_URL`             |

All four load `.env` via `@next/env` in `drizzle.config.ts`, matching the
pattern documented in
[Next.js's environment variables guide](../node_modules/next/dist/docs/01-app/02-guides/environment-variables.md#loading-environment-variables-with-nextenv).

## Testing connectivity

`lib/db/__tests__/check-connection.test.ts` covers `checkDatabaseConnection`:

- One test always runs and points at an unreachable address
  (`127.0.0.1:1`) to assert failures are reported cleanly, without needing
  any real database.
- One test only runs when `DATABASE_URL` is set (`it.runIf`), so
  `pnpm test` doesn't fail in CI or on a machine with no `.env` — it
  confirms an actual round trip to Supabase when a connection string is
  available.

Run it with:

```bash
pnpm test lib/db
```
