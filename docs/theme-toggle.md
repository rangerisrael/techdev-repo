# Light / dark theme

Adds a real light theme alongside the original dark design and a
toggle to switch between them, per `.claude/lignmode-darkmode.md`.

## Architecture

Three small, single-purpose pieces (same pattern as the rest of
`components/portfolio`: separate data/behavior from markup, keep each
piece reusable on its own):

- **`app/globals.css`** — `:root` now holds a distinct **light** palette
  (warm paper background `#f7f5f0`, near-black ink text, a deepened
  blue/amber for AA contrast on light backgrounds) and `.dark` holds
  the original dark palette. Both map into the same semantic tokens
  (`--background`, `--primary`, `--border`, `--amber`, ...), so every
  component that already uses those tokens (`bg-background`,
  `text-amber`, `border-line`, etc.) switches automatically — no
  component needed to change for theming to work.
- **`hooks/use-mounted.ts`** — a generic `useMounted()` hook (via
  `useSyncExternalStore`, not `useState`+`useEffect`, to avoid the
  "setState in effect causes cascading renders" lint rule) for any
  component that needs to defer client-only rendering until after
  hydration. Not theme-specific; reusable wherever a light/dark, locale,
  or viewport value would otherwise mismatch between server and client.
- **`components/theme/theme-provider.tsx`** — thin wrapper around
  `next-themes`' `ThemeProvider`, mounted once in `app/layout.tsx` with
  `attribute="class"` (adds/removes `dark`/`light` on `<html>`),
  `defaultTheme="dark"` (keeps the original look for first-time
  visitors), and `enableSystem`.
- **`components/theme/theme-toggle.tsx`** — the actual button, dropped
  into `SiteNav`. Reads `resolvedTheme`/`setTheme` from `useTheme()`,
  shows a moon/sun (`lucide-react`) and an accessible
  `aria-label="Switch to {light|dark} mode"`, gated by `useMounted()` so
  the icon doesn't flash the wrong state before hydration.

`app/layout.tsx` no longer hardcodes `className="dark"` on `<html>`;
it's `suppressHydrationWarning` instead, since `next-themes` sets the
class itself before hydration via an inline script (no flash of the
wrong theme).

## Testing

**Unit** (`components/theme/__tests__/`, Vitest + RTL):
- `theme-toggle.test.tsx` mocks `next-themes`' `useTheme` to assert the
  icon/label reflect `resolvedTheme` in both directions, and that
  clicking calls `setTheme` with the opposite value.
- `theme-provider.test.tsx` checks the wrapper renders its children.

**End-to-end** (`e2e/theme-toggle.spec.ts`, Playwright, real Chromium):
- defaults to dark mode (asserts the `dark` class and the actual
  rendered `background-color`)
- clicking the toggle switches to light mode and repaints the page
- the choice survives a full page reload (localStorage)
- toggling switches back to dark

All 4 e2e cases were run and passed against the real dev server, not
just asserted from unit-test mocks — the theme switch, repaint, and
persistence are confirmed to actually work in a browser.
