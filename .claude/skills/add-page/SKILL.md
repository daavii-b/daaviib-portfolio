---
name: add-page
description: Add a new route/page to the site following the i18n, accessibility and testing conventions. Use when asked to create a new page, section or route.
---

# Add a page

1. Check there is a spec for it (`specs/NNN-*/spec.md`); if not and the page adds behaviour,
   suggest `/speckit-specify` first.
2. Route segment in **English**: `src/pages/<segment>.astro` (default locale `pt`).
3. Use `BaseLayout` with `title` and `description`; exactly one `<h1>`; sections use
   `aria-labelledby` pointing to their heading.
4. Every visible string → new keys in `src/i18n/ui.ts` for **both** `pt` and `en`
   (the type and the unit test fail otherwise). Use `t(lang, key)`.
5. Internal links with `localizePath(path, lang)`; dates with `formatDate`.
6. Add the link to `Header.astro` if it belongs in the main navigation.
7. Add the path to the `pages` array in `tests/e2e/site.spec.ts`, to `tests/e2e/seo.spec.ts` (expected title and
   share image) and to `lighthouserc.json` if it is a key page.
8. Give the page its share image: add it to `STATIC_PAGES` in `src/lib/og.ts` (title = the page's H1, label = the
   section name). Pages from collections (posts, projects) are picked up by `buildOgPages` automatically.
9. Run the `quality-gate` skill.
