# Feature Specification: Complete article page and first post

**Feature Branch**: `003-article`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "Implement the complete article page (/blog/[slug]) as approved — reading column with a sticky side column, table of contents, series, sharing, code blocks with file name and copy, notes, reading progress, related posts, structured data — and publish the first post, replacing the sample draft."

Visual source of truth: the approved **Artigo** screen in **daaviib — Telas** (desktop in the light theme, mobile in the
dark theme). Tokens and components come from `specs/001-design-system`; patterns such as section headers come from
`specs/002-home-about`.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Read an article comfortably (Priority: P1)

A reader opens an article from the blog, the Home page or a shared link. They see where it sits (back link, series,
date, reading time), read it in a comfortable column with clear headings, code blocks they can copy, and highlighted
notes, and they always know how far along they are.

**Why this priority**: reading is the whole point of the page; everything else supports it.

**Independent Test**: build the site, open the first post: header, cover, body with headings, a titled code block
whose copy button works, a note, tags and the contact call to action are present and readable in both themes.

**Acceptance Scenarios**:

1. **Given** a published article, **When** it loads, **Then** the top shows "← Todos os artigos" (to `/blog`), a meta line with the date and reading time (and the series tag when the article belongs to a series), the title as the only H1, and the description as a lead paragraph.
2. **Given** the article has a keyword, **When** it loads, **Then** a wide typographic cover shows that keyword.
3. **Given** the body has level-2 headings, **When** it renders, **Then** each heading has an anchor id and, when navigated to, is not hidden under the top of the viewport.
4. **Given** a code block written with a file name, **When** it renders, **Then** it shows the file name above the code and a "Copiar" button; **When** the reader activates it, **Then** the code (without the file name) is copied and the button confirms with "Copiado".
5. **Given** a note in the body, **When** it renders, **Then** it is visually distinct (border, surface background, info icon in the accent colour) and readable by assistive technology as a note.
6. **Given** the browser supports scroll-driven animations and the reader has not asked for reduced motion, **When** they scroll, **Then** a 2px accent bar at the top of the viewport grows with their reading progress; otherwise no bar is shown.
7. **Given** the article ends, **When** the reader reaches it, **Then** they see its tags and the contact call to action, which opens the contact panel with a message citing the article title.

---

### User Story 2 - Navigate inside the article (Priority: P1)

A reader skimming a long article wants to see its sections and jump between them; on a wide screen the list stays in
view and shows where they are; on a phone it stays out of the way until asked for.

**Why this priority**: articles here are technical and long; navigation is what makes them skimmable.

**Independent Test**: on a wide screen the side column lists the four sections of the first post and highlights the
current one while scrolling; on a phone a collapsed "Neste artigo" control above the body expands to the same list.

**Acceptance Scenarios**:

1. **Given** a wide screen (≥ 1180px), **When** the article loads, **Then** a side column next to the reading column shows "Neste artigo" with one link per level-2 heading, and stays in view while scrolling.
2. **Given** the reader scrolls, **When** a section reaches the top of the reading area, **Then** its entry in "Neste artigo" is highlighted as current (and exposed as current to assistive technology).
3. **Given** a narrow screen, **When** the article loads, **Then** "Neste artigo" appears as a collapsed disclosure above the body; expanding it shows the same links.
4. **Given** an article with no level-2 headings, **When** it loads, **Then** no "Neste artigo" block is shown anywhere.
5. **Given** JavaScript is unavailable, **When** the reader uses "Neste artigo", **Then** the links still jump to the sections (only the current-section highlight is missing).

---

### User Story 3 - Continue with the series and related posts (Priority: P2)

A reader who liked the article wants the next one: the other parts of the same series, or other articles on the same
topic.

**Why this priority**: keeps readers on the site, but only matters once there is more than one post.

**Independent Test**: with two or more published posts in a series, the series list appears with the current post
highlighted; with one, it is absent. Related posts appear only when other published posts exist.

**Acceptance Scenarios**:

1. **Given** an article in a series, **When** it loads, **Then** the meta line shows "Série · {name} · {n} de {total}", counting published posts of the series in publication order.
2. **Given** two or more published posts in the series, **When** the article loads, **Then** "Série · {name}" lists them numbered (01, 02, …) in order, the current one highlighted and not linked; on a wide screen in the side column, on a narrow screen near the end of the article.
3. **Given** only one published post in the series, **When** the article loads, **Then** the series list is not shown.
4. **Given** other published posts exist, **When** the article loads, **Then** "Continue lendo" shows up to three, those sharing a tag first (most shared tags, then newest), then the newest others, with a link to all articles.
5. **Given** no other published posts, **When** the article loads, **Then** "Continue lendo" is not shown.

---

### User Story 4 - Share an article (Priority: P2)

A reader wants to share the article: copy its link or post it to LinkedIn or X, without third-party scripts tracking
them.

**Why this priority**: distribution for the author; low effort for the reader.

**Independent Test**: "Copiar link" copies the canonical URL with confirmation; LinkedIn and X open their share pages
with the article URL (and title for X).

**Acceptance Scenarios**:

1. **Given** the share block, **When** the reader activates "Copiar link", **Then** the article's canonical URL is copied and the control confirms.
2. **Given** the share block, **When** the reader activates "LinkedIn" or "X", **Then** a new tab opens that service's share page carrying the article URL; no script from those services is loaded by the site.
3. **Given** a wide screen, **Then** the share block sits in the side column; on a narrow screen it sits near the end of the article.

---

### User Story 5 - Search engines understand the article (Priority: P3)

Search engines and social previews should identify the page as a blog post by Davi Brito with its dates.

**Independent Test**: the page contains one valid JSON-LD `BlogPosting` block with headline, publication and
modification dates, author and URL.

**Acceptance Scenarios**:

1. **Given** an article, **When** its HTML is parsed, **Then** it contains a JSON-LD `BlogPosting` with `headline` = title, `datePublished`, `dateModified` (the update date, or the publication date when there is none), `author` = Davi Brito and `url` = the canonical URL.

---

### User Story 6 - The first real post is published (Priority: P1)

The sample draft is replaced by the first real article, "Por que escolhi Astro para este site", in the series
"Construindo este site".

**Independent Test**: the production build lists the post on `/blog` and the Home page and serves it at
`/blog/por-que-escolhi-astro`; the sample draft no longer exists.

**Acceptance Scenarios**:

1. **Given** the production build, **When** `/blog/por-que-escolhi-astro` is opened, **Then** it shows the provided text unchanged, except that the code sample is a faithful, shortened excerpt of the real posts schema.
2. **Given** the production build, **When** `/blog/ola-mundo` is opened, **Then** it returns the 404 page.

### Edge Cases

- Article without series: no series tag, no series list.
- Article without keyword: the cover uses the first tag (current behaviour).
- Code block without a file name: no header row; the copy button is still available on the block.
- Clipboard unavailable: the copy controls select the text instead and still confirm.
- Tags: there are no tag pages yet, so tags render as labels without links (on the article and on post cards) instead of linking to a 404.
- Very long headings in "Neste artigo" wrap instead of overflowing the side column.
- Reduced motion: no progress bar, no smooth scrolling, no hover movement.
- The side column must never cover the reading column at any width between 1180px and the widest layout.

## Requirements _(mandatory)_

### Functional Requirements

**Layout**

- **FR-001**: On screens ≥ 1180px the article MUST use a 680px reading column and a 280px side column that stays in view (32px from the top) while scrolling; below that width, a single column.
- **FR-002**: The top MUST show the back link, the meta line (series tag when applicable, date and reading time in monospace), the title (H1) and the description as a lead, followed by the wide cover.

**Body**

- **FR-003**: Level-2 headings MUST carry ids and a scroll margin so anchored navigation does not hide them.
- **FR-004**: Code blocks MAY declare a file name (` ```ts title="src/x.ts" `); a declared file name MUST appear above the code. Every code block MUST offer a copy action that copies only the code and confirms with "Copiado".
- **FR-005**: Authors MUST be able to insert a note in MDX (`<Note>…</Note>`) rendered with a border, surface background and an accent info icon (no thick side border), announced as a note.

**Navigation and series**

- **FR-006**: "Neste artigo" MUST be generated from the article's level-2 headings at build time; hidden when there are none.
- **FR-007**: The current section MUST be highlighted while scrolling on wide screens; links MUST work without JavaScript.
- **FR-008**: On narrow screens "Neste artigo" MUST be a collapsed disclosure above the body; series and share move to the end of the article.
- **FR-009**: Series position ("n de total") and the series list MUST count only published posts of the same series and locale, ordered by publication date; the list MUST show only with two or more posts.

**Sharing, progress, related, SEO**

- **FR-010**: Share MUST offer copy link, LinkedIn and X using plain links to the services' share URLs; no third-party script.
- **FR-011**: A 2px accent reading-progress bar MUST be implemented with CSS scroll-driven animations only, shown only when supported and when reduced motion is not requested.
- **FR-012**: "Continue lendo" MUST show up to 3 other published posts in the same locale: shared tags first (more shared tags first, then newest), then the newest; hidden when none.
- **FR-013**: The page MUST include a JSON-LD `BlogPosting` with headline, datePublished, dateModified, author and url.

**Content**

- **FR-014**: The sample post `ola-mundo` MUST be removed and the post `por-que-escolhi-astro` added with the provided frontmatter and body; only the code excerpt is adjusted to match the real schema.

**Cross-cutting**

- **FR-015**: Interface text MUST come from the UI strings (pt and en); only design tokens and existing components, new ones only for new patterns.
- **FR-016**: Client-side JavaScript is limited to: copying (code, link), and highlighting the current section. No framework, no third-party scripts.

### Key Entities

- **Post** (existing): title, description, dates, tags, optional series and keyword, body with headings.
- **Table of contents**: ordered list of the post's level-2 headings (text + anchor), derived at build time.
- **Series position**: the post's series name, its 1-based index and the total among published posts of that series.
- **Related posts**: up to three other published posts, ranked by shared tags then recency.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Lighthouse ≥ 95 in Performance, Accessibility, Best Practices and SEO on the first post's page.
- **SC-002**: Zero WCAG 2.1 AA violations (axe) on the article page in light and dark themes, desktop and mobile.
- **SC-003**: The article page ships at most 2 KB of new JavaScript (gzipped) beyond what the site already loads.
- **SC-004**: The JSON-LD block parses as valid JSON and contains every required field.
- **SC-005**: Unit coverage of `src/lib` stays ≥ 90% lines, with table-of-contents, series-position and related-posts logic tested.

## Assumptions

- The series tag in the meta line shows whenever the post belongs to a series, even with one published post ("1 de 1"); only the series list needs two or more.
- The first post's publication date is 2026-11-24 as provided; it is in the past relative to the build, so it is published.
- Tag pages do not exist yet; tags render without links until they do (also fixes post cards linking to missing pages).
- The share text for X is the article title; LinkedIn receives only the URL (its share endpoint ignores other fields).
- Canonical URLs (and so the shared URL and JSON-LD `url`) drop the `.html` suffix the build used to leak into them on
  every page (`/about.html` → `/about`); found while implementing sharing.
- Syntax colours follow the design tokens (keywords accent-2, functions accent, strings success) as in the approved
  screen; this also fixes a contrast failure of the previous GitHub themes on the surface background. Operators such as
  `=` take the keyword colour.
- The approved screen's "Todos os artigos →" link next to "Continue lendo" is kept (link to `/blog`).
