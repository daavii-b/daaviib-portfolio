# Data model: Now entry

One entry per locale in `src/content/now/{lang}.json`, collection `now`.

## NowEntry

| Field       | Type                  | Rules                                                                                    |
| ----------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `lang`      | `pt` \| `en`          | required                                                                                 |
| `updatedAt` | date (`YYYY-MM-DD`)   | required; MUST equal the newest `history[].date` (build error naming both dates)         |
| `status`    | string, 1–400 chars   | inline links `[text](href)`; href is a site path (`/…`) or `https://`; brackets balanced |
| `items`     | `NowItem[]`, ≥ 1      | order = display order                                                                    |
| `history`   | `HistoryEntry[]`, ≥ 1 | any order in the file; shown newest first                                                |

## NowItem

| Field       | Type   | Rules                                                                                  |
| ----------- | ------ | -------------------------------------------------------------------------------------- |
| `label`     | string | required (eyebrow, e.g. "Construindo")                                                 |
| `title`     | string | required (section heading, never a link)                                               |
| `text`      | string | optional                                                                               |
| `href`      | string | optional; site path or https; hidden when the site path is not published               |
| `linkLabel` | string | required when `href` is set (e.g. "Ver o projeto")                                     |
| `series`    | string | optional; MUST match the `series` of at least one post of the locale (drafts included) |

## HistoryEntry

| Field     | Type            | Rules      |
| --------- | --------------- | ---------- |
| `date`    | date            | required   |
| `note`    | string          | optional   |
| `changes` | `Change[]`, ≥ 1 | order kept |

## Change

| Field  | Type                              | Rules                      |
| ------ | --------------------------------- | -------------------------- |
| `kind` | `added` \| `changed` \| `removed` | unknown kind = build error |
| `text` | string                            | required                   |

## Derived values (pure, `src/lib/now.ts`)

- `parseStatus(status)` → `StatusSegment[]` (`{ text, href? }`).
- `resolveStatus(segments, publishedPaths)` → same segments with hrefs resolved (`undefined` = plain text).
- `timeline(history)` → entries newest first with `current: true` on the first only.
- `CHANGE_SIGNS` → `+`, `~`, `−`; the spoken word comes from `ui.ts` (`now.change.{kind}`).
- `seriesPosts(name, lang, posts, hrefFor)` (`src/lib/series.ts`) → published posts of the series by `publishedAt`,
  each with `number` (`"01"`, `"02"`).
