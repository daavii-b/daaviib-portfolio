import { describe, expect, it } from 'vitest';

import { countWords, minutesForWords, readingTimePlugin } from '@/lib/reading-time';

describe('countWords', () => {
  it('splits on any whitespace and ignores empty parts', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('  um\tdois\n\ntrês ')).toBe(3);
  });
});

describe('minutesForWords', () => {
  it('is at least one minute', () => {
    expect(minutesForWords(0)).toBe(1);
  });

  it('rounds up at ~200 words per minute', () => {
    expect(minutesForWords(200)).toBe(1);
    expect(minutesForWords(201)).toBe(2);
    expect(minutesForWords(450)).toBe(3);
  });
});

describe('readingTimePlugin', () => {
  type Hook = (...args: unknown[]) => unknown;

  /** Feeds text nodes to a fresh plugin instance and returns the context it wrote to. */
  function run(texts: string[], data: Record<string, unknown>) {
    const plugin = readingTimePlugin();
    const context = { data };
    for (const value of texts) (plugin.text as Hook)({ type: 'text', value }, context);
    (plugin.after as Hook)({ type: 'root', children: [] }, context);
    return context.data;
  }

  it('sets minutesRead in the Astro frontmatter from the text nodes', () => {
    const prose = Array.from({ length: 450 }, () => 'palavra').join(' ');
    const data = run([prose], { astro: { frontmatter: { title: 'x' } } });
    expect(data['astro']).toEqual({ frontmatter: { title: 'x', minutesRead: 3 } });
  });

  it('keeps a separate word count per document', () => {
    run([Array.from({ length: 1000 }, () => 'x').join(' ')], { astro: { frontmatter: {} } });
    const data = run(['curto'], { astro: { frontmatter: {} } });
    expect(data['astro']).toEqual({ frontmatter: { minutesRead: 1 } });
  });

  it('does nothing outside an Astro compile', () => {
    expect(run(['texto'], {})).toEqual({});
  });
});
