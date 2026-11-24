import { resolveInternalLink } from './links';

/**
 * Pure helpers for the "Now" entry (`src/content/now/{lang}.json`), shared by the content schema, the Home block and
 * `/now`. No `astro:content` import, so `content.config.ts` can use them.
 */

/** A piece of the status sentence: plain text, or a link when `href` is set. */
export interface StatusSegment {
  text: string;
  href?: string | undefined;
}

/** Inline link in Markdown syntax: `[text](href)`; text without brackets, href without spaces or parentheses. */
const LINK = /\[([^[\]]+)\]\(([^()\s]+)\)/g;
const ALLOWED_HREF = /^(\/|https:\/\/)/;

/** Split the status sentence into text and link segments. */
export function parseStatus(status: string): StatusSegment[] {
  const segments: StatusSegment[] = [];
  let last = 0;
  for (const match of status.matchAll(LINK)) {
    const [whole, text = '', href = ''] = match;
    if (match.index > last) segments.push({ text: status.slice(last, match.index) });
    segments.push({ text, href });
    last = match.index + whole.length;
  }
  if (last < status.length) segments.push({ text: status.slice(last) });
  return segments;
}

/** Problems with the sentence's links, as messages for the content schema (empty = valid). */
export function statusIssues(status: string): string[] {
  const issues: string[] = [];
  for (const [whole, , href = ''] of status.matchAll(LINK)) {
    if (!ALLOWED_HREF.test(href)) issues.push(`link "${whole}" must point to a site path or an https URL`);
  }
  if (/[[\]]/.test(status.replace(LINK, ''))) issues.push('unbalanced "[" or "]" outside a link');
  return issues;
}

/** Resolve each link with `resolveInternalLink`: links to pages that are not built become plain text. */
export function resolveStatus(
  segments: readonly StatusSegment[],
  publishedPaths: ReadonlySet<string>,
): StatusSegment[] {
  return segments.map((segment) =>
    'href' in segment
      ? { text: segment.text, href: resolveInternalLink(segment.href, publishedPaths) }
      : segment,
  );
}

const isoDay = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Message when `updatedAt` is not the newest history date (the entry is stale or the history is missing an update);
 * `undefined` when they match. History order in the file does not matter.
 */
export function historyDateMismatch(updatedAt: Date, history: readonly { date: Date }[]): string | undefined {
  if (history.length === 0) return 'history needs at least one entry';
  const newest = Math.max(...history.map((entry) => entry.date.getTime()));
  const newestDay = isoDay(new Date(newest));
  const updatedDay = isoDay(updatedAt);
  return newestDay === updatedDay
    ? undefined
    : `updatedAt is ${updatedDay} but the newest history entry is ${newestDay}; they must be equal`;
}

/** History newest first; only the newest entry is `current`. Returns new objects. */
export function timeline<T extends { date: Date }>(history: readonly T[]): (T & { current: boolean })[] {
  return [...history]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((entry, index) => ({ ...entry, current: index === 0 }));
}

export const CHANGE_KINDS = ['added', 'changed', 'removed'] as const;
export type ChangeKind = (typeof CHANGE_KINDS)[number];

/** Sign shown in the monospace style; the spoken word is the UI string `now.change.{kind}`. */
export const CHANGE_SIGNS: Record<ChangeKind, string> = { added: '+', changed: '~', removed: '−' };
