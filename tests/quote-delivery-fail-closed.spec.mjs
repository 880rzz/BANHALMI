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

// Verify the site's real service-to-estimate entry points, without submitting anything.
const journeys = [
  { locale: 'EN', portrait: '/portrait/', brand: '/lifestyle/', event: '/event-photography/', quote: '/requestaquote/', currency: 'EUR' },
  { locale: 'DE-AT', portrait: '/de-at/portrait/', brand: '/de-at/brand/', event: '/de-at/eventfotografie/', quote: '/de-at/anfrage/', currency: 'EUR' },
  { locale: 'HU', portrait: '/hu/portre/', brand: '/hu/brand/', event: '/hu/rendezvenyfotozas/', quote: '/hu/ajanlatkeres/', currency: 'HUF' }
];
async function assertEstimate(page, currency, euro) {
  const form = page.locator('form[data-smart-quote]');
  await expect(page.locator('[data-pricing-ready="true"]')).toHaveCount(1, { timeout: 15000 });
  await expect(page.locator('#quote-calculator')).toHaveJSProperty('open', true);
  const result = await form.evaluate(node => window.BANHALMI_QUOTE.calculate(node));
  expect(result.gross).toBe(euro);
  expect(result.displayCurrency).toBe(currency);
  expect(result.displayGross).toBe(currency === 'HUF' ? euro * 400 : euro);
  await expect(form.locator('[name="location"]')).toHaveValue('vienna');
}
for (const j of journeys) {
  test(j.locale + ': portrait and branding links select the advertised package', async ({ page }) => {
    await page.route('**/api/banhalmi-form', route => route.abort());
    await page.goto(j.portrait);
    await page.locator('[data-service-custom-quote]').click();
    await expect(page).toHaveURL(/service=brand&brand_duration=brand60#quote-calculator$/);
    await assertEstimate(page, j.currency, 499);
    const other = j.currency === 'HUF' ? journeys[0] : journeys[2];
    await page.locator('.lang-switch:not(.lang-switch--footer) a[hreflang="' + (other.currency === 'HUF' ? 'hu-HU' : 'en') + '"]').first().click();
    await expect(page).toHaveURL(new RegExp(other.quote+'\\?service=brand&brand_duration=brand60#quote-calculator$'));
    await assertEstimate(page, other.currency, 499);
    await page.goto(j.portrait);
    await page.locator('details[data-pricing-disclosure="service"] > summary').click();
    await page.locator('details[data-pricing-disclosure="service"] a[href*="portrait_mode=headshotcv"]').click();
    await assertEstimate(page, j.currency, 120);
    await page.goto(j.brand);
    await page.locator('[data-service-custom-quote]').click();
    await expect(page).toHaveURL(/service=brand&brand_duration=brand120#quote-calculator$/);
    await assertEstimate(page, j.currency, 790);
  });
  test(j.locale + ': Business, C-Level and private event estimates remain distinct', async ({ page }) => {
    await page.route('**/api/banhalmi-form', route => route.abort());
    await page.goto(j.event);
    await page.locator('[data-service-custom-quote]').click();
    await assertEstimate(page, j.currency, 490);
    await page.goto(j.event);
    await page.locator('details[data-pricing-disclosure="service"] > summary').click();
    await page.locator('details[data-pricing-disclosure="service"] a[href*="event_duration=event60"]').click();
    await expect(page).toHaveURL(/service=event&event_duration=event60#quote-calculator$/);
    await assertEstimate(page, j.currency, 590);
    const other = j.currency === 'HUF' ? journeys[0] : journeys[2];
    await page.locator('.lang-switch:not(.lang-switch--footer) a[hreflang="' + (other.currency === 'HUF' ? 'hu-HU' : 'en') + '"]').first().click();
    await expect(page).toHaveURL(new RegExp(other.quote+'\\?service=event&event_duration=event60#quote-calculator$'));
    await assertEstimate(page, other.currency, 590);
    await page.locator('[data-smart-quote] input[name="event_duration"][value="eventFullDay"]').check();
    await expect(page).toHaveURL(/service=event&event_duration=eventFullDay#quote-calculator$/);
    await assertEstimate(page, other.currency, 2490);
    const returnLanguage = j.locale === 'DE-AT' ? 'de-AT' : j.locale === 'HU' ? 'hu-HU' : 'en';
    await page.locator('.lang-switch a[hreflang="' + returnLanguage + '"]').first().click();
    await expect(page).toHaveURL(new RegExp(j.quote+'\\?service=event&event_duration=eventFullDay#quote-calculator$'));
    await assertEstimate(page, j.currency, 2490);
    await page.locator('[data-smart-quote] input[name="category"][data-private-event="true"]').check();
    await expect(page).toHaveURL(/service=private-event(?:#quote-calculator)?$/);
    await expect(page.locator('[data-smart-quote] input[name="event_duration"][value="event120"]')).toBeChecked();
    await page.goto(j.quote + '?service=private-event&event_duration=event60');
    await expect(page.locator('[data-smart-quote] input[name="category"][data-private-event="true"]')).toBeChecked();
    await expect(page.locator('[data-smart-quote] input[name="event_duration"][value="event120"]')).toBeChecked();
  });
}

const guidedQuotes = [
  { path: '/requestaquote/', lang: 'EN', label: '60-minute guided portrait', duration: '1 hour', count: '1 retouched image', amount: /€\s*420(?:\.00)?/, decline: 'Only necessary' },
  { path: '/hu/ajanlatkeres/', lang: 'HU', label: '60 perces vezetett portré', duration: '1 óra', count: '1 retusált kép', amount: /168\s*000\s*Ft/, equivalent: /420,00\s*EUR/, decline: 'Csak szükséges' },
  { path: '/de-at/anfrage/', lang: 'DE-AT', label: 'Geführtes 60-Minuten-Porträt', duration: '1 Stunde', count: '1 retuschiertes Bild', amount: /(?:€\s*420[,.]00|420(?:[,.]00)?\s*€)/, decline: 'Nur notwendige' }
];

async function openGuidedQuote(page, fixture) {
  await page.goto(fixture.path + '?service=portrait&portrait_mode=guided60#quote-calculator');
  const form = page.locator('form[data-smart-quote]');
  await expect(form).toHaveAttribute('data-pricing-ready', 'true');
  await expect(form.locator('input[name="individual_mode"][value="guided60"]')).toBeChecked();
  await page.keyboard.press('Tab'); // Load the production deferred first-interaction runtime.
  await expect(page.locator('.cookie.show')).toBeVisible();
  await form.locator('[name="location"]').selectOption('budapest');
  return form;
}

async function mockOnlyQuoteNetwork(page, onSubmit = null) {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin === 'http://127.0.0.1:4173') {
      if (route.request().method() === 'GET') return route.continue();
      throw new Error('Unexpected request to the isolated local site');
    }
    if (url.pathname === '/api/banhalmi-form' && onSubmit) {
      return onSubmit(route);
    }
    return route.abort();
  });
}

for (const fixture of guidedQuotes) {
  test(fixture.lang + ': portrait option, gross estimate and consent layout at 320–1440 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 667 });
    await mockOnlyQuoteNetwork(page);
    const form = await openGuidedQuote(page, fixture);
    const recap = form.locator('[data-quote-before-send]');
    const amount = recap.locator('[data-quote-before-send-amount]');
    const option = form.locator('[data-quote-option-price="guided60"]');
    await expect(option).toContainText(fixture.amount);
    await expect(recap).toContainText(fixture.label);
    await expect(recap).toContainText(fixture.duration);
    await expect(recap).toContainText(fixture.count);
    const budget = form.locator('[name="budget"]');
    await expect(budget).toHaveValue('');
    await expect(budget).not.toHaveAttribute('required', /.*/);
    await expect(budget).not.toHaveAttribute('placeholder', /.*/);
    await expect(budget).toHaveAttribute('aria-describedby', 'quote-budget-help');
    for (const width of [320, 375, 390, 430, 768, 900, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: width <= 430 ? 667 : 900 });
      // The deep link also performs an automatic entrance scroll. Center the
      // actual amount after any pending motion instead of sampling mid-scroll.
      await expect.poll(() => amount.evaluate(node => {
        node.scrollIntoView({ block: 'center', behavior: 'instant' });
        const a = node.getBoundingClientRect();
        const c = document.querySelector('.cookie.show').getBoundingClientRect();
        const floats = document.querySelector('[data-quote-summary]');
        const hit = document.elementFromPoint((a.left + a.right) / 2, (a.top + a.bottom) / 2);
        return a.top >= 0 && a.bottom <= innerHeight && a.left >= 0 && a.right <= innerWidth &&
          node.contains(hit) &&
          (a.bottom <= c.top || a.right <= c.left || a.left >= c.right) &&
          (innerWidth > 900 || getComputedStyle(floats).position === 'static');
      }), { message: 'visible estimate does not compete with the cookie prompt at ' + width }).toBe(true);
      await expect(amount).toBeInViewport({ ratio: 1 });
      await expect(amount).toContainText(fixture.amount);
      await expect(amount.locator('[data-currency]')).toHaveCount(fixture.equivalent ? 2 : 1);
    }
    await page.setViewportSize({ width: 390, height: 667 });
    const original = await amount.textContent();
    await budget.fill('50000');
    await expect(amount).toHaveText(original);
    await budget.clear();
    // Consent control remains actionable, then smaller visual space + input
    // focus simulate an on-screen keyboard without claiming native iOS testing.
    await page.locator('.cookie.show [data-decline]').click();
    await expect(page.locator('.cookie.show')).toHaveCount(0);
    await budget.focus();
    await page.setViewportSize({ width: 390, height: 380 });
    await expect(page.locator('[data-quote-summary]')).toHaveCSS('position', 'static');
    await budget.blur();
    await expect(page.locator('[data-quote-summary]')).toHaveCSS('position', 'fixed');
    await amount.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await expect(amount).toBeInViewport({ ratio: 1 });
    if (fixture.equivalent) await expect(amount.locator('[data-currency="EUR"]')).toContainText(fixture.equivalent);
  });

  test(fixture.lang + ': blank-budget portrait sends the chosen estimate and preserves receipt during an edit', async ({ page }) => {
    let submitted, completeDelivery;
    const delivery = new Promise(resolve => { completeDelivery = resolve; });
    await mockOnlyQuoteNetwork(page, async route => {
      submitted = route.request().postDataJSON();
      await delivery;
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, adminEmailSent: true, customerEmailSent: true, submissionId: 'MOCK-GUIDED' }) });
    });
    const form = await openGuidedQuote(page, fixture);
    await page.locator('.cookie.show [data-decline]').click();
    await form.locator('[name="name"]').fill('Regression Client');
    await form.locator('[name="email"]').fill('portrait@example.invalid');
    await form.locator('[name="customer_type"]').selectOption('private');
    await form.locator('[name="billing_country"]').selectOption('HU');
    await form.locator('[name="message"]').fill('Mock-only portrait test.');
    await form.locator('[name="date_coordination_requested"]').check();
    await form.locator('[name="privacy_acknowledged"]').check();
    await expect(form.locator('[data-quote-before-send]')).toContainText(fixture.amount);
    await form.locator('[type="submit"]').click();
    await expect.poll(() => submitted?.packageLabel).toBe(fixture.label);
    expect(submitted).toMatchObject({
      budget: '', categoryCode: 'individual', packageCode: 'guided60', duration: fixture.duration,
      retouchedImagesTotal: '1', grossAmount: '420', vatRate: '20%',
      displayCurrency: fixture.lang === 'HU' ? 'HUF' : 'EUR',
      displayGrossAmount: fixture.lang === 'HU' ? '168000' : '420'
    });
    expect(submitted.category).not.toMatch(/Executive/i);
    await form.locator('[name="retouched_images"]').fill('2');
    await expect(form.locator('[data-quote-before-send]')).not.toContainText(fixture.amount);
    completeDelivery();
    const receipt = form.locator('[data-form-note][data-state="success"]');
    await expect(receipt).toContainText(fixture.label);
    await expect(receipt).toContainText(fixture.duration);
    await expect(receipt).toContainText(fixture.count);
    await expect(receipt).toContainText(fixture.amount);
    await expect(receipt).not.toContainText('guided60');
  });
}

for (const fixture of guidedQuotes) {
  test(fixture.lang + ': PDF uses the portrait name, not its visible base-price caption', async ({ page }) => {
    await mockOnlyQuoteNetwork(page);
    await page.addInitScript(() => {
      window.__quotePdfText = [];
      const original = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (text, ...args) {
        window.__quotePdfText.push(text);
        return original.call(this, text, ...args);
      };
    });
    const form = await openGuidedQuote(page, fixture);
    await page.locator('.cookie.show [data-decline]').click();
    await form.locator('[name="name"]').fill('PDF Fixture');
    await form.locator('[name="email"]').fill('portrait@example.invalid');
    await form.locator('[name="customer_type"]').selectOption('private');
    await form.locator('[name="billing_country"]').selectOption('HU');
    await form.locator('[name="message"]').fill('Mock-only local PDF test.');
    await form.locator('[name="date_coordination_requested"]').check();
    await form.locator('[name="privacy_acknowledged"]').check();
    await form.locator('[name="retouched_images"]').fill('2');
    const [pdf] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('[data-download-quote-pdf]').click()
    ]);
    expect(pdf.suggestedFilename()).toMatch(/\.pdf$/);
    const words = await page.evaluate(() => window.__quotePdfText);
    const packageLabel = { EN: 'Package', HU: 'Csomag', 'DE-AT': 'Paket' }[fixture.lang];
    expect(words[words.indexOf(packageLabel) + 1]).toBe(fixture.label);
    // The final estimate includes the second retouch; the unselected one-image
    // package's base-price caption must not leak onto a separate PDF line.
    const updated = fixture.lang === 'HU' ? /182\s*000\s*Ft/ : /€\s*455[.,]00/;
    expect(words.some(line => updated.test(line))).toBe(true);
    expect(words.some(line => fixture.amount.test(line))).toBe(false);
  });
}
