# Research: Complete article page and first post

## R1. Heading ids and the table of contents

- **Decision**: rely on Astro's built-in heading ids (github-slugger) and the `headings` array returned by `render()`;
  `buildToc` keeps depth-2 entries.
- **Rationale**: verified in this repo with Sätteri: `## Estático primeiro` → `id="estático-primeiro"`. No plugin needed.
- **Alternatives**: parsing the rendered HTML (fragile); a custom heading plugin (duplicates Astro).

## R2. Code block file name and copy button

- **Decision**: a local Shiki transformer (`root` hook) that wraps each `<pre>` in
  `<figure class="code-frame">` with a header row (optional `<figcaption>` from `title="…"` in the meta, and a copy
  button rendered `hidden`). A small script reveals the buttons, sets their localized label from data attributes on the
  page, and copies the `<pre>` text via `src/scripts/clipboard.ts`.
- **Rationale**: verified that Sätteri passes the raw meta to transformers (`this.options.meta.__raw` =
  `title="src/content.config.ts"`). ~40 lines, no dependency. Buttons stay hidden without JS (they could not work), and
  labels are not baked into build config, so future English posts get English labels.
- **Alternatives**: **Expressive Code** — rejected: a runtime dependency with its own theme layer and CSS/JS that would
  bypass the design tokens, for two features we cover in a few lines; a rehype plugin — the Sätteri hast-plugin API is
  different from unified's and the Shiki hook is the documented integration point.

## R3. Note component

- **Decision**: `src/components/mdx/Note.astro`, passed to `<Content components={{ Note }} />`, so posts don't import it.
  Rendered as `<aside aria-label="Nota">` with border, `bg-surface` and an accent info icon; `not-prose` to escape
  typography margins.

## R4. Current-section highlight

- **Decision**: `IntersectionObserver` on the article's `h2[id]` with a top root margin; the last heading above the
  reading line becomes current (`aria-current="true"` + data attribute). Runs only when the side column is visible.
- **Rationale**: no scroll listeners; works with links alone when JS is off.

## R5. Reading progress

- **Decision**: a fixed 2px `bg-accent` element scaled on X with `animation-timeline: scroll(root block)`, inside
  `@supports (animation-timeline: scroll())` and `@media (prefers-reduced-motion: no-preference)`; hidden otherwise.

## R6. Series and related posts

- **Decision**: series = published posts in the same locale with the same `series` string, ordered by `publishedAt`
  ascending; related = other published posts ranked by number of shared tags (desc), then `publishedAt` (desc), first 3.
- **Rationale**: matches the request ("same tag first, then most recent") deterministically.

## R7. Sharing

- **Decision**: plain links — LinkedIn `https://www.linkedin.com/sharing/share-offsite/?url={url}`, X
  `https://x.com/intent/post?url={url}&text={title}` — opened in a new tab with `rel="noopener noreferrer"`; "Copiar link"
  uses the clipboard module with the canonical URL.

## R8. Structured data

- **Decision**: `blogPostingJsonLd()` builds the object; the page renders it in `<script type="application/ld+json">`
  with `<` escaped as `\u003c`. `dateModified` = `updatedAt ?? publishedAt`; `author` = `Person` "Davi Brito" with the site URL.

## R9. Tags without pages

- **Decision**: render tags as non-link `Tag`s on the article and on `PostCard` until tag pages exist.
- **Rationale**: both currently link to `/blog/tags/{tag}`, which is a 404.

## R10. Syntax colours (found during implementation)

- **Decision**: Shiki `css-variables` theme with `--astro-code-*` mapped to design tokens in `global.css`.
- **Rationale**: axe flagged the GitHub light theme's red and orange tokens on the surface background (4.16:1 and
  3.17:1). Token colours are AA in both themes, follow the theme switch without dual-theme CSS, and match the approved
  screen.

## R11. Canonical URLs (found during implementation)

- **Decision**: `canonicalPath()` strips `.html` / `index` from `Astro.url.pathname` in `SEO.astro`.
- **Rationale**: with `build.format: 'file'` every canonical and `og:url` ended in `.html`, which Vercel's `cleanUrls`
  redirects; sharing and JSON-LD need the clean URL.
