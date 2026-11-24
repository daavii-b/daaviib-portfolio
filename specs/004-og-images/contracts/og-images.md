# Contract: share images and meta tags

What social networks and crawlers read from every page.

## Image file

- URL: `{site}/og/{page path}.png`; Home: `{site}/og/index.png`. Content type `image/png`, 1200×630, < 300 KB.
- Layout (light theme, values from `--ds-*` tokens):

```text
┌──────────────────────────────────────────────── 1200 ─┐  surface #f4f4f5, dot grid #e4e4e7 / 16px,
│  LABEL (Inter 500, uppercase, muted)             ■    │  1px border #e4e4e7, padding 64px,
│                                                       │  ■ = 12px cobalt #1d5fd6
│  Title in Space Grotesk 700,                          │  title: text #09090b, 88→48px,
│  up to three lines, never splitting words             │  ≤ 3 lines, surface behind each line
│                                                       │
│  Davi Brito · Fullstack Engineer        daaviib.site  │  Inter 500, muted #52525b
└───────────────────────────────────────────────── 630 ─┘
```

## Meta tags (every page)

```html
<title>{page title} · Davi Brito</title>
<!-- Home: Davi Brito · Fullstack Engineer -->
<meta name="description" content="… ≤ 160 chars" />
<meta property="og:image" content="https://www.daaviib.site/og/blog/por-que-escolhi-astro.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Por que escolhi Astro para este site" />
<meta name="twitter:image" content="https://www.daaviib.site/og/blog/por-que-escolhi-astro.png" />
```

The 404 page declares the Home image. Articles add `"image": "<same URL>"` to the `BlogPosting` JSON-LD.
