import { describe, expect, it } from 'vitest';

import { canonicalPath, normalizePath, resolveInternalLink } from '@/lib/links';

const published = new Set(['/', '/projects', '/projects/este-site', '/now']);

describe('resolveInternalLink', () => {
  it('keeps https links', () => {
    expect(resolveInternalLink('https://github.com/daavii-b', published)).toBe('https://github.com/daavii-b');
  });

  it('keeps site paths that are built', () => {
    expect(resolveInternalLink('/projects/este-site', published)).toBe('/projects/este-site');
    expect(resolveInternalLink('/', published)).toBe('/');
  });

  it('matches regardless of a trailing slash, query or hash, and returns the href unchanged', () => {
    expect(resolveInternalLink('/projects/este-site/', published)).toBe('/projects/este-site/');
    expect(resolveInternalLink('/now#agora', published)).toBe('/now#agora');
    expect(resolveInternalLink('/projects?tag=astro', published)).toBe('/projects?tag=astro');
  });

  it('drops site paths that are not built (drafts, missing pages)', () => {
    expect(resolveInternalLink('/projects/prumo', published)).toBeUndefined();
  });

  it('returns undefined without an href, and for anything that is not a site path or https', () => {
    expect(resolveInternalLink(undefined, published)).toBeUndefined();
    expect(resolveInternalLink('http://example.com', published)).toBeUndefined();
    expect(resolveInternalLink('javascript:alert(1)', published)).toBeUndefined();
  });
});

describe('normalizePath', () => {
  it.each([
    ['/', '/'],
    ['/blog/', '/blog'],
    ['/blog//', '/blog'],
    ['/now?x=1#y', '/now'],
  ])('%s → %s', (input, expected) => {
    expect(normalizePath(input)).toBe(expected);
  });
});

describe('canonicalPath', () => {
  it.each([
    ['/index.html', '/'],
    ['/', '/'],
    ['/about.html', '/about'],
    ['/about', '/about'],
    ['/blog/por-que-escolhi-astro.html', '/blog/por-que-escolhi-astro'],
    ['/en/index.html', '/en'],
    ['/blog/', '/blog'],
  ])('%s → %s', (input, expected) => {
    expect(canonicalPath(input)).toBe(expected);
  });
});
