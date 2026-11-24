---
description: 'Task list for the complete article page and first post'
---

# Tasks: Complete article page and first post

**Input**: Design documents from `specs/003-article/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: requested (unit for TOC, series position, related posts; e2e for the page, copy, CTA, details, JSON-LD, axe).

## Format: `[ID] [P?] [Story] Description`

US1 reading · US2 navigation · US3 series and related · US4 share · US5 structured data · US6 first post

---

## Phase 1: Setup

- [x] T001 Add `info`, `link`, `chevronLeft`, `chevronDown` icons to `src/components/icons/Icon.astro`
- [x] T002 Add `/blog/por-que-escolhi-astro` to `lighthouserc.json` (SC-001)
- [x] T003 Add UI strings (pt, en): table of contents, article navigation label, series label and "{n} de {total}", share, copy link / link copied, keep reading, code copy / copied, note label — in `src/i18n/ui.ts`

## Phase 2: Foundational (blocking)

- [x] T004 [P] Unit tests then `buildToc` (depth-2 only, order kept, data-model "Table of contents entry") in `tests/unit/toc.test.ts` and `src/lib/toc.ts`
- [x] T005 [P] Unit tests then `seriesPosition` (no series → undefined; same series + locale only; `publishedAt` asc; index/total; current flag; data-model "Series position") in `tests/unit/series.test.ts` and `src/lib/series.ts`
- [x] T006 [P] Unit tests then `relatedPosts` (excludes current; shared-tag count desc then newest; limit 3; empty) in `tests/unit/related.test.ts` and `src/lib/related.ts`
- [x] T007 [P] Unit tests then `parseCodeTitle` and `codeFrameTransformer` (figure + header + optional caption + hidden copy button) in `tests/unit/code-frame.test.ts` and `src/lib/code-frame.ts`; register it in `astro.config.mjs` (`shikiConfig.transformers`)
- [x] T008 [P] Unit tests then `blogPostingJsonLd` and `serializeJsonLd` (escapes `<`) in `tests/unit/structured-data.test.ts` and `src/lib/structured-data.ts`
- [x] T009 Styles in `src/styles/global.css`: `.code-frame` (border, surface, header row, transparent Shiki background in both themes), `.prose h2` scroll margin, `.reading-progress` (scroll-driven, `@supports` + reduced motion)

**Checkpoint**: helpers tested; code blocks framed at build.

---

## Phase 3: User Story 6 — First post (P1)

- [x] T010 [US6] Remove `src/content/posts/pt/ola-mundo.mdx`; add `src/content/posts/pt/por-que-escolhi-astro.mdx` with the provided frontmatter and body, code excerpt faithful to `src/content.config.ts`

## Phase 4: User Story 1 — Read comfortably (P1) 🎯 MVP

- [x] T011 [P] [US1] `src/components/mdx/Note.astro` (aside with label, border, surface, accent info icon, `not-prose`)
- [x] T012 [P] [US1] `src/components/CodeBlocks.astro`: localized labels + script that reveals the copy buttons and copies `<pre>` text with "Copiado" feedback via `src/scripts/clipboard.ts`
- [x] T013 [US1] Rebuild `src/pages/blog/[slug].astro`: header (back link with chevron, series tag `Tag variant="series"`, date · reading time, H1, lead), wide cover, ≥1180px grid 680/280 with sticky aside, body `<Content components={{ Note }} />`, reading progress, tags (no links), `ContactCTA`
- [x] T014 [P] [US1] Tags without links in `src/components/PostCard.astro` (no tag pages yet)

## Phase 5: User Story 2 — Navigate (P1)

- [x] T015 [US2] `src/components/TableOfContents.astro`: `aside` variant (nav list with dots, current highlighted) and `details` variant (collapsed, mobile); script with `IntersectionObserver` setting `aria-current` on the aside list
- [x] T016 [US2] Use both variants in `src/pages/blog/[slug].astro` (aside ≥1180px, details below; hidden when no headings)

## Phase 6: User Story 3 — Series and related (P2)

- [x] T017 [P] [US3] `src/components/SeriesList.astro` (numbered `01`, current highlighted with `aria-current="page"`, not linked)
- [x] T018 [US3] In `src/pages/blog/[slug].astro`: series tag text from `seriesPosition`; list in aside (≥1180px) and at the end (narrow) only when total ≥ 2; "Continue lendo" with `SectionHeader` + `PostCard` grid from `relatedPosts`, hidden when empty

## Phase 7: User Story 4 — Share (P2)

- [x] T019 [US4] `src/components/ShareLinks.astro` (copy link with feedback, LinkedIn, X; new tab; no third-party script) used in the aside and at the end on narrow screens

## Phase 8: User Story 5 — Structured data (P3)

- [x] T020 [US5] Render `blogPostingJsonLd` in `src/pages/blog/[slug].astro` as `application/ld+json`

## Phase 9: Tests & polish

- [x] T021 E2E `tests/e2e/article.spec.ts`: H1; desktop TOC with 4 items and current highlight; mobile `<details>` collapsed with 4 items; code "Copiar" copies the code and shows "Copiado"; "Copiar link" copies the canonical URL; LinkedIn/X hrefs carry the URL; ContactCTA opens the dialog with "Li seu artigo “Por que escolhi Astro para este site”"; JSON-LD parses with required fields; no series list and no "Continue lendo" with a single post; `/blog/ola-mundo` is 404
- [x] T022 Add the article URL to the axe loop in `tests/e2e/site.spec.ts` (both themes; desktop and mobile projects)
- [x] T023 Update `CLAUDE.md` (new components, authoring: code titles and `<Note>`) and `.claude/skills/new-post/SKILL.md` if it references the removed sample
- [x] T024 Quality gate: format, lint, check, coverage, build, e2e, lhci; measure new JS on the article page (≤ 2 KB gz, SC-003)
- [ ] T025 Mark tasks, re-check spec/plan against the build, open the PR from `003-article`

## Found during implementation

- [x] T026 Canonical URLs without `.html` (`canonicalPath` in `src/lib/links.ts`, used by `src/components/SEO.astro`) — research R11
- [x] T027 Syntax colours from design tokens (Shiki `css-variables` theme, `--astro-code-*` in `src/styles/global.css`) — research R10 (axe contrast)
- [x] T028 `ProjectCard` gains `headingLevel`; `/projects` uses `h2` (Lighthouse heading-order, surfaced once a project was published)

## Dependencies

Phase 1 → Phase 2 → US6 (content) → US1 → US2, US3, US4, US5 (all edit `[slug].astro`, so sequential) → Phase 9.
Within Phase 2, T004–T008 are independent ([P]); T009 after T007.

## Implementation strategy

MVP = Phases 1–4 (the post readable with code frames and notes). Then navigation, series/related, share, JSON-LD, tests.
