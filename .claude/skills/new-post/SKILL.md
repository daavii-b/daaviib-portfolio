---
name: new-post
description: Create a new blog post in this repo with valid frontmatter, translated slug and correct folder. Use when the user asks to write, draft or scaffold an article/post.
---

# New blog post

1. Ask for (or infer) the topic, title and locale. Default locale is `pt`.
2. Create `src/content/posts/<lang>/<slug>.mdx` where `<slug>` is kebab-case ASCII **in that
   language** (no accents: `construindo-o-prumo`, not `construíndo-o-prumo`).
3. Frontmatter (schema in `src/content.config.ts`, the build fails if it is wrong):

   ```yaml
   ---
   lang: pt
   translationKey: building-prumo # English, stable, shared by all translations
   slug: construindo-o-prumo
   title: Construindo o Prumo
   description: One sentence, max 200 chars — also used in the newsletter email.
   publishedAt: 2026-12-01
   tags: [astro, prumo]
   series: Construindo o Prumo # optional; posts with the same name form a series
   keyword: Prumo # optional, max 14 chars; big word on the cover (defaults to the first tag)
   project: pt/prumo # optional, id of a project entry
   draft: true # keep true until the author approves
   ---
   ```

4. Start with `draft: true`. Only the author flips it to `false`.
5. Code blocks must declare a language (` ```ts `) for syntax highlighting; add `title="path/to/file.ts"` to show the
   file name above the block (every block gets a copy button).
6. Use `##` for sections: they become the "Neste artigo" table of contents. For a highlighted remark use
   `<Note>…</Note>` (no import needed).
7. Images go in `src/assets/posts/<slug>/` and are imported, so Astro optimizes them; always
   write meaningful `alt` text.
8. Run `pnpm check && pnpm build` to validate the frontmatter.
9. Commit as `feat(content): add post "<title>"` (or `docs(content)` for edits).

Do not invent facts about the author's experience or projects; leave `TODO:` markers instead.
