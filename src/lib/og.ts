import type { UiKey } from '@/i18n/ui';

import { normalizePath } from './links';

/** Share images (Open Graph) are 1200×630, the size LinkedIn, X and Slack expect for large previews. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

/** One page that gets its own share image. */
export interface OgPage {
  /** Normalised page path: `/`, `/blog`, `/blog/por-que-escolhi-astro`, `/en/about`. */
  pagePath: string;
  /** Public path of the image, from `ogImagePath`. */
  imagePath: string;
  /** Text drawn in the image; also the image's alternative text. */
  title: string;
  /** Eyebrow above the title (rendered uppercase). */
  label: string;
}

/** Image path for a page: `/` → `/og/index.png`, `/blog/x` → `/og/blog/x.png`, `/en` → `/og/en.png`. */
export function ogImagePath(pagePath: string): string {
  const path = normalizePath(pagePath);
  return path === '/' ? '/og/index.png' : `/og${path}.png`;
}

/** Rest parameter of the `/og/[...path].png` endpoint for an image path: `/og/blog/x.png` → `blog/x`. */
export function ogRouteParam(imagePath: string): string {
  return imagePath.replace(/^\/og\//, '').replace(/\.png$/, '');
}

export interface OgSources {
  author: string;
  /** UI string for the page's locale. */
  text: (key: UiKey) => string;
  /** Localised path for the page's locale (`localizePath`). */
  localize: (path: string) => string;
  posts: readonly { slug: string; title: string; tags: readonly string[] }[];
  projects: readonly { slug: string; name: string }[];
}

/** Static pages: the image title is the page's H1 (the Home headline for `/`), the label its section name. */
const STATIC_PAGES: readonly { path: string; title: UiKey; label: UiKey | 'author' }[] = [
  { path: '/', title: 'home.title', label: 'author' },
  { path: '/blog', title: 'blog.title', label: 'nav.blog' },
  { path: '/projects', title: 'projects.title', label: 'nav.projects' },
  { path: '/about', title: 'about.greeting', label: 'nav.about' },
  { path: '/now', title: 'now.title', label: 'nav.now' },
];

/** Every page of one locale that gets a share image. The Home entry comes first. */
export function buildOgPages(sources: OgSources): OgPage[] {
  const { text, localize } = sources;
  const entry = (path: string, title: string, label: string): OgPage => {
    const pagePath = normalizePath(localize(path));
    return { pagePath, imagePath: ogImagePath(pagePath), title, label };
  };
  return [
    ...STATIC_PAGES.map((page) =>
      entry(page.path, text(page.title), page.label === 'author' ? sources.author : text(page.label)),
    ),
    ...sources.posts.map((post) => entry(`/blog/${post.slug}`, post.title, post.tags[0] ?? text('nav.blog'))),
    ...sources.projects.map((project) =>
      entry(`/projects/${project.slug}`, project.name, text('og.project')),
    ),
  ];
}

/** The share image of a page; pages without their own image (the 404 page) get the first entry, the Home's. */
export function findOgPage(pages: readonly OgPage[], pagePath: string): OgPage {
  const path = normalizePath(pagePath);
  const found = pages.find((page) => page.pagePath === path) ?? pages[0];
  if (!found) throw new Error('No share images were built');
  return found;
}

export interface FitOptions {
  maxWidth: number;
  /** Candidate font sizes, largest first. */
  sizes: readonly number[];
  maxLines: number;
}

export interface FittedTitle {
  fontSize: number;
  lines: string[];
}

/** Greedy word wrap; a word wider than the line stays whole on its own line. */
function wrap(words: readonly string[], fits: (line: string) => boolean): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && !fits(candidate)) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Wrap a title into at most `maxLines` lines at the largest size that fits; words are never split.
 * When even the smallest size needs more lines, the title is shortened at a word boundary and ends with "…".
 * `measure(text, fontSize)` returns the rendered width in pixels.
 */
export function fitTitle(
  title: string,
  measure: (text: string, fontSize: number) => number,
  { maxWidth, sizes, maxLines }: FitOptions,
): FittedTitle {
  const words = title.trim().split(/\s+/).filter(Boolean);
  for (const fontSize of sizes) {
    const fits = (line: string) => measure(line, fontSize) <= maxWidth;
    const lines = wrap(words, fits);
    if (lines.length <= maxLines && lines.every(fits)) return { fontSize, lines };
  }

  const fontSize = sizes.at(-1);
  if (fontSize === undefined) throw new Error('fitTitle needs at least one font size');
  const fits = (line: string) => measure(line, fontSize) <= maxWidth;
  const lines = wrap(words, fits);
  if (lines.length <= maxLines) return { fontSize, lines };

  const kept = lines.slice(0, maxLines);
  let last = (kept.pop() ?? '').split(' ');
  const ellipsis = (lineWords: string[]) => `${lineWords.join(' ').replace(/[\s,.;:—–-]+$/, '')}…`;
  while (last.length > 1 && !fits(ellipsis(last))) last = last.slice(0, -1);
  return { fontSize, lines: [...kept, ellipsis(last)] };
}

/** Document title: the site title alone for the Home page, otherwise "{page title} · {author}". */
export function pageTitle(title: string | undefined, siteTitle: string, author: string): string {
  return title ? `${title} · ${author}` : siteTitle;
}
