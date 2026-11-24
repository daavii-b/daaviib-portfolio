import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

import { measureText, parseWoffMetrics } from '@/lib/font-metrics';

/** Minimal uncompressed WOFF 1.0 with the given sfnt tables. */
function woff(tables: Record<string, Uint8Array>): Uint8Array {
  const entries = Object.entries(tables);
  const headerSize = 44 + entries.length * 20;
  const total = headerSize + entries.reduce((sum, [, data]) => sum + data.length, 0);
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  view.setUint32(0, 0x774f4646);
  view.setUint32(4, 0x00010000);
  view.setUint32(8, total);
  view.setUint16(12, entries.length);
  let offset = headerSize;
  entries.forEach(([tag, data], i) => {
    const entry = 44 + i * 20;
    for (let c = 0; c < 4; c++) out[entry + c] = tag.charCodeAt(c);
    view.setUint32(entry + 4, offset);
    view.setUint32(entry + 8, data.length);
    view.setUint32(entry + 12, data.length);
    out.set(data, offset);
    offset += data.length;
  });
  return out;
}

function bytes(size: number, write: (view: DataView) => void): Uint8Array {
  const data = new Uint8Array(size);
  write(new DataView(data.buffer));
  return data;
}

const head = bytes(54, (v) => v.setUint16(18, 1000));
const hhea = bytes(36, (v) => v.setUint16(34, 3));
const hmtx = bytes(12, (v) => [500, 600, 700].forEach((advance, glyph) => v.setUint16(glyph * 4, advance)));

/** cmap with a Mac record (ignored) and a Windows Unicode BMP format-4 subtable:
 *  A–B through idDelta (glyphs 1–2), a–b through glyphIdArray (glyph 3, then 0 = missing). */
const cmap = bytes(12 + 8 + 44, (v) => {
  v.setUint16(2, 2);
  v.setUint16(4, 1); // Macintosh, skipped
  v.setUint32(8, 20);
  v.setUint16(12, 3); // Windows, Unicode BMP
  v.setUint16(14, 1);
  v.setUint32(16, 20);
  const f = 20;
  v.setUint16(f, 4);
  v.setUint16(f + 6, 6);
  [66, 98, 0xffff].forEach((code, i) => v.setUint16(f + 14 + i * 2, code));
  [65, 97, 0xffff].forEach((code, i) => v.setUint16(f + 22 + i * 2, code));
  [0xffc0, 0, 1].forEach((delta, i) => v.setUint16(f + 28 + i * 2, delta));
  [0, 4, 0].forEach((rangeOffset, i) => v.setUint16(f + 34 + i * 2, rangeOffset));
  [3, 0].forEach((glyph, i) => v.setUint16(f + 40 + i * 2, glyph));
});

describe('parseWoffMetrics (synthetic font)', () => {
  const metrics = parseWoffMetrics(woff({ head, hhea, hmtx, cmap }));

  it('reads unitsPerEm', () => {
    expect(metrics.unitsPerEm).toBe(1000);
  });

  it.each([
    ['A', 600], // idDelta → glyph 1
    ['B', 700], // idDelta → glyph 2
    ['a', 700], // glyphIdArray → glyph 3, past numberOfHMetrics → last advance
    ['b', 500], // glyphIdArray 0 → .notdef
    ['C', 500], // between segments → .notdef
    ['😀', 500], // outside the BMP → .notdef
  ])('advance of %s is %i', (char, advance) => {
    expect(metrics.advance(char.codePointAt(0) ?? 0)).toBe(advance);
  });

  it('rejects files that are not WOFF 1.0', () => {
    expect(() => parseWoffMetrics(new Uint8Array(44))).toThrow(/wOFF/);
  });

  it('rejects fonts without a required table', () => {
    expect(() => parseWoffMetrics(woff({ head, hhea, cmap }))).toThrow(/hmtx/);
  });

  it('rejects fonts without a format-4 Unicode cmap', () => {
    const format6 = bytes(20, (v) => {
      v.setUint16(2, 1);
      v.setUint16(4, 3);
      v.setUint16(6, 1);
      v.setUint32(8, 12);
      v.setUint16(12, 6);
    });
    expect(() => parseWoffMetrics(woff({ head, hhea, hmtx, cmap: format6 }))).toThrow(/format 4/);
  });
});

describe('measureText', () => {
  const metrics = { unitsPerEm: 1000, advance: (codePoint: number) => (codePoint === 32 ? 250 : 500) };

  it('scales advances to the font size', () => {
    expect(measureText(metrics, 'ab', 100)).toBe(100);
    expect(measureText(metrics, 'a b', 10)).toBe(12.5);
  });

  it('adds letter spacing (em) after each character', () => {
    expect(measureText(metrics, 'ab', 100, -0.03)).toBeCloseTo(94);
  });
});

describe('parseWoffMetrics (Space Grotesk 700 from Fontsource)', () => {
  const require = createRequire(import.meta.url);
  const file = readFileSync(
    require.resolve('@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff'),
  );
  const metrics = parseWoffMetrics(file);

  it('measures real glyphs, accents included', () => {
    const width = (text: string) => measureText(metrics, text, 100);
    expect(width('M')).toBeGreaterThan(width('i'));
    expect(width('ã')).toBe(width('a'));
    expect(width('ç')).toBeGreaterThan(0);
    expect(width('·')).toBeGreaterThan(0);
  });
});
