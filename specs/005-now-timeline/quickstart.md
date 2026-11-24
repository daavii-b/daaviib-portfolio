# Quickstart: validate the Now timeline

## Prerequisites

`pnpm install`, Node 22.

## Checks

1. `pnpm validate` — format, lint, types (`astro check` runs the content schemas), unit tests with coverage.
2. `pnpm build && pnpm test:e2e` — Home and `/now` structure, links, timeline and axe (light + dark).
3. `pnpm lhci` — ≥ 95 on `/` and `/now`.

## Manual scenarios

- `pnpm dev`, open `/`: hero spans the content width; below the buttons, a hairline, "AGORA · 2026-11-23", the
  sentence (Prumo plain text, "Construindo este site" linked) and "Página Agora →".
- Open `/now`: header with "now" link and "ver linha do tempo" jumping to `#timeline`; four sections; Escrevendo lists
  "01 Por que escolhi Astro para este site" only (the i18n post is a draft); timeline with one "atual" node.
- Date guard: change `updatedAt` in `src/content/now/pt.json` to `2026-11-24` and run `pnpm check` → fails naming
  `2026-11-24` and `2026-11-23`. Revert.
- Series guard: set the Escrevendo `series` to `"Nada"` and run `pnpm build` → fails naming the series. Revert.
- Link guard: write `[Prumo](projects/prumo)` in `status` → schema error. Revert.
