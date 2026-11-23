# CLAUDE.md

Personal portfolio + bilingual blog built with Astro. Read `.specify/memory/constitution.md`
before planning any change — it is the source of truth for principles and quality gates.

## Commands

| Task                                         | Command                            |
| -------------------------------------------- | ---------------------------------- |
| Dev server                                   | `pnpm dev`                         |
| Everything CI checks (except e2e/Lighthouse) | `pnpm validate`                    |
| Unit tests / coverage                        | `pnpm test` / `pnpm test:coverage` |
| E2E + a11y (needs `pnpm build` first)        | `pnpm test:e2e`                    |
| Lighthouse                                   | `pnpm build && pnpm lhci`          |
| Types                                        | `pnpm check`                       |

## Workflow

- Features follow Spec Kit: `/speckit-specify` → `/speckit-clarify` (if ambiguous) →
  `/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` → `/speckit-implement`.
- Exempt changes (typos, deps, copy) skip specs but still use Conventional Commits.
- Before opening a PR, use the `quality-gate` skill.

## Architecture map

- `src/content.config.ts` — Zod schemas for `posts`, `projects`, `experiences`.
  Entry ids are paths (`pt/prumo`); URL slugs come from the `slug` field.
- `src/content/{posts,projects}/{pt,en}/` — content, one folder per locale.
- `src/i18n/` — `config.ts` (locales), `ui.ts` (all UI strings), `utils.ts` (`t`, `localizePath`, `formatDate`).
- `src/lib/content.ts` — pure, unit-tested helpers. `src/lib/collections.ts` — queries via `astro:content`.
- `src/pages/` — default-locale (`pt`) routes. English routes will live in `src/pages/en/`.
- `docs/architecture.md` — summary of the System Design.

## Conventions

- Route segments are English; slugs are translated (`/blog/construindo-o-prumo`, `/en/blog/building-prumo`).
- Never hard-code UI text in components: add a key to `src/i18n/ui.ts` for **both** `pt` and `en`.
- Import with the `@/` alias; type-only imports use `import type`.
- Tailwind utilities with the theme tokens (`bg-surface`, `text-ink`, `text-ink-muted`, `border-border`, `text-accent`).
- Every new page gets an entry in `tests/e2e/site.spec.ts` (renders + axe).
- Repository docs and code are in English; site content is in Portuguese first.

## Project skills

- `new-post` — create a blog post with valid frontmatter.
- `translate-content` — add the English version of a post or project.
- `add-page` — add a route with i18n strings and tests.
- `quality-gate` — run all checks and prepare a PR.
