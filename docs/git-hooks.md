# Git hooks (Husky + commitlint)

Local safety net that runs before code is committed, per `.claude/git-push.md`.

## What runs, and when

- **`.husky/pre-commit`** — `pnpm lint && pnpm typecheck && pnpm test`,
  run with `set -e` so the first failing step aborts the commit with a
  non-zero exit code. Catches lint errors, TypeScript type errors, and
  unit test failures before they reach a commit. (Playwright e2e tests
  are intentionally excluded here — they need a running dev server and
  a browser, too slow/heavy for a hook that fires on every commit; run
  `pnpm test:e2e` manually or in CI instead.)
- **`.husky/commit-msg`** — `pnpm exec commitlint --edit "$1"`, enforcing
  [Conventional Commits](https://www.conventionalcommits.org/) via
  `commitlint.config.js` (`@commitlint/config-conventional`). Valid
  types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
  `build`, `ci`, `chore`, `revert`. Example: `feat: add hero section`,
  `fix(nav): correct mobile link wrapping`, `chore: bump dependencies`.

Both hooks are installed automatically for anyone who clones the repo
and runs `pnpm install`, via the `"prepare": "husky"` script.

## Verifying the hooks work

Both were tested directly (not just assumed) during setup:

- `commitlint`: piping a non-conventional message (`"update stuff"`)
  produced `subject may not be empty` / `type may not be empty` and
  exited 1; piping `"feat: add husky pre-commit and commitlint hooks"`
  exited 0.
- `pre-commit`: running `sh .husky/pre-commit` directly on a deliberately
  broken file (a string assigned to a `number`-typed export) failed at
  the `typecheck` step and exited 1 without reaching the test step;
  after reverting the break, the same invocation exited 0 running all
  three checks.

To re-verify after changing the hook script, run it directly rather
than trusting a real commit:

```bash
sh .husky/pre-commit; echo "exit: $?"
echo "feat: example" | pnpm exec commitlint; echo "exit: $?"
```
