# Admin dashboard

A password-protected dashboard at `/admin` for editing the content in
`docs/database.md`'s schema without touching code or redeploying. It's the
write side of that same schema — `app/page.tsx` reads it through
`PortfolioRepository`, `app/admin/**` writes it through
`PortfolioAdminRepository`.

## Setup

Add two variables to `.env` (see `.env.example`), alongside `DATABASE_URL`:

```bash
ADMIN_PASSWORD="choose-a-strong-password"
ADMIN_SESSION_SECRET="$(openssl rand -base64 32)"
```

- `ADMIN_PASSWORD` — the single password that unlocks `/admin`. There's no
  user table; this is intentionally the simplest thing that could work for
  a single-owner portfolio site.
- `ADMIN_SESSION_SECRET` — signs the session cookie. Changing it invalidates
  every existing session.

Without these set, `/admin/login` renders but every login attempt fails
with "Admin login isn't configured yet." — it does not crash the public
site, since the public site's data layer (`FallbackPortfolioRepository`)
doesn't depend on auth at all.

## How auth works

- **`lib/auth/session.ts`** — signs/verifies a session token: a base64url
  JSON payload (`{ role: "admin", exp }`) plus an HMAC-SHA256 signature.
  No JWT library, no session table — see the file comment for why this is
  enough for a single admin password.
- **`lib/auth/password.ts`** — constant-time comparison against
  `ADMIN_PASSWORD`, so response timing doesn't leak how much of a guess was
  correct.
- **`lib/auth/dal.ts`** — the Data Access Layer entry point:
  `requireAdminSession()` redirects to `/admin/login` when the cookie is
  missing/invalid/expired. Called from the dashboard layout **and** from
  every Server Action, per Next.js's authentication guide — Server Actions
  are POST endpoints reachable directly, so a check only in the layout
  isn't a real security boundary.
- **`proxy.ts`** (project root) — an optimistic, cookie-only check that
  redirects logged-out visitors away from `/admin/**` before the dashboard
  even renders. This is a fast path, not the security boundary; the DAL
  check is. (`middleware.ts` is deprecated in this Next.js version — see
  `node_modules/next/dist/docs/.../proxy.md`.)
- **`app/admin/login/actions.ts`** — `login()` verifies the password and
  sets the cookie; `logout()` deletes it.

## Data layer

- **`lib/db/repositories/portfolio-admin-repository.ts`** — the
  `PortfolioAdminRepository` interface: one `list`/`create`/`update`/
  `delete` group per list table, plus `getSiteConfig`/`upsertSiteConfig`
  for the singleton. Kept separate from the read-only
  `PortfolioRepository` (Interface Segregation) so the public repository
  never grows mutation methods it doesn't need.
- **`lib/db/repositories/drizzle-portfolio-admin-repository.ts`** — the
  Drizzle implementation.
- **`getPortfolioAdminRepository()`** in `lib/db/repositories/index.ts` is
  the composition root, same pattern as `getPortfolioRepository()`.

Unlike the public repository, this one has **no fallback decorator**. If
Supabase is unreachable, admin pages should show an error, not silently
no-op against static data that can't be persisted back to.

## Pages

Each table has a page under `app/admin/(dashboard)/<table>/`: a list of
rows, each an inline edit form with Save/Delete, plus an "add new" form.
`stack_layers` and `projects` store `tags` as a Postgres array; the form
takes a comma-separated string and splits it. Ordering is a plain numeric
`position` field — no drag-and-drop.

Every mutation calls `revalidatePath("/")` after writing, so the public
homepage reflects the change immediately (see
[Next.js's revalidation guide](../node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md#revalidate-data)).

These admin pages intentionally stay plain `<form action={serverAction}>`
markup (Save/Delete/Add), not react-hook-form — they're simple field-count
forms with no client-side validation UX beyond `required`, and native form
actions give free progressive enhancement. The public contact form (below)
uses react-hook-form + zod instead, because it benefits from instant
per-field validation before a submit ever reaches the server.

## Contact messages

`app/admin/(dashboard)/messages/` lists visitor submissions from the
public contact form (`components/portfolio/contact-form.tsx`), newest
first, with mark read/unread and delete. The dashboard nav shows an unread
count badge next to "Messages".

- **`lib/validation/contact-message.ts`** — `contactMessageSchema`, a zod
  schema shared by both sides: the client's `zodResolver` (instant
  per-field errors as the visitor types) and the server action's
  `safeParse` (defense in depth — Server Actions are POST endpoints
  reachable directly, so the client's validation is never trusted alone).
- **`components/portfolio/contact-form.tsx`** — a Client Component using
  react-hook-form's `useForm`/`handleSubmit`. Unlike the admin forms, this
  one calls the Server Action directly from `onSubmit` (inside
  `startTransition`) rather than via `<form action>`, since react-hook-form
  owns submission. A hidden "company" field (plain `useState`, not part of
  the zod schema) is a honeypot — a filled-in value is treated as a bot and
  silently reported as success.
- **`components/portfolio/contact-actions.ts`** — `submitContactMessage()`,
  re-validates with the same schema and writes through
  `ContactMessageRepository`.
- **`lib/db/repositories/contact-message-repository.ts`** +
  `drizzle-contact-message-repository.ts` — its own repository, separate
  from `PortfolioRepository`/`PortfolioAdminRepository`, since visitor
  messages are a different domain (not authored site content) with a
  different access pattern (public create, admin-only read/manage). Wired
  up as `getContactMessageRepository()` in `lib/db/repositories/index.ts`.
- **`contact_messages`** table (`lib/db/schema/contact-messages.ts`) — the
  one table with no static-data mirror; see `docs/database.md`.

## Testing

`lib/auth/__tests__/session.test.ts` and `password.test.ts` cover token
forgery, tampering, expiry, and the constant-time password check.
`lib/validation/__tests__/contact-message.test.ts` covers the zod schema
(trimming, each field's rules, multiple simultaneous errors). There's no
automated end-to-end test for the CRUD flows or the contact form because
this project has no isolated test database — running one against the real
Supabase instance on every `pnpm test:e2e` would mutate live content. Both
were verified manually with Playwright against the dev server instead:
admin login/wrong-password/create/edit/delete round trips, and the contact
form's client-side zod errors, a real submission landing in the admin
Messages list, and cleanup.

Vitest also aliases the `server-only` package to a no-op
(`vitest.config.ts` + `vitest.server-only-stub.ts`), matching how Next.js's
bundler treats it outside of an actual client bundle. Without this, any
test that renders `ContactSection` would crash: it's a Server/Client
Component tree that transitively imports `contact-actions.ts` →
`lib/db/repositories` → `server-only`, and Vitest (unlike Next.js) doesn't
split client/server module graphs.
