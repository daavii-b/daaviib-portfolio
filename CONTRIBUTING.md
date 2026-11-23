# Contributing

## Flow

1. **Feature?** Create a spec: `/speckit-specify <description>` (creates `specs/NNN-name/` and branch `NNN-name`).
   Clarify with `/speckit-clarify`, then `/speckit-plan`, `/speckit-tasks`, `/speckit-analyze`, `/speckit-implement`.
2. **Small change?** (typo, copy, dependency) Branch `type/short-name`, no spec needed.
3. Commit with [Conventional Commits](https://www.conventionalcommits.org): `feat(blog): add tag pages`.
4. Run `pnpm validate` (and `pnpm test:e2e` for UI changes) before pushing.
5. Open a PR using the template. CI must be green; `main` is protected.

## Definition of Done

- Spec, plan and tasks reflect what was built.
- Unit tests for logic; e2e + axe for pages; coverage thresholds hold.
- No hard-coded UI strings; `pt` and `en` keys exist.
- Lighthouse ≥ 95; works in light and dark themes and on mobile.
- Docs updated (`docs/architecture.md`, `CLAUDE.md`) when conventions change.

## Recommended GitHub settings

- Branch protection on `main`: require PR, require status checks
  (`Lint, types & unit tests`, `Build, e2e & Lighthouse`, `Conventional commits`, `conventional-title`), linear history.
- Merge strategy: squash merge, PR title as commit message.
- Optional: install the [Lighthouse CI GitHub App](https://github.com/apps/lighthouse-ci) and add `LHCI_GITHUB_APP_TOKEN` as a secret for status checks on PRs.
