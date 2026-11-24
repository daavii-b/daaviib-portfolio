# Implementation Plan: Complete Home and About pages

**Branch**: `002-home-about` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-home-about/spec.md`

## Summary

Rebuild `/` and `/about` to match the approved screens and wire `/now` to real data. Content moves into typed
collections: `experiences` gains `kind` and `summary`; new `now` and `about` data collections; a new project
"Este site". Pages are composed from existing components plus five small new ones for patterns that repeat
(section header, definition list, experience list, closing box, availability line). The only new client
behaviour is copying the email on the Home closing box, sharing one clipboard module with the contact dialog.
Optional assets (CV, portrait) are detected at build time and render only when present.

## Technical Context

**Language/Version**: TypeScript 6 (strictest), Astro 7, Tailwind CSS 4

**Primary Dependencies**: none new (`astro:assets` for the optional portrait, Node `fs` at build time for the CV)

**Storage**: content files in the repository (JSON/MDX), validated by Zod in `src/content.config.ts`

**Testing**: Vitest (pure helpers in `src/lib`), Playwright + axe (pages, both themes, desktop and mobile projects)

**Target Platform**: static site on Vercel

**Project Type**: static website (single Astro project)

**Performance Goals**: Lighthouse ≥ 95 in all categories on `/`, `/about`, `/now`

**Constraints**: zero new JS except email copy (< 1 KB gz); WCAG 2.1 AA; tokens and existing components only; no placeholder content in production

**Scale/Scope**: 3 pages, 3 collections touched, ~5 new components, ~4 new pure helpers

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Compliance                                                                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I. Spec before code                  | spec → plan → tasks → analyze precede implementation; the PR links the spec.                                                                                             |
| II. Static first, zero JS by default | All sections are static HTML. One small bundled script for email copy, reusing the dialog's clipboard module. CV/photo detection happens at build time.                  |
| III. Content is typed data           | Experiences, "Now", About profile and the new project are JSON/MDX validated by Zod; invalid content fails the build. No content is hard-coded in pages.                 |
| IV. Bilingual by design              | UI strings added to `ui.ts` for `pt` and `en`; content files carry `lang` and per-locale text so `en` files can be added later; periods and dates formatted with `Intl`. |
| V. Accessible and fast               | Semantic `dl`/`ol`/`section` with labelled headings; axe in both themes on desktop and mobile; optimized portrait via `astro:assets`; Lighthouse CI.                     |
| VI. Tests guard behaviour            | New pure helpers (ordering, period formatting, link resolution, file detection) unit-tested; pages covered by e2e + axe in the same PR.                                  |
| VII. Simplicity and ownership        | No new dependency. New components only where a pattern repeats; Node `fs` and Vite glob (built-ins) for optional assets.                                                 |

Post-design re-check: still compliant; no deviations, so no Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/002-home-about/
├── plan.md              # This file
├── research.md          # Phase 0 decisions
├── data-model.md        # Phase 1 entities and validation rules
├── quickstart.md        # Phase 1 validation guide
├── contracts/
│   └── content-files.md # Author-facing shape of the content files
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
  content.config.ts                 # experiences: + kind, summary; new now, about collections
  content/
    experiences/                    # full-stack-engineer-ax4b.json, python-developer-ax4b.json, study-projects.json
    now/pt.json                     # new
    about/pt.json                   # new: lead, story, tools, education, languages
    projects/pt/este-site.mdx       # new
  lib/
    experience.ts                   # new: sortExperiences, formatPeriod
    links.ts                        # new: resolveInternalLink
    files.ts                        # new: publicFileExists
    collections.ts                  # + getNow, getAboutProfile, publishedPaths; getExperiences(kind)
  scripts/
    clipboard.ts                    # new: copy with selection fallback (shared by dialog and copy button)
  components/
    AvailabilityLine.astro          # new: green dot + label (Home, About, dialog)
    SectionHeader.astro             # new: h2 + "link →" (Home ×3)
    DefinitionList.astro            # new: label/value rows (Now panel, /now, tools, education)
    ExperienceList.astro            # new: summary (Home) or highlights (About) variant
    ClosingBox.astro                # new: dot-pattern closing box with action slot (Home, About)
    CopyEmailButton.astro           # new: secondary button that copies the email
    ContactDialog.astro             # uses AvailabilityLine and scripts/clipboard.ts
    icons/Icon.astro                # + download icon
  i18n/ui.ts                        # new keys (pt, en)
  pages/
    index.astro                     # rebuilt
    about.astro                     # rebuilt
    now.astro                       # wired to the now collection
tests/
  unit/experience.test.ts, links.test.ts, files.test.ts
  e2e/home.spec.ts, about.spec.ts   # sections, optional assets hidden, copy; axe via site.spec.ts
```

**Structure Decision**: single Astro project, as established. Pure logic in `src/lib/` (unit-tested, inside the
coverage gate); DOM-only code in `src/scripts/` (covered by e2e), so the coverage gate keeps measuring pure logic.

## Complexity Tracking

None.
