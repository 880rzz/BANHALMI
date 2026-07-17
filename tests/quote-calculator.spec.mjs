import { test, expect } from '@playwright/test';

const routes = [
  { path: '/requestaquote/', lang: 'en' },
  { path: '/hu/ajanlatkeres/', lang: 'hu' },
  { path: '/de-at/anfrage/', lang: 'de' }
];
const viewports = [
  { width: 375, height: 900 },
  { width: 768, height: 1000 },
  { width: 1440, height: 1000 }
];

function amount(text) {
  const cleaned = String(text).replace(/[^0-9,.-]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.');
  return Number.parseFloat(cleaned);
}

for (const route of routes) {
  for (const viewport of viewports) {
    test(`quote estimate updates on ${route.path} at ${viewport.width}px`, async ({ page }) => {
      const errors = [];
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
      await page.setViewportSize(viewport);
      await page.goto(route.path);
      const root = page.locator('[data-quote-root]');
      await expect(root).toHaveCount(1);
      await expect(page.locator('[data-pricing-ready="true"]')).toHaveCount(1, { timeout: 10000 });
      const gross = root.locator('[data-estimate-gross]');
      const net = root.locator('[data-estimate-net]');
      const vat = root.locator('[data-estimate-vat]');
      await expect(gross).not.toContainText(/€0|—|Calculating|Számítás|Berechnung/);
      await expect(net).not.toContainText(/—|Calculating|Számítás|Berechnung/);
      await expect(vat).not.toContainText(/—|Calculating|Számítás|Berechnung/);
      const before = amount(await gross.textContent());
      expect(before).toBeGreaterThan(0);
      const beforeHidden = await page.locator('input[name="estimate_gross"]').inputValue();
      await page.locator('input[name="retouched_images"]').fill('3');
      await expect.poll(async () => page.locator('input[name="estimate_gross"]').inputValue()).not.toBe(beforeHidden);
      const after = amount(await gross.textContent());
      expect(after).toBeGreaterThan(0);
      expect(amount(await page.locator('input[name="estimate_gross"]').inputValue())).toBeCloseTo(after, 1);
      await expect(page.locator('body')).not.toContainText(/NaN|undefined/);
      expect(errors).toEqual([]);
    });
  }
}
