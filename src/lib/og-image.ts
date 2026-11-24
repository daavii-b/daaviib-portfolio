import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

import { measureText, parseWoffMetrics, type FontMetrics } from './font-metrics';
import { fitTitle, OG_SIZE, type FittedTitle } from './og';

/**
 * Light-theme design tokens (`--ds-*` in src/styles/global.css). Satori cannot read CSS variables, so the values are
 * copied here; a unit test fails if they drift from the stylesheet.
 */
export const OG_COLORS = {
  surface: '#f4f4f5',
  border: '#e4e4e7',
  text: '#09090b',
  textMuted: '#52525b',
  accent: '#1d5fd6',
} as const;

/** Layout of the image, in pixels (see specs/004-og-images/contracts/og-images.md). */
const PAD = 64;
const LINE_PAD = 8;
const TITLE_SIZES = [88, 80, 72, 64, 56, 48] as const;
const TITLE_TRACKING = -0.03; // em, as the typographic cover (PostCover)
const TITLE_LINE_HEIGHT = 1.1;
/** Kerning is not measured; keep a margin so a line measured as fitting never touches the edge. */
const SAFETY = 0.98;
const TITLE_MAX_WIDTH = (OG_SIZE.width - 2 * PAD - 2 - 2 * LINE_PAD) * SAFETY;

export interface OgFonts {
  display: Buffer;
  body: Buffer;
  displayMetrics: FontMetrics;
}

let fonts: OgFonts | undefined;

/** Static WOFF files (Satori reads neither WOFF2 nor variable fonts), loaded once from node_modules. */
export function loadOgFonts(): OgFonts {
  if (!fonts) {
    const require = createRequire(import.meta.url);
    const read = (file: string) => readFileSync(require.resolve(file));
    const display = read('@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff');
    const body = read('@fontsource/inter/files/inter-latin-500-normal.woff');
    fonts = { display, body, displayMetrics: parseWoffMetrics(display) };
  }
  return fonts;
}

/** Title lines and size for the image, measured with the display font's real widths. */
export function fitOgTitle(title: string, metrics: FontMetrics = loadOgFonts().displayMetrics): FittedTitle {
  return fitTitle(title, (text, size) => measureText(metrics, text, size, TITLE_TRACKING), {
    maxWidth: TITLE_MAX_WIDTH,
    sizes: TITLE_SIZES,
    maxLines: 3,
  });
}

export interface OgImageInput {
  title: string;
  label: string;
  /** Bottom-left line, e.g. "Davi Brito · Fullstack Engineer". */
  byline: string;
  /** Bottom-right brand mark, e.g. "daaviib.site". */
  site: string;
}

/** Element in the shape Satori reads (a React element without React). */
interface Node {
  type: string;
  props: { style?: Record<string, string | number>; children?: Node[] | string };
}
const el = (style: Record<string, string | number>, children?: Node[] | string): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, ...(children === undefined ? {} : { children }) },
});

const small = {
  fontFamily: 'Inter',
  fontWeight: 500,
  color: OG_COLORS.textMuted,
  backgroundColor: OG_COLORS.surface,
};

/** Satori element tree of the share image (typographic cover language, light theme). */
export function ogImageTree({ label, byline, site }: Omit<OgImageInput, 'title'>, fitted: FittedTitle): Node {
  const { fontSize, lines } = fitted;
  return el(
    {
      boxSizing: 'border-box',
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: PAD,
      backgroundColor: OG_COLORS.surface,
      backgroundImage: `radial-gradient(circle, ${OG_COLORS.border} 1.2px, transparent 1.6px)`,
      backgroundSize: '16px 16px',
      backgroundPosition: '8px 8px',
      border: `1px solid ${OG_COLORS.border}`,
    },
    [
      el({ justifyContent: 'space-between', alignItems: 'center' }, [
        el(
          {
            ...small,
            fontSize: 22,
            letterSpacing: 1.3,
            textTransform: 'uppercase',
            padding: '4px 8px',
            marginLeft: -8,
          },
          label,
        ),
        el({ width: 12, height: 12, borderRadius: 2, backgroundColor: OG_COLORS.accent }),
      ]),
      el(
        { flexDirection: 'column', alignItems: 'flex-start', marginLeft: -LINE_PAD },
        lines.map((line) =>
          el(
            {
              fontFamily: 'Space Grotesk',
              fontWeight: 700,
              fontSize,
              lineHeight: TITLE_LINE_HEIGHT,
              letterSpacing: TITLE_TRACKING * fontSize,
              color: OG_COLORS.text,
              backgroundColor: OG_COLORS.surface,
              padding: `0 ${LINE_PAD}px`,
              whiteSpace: 'nowrap',
            },
            line,
          ),
        ),
      ),
      el({ justifyContent: 'space-between', alignItems: 'center', fontSize: 24 }, [
        el({ ...small, padding: '4px 8px', marginLeft: -8 }, byline),
        el({ ...small, padding: '4px 8px', marginRight: -8 }, site),
      ]),
    ],
  );
}

/** PNG bytes of a page's share image. */
export async function renderOgImage(input: OgImageInput): Promise<Uint8Array> {
  const { display, body, displayMetrics } = loadOgFonts();
  // Satori accepts any object with `type` and `props` (a React-element shape) — no JSX runtime needed.
  const svg = await satori(ogImageTree(input, fitOgTitle(input.title, displayMetrics)) as never, {
    ...OG_SIZE,
    fonts: [
      { name: 'Space Grotesk', data: display, weight: 700, style: 'normal' },
      { name: 'Inter', data: body, weight: 500, style: 'normal' },
    ],
  });
  return new Resvg(svg, { fitTo: { mode: 'original' } }).render().asPng();
}
