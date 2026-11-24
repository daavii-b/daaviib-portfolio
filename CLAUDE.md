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
- Design tokens live in `src/styles/global.css` (source: the **daaviib — Design System** artifact). Use only token utilities:
  colors `bg-bg`, `bg-surface`, `bg-surface-raised`, `text-text`, `text-text-muted`, `border-border`, `border-border-strong`,
  `text-accent`/`bg-accent`, `bg-accent-subtle`, `text-on-accent`, `text-accent-2` (detail only: series, code keywords);
  type `text-display-xl|lg`, `text-heading-lg|md|sm`, `text-eyebrow`, `text-meta` (dates/reading time only);
  widths `max-w-measure` (680, reading), `max-w-content` (1080, grids), `max-w-wide` (1280, header/footer).
  Never write raw hex/rgb in components. One accent (cobalt) per screen; borders, not shadows.
- Reuse components before writing markup: `ui/Button`, `ui/Tag`, `ui/PostCover`, `PostCard`, `ProjectCard`, `PostList`,
  `ContactCTA`, `icons/Icon`. Any element with `data-contact-open` (a `mailto:` link) opens the contact dialog.
- Contact data and availability: `src/config/site.ts`. Pages pass `contact={{ kind, title? }}` and `section` to `BaseLayout`.
- shadcn/ui is deferred; token names already have shadcn aliases (`--background`, `--primary`…) for a later `shadcn init`.
- Every new page gets an entry in `tests/e2e/site.spec.ts` (renders + axe).
- Repository docs and code are in English; site content is in Portuguese first.

## Astro knowledge

- MCP server `astro-docs` (`.mcp.json`, official, https://mcp.docs.astro.build/mcp): search the current Astro docs.
  Use it for anything version-specific — this project runs **Astro 7**.
- Skills `astro-framework` (reference + rules) and `learning-astro` (interactive tutorial) come from
  [delineas/astro-framework-agents](https://github.com/delineas/astro-framework-agents) (MIT). They were written for
  Astro 5+; when they disagree with the docs MCP or with this repo's code, the MCP and the repo win.

## Project skills

- `new-post` — create a blog post with valid frontmatter.
- `translate-content` — add the English version of a post or project.
- `add-page` — add a route with i18n strings and tests.
- `quality-gate` — run all checks and prepare a PR.
