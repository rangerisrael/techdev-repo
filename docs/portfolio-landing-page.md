# Portfolio landing page

Static one-page developer portfolio built from the design in
`.claude/boilerplate.md` (Claude artifact `6bn2riDBZbCxeRc9p9Z7GX`): a dark,
editorial "systems" theme with a hero, a stack diagram, selected work,
an experience timeline, and a contact section.

## Architecture

The page is split into three layers so content, layout, and motion can
each change independently (SOLID: single responsibility, open/closed
for new sections):

- **Data** — `lib/types/portfolio.ts` (types) and
  `lib/data/portfolio-data.ts` (the actual copy: nav links, status rows,
  stack layers, projects, experience, contact links). Editing the site's
  content never requires touching a component.
- **Presentation** — `components/portfolio/*`. Each section
  (`hero-section`, `stack-section`, `projects-section`,
  `experience-section`, `contact-section`) is a small server component
  that takes typed data as props and renders it; shared bits
  (`section-heading`, `tag-list`, `status-panel`, `timeline-item`,
  `project-card`, `site-nav`, `site-footer`) are reused across sections
  instead of duplicated markup.
- **Motion** — `fade-in.tsx` and `stagger-in.tsx` are the only two
  `"use client"` components. They wrap `framer-motion` once and are
  composed into the server components above, so animation is opt-in
  and isolated from data/markup.

`app/page.tsx` composes all of the above; `app/layout.tsx` loads the
three fonts (Fraunces for headings, IBM Plex Sans for body, IBM Plex
Mono for labels/code-like text) and forces the `dark` theme.

## Styling

Tailwind v4, CSS-first config. The design's dark palette (background,
surface, line/border, muted text, blue accent, amber highlight) is
defined as CSS variables in `app/globals.css` under `:root, .dark`,
mapped into shadcn's semantic tokens (`--background`, `--primary`,
`--border`, etc.) plus two portfolio-specific tokens (`--amber`,
`--surface-2`) exposed as Tailwind utilities (`text-amber`,
`bg-surface-2`, `border-line`).

UI primitives (`Button`, `Badge`, `Separator` in `components/ui/`) come
from `shadcn` (this project's version renders on `@base-ui/react`, not
Radix — polymorphism uses the `render` prop, e.g.
`<Button render={<a href="..." />}>`, not `asChild`). Class merging
goes through `cn()` in `lib/utils.ts`.

## Testing

Vitest + React Testing Library, environment `happy-dom` (jsdom 30 has a
known conflict with the pnpm-hoisted `undici` version that breaks
`vitest`'s worker startup — `happy-dom` avoids it and is a supported
Vitest environment). Every reusable component in `components/portfolio`
has a colocated test under `__tests__/` asserting it renders the data
it's given; `lib/__tests__/utils.test.ts` covers the `cn()` helper.

```bash
pnpm test        # run once
pnpm test:watch  # watch mode
```

## End-to-end tests

`e2e/landing-page.spec.ts` (Playwright) drives the page in a real
Chromium browser: title/hero content, nav-link anchor scrolling, hero
CTA hrefs, and presence of every section (stack, work, experience,
contact).

```bash
pnpm test:e2e      # run once (chromium)
pnpm test:e2e:ui   # interactive UI mode
```

`playwright.config.ts` points at `http://localhost:3000` and reuses an
already-running `pnpm dev` server (`reuseExistingServer: true`)
instead of spawning its own — Next.js 16 refuses to start a second
`next dev` for the same project directory even on a different port, so
don't change the config to spawn on an alternate port while a dev
server is already up. In CI (no server running yet, `CI` env set) it
runs `pnpm dev` itself on port 3000.

Vitest's `exclude` list explicitly skips `e2e/**` so `pnpm test` doesn't
try to execute the Playwright specs with the wrong test runner.

## Editing content

To change what the page says, edit `lib/data/portfolio-data.ts` only —
add a project to the `projects` array, a role to `experience`, a link
to `contactLinks`, etc. No component changes needed unless the shape
of a section itself is changing.
