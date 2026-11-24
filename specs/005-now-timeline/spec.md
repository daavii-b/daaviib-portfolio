# Feature Specification: "Agora" as a status sentence and a page with a timeline

**Feature Branch**: `005-now-timeline`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "Change the Home 'Agora' block to the status-sentence version (D) below the hero, widen the
hero to the content width, and rebuild the /now page as the essay with a timeline (T3, refined) chosen on the canvas."

Visual source of truth: the approved **Home** and **Agora** screens in **daaviib — Telas** (desktop in the light theme,
mobile in the dark theme) and the **daaviib — Design System** artifact. This feature replaces the "Agora" panel and the
`/now` page delivered by `specs/002-home-about` (User Story 4, FR-001, FR-003, FR-011).

## User Scenarios & Testing _(mandatory)_

### User Story 1 - See what Davi is doing now from the Home page (Priority: P1)

A visitor on the Home page reads, right below the introduction, one sentence saying what Davi is building, writing,
studying and learning, with the date it was last updated and a link to the full page.

**Why this priority**: the Home page is the entry point; the sentence replaces a side panel that competed with the hero
and squeezed the heading.

**Independent Test**: build the site and open `/`; the hero spans the content width, and the "Agora" block below it is a
sentence, not a list.

**Acceptance Scenarios**:

1. **Given** the Home page on a wide screen, **When** it loads, **Then** the hero text uses the full content width (the same width as "Projetos em destaque" and the other sections) while the intro paragraph keeps a reading width (about 760px).
2. **Given** a published "Now" entry, **When** the Home page loads, **Then** below the hero buttons a block separated by a hairline shows the label "Agora · {date}", the status sentence and a "Página Agora →" link to `/now`; it has no card border and no label/value list.
3. **Given** the status sentence links to a page that is not published (e.g. the draft "Prumo" project), **When** the Home page renders, **Then** that part of the sentence is plain text.
4. **Given** a narrow screen, **When** the Home page loads, **Then** the block follows the hero in the same single column, at the same width as the text.

---

### User Story 2 - Read the full "Now" page (Priority: P1)

A visitor following "Página Agora →" reaches `/now`. They learn what a "now" page is, when it was updated, read the same
status sentence, and then one short section per focus area, each with its own link where one exists.

**Why this priority**: it is the destination of the Home link and the place where each item gets more than a few words.

**Independent Test**: open `/now`; the header, sentence and four sections appear as in the approved screen, with real
content only.

**Acceptance Scenarios**:

1. **Given** `/now`, **When** it loads, **Then** the top shows the heading "Agora", one sentence explaining what a "now" page is (with a link to the "now page" idea), and the line "Atualizado em {date} · ver linha do tempo", where the second part jumps to the timeline.
2. **Given** a published "Now" entry, **When** `/now` loads, **Then** the status sentence appears below the header in a larger size, identical to the Home sentence.
3. **Given** the entry's items, **When** `/now` loads, **Then** each item is a section with an eyebrow label (e.g. "Construindo"), a title (e.g. "Prumo"), a short text and an optional link (e.g. "Ver o projeto →"); on wide screens the labels sit in a left gutter and the text keeps the reading width; on narrow screens the label sits above the title.
4. **Given** an item tied to a post series, **When** `/now` loads, **Then** the section lists the series' published posts in series order, numbered ("01", "02"…), each linking to its post.
5. **Given** an item whose link points to an unpublished page, **When** `/now` renders, **Then** the item's link is not shown at all (the title stays plain text).

---

### User Story 3 - Follow how the focus changed over time (Priority: P2)

A returning visitor scrolls to the "Linha do tempo" section and sees, for each update, its date and what changed:
what was added, what changed and what was removed.

**Why this priority**: it is what makes the page worth revisiting, but the page is useful without it on day one.

**Independent Test**: with one history entry, the timeline shows one dated node marked "atual" with its changes; adding a
second entry with a later date moves the "atual" mark to it on rebuild.

**Acceptance Scenarios**:

1. **Given** the history, **When** `/now` loads, **Then** "Linha do tempo" shows a short description, a legend for the three change kinds ("+ entrou", "~ mudou", "− saiu") and one node per update, newest first, on a vertical line.
2. **Given** the newest history entry, **When** the timeline renders, **Then** its node uses the accent colour and the "atual" badge; older nodes are hollow and muted.
3. **Given** a change, **When** it renders, **Then** it shows its sign in the monospace style and its text; assistive technology announces the change kind as a word ("entrou: Aprendendo Astro"), not the symbol.
4. **Given** an entry with an optional note (e.g. "Primeira versão desta página."), **When** it renders, **Then** the note appears under the date.
5. **Given** the page, **When** it ends, **Then** the last section is the timeline; there is no summary paragraph after it.

### Edge Cases

- No published "Now" entry: the Home block is hidden entirely and `/now` shows only the header without the date line, sentence, sections and timeline (no "nothing here yet" text).
- An item without text shows only label and title; an item without a link shows no link line.
- A series item whose series has no published posts shows no list (drafts are never listed, even as "em breve"; the approved screen shows a draft marked "em breve", which is not shipped).
- History with a single entry: one node, marked "atual"; the vertical line does not extend past it.
- History entry dates out of order in the file: they are shown newest first regardless.
- The newest history entry date differs from the entry's update date: the build fails with a message naming both dates.
- JavaScript disabled: everything works; the page has no client-side behaviour.
- Reduced motion: no change; the page has no animation beyond the existing link-arrow hover.

## Requirements _(mandatory)_

### Functional Requirements

**Home**

- **FR-001**: The Home hero MUST span the full content width on wide screens, with the intro paragraph limited to a reading width (~760px); the heading and the buttons are unchanged.
- **FR-002**: The Home "Agora" block MUST sit below the hero content, separated by a hairline, and show: an eyebrow "Agora · {date}" (date in the monospace meta style, ISO format as today), the status sentence and a "Página Agora →" link to `/now`. It MUST NOT use a card border or a label/value list.

**Now page**

- **FR-003**: `/now` MUST show, in order: header (heading, what-is-this sentence, update line with a jump link to the timeline), status sentence, one section per item, and the "Linha do tempo" section.
- **FR-004**: The what-is-this sentence MUST come from the UI strings (Portuguese and English) and link to an external explanation of "now" pages.
- **FR-005**: Each item section MUST show label, title, optional text and optional link with its own link label; on wide screens labels sit in a left gutter aligned with the header and sentence.
- **FR-006**: An item MAY reference a post series; it then lists that series' published posts in series order, numbered with two digits, each linking to the post.
- **FR-007**: The timeline MUST list history entries newest first, each with date, optional note and changes; the newest is marked "atual" and styled with the accent; the other nodes are hollow.
- **FR-008**: Each change MUST have a kind (added, changed, removed) shown as "+", "~" or "−" in the monospace style, with the kind announced as a word to assistive technology; a legend explains the three signs.

**Content and data**

- **FR-009**: The "Now" entry MUST be typed content validated at build time, per locale, holding: update date, status sentence, ordered items (label, title, optional text, optional link and link label, optional series) and history entries (date, optional note, one or more changes with kind and text).
- **FR-010**: The status sentence MUST support inline links; links to unpublished site pages MUST render as plain text (the same rule the rest of the site uses), and external links MUST be https.
- **FR-011**: The build MUST fail when the newest history date differs from the update date, when a change kind is unknown, or when an item references a series with no posts at all (published or draft).
- **FR-012**: The same status sentence MUST be rendered on the Home page and on `/now` from the single "Now" entry; the two can never disagree.
- **FR-013**: The Portuguese content MUST be the current one: status sentence "Construindo o Prumo, escrevendo a série Construindo este site e aprendendo Astro com ela. Na faculdade, ADS na UniCesumar, com foco em algoritmos e IA aplicada ao desenvolvimento (SDD e RAG).", the four items shown on the approved screen, and one history entry dated 2026-11-23 with the note "Primeira versão desta página." and four "added" changes. The Prumo item has no text until the author provides it.

**Cross-cutting**

- **FR-014**: All interface text (headings, "Linha do tempo", legend words, "atual", "ver linha do tempo", link labels that are not content) MUST come from the UI strings with Portuguese and English keys.
- **FR-015**: Pages MUST use only existing tokens and components; the label/value list stays in use on the About page. A new component is created only where the Home and `/now` share markup (the status block).
- **FR-016**: No new client-side script: the jump link is a plain anchor.

### Key Entities

- **Now entry** (per locale): update date; status sentence (rich text with links); items; history.
- **Now item**: label ("Construindo"), title ("Prumo"), optional text, optional link with link label, optional series name.
- **History entry**: date, optional note, ordered changes.
- **Change**: kind (added, changed, removed) and text.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Lighthouse scores ≥ 95 in Performance, Accessibility, Best Practices and SEO on `/` and `/now`.
- **SC-002**: Zero WCAG 2.1 AA violations reported by axe on `/` and `/now`, in light and dark themes, at desktop and mobile widths.
- **SC-003**: `/now` ships no client-side JavaScript of its own; the Home page's script budget is unchanged.
- **SC-004**: No placeholder text (bracketed placeholders, "TODO", "em breve") is visible on any built page in production.
- **SC-005**: Unit coverage of `src/lib` stays ≥ 90% lines, with the new helpers tested (history ordering and the "atual" entry, change-kind labels, sentence link resolution, series post numbering).
- **SC-006**: Updating the page needs one file edit: changing the "Now" entry (sentence, items and a new history entry) is enough for both the Home block and `/now`.

## Assumptions

- The external link for "now page" points to `https://nownownow.com/about`.
- Dates keep the formats already in use: ISO (`2026-11-23`) on the Home eyebrow, long format ("23 de novembro de 2026") on `/now`, short ("23 nov 2026") in the timeline, all from the locale.
- The status sentence is short (one or two sentences); no length limit beyond a sanity cap is needed.
- The Prumo project stays a draft for now, so "Prumo" renders without links on both pages and its section has no "Ver o projeto" link.
- The "Construindo este site" series currently has one published post; the second post is a draft and is not listed.
- The English "Now" entry is written later, by the author, in English; English UI strings are added now.
- Older history entries are kept in the file forever; there is no pagination until the list becomes long.
