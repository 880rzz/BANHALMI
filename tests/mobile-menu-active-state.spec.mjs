import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true
});

const cases = [
  { route: '/about/', label: 'Oeuvre' },
  { route: '/hu/eletmu/', label: 'Életmű' },
  { route: '/de-at/werk/', label: 'Werk' }
];

for (const entry of cases) {
  test(`production mega menu exposes the active oeuvre route on ${entry.route}`, async ({ page }) => {
    const jsErrors = [];
    page.on('pageerror', error => jsErrors.push(error.message));

    await page.goto(entry.route, { waitUntil: 'domcontentloaded' });

    const menuButton = page.locator('.menu-btn');
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    const menu = page.locator('#bn-mega-menu[aria-hidden="false"]');
    await expect(menu).toBeVisible();

    const active = menu.locator('a.bn-mega-link[aria-current="page"]');
    await expect(active).toHaveCount(1);
    await expect(active).toBeVisible();
    await expect(active).toHaveText(entry.label);
    await expect(active).toHaveClass(/\bactive\b/);

    const styles = await active.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderTopWidth: style.borderTopWidth,
        borderRightWidth: style.borderRightWidth,
        borderBottomWidth: style.borderBottomWidth,
        borderLeftWidth: style.borderLeftWidth,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        textDecorationLine: style.textDecorationLine,
        textDecorationColor: style.textDecorationColor
      };
    });

    // Stage 65: active/current is indicated by a vivid accessible gold underline,
    // never by the old rounded/pill frame. Keep this regression guard aligned
    // with the production design token --bn-menu-gold: #D3B85A.
    expect(styles.color).toBe('rgb(211, 184, 90)');
    expect(styles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(styles.borderTopWidth).toBe('0px');
    expect(styles.borderRightWidth).toBe('0px');
    expect(styles.borderBottomWidth).toBe('0px');
    expect(styles.borderLeftWidth).toBe('0px');
    expect(styles.borderRadius).toBe('0px');
    expect(styles.boxShadow).toBe('none');
    expect(styles.textDecorationLine).toContain('underline');
    expect(styles.textDecorationColor).toBe('rgb(211, 184, 90)');
    expect(jsErrors).toEqual([]);
  });
}
