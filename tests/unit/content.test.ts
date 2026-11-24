import { describe, expect, it } from 'vitest';

import { byPublishedDesc, findTranslation, isPublished } from '@/lib/content';

describe('isPublished', () => {
  const now = new Date('2026-11-23T12:00:00Z');
  const entry = (overrides: Partial<{ lang: 'pt' | 'en'; draft: boolean; publishedAt: Date }> = {}) => ({
    data: { lang: 'pt' as const, draft: false, publishedAt: new Date('2026-11-01'), ...overrides },
  });

  it('accepts a published entry in the same locale', () => {
    expect(isPublished(entry(), 'pt', now)).toBe(true);
  });

  it('rejects other locales', () => {
    expect(isPublished(entry({ lang: 'en' }), 'pt', now)).toBe(false);
  });

  it('hides drafts and scheduled posts unless showDrafts', () => {
    expect(isPublished(entry({ draft: true }), 'pt', now)).toBe(false);
    expect(isPublished(entry({ publishedAt: new Date('2027-01-01') }), 'pt', now)).toBe(false);
    expect(isPublished(entry({ draft: true }), 'pt', now, true)).toBe(true);
    expect(isPublished(entry({ publishedAt: new Date('2027-01-01') }), 'pt', now, true)).toBe(true);
  });
});

describe('byPublishedDesc', () => {
  it('sorts newest first', () => {
    const a = { data: { publishedAt: new Date('2026-01-01') } };
    const b = { data: { publishedAt: new Date('2026-06-01') } };
    expect([a, b].sort(byPublishedDesc)).toEqual([b, a]);
  });
});

describe('findTranslation', () => {
  it('finds the entry with the same translationKey in the other locale', () => {
    const pt = { data: { lang: 'pt' as const, translationKey: 'prumo' } };
    const en = { data: { lang: 'en' as const, translationKey: 'prumo' } };
    const other = { data: { lang: 'en' as const, translationKey: 'other' } };
    expect(findTranslation([pt, en, other], pt, 'en')).toBe(en);
    expect(findTranslation([pt, other], pt, 'en')).toBeUndefined();
  });
});
