/**
 * Shiki transformer that frames Markdown code blocks:
 *
 *   <figure class="code-frame">
 *     <figcaption class="code-frame-title">src/x.ts</figcaption>   ← only with ```ts title="src/x.ts"
 *     <button class="code-frame-copy" data-copy-code hidden></button> ← revealed and labelled by CodeBlocks.astro
 *     <pre class="astro-code">…</pre>
 *   </figure>
 *
 * Labels are not set here (this runs in the build config, without a locale). Minimal hast types are declared locally
 * so the project does not need `shiki` as a direct dependency just for types.
 */

interface HastText {
  type: 'text';
  value: string;
}

export interface HastElement {
  type: 'element';
  tagName: string;
  properties: Record<string, unknown>;
  children: HastNode[];
}

type HastNode = HastElement | HastText;

export interface HastRoot {
  type: 'root';
  children: HastNode[];
}

/** The `title="…"` (or `title='…'`) value from a code fence's meta string. */
export function parseCodeTitle(meta: string | undefined): string | undefined {
  const match = meta?.match(/(?:^|\s)title=(["'])(.+?)\1/);
  return match?.[2];
}

const element = (
  tagName: string,
  properties: Record<string, unknown>,
  children: HastNode[] = [],
): HastElement => ({
  type: 'element',
  tagName,
  properties,
  children,
});

/** Wrap the root's `<pre>` in the code frame. Roots without a `<pre>` are returned as they are. */
export function frameCodeBlock(root: HastRoot, title?: string): HastRoot {
  const pre = root.children.find(
    (node): node is HastElement => node.type === 'element' && node.tagName === 'pre',
  );
  if (!pre) return root;
  const caption = title
    ? [element('figcaption', { class: 'code-frame-title' }, [{ type: 'text', value: title }])]
    : [];
  const button = element('button', {
    type: 'button',
    class: 'code-frame-copy',
    hidden: true,
    'data-copy-code': '',
  });
  const figure = element('figure', { class: 'code-frame' }, [...caption, button, pre]);
  return { ...root, children: root.children.map((node) => (node === pre ? figure : node)) };
}

interface TransformerContext {
  options: { meta?: { __raw?: string | undefined } | undefined };
}

export const codeFrameTransformer = {
  name: 'code-frame',
  root(this: TransformerContext, root: HastRoot): HastRoot {
    return frameCodeBlock(root, parseCodeTitle(this.options.meta?.__raw));
  },
};
