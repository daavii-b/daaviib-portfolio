import type { MdastPluginDefinition } from 'satteri';

const WORDS_PER_MINUTE = 200;

/** Number of whitespace-separated words in a piece of text. */
export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Reading time in whole minutes (minimum 1). */
export function minutesForWords(words: number): number {
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/**
 * Sätteri mdast plugin that adds `minutesRead` to each Markdown/MDX file's frontmatter,
 * read back through `remarkPluginFrontmatter` from `render()`.
 * Only prose `text` nodes count: code blocks, inline code, HTML and MDX expressions are skipped.
 * It is a factory so the word count is local to each compiled document.
 */
export const readingTimePlugin = (): MdastPluginDefinition => {
  let words = 0;
  return {
    name: 'reading-time',
    text(node) {
      words += countWords(node.value);
    },
    after(_root, context) {
      const astro = context.data['astro'] as { frontmatter: Record<string, unknown> } | undefined;
      if (astro) astro.frontmatter['minutesRead'] = minutesForWords(words);
    },
  };
};
