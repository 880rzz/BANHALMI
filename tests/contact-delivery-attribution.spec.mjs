import { test, expect } from '@playwright/test';

// Every gateway response is intercepted in memory. These tests send no real email.
const routes = [
  {path:'/contact/', lang:'en'},
  {path:'/hu/kapcsolat/', lang:'hu'},
  {path:'/de-at/kontakt/', lang:'de'}
];
async function fillContact(page, path) {
  await page.goto(path);
  const form = page.locator('form[data-contact-form]');
  await expect(form).toHaveCount(1);
  await form.locator('[name="name"]').fill('Mock Contact');
  await form.locator('[name="email"]').fill('mock-only@example.com');
  await form.locator('[name="message"]').fill('This is a fully mocked browser test; no emails sent.');
  await form.locator('[name="privacy_acknowledged"]').check();
  return form;
}
async function mockConsent(page, allowed) {
  await page.evaluate(value => {
    window.__CONTACT_GA4_MOCK_EVENTS__ = [];
    window.BANHALMI_ANALYTICS = {hasConsent: () => value};
    window.gtag = (...args) => window.__CONTACT_GA4_MOCK_EVENTS__.push(args);
  }, allowed);
}
const events = page => page.evaluate(() => window.__CONTACT_GA4_MOCK_EVENTS__ || []);
for (const locale of routes) {
  test(locale.lang + ': verified contact delivery creates one privacy-safe lead event', async ({page}) => {
    const form = await fillContact(page, locale.path);
    await mockConsent(page, true);
    let intercepted = 0;
    await page.route('**/api/banhalmi-form', async route => {
      intercepted += 1;
      await route.fulfill({status:200, contentType:'application/json',
        body:JSON.stringify({ok:true,adminEmailSent:true,customerEmailSent:true,submissionId:'TEST-ONLY'})});
    });
    await form.locator('[type="submit"]').click();
    await expect.poll(() => intercepted).toBe(1);
    await expect(form.locator('[data-form-note]')).toHaveAttribute('data-state','success');
    const leads = (await events(page)).filter(item => item[0] === 'event' && item[1] === 'generate_lead');
    expect(leads).toEqual([['event','generate_lead',{
      lead_type:'contact_enquiry',form_language:locale.lang,
      event_category:'contact_enquiry',event_label:locale.lang + '_contact'
    }]]);
    expect(JSON.stringify(leads)).not.toMatch(/Mock Contact|mock-only@example\.com|TEST-ONLY|fully mocked/);
  });
  test(locale.lang + ': no lead event when gateway delivery is not confirmed', async ({page}) => {
    const form = await fillContact(page, locale.path);
    await mockConsent(page, true);
    await page.route('**/api/banhalmi-form', route => route.fulfill({
      status:200, contentType:'application/json', body:JSON.stringify({ok:true,adminEmailSent:false})
    }));
    await form.locator('[type="submit"]').click();
    await expect(form.locator('[data-form-note]')).toHaveAttribute('data-state','success');
    expect(await events(page)).toHaveLength(0);
  });
  test(locale.lang + ': no lead event without analytics consent', async ({page}) => {
    const form = await fillContact(page, locale.path);
    await mockConsent(page, false);
    await page.route('**/api/banhalmi-form', route => route.fulfill({
      status:200, contentType:'application/json', body:JSON.stringify({ok:true,adminEmailSent:true,customerEmailSent:true})
    }));
    await form.locator('[type="submit"]').click();
    await expect(form.locator('[data-form-note]')).toHaveAttribute('data-state','success');
    expect(await events(page)).toHaveLength(0);
  });
}
