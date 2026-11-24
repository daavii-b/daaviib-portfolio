import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { fitOgTitle, loadOgFonts, OG_COLORS, renderOgImage } from '@/lib/og-image';

/** Width and height from a PNG's IHDR chunk (bytes 16–23). */
function pngSize(png: Uint8Array): { width: number; height: number } {
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

describe('OG_COLORS', () => {
  it('match the light-theme design tokens in global.css', () => {
    const css = readFileSync('src/styles/global.css', 'utf8');
    const root = css.slice(css.indexOf(':root {'), css.indexOf('.dark {'));
    const token = (name: string) => new RegExp(`--ds-${name}:\\s*(#[0-9a-f]{6});`).exec(root)?.[1];
    expect(OG_COLORS).toEqual({
      surface: token('surface'),
      border: token('border'),
      text: token('text'),
      textMuted: token('text-muted'),
      accent: token('accent'),
    });
  });
});

describe('fitOgTitle', () => {
  it('sets a short title at the largest size', () => {
    expect(fitOgTitle('Blog')).toEqual({ fontSize: 88, lines: ['Blog'] });
  });

  it('fits the first post title in at most three lines', () => {
    const fitted = fitOgTitle('Por que escolhi Astro para este site');
    expect(fitted.lines.length).toBeLessThanOrEqual(3);
    expect(fitted.lines.join(' ')).toBe('Por que escolhi Astro para este site');
  });

  it('fits a 100-character title (the schema limit) without cutting words', () => {
    const title =
      'Como migrei uma plataforma SaaS B2B inteira para arquitetura orientada a eventos sem parar o produto';
    expect(title.length).toBeGreaterThanOrEqual(95);
    expect(title.length).toBeLessThanOrEqual(100);
    const fitted = fitOgTitle(title);
    expect(fitted.fontSize).toBeLessThan(88);
    expect(fitted.lines.length).toBeLessThanOrEqual(3);
    expect(fitted.lines.join(' ')).toBe(title);
  });

  it('caches the fonts', () => {
    expect(loadOgFonts()).toBe(loadOgFonts());
  });
});

describe('renderOgImage', () => {
  it('renders a 1200×630 PNG under 300 KB', async () => {
    const png = await renderOgImage({
      title: 'Por que escolhi Astro para este site',
      label: 'astro',
      byline: 'Davi Brito · Fullstack Engineer',
      site: 'daaviib.site',
    });
    expect([...png.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(pngSize(png)).toEqual({ width: 1200, height: 630 });
    expect(png.byteLength).toBeLessThan(300 * 1024);
  });
});
