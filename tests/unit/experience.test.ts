import { describe, expect, it } from 'vitest';

import { formatPeriod, localized, sortExperiences } from '@/lib/experience';

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe('sortExperiences', () => {
  const entry = (id: string, start: string, end?: string) => ({
    id,
    data: { start: utc(start), ...(end ? { end: utc(end) } : {}) },
  });

  it('puts the newest start first', () => {
    const sorted = sortExperiences([
      entry('study', '2020-01-01', '2023-01-01'),
      entry('engineer', '2023-08-01'),
      entry('python', '2023-05-01', '2023-08-01'),
    ]);
    expect(sorted.map((e) => e.id)).toEqual(['engineer', 'python', 'study']);
  });

  it('puts the current role first when two start together, and does not mutate the input', () => {
    const input = [entry('ended', '2023-08-01', '2024-01-01'), entry('current', '2023-08-01')];
    expect(sortExperiences(input).map((e) => e.id)).toEqual(['current', 'ended']);
    expect(input.map((e) => e.id)).toEqual(['ended', 'current']);
  });

  it('keeps the order of entries that are fully tied', () => {
    const input = [entry('a', '2023-08-01', '2024-01-01'), entry('b', '2023-08-01', '2024-01-01')];
    expect(sortExperiences(input).map((e) => e.id)).toEqual(['a', 'b']);
  });
});

describe('formatPeriod', () => {
  it('formats a current role with abbreviated months, without the trailing dot', () => {
    expect(formatPeriod(utc('2023-08-01'), undefined, 'pt', 'month')).toBe('ago 2023 — atual');
    expect(formatPeriod(utc('2023-08-01'), undefined, 'en', 'month')).toBe('Aug 2023 — present');
  });

  it('formats a closed range', () => {
    expect(formatPeriod(utc('2023-05-01'), utc('2023-08-01'), 'pt', 'month')).toBe('mai 2023 — ago 2023');
    expect(formatPeriod(utc('2023-05-01'), utc('2023-08-01'), 'en', 'month')).toBe('May 2023 — Aug 2023');
  });

  it('formats years only for study periods', () => {
    expect(formatPeriod(utc('2020-01-01'), utc('2023-01-01'), 'pt', 'year')).toBe('2020 — 2023');
    expect(formatPeriod(utc('2020-01-01'), undefined, 'pt', 'year')).toBe('2020 — atual');
  });

  it('does not shift the month across time zones', () => {
    expect(formatPeriod(utc('2023-01-01'), utc('2023-12-01'), 'pt', 'month')).toBe('jan 2023 — dez 2023');
  });
});

describe('localized', () => {
  it('returns the text for the locale and falls back to Portuguese', () => {
    expect(localized({ pt: 'Olá', en: 'Hello' }, 'en')).toBe('Hello');
    expect(localized({ pt: 'Olá', en: 'Hello' }, 'pt')).toBe('Olá');
    expect(localized({ pt: 'Olá' }, 'en')).toBe('Olá');
  });
});
