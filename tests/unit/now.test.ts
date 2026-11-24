import { describe, expect, it } from 'vitest';

import {
  CHANGE_KINDS,
  CHANGE_SIGNS,
  historyDateMismatch,
  parseStatus,
  resolveStatus,
  statusIssues,
  timeline,
} from '@/lib/now';

const day = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe('parseStatus', () => {
  it('splits text and inline links into segments', () => {
    expect(parseStatus('Construindo o [Prumo](/projects/prumo), escrevendo.')).toEqual([
      { text: 'Construindo o ' },
      { text: 'Prumo', href: '/projects/prumo' },
      { text: ', escrevendo.' },
    ]);
  });

  it('handles a sentence with no links and links at the edges', () => {
    expect(parseStatus('Só texto.')).toEqual([{ text: 'Só texto.' }]);
    expect(parseStatus('[A](https://a.dev) e [B](/b)')).toEqual([
      { text: 'A', href: 'https://a.dev' },
      { text: ' e ' },
      { text: 'B', href: '/b' },
    ]);
  });
});

describe('statusIssues', () => {
  it('accepts site paths and https links', () => {
    expect(statusIssues('O [Prumo](/projects/prumo) e [x](https://x.dev).')).toEqual([]);
  });

  it('rejects links that are not a site path or https', () => {
    expect(statusIssues('O [Prumo](projects/prumo).')).toEqual([
      'link "[Prumo](projects/prumo)" must point to a site path or an https URL',
    ]);
    expect(statusIssues('[x](http://x.dev)')).toHaveLength(1);
  });

  it('rejects stray brackets', () => {
    expect(statusIssues('O [Prumo sem link.')).toEqual(['unbalanced "[" or "]" outside a link']);
    expect(statusIssues('O Prumo] solto.')).toEqual(['unbalanced "[" or "]" outside a link']);
    expect(statusIssues('O [Prumo]() vazio.')).toEqual(['unbalanced "[" or "]" outside a link']);
  });
});

describe('resolveStatus', () => {
  it('keeps published and https links and turns the rest into text', () => {
    const published = new Set(['/projects/este-site']);
    const segments = parseStatus('[Prumo](/projects/prumo), [site](/projects/este-site), [x](https://x.dev)');
    expect(resolveStatus(segments, published)).toEqual([
      { text: 'Prumo', href: undefined },
      { text: ', ' },
      { text: 'site', href: '/projects/este-site' },
      { text: ', ' },
      { text: 'x', href: 'https://x.dev' },
    ]);
  });
});

describe('historyDateMismatch', () => {
  const history = [{ date: day('2026-11-01') }, { date: day('2026-11-23') }, { date: day('2026-10-05') }];

  it('accepts updatedAt equal to the newest date in any order', () => {
    expect(historyDateMismatch(day('2026-11-23'), history)).toBeUndefined();
  });

  it('names both dates when they differ', () => {
    expect(historyDateMismatch(day('2026-11-24'), history)).toBe(
      'updatedAt is 2026-11-24 but the newest history entry is 2026-11-23; they must be equal',
    );
  });

  it('reports an empty history', () => {
    expect(historyDateMismatch(day('2026-11-24'), [])).toBe('history needs at least one entry');
  });
});

describe('timeline', () => {
  it('orders newest first and marks only the newest as current', () => {
    const entries = [
      { date: day('2026-10-01'), id: 'a' },
      { date: day('2026-11-23'), id: 'b' },
      { date: day('2026-11-01'), id: 'c' },
    ];
    const result = timeline(entries);
    expect(result.map((e) => [e.id, e.current])).toEqual([
      ['b', true],
      ['c', false],
      ['a', false],
    ]);
    expect(entries[0]?.id).toBe('a');
  });

  it('marks a single entry as current', () => {
    expect(timeline([{ date: day('2026-11-23') }])).toEqual([{ date: day('2026-11-23'), current: true }]);
  });
});

describe('change kinds', () => {
  it('have one monospace sign each', () => {
    expect(CHANGE_KINDS).toEqual(['added', 'changed', 'removed']);
    expect(CHANGE_SIGNS).toEqual({ added: '+', changed: '~', removed: '−' });
  });
});
