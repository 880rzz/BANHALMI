import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true
});

const routes = ['/', '/hu/', '/de-at/'];

for (const route of routes) {
  test(`mobile active menu state is text-only on ${route}`, async ({ page }) => {
    await page.goto(route);

    const menuButton = page.locator('.menu-btn');
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    const nav = page.locator('.nav-links');
    await expect(nav).toBeVisible();

    const link = nav.locator('[data-nav-role="oeuvre"]').first();
    await expect(link).toBeVisible();

    // Force the same active/current state used by the navigation logic so this
    // regression test isolates the visual contract from route-specific labels.
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
        borderTopStyle: style.borderTopStyle,
        boxShadow: style.boxShadow,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        borderRadius: style.borderRadius
      };
    });

    expect(styles.color).toBe('rgb(183, 156, 68)');
    expect(styles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(styles.borderTopWidth).toBe('0px');
    expect(styles.borderTopStyle).toBe('none');
    expect(styles.boxShadow).toBe('none');
    expect(styles.outlineStyle).toBe('none');
    expect(styles.outlineWidth).toBe('0px');
    expect(styles.borderRadius).toBe('0px');
  });
}
