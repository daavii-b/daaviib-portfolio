# Architecture

Summary of the System Design. Decisions that change it should be recorded here (and, for features,
in the corresponding spec under `specs/`).

## Overview

One site with three areas: **Portfolio** (experience, projects, goals), **Blog** (articles about
programming and project news such as Prumo) and **Newsletter** (post-v1).

- Content lives in the repo as MDX and is rendered to static HTML at build time.
- The site is served by Vercel's CDN. v1 has no database and no server code.
- The newsletter (post-v1) is the only dynamic part: serverless API + Postgres + Resend + QStash.

```
Author ──git push──▶ GitHub ──Actions──▶ Astro build ──▶ Vercel CDN ──▶ Reader
                                                           (post-v1)
Reader ──POST /api/newsletter/subscribe──▶ Serverless API ──▶ Postgres / Resend / QStash
```

## Decisions

| Decision   | Choice                                                                                                           | Revisit when                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Framework  | Astro, static output                                                                                             | —                                                               |
| Content    | MDX/JSON in Git, Zod-validated collections (`posts`, `projects`, `experiences`, `now`, `about`)                  | Someone else needs to write → headless CMS reading the same MDX |
| i18n       | `pt` default (no prefix), `en` under `/en/`; English route segments, translated slugs linked by `translationKey` | —                                                               |
| Newsletter | Own implementation, post-v1, multiple lists (per project/topic), double opt-in, email = summary + link           | Maintenance outweighs value → managed service                   |
| Hosting    | Vercel                                                                                                           | Build > 5 min or cost                                           |

## Design system

Defined in the **daaviib — Design System** artifact and implemented in `src/styles/global.css` (spec `specs/001-design-system`).
Palette "Grafite e Cobalto" (graphite neutrals, cobalt as the only interaction color, purple for details), Space Grotesk +
Inter + JetBrains Mono (self-hosted via Fontsource), light/dark themes. Interactive pieces use native HTML (`<dialog>`) and
small scripts — the contact dialog ships < 1 KB gzipped; no UI framework runtime.

## Roadmap

1. **Foundation** — Astro + Tailwind, i18n structure, base pages, CI, deploy. _(this commit)_
2. **Portfolio + Blog** — real content: projects (Prumo), experience, first posts, OG images, search.
3. **Newsletter** — lists, subscribe/confirm/unsubscribe, batched sending, deliverability.
4. **Evolution** — English version, metrics dashboard, comments.

## Open questions

- Domain (needed before the newsletter; v1 can run on `*.vercel.app`).
- Which newsletter lists exist besides Prumo; a "General" list?
- Lists per language, or one list sending in each subscriber's language?
