# Data Model: Complete article page and first post

No schema changes. The post collection (`posts`) already has every field used here: `title`, `description`,
`publishedAt`, `updatedAt?`, `tags`, `series?`, `keyword?`, `draft`. New derived (build-time) structures:

## Table of contents entry

| Field  | Type   | Source                         |
| ------ | ------ | ------------------------------ |
| `id`   | string | heading `slug` from `render()` |
| `text` | string | heading `text`                 |

Rule: only `depth === 2`, in document order. Empty list → no "Neste artigo".

## Series position

| Field   | Type                             | Rule                                                          |
| ------- | -------------------------------- | ------------------------------------------------------------- |
| `name`  | string                           | the post's `series`                                           |
| `index` | number (1-based)                 | position among the series' published posts, `publishedAt` asc |
| `total` | number                           | count of the series' published posts (same locale)            |
| `items` | `{ id, title, href, current }[]` | all of them, in order                                         |

Absent when the post has no `series`. The list is shown only when `total ≥ 2`; the meta-line tag always.

## Related posts

Up to 3 published posts of the same locale, excluding the current one, ordered by: shared-tag count (desc), then
`publishedAt` (desc). Empty → no "Continue lendo".

## Code block title

From the fence meta: `title="…"` or `title='…'` → string; absent → no caption.

## BlogPosting (JSON-LD)

`@context` `https://schema.org`, `@type` `BlogPosting`, `headline`, `description`, `datePublished` (ISO),
`dateModified` (ISO, `updatedAt ?? publishedAt`), `author` `{ @type: Person, name: "Davi Brito", url: site }`,
`url` (canonical), `mainEntityOfPage` (canonical), `inLanguage` (`pt-BR`), `keywords` (tags).
