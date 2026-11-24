import { expect, test, type Page } from '@playwright/test';

const SITE_TITLE = 'Davi Brito · Fullstack Engineer';

/** Every built page, with its expected document title and share image path. */
const pages = [
  { path: '/', title: SITE_TITLE, image: '/og/index.png' },
  { path: '/blog', title: 'Blog · Davi Brito', image: '/og/blog.png' },
  { path: '/projects', title: 'Projetos · Davi Brito', image: '/og/projects.png' },
  { path: '/about', title: 'Sobre · Davi Brito', image: '/og/about.png' },
  { path: '/now', title: 'Agora · Davi Brito', image: '/og/now.png' },
  {
    path: '/blog/por-que-escolhi-astro',
    title: 'Por que escolhi Astro para este site · Davi Brito',
    image: '/og/blog/por-que-escolhi-astro.png',
  },
  { path: '/projects/este-site', title: 'Este site · Davi Brito', image: '/og/projects/este-site.png' },
  { path: '/nao-existe', title: 'Página não encontrada · Davi Brito', image: '/og/index.png' },
];

const meta = (page: Page, selector: string) => page.locator(`head meta[${selector}]`).getAttribute('content');

/** Width and height from a PNG's IHDR chunk (bytes 16–23), after checking the PNG signature. */
function pngSize(body: Buffer): { width: number; height: number } {
  expect([...body.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  expect(body.subarray(12, 16).toString('ascii')).toBe('IHDR');
  return { width: body.readUInt32BE(16), height: body.readUInt32BE(20) };
}

for (const { path, title, image } of pages) {
  test(`${path} has the title pattern, a description and a 1200×630 share image`, async ({
    page,
    request,
  }) => {
    // Pure <head> checks: one browser project is enough.
    test.skip(test.info().project.name !== 'chromium', 'head-only checks');
    await page.goto(path);

    await expect(page).toHaveTitle(title);
    const description = await meta(page, 'name="description"');
    expect(description?.length ?? 0).toBeGreaterThan(0);
    expect(description?.length ?? 0).toBeLessThanOrEqual(160);

    const ogImage = await meta(page, 'property="og:image"');
    expect(ogImage).toMatch(/^https?:\/\//);
    const imageUrl = new URL(ogImage ?? '');
    const canonical = new URL((await page.locator('link[rel="canonical"]').getAttribute('href')) ?? '');
    expect(imageUrl.origin).toBe(canonical.origin);
    expect(imageUrl.pathname).toBe(image);
    expect(await meta(page, 'name="twitter:image"')).toBe(ogImage);
    expect(await meta(page, 'property="og:image:width"')).toBe('1200');
    expect(await meta(page, 'property="og:image:height"')).toBe('630');
    expect(await meta(page, 'property="og:image:alt"')).toBeTruthy();

    // The absolute URL points at the configured site; fetch the same path from the server under test.
    const response = await request.get(imageUrl.pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    const body = await response.body();
    expect(pngSize(body)).toEqual({ width: 1200, height: 630 });
    expect(body.byteLength).toBeLessThan(300 * 1024);
  });
}

test('meta descriptions are specific to each static page', async ({ page }) => {
  test.skip(test.info().project.name !== 'chromium', 'head-only checks');
  const descriptions = new Set<string | null>();
  for (const path of ['/', '/blog', '/projects', '/about', '/now']) {
    await page.goto(path);
    descriptions.add(await meta(page, 'name="description"'));
  }
  expect(descriptions.size).toBe(5);
});

test('the article image alt is its title and BlogPosting references the image', async ({ page }) => {
  test.skip(test.info().project.name !== 'chromium', 'head-only checks');
  await page.goto('/blog/por-que-escolhi-astro');
  expect(await meta(page, 'property="og:image:alt"')).toBe('Por que escolhi Astro para este site');
  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  expect(jsonLd.image).toBe(await meta(page, 'property="og:image"'));
});
