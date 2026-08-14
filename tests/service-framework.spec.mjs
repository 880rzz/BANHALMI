import { test, expect } from '@playwright/test';

const routes=[
  ['/portrait/','Project framework',false],
  ['/lifestyle/','Project framework',false],
  ['/event-photography/','Project framework',true],
  ['/hu/portre/','Projektkeretek',false],
  ['/hu/brand/','Projektkeretek',false],
  ['/hu/rendezvenyfotozas/','Projektkeretek',true],
  ['/de-at/portrait/','Projektrahmen',false],
  ['/de-at/brand/','Projektrahmen',false],
  ['/de-at/eventfotografie/','Projektrahmen',true]
];

for(const [route,label,isEvent] of routes){
  test(route+' keeps a concise project framework without duplicate decision layers',async({page})=>{
    await page.goto(route);
    const drawer=page.locator('details[data-project-framework="stage20"]');
    await expect(drawer).toHaveCount(1);
    await expect(drawer).toHaveClass(/service-framework-compact/);
    await expect(drawer).not.toHaveAttribute('open','');
    await expect(drawer.locator('summary')).toContainText(label);
    await expect(page.locator('[data-strategic-partnership="concrete"]')).toHaveCount(0);
    await drawer.locator('summary').click();
    await expect(drawer).toHaveAttribute('open','');
    await expect(drawer.locator('.project-framework-content > .section-band')).toHaveCount(4);
    for(const marker of ['stage7','stage9','stage12','stage13','stage10','stage11']){
      await expect(drawer.locator('[data-pricing-licensing="'+marker+'"], [data-delivery-system="'+marker+'"], [data-data-retention="'+marker+'"], [data-image-rights="'+marker+'"], [data-governance-confidentiality="'+marker+'"], [data-booking-contingency="'+marker+'"]')).toHaveCount(1);
    }
    await expect(drawer.locator('a').filter({hasText:/Terms|feltételek|Vertragsbedingungen/i})).toHaveCount(1);
    await expect(drawer.locator('a').filter({hasText:/Privacy|Adatvédelem|Datenschutz/i})).toHaveCount(1);
    const insideMain=await drawer.evaluate(node=>Boolean(node.closest('main')));
    expect(insideMain).toBe(true);
    if(isEvent){
      await expect(page.locator('main')).not.toContainText(/Private and family occasions|Privát és családi alkalmak|Private und familiäre Anlässe/i);
    }
  });
}
