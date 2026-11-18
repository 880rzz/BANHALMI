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

async function mockAnalyticsConsent(page, consent) {
  // Intercept GA4 in memory. No network analytics requests and no real emails.
  await page.evaluate((allowed) => {
    window.__BANHALMI_TEST_GA4_EVENTS__ = [];
    window.BANHALMI_ANALYTICS = { hasConsent: () => allowed };
    window.gtag = (...args) => window.__BANHALMI_TEST_GA4_EVENTS__.push(args);
  }, consent);
}
async function analyticsEvents(page) {
  return page.evaluate(() => window.__BANHALMI_TEST_GA4_EVENTS__ || []);
}

for (const locale of routes) {
  for (const failure of cases) {
    test(locale.lang + ': reject ' + failure.name + ' without clearing quote', async ({ page }) => {
      const form = await fillValidQuote(page, locale.path);
      await mockAnalyticsConsent(page, true);
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
      expect(await analyticsEvents(page)).toHaveLength(0);
    });
  }

  test(locale.lang + ': clear quote only after fully verified mock delivery', async ({ page }) => {
    const form = await fillValidQuote(page, locale.path);
    await mockAnalyticsConsent(page, true);
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
    const events = await analyticsEvents(page);
    const leadEvents = events.filter(args => args[0] === 'event' && args[1] === 'generate_lead');
    expect(leadEvents).toHaveLength(1);
    const language = locale.lang === 'DE-AT' ? 'de' : locale.lang.toLowerCase();
    expect(leadEvents[0][2]).toEqual({
      lead_type: 'quote_request',
      form_language: language,
      event_category: 'quote_request',
      event_label: language + '_portrait'
    });
    expect(JSON.stringify(leadEvents[0])).not.toMatch(/Regression Client|regression@example\.com|MOCK-ONLY|Mock-only delivery/);
  });
  test(locale.lang + ': no GA4 event without analytics consent after verified quote', async ({ page }) => {
    const form = await fillValidQuote(page, locale.path);
    await mockAnalyticsConsent(page, false);
    await page.route('**/api/banhalmi-form', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, adminEmailSent: true, customerEmailSent: true })
      });
    });
    await form.locator('[type="submit"]').click();
    await expect(form.locator('[data-form-note]')).toHaveAttribute('data-state', 'success');
    expect(await analyticsEvents(page)).toHaveLength(0);
  });

}
