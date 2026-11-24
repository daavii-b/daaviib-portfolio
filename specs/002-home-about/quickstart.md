# Quickstart: validate Home and About

## Prerequisites

`pnpm install --frozen-lockfile`; a Playwright Chromium (`pnpm exec playwright install chromium`) for e2e.

## Automated checks

```sh
pnpm validate            # format, lint, astro check, unit tests, build
pnpm test:coverage       # ≥ 90% lines in src/lib and src/i18n (new: experience, links, files)
pnpm test:e2e            # Home/About sections, optional assets hidden, copy, axe both themes × desktop/mobile
pnpm lhci                # ≥ 95 on /, /about, /now (also in CI)
```

## Manual scenarios (`pnpm build && pnpm preview`)

1. `/` — hero with availability, heading, intro, "Ver projetos" and "Fale comigo"; "Agora" panel with 2026-11-23 and four
   items, "Construindo: Prumo" without a link (Prumo is a draft); "Este site" as the only featured project; no
   "Últimos artigos" section (no published posts); two jobs in "Experiência" with summaries; "Vamos conversar?" box.
2. Click the email button in the closing box → check icon and "Email copiado" announced; clipboard holds the address.
3. `/about` — hero without photo and without "Baixar CV (PDF)"; "Como comecei" (3 paragraphs); three experience items
   ending with "Projetos de estudo · Autodidata"; tools as seven label/value rows; education and languages; closing box.
4. Drop any JPEG at `src/assets/about/davi.jpg` and any PDF at `public/cv/davi-brito-cv.pdf`, rebuild → photo at 4:5 and
   two CV buttons appear. Remove them again before committing.
5. `/now` — same date and items as the Home panel.
6. Repeat 1 and 3 in the dark theme and at 390 px width (columns collapse; label/value rows stack).

Contracts for the content files: [contracts/content-files.md](./contracts/content-files.md).
