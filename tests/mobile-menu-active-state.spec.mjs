import { test, expect } from '@playwright/test';

const routes = ['/', '/hu/', '/de-at/'];

for (const route of routes) {
  test(`mobile active menu state is text-only on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const link = page.locator('[data-nav-role="oeuvre"]').first();
    await expect(link).toBeVisible();
    await link.evaluate((element) => {
      element.classList.add('active');
      element.setAttribute('aria-current', 'page');
    });

    const styles = await link.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderTopWidth: style.borderTopWidth,
        boxShadow: style.boxShadow,
        outlineStyle: style.outlineStyle,
        borderRadius: style.borderRadius
      };
    });

    expect(styles.color).toBe('rgb(183, 156, 68)');
    expect(styles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(styles.borderTopWidth).toBe('0px');
    expect(styles.boxShadow).toBe('none');
    expect(styles.outlineStyle).toBe('none');
    expect(styles.borderRadius).toBe('0px');
  });
}
