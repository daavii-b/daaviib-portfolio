# Implementation Plan: Complete article page and first post

**Branch**: `003-article` | **Date**: 2026-11-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-article/spec.md`

## Summary

Rebuild `/blog/[slug]` as approved: header with series tag, wide cover, a 680px reading column with a sticky 280px side
column (≥ 1180px), "Neste artigo" from `render()` headings, series list, share links, tags, contact CTA and "Continue
lendo". Code blocks get a file-name header and a copy button through a small local Shiki transformer; a `<Note>` MDX
component; a CSS-only reading-progress bar; JSON-LD `BlogPosting`. The sample draft is replaced by the first post.
Pure logic (TOC, series position, related posts, code-block title, JSON-LD) lives in `src/lib` and is unit-tested.

## Technical Context

**Language/Version**: TypeScript 6 (strictest), Astro 7 (Sätteri Markdown processor), Tailwind CSS 4

**Primary Dependencies**: **none new**. The code-block header is a local Shiki transformer (`markdown.shikiConfig.transformers`)
typed with minimal local types, because `shiki` is not a direct dependency and adding it only for types is not worth it.
Expressive Code was evaluated and rejected (research R2).

**Storage**: content files (MDX) validated by Zod

**Testing**: Vitest (pure helpers), Playwright + axe (article page: desktop and mobile projects, both themes)

**Target Platform**: static site on Vercel

**Project Type**: static website (single Astro project)

**Performance Goals**: Lighthouse ≥ 95 on the article page; ≤ 2 KB gz of new JS

**Constraints**: no third-party scripts; JS only for copy (code, link) and the current-section highlight; progress bar CSS-only; WCAG 2.1 AA

**Scale/Scope**: 1 page rebuilt, 1 post, ~6 components, ~5 helpers

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Compliance                                                                                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Spec before code                  | spec → plan → tasks → analyze before implementation; the PR links the spec.                                                                                         |
| II. Static first, zero JS by default | Everything is pre-rendered. Three tiny bundled scripts (code copy, link copy, TOC highlight) sharing `src/scripts/clipboard.ts`; progress bar is CSS-only.          |
| III. Content is typed data           | The post is MDX validated by the existing schema; TOC/series/related are derived at build time from typed entries.                                                  |
| IV. Bilingual by design              | All new UI strings in `ui.ts` (pt, en); code-block labels come from the page (not baked into the transformer) so English posts get English labels.                  |
| V. Accessible and fast               | Landmarks (`nav` for TOC, `aside` for side column), `details/summary` on mobile, `aria-current` for the current section/post, axe in both themes, Lighthouse in CI. |
| VI. Tests guard behaviour            | Unit tests for TOC, series position, related posts, code-title parsing and JSON-LD; e2e for the page, copy, CTA, details and JSON-LD.                               |
| VII. Simplicity and ownership        | No new dependency (see Primary Dependencies). Platform features: `details`, `IntersectionObserver`, `position: sticky`, scroll-driven animations.                   |

Post-design re-check: compliant; no Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/003-article/
├── plan.md, research.md, data-model.md, quickstart.md, tasks.md
├── contracts/authoring.md   # how authors write code titles and notes
└── checklists/requirements.md
```

### Source Code (repository root)

```text
astro.config.mjs                      # shikiConfig.transformers: [codeFrameTransformer]
src/
  content/posts/pt/por-que-escolhi-astro.mdx   # new (ola-mundo.mdx removed)
  lib/
    toc.ts                            # buildToc(headings) → level-2 entries
    series.ts                         # seriesPosition(post, posts)
    related.ts                        # relatedPosts(post, posts, limit)
    code-frame.ts                     # parseCodeTitle(meta) + codeFrameTransformer (figure, header, button)
    structured-data.ts                # blogPostingJsonLd(...)
  scripts/
    clipboard.ts                      # existing, reused
  components/
    mdx/Note.astro                    # MDX <Note>
    TableOfContents.astro             # nav list (aside) or <details> (mobile) + current-section script
    SeriesList.astro                  # numbered series list
    ShareLinks.astro                  # copy link, LinkedIn, X
    CodeBlocks.astro                  # labels + copy script for code frames
    icons/Icon.astro                  # + info, link, chevronLeft, chevronDown
    PostCard.astro                    # tags without links (no tag pages yet)
  pages/blog/[slug].astro             # rebuilt
  styles/global.css                   # code frame, reading progress, heading scroll margin
  i18n/ui.ts                          # new keys
tests/
  unit/toc.test.ts, series.test.ts, related.test.ts, code-frame.test.ts, structured-data.test.ts
  e2e/article.spec.ts
lighthouserc.json                     # + /blog/por-que-escolhi-astro
```

**Structure Decision**: single Astro project as before; pure logic in `src/lib` (coverage gate), browser code in
`src/scripts` or component scripts (e2e).

## Complexity Tracking

None.
