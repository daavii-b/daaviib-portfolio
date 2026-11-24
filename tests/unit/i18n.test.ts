import { describe, expect, it } from 'vitest';

import { LOCALES } from '@/i18n/config';
import { ui } from '@/i18n/ui';
import { formatDate, localizePath, t, toLocale } from '@/i18n/utils';

describe('t', () => {
  it('returns the string for the locale', () => {
    expect(t('pt', 'nav.blog')).toBe('Blog');
    expect(t('en', 'nav.about')).toBe('About');
  });

  it('interpolates params and keeps unknown placeholders', () => {
    expect(t('pt', 'blog.readingTime', { minutes: 4 })).toBe('4 min de leitura');
    expect(t('en', 'blog.readingTime')).toBe('{minutes} min read');
  });
});

describe('ui dictionaries', () => {
  it('have the same keys in every locale', () => {
    const reference = Object.keys(ui.pt).sort();
    for (const lang of LOCALES) {
      expect(Object.keys(ui[lang]).sort()).toEqual(reference);
    }
  });
});

describe('meta descriptions', () => {
  it('are at most 160 characters in every locale', () => {
    for (const lang of LOCALES) {
      for (const [key, value] of Object.entries(ui[lang])) {
        if (/[dD]escription$/.test(key)) expect(value.length, `${lang} ${key}`).toBeLessThanOrEqual(160);
      }
    }
  });
});

describe('toLocale', () => {
  it.each([
    ['pt', 'pt'],
    ['en', 'en'],
    [undefined, 'pt'],
    ['fr', 'pt'],
  ] as const)('%s → %s', (value, expected) => {
    expect(toLocale(value)).toBe(expected);
  });
});

describe('localizePath', () => {
  it.each([
    ['/', 'pt', '/'],
    ['/', 'en', '/en'],
    ['/blog/x', 'pt', '/blog/x'],
    ['blog/x/', 'en', '/en/blog/x'],
    ['/rss.xml', 'pt', '/rss.xml'],
  ] as const)('%s (%s) → %s', (path, lang, expected) => {
    expect(localizePath(path, lang)).toBe(expected);
  });
});

describe('formatDate', () => {
  it('formats in UTC for each locale', () => {
    const date = new Date('2026-11-23T00:00:00Z');
    expect(formatDate(date, 'pt')).toBe('23 de novembro de 2026');
    expect(formatDate(date, 'en')).toBe('November 23, 2026');
  });
});
