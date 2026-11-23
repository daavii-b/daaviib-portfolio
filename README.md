# Portfolio & Blog

Personal portfolio and bilingual (pt/en) blog built with [Astro](https://astro.build), developed with
[Spec-Driven Development](https://github.com/github/spec-kit).

## Stack

Astro · TypeScript (strictest) · Tailwind CSS v4 · MDX · Vitest · Playwright + axe · Lighthouse CI · Vercel

## Getting started

```bash
nvm use            # Node 22
corepack enable    # pnpm
pnpm install
pnpm dev           # http://localhost:4321
```

## Scripts

| Script                        | What it does                                       |
| ----------------------------- | -------------------------------------------------- |
| `pnpm dev`                    | Dev server (drafts visible)                        |
| `pnpm build` / `pnpm preview` | Production build / serve `dist/`                   |
| `pnpm validate`               | Format check, lint, types, unit tests, build       |
| `pnpm test:coverage`          | Unit tests with coverage thresholds                |
| `pnpm test:e2e`               | Playwright e2e + accessibility (run after `build`) |
| `pnpm lhci`                   | Lighthouse CI budgets (≥ 95 in every category)     |

## How we work

- **Specs first.** Features go through Spec Kit: `/speckit-specify` → `/speckit-plan` →
  `/speckit-tasks` → `/speckit-implement`. Principles live in
  [`.specify/memory/constitution.md`](.specify/memory/constitution.md).
- **Conventional Commits**, enforced by commitlint (hook + CI).
- **Quality gates in CI:** format, lint, `astro check`, unit coverage, build, e2e + axe, Lighthouse, PR title.
- Agent guidance and project skills: [`CLAUDE.md`](CLAUDE.md), [`.claude/skills/`](.claude/skills).

See [`docs/architecture.md`](docs/architecture.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Project structure

```
src/
  content/            # MDX/JSON content, one folder per locale
  content.config.ts   # Zod schemas
  i18n/               # locales, UI strings, helpers
  lib/                # pure helpers (unit-tested) and collection queries
  components/ layouts/ pages/ styles/
specs/                # Spec Kit feature specs (spec, plan, tasks)
tests/unit/ tests/e2e/
```
