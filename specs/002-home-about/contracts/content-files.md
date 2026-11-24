# Contract: content files for Home, About and Now

The site exposes no API; its contract is with the author, who edits these files. Shapes and rules are in
[data-model.md](../data-model.md); this page shows minimal valid examples. A file that breaks these rules fails `pnpm build`.

## `src/content/experiences/<id>.json`

```json
{
  "company": "AX4B",
  "role": { "pt": "Full Stack Software Engineer" },
  "kind": "work",
  "start": "2023-08",
  "summary": { "pt": "Uma linha para a Home." },
  "highlights": [{ "pt": "Uma conquista para a página Sobre." }]
}
```

Omit `end` for the current role. `kind: "study"` shows the period in years and keeps the item off the Home page.

## `src/content/now/<lang>.json`

```json
{
  "lang": "pt",
  "updatedAt": "2026-11-23",
  "items": [{ "label": "Construindo", "text": "Prumo", "href": "/projects/prumo" }]
}
```

`href` to a page that is not published renders as text, so linking ahead of publishing is safe.

## `src/content/about/<lang>.json`

```json
{
  "lang": "pt",
  "lead": "Parágrafo de abertura.",
  "story": ["Primeiro parágrafo.", "Segundo parágrafo."],
  "tools": [{ "label": "Linguagens", "items": ["TypeScript", "Python"] }],
  "education": [{ "period": "out 2026 — em curso", "title": "Curso", "institution": "Instituição" }],
  "languages": "Português nativo, inglês intermediário"
}
```

## Optional files

- `public/cv/davi-brito-cv.pdf` → shows "Baixar CV (PDF)".
- `src/assets/about/davi.jpg` → shows the portrait (any size; cropped to 4:5).
