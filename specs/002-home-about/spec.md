# Feature Specification: Complete Home and About pages

**Feature Branch**: `002-home-about`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "Implement complete Home and About pages, following the approved screens and the design system, with experiences, a 'Now' panel and a new project entry as typed content."

Visual source of truth: the approved **Home** and **Sobre** screens in **daaviib — Telas** (desktop in the light
theme, mobile in the dark theme) and the **daaviib — Design System** artifact. The tokens and base components
from `specs/001-design-system` are reused.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Understand who Davi is from the Home page (Priority: P1)

A recruiter or potential client lands on the Home page. In one screen they learn what Davi does, whether he is
available, and what he is working on right now; scrolling, they see featured projects, the latest articles and a
short work history, and they can start a conversation from the end of the page.

**Why this priority**: the Home page is the entry point for almost every visit and the main conversion path.

**Independent Test**: build the site and open `/`; the sections appear in the approved order with real content,
nothing placeholder-like is shown, and the contact actions work.

**Acceptance Scenarios**:

1. **Given** availability is on in site config, **When** the Home page loads, **Then** the hero shows the availability line, the heading "Construo software de ponta a ponta e escrevo sobre o caminho.", the intro, a primary "Ver projetos" button linking to `/projects` and a "Fale comigo" button that opens the contact panel.
2. **Given** a published "Now" entry, **When** the Home page loads, **Then** a "Agora" panel beside the hero (below it on narrow screens) shows its update date, each item as a label/text pair, and a "Página Agora →" link to `/now`.
3. **Given** published featured projects, **When** the Home page loads, **Then** "Projetos em destaque" lists them in two columns (one on narrow screens) with a "Todos os projetos →" link.
4. **Given** published posts, **When** the Home page loads, **Then** "Últimos artigos" lists the three most recent with a "Ver o blog →" link.
5. **Given** work experiences, **When** the Home page loads, **Then** "Experiência" lists each job (newest first) with its period (e.g. "ago 2023 — atual"), "role · company" and its one-line summary, plus a "Sobre mim →" link.
6. **Given** the closing box "Vamos conversar?", **When** the visitor activates "Fale comigo", **Then** the contact panel opens; **When** they activate the email button, **Then** the address is copied and the copy is confirmed visually and to assistive technology.

---

### User Story 2 - Read Davi's background on the About page (Priority: P1)

A recruiter evaluating Davi opens `/about` to read how he started, his full work history with achievements, the
tools he uses daily, his education and languages, and then contacts him or downloads his CV.

**Why this priority**: the About page is where hiring decisions are informed; it carries the detailed history the
Home page only summarizes.

**Independent Test**: build the site and open `/about`; every section is present with the provided text, and the
contact action works.

**Acceptance Scenarios**:

1. **Given** the About page, **When** it loads, **Then** the hero shows the availability line, the heading "Oi, eu sou o Davi.", the lead paragraph and a "Fale comigo" button.
2. **Given** the About page, **When** the visitor scrolls, **Then** "Como comecei" shows the three story paragraphs in a reading-width column.
3. **Given** work experiences, **When** the About page loads, **Then** "Experiência" lists each job (newest first) with period, "role · company" and all highlights, followed by the "Projetos de estudo · Autodidata · 2020 — 2023" item.
4. **Given** the About page, **When** it loads, **Then** "Ferramentas do dia a dia" is a label/value list (not a tag cloud) with the seven categories in the provided order.
5. **Given** the About page, **When** it loads, **Then** "Formação e idiomas" shows the degree with its period ("out 2026 — em curso") and institution, and the languages.
6. **Given** the closing box "Vamos trabalhar juntos?", **When** the visitor activates "Fale comigo", **Then** the contact panel opens with the About-page message.

---

### User Story 3 - Optional assets appear only when they exist (Priority: P2)

The author can add a CV (PDF) and a portrait later without touching page code. Until then, visitors never see a
broken link, an empty frame or a placeholder.

**Why this priority**: the pages must be publishable now, before these assets exist.

**Independent Test**: build without the files and confirm no CV button and no photo; add the files, rebuild, and
confirm both appear.

**Acceptance Scenarios**:

1. **Given** no CV file is present, **When** the About page loads, **Then** no "Baixar CV (PDF)" button is shown anywhere on the page.
2. **Given** the CV file is present, **When** the About page loads, **Then** "Baixar CV (PDF)" appears in the hero and in the closing box and downloads the file.
3. **Given** no portrait is present, **When** the About page loads, **Then** the hero text uses the full width and no image frame is shown.
4. **Given** the portrait is present, **When** the About page loads, **Then** it is shown at 4:5 beside the hero text (above it on narrow screens), optimized and with descriptive alternative text.

---

### User Story 4 - "Now" page from the same data (Priority: P3)

A visitor following "Página Agora →" reaches `/now`, which shows the same items as the Home panel and when they
were last updated.

**Why this priority**: it completes the Home panel's link; the data is shared so the two never disagree.

**Independent Test**: open `/now`; it lists the same label/text items and update date as the Home panel.

**Acceptance Scenarios**:

1. **Given** a published "Now" entry, **When** `/now` loads, **Then** it shows the heading, the update date and every item.
2. **Given** an item links to a page that is not published (e.g. a draft project), **When** the Home panel or `/now` renders, **Then** the item text is shown without a link.

### Edge Cases

- A section with no published items (no featured projects, no posts, no experiences, no "Now" entry) is hidden entirely, heading and link included; no "nothing here yet" text appears on the Home page.
- An experience without a summary shows on the Home page without the summary line.
- An experience with no end date shows "atual" (current); study items show years only ("2020 — 2023").
- Availability off in site config: the availability line disappears from both heroes.
- JavaScript disabled: "Fale comigo" buttons fall back to `mailto:` links; the email address remains readable on the copy button.
- Clipboard unavailable: the copy button selects the address instead and still confirms.
- Narrow screens: the hero grids collapse to one column; label/value lists stack the label above the value.
- Only one featured project: it occupies one column; the layout does not stretch it.

## Requirements _(mandatory)_

### Functional Requirements

**Home**

- **FR-001**: The Home page MUST show, in order: hero with "Agora" panel, featured projects, latest articles (3), experience, and the closing "Vamos conversar?" box, laid out as in the approved screens (hero 7/5 columns on wide screens).
- **FR-002**: The hero MUST show the availability line only when availability is on, the heading and intro from the UI strings, a primary "Ver projetos" link and a secondary "Fale comigo" control that opens the contact panel.
- **FR-003**: The "Agora" panel MUST show the update date in the monospace meta style, the items as a definition list (label/text) and a link to `/now`.
- **FR-004**: The experience section on the Home page MUST list work experiences only (not study items), newest first, with period, role, company and summary.
- **FR-005**: The closing box MUST use the dot-pattern surface, the provided text, a primary "Fale comigo" control and a secondary button showing the email that copies it with visual and announced confirmation.

**About**

- **FR-006**: The About page MUST show, in order: hero (8/4 columns on wide screens), "Como comecei", "Experiência", "Ferramentas do dia a dia", "Formação e idiomas", and the closing "Vamos trabalhar juntos?" box.
- **FR-007**: The "Experiência" section MUST list work experiences with all highlights, newest first, followed by the self-taught study projects item.
- **FR-008**: Tools and education MUST be shown as label/value lists, matching the approved screens.
- **FR-009**: The "Baixar CV (PDF)" action MUST appear (hero and closing box) only when the CV file exists in the project.
- **FR-010**: The portrait MUST appear only when the image file exists, at a 4:5 ratio, optimized at build time, with alternative text.

**Now**

- **FR-011**: `/now` MUST render the same "Now" data as the Home panel (date and items).
- **FR-012**: A "Now" item link to an unpublished page MUST render as plain text.

**Content and data**

- **FR-013**: Experiences, the "Now" entry, About-page content and the new "Este site" project MUST be typed content validated at build time; invalid content MUST fail the build.
- **FR-014**: Experiences MUST support an optional per-locale one-line summary and a kind (work or study) that drives where they appear and how their period is formatted.
- **FR-015**: Periods MUST be formatted per locale as abbreviated month and year ("ago 2023 — atual"; "Aug 2023 — present"), or years only for study items.
- **FR-016**: Only the provided texts may be used. Anything not provided is hidden, never shown as a placeholder in production.

**Cross-cutting**

- **FR-017**: All interface text MUST come from the UI strings, with Portuguese and English keys; page content is Portuguese now, English later.
- **FR-018**: Pages MUST use only the existing design tokens and components; a new component is created only for a pattern used more than once.
- **FR-019**: The only new client-side behaviour is copying the email; its logic MUST be shared with the contact panel rather than duplicated.

### Key Entities

- **Experience**: a role at a company or a self-taught period. Company, role (per locale), kind (work or study), start, optional end (absent = current), optional summary (per locale), highlights (per locale), stack.
- **Now entry**: what Davi is focused on, per locale. Update date and an ordered list of items (label, text, optional link).
- **About profile**: About-page content per locale. Lead paragraph, story paragraphs, tool categories (label + list), education entries (period, title, institution) and languages.
- **Project "Este site"**: a project entry. Name, summary, stack, status active, featured, repository link.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Lighthouse scores ≥ 95 in Performance, Accessibility, Best Practices and SEO on `/`, `/about` and `/now`.
- **SC-002**: Zero WCAG 2.1 AA violations reported by axe on `/`, `/about` and `/now`, in light and dark themes, at desktop and mobile widths.
- **SC-003**: No placeholder text (bracketed placeholders, "TODO", "Em breve") is visible on any built page in production.
- **SC-004**: The Home and About pages add no client-side script beyond the shared email-copy behaviour (under 1 KB gzipped).
- **SC-005**: Unit coverage of `src/lib` and `src/i18n` stays ≥ 90% lines with the new helpers tested (experience ordering, period formatting).

## Assumptions

- The English versions of the content (experiences, "Now", About profile) are written later; English UI strings are added now because the UI dictionary requires every key in both locales.
- The "Prumo" project stays a draft, so in production the Home shows only "Este site" as a featured project and the "Construindo: Prumo" item renders without a link.
- The item "Escrevendo: A série "Construindo este site"" has no link, since no series page exists yet.
- The cover keyword for "Este site" is "Site", as in the approved screen.
- The CV file lives at `public/cv/davi-brito-cv.pdf` and the portrait at `src/assets/about/davi.jpg`; neither exists yet.
- The project page for "Este site" has no body text yet (none was provided); it shows the summary, cover and contact call to action.
