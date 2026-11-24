# Feature Specification: Design system in code

**Feature Branch**: `001-design-system`

**Created**: 2026-11-23

**Status**: Approved

**Input**: User description: "Implement the daaviib design system in code: tokens, fonts, base components and a native contact dialog"

Source of truth for the look: the **daaviib — Design System** artifact (palette "Grafite e Cobalto",
Space Grotesk + Inter + JetBrains Mono) and the approved screens in **daaviib — Telas**
(Blog, Article, Home, About, Contact).

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Consistent look in both themes (Priority: P1)

A reader opens any page and sees the approved visual identity: graphite neutrals, cobalt as the only
interaction color, the three typefaces, and the same component shapes, in light and dark themes.

**Why this priority**: every screen to be implemented next depends on these tokens and components.

**Independent Test**: build the site and open each existing page in light and dark; every color, font
and radius comes from a token, and axe reports no contrast violations.

**Acceptance Scenarios**:

1. **Given** a first visit with the OS in dark mode, **When** a page loads, **Then** it renders in the dark theme without a flash of the light theme.
2. **Given** any page, **When** the reader toggles the theme, **Then** the choice persists across reloads and pages.
3. **Given** the light or dark theme, **When** axe scans a page, **Then** there are zero WCAG 2.1 AA violations.

---

### User Story 2 - Contact without leaving the page (Priority: P1)

A recruiter or client wants to get in touch. From the header on any page (or the call to action at the end
of an article) they open a contact panel with a message already written for the page they are on, and send
it by WhatsApp or email, or copy the email address.

**Why this priority**: contact is the main conversion of the portfolio.

**Independent Test**: open the panel on the blog and on an article; the message mentions the page; the
WhatsApp and email links carry that message; copying the email shows a confirmation.

**Acceptance Scenarios**:

1. **Given** any page, **When** the reader activates "Contato", **Then** a modal panel opens, focus moves inside it, and Esc, the close button or a click outside closes it and returns focus to the trigger.
2. **Given** the article "X", **When** the panel opens, **Then** the message reads "Olá, Davi! Li seu artigo “X” e gostaria de conversar sobre ".
3. **Given** the reader edited the message, **When** they choose WhatsApp or Email, **Then** the opened link contains the edited message (email also with subject "Contato pelo site — {página}").
4. **Given** the panel is open, **When** the reader copies the email, **Then** the button reads "Copiado" and a status message "Email copiado" is announced and disappears after ~2 s.
5. **Given** the availability flag is on in site config, **When** the panel opens, **Then** it shows "Aberto a projetos PJ e freelas"; when off, the line is absent.
6. **Given** no scheduling URL is configured, **When** the panel opens, **Then** the "Agendar uma conversa" option is not shown.

---

### User Story 3 - Building blocks for the next screens (Priority: P2)

The author (and agents) can compose new screens from documented components instead of styling ad hoc.

**Independent Test**: the blog list and project list render using `PostCard`, `ProjectCard`, `Tag` and
`PostCover`; no component contains raw hex colors.

**Acceptance Scenarios**:

1. **Given** a post without a cover image, **When** it is listed, **Then** it shows a typographic cover with its keyword and topic.

### Edge Cases

- JavaScript disabled: the contact trigger still works as a plain `mailto:` link fallback; pages remain readable.
- `prefers-reduced-motion`: no hover lifts, slides or fades.
- Clipboard API unavailable: the copy button selects the address text instead and still shows feedback.
- Very long article titles in the contact message are kept whole (the textarea scrolls).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Color tokens MUST match the design system for light and dark themes and be exposed as Tailwind utilities.
- **FR-002**: Fonts MUST be self-hosted (no request to Google Fonts at runtime).
- **FR-003**: Theme MUST default to the OS preference, be toggleable, persist in `localStorage`, and apply before first paint.
- **FR-004**: The contact panel MUST use the native `<dialog>` element and plain TypeScript (no UI framework runtime).
- **FR-005**: Contact message, subject and links MUST be built by pure, unit-tested functions.
- **FR-006**: Email, WhatsApp number, scheduling URL and availability MUST live in `src/config/site.ts`.
- **FR-007**: Components MUST use only design tokens (no raw hex/rgb in components).
- **FR-008**: Horizontal scroll rows MUST hide the scrollbar and show an edge fade.
- **FR-009**: Token names MUST stay compatible with a later shadcn/ui adoption (`--background`, `--foreground`, `--primary`, … aliases).

### Key Entities

- **Site config**: author, role, email, WhatsApp (E.164 digits), scheduling URL (optional), availability (on/off + label), social links.
- **Contact context**: page kind (home, blog, article, project, about, other) + optional title.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Lighthouse ≥ 95 in all categories on `/`, `/blog`, `/projects`, `/about`.
- **SC-002**: Zero axe violations on every page in both themes.
- **SC-003**: The contact panel adds less than 5 KB of JavaScript (gzipped) to a page.
- **SC-004**: Unit coverage of `src/lib` and `src/i18n` stays ≥ 90% lines.

## Assumptions

- shadcn/ui is deferred; the native dialog may later be swapped without changing the token layer.
- Full screen layouts (Home, Article, About, Projects) are implemented in later specs; this one updates existing pages only enough to use the new components.
- The scheduling link is not available yet.
