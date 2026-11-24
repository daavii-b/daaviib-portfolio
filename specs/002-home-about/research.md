# Research: Complete Home and About pages

No open questions remained after the spec; these are the technical decisions taken while planning.

## R1. Optional portrait

- **Decision**: `import.meta.glob<{ default: ImageMetadata }>('/src/assets/about/davi.jpg', { eager: true })` and render
  with `<Image>` from `astro:assets` only when the glob has a match.
- **Rationale**: documented Astro recipe ("Dynamically import images"); a missing file yields an empty object instead of
  a build error, and a present file is optimized (WebP, width/height, no CLS).
- **Alternatives**: a static `import` (fails the build when the file is missing); a `public/` image (not optimized).

## R2. Optional CV

- **Decision**: check `public/cv/davi-brito-cv.pdf` with Node `fs.existsSync` at build time through a small pure helper
  (`publicFileExists`) that takes the project root, so it is unit-testable.
- **Rationale**: the site is fully static, so the check runs once per build; Vite globs are meant for modules under `src/`,
  not for `public/` files.
- **Alternatives**: a config flag in `site.ts` (can drift from the real file); always rendering the link (404 risk).

## R3. Period format

- **Decision**: `Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).formatToParts()`, joining
  month and year with a space and removing a trailing `.` from the month: `ago 2023`, `Aug 2023`. Current roles end with the
  existing `about.present` string; study items use years only.
- **Rationale**: `pt-BR` formats as `ago. de 2023`, which does not match the approved screens; parts give exact control
  while staying locale-aware. UTC avoids month shifts for `YYYY-MM` dates.
- **Alternatives**: hand-written month tables (duplicates `Intl`, breaks for new locales).

## R4. Experience kinds

- **Decision**: add `kind: 'work' | 'study'` (default `work`) to `experiences`; the self-taught projects are a `study`
  entry (`study-projects.json`). Home lists `work` only; About lists all, newest first, so `study` naturally comes last.
- **Rationale**: keeps the item as typed content (principle III) instead of strings in a page; one ordering rule.
- **Alternatives**: a hard-coded block in `about.astro` (content in code, no `en` path).

## R5. About content

- **Decision**: new data collection `about` (one JSON per locale: lead, story paragraphs, tool categories, education,
  languages). Headings, buttons and the greeting are UI strings in `ui.ts`.
- **Rationale**: long-form, per-locale content belongs in content files so English can be added later without code
  changes; `ui.ts` requires every key in both locales and is for interface text.
- **Alternatives**: everything in `ui.ts` (forces English content now); an MDX page (harder to lay out as lists).

## R6. "Now" links to unpublished pages

- **Decision**: `resolveInternalLink(href, publishedPaths)` returns the href only when it is external or matches a page
  that is built (static routes plus published posts/projects for the locale); otherwise the item renders as text.
- **Rationale**: "Prumo" is a draft; linking to `/projects/prumo` would be a 404 in production.
- **Alternatives**: a `reference('projects')` field (only covers projects; the user specified `href`).

## R7. Email copy

- **Decision**: move the clipboard logic out of `ContactDialog` into `src/scripts/clipboard.ts`
  (`copyText(text, fallbackNode)` with selection fallback, and `flagCopied(element, ms)`), used by the dialog and by a new
  `CopyEmailButton`. The button swaps its copy icon for a check and announces "Email copiado" through a polite
  `role="status"` region.
- **Rationale**: one implementation (FR-019); a status region gives the same confirmation to screen readers that the icon
  gives visually. The dialog's toast lives inside the `<dialog>` and is hidden while it is closed, so it cannot be reused.
- **Alternatives**: opening the dialog instead (not what the screen shows); a global toast component (more JS than needed).

## R8. Empty sections

- **Decision**: every Home section and the "Agora" panel render only when they have items (FR-016, edge cases). The hero
  text spans the full width when the panel is absent.
- **Rationale**: "what is missing stays hidden"; in production today there are no published posts and only one featured project.
