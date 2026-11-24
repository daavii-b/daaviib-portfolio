import { describe, expect, it } from 'vitest';

import { buildToc } from '@/lib/toc';

describe('buildToc', () => {
  it('keeps level-2 headings in document order', () => {
    const headings = [
      { depth: 2, slug: 'o-que-eu-precisava', text: 'O que eu precisava' },
      { depth: 3, slug: 'detalhe', text: 'Detalhe' },
      { depth: 2, slug: 'estático-primeiro', text: 'Estático primeiro' },
      { depth: 1, slug: 'titulo', text: 'Título' },
      { depth: 2, slug: 'depois', text: 'O que ficou para depois' },
    ];
    expect(buildToc(headings)).toEqual([
      { id: 'o-que-eu-precisava', text: 'O que eu precisava' },
      { id: 'estático-primeiro', text: 'Estático primeiro' },
      { id: 'depois', text: 'O que ficou para depois' },
    ]);
  });

  it('is empty without level-2 headings', () => {
    expect(buildToc([])).toEqual([]);
    expect(buildToc([{ depth: 3, slug: 'a', text: 'A' }])).toEqual([]);
  });
});
