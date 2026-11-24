import { expect, test } from '@playwright/test';

const PLACEHOLDER = /\[[A-ZÀ-Ú ]{3,}\]|TODO|Em breve/;

test.describe('about page', () => {
  test('renders the sections in the approved order', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oi, eu sou o Davi.');
    await expect(page.getByRole('main')).toContainText(
      'Há mais de 3 anos construo plataformas SaaS B2B na AX4B',
    );
    await expect(page.locator('main h2')).toHaveText([
      'Como comecei',
      'Experiência',
      'Ferramentas do dia a dia',
      'Formação e idiomas',
      'Vamos trabalhar juntos?',
    ]);
    await expect(page.getByRole('region', { name: 'Como comecei' }).locator('p')).toHaveCount(3);
    await expect(page.getByRole('main')).not.toContainText(PLACEHOLDER);
  });

  test('experience lists every job with highlights, then the study projects', async ({ page }) => {
    await page.goto('/about');
    const experience = page.getByRole('region', { name: 'Experiência' });
    await expect(experience.getByRole('heading', { level: 3 })).toHaveText([
      'Full Stack Software Engineer · AX4B',
      'Full Stack Python Developer · AX4B',
      'Projetos de estudo · Autodidata',
    ]);
    await expect(
      experience.getByRole('listitem').filter({ hasText: 'AX4B' }).first().locator('ul li'),
    ).toHaveCount(6);
    await expect(experience).toContainText('2020 — 2023');
  });

  test('tools and education are label/value lists', async ({ page }) => {
    await page.goto('/about');
    const tools = page.getByRole('region', { name: 'Ferramentas do dia a dia' });
    await expect(tools.locator('dt')).toHaveText([
      'Linguagens',
      'Back-end',
      'Front-end',
      'Dados',
      'Arquitetura',
      'Cloud e DevOps',
      'IA no desenvolvimento',
    ]);
    await expect(tools.locator('dd').first()).toHaveText('TypeScript, JavaScript, Python, SQL');

    const education = page.getByRole('region', { name: 'Formação e idiomas' });
    await expect(education).toContainText('out 2026 — em curso');
    await expect(education).toContainText('Tecnólogo em Análise e Desenvolvimento de Sistemas · UniCesumar');
    await expect(education).toContainText('Português nativo, inglês intermediário');
  });

  test('CV button and photo stay hidden while their files do not exist', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('link', { name: /Baixar CV/ })).toHaveCount(0);
    await expect(page.getByRole('main').locator('img')).toHaveCount(0);
  });

  test('closing box opens the contact dialog with the About message', async ({ page }) => {
    await page.goto('/about');
    await page
      .getByRole('region', { name: 'Vamos trabalhar juntos?' })
      .getByRole('link', { name: 'Fale comigo' })
      .click();
    const dialog = page.getByRole('dialog', { name: 'Fale comigo' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel(/Mensagem/)).toHaveValue(/Vi seu perfil/);
  });
});
