# Tasks: Design system in code

**Input**: [spec.md](./spec.md), [plan.md](./plan.md)

## Phase 1: Setup

- [x] T001 Add self-hosted font packages (`@fontsource-variable/*`)
- [x] T002 Extend `src/config/site.ts` with contact and availability settings

## Phase 2: Foundational

- [x] T003 Rewrite `src/styles/global.css`: light/dark color tokens, shadcn-compatible aliases, fonts, radii, motion, `scrollbar-hide`, `scroll-fade`, reduced motion
- [x] T004 Rename utility usages in existing components (`ink` → `text`, `surface` → `bg`…)

## Phase 3: User Story 1 — Consistent look (P1)

- [x] T005 [P] `Button`, `Tag` components
- [x] T006 [P] `SiteHeader` (name — section + role) and `Footer`
- [x] T007 e2e: axe in light **and** dark themes; no theme flash

## Phase 4: User Story 2 — Contact (P1)

- [x] T008 [P] `src/lib/contact.ts` + unit tests (message per context, subject, WhatsApp and mailto URLs, encoding)
- [x] T009 `ContactDialog` with native `<dialog>`, focus return, Esc/outside click, copy with feedback, availability, optional scheduling
- [x] T010 `ContactCTA` at the end of articles and projects
- [x] T011 UI strings in `ui.ts` (pt, en)
- [x] T012 e2e: open/close, contextual message on an article, link contents, copy feedback

## Phase 5: User Story 3 — Building blocks (P2)

- [x] T013 [P] `PostCover`, `PostCard`, `ProjectCard`; use them in blog and project lists

## Phase 6: Polish

- [x] T014 Update `CLAUDE.md` and `docs/architecture.md` with token and component conventions
- [x] T015 `pnpm validate`, `pnpm test:e2e`, Lighthouse
