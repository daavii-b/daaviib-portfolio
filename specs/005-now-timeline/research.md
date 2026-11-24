# Research: "Agora" status sentence and timeline

## R1. Storing the status sentence with links

- **Decision**: one JSON string with inline links in Markdown syntax, `[text](href)`, parsed by a pure `parseStatus`
  into `{ text, href? }[]`. Validation lives in the schema (`statusIssues` → Zod issues); resolution happens at render
  with `resolveInternalLink`, so unpublished site paths render as plain text and `https://` links are kept.
- **Rationale**: the author edits a sentence as a sentence (SC-006: one file edit); the syntax is familiar; the parser
  is ~10 lines and fully unit-testable; resolution reuses the site's single rule for draft links.
- **Alternatives considered**:
  - Array of segments (`["Construindo o ", { "text": "Prumo", "href": "/projects/prumo" }, …]`): no parsing, but hard
    to read and edit; spacing mistakes are easy.
  - Markdown/MDX body rendered by Astro: links would bypass `resolveInternalLink` unless a rehype plugin is added; more
    machinery for one sentence.
  - Plain sentence with a separate `links` map (`{ "Prumo": "/projects/prumo" }`): ambiguous when a word repeats.

## R2. Failing the build when `updatedAt` ≠ newest history date

- **Decision**: `superRefine` on the `now` object schema calling `historyDateMismatch(updatedAt, history)`, which returns
  a message naming both ISO dates (or `undefined`). Zod issues on a content entry fail `astro sync`/`astro build`.
- **Rationale**: Constitution III — invalid content fails the build at the schema; the check is pure and tested; dates are
  compared as UTC ISO days, which matches `z.coerce.date()` on `YYYY-MM-DD`.
- **Alternatives considered**: a check in `getNow` (runs later, only when a page loads it; same effect but splits
  validation); a unit test reading the JSON (would not protect a build from an edited file without running tests).

## R3. Series with no posts

- **Decision**: check in `getNow` against all posts of the locale (drafts included), throwing `Error` naming the series.
- **Rationale**: Zod schemas in `content.config.ts` cannot query other collections; `getNow` runs during the build of
  both pages, so a typo stops the build.

## R4. Dates

- Home eyebrow: ISO (`2026-11-23`), as today. `/now` update line: `formatDate` (long). Timeline: new `formatShortDate`
  built from `formatToParts` (`23 nov 2026` / `23 Nov 2026`), mirroring `formatMonth` in `experience.ts`.

## R5. Timeline line

- **Decision**: each `<li>` draws its own left border; the last one's border is transparent, so with one entry the
  line never extends past the node (spec edge case). Nodes are `aria-hidden` spans; the current one uses `bg-accent`,
  others `border-border-strong` on `bg-bg`.

## R6. "now page" link target

- `https://nownownow.com/about` (spec assumption), stored in `SITE.nowPageAbout`; the link word and the surrounding
  sentence are UI strings (`now.intro` with a `{link}` placeholder, `now.introLink`).

## R7. Reading width of the hero intro

- The approved screens use 760px for the hero intro and the Home sentence; there is no token for it. Add
  `--container-lead: 760px` to `global.css` (`max-w-lead`) instead of an arbitrary value in markup.
