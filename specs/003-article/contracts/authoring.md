# Contract: writing articles

Authoring syntax supported by the article page. Anything else in MDX renders with the default prose styles.

## Code block with a file name

````mdx
```ts title="src/content.config.ts"
const posts = defineCollection({/* … */});
```
````

- `title` (single or double quotes) becomes the caption above the code. Without it, the block has no caption.
- Every block gets a "Copiar" button that copies the code only.

## Note

```mdx
<Note>Rascunhos com `draft: true` aparecem no `pnpm dev`, mas nunca no build de produção.</Note>
```

No import needed. Inline Markdown (code, links, emphasis) works inside.

## Headings

Use `##` for sections: each becomes an entry in "Neste artigo". `###` and below are not listed.

## Series

Set `series: <name>` in the frontmatter; posts with the same name (and locale) form the series, ordered by `publishedAt`.
