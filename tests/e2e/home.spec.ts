import { expect, test } from '@playwright/test';

const PLACEHOLDER = /\[[A-ZÀ-Ú ]{3,}\]|TODO|Em breve/;

test.describe('home page', () => {
  test('renders the sections in the approved order', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Construo software de ponta a ponta e escrevo sobre o caminho.',
    );
    await expect(page.getByRole('main').getByText('Aberto a projetos PJ e freelas')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute('href', '/projects');

    await expect(page.locator('main h2')).toHaveText([
      'Agora',
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

  test('"Agora" panel links only to published pages', async ({ page }) => {
    await page.goto('/');
    const panel = page.getByRole('region', { name: 'Agora' });
    await expect(panel.locator('time')).toHaveText('2026-11-23');
    await expect(panel.locator('dt')).toHaveText(['Construindo', 'Escrevendo', 'Estudando', 'Aprendendo']);
    // Prumo is still a draft: its name shows as text, never as a link to a 404.
    await expect(panel.getByText('Prumo')).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Prumo' })).toHaveCount(0);
    await expect(panel.getByRole('link', { name: /Página Agora/ })).toHaveAttribute('href', '/now');
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
  test('shows the same data as the Home panel', async ({ page }) => {
    await page.goto('/now');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Agora');
    await expect(page.locator('main time')).toHaveAttribute('datetime', '2026-11-23');
    await expect(page.locator('main dt')).toHaveText([
      'Construindo',
      'Escrevendo',
      'Estudando',
      'Aprendendo',
    ]);
    await expect(page.getByRole('main')).toContainText('Astro, construindo este site com ele');
    await expect(page.getByRole('main').getByRole('link', { name: 'Prumo' })).toHaveCount(0);
    await expect(page.getByRole('main')).not.toContainText(PLACEHOLDER);
  });
});
