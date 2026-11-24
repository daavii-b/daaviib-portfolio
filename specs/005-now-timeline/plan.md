# Implementation Plan: "Agora" as a status sentence and a page with a timeline

**Branch**: `005-now-timeline` | **Date**: 2026-11-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-now-timeline/spec.md`

## Summary

Replace the `now` content model (label/text list) with a richer per-locale JSON entry: a status sentence with inline
links written as `[text](href)`, ordered items (label, title, text, link, series) and a dated history of changes. Zod
validates the shape and, in a `superRefine`, that the newest history date equals `updatedAt`, so a stale entry fails the
build with both dates in the message. Pure helpers in `src/lib/now.ts` parse and resolve the sentence (unpublished site
paths become plain text through the existing `resolveInternalLink`), order the history and label change kinds. A new
`NowStatus` component renders the sentence on both pages. The Home hero spans the content width with the "Agora" block
below it; `/now` becomes the essay with a left-gutter layout and a timeline. `DefinitionList` stays (About uses it).

## Technical Context

**Language/Version**: TypeScript 6 (strictest), Astro 7, Node 22

**Primary Dependencies**: none new (Zod from `astro/zod`, Tailwind v4 tokens, existing components)

**Storage**: `src/content/now/{lang}.json` (one file per locale, typed collection)

**Testing**: Vitest for `src/lib/now.ts`, `src/lib/series.ts` and the date formatter; Playwright for Home and `/now`
(structure, links, timeline, a11y in light/dark via the existing `site.spec.ts` loop)

**Target Platform**: static site on Vercel

**Project Type**: static website (single Astro project)

**Performance Goals**: Lighthouse ≥ 95 on `/` and `/now`; no new client JS (the jump link is an anchor)

**Constraints**: token utilities only; one accent per screen (current timeline node, "+" signs and "atual" badge are the
approved accent uses); no placeholder text in production; drafts never linked or listed

**Scale/Scope**: 1 schema rewrite, 1 lib module + series/date helpers, 1 component, 2 pages, 1 content file, UI strings

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Compliance                                                                                                                                                                                                                         |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Spec before code                  | spec → plan → tasks → analyze → implement; the PR links the spec; spec 002's Now panel is superseded by this spec (noted at its top).                                                                                              |
| II. Static first, zero JS by default | Both pages are static HTML; the timeline jump is `href="#timeline"`; no script added.                                                                                                                                              |
| III. Content is typed data           | The sentence, items and history are Zod-validated JSON; bad links, unknown change kinds and a `updatedAt`/history mismatch fail the schema; a series with no posts fails the build in `getNow`. Drafts stay unlinked and unlisted. |
| IV. Bilingual by design              | Every interface word (`Linha do tempo`, legend, `atual`, "ver linha do tempo", the what-is-this sentence) is a `ui.ts` key in `pt` and `en`; dates use `Intl` for the locale; content is per-locale (`now/en.json` comes later).   |
| V. Accessible and fast               | Signs are `aria-hidden` with a visually hidden word ("entrou: …"); timeline is an ordered list; sections are labelled regions; axe in both themes through `site.spec.ts`; Lighthouse re-run.                                       |
| VI. Tests guard behaviour            | New pure helpers unit-tested (sentence parsing/resolution, history order and "current", change-kind labels, date check, series numbering, short dates); Home and `/now` e2e rewritten for the new structure.                       |
| VII. Simplicity and ownership        | No dependency: a 10-line `[text](href)` parser instead of a Markdown library; reuses `resolveInternalLink`, `seriesPosition` logic and existing tokens; one new component, as FR-015 allows.                                       |

Post-design re-check: compliant; no Complexity Tracking entries.

## Key decisions (details in [research.md](./research.md))

1. **Status sentence with links** — stored as one string with Markdown-style inline links,
   `"Construindo o [Prumo](/projects/prumo), escrevendo a série [Construindo este site](/projects/este-site) e …"`.
   `parseStatus` splits it into `{ text, href? }` segments; the schema rejects malformed links, unbalanced brackets and
   hrefs that are not a site path or `https://`. At render, `resolveStatus` maps each href through
   `resolveInternalLink(href, publishedPaths)`: a draft target (Prumo today) becomes plain text, the same rule as the rest
   of the site. `NowStatus.astro` renders the segments, so Home and `/now` cannot disagree (FR-012).
2. **`updatedAt` = newest history date** — checked inside the `now` schema with `superRefine` using the pure
   `historyDateMismatch(updatedAt, history)`; the issue message names both ISO dates, so `astro build` (and `pnpm check`
   during sync) fails with e.g. `updatedAt is 2026-11-23 but the newest history entry is 2026-11-30`. Order in the file
   does not matter: the helper takes the max.
3. **Series with no posts** — a schema cannot see other collections, so `getNow(lang)` checks each item's `series`
   against every post of the locale (drafts included) and throws with the series name; the build stops at the first
   page that loads the entry.
4. **Link for "Construindo este site"** — no series page exists, so the sentence links to `/projects/este-site` (the
   project the series documents). The Escrevendo item has no link line; its numbered list of published posts is the
   way in. Changing either later is one JSON edit.

## Project Structure

### Documentation (this feature)

```text
specs/005-now-timeline/
├── plan.md, research.md, data-model.md, quickstart.md, tasks.md
├── contracts/now-content.md   # JSON contract of now/{lang}.json + rendered structure
└── checklists/requirements.md
```

### Source Code (repository root)

```text
src/
  content.config.ts          # `now` schema rewritten (status, items, history) + superRefine date check
  content/now/pt.json        # new content (FR-013)
  lib/
    now.ts                   # parseStatus, statusIssues, resolveStatus, historyDateMismatch, timeline, CHANGE_SIGNS
    series.ts                # + seriesPosts(name, lang, posts, hrefFor) (numbered), seriesPosition reuses it
    collections.ts           # getNow: series check against all posts of the locale
  i18n/
    ui.ts                    # now.* keys (pt + en)
    utils.ts                 # + formatShortDate ("23 nov 2026")
  config/site.ts             # + nowPageAbout: 'https://nownownow.com/about'
  components/
    NowStatus.astro          # the status sentence (size: 'home' | 'page')
    DefinitionList.astro     # unchanged; doc comment no longer mentions Now
  pages/
    index.astro              # hero full content width; "Agora" block below the buttons
    now.astro                # header, sentence, item sections, timeline
  styles/global.css          # + --container-lead: 760px (hero intro and Home sentence width)
tests/
  unit/now.test.ts, series.test.ts (+), i18n.test.ts (+)
  e2e/home.spec.ts           # Home block + /now page rewritten
docs/architecture.md, CLAUDE.md   # mention the new Now model and NowStatus
```

**Structure Decision**: single Astro project; logic in `src/lib/now.ts` (pure, no `astro:content` import, so
`content.config.ts` can use it), rendering in one shared component and the two pages.

## Complexity Tracking

None.
