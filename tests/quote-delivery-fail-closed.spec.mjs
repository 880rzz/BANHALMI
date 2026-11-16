import { test, expect } from '@playwright/test';

// Every gateway response is intercepted. These tests must never send real email.
const routes = [
  { path: '/requestaquote/', lang: 'EN' },
  { path: '/hu/ajanlatkeres/', lang: 'HU' },
  { path: '/de-at/anfrage/', lang: 'DE-AT' }
];
const cases = [
  { name: 'HTTP failure with misleading success flags', status: 500, body: { ok: true, adminEmailSent: true, customerEmailSent: true } },
  { name: 'gateway failure with misleading success flags', status: 200, body: { ok: false, adminEmailSent: true, customerEmailSent: true } },
  { name: 'partial email delivery', status: 200, body: { ok: true, adminEmailSent: true, customerEmailSent: false } }
];

async function fillValidQuote(page, path) {
  await page.goto(path);
  const details = page.locator('#quote-calculator');
  if (!await details.evaluate(node => node.open)) await page.locator('#quote-calculator > summary').click();
  await expect(page.locator('[data-pricing-ready="true"]')).toHaveCount(1, { timeout: 15000 });
  const form = page.locator('form[data-smart-quote]');
  await expect(form).toHaveCount(1);
  await form.locator('input[name="category"][value="individual"]').check();
  await form.locator('input[name="individual_mode"][value="headshotcv"]').check();
  await form.locator('[name="name"]').fill('Regression Client');
  await form.locator('[name="email"]').fill('regression@example.com');
  await form.locator('[name="customer_type"]').selectOption('private');
  await form.locator('[name="billing_country"]').selectOption('AT');
  await form.locator('[name="message"]').fill('Mock-only delivery verification. Do not contact.');
  await form.locator('[name="date_coordination_requested"]').check();
  await form.locator('[name="privacy_acknowledged"]').check();
  return form;
}

for (const locale of routes) {
  for (const failure of cases) {
    test(locale.lang + ': reject ' + failure.name + ' without clearing quote', async ({ page }) => {
      const form = await fillValidQuote(page, locale.path);
      let intercepted = 0;
      await page.route('**/api/banhalmi-form', async route => {
        intercepted += 1;
        await route.fulfill({
          status: failure.status,
          contentType: 'application/json',
          body: JSON.stringify(failure.body)
        });
      });
      await form.locator('[type="submit"]').click();
      await expect.poll(() => intercepted).toBe(1);
      await expect(form.locator('[data-form-note]')).toHaveAttribute('data-state', 'error');
      await expect(form).toHaveAttribute('data-delivery-verified', 'false');
      await expect(form.locator('[name="name"]')).toHaveValue('Regression Client');
      await expect(form.locator('[name="email"]')).toHaveValue('regression@example.com');
      const draft = await form.evaluate(node => {
        const lang = node.getAttribute('data-lang') || document.documentElement.lang || 'en';
        return sessionStorage.getItem('banhalmi_quote_draft_v1:' + lang);
      });
      expect(draft).toContain('Regression Client');
    });
  }

  test(locale.lang + ': clear quote only after fully verified mock delivery', async ({ page }) => {
    const form = await fillValidQuote(page, locale.path);
    let intercepted = 0;
    await page.route('**/api/banhalmi-form', async route => {
      intercepted += 1;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, adminEmailSent: true, customerEmailSent: true, submissionId: 'MOCK-ONLY' })
      });
    });
    await form.locator('[type="submit"]').click();
    await expect.poll(() => intercepted).toBe(1);
    await expect(form.locator('[data-form-note]')).toHaveAttribute('data-state', 'success');
    await expect(form.locator('[name="name"]')).toHaveValue('');
    await expect(form.locator('[name="email"]')).toHaveValue('');
    await expect(form.locator('input[name="category"]:checked')).toHaveCount(0);
    const draft = await form.evaluate(node => {
      const lang = node.getAttribute('data-lang') || document.documentElement.lang || 'en';
      return sessionStorage.getItem('banhalmi_quote_draft_v1:' + lang);
    });
    expect(draft).toBeNull();
  });
}
