import { statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

/**
 * Whether a file exists under `public/` at build time, e.g. `publicFileExists('cv/davi-brito-cv.pdf')`.
 * Used to render links to optional files (CV) only when they are there. Paths escaping `public/` are refused.
 */
export function publicFileExists(path: string, root: string = process.cwd()): boolean {
  const publicDir = resolve(root, 'public');
  const target = resolve(join(publicDir, path));
  if (relative(publicDir, target).startsWith('..')) return false;
  try {
    return statSync(target).isFile();
  } catch {
    return false;
  }
}
