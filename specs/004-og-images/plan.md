# Implementation Plan: Share images (Open Graph) and better page titles

**Branch**: `004-og-images` | **Date**: 2026-11-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-og-images/spec.md`

## Summary

Generate one 1200×630 PNG per page at build time through a static endpoint (`src/pages/og/[...path].png.ts`) using
Satori (layout → SVG) and resvg (SVG → PNG), in the typographic-cover style. A single pure list of OG pages
(`buildOgPages`) feeds both the endpoint and the `SEO` component, which now declares `og:image` (+ size, alt) and
`twitter:image`; the article JSON-LD gets `image`. Titles follow "{page} · Davi Brito" (Home: "Davi Brito · Fullstack
Engineer") and every page gets a specific description ≤ 160 characters.

## Technical Context

**Language/Version**: TypeScript 6 (strictest), Astro 7, Node 22 (CI/Vercel)

**Primary Dependencies** (new, all build-time only; nothing reaches the browser):

- `satori` — turns the image layout (flexbox + fonts) into SVG; there is no platform or Astro built-in that lays out text into an image.
- `@resvg/resvg-js` — rasterises that SVG to PNG (social networks do not accept SVG previews); native binary, no browser needed.
- `@fontsource/space-grotesk`, `@fontsource/inter` — static WOFF files of the site fonts, because Satori cannot read the variable WOFF2 the site uses.

**Storage**: none (images are build outputs in `dist/og/`)

**Testing**: Vitest (paths, page list, title fitting, font metrics, renderer output, titles/descriptions);
Playwright (meta tags, image responds 200 + `image/png` + IHDR 1200×630, title pattern on every page)

**Target Platform**: static site on Vercel

**Project Type**: static website (single Astro project)

**Performance Goals**: each PNG < 300 KB; build time increase small (≈ tens of ms per image); no change to page weight

**Constraints**: no browser JS, no external service, light theme, token colours, WCAG/Lighthouse gates unchanged

**Scale/Scope**: ~8 images today (5 static pages, 1 post, 1 project, Home); 1 endpoint, 3 lib modules, SEO/layout changes

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Compliance                                                                                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Spec before code                  | spec → plan → tasks → analyze → implement; PR links the spec.                                                                                                         |
| II. Static first, zero JS by default | Images are static files rendered at build by a static endpoint; zero browser JS; no server code.                                                                      |
| III. Content is typed data           | Image text comes from typed collections and UI strings; Zod now caps descriptions at 160 so a too-long description fails the build.                                   |
| IV. Bilingual by design              | Labels and author line from `ui.ts`/`SITE`; image paths mirror page paths, so `/en/...` pages get `/og/en/...` images with English labels.                            |
| V. Accessible and fast               | `og:image:alt` set; no page markup change besides `<head>`; axe + Lighthouse unchanged and re-run.                                                                    |
| VI. Tests guard behaviour            | Unit tests for every new `src/lib` module (≥ 90% coverage kept); e2e checks meta tags and real PNG headers on every page.                                             |
| VII. Simplicity and ownership        | Four build-time dependencies, each justified above; font metrics parsed with `node:zlib` instead of another dependency; no external service (images are owned files). |

Post-design re-check: compliant; no Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/004-og-images/
├── plan.md, research.md, data-model.md, quickstart.md, tasks.md
├── contracts/og-images.md   # image layout + meta tags contract
└── checklists/requirements.md
```

### Source Code (repository root)

```text
src/
  lib/
    og.ts                 # ogImagePath, buildOgPages, fitTitle, pageTitle (pure)
    font-metrics.ts       # WOFF → advance widths (cmap + hmtx), measureText (pure, node:zlib)
    og-image.ts           # OG_COLORS, loadOgFonts, renderOgImage (Satori + resvg) → PNG bytes
    collections.ts        # + getOgPages(lang), findOgPage(lang, path)
    structured-data.ts    # BlogPosting gains `image`
    links.ts              # (unchanged; canonicalPath reused)
  pages/og/[...path].png.ts   # static endpoint
  components/SEO.astro        # og:image, size, alt, twitter:image
  layouts/BaseLayout.astro    # pageTitle(), OG lookup by canonical path, 404 → Home image
  pages/*.astro               # specific descriptions
  i18n/ui.ts                  # site.title, descriptions, og.project
  content.config.ts           # description/summary ≤ 160
tests/
  unit/og.test.ts, font-metrics.test.ts, og-image.test.ts, (+ structured-data, i18n)
  e2e/seo.spec.ts
```

**Structure Decision**: same single project; pure logic in `src/lib` under the coverage gate; the endpoint stays thin.

## Complexity Tracking

None.
