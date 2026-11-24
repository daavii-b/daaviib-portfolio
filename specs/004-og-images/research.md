# Research: Share images (Open Graph) and better page titles

## R1 — Where images are generated

- **Decision**: a static file endpoint `src/pages/og/[...path].png.ts` with `getStaticPaths()`; Astro calls `GET` at
  build time and writes `dist/og/<path>.png`.
- **Rationale**: Astro docs ("Static File Endpoints") support binary responses and rest parameters in static mode; the
  output is a plain file served by the CDN. No runtime, no browser JS (Principle II).
- **Alternatives**: Vercel OG / `@vercel/og` (an edge function on the request path — rejected by Principle II);
  committing PNGs by hand (drifts from content); an Astro integration hook writing files after build (more code, no
  access to `astro:content`).

## R2 — Renderer: Satori + @resvg/resvg-js

- **Decision**: `satori` turns a small element tree (plain objects, no JSX/React) into SVG; `@resvg/resvg-js` rasterises
  the SVG to PNG.
- **Rationale**: Satori is the de-facto HTML/CSS-to-SVG engine (flexbox, fonts, `radial-gradient` backgrounds); resvg
  is a fast, deterministic rasteriser with prebuilt Node binaries for Linux (Vercel, CI) and needs no browser.
  Prototype: a 1200×630 image with the dot grid renders in tens of milliseconds at ~20 KB.
- **Alternatives**: Playwright screenshots at build (needs a browser on Vercel, slow); `sharp` for SVG → PNG (larger
  native dependency, librsvg text rendering would need system fonts); `@resvg/resvg-wasm` (slower, needs wasm init;
  the native package is fine on the build targets).

## R3 — Fonts

- **Decision**: `@fontsource/space-grotesk` (700) and `@fontsource/inter` (500), latin subset, `.woff` files read from
  `node_modules` with `fs` at build time.
- **Rationale**: Satori cannot read WOFF2 nor variable fonts; the site uses the variable WOFF2 builds. Fontsource's
  static packages ship WOFF (zlib-compressed, which Satori reads) for each weight. Latin covers Portuguese accents and
  `·`. Same font families as the site, same licence (OFL), no network.
- **Alternatives**: downloading TTFs from Google Fonts at build (network on the build path); vendoring font files into
  the repo (duplicates what a versioned package already provides).

## R4 — Fitting long titles

- **Decision**: wrap and size the title ourselves, then render one element per line with `white-space: nowrap`:
  - measure text with the real advance widths of Space Grotesk 700, read from the WOFF (`cmap` + `hmtx` tables,
    decompressed with `node:zlib`), plus letter spacing; kerning is ignored (it only narrows text, so the estimate is
    safe), and a small safety margin is kept;
  - greedy word wrap at sizes 88 → 80 → 72 → 64 → 56 → 48 px; the first size that needs ≤ 3 lines wins;
  - if 48 px still needs more than 3 lines, keep the first 3 lines and end the last with "…" at a word boundary (a word
    that alone exceeds a line stays whole on its own line, it is never broken).
- **Rationale**: Satori wraps text but does not report line counts, so it cannot choose a size; truncating with
  `line-clamp` would cut mid-thought without stepping down. Measuring with the font's own metrics is exact for widths,
  pure, and unit-testable; the parser is ~60 lines with no dependency.
- **Alternatives**: an average character width (risky: "mmm" vs "iii" differ 3×); `opentype.js` (another dependency
  for two tables); rendering repeatedly with Satori and inspecting the SVG (slow, brittle).

## R5 — Mapping pages to images

- **Decision**: one pure function `ogImagePath(pagePath)` (`/` → `/og/index.png`, `/blog/x` → `/og/blog/x.png`,
  `/en/about` → `/og/en/about.png`) and one pure builder `buildOgPages(...)` listing `{ pagePath, title, label }` for
  every page. Both the endpoint (to render) and the layout (to declare the meta tags) use the same list, read through
  `getOgPages(lang)` in `src/lib/collections.ts`; a path not in the list (the 404 page) gets the Home entry.
- **Rationale**: single source of truth: a page can never declare an image that was not built (FR-006). `getOgPages`
  uses `getCollection` directly (no `render()`), so it does not add to the `getPosts` debt.
- **Alternatives**: each page passes its own OG title/label to the layout (duplicated with the endpoint's list, text
  could diverge).

## R6 — Colours

- **Decision**: the renderer uses a `OG_COLORS` constant with the light-theme hex values; a unit test reads
  `src/styles/global.css` and asserts each value equals its `--ds-*` token.
- **Rationale**: Satori cannot resolve CSS variables; the test keeps the image in sync with the design system.

## R7 — Titles and descriptions

- **Decision**: `site.title` = "Davi Brito · Fullstack Engineer" (pt and en); pure `pageTitle(title, siteTitle,
author)` returns the site title alone when there is no page title, otherwise "{title} · {author}". New UI keys for
  specific descriptions (`home.description`, `blog.description`, `projects.description`, `about.description`,
  `now.description`, `notFound.description`); a unit test asserts every `*.description` key is ≤ 160 characters;
  the Zod schema caps post `description` and project `summary` at 160.
- **Rationale**: titles follow the pattern requested; descriptions become build-validated.

## R8 — Native module in the build

- **Decision**: rely on Vite's default SSR externalisation for `@resvg/resvg-js` (bare imports from `node_modules` are
  not bundled in static builds); add `vite.ssr.external` only if the build proves otherwise.
- **Outcome**: no configuration needed; `pnpm build` loads the native binary as an external module.

## R9 — Satori box model (found during implementation)

- Satori sized the root as content-box: `width: 100%` plus 64px padding produced a 1330×760 canvas, pushing the cobalt
  square and the byline outside the image. The root now uses `box-sizing: border-box` with explicit 1200×630.
