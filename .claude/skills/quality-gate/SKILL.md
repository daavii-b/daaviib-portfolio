---
name: quality-gate
description: Run every check CI runs, fix failures, and prepare a Conventional Commit and PR description. Use before committing a feature, before opening a PR, or when asked to verify the project.
---

# Quality gate

Run in order and stop to fix at the first failure (never weaken a rule or threshold to pass):

1. `pnpm format` — then `pnpm format:check`.
2. `pnpm lint` — fix, don't disable rules. An `eslint-disable` needs a comment explaining why.
3. `pnpm check` — Astro + TypeScript (strictest).
4. `pnpm test:coverage` — thresholds: 90% lines/functions/statements, 85% branches.
5. `pnpm build` — fails on invalid content frontmatter.
6. `pnpm test:e2e` — all pages render with zero axe violations.
   (No Playwright browser locally? `PW_EXECUTABLE_PATH=/path/to/chrome pnpm test:e2e`.)
7. `pnpm lhci` — Lighthouse ≥ 95 in all categories (optional locally, enforced in CI).

Then:

- Check the spec/plan/tasks in `specs/` still match what was built; update them if not.
- Commit with Conventional Commits: `type(scope): summary` — types `feat|fix|docs|refactor|test|chore|ci|perf`,
  scopes from `commitlint.config.js`.
- PR description follows `.github/PULL_REQUEST_TEMPLATE.md` and links the spec.
