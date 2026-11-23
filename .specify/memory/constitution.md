<!--
Sync Impact Report
- Version: 0.0.0 → 1.0.0 (initial ratification)
- Principles added: I–VII
- Templates: plan/spec/tasks templates read this file at runtime; no edits required.
- Follow-up TODOs: none
-->

# Portfolio & Blog Constitution

## Core Principles

### I. Spec Before Code (NON-NEGOTIABLE)

Every feature starts as a spec in `specs/NNN-feature/` created with `/speckit-specify`, followed by
`/speckit-plan` and `/speckit-tasks` before `/speckit-implement`. Specs describe the **what** and
**why** for readers; plans describe the **how**. Trivial changes (typos, dependency bumps, copy
edits, config tweaks with no behaviour change) are exempt. A PR implementing a feature MUST link
its spec, and the spec MUST be updated when behaviour changes during implementation.

### II. Static First, Zero JS by Default

Pages are pre-rendered HTML served from a CDN. Client JavaScript is allowed only for real
interaction (theme toggle, search, forms) and MUST be scoped to an island or a small inline
script. Server code is introduced only when a feature cannot work statically (the newsletter is
the only planned case) and MUST NOT sit on the reading path of any page.

### III. Content Is Typed Data

All content lives in the repository as MD/MDX/JSON validated by Zod schemas in
`src/content.config.ts`. A build MUST fail on invalid frontmatter. No CMS, no runtime content
fetching. Drafts (`draft: true`) and future `publishedAt` dates never reach production.

### IV. Bilingual by Design

Portuguese (`pt`) is the default locale; English (`en`) is planned. Therefore:

- Route segments are English in every locale (`/blog`, `/projects`, `/about`); slugs are
  translated per locale and linked by `translationKey`.
- The default locale has no URL prefix; other locales use `/{lang}/`.
- No user-facing string is hard-coded in components: UI strings live in `src/i18n/ui.ts` with the
  same keys for every locale (enforced by type and test).
- Dates and numbers are formatted with `Intl` for the page locale.

### V. Accessible and Fast — Verified, Not Assumed

WCAG 2.1 AA is the floor. Every page has an e2e test with an axe scan and zero violations.
Lighthouse scores MUST stay ≥ 95 in Performance, Accessibility, Best Practices and SEO (enforced
by Lighthouse CI). Light and dark themes are both first-class.

### VI. Tests Guard Behaviour

Pure logic lives in `src/lib/` and `src/i18n/` with unit tests (Vitest, ≥ 90% line coverage).
Pages and user flows are covered by Playwright. A bug fix starts with a failing test that
reproduces it. Tests are written in the same PR as the behaviour they cover.

### VII. Simplicity and Ownership

Prefer platform features and Astro built-ins over dependencies. Each new runtime dependency
needs a one-line justification in the plan. Data the author owns (content, subscriber list)
stays in systems the author controls and can export.

## Technology Constraints

- Astro (static output) + TypeScript in `strictest` mode + Tailwind CSS v4 + MDX.
- Node 22 LTS and pnpm; lockfile committed; `pnpm install --frozen-lockfile` in CI.
- Hosting on Vercel; no secrets in the repository (`.env.example` documents variables).
- Post-v1 newsletter: Postgres (Neon), Resend, QStash and Turnstile, per the System Design.
- Privacy: no tracking cookies; analytics must be cookieless; LGPD consent recorded for
  any personal data.

## Development Workflow & Quality Gates

1. Branch from `main` as `NNN-short-name` (SpecKit) or `type/short-name` for exempt changes.
2. Commits follow Conventional Commits; enforced by commitlint (local hook + CI).
3. Pre-commit hook runs ESLint and Prettier on staged files.
4. A PR merges only when CI is green: format, lint, `astro check`, unit tests with coverage,
   build, e2e + axe, Lighthouse CI, conventional PR title.
5. Run `/speckit-analyze` before `/speckit-implement` on any feature touching more than one
   area (content model, routing, UI).
6. `main` is always deployable; Vercel deploys every merge and previews every PR.

## Governance

This constitution supersedes other practices in the repository. Plans MUST include a
"Constitution Check" that lists each principle and how the feature complies, or justifies any
deviation in a Complexity Tracking table. Amendments are made with `/speckit-constitution`,
bump the version (MAJOR: principle removed or redefined; MINOR: principle or section added;
PATCH: wording) and are recorded in the Sync Impact Report at the top of this file. Runtime
guidance for agents lives in `CLAUDE.md`.

**Version**: 1.0.0 | **Ratified**: 2026-11-23 | **Last Amended**: 2026-11-23
