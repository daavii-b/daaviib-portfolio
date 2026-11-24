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

- `src/content.config.ts` — Zod schemas for `posts`, `projects`, `experiences` (`kind` work|study, optional `summary`),
  `now` (Home panel and `/now`) and `about` (About-page content per locale).
  Entry ids are paths (`pt/prumo`); URL slugs come from the `slug` field.
- `src/content/{posts,projects}/{pt,en}/` — content, one folder per locale.
- `src/i18n/` — `config.ts` (locales), `ui.ts` (all UI strings), `utils.ts` (`t`, `localizePath`, `formatDate`).
- `src/lib/content.ts` — pure, unit-tested helpers. `src/lib/collections.ts` — queries via `astro:content`.
- `src/pages/` — default-locale (`pt`) routes. English routes will live in `src/pages/en/`.
- `src/lib/og.ts` + `og-image.ts` + `font-metrics.ts` — share images (Open Graph): one 1200×630 PNG per page, rendered at
  build by `src/pages/og/[...path].png.ts` (Satori + resvg, static WOFF fonts from `@fontsource/*`). `buildOgPages` is
  the single list of pages with images; `BaseLayout` declares the image found by canonical path (404 → Home image).
- `docs/architecture.md` — summary of the System Design.

## Conventions

- Route segments are English; each locale's entry declares its own `slug` (`/blog/<slug>`, `/en/blog/<slug>`). Whether
  English slugs are translated or kept equal to the Portuguese ones is still open: the code supports both.
- English posts are written by the author in English, not translated from Portuguese.
- Never hard-code UI text in components: add a key to `src/i18n/ui.ts` for **both** `pt` and `en`.
- Import with the `@/` alias; type-only imports use `import type`.
- Design tokens live in `src/styles/global.css` (source: the **daaviib — Design System** artifact). Use only token utilities:
  colors `bg-bg`, `bg-surface`, `bg-surface-raised`, `text-text`, `text-text-muted`, `border-border`, `border-border-strong`,
  `text-accent`/`bg-accent`, `bg-accent-subtle`, `text-on-accent`, `text-accent-2` (detail only: series, code keywords);
  type `text-display-xl|lg`, `text-heading-lg|md|sm`, `text-eyebrow`, `text-meta` (dates/reading time only);
  widths `max-w-measure` (680, reading), `max-w-content` (1080, grids), `max-w-wide` (1280, header/footer).
  Never write raw hex/rgb in components. One accent (cobalt) per screen; borders, not shadows.
- Reuse components before writing markup: `ui/Button` (`solid` on patterned surfaces), `ui/Tag`, `ui/PostCover`, `PostCard`,
  `ProjectCard`, `PostList`, `ContactCTA`, `SectionHeader`, `DefinitionList`, `ExperienceList`, `ClosingBox`,
  `AvailabilityLine`, `CopyEmailButton`, `TableOfContents`, `SeriesList`, `ShareLinks`, `CodeBlocks`, `mdx/Note`, `icons/Icon`. Browser-only helpers live in `src/scripts/` (e.g. `clipboard.ts`). Any element with `data-contact-open` (a `mailto:` link) opens the contact dialog.
- Contact data and availability: `src/config/site.ts`. Pages pass `contact={{ kind, title? }}` and `section` to `BaseLayout`.
- shadcn/ui is deferred; token names already have shadcn aliases (`--background`, `--primary`…) for a later `shadcn init`.
- Every new page gets an entry in `tests/e2e/site.spec.ts` (renders + axe) and `tests/e2e/seo.spec.ts` (title + image);
  static pages also get an entry in `STATIC_PAGES` (`src/lib/og.ts`) so they get their own share image.
- Titles: `BaseLayout` renders "{title} · Davi Brito" (Home: no `title` → "Davi Brito · Fullstack Engineer"). Every page
  passes a specific `description` ≤ 160 characters (UI keys tested; post `description`/project `summary` capped by Zod).
- Optional files render only when present: CV at `public/cv/davi-brito-cv.pdf`, portrait at `src/assets/about/davi.jpg`.
- Content links to site paths go through `resolveInternalLink` so drafts never become 404 links.
- Articles: code fences accept `title="file.ts"` (framed by `src/lib/code-frame.ts`, a Shiki transformer); `<Note>` is
  passed to MDX by the article page; syntax colours come from design tokens (`--astro-code-*` in `global.css`).
  Tags render without links until tag pages exist.
- Repository docs and code are in English; site content is in Portuguese first.

## Astro knowledge

- MCP server `astro-docs` (`.mcp.json`, official, https://mcp.docs.astro.build/mcp): search the current Astro docs.
  Use it for anything version-specific — this project runs **Astro 7**.
- Skills `astro-framework` (reference + rules) and `learning-astro` (interactive tutorial) come from
  [delineas/astro-framework-agents](https://github.com/delineas/astro-framework-agents) (MIT). They were written for
  Astro 5+; when they disagree with the docs MCP or with this repo's code, the MCP and the repo win.

## Project skills

- `write-post` — draft or revise a blog post in the author's voice: valid frontmatter, facts from the repo, anti-slop
  rules and `scripts/slop-check.mjs`.
- `translate-content` — add the English version of a post (written by the author) or project, and enable `/en` routes.
- `add-page` — add a route with i18n strings and tests.
- `quality-gate` — run all checks and prepare a PR.
