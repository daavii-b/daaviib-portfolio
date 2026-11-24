#!/usr/bin/env node
// Flags AI-slop patterns in a post's prose. Usage: node slop-check.mjs <file.mdx> [...more]
// Ignores frontmatter, fenced code, inline code, MDX comments and URLs. Exit code 1 on errors; warnings need a
// human read (a concrete list of three nouns is fine, a reflex triad of adjectives is not).
import { readFileSync } from 'node:fs';

const PHRASES = [
  // pt
  'no mundo atual',
  'nos dias de hoje',
  'cada vez mais',
  'neste artigo',
  'nesse artigo',
  'neste post',
  'vamos explorar',
  'vamos mergulhar',
  'mergulhar',
  'mergulho',
  'jornada',
  'robusto',
  'robusta',
  'poderoso',
  'poderosa',
  'incrível',
  'incrivel',
  'revolucionári',
  'game changer',
  'alavancar',
  'potencializar',
  'desbloquear',
  'é importante notar',
  'é importante ressaltar',
  'vale ressaltar',
  'vale a pena mencionar',
  'vale lembrar',
  'em resumo',
  'em suma',
  'concluindo',
  'por fim, mas não menos',
  'espero que tenha gostado',
  'deixe nos comentários',
  'deixe seu comentário',
  'até a próxima',
  'sem mais delongas',
  'vamos lá',
  'simplesmente',
  'basicamente',
  'literalmente',
  'de forma eficiente',
  'de forma simples',
  'de forma eficaz',
  'de maneira eficiente',
  'imagine que',
  'no fim das contas',
  'ecossistema vibrante',
  // en
  "in today's",
  'fast-paced',
  'in this article',
  'in this post',
  "let's dive",
  'dive into',
  'deep dive',
  'delve',
  'journey',
  'robust',
  'powerful',
  'seamless',
  'game-changer',
  'cutting-edge',
  'leverage',
  'unlock',
  'empower',
  "it's important to note",
  'worth noting',
  'in conclusion',
  'to sum up',
  'happy coding',
  'without further ado',
];

const HEADINGS =
  /^#{2,3}\s+(introdução|introducao|conclusão|conclusao|considerações finais|resumo|por que isso importa|benefícios|introduction|conclusion|summary|why it matters|wrapping up)\s*$/i;
const NOT_JUST =
  /\bnão (é|se trata de) (apenas|só|somente)\b|\bnot (just|only|merely)\b[^.]*\bit'?s\b|\bit'?s not\b[^.]*,\s*it'?s\b/i;
const EMOJI = /\p{Extended_Pictographic}/u;
const MAX_SENTENCE_WORDS = 35;
const MAX_PARAGRAPH_SENTENCES = 6;

function prose(text) {
  const lines = text.split('\n');
  let i = 0;
  if (lines[0]?.trim() === '---') {
    i = lines.findIndex((l, n) => n > 0 && l.trim() === '---') + 1;
  }
  const out = [];
  let inFence = false;
  for (let n = 0; n < lines.length; n++) {
    let line = lines[n];
    if (n < i) {
      out.push('');
      continue;
    }
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      out.push('');
      continue;
    }
    if (inFence) {
      out.push('');
      continue;
    }
    line = line
      .replace(/\{\/\*.*?\*\/\}/g, '')
      .replace(/`[^`]*`/g, 'CODE')
      .replace(/\]\([^)]*\)/g, ']')
      .replace(/https?:\/\/\S+/g, 'URL')
      .replace(/<\/?[A-Z][^>]*>/g, '');
    out.push(line);
  }
  return out;
}

function check(file) {
  const lines = prose(readFileSync(file, 'utf8'));
  const hits = [];
  const WARN = new Set(['triad', 'question']);
  const add = (n, rule, detail) => hits.push({ line: n + 1, rule, detail, warn: WARN.has(rule) });

  let emDashes = 0;
  lines.forEach((line, n) => {
    const lower = line.toLowerCase();
    for (const p of PHRASES) if (lower.includes(p)) add(n, 'phrase', `"${p}"`);
    if (HEADINGS.test(line)) add(n, 'heading', line.trim());
    if (NOT_JUST.test(line)) add(n, 'not-just', 'manufactured contrast ("não é apenas X, é Y")');
    if (/!(\s|$)/.test(line.replace(/^\s*!\[/, ''))) add(n, 'exclamation', 'exclamation mark in prose');
    if (EMOJI.test(line)) add(n, 'emoji', 'emoji in prose');
    if (/\?\s*$/.test(line.trim()) || /\?\s+[A-ZÀ-Ú]/.test(line)) add(n, 'question', 'rhetorical question?');
    const dashes = (line.match(/—/g) ?? []).length;
    emDashes += dashes;
    if (dashes) add(n, 'em-dash', 'em dash in prose (one per post at most)');
    if (/^\s*\*\*[^*]+\*\*:?\s*$/.test(line)) add(n, 'bold-heading', 'bold line used as a heading');
  });

  // Paragraph and sentence length.
  let start = 0;
  const paragraphs = [];
  let buf = [];
  lines.forEach((line, n) => {
    const t = line.trim();
    if (!t || t.startsWith('#') || /^[-*\d]+[.)]?\s/.test(t) || t.startsWith('|')) {
      if (buf.length) paragraphs.push({ start, text: buf.join(' ') });
      buf = [];
      if (/^[-*\d]+[.)]?\s/.test(t))
        paragraphs.push({ start: n, text: t.replace(/^[-*\d]+[.)]?\s/, ''), item: true });
      return;
    }
    if (!buf.length) start = n;
    buf.push(t);
  });
  if (buf.length) paragraphs.push({ start, text: buf.join(' ') });

  for (const p of paragraphs) {
    const sentences = p.text.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
    if (!p.item && sentences.length > MAX_PARAGRAPH_SENTENCES) {
      add(p.start, 'long-paragraph', `${sentences.length} sentences (max ${MAX_PARAGRAPH_SENTENCES})`);
    }
    for (const s of sentences) {
      const words = s.split(/\s+/).filter(Boolean).length;
      if (words > MAX_SENTENCE_WORDS) add(p.start, 'long-sentence', `${words} words: "${s.slice(0, 60)}…"`);
    }
  }

  // Triads of adjectives/nouns: "a, b e c" with short items.
  lines.forEach((line, n) => {
    for (const m of line.matchAll(/\b(\p{L}+), (\p{L}+),? (e|and) (\p{L}+)\b/gu)) {
      if (m[0].includes('CODE')) continue; // a list of code names is concrete by definition
      add(n, 'triad', `"${m[0]}" (keep only what is true and shown)`);
    }
  });

  // Recap ending: last paragraph restating.
  const last = paragraphs.at(-1)?.text.toLowerCase() ?? '';
  if (
    /^(em resumo|resumindo|no fim|por fim|assim,|dessa forma|com isso,|in short|overall|ultimately)/.test(
      last,
    )
  ) {
    add(paragraphs.at(-1).start, 'recap-ending', 'last paragraph reads like a summary');
  }

  return { hits, emDashes };
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node slop-check.mjs <file.mdx> [...]');
  process.exit(2);
}
let total = 0;
for (const file of files) {
  const { hits } = check(file);
  hits.sort((a, b) => a.line - b.line);
  const errors = hits.filter((h) => !h.warn).length;
  total += errors;
  if (!hits.length) {
    console.log(`✓ ${file}: no slop patterns found`);
    continue;
  }
  console.log(
    `${errors ? '✗' : '✓'} ${file}: ${errors} error(s), ${hits.length - errors} warning(s) to review`,
  );
  for (const h of hits)
    console.log(`  ${file}:${h.line}  ${h.warn ? 'warn ' : 'error'} [${h.rule}] ${h.detail}`);
}
process.exit(total ? 1 : 0);
