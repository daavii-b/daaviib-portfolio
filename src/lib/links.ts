/** Path without query, hash or trailing slash (the root stays `/`), for comparing against built routes. */
export function normalizePath(path: string): string {
  const withoutSuffix = path.replace(/[?#].*$/, '');
  const trimmed = withoutSuffix.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/**
 * The href to render for a content link, or `undefined` to render plain text.
 * https URLs are kept; site paths are kept only when that page is built (so a draft never becomes a 404 link);
 * anything else is dropped.
 */
export function resolveInternalLink(
  href: string | undefined,
  publishedPaths: ReadonlySet<string>,
): string | undefined {
  if (!href) return undefined;
  if (href.startsWith('https://')) return href;
  if (href.startsWith('/') && publishedPaths.has(normalizePath(href))) return href;
  return undefined;
}

/**
 * Public path of a page from `Astro.url.pathname`, which includes `.html` during the build with
 * `build.format: 'file'`: `/about.html` → `/about`, `/index.html` → `/`, `/en/index.html` → `/en`.
 */
export function canonicalPath(pathname: string): string {
  return normalizePath(pathname.replace(/\.html$/, '').replace(/(^|\/)index$/, '$1'));
}
