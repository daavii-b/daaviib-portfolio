import { expect, test } from '@playwright/test';

const PLACEHOLDER = /\[[^\]\n]{3,}\]|TODO|[Ee]m breve/;
const STATUS =
  'Construindo o Prumo, escrevendo a série Construindo este site e aprendendo Astro com ela. Na faculdade, ADS na UniCesumar, com foco em algoritmos e IA aplicada ao desenvolvimento (SDD e RAG).';

test.describe('home page', () => {
  test('renders the sections in the approved order', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Construo software de ponta a ponta e escrevo sobre o caminho.',
    );
    await expect(page.getByRole('main').getByText('Aberto a projetos PJ e freelas')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute('href', '/projects');

    await expect(page.locator('main h2')).toHaveText([
      'Agora · 2026-11-23',
      'Projetos em destaque',
      'Últimos artigos',
      'Experiência',
      'Vamos conversar?',
    ]);
    await expect(
      page.getByRole('region', { name: 'Últimos artigos' }).getByRole('link', {
        name: 'Por que escolhi Astro para este site',
      }),
    ).toHaveAttribute('href', '/blog/por-que-escolhi-astro');
    await expect(page.getByRole('main')).not.toContainText(PLACEHOLDER);
  });

  test('"Agora" block is a sentence that links only to published pages', async ({ page }) => {
    await page.goto('/');
    const block = page.getByRole('region', { name: /^Agora/ });
    await expect(block.getByRole('heading', { level: 2 })).toHaveText('Agora · 2026-11-23');
    await expect(block.locator('time')).toHaveAttribute('datetime', '2026-11-23');
    await expect(block.locator('p')).toHaveText(STATUS);
    // Prumo is still a draft: its name shows as text, never as a link to a 404.
    await expect(block.getByRole('link', { name: 'Prumo' })).toHaveCount(0);
    await expect(block.getByRole('link', { name: 'Construindo este site' })).toHaveAttribute(
      'href',
      '/projects/este-site',
    );
    await expect(block.getByRole('link', { name: /Página Agora/ })).toHaveAttribute('href', '/now');
    await expect(block.locator('dl, dt')).toHaveCount(0);
  });

  test('hero spans the content width with the "Agora" block below it', async ({ page }) => {
    await page.goto('/');
    const hero = await page.getByRole('heading', { level: 1 }).boundingBox();
    const block = await page.getByRole('region', { name: /^Agora/ }).boundingBox();
    const featured = await page.getByRole('region', { name: 'Projetos em destaque' }).boundingBox();
    expect(hero && block && featured).toBeTruthy();
    if (!hero || !block || !featured) return;
    expect(block.y).toBeGreaterThan(hero.y + hero.height);
    expect(Math.abs(block.x - featured.x)).toBeLessThanOrEqual(1);
    // Wide screens: the heading uses the content width, not a 7/12 column.
    if (featured.width > 900) expect(hero.width).toBeGreaterThan(featured.width * 0.8);
  });

  test('featured projects and work experience', async ({ page }) => {
    await page.goto('/');
    const projects = page.getByRole('region', { name: 'Projetos em destaque' });
    await expect(projects.getByRole('link', { name: 'Este site' })).toHaveAttribute(
      'href',
      '/projects/este-site',
    );

    const experience = page.getByRole('region', { name: 'Experiência' });
    await expect(experience.getByRole('heading', { level: 3 })).toHaveText([
      'Full Stack Software Engineer · AX4B',
      'Full Stack Python Developer · AX4B',
    ]);
    await expect(experience).toContainText('ago 2023 — atual');
    await expect(experience).toContainText('mai 2023 — ago 2023');
    await expect(experience).toContainText('reduzi a latência da API em 70–90%');
    await expect(experience).not.toContainText('Projetos de estudo');
    await expect(experience.getByRole('link', { name: /Sobre mim/ })).toHaveAttribute('href', '/about');
  });

  test('closing box opens the contact dialog', async ({ page }) => {
    await page.goto('/');
    const closing = page.getByRole('region', { name: 'Vamos conversar?' });
    await closing.getByRole('link', { name: 'Fale comigo' }).click();
    await expect(page.getByRole('dialog', { name: 'Fale comigo' })).toBeVisible();
  });

  test('closing box copies the email with confirmation', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    const closing = page.getByRole('region', { name: 'Vamos conversar?' });
    const button = closing.getByRole('button', { name: /Copiar email/ });
    await expect(button).toContainText('brit.davi122@gmail.com');

    await button.click();
    await expect(closing.getByRole('status')).toHaveText('Email copiado');
    await expect(button).toHaveAttribute('data-copied', '');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('brit.davi122@gmail.com');
  });
});

test.describe('now page', () => {
  test('header, status sentence and one section per item', async ({ page }) => {
    await page.goto('/now');
    const main = page.getByRole('main');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Agora');
    await expect(main.getByRole('link', { name: 'now', exact: true })).toHaveAttribute(
      'href',
      'https://nownownow.com/about',
    );
    await expect(main.getByText('Atualizado em')).toContainText('23 de novembro de 2026');
    await expect(main.locator('header time')).toHaveAttribute('datetime', '2026-11-23');
    await expect(main.getByRole('link', { name: 'ver linha do tempo' })).toHaveAttribute('href', '#timeline');
    await expect(main.getByText(STATUS, { exact: true })).toBeVisible();

    await expect(main.locator('h2')).toHaveText([
      'Prumo',
      'A série Construindo este site',
      'ADS na UniCesumar',
      'Astro',
      'Linha do tempo',
    ]);
    const prumo = page.getByRole('region', { name: 'Prumo' });
    await expect(prumo).toContainText('Construindo');
    await expect(prumo.getByRole('link')).toHaveCount(0);

    const series = page.getByRole('region', { name: 'A série Construindo este site' });
    await expect(series.locator('ol li')).toHaveText(['01Por que escolhi Astro para este site']);
    await expect(series.getByRole('link', { name: 'Por que escolhi Astro para este site' })).toHaveAttribute(
      'href',
      '/blog/por-que-escolhi-astro',
    );
    await expect(series).not.toContainText('i18n desde o primeiro dia');

    await expect(page.getByRole('region', { name: 'Astro' }).getByRole('link')).toHaveAttribute(
      'href',
      '/blog/por-que-escolhi-astro',
    );
    await expect(main).not.toContainText(PLACEHOLDER);
  });

  test('status sentence is the same as on the Home page', async ({ page }) => {
    await page.goto('/');
    const home = await page
      .getByRole('region', { name: /^Agora/ })
      .locator('p')
      .innerHTML();
    await page.goto('/now');
    const sentence = page.getByRole('main').getByText(STATUS, { exact: true });
    expect(await sentence.innerHTML()).toBe(home);
  });

  test('timeline lists the updates newest first with spoken change kinds', async ({ page }) => {
    await page.goto('/now');
    const timeline = page.getByRole('region', { name: 'Linha do tempo' });
    await expect(timeline).toHaveAttribute('id', 'timeline');
    await expect(timeline.getByRole('list', { name: 'Legenda' }).getByRole('listitem')).toHaveText([
      '+entrou',
      '~mudou',
      '−saiu',
    ]);
    const entries = timeline.locator('ol > li');
    await expect(entries).toHaveCount(1);
    await expect(entries.first().locator('time')).toHaveText('23 nov 2026');
    await expect(entries.first()).toContainText('atual');
    await expect(entries.first()).toContainText('Primeira versão desta página.');
    // Signs are hidden from assistive technology; the kind is spoken as a word.
    await expect(entries.first().locator('ul')).toMatchAriaSnapshot(`
      - list:
        - listitem: "entrou: Construindo o Prumo"
        - listitem: "entrou: Escrevendo a série Construindo este site"
        - listitem: "entrou: Estudando ADS na UniCesumar, algoritmos e IA"
        - listitem: "entrou: Aprendendo Astro"
    `);

    // The timeline closes the page: nothing follows it inside the article.
    expect(await timeline.evaluate((el) => el.nextElementSibling)).toBeNull();
  });

  test('ships no script of its own', async ({ page }) => {
    const scripts = async (path: string) => {
      await page.goto(path);
      return page
        .locator('script')
        .evaluateAll((els) => els.map((el) => (el as HTMLScriptElement).src || el.textContent?.length || 0));
    };
    expect(await scripts('/now')).toEqual(await scripts('/nao-existe'));
  });
});
