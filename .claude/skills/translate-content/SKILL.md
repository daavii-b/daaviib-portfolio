---
name: translate-content
description: Add the English (or other locale) version of an existing post or project, keeping translationKey and translating the slug. Use when asked to translate content or enable the English version of the site.
---

# Translate content

1. Read the source entry (e.g. `src/content/posts/pt/construindo-o-prumo.mdx`).
2. Create `src/content/<collection>/en/<translated-slug>.mdx`:
   - same `translationKey`, `publishedAt`, `tags`, `project` (pointing to the `en/` project id if it exists);
   - `lang: en`, translated `slug` (kebab-case ASCII), `title`, `description` and body;
   - keep code blocks unchanged; translate code comments only if they are prose.
3. Preserve meaning and tone; do not add content. Flag ambiguous passages with `TODO(translation):`.
4. If this is the **first** English content:
   - add `'en'` to `ENABLED_LOCALES` in `src/i18n/config.ts` (shows the language switcher);
   - create the English routes in `src/pages/en/` mirroring `src/pages/` (pages take `lang`
     from the path; reuse the same components);
   - add `/en/rss.xml` and e2e tests for `/en` pages (`lang="en-US"`, axe scan).
5. Make sure the default-locale page passes the English version in `alternates` (hreflang).
6. Run the `quality-gate` skill.
