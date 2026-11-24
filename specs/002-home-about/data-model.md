# Data Model: Complete Home and About pages

All content lives under `src/content/` and is validated by Zod in `src/content.config.ts`. Invalid content fails the build.
`LocalizedText` = `{ pt: string; en?: string }` (existing).

## Experience (`experiences`, JSON, one file per role) — changed

| Field        | Type                | Rules                                              |
| ------------ | ------------------- | -------------------------------------------------- |
| `company`    | string              | required, non-empty                                |
| `role`       | LocalizedText       | required                                           |
| `kind`       | `'work' \| 'study'` | **new**; default `work`                            |
| `start`      | date (`YYYY-MM`)    | required; coerced to a UTC date                    |
| `end`        | date (`YYYY-MM`)    | optional; absent = current                         |
| `summary`    | LocalizedText       | **new**; optional; one line shown on the Home page |
| `highlights` | LocalizedText[]     | default `[]`; shown on the About page              |
| `location`   | string              | optional (unused here)                             |
| `stack`      | string[]            | default `[]`                                       |

- Ordering: newest `start` first; equal `start` → the one without `end` (current) first.
- Home shows `kind = work` only; About shows all kinds.
- Period: `work` → abbreviated month and year (`ago 2023 — atual`); `study` → years only (`2020 — 2023`).
- Text for a locale falls back to `pt` when the `en` value is missing.

Files: `full-stack-engineer-ax4b.json` (2023-08 → current), `python-developer-ax4b.json` (2023-05 → 2023-08),
`study-projects.json` (`kind: study`, company "Autodidata", role "Projetos de estudo", 2020 → 2023).

## Now entry (`now`, JSON, one file per locale) — new

| Field       | Type                                               | Rules                                                                |
| ----------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| `lang`      | `Locale`                                           | required; file name matches (`pt.json`)                              |
| `updatedAt` | date                                               | required                                                             |
| `items`     | `{ label: string; text: string; href?: string }[]` | at least one item; `href` is a site path (`/…`) or an `https://` URL |

- A site path that is not built for the locale (draft or missing page) renders as plain text.

## About profile (`about`, JSON, one file per locale) — new

| Field       | Type                                                       | Rules                                  |
| ----------- | ---------------------------------------------------------- | -------------------------------------- |
| `lang`      | `Locale`                                                   | required                               |
| `lead`      | string                                                     | required                               |
| `story`     | string[]                                                   | at least one paragraph                 |
| `tools`     | `{ label: string; items: string[] }[]`                     | at least one category; items non-empty |
| `education` | `{ period: string; title: string; institution: string }[]` | default `[]`                           |
| `languages` | string                                                     | optional                               |

`period` is free text ("out 2026 — em curso") because it mixes a date with a status, not a date range to compute.

## Project "Este site" (`projects`, MDX) — new entry, existing schema

`lang: pt`, `translationKey: this-site`, `slug: este-site`, `name: Este site`, `summary` as provided,
`status: active`, `stack: [Astro, TypeScript, Tailwind]`, `links.repo: https://github.com/daavii-b/daaviib-portfolio`,
`keyword: Site`, `featured: true`, `order: 0`. No body text.

## Optional assets (not collections)

| Asset    | Location                      | Effect when present                                 |
| -------- | ----------------------------- | --------------------------------------------------- |
| CV       | `public/cv/davi-brito-cv.pdf` | "Baixar CV (PDF)" in the About hero and closing box |
| Portrait | `src/assets/about/davi.jpg`   | 4:5 optimized image in the About hero               |
