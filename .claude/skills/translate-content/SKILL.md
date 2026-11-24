---
name: translate-content
description: Add the English (or other locale) version of a post or project, linked by translationKey, and enable English routes the first time. Use when asked for an English version, to translate content, or to enable the English site.
---

# Add another locale's version

**Posts are written by the author in English, not translated.** For a post, do not translate the Portuguese body.
Scaffold the entry, then either review the English text Davi wrote or, if he explicitly asks for a first draft,
write one with the `write-post` skill (same facts, voice and anti-slop rules) and mark it clearly as a draft for him
to rewrite. Projects, UI strings and short metadata may be translated directly.

1. Read the source entry (e.g. `src/content/posts/pt/construindo-o-prumo.mdx`).
2. Create `src/content/<collection>/en/<slug>.mdx`:
   - same `translationKey`, `publishedAt`, `tags`, `project` (pointing to the `en/` project id if it exists);
   - `lang: en`, `slug` (kebab-case ASCII), `title`, `description` and body;
   - **slug:** whether English slugs are translated or equal to the Portuguese ones is still open. Ask the author
     if no earlier English entry settles it, and follow what earlier English entries did once one exists;
   - code blocks stay unchanged.
3. For a post, keep `draft: true` until the author approves. Run
   `node .claude/skills/write-post/scripts/slop-check.mjs <file>` on the English text too.
4. If this is the **first** English content:
   - add `'en'` to `ENABLED_LOCALES` in `src/i18n/config.ts` (shows the language switcher);
   - create the English routes in `src/pages/en/` mirroring `src/pages/` (pages take `lang`
     from the path; reuse the same components);
   - include English entries in each `getStaticPaths` that today reads only the default locale;
   - add `/en/rss.xml` and e2e tests for `/en` pages (`lang="en-US"`, axe scan).
5. Make sure both versions pass each other in `alternates` (hreflang).
6. Run the `quality-gate` skill.
