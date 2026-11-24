import { describe, expect, it } from 'vitest';

import { codeFrameTransformer, frameCodeBlock, parseCodeTitle } from '@/lib/code-frame';

const pre = () => ({
  type: 'element' as const,
  tagName: 'pre',
  properties: { class: 'astro-code' },
  children: [{ type: 'text' as const, value: 'const a = 1;' }],
});

describe('parseCodeTitle', () => {
  it.each([
    ['title="src/content.config.ts"', 'src/content.config.ts'],
    ["title='src/x.ts'", 'src/x.ts'],
    ['{1,3} title="a b.ts" showLineNumbers', 'a b.ts'],
  ])('%s → %s', (meta, expected) => {
    expect(parseCodeTitle(meta)).toBe(expected);
  });

  it('is undefined without a title', () => {
    expect(parseCodeTitle(undefined)).toBeUndefined();
    expect(parseCodeTitle('')).toBeUndefined();
    expect(parseCodeTitle('subtitle="x"')).toBeUndefined();
    expect(parseCodeTitle('title=""')).toBeUndefined();
  });
});

describe('frameCodeBlock', () => {
  it('wraps the block in a figure with caption, hidden copy button and the pre', () => {
    const block = pre();
    const root = frameCodeBlock({ type: 'root', children: [block] }, 'src/x.ts');
    expect(root.children).toHaveLength(1);
    const figure = root.children[0];
    expect(figure).toMatchObject({ type: 'element', tagName: 'figure', properties: { class: 'code-frame' } });
    if (figure?.type !== 'element') throw new Error('expected an element');
    expect(figure.children.map((c) => (c.type === 'element' ? c.tagName : c.type))).toEqual([
      'figcaption',
      'button',
      'pre',
    ]);
    expect(figure.children[0]).toMatchObject({ children: [{ type: 'text', value: 'src/x.ts' }] });
    expect(figure.children[1]).toMatchObject({
      properties: { type: 'button', hidden: true, 'data-copy-code': '' },
    });
    expect(figure.children[2]).toBe(block);
  });

  it('omits the caption without a title', () => {
    const root = frameCodeBlock({ type: 'root', children: [pre()] });
    const figure = root.children[0];
    if (figure?.type !== 'element') throw new Error('expected an element');
    expect(figure.children.map((c) => (c.type === 'element' ? c.tagName : c.type))).toEqual([
      'button',
      'pre',
    ]);
  });

  it('leaves a root without a pre untouched', () => {
    const root = { type: 'root' as const, children: [{ type: 'text' as const, value: 'x' }] };
    expect(frameCodeBlock(root)).toEqual(root);
  });
});

describe('codeFrameTransformer', () => {
  it('reads the title from the code block meta', () => {
    const root = codeFrameTransformer.root.call(
      { options: { meta: { __raw: 'title="src/y.ts"' } } },
      { type: 'root', children: [pre()] },
    );
    const figure = root.children[0];
    if (figure?.type !== 'element') throw new Error('expected an element');
    expect(figure.children[0]).toMatchObject({ tagName: 'figcaption' });
  });

  it('works without meta', () => {
    const root = codeFrameTransformer.root.call({ options: {} }, { type: 'root', children: [pre()] });
    expect(root.children[0]).toMatchObject({ tagName: 'figure' });
  });
});
