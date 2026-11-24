---
description: 'Task list for the "Agora" status sentence and the /now page with a timeline'
---

# Tasks: "Agora" as a status sentence and a page with a timeline

**Input**: Design documents from `specs/005-now-timeline/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: requested by the spec (SC-005 unit helpers; SC-002 axe on `/` and `/now`; acceptance scenarios as e2e).

## Format: `[ID] [P?] [Story] Description`

US1 Home sentence · US2 /now page · US3 timeline

---

## Phase 1: Setup

- [x] T001 [P] UI strings (pt + en) in `src/i18n/ui.ts`: `now.intro` (with `{link}`), `now.introLink`, `now.seeTimeline`, `now.timeline`, `now.timelineIntro`, `now.legend`, `now.current`, `now.change.added|changed|removed`; keep `now.title`, `now.updatedOn`, `home.nowLink`
- [x] T002 [P] Add `nowPageAbout: 'https://nownownow.com/about'` to `src/config/site.ts` and `--container-lead: 760px` to `src/styles/global.css`

## Phase 2: Foundational (blocking)

- [x] T003 Unit tests then `src/lib/now.ts`: `parseStatus`, `statusIssues` and `resolveStatus` (data-model.md `NowEntry.status`), `historyDateMismatch` (data-model.md `NowEntry.updatedAt`), `timeline` (data-model.md `NowEntry.history`), `CHANGE_KINDS`/`CHANGE_SIGNS` (data-model.md `Change.kind`), in `tests/unit/now.test.ts`
- [x] T004 Rewrite the `now` schema in `src/content.config.ts` per data-model.md (`NowEntry.*`, `NowItem.*` incl. `NowItem.linkLabel` required with `NowItem.href`, `HistoryEntry.*`, `Change.*`), with `superRefine` using `statusIssues` and `historyDateMismatch`
- [x] T005 Replace `src/content/now/pt.json` with the FR-013 content (status, four items from the approved screen, Prumo without text, one 2026-11-23 history entry with the note and four `added` changes)
- [x] T006 [P] Unit tests then `seriesPosts(name, lang, posts, hrefFor)` with two-digit `number` in `src/lib/series.ts` (data-model.md `NowItem.series`); `seriesPosition` reuses it; `tests/unit/series.test.ts`
- [x] T007 [P] Unit tests then `formatShortDate` in `src/i18n/utils.ts` ("23 nov 2026" / "23 Nov 2026"); `tests/unit/i18n.test.ts`
- [x] T008 `getNow` in `src/lib/collections.ts`: throw when an item's `series` matches no post of the locale (drafts included)

**Checkpoint**: content validates; helpers tested.

---

## Phase 3: User Story 1 — Home sentence (P1) 🎯 MVP

- [x] T009 [US1] `src/components/NowStatus.astro`: renders resolved segments as a `<p>` (`size: 'home' | 'page'`), links underlined with `decoration-border-strong`
- [x] T010 [US1] `src/pages/index.astro`: hero full width (intro `max-w-lead`); "Agora" block below the buttons (hairline, eyebrow h2 "Agora · <time>", `NowStatus`, "Página Agora →"); no `DefinitionList`
- [x] T011 [US1] e2e in `tests/e2e/home.spec.ts`: block structure, date, Prumo not linked, "Construindo este site" linked, link to `/now`, no `dt`

## Phase 4: User Story 2 — /now page (P1)

- [x] T012 [US2] `src/pages/now.astro`: header (h1, intro with "now" link, update line with `#timeline` jump), `NowStatus` size page, item sections (gutter label on md, title h2, text, numbered series posts, link only when resolved)
- [x] T013 [US2] e2e in `tests/e2e/home.spec.ts` ("now page"): header, sentence equals Home's, four sections, series lists only the published post, no Prumo link, no placeholders

## Phase 5: User Story 3 — Timeline (P2)

- [x] T014 [US3] Timeline section in `src/pages/now.astro`: intro, legend, `ol` newest first, current node accent + "atual", hollow older nodes, note, changes with `aria-hidden` sign and `sr-only` kind word; line stops at the last node
- [x] T015 [US3] e2e: one node with "atual", legend words, change announced as "entrou: Aprendendo Astro", timeline is the last section, jump link target exists

## Phase 6: Polish

- [x] T016 [P] Update `DefinitionList` doc comment, `docs/architecture.md`, `CLAUDE.md` (Now model, `NowStatus`, `max-w-lead`); note in `specs/002-home-about/spec.md` that 005 supersedes its Now panel
- [x] T017 Run the quickstart guards (date, series, link) and revert
- [x] T018 `quality-gate` skill: `pnpm validate`, `pnpm build`, `pnpm test:e2e`, `pnpm lhci`

## Dependencies

T001–T002 → T003 → T004 → T005; T006–T008 after T004. US1 needs T003–T005; US2 also needs T006–T008; US3 needs T007 and builds on the US2 page. Polish last.

## Parallel examples

- T001 ∥ T002; T006 ∥ T007 (different files).
- US1 and the US2 page can be built in parallel once Phase 2 is done (different pages).

## Implementation strategy

MVP = US1 (Home sentence on the new model). Then US2 (page sections) and US3 (timeline) on `/now`, then polish and the quality gate.
