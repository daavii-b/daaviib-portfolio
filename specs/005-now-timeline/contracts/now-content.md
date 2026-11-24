# Contract: Now content and rendered structure

## `src/content/now/pt.json`

```json
{
  "lang": "pt",
  "updatedAt": "2026-11-23",
  "status": "Construindo o [Prumo](/projects/prumo), escrevendo a série [Construindo este site](/projects/este-site) e …",
  "items": [
    { "label": "Construindo", "title": "Prumo", "href": "/projects/prumo", "linkLabel": "Ver o projeto" },
    { "label": "Escrevendo", "title": "…", "text": "…", "series": "Construindo este site" }
  ],
  "history": [
    {
      "date": "2026-11-23",
      "note": "Primeira versão desta página.",
      "changes": [{ "kind": "added", "text": "…" }]
    }
  ]
}
```

Build errors (exact wording may vary, both dates always present):

- `updatedAt is 2026-11-23 but the newest history entry is 2026-11-30`
- `status: link "[Prumo](projects/prumo)" must point to a site path or an https URL`
- `status: unbalanced "[" or "]"`
- `Now (pt): item "Escrevendo" references series "X", which has no posts`
- Zod enum error for an unknown `kind`.

## Home (`/`)

```text
section[aria-labelledby=hero]       full content width; intro max-w-lead
section[aria-labelledby=now]        border-t hairline, max-w-lead, no card border
  h2  "Agora · <time datetime=YYYY-MM-DD>YYYY-MM-DD</time>"   (eyebrow; date in text-meta)
  p   status sentence (NowStatus size=home)
  a   "Página Agora →" → /now
```

Hidden entirely when there is no entry.

## `/now`

```text
h1 "Agora"
p  now.intro with <a href=https://nownownow.com/about>now</a>
p  "Atualizado em <time>23 de novembro de 2026</time> · <a href=#timeline>ver linha do tempo</a>"
p  status sentence (NowStatus size=page)
section[aria-labelledby=<item id>] × items
  p.eyebrow label · h2 title · p text? · ol (series posts: "01" + link)? · a linkLabel →?
section#timeline[aria-labelledby=timeline-title]
  h2 "Linha do tempo" · p intro · ul legend (+ entrou, ~ mudou, − saiu)
  ol > li (newest first): time (short) + "atual" badge on the first · p note? · ul changes
    li: span[aria-hidden] sign · span.sr-only "entrou: " · text
```

Without an entry: only `h1` and the intro sentence.
