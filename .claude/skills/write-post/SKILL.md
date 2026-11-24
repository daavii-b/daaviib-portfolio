---
name: write-post
description: Write, draft, scaffold or revise a blog post for this site in the author's voice, with valid frontmatter and no AI slop. Use whenever the user asks for an article, a post, a draft, a series entry, or to edit or tighten an existing post in src/content/posts.
---

# Write a post

Posts here are read by engineers deciding whether Davi is worth hiring or following. A post that sounds generated
costs more than no post. The job is a short, specific, true text in his voice, not a long one.

Read these before writing:

- `references/voice.md` — how Davi writes (taken from his published posts).
- `references/anti-slop.md` — patterns that are banned, with the rewrite for each.

## 1. Collect facts before words

A post is built from things that exist. Before drafting, gather:

- **The code.** Open the files the post talks about. Every snippet is copied from the repo (trimmed is fine,
  invented is not) and gets `title="path/to/file.ts"`.
- **The history.** `git log --oneline -- <paths>` and the specs in `specs/NNN-*` show what was decided and when.
- **The author's reasons.** Why he chose something is his to say. Use what he said in the conversation or in specs.
  If a reason is missing, do not supply a plausible one: write `{/* TODO(autor): por que X? */}` in the draft and ask.

Never invent experience, numbers, clients, results, benchmarks or anecdotes ("um dia, debugando às 3h…").
A number appears only if it was measured and you can point to where.

## 2. Agree on the point

Write one sentence: what the reader can do or understand after reading that they could not before.
If it needs "e" twice, it is two posts. Show it to the author with a 3–6 item outline of `##` sections before
drafting a long post. For a short post or an explicit "just draft it", go ahead and show the outline with the draft.

## 3. Scaffold the file

Create `src/content/posts/<lang>/<slug>.mdx`. `<slug>` is kebab-case ASCII **in that language**
(`construindo-o-prumo`, not `construíndo-o-prumo`). Schema: `src/content.config.ts` (the build fails if it is wrong).

```yaml
---
lang: pt
translationKey: building-prumo # English, stable, shared by every locale version
slug: construindo-o-prumo # per locale; translated or equal across locales is still undecided
title: Construindo o Prumo # max 100 chars
description: Uma frase, até 160 caracteres. Vai para o card, a busca, o RSS, a imagem de compartilhamento e a newsletter.
publishedAt: 2026-12-01
tags: [astro, prumo]
series: Construindo o Prumo # optional; posts with the same name form a series (box shows from 2 posts)
keyword: Prumo # optional, max 14 chars; big word on the cover (defaults to the first tag)
project: pt/prumo # optional, id of a project entry
draft: true # only the author flips it to false
---
```

Authoring features:

- `##` sections become the "Neste artigo" table of contents; `###` only inside a long section.
- Code fences declare a language and usually a `title="…"`; each gets a copy button.
- `<Note>…</Note>` (no import) for one remark the reader must not miss. At most one or two per post.
- Images go in `src/assets/posts/<slug>/`, imported so Astro optimizes them, always with a real `alt`.
- MDX comments: `{/* … */}`. Use them for TODOs; they never render.

## 4. Draft

Follow `references/voice.md`. In short: first person, short sentences, the decision before the explanation,
code as evidence, no introduction section, no conclusion section. Target 600–1200 words unless the topic needs more.

## 5. Slop pass (mandatory)

Run the checker and fix every hit or justify it to the author:

```sh
node .claude/skills/write-post/scripts/slop-check.mjs src/content/posts/pt/<slug>.mdx
```

Errors fail the run; warnings (`triad`, `question`) need your judgment: a concrete list of three nouns is
fine, three reflex adjectives are not. It flags banned phrases, em dashes in prose, exclamation marks, emoji, rhetorical questions, "não é X, é Y",
long sentences and paragraphs, and recap endings. It ignores frontmatter and code. A clean run is necessary,
not sufficient: then reread against `references/anti-slop.md`, especially the structural patterns the script
cannot see (triads, generic headings, padding sections, the summary ending).

Then do a **deletion pass**: remove every sentence the post still works without. Expect to cut 10–20%.

## 6. Verify

- Every claim about the code matches the code on `main` (names, paths, values). Run snippets' logic if in doubt.
- Every link resolves; external links point to primary sources (official docs, specs, repos).
- `description` reads well alone, out of context, in under 160 chars.
- `pnpm check && pnpm build` pass. Preview with `pnpm dev` (drafts show only in dev).

## 7. Hand off

Deliver the draft with: the one-sentence point, the open `TODO(autor)` questions, and what you cut or doubted.
Keep `draft: true`. Commit as `feat(content): add draft "<title>"` (or `docs(content): …` for edits) on a branch.

English posts are written by the author in English. To scaffold or review one, use the `translate-content` skill; the
same anti-slop rules apply.
