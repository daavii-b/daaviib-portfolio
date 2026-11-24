# Feature Specification: Share images (Open Graph) and better page titles

**Feature Branch**: `004-og-images`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "Share images (Open Graph) generated at build time for every page, in the language of the
typographic cover, and better page titles and descriptions. Production: https://www.daaviib.site. Today no page has
og:image and the Home title is only 'Portfolio & Blog'."

Visual source of truth: the typographic cover (`PostCover`, `specs/001-design-system`) in the light theme. Pages and
copy come from `specs/002-home-about` and `specs/003-article`.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - A shared link shows a recognisable preview (Priority: P1)

Someone pastes a link to an article (or any page) on LinkedIn, X, WhatsApp or Slack. The preview shows a large image in
the site's visual language with the article title, its topic and the author, so the link looks deliberate and is
recognisably Davi Brito's.

**Why this priority**: sharing articles on LinkedIn is the main distribution channel; today previews have no image.

**Independent Test**: build the site, open any page's HTML, follow its share-image URL: it returns a 1200×630 PNG under
300 KB showing that page's title, label and the author line.

**Acceptance Scenarios**:

1. **Given** a published article, **When** its page is parsed, **Then** it declares a share image (absolute URL) whose picture shows the article title, the article's first tag as the label, and "Davi Brito · Fullstack Engineer" and "daaviib.site" at the bottom.
2. **Given** a published project, **When** its page is parsed, **Then** its share image shows the project name with the label "Projeto".
3. **Given** the Home page, **Then** its share image shows "Construo software de ponta a ponta e escrevo sobre o caminho." with the label "Davi Brito".
4. **Given** the Blog, Projects, About and Now pages, **Then** each share image shows that page's main heading with the section name as the label.
5. **Given** the not-found page, **Then** it declares the Home share image.
6. **Given** any page, **Then** it declares the image's width (1200), height (630) and a text alternative equal to the title shown in the image, and the same image for X/Twitter cards.
7. **Given** an article, **Then** its structured data (`BlogPosting`) also references the share image.

---

### User Story 2 - Long titles still fit (Priority: P1)

An article with a long title still produces a clean image: the title is set smaller instead of overflowing or being
cut mid-word.

**Why this priority**: the first real titles are already long; a broken image is worse than none.

**Independent Test**: render images for titles of increasing length: short ones use the largest size on one or two
lines, long ones step down in size, and no title uses more than three lines or splits a word.

**Acceptance Scenarios**:

1. **Given** a title that fits on up to three lines at the largest size, **Then** it is set at the largest size.
2. **Given** a longer title, **Then** the size steps down until the title fits on three lines.
3. **Given** a title that does not fit on three lines even at the smallest size, **Then** it is shortened at a word boundary and ends with "…"; no word is ever split.

---

### User Story 3 - Clear titles and descriptions in search results and tabs (Priority: P2)

A visitor or a search engine sees who the site belongs to in every title, and a description specific to each page.

**Why this priority**: the Home title "Portfolio & Blog" says nothing about the author; generic descriptions repeat
across pages.

**Independent Test**: open each page and read `<title>` and the meta description.

**Acceptance Scenarios**:

1. **Given** the Home page, **Then** the title is "Davi Brito · Fullstack Engineer".
2. **Given** any other page, **Then** the title is "{page title} · Davi Brito" (e.g. "Blog · Davi Brito", "Por que escolhi Astro para este site · Davi Brito").
3. **Given** any page, **Then** its meta description is specific to it (no two static pages share one) and is at most 160 characters; the Home description summarises the Home introduction.

### Edge Cases

- A post without tags: the label falls back to "Blog" (same fallback as the article cover).
- A draft or future post or project: no page, so no image is generated for it.
- Accented Portuguese characters (ã, ç, é…) and the middle dot render with the site fonts, not a fallback font.
- A word longer than a whole line (e.g. a long identifier) is placed on its own line and the size steps down; it is never broken.
- Not-found and any page without its own image fall back to the Home image, never to a missing file.
- The English locale (planned) gets its own images under its own path prefix with English labels, without changing the mapping.

## Requirements _(mandatory)_

### Functional Requirements

**Images**

- **FR-001**: Every built page except the not-found page MUST have its own share image, generated at build time as a static PNG file; no browser JavaScript and no external service.
- **FR-002**: Each image MUST be 1200×630, light theme, and follow the typographic cover: surface background with a dot grid (border colour, 16px step) and a 1px border; the uppercase label top-left in the muted text colour; a 12px cobalt square top-right; the title in the display font, bold, centre-left; "Davi Brito · Fullstack Engineer" bottom-left and "daaviib.site" bottom-right in the body font, medium weight, muted colour. No gradient, emoji or photo.
- **FR-003**: Image content per page: post → post title, label = first tag (fallback "Blog"); project → project name, label "Projeto"; Home → the Home headline, label "Davi Brito"; Blog, Projects, About, Now → the page's H1, label = the section name.
- **FR-004**: The title MUST use at most three lines, stepping the font size down for longer titles, never splitting a word; titles that cannot fit at the smallest size are shortened at a word boundary with "…".
- **FR-005**: Each image MUST be smaller than 300 KB.
- **FR-006**: Image URLs MUST be derivable from the page path in a stable way, so a page and its image can never disagree.

**Metadata**

- **FR-007**: Every page MUST declare `og:image` (absolute URL), `og:image:width`, `og:image:height`, `og:image:alt` (= the title shown in the image) and `twitter:image`; the not-found page uses the Home image.
- **FR-008**: The article's `BlogPosting` structured data MUST include the image URL.
- **FR-009**: The site title MUST be "Davi Brito · Fullstack Engineer"; page titles MUST follow "{page title} · Davi Brito"; the Home title is the site title alone.
- **FR-010**: Every page MUST have a meta description of at most 160 characters, specific to the page; the Home description summarises the Home introduction; post and project descriptions come from their content and MUST be validated to at most 160 characters.

**Cross-cutting**

- **FR-011**: Interface text in images (labels, author line) MUST come from the UI strings or site settings (pt and en); colours MUST come from the design tokens (light theme).
- **FR-012**: The Lighthouse (≥ 95 in all four categories) and accessibility gates continue to pass.

### Key Entities

- **Share image**: page path → image path, title, label; rendered once per built page.
- **Page metadata**: title (with author suffix), description, share image (URL, size, alternative text).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of built pages (except not-found) have their own share image; 100% of pages declare an image that loads (HTTP 200, PNG, 1200×630).
- **SC-002**: Every share image is under 300 KB.
- **SC-003**: Titles of up to 100 characters (the post title limit) render on at most three lines without splitting words.
- **SC-004**: Every page title matches the agreed pattern and every meta description is ≤ 160 characters.
- **SC-005**: Lighthouse stays ≥ 95 in Performance, Accessibility, Best Practices and SEO; no new browser JavaScript.
- **SC-006**: After merge, the LinkedIn Post Inspector shows the image, title and description for `https://www.daaviib.site/blog/por-que-escolhi-astro`.

## Assumptions

- Images are light theme only (social previews have no theme preference).
- The image shows "daaviib.site" (without `www`) as a brand mark; the URLs in metadata use the configured site URL.
- Only the latin character set is needed for Portuguese and English content.
- `og:image:alt` uses the title shown in the image (for the Home, the headline), since it describes the image.
- The not-found page keeps its title pattern ("Página não encontrada · Davi Brito").
- Tightening the post `description` and project `summary` limits from 200 to 160 characters affects no current content
  (the only post and project are below 160).
- The LinkedIn Post Inspector check happens after merge and deploy; it is listed in the PR, not automated.
