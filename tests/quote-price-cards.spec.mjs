import { test, expect } from '@playwright/test';

async function ready(page){
  const summary = page.locator('#quote-calculator > summary');
  if (await summary.count() && !(await page.locator('#quote-calculator').evaluate((node) => node.open))) {
    await summary.click();
  }
  await expect(page.locator('[data-pricing-ready="true"]')).toHaveCount(1,{timeout:10000});
}

const routes=[
  {path:'/requestaquote/', currency:'EUR', executive:499, branding:790, art:690, event:490},
  {path:'/hu/ajanlatkeres/', currency:'HUF', executive:199600, branding:316000, art:276000, event:196000},
  {path:'/de-at/anfrage/', currency:'EUR', executive:499, branding:790, art:690, event:490}
];

for(const route of routes){
  test(route.path+' overview cards prefill the quote calculator', async({page})=>{
    await page.goto(route.path);
    const cards=page.locator('a.quote-price-card');
    await expect(cards).toHaveCount(4);

    await expect(cards.nth(0)).toHaveAttribute('href', /brand_duration=brand60#quote-calculator$/);
    await cards.nth(0).click();
    await ready(page);
    await expect(page).toHaveURL(/service=brand/);
    await expect(page).toHaveURL(/brand_duration=brand60/);
    await expect(page).toHaveURL(/#quote-calculator/);
    await expect(page.locator('#quote-calculator')).toHaveJSProperty('open',true);
    await expect(page.locator('[name="category"][value="brand"]')).toBeChecked();
    await expect(page.locator('[name="brand_duration"][value="brand60"]')).toBeChecked();
    const filled=page.locator('#quote-calculator [data-quote-root], #quote-calculator .smart-quote-layout').first();
    const summary=page.locator('#quote-calculator > summary');
    await expect(filled).toBeVisible();
    await expect.poll(async()=>{
      return filled.evaluate((el, summaryHandle)=>{
        const top=el.getBoundingClientRect().top;
        const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'))||64;
        const summaryBottom=summaryHandle?summaryHandle.getBoundingClientRect().bottom:-Infinity;
        // Land on the filled form start: summary is above the fold, filled block sits under the sticky header.
        return summaryBottom<=header+24 && top>=0 && top<=header+96;
      }, await summary.elementHandle());
    },{timeout:8000}).toBe(true);
    const executive=Number.parseFloat((await page.locator(`[data-estimate-gross] [data-currency="${route.currency}"]`).textContent()).replace(/[^0-9,.-]/g,'').replace(/\.(?=\d{3})/g,'').replace(',','.'));
    expect(executive).toBe(route.executive);

    await page.goto(route.path);
    await cards.nth(1).click();
    await ready(page);
    await expect(page.locator('[name="brand_duration"][value="brand120"]')).toBeChecked();
    const branding=Number.parseFloat((await page.locator(`[data-estimate-gross] [data-currency="${route.currency}"]`).textContent()).replace(/[^0-9,.-]/g,'').replace(/\.(?=\d{3})/g,'').replace(',','.'));
    expect(branding).toBe(route.branding);

    await page.goto(route.path);
    await cards.nth(2).click();
    await ready(page);
    await expect(page.locator('[name="category"][value="art"]')).toBeChecked();
    const art=Number.parseFloat((await page.locator(`[data-estimate-gross] [data-currency="${route.currency}"]`).textContent()).replace(/[^0-9,.-]/g,'').replace(/\.(?=\d{3})/g,'').replace(',','.'));
    expect(art).toBe(route.art);

    await page.goto(route.path);
    await cards.nth(3).click();
    await ready(page);
    await expect(page.locator('[name="category"][value="event"]:not([data-private-event])').first()).toBeChecked();
    const event=Number.parseFloat((await page.locator(`[data-estimate-gross] [data-currency="${route.currency}"]`).textContent()).replace(/[^0-9,.-]/g,'').replace(/\.(?=\d{3})/g,'').replace(',','.'));
    expect(event).toBe(route.event);
  });
}
