import { describe, expect, it } from 'vitest';

import { countWords, minutesForWords } from '@/lib/reading-time';

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
