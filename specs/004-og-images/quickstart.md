# Quickstart: share images

```sh
pnpm build                      # writes dist/og/**/*.png
ls -la dist/og dist/og/blog     # one PNG per page, each < 300 KB
pnpm preview                    # open http://localhost:4321/og/index.png
pnpm test                       # unit: paths, page list, title fitting, renderer
pnpm test:e2e                   # e2e: meta tags + PNG 200/1200×630 on every page
```

Check a page's tags: `grep -o '<meta property="og:image[^>]*>' dist/blog/por-que-escolhi-astro.html`.

After deploy, paste `https://www.daaviib.site/blog/por-que-escolhi-astro` into the
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) (it also refreshes LinkedIn's cache).

Adding a page: add its entry to `buildOgPages` in `src/lib/og.ts` (static pages) — posts and projects are picked up
automatically.
