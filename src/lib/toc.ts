/** A heading as returned by `render()` for Markdown/MDX content. */
export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

export interface TocEntry {
  id: string;
  text: string;
}

/** "Neste artigo" entries: the article's level-2 headings, in document order. */
export function buildToc(headings: readonly Heading[]): TocEntry[] {
  return headings.filter((heading) => heading.depth === 2).map(({ slug, text }) => ({ id: slug, text }));
}
