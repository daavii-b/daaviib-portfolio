import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { publicFileExists } from '@/lib/files';

describe('publicFileExists', () => {
  let root: string;

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'public-file-'));
    mkdirSync(join(root, 'public', 'cv'), { recursive: true });
    writeFileSync(join(root, 'public', 'cv', 'cv.pdf'), '%PDF-1.7');
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('is true for a file under public/', () => {
    expect(publicFileExists('cv/cv.pdf', root)).toBe(true);
    expect(publicFileExists('/cv/cv.pdf', root)).toBe(true);
  });

  it('is false for a missing file or a directory', () => {
    expect(publicFileExists('cv/missing.pdf', root)).toBe(false);
    expect(publicFileExists('cv', root)).toBe(false);
  });

  it('refuses paths that escape public/', () => {
    expect(publicFileExists('../package.json', root)).toBe(false);
  });

  it('defaults to the current working directory', () => {
    expect(publicFileExists('favicon.svg')).toBe(true);
  });
});
