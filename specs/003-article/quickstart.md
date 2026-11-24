# Quickstart: validate the article page

```sh
pnpm validate          # format, lint, types, unit tests, build
pnpm test:coverage     # toc, series, related, code-frame, structured-data
pnpm test:e2e          # article page desktop/mobile, copy, CTA, JSON-LD, axe both themes
pnpm lhci              # ≥ 95 incl. /blog/por-que-escolhi-astro
```

Manual (`pnpm build && pnpm preview`, open `/blog/por-que-escolhi-astro`):

1. Desktop ≥ 1180px: back link, "Série · Construindo este site · 1 de 1", date · reading time, H1, lead, wide "Astro" cover.
   Side column sticks while scrolling; "Neste artigo" lists 4 sections and highlights the current one. No series list
   (one post). Share: copy link, LinkedIn, X.
2. Code block shows `src/content.config.ts` and "Copiar"; clicking shows "Copiado" and the clipboard has the code only.
3. The note has a border, surface background and blue info icon.
4. Scroll: a 2px blue bar grows at the top (Chrome/Edge); none with reduced motion or in browsers without support.
5. End: tags (not links), "Gostou do artigo?" opens the dialog with "Li seu artigo “Por que escolhi Astro para este site”".
   No "Continue lendo" (no other post).
6. Mobile (390px, dark): collapsed "Neste artigo" above the body; share after the tags.
7. `/blog/ola-mundo` → 404. View source: one `application/ld+json` `BlogPosting`.

Authoring rules: [contracts/authoring.md](./contracts/authoring.md).
