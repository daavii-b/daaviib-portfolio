import { expect, test } from '@playwright/test';

const PATH = '/blog/por-que-escolhi-astro';
const TITLE = 'Por que escolhi Astro para este site';
const SECTIONS = [
  'O que eu precisava',
  'Estático primeiro',
  'Conteúdo como dado tipado',
  'O que ficou para depois',
];

test.describe('article page', () => {
  test('renders the header, body, note and tags', async ({ page }) => {
    await page.goto(PATH);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITLE);
    await expect(page.getByRole('link', { name: 'Todos os artigos' }).first()).toHaveAttribute(
      'href',
      '/blog',
    );
    await expect(page.getByText('Série · Construindo este site · 1 de 1')).toBeVisible();
    await expect(page.locator('article header time')).toHaveAttribute('datetime', /^2026-11-24/);

    const body = page.locator('article .prose');
    await expect(body.getByRole('heading', { level: 2 })).toHaveText(SECTIONS);
    await expect(body.getByRole('complementary', { name: 'Nota' })).toContainText(
      'Rascunhos com draft: true',
    );

    // No tag pages yet: tags are labels, not links.
    await expect(page.locator('article .prose + div').getByText('astro', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'astro', exact: true })).toHaveCount(0);
  });

  test('side column lists the sections and highlights the current one (desktop)', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'the side column is desktop-only');
    await page.goto(PATH);
    const toc = page.getByRole('navigation', { name: 'Neste artigo' });
    await expect(toc.getByRole('link')).toHaveText(SECTIONS);
    await expect(page.locator('details')).toBeHidden();

    await page.locator('#conteúdo-como-dado-tipado').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.getElementById('conteúdo-como-dado-tipado')?.scrollIntoView());
    await expect(toc.getByRole('link', { name: 'Conteúdo como dado tipado' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await expect(toc.locator('[aria-current]')).toHaveCount(1);
  });

  test('table of contents is a collapsed disclosure on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile layout only');
    await page.goto(PATH);
    const details = page.locator('details').filter({ hasText: 'Neste artigo' });
    await expect(details).toBeVisible();
    await expect(details).not.toHaveAttribute('open');
    await details.locator('summary').click();
    await expect(details.getByRole('link')).toHaveText(SECTIONS);
    await expect(page.getByRole('complementary', { name: 'Navegação do artigo' })).toBeHidden();
  });

  test('code block shows the file name and copies only the code', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(PATH);
    const frame = page.locator('figure.code-frame');
    await expect(frame.locator('figcaption')).toHaveText('src/content.config.ts');

    // Located by element, not by name: the accessible name changes to "Copiado" after the click.
    const button = frame.locator('button');
    await expect(button).toHaveText('Copiar');
    await button.click();
    await expect(button).toHaveText('Copiado');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('const posts = defineCollection({');
    expect(copied).toContain('draft: z.boolean().default(false),');
    expect(copied).not.toContain('src/content.config.ts');
  });

  test('share links carry the canonical URL and copy it', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(PATH);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(/\/blog\/por-que-escolhi-astro$/);

    const share = page.getByRole('group', { name: 'Compartilhar' }).filter({ visible: true });
    const linkedin = share.getByRole('link', { name: /LinkedIn/ });
    await expect(linkedin).toHaveAttribute(
      'href',
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical ?? '')}`,
    );
    await expect(linkedin).toHaveAttribute('target', '_blank');
    const x = share.getByRole('link', { name: /^X/ });
    await expect(x).toHaveAttribute(
      'href',
      new RegExp(`^https://x\\.com/intent/post\\?url=${encodeURIComponent(canonical ?? '')}&text=`),
    );

    const copy = share.locator('button');
    await expect(copy).toHaveText('Copiar link');
    await copy.click();
    await expect(copy).toHaveText('Link copiado');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(canonical);
  });

  test('contact call to action cites the article', async ({ page }) => {
    await page.goto(PATH);
    await page
      .getByRole('region', { name: 'Gostou do artigo?' })
      .getByRole('link', { name: 'Fale comigo' })
      .click();
    const dialog = page.getByRole('dialog', { name: 'Fale comigo' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel(/Mensagem/)).toHaveValue(new RegExp(`Li seu artigo “${TITLE}”`));
  });

  test('has valid BlogPosting structured data', async ({ page }) => {
    await page.goto(PATH);
    const blocks = page.locator('script[type="application/ld+json"]');
    await expect(blocks).toHaveCount(1);
    const data = JSON.parse((await blocks.textContent()) ?? '');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: TITLE,
      datePublished: expect.stringMatching(/^2026-11-24/),
      dateModified: expect.stringMatching(/^2026-11-24/),
      author: { '@type': 'Person', name: 'Davi Brito' },
      url: canonical,
    });
  });

  test('hides the series list and related posts while there is a single post', async ({ page }) => {
    await page.goto(PATH);
    await expect(page.getByText('Série · Construindo este site', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Continue lendo' })).toHaveCount(0);
  });

  test('the sample draft is gone', async ({ page }) => {
    const response = await page.goto('/blog/ola-mundo');
    expect(response?.status()).toBe(404);
  });
});
