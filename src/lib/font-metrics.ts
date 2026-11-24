import { inflateSync } from 'node:zlib';

/**
 * Horizontal metrics of a font, read from a WOFF 1.0 file: enough to measure a line of text exactly (advance widths),
 * so share-image titles can be wrapped and sized before rendering. Kerning is ignored; it only narrows text.
 */
export interface FontMetrics {
  unitsPerEm: number;
  /** Advance width (font units) of a code point; the `.notdef` glyph's width when the font has no glyph for it. */
  advance(codePoint: number): number;
}

function readTables(woff: Uint8Array): Map<string, DataView> {
  const view = new DataView(woff.buffer, woff.byteOffset, woff.byteLength);
  if (view.getUint32(0) !== 0x774f4646)
    throw new Error('Not a WOFF 1.0 font (expected the "wOFF" signature)');
  const numTables = view.getUint16(12);
  const tables = new Map<string, DataView>();
  for (let i = 0; i < numTables; i++) {
    const entry = 44 + i * 20;
    const tag = String.fromCharCode(...woff.subarray(entry, entry + 4));
    const offset = view.getUint32(entry + 4);
    const compLength = view.getUint32(entry + 8);
    const origLength = view.getUint32(entry + 12);
    const raw = woff.subarray(offset, offset + compLength);
    const data = compLength < origLength ? inflateSync(raw) : raw;
    tables.set(tag, new DataView(data.buffer, data.byteOffset, data.byteLength));
  }
  return tables;
}

function table(tables: Map<string, DataView>, tag: string): DataView {
  const found = tables.get(tag);
  if (!found) throw new Error(`Font has no "${tag}" table`);
  return found;
}

/** Glyph lookup from the first Unicode BMP subtable in `cmap` format 4. */
function cmapFormat4(cmap: DataView): (codePoint: number) => number {
  const count = cmap.getUint16(2);
  for (let i = 0; i < count; i++) {
    const record = 4 + i * 8;
    const platform = cmap.getUint16(record);
    const encoding = cmap.getUint16(record + 2);
    const offset = cmap.getUint32(record + 4);
    const unicodeBmp = (platform === 3 && encoding === 1) || platform === 0;
    if (!unicodeBmp || cmap.getUint16(offset) !== 4) continue;

    const segCount = cmap.getUint16(offset + 6) / 2;
    const endCodes = offset + 14;
    const startCodes = endCodes + segCount * 2 + 2;
    const idDeltas = startCodes + segCount * 2;
    const idRangeOffsets = idDeltas + segCount * 2;
    return (codePoint) => {
      for (let s = 0; s < segCount; s++) {
        if (codePoint > cmap.getUint16(endCodes + s * 2)) continue;
        const start = cmap.getUint16(startCodes + s * 2);
        if (codePoint < start) return 0;
        const delta = cmap.getUint16(idDeltas + s * 2);
        const rangeOffsetAt = idRangeOffsets + s * 2;
        const rangeOffset = cmap.getUint16(rangeOffsetAt);
        if (rangeOffset === 0) return (codePoint + delta) & 0xffff;
        const glyph = cmap.getUint16(rangeOffsetAt + rangeOffset + (codePoint - start) * 2);
        return glyph === 0 ? 0 : (glyph + delta) & 0xffff;
      }
      return 0;
    };
  }
  throw new Error('Font has no Unicode BMP cmap subtable in format 4');
}

export function parseWoffMetrics(woff: Uint8Array): FontMetrics {
  const tables = readTables(woff);
  const unitsPerEm = table(tables, 'head').getUint16(18);
  const numberOfHMetrics = table(tables, 'hhea').getUint16(34);
  const hmtx = table(tables, 'hmtx');
  const glyphOf = cmapFormat4(table(tables, 'cmap'));
  const advanceOfGlyph = (glyph: number) => hmtx.getUint16(Math.min(glyph, numberOfHMetrics - 1) * 4);
  return { unitsPerEm, advance: (codePoint) => advanceOfGlyph(glyphOf(codePoint)) };
}

/** Width in pixels of `text` at `fontSize`, with `letterSpacing` in em added after every character (as CSS does). */
export function measureText(metrics: FontMetrics, text: string, fontSize: number, letterSpacing = 0): number {
  let units = 0;
  let chars = 0;
  for (const char of text) {
    units += metrics.advance(char.codePointAt(0) ?? 0);
    chars++;
  }
  return (units / metrics.unitsPerEm) * fontSize + chars * letterSpacing * fontSize;
}
