import { test, expect } from '@playwright/test';

const pages = [
  '/', '/hu/', '/de-at/',
  '/requestaquote/', '/hu/ajanlatkeres/', '/de-at/anfrage/',
  '/portrait/', '/hu/portre/', '/de-at/portrait/',
  '/lifestyle/', '/hu/brand/', '/de-at/brand/',
  '/event-photography/', '/hu/rendezvenyfotozas/', '/de-at/eventfotografie/'
];

const personaHomes = [
  { path: '/', artist: '/fine-art/', artistText: 'Artists & Performers' },
  { path: '/hu/', artist: '/hu/muveszi-fotografia/', artistText: 'Művészek és előadók' },
  { path: '/de-at/', artist: '/de-at/fine-art/', artistText: 'Kunstschaffende' }
];

for (const home of personaHomes) {
  test(`artist service remains a first-class homepage door: ${home.path}`, async ({ page }) => {
    await page.goto(home.path);
    await expect(page.locator('[data-persona-path]')).toHaveCount(0);
    const artist = page.locator(`#services a.card[href="${home.artist}"]`);
    await expect(artist).toBeVisible();
    await expect(artist.locator('h3')).toContainText(new RegExp(home.artistText, 'i'));
    await artist.click();
    await expect(page).toHaveURL(new RegExp(home.artist.replace(/\//g, '\\/') + '$'));
    await expect(page.locator('h1')).toBeVisible();
  });
}

for (const path of pages) {
  for (const width of [390, 1440]) {
    test(`native disclosure indicators and activation: ${path} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      const summaries = page.locator('details > summary');
      const count = await summaries.count();
      let checked = 0;
      for (let index = 0; index < count; index += 1) {
        const summary = summaries.nth(index);
        if (!(await summary.isVisible())) continue;
        const details = summary.locator('xpath=..');
        const isFooterDisclosure = await details.evaluate(node => node.matches('.site-footer .footer-accordion'));
        checked += 1;
        if (isFooterDisclosure) {
          // Desktop keeps footer groups open as columns (no mobile +/− affordance).
          // Compact screens use the gold trailing +/− contract in site.css.
          const marker = await summary.evaluate(node => getComputedStyle(node, '::after').content);
          if (width >= 721) {
            expect(['none', 'normal', '""']).toContain(marker);
            await expect(details).toHaveJSProperty('open', true);
            await expect(summary).toHaveAttribute('aria-expanded', 'true');
            await expect(summary).toHaveAttribute('tabindex', '-1');
            await expect(details.locator('a').first()).toBeVisible();
          } else {
            expect(marker).toBe('"+"');
            await expect(details).toHaveJSProperty('open', false);
            await expect(summary).not.toHaveCSS('pointer-events', 'none');
            await expect(summary).toHaveAttribute('aria-expanded', 'false');
            await summary.click();
            await expect(details).toHaveJSProperty('open', true);
            await expect(summary).toHaveAttribute('aria-expanded', 'true');
            const openMarker = await summary.evaluate(node => getComputedStyle(node, '::after').content);
            expect(openMarker).toBe('"−"');
            await summary.focus();
            await page.keyboard.press('Space');
            await expect(details).toHaveJSProperty('open', false);
          }
          continue;
        }
        const assertMarker = async open => {
          const state = await summary.evaluate(node => {
            const pseudo = getComputedStyle(node, '::after').content;
            const explicit = [...node.querySelectorAll('[aria-hidden="true"]')]
              .filter(child => ['+', '−', '–'].includes(child.textContent.trim())).length;
            return { pseudo, explicit };
          });
          expect(state.pseudo).toBe(open ? '"−"' : '"+"');
          expect(state.explicit).toBe(0);
          const expanded = await summary.getAttribute('aria-expanded');
          if (expanded !== null) expect(expanded).toBe(open ? 'true' : 'false');
        };
        const initiallyOpen = await details.evaluate(node => node.open);
        await assertMarker(initiallyOpen);
        if (index % 2 === 0) {
          await summary.click();
        } else {
          await summary.focus();
          await page.keyboard.press('Space');
        }
        await expect(details).toHaveJSProperty('open', !initiallyOpen);
        await assertMarker(!initiallyOpen);
      }
      expect(checked, `${path}: expected visible interactive disclosures`).toBeGreaterThan(0);
    });
  }
}
