# Implementation Plan: Design system in code

**Branch**: `001-design-system` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

## Summary

Translate the daaviib design system into a Tailwind v4 token layer, self-hosted fonts and a small set of
Astro components, plus a contact panel built on the native `<dialog>` element with a ~2 KB script.

## Technical Context

**Language/Version**: TypeScript 6, Astro 7, Tailwind CSS 4
**Primary Dependencies**: `@fontsource-variable/inter`, `@fontsource-variable/space-grotesk`, `@fontsource-variable/jetbrains-mono` (fonts only; no UI framework)
**Testing**: Vitest (contact helpers), Playwright + axe (dialog flow, both themes)
**Target Platform**: static site on Vercel
**Performance Goals**: Lighthouse ≥ 95; contact script < 5 KB gz
**Constraints**: no runtime third-party requests; WCAG 2.1 AA

## Constitution Check

| Principle                            | Compliance                                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| I. Spec before code                  | This spec, plan and tasks precede implementation.                                                        |
| II. Static first, zero JS by default | Only the theme toggle and contact dialog ship JS, as small inline/bundled scripts. No framework runtime. |
| III. Content is typed data           | Unchanged; covers derive from existing frontmatter (`tags`, `title`).                                    |
| IV. Bilingual by design              | New UI strings added to `ui.ts` for `pt` and `en`; contact messages per locale.                          |
| V. Accessible and fast               | axe in both themes; dialog focus management; Lighthouse in CI.                                           |
| VI. Tests guard behaviour            | Pure contact helpers unit-tested; dialog flow e2e.                                                       |
| VII. Simplicity                      | Three font packages (self-hosting fonts = no third-party request). No other dependency.                  |

## Project Structure

```
src/
  config/site.ts            # + email, whatsapp, scheduling, availability
  styles/global.css         # tokens (light/dark), shadcn-compatible aliases, base, utilities
  lib/contact.ts            # pure: message, subject, whatsapp/mailto URLs
  components/
    SiteHeader.astro        # name — section, role, nav, contact trigger, theme toggle
    Footer.astro
    Button.astro            # primary | secondary | ghost
    Tag.astro               # topic | series | neutral
    PostCover.astro         # typographic cover
    PostCard.astro
    ProjectCard.astro
    ContactDialog.astro     # <dialog> + script
    ContactCTA.astro        # end-of-article/project call to action
tests/unit/contact.test.ts
tests/e2e/contact.spec.ts
```

## Complexity Tracking

None.
