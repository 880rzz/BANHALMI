import { test, expect } from '@playwright/test';

const routes=[
  ['/portrait/','Project framework'],
  ['/lifestyle/','Project framework'],
  ['/event-photography/','Project framework'],
  ['/hu/portre/','Projektkeretek'],
  ['/hu/brand/','Projektkeretek'],
  ['/hu/rendezvenyfotozas/','Projektkeretek'],
  ['/de-at/portrait/','Projektrahmen'],
  ['/de-at/brand/','Projektrahmen'],
  ['/de-at/eventfotografie/','Projektrahmen']
];

for(const [route,label] of routes){
  test(route+' keeps project details available without overwhelming the service page',async({page})=>{
    await page.goto(route);
    const drawer=page.locator('details[data-project-framework="stage20"]');
    await expect(drawer).toHaveCount(1);
    await expect(drawer).not.toHaveAttribute('open','');
    await expect(drawer.locator('summary')).toContainText(label);
    await drawer.locator('summary').click();
    await expect(drawer).toHaveAttribute('open','');
    for(const marker of ['stage7','stage9','stage12','stage13','stage10','stage11']){
      await expect(drawer.locator('[data-pricing-licensing="'+marker+'"], [data-delivery-system="'+marker+'"], [data-data-retention="'+marker+'"], [data-image-rights="'+marker+'"], [data-governance-confidentiality="'+marker+'"], [data-booking-contingency="'+marker+'"]')).toHaveCount(1);
    }
    const insideMain=await drawer.evaluate(node=>Boolean(node.closest('main')));
    expect(insideMain).toBe(true);
  });
}
