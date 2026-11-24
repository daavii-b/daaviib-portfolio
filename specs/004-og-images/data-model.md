# Data Model: Share images and page metadata

No new content collection. Derived, build-time structures only.

## OgPage

| Field       | Type     | Rule                                                                                              |
| ----------- | -------- | ------------------------------------------------------------------------------------------------- |
| `pagePath`  | `string` | Normalised page path (`/`, `/blog`, `/blog/por-que-escolhi-astro`, `/en/about`)                   |
| `imagePath` | `string` | `ogImagePath(pagePath)`: `/og/index.png` for `/`, else `/og{pagePath}.png` (`/en` → `/og/en.png`) |
| `title`     | `string` | Text drawn in the image and used as `og:image:alt`                                                |
| `label`     | `string` | Eyebrow text (rendered uppercase)                                                                 |

Sources (per locale, published entries only):

| Page               | title                  | label                      |
| ------------------ | ---------------------- | -------------------------- |
| `/`                | `home.title`           | `SITE.author`              |
| `/blog`            | `blog.title` (H1)      | `nav.blog`                 |
| `/projects`        | `projects.title` (H1)  | `nav.projects`             |
| `/about`           | `about.greeting` (H1)  | `nav.about`                |
| `/now`             | `now.title` (H1)       | `nav.now`                  |
| `/blog/{slug}`     | post `title`           | first tag, else `nav.blog` |
| `/projects/{slug}` | project `name`         | `og.project` ("Projeto")   |
| `/404`             | — (uses the `/` entry) | —                          |

## FittedTitle

| Field      | Type       | Rule                                                             |
| ---------- | ---------- | ---------------------------------------------------------------- |
| `fontSize` | `number`   | One of 88, 80, 72, 64, 56, 48 — the largest giving ≤ 3 lines     |
| `lines`    | `string[]` | 1–3 lines; words never split; last line ends in "…" if truncated |

## Page metadata

- `<title>`: `pageTitle(title?, siteTitle, author)` → `siteTitle` when no title, else `"{title} · {author}"`.
- `description`: ≤ 160 characters (UI keys tested; post `description` and project `summary` capped by Zod).
- Image tags: `og:image` (absolute), `og:image:width` 1200, `og:image:height` 630, `og:image:alt` = OgPage.title,
  `twitter:image` = same URL. `BlogPosting.image` = same URL.
