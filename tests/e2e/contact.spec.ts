import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('contact dialog', () => {
  test('opens from the header with a message for the page', async ({ page }) => {
    await page.goto('/blog');
    const trigger = page.getByRole('banner').getByRole('link', { name: 'Contato' });
    await trigger.click();

    const dialog = page.getByRole('dialog', { name: 'Fale comigo' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel(/Mensagem/)).toHaveValue(/Vim pelo seu blog/);
    await expect(dialog.getByLabel(/Mensagem/)).toBeFocused();
    await expect(dialog).toContainText('Aberto a projetos PJ e freelas');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('links carry the (edited) message', async ({ page }) => {
    await page.goto('/about');
    await page.getByRole('banner').getByRole('link', { name: 'Contato' }).click();
    const dialog = page.getByRole('dialog');

    const whatsapp = dialog.getByRole('link', { name: /WhatsApp/ });
    await expect(whatsapp).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\/5585984662837\?text=Ol%C3%A1%2C%20Davi!%20Vi%20seu%20perfil/,
    );

    await dialog.getByLabel(/Mensagem/).fill('Proposta de freela');
    await expect(whatsapp).toHaveAttribute('href', 'https://wa.me/5585984662837?text=Proposta%20de%20freela');
    await expect(dialog.getByRole('link', { name: /Email/ })).toHaveAttribute(
      'href',
      'mailto:brit.davi122@gmail.com?subject=Contato%20pelo%20site%20%E2%80%94%20Sobre&body=Proposta%20de%20freela',
    );
    // No scheduling link configured yet.
    await expect(dialog.getByRole('link', { name: /Agendar/ })).toHaveCount(0);
  });

  test('copies the email with feedback', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    await page.getByRole('banner').getByRole('link', { name: 'Contato' }).click();
    await page.getByRole('button', { name: 'Copiar email' }).click();

    await expect(page.getByRole('status')).toHaveText('Email copiado');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('brit.davi122@gmail.com');
  });

  test('closes on the close button and on the backdrop', async ({ page }) => {
    await page.goto('/');
    const open = () => page.getByRole('banner').getByRole('link', { name: 'Contato' }).click();
    const dialog = page.getByRole('dialog');

    await open();
    await dialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(dialog).toBeHidden();

    await open();
    await page.mouse.click(5, 5);
    await expect(dialog).toBeHidden();
  });

  test('is accessible when open, in both themes', async ({ page }) => {
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto('/');
      await page.getByRole('banner').getByRole('link', { name: 'Contato' }).click();
      const results = await new AxeBuilder({ page }).include('#contact-dialog').analyze();
      expect(results.violations).toEqual([]);
    }
  });

  test('works without JavaScript as a mailto link', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('http://localhost:4321/');
    await expect(page.getByRole('banner').getByRole('link', { name: 'Contato' })).toHaveAttribute(
      'href',
      'mailto:brit.davi122@gmail.com',
    );
    await context.close();
  });
});
