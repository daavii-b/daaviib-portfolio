---
description: 'Task list for the complete Home and About pages'
---

# Tasks: Complete Home and About pages

**Input**: Design documents from `specs/002-home-about/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: requested in the feature description (unit for the new helpers; e2e for Home and About, optional assets and axe).

**Organization**: grouped by user story; each story can be built and checked on its own after Phase 2.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: US1 Home · US2 About · US3 optional assets · US4 Now page

---

## Phase 1: Setup

- [x] T001 Add the download icon to `src/components/icons/Icon.astro`
- [x] T002 Add `/now` to the Lighthouse URLs in `lighthouserc.json` (SC-001)

---

## Phase 2: Foundational (blocking)

**Purpose**: content model, pure helpers, shared components and UI strings every story uses.

- [x] T003 Extend `experiences` with `kind` (`work`|`study`, default `work`) and optional `summary` (LocalizedText); add `now` and `about` data collections per data-model.md (`Experience.kind`, `Experience.summary`, `Now entry.*`, `About profile.*`) in `src/content.config.ts`
- [x] T004 [P] Unit tests first for `sortExperiences` (newest `start` first, current before ended on ties) and `formatPeriod` (`ago 2023 — atual`, `Aug 2023 — present`, `mai 2023 — ago 2023`, years-only `2020 — 2023` for `Experience.kind = study`) in `tests/unit/experience.test.ts`
- [x] T005 [P] Implement `sortExperiences`, `formatPeriod` and `localized` (pt fallback for `LocalizedText`) in `src/lib/experience.ts`
- [x] T006 [P] Unit tests for `resolveInternalLink` (external kept, built path kept, unbuilt path dropped, trailing slash normalised) in `tests/unit/links.test.ts` and implement it in `src/lib/links.ts` (data-model `Now entry.items.href`)
- [x] T007 [P] Unit tests for `publicFileExists` (present/absent file under a temp root) in `tests/unit/files.test.ts` and implement it in `src/lib/files.ts`
- [x] T008 Add `getExperiences(kind?)` (sorted via `sortExperiences`), `getNow(lang)`, `getAboutProfile(lang)` and `getPublishedPaths(lang)` to `src/lib/collections.ts`
- [x] T009 [P] Add the UI strings for Home, About, Now, the closing boxes, the CV button and copy feedback (pt and en) to `src/i18n/ui.ts`
- [x] T010 [P] Create `src/components/AvailabilityLine.astro` (green dot + `SITE.availability` label, renders nothing when off; `size` sm|md) and use it in `src/components/ContactDialog.astro`
- [x] T011 [P] Create `src/components/SectionHeader.astro` (h2 with id + optional "label →" link)
- [x] T012 [P] Create `src/components/DefinitionList.astro` (rows of term/text with optional detail and href; `termStyle` eyebrow|meta; `termWidth` narrow 112px|wide 180px; stacks on narrow screens)
- [x] T013 [P] Create `src/components/ExperienceList.astro` (period · role · company; `variant` summary|highlights) using `formatPeriod` and `localized`
- [x] T014 [P] Create `src/components/ClosingBox.astro` (dot-pattern surface, h2, text, actions slot)
- [x] T015 Extract the clipboard logic from `src/components/ContactDialog.astro` into `src/scripts/clipboard.ts` (`copyText` with selection fallback, `flagCopied`) and make the dialog use it; dialog e2e stays green

**Checkpoint**: content validates, helpers tested, shared components ready.

---

## Phase 3: User Story 1 — Home (P1) 🎯 MVP

**Goal**: the Home page as approved, from real content.

**Independent Test**: build, open `/`: hero, "Agora" panel, featured projects, (latest articles when published), experience, closing box; copy works.

- [x] T016 [P] [US1] Create the experience files `src/content/experiences/full-stack-engineer-ax4b.json` and `python-developer-ax4b.json` with the provided role, dates, summary and highlights
- [x] T017 [P] [US1] Create `src/content/now/pt.json` (updatedAt 2026-11-23; Construindo → `/projects/prumo`, Escrevendo, Estudando, Aprendendo)
- [x] T018 [P] [US1] Create `src/content/projects/pt/este-site.mdx` per data-model.md (`Project "Este site"`)
- [x] T019 [P] [US1] Create `src/components/CopyEmailButton.astro` (secondary button with the email in mono; copies via `src/scripts/clipboard.ts`; check icon + polite `role="status"` "Email copiado")
- [x] T020 [US1] Rebuild `src/pages/index.astro`: hero 7/5 with `AvailabilityLine`, heading, intro, buttons and the "Agora" panel (`DefinitionList`, links via `resolveInternalLink`); featured projects (2 cols); latest 3 posts (`PostList`); work experience (`ExperienceList` summary); `ClosingBox` with "Fale comigo" + `CopyEmailButton`; every section hidden when empty
- [x] T021 [US1] E2E in `tests/e2e/home.spec.ts`: sections and order, "Prumo" not linked in production, experience periods, closing-box dialog and copy confirmation, and no placeholder text (`[`, `TODO`, `Em breve`) on the page (SC-003)

**Checkpoint**: Home complete and testable alone.

---

## Phase 4: User Story 2 — About (P1)

**Goal**: the About page as approved.

**Independent Test**: build, open `/about`: hero, story, experience with highlights + study item, tools, education and languages, closing box.

- [x] T022 [P] [US2] Create `src/content/experiences/study-projects.json` (`kind: study`, Autodidata, 2020 → 2023, one highlight)
- [x] T023 [P] [US2] Create `src/content/about/pt.json` with the provided lead, three story paragraphs, seven tool categories, education and languages
- [x] T024 [US2] Rebuild `src/pages/about.astro`: hero 8/4 (availability, greeting, lead, "Fale comigo"); "Como comecei" at reading width; `ExperienceList` highlights (all kinds); tools and education via `DefinitionList`; `ClosingBox` "Vamos trabalhar juntos?"
- [x] T025 [US2] E2E in `tests/e2e/about.spec.ts`: sections and order, three experience items ending with the study item, seven tool rows, education period, no placeholder text (SC-003)

**Checkpoint**: About complete and testable alone.

---

## Phase 5: User Story 3 — Optional CV and portrait (P2)

**Goal**: CV button and portrait appear only when their files exist.

**Independent Test**: no files → no CV button, no image; files present → both render.

- [x] T026 [US3] In `src/pages/about.astro`, show "Baixar CV (PDF)" (hero and closing box) only when `publicFileExists('public/cv/davi-brito-cv.pdf')`, and the 4:5 `<Image>` portrait only when `import.meta.glob('/src/assets/about/davi.jpg')` matches (above the text on narrow screens)
- [x] T027 [US3] E2E in `tests/e2e/about.spec.ts`: no CV link and no portrait image when the files are absent

---

## Phase 6: User Story 4 — Now page (P3)

**Goal**: `/now` shows the same data as the Home panel.

**Independent Test**: open `/now`; heading, update date and the four items.

- [x] T028 [US4] Rebuild `src/pages/now.astro` from `getNow(lang)` with `DefinitionList` and `resolveInternalLink`; remove the hard-coded "Em breve."
- [x] T029 [US4] E2E in `tests/e2e/home.spec.ts` (or a `now` block): `/now` shows the same date and items as the Home panel and no "Em breve" (SC-003)

---

## Phase 7: Polish & cross-cutting

- [x] T030 Update `CLAUDE.md` (component list) and `docs/architecture.md` (new collections) — no new principles
- [x] T031 Run the quality gate: `pnpm format`, `pnpm lint`, `pnpm check`, `pnpm test:coverage`, `pnpm build`, `pnpm test:e2e` (axe both themes, desktop and mobile), `pnpm lhci`; measure the gzipped size of the Home page's new script in `dist/_astro` (< 1 KB, SC-004)
- [ ] T032 Mark tasks done, re-check spec/plan against what was built, open the PR with the template

---

## Dependencies & execution order

- Phase 1 → Phase 2 → stories. US1 and US2 depend only on Phase 2 and can proceed in parallel; US3 extends the About page
  (after US2); US4 reuses `DefinitionList` and `getNow` (after Phase 2; data from T017).
- Within Phase 2: T003 before T008; T004 before T005 (tests first); T005 before T013.

## Parallel examples

- Phase 2: T004–T007 (different files), then T009–T014 together.
- US1: T016, T017, T018, T019 together, then T020, then T021.
- US2: T022, T023 together, then T024, then T025.

## Implementation strategy

MVP = Phase 1 + 2 + US1 (the Home page). Then US2 (About), US3 (optional assets), US4 (Now), polish. Each story ends at a
checkpoint where `pnpm build` and its e2e pass.
