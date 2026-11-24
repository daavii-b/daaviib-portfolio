---
description: 'Task list for share images (Open Graph) and better page titles'
---

# Tasks: Share images (Open Graph) and better page titles

**Input**: Design documents from `specs/004-og-images/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: requested (unit: page → image path mapping, long-title wrapping/stepping; e2e: og:image on every page, 200 +
`image/png` + IHDR 1200×630, title pattern).

## Format: `[ID] [P?] [Story] Description`

US1 share preview · US2 long titles · US3 titles and descriptions

---

## Phase 1: Setup

- [x] T001 Add `satori`, `@resvg/resvg-js`, `@fontsource/space-grotesk`, `@fontsource/inter` to `package.json` dependencies (justified in plan.md)
- [x] T002 UI strings (pt, en) in `src/i18n/ui.ts`: `site.title` = "Davi Brito · Fullstack Engineer", `og.project`, `home.description`, `about.description`, `now.description`, `notFound.description`; rewrite `blog.description`, `projects.description`; all ≤ 160

## Phase 2: Foundational (blocking)

- [x] T003 [P] Unit tests then `src/lib/font-metrics.ts`: `parseWoffMetrics(buffer)` (WOFF header, zlib tables, `head.unitsPerEm`, `cmap` format 4, `hmtx`) and `measureText(metrics, text, fontSize, letterSpacing)` in `tests/unit/font-metrics.test.ts`
- [x] T004 [P] Unit tests then `ogImagePath`, `buildOgPages`, `pageTitle` in `src/lib/og.ts` / `tests/unit/og.test.ts` (data-model "OgPage", 404 fallback via `findOgPage`)

**Checkpoint**: mapping and measurement tested.

---

## Phase 3: User Story 2 — Long titles fit (P1)

- [x] T005 [US2] Unit tests then `fitTitle(title, measure, options)` in `src/lib/og.ts`: largest of 88/80/72/64/56/48 with ≤ 3 lines; greedy wrap; over-long word kept whole; truncation with "…" at a word boundary when nothing fits

## Phase 4: User Story 1 — Share preview (P1) 🎯 MVP

- [x] T006 [US1] `src/lib/og-image.ts`: `OG_COLORS` (light tokens), `loadOgFonts()` (WOFF from `node_modules`), `renderOgImage({ title, label, footer, site })` → PNG `Uint8Array` via Satori + resvg, one nowrap element per fitted line; unit tests in `tests/unit/og-image.test.ts` (PNG signature, IHDR 1200×630, < 300 KB, colours equal `--ds-*` in `global.css`)
- [x] T007 [US1] `getOgPages(lang)` and `findOgPage(lang, path)` in `src/lib/collections.ts` (uses `getCollection`, published only, no `render()`)
- [x] T008 [US1] Static endpoint `src/pages/og/[...path].png.ts` (`getStaticPaths` from `getOgPages`, `Content-Type: image/png`)
- [x] T009 [US1] `src/components/SEO.astro`: `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:image`; `src/layouts/BaseLayout.astro` resolves the entry by canonical path (404 → Home)
- [x] T010 [US1] `image` in `blogPostingJsonLd` (`src/lib/structured-data.ts` + test) and `src/pages/blog/[slug].astro`

## Phase 5: User Story 3 — Titles and descriptions (P2)

- [x] T011 [US3] `BaseLayout` uses `pageTitle`; pages pass specific descriptions: Home (`home.description`), About (`about.description`), Now (`now.description`), 404 (`notFound.description`); RSS keeps `site.title`
- [x] T012 [P] [US3] Zod: post `description` and project `summary` `.max(160)` in `src/content.config.ts`; unit test that every `*.description` UI key is ≤ 160 in `tests/unit/i18n.test.ts`

## Phase 6: Tests & polish

- [x] T013 E2E `tests/e2e/seo.spec.ts`: for `/`, `/blog`, `/projects`, `/about`, `/now`, `/blog/por-que-escolhi-astro`, `/projects/este-site`, 404: og:image absolute, same origin as canonical, 200, `image/png`, IHDR 1200×630, width/height/alt/twitter tags; title pattern; description ≤ 160; 404 uses the Home image; JSON-LD `image`
- [x] T014 Docs: `CLAUDE.md` (OG images, title pattern, new deps), `docs/architecture.md` (decision row), `.claude/skills/add-page/SKILL.md` (register OG entry)
- [x] T015 Quality gate: format, lint, check, coverage, build (check PNG sizes in `dist/og`), e2e, lhci
- [ ] T016 Mark tasks, re-check spec/plan against the build, open the PR from `004-og-images` with the LinkedIn Post Inspector note

## Found during implementation

- [x] T017 Satori root uses `box-sizing: border-box` with explicit size (research R9)
- [x] T018 `/projects` keeps its short visible lead (`projects.description`); its meta description is a new key
      `projects.metaDescription`
- [x] T019 English share images are not generated until English is enabled (`ENABLED_LOCALES`), so no image exists
      for a page that does not

## Dependencies

T001–T002 → T003/T004 (parallel) → T005 → T006 → T007 → T008, T009 → T010 → T011/T012 → T013 → T014–T016.
