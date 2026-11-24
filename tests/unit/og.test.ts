import { describe, expect, it } from 'vitest';

import { t } from '@/i18n/utils';
import {
  buildOgPages,
  findOgPage,
  fitTitle,
  ogImagePath,
  ogRouteParam,
  pageTitle,
  type OgSources,
} from '@/lib/og';

describe('ogImagePath', () => {
  it.each([
    ['/', '/og/index.png'],
    ['/blog', '/og/blog.png'],
    ['/blog/', '/og/blog.png'],
    ['/blog/por-que-escolhi-astro', '/og/blog/por-que-escolhi-astro.png'],
    ['/projects/este-site', '/og/projects/este-site.png'],
    ['/en', '/og/en.png'],
    ['/en/blog/why-astro', '/og/en/blog/why-astro.png'],
  ])('%s → %s', (page, image) => {
    expect(ogImagePath(page)).toBe(image);
  });
});

describe('ogRouteParam', () => {
  it.each([
    ['/og/index.png', 'index'],
    ['/og/blog/por-que-escolhi-astro.png', 'blog/por-que-escolhi-astro'],
  ])('%s → %s', (image, param) => {
    expect(ogRouteParam(image)).toBe(param);
  });
});

const sources = (overrides: Partial<OgSources> = {}): OgSources => ({
  author: 'Davi Brito',
  text: (key) => t('pt', key),
  localize: (path) => path,
  posts: [
    {
      slug: 'por-que-escolhi-astro',
      title: 'Por que escolhi Astro para este site',
      tags: ['astro', 'arquitetura'],
    },
    { slug: 'sem-tags', title: 'Sem tags', tags: [] },
  ],
  projects: [{ slug: 'este-site', name: 'Este site' }],
  ...overrides,
});

describe('buildOgPages', () => {
  const pages = buildOgPages(sources());
  const byPath = Object.fromEntries(pages.map((page) => [page.pagePath, page]));

  it('lists the Home first, with the headline and the author as label', () => {
    expect(pages[0]).toEqual({
      pagePath: '/',
      imagePath: '/og/index.png',
      title: 'Construo software de ponta a ponta e escrevo sobre o caminho.',
      label: 'Davi Brito',
    });
  });

  it('uses the H1 and the section name for static pages', () => {
    expect(byPath['/blog']).toMatchObject({ title: 'Blog', label: 'Blog', imagePath: '/og/blog.png' });
    expect(byPath['/projects']).toMatchObject({ title: 'Projetos', label: 'Projetos' });
    expect(byPath['/about']).toMatchObject({ title: 'Oi, eu sou o Davi.', label: 'Sobre' });
    expect(byPath['/now']).toMatchObject({ title: 'Agora', label: 'Agora' });
  });

  it('uses the post title and first tag, falling back to "Blog"', () => {
    expect(byPath['/blog/por-que-escolhi-astro']).toEqual({
      pagePath: '/blog/por-que-escolhi-astro',
      imagePath: '/og/blog/por-que-escolhi-astro.png',
      title: 'Por que escolhi Astro para este site',
      label: 'astro',
    });
    expect(byPath['/blog/sem-tags']?.label).toBe('Blog');
  });

  it('uses the project name with the label "Projeto"', () => {
    expect(byPath['/projects/este-site']).toMatchObject({ title: 'Este site', label: 'Projeto' });
  });

  it('follows the locale prefix and strings', () => {
    const en = buildOgPages(
      sources({ text: (key) => t('en', key), localize: (path) => (path === '/' ? '/en' : `/en${path}`) }),
    );
    expect(en[0]).toMatchObject({ pagePath: '/en', imagePath: '/og/en.png', label: 'Davi Brito' });
    expect(en.find((page) => page.pagePath === '/en/projects/este-site')?.label).toBe('Project');
  });

  it('builds one image per page with unique paths', () => {
    expect(new Set(pages.map((page) => page.imagePath)).size).toBe(pages.length);
    expect(pages).toHaveLength(5 + 2 + 1);
  });
});

describe('findOgPage', () => {
  const pages = buildOgPages(sources());

  it('finds a page by its normalised path', () => {
    expect(findOgPage(pages, '/blog/').imagePath).toBe('/og/blog.png');
  });

  it('falls back to the Home image (404 and unknown pages)', () => {
    expect(findOgPage(pages, '/404').imagePath).toBe('/og/index.png');
  });

  it('throws when no image exists at all', () => {
    expect(() => findOgPage([], '/')).toThrow();
  });
});

describe('fitTitle', () => {
  // Every character is 0.5em wide: at 80px a character is 40px, so a 400px line holds 10 characters.
  const measure = (text: string, size: number) => text.length * size * 0.5;
  const options = { maxWidth: 400, sizes: [80, 40], maxLines: 3 };

  it('keeps the largest size when the title fits in up to three lines', () => {
    expect(fitTitle('Astro', measure, options)).toEqual({ fontSize: 80, lines: ['Astro'] });
    expect(fitTitle('um dois tres quatro', measure, options)).toEqual({
      fontSize: 80,
      lines: ['um dois', 'tres', 'quatro'],
    });
  });

  it('steps the size down when the title needs more than three lines', () => {
    const fitted = fitTitle('um dois tres quatro cinco seis sete oito', measure, options);
    expect(fitted.fontSize).toBe(40);
    expect(fitted.lines).toEqual(['um dois tres quatro', 'cinco seis sete oito']);
  });

  it('steps the size down when a single word is wider than the line, never splitting it', () => {
    const fitted = fitTitle('Supercalifragilistic', measure, options);
    expect(fitted).toEqual({ fontSize: 40, lines: ['Supercalifragilistic'] });
  });

  it('shortens at a word boundary with "…" when nothing fits', () => {
    const long = Array.from({ length: 20 }, (_, i) => `palavra${i},`).join(' ');
    const fitted = fitTitle(long, measure, options);
    expect(fitted.fontSize).toBe(40);
    expect(fitted.lines).toHaveLength(3);
    expect(fitted.lines.at(-1)).toMatch(/\d…$/);
    for (const line of fitted.lines) expect(measure(line, 40)).toBeLessThanOrEqual(400);
    expect(fitted.lines.join(' ')).toBe('palavra0, palavra1, palavra2, palavra3, palavra4, palavra5…');
  });

  it('keeps an over-long word whole even at the smallest size', () => {
    const fitted = fitTitle('a'.repeat(30), measure, options);
    expect(fitted).toEqual({ fontSize: 40, lines: ['a'.repeat(30)] });
  });

  it('needs at least one size', () => {
    expect(() => fitTitle('x', measure, { ...options, sizes: [] })).toThrow();
  });
});

describe('pageTitle', () => {
  it('is the site title alone on the Home page', () => {
    expect(pageTitle(undefined, 'Davi Brito · Fullstack Engineer', 'Davi Brito')).toBe(
      'Davi Brito · Fullstack Engineer',
    );
  });

  it('is "{title} · {author}" elsewhere', () => {
    expect(pageTitle('Blog', 'Davi Brito · Fullstack Engineer', 'Davi Brito')).toBe('Blog · Davi Brito');
  });
});
