import {test,expect} from '@playwright/test';

const routes=[
 '/','/hu/','/de-at/',
 '/portrait/','/hu/portre/','/de-at/portrait/',
 '/lifestyle/','/hu/brand/','/de-at/brand/',
 '/event-photography/','/hu/rendezvenyfotozas/','/de-at/eventfotografie/',
 '/fine-art/','/hu/muveszi-fotografia/','/de-at/fine-art/'
];

for(const route of routes){
 test(route+' renders only off-site text-link arrows',async({page})=>{
  await page.goto(route);
  const errors=await page.evaluate(()=>{
   const canonicalHost=h=>String(h||'').toLowerCase().replace(/^www\./,'');
   const local=canonicalHost(location.hostname);
   const violations=[];
   for(const a of document.querySelectorAll('a[href]')){
    const raw=a.getAttribute('href');
    let url=null;
    try{url=new URL(raw,document.baseURI);}catch{}
    const offsite=!!url&&['https:','http:'].includes(url.protocol)
      && canonicalHost(url.hostname)!==local
      && canonicalHost(url.hostname)!=='norbertbanhalmi.com';
    let excluded=a.matches('.brand,.footer-wko-profile,.btn,.btn-primary,.btn-secondary,.btn-ghost,.nav-cta,.banhalmi-contact-studio,[role="button"]')
      || !!a.querySelector('img,picture,svg,video');
    if(a.matches('.banhalmi-contact-action')){
      // Booking keeps one decorative external glyph; WhatsApp and other dock actions do not.
      excluded=a.getAttribute('data-contact-role')!=='booking';
    }
    const text=(a.textContent||'').replace(/\u2197/g,'').trim();
    const expected=offsite&&!excluded&&!!text;
    const glyphs=[...a.querySelectorAll(':scope > .banhalmi-link-arrow')];
    if(expected){
      if(glyphs.length!==1||glyphs[0].getAttribute('aria-hidden')!=='true')
        violations.push('external arrow: '+raw+' ('+glyphs.length+')');
    }else if(glyphs.length||/↗\s*$/.test(a.textContent||'')){
      violations.push('forbidden arrow: '+raw);
    }
   }
   return violations;
  });
  expect(errors).toEqual([]);
 });
}

test('added links and URL changes preserve external-only arrows and accessible labels',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{
  const host=document.createElement('div');
  host.id='bn-external-arrow-test';
  host.innerHTML=[
   '<a id="bn-int" href="/hu/portre/">Internal ↗</a>',
   '<a id="bn-absolute-int" href="https://www.norbertbanhalmi.com/de-at/portrait/">Internal absolute</a>',
   '<a id="bn-external" href="https://example.org/guide">Outside ↗</a>',
   '<a id="bn-mail" href="mailto:test@example.org">Email ↗</a>',
   '<a id="bn-external-button" class="btn" href="https://example.org/">Button ↗</a>'
  ].join('');
  document.body.appendChild(host);
 });
 await expect(page.locator('#bn-int .banhalmi-link-arrow')).toHaveCount(0);
 await expect(page.locator('#bn-absolute-int .banhalmi-link-arrow')).toHaveCount(0);
 await expect(page.locator('#bn-mail .banhalmi-link-arrow')).toHaveCount(0);
 await expect(page.locator('#bn-external-button .banhalmi-link-arrow')).toHaveCount(0);
 await expect(page.locator('#bn-external .banhalmi-link-arrow')).toHaveCount(1);
 await expect(page.locator('#bn-external .banhalmi-link-arrow')).toHaveAttribute('aria-hidden','true');
 await expect(page.locator('#bn-external')).toHaveAccessibleName('Outside');
 await page.locator('#bn-external').evaluate(a=>a.setAttribute('href','/portrait/'));
 await expect(page.locator('#bn-external .banhalmi-link-arrow')).toHaveCount(0);
 await page.locator('#bn-int').evaluate(a=>a.setAttribute('href','https://example.org/new'));
 await expect(page.locator('#bn-int .banhalmi-link-arrow')).toHaveCount(1);
 await expect(page.locator('#bn-int')).toHaveAccessibleName('Internal');
});

for(const route of ['/','/hu/','/de-at/']) {
 test('WhatsApp contact action stays arrow-free: '+route, async({page})=>{
  await page.goto(route);
  const declineCookies = page.locator('[data-decline]');
  if (await declineCookies.isVisible()) await declineCookies.click();
  await page.locator('.banhalmi-contact-trigger').click();
  const whatsapp=page.locator('.banhalmi-contact-action[data-contact-role="whatsapp"]');
  await expect(whatsapp).toBeVisible();
  await expect(whatsapp.locator('.banhalmi-link-arrow')).toHaveCount(0);
  await expect(whatsapp).not.toContainText('↗');
 });

 test('Dock exposes booking and quote without inner scroll: '+route, async({page})=>{
  await page.goto(route);
  const declineCookies = page.locator('[data-decline]');
  if (await declineCookies.isVisible()) await declineCookies.click();
  await page.locator('.banhalmi-contact-trigger').click();
  const booking=page.locator('.banhalmi-contact-action[data-contact-role="booking"]');
  const quote=page.locator('.banhalmi-contact-action[data-contact-role="quote"]');
  await expect(booking).toBeVisible();
  await expect(quote).toBeVisible();
  await expect(booking.locator('.banhalmi-link-arrow')).toHaveCount(1);
  await expect(quote.locator('.banhalmi-link-arrow')).toHaveCount(0);
  const panelMetrics=await page.locator('#banhalmi-contact-panel').evaluate((el)=>({
    overflowY:getComputedStyle(el).overflowY,
    scrollHeight:el.scrollHeight,
    clientHeight:el.clientHeight,
    scrollWidth:el.scrollWidth,
    clientWidth:el.clientWidth
  }));
  expect(['visible','clip'].includes(panelMetrics.overflowY) || panelMetrics.overflowY==='visible').toBeTruthy();
  expect(panelMetrics.scrollHeight).toBeLessThanOrEqual(panelMetrics.clientHeight+1);
  expect(panelMetrics.scrollWidth).toBeLessThanOrEqual(panelMetrics.clientWidth+1);
 });
}

for(const route of ['/contact/','/hu/kapcsolat/','/de-at/kontakt/']){
 test('Map card links keep a single external glyph: '+route, async({page})=>{
  await page.goto(route);
  const maps=page.locator('a.map-card-link');
  const count=await maps.count();
  expect(count).toBeGreaterThan(0);
  for(let i=0;i<count;i++){
   const link=maps.nth(i);
   await expect(link.locator('.banhalmi-link-arrow')).toHaveCount(1);
   const text=await link.evaluate(a=>Array.from(a.childNodes).filter(n=>n.nodeType===3).map(n=>n.textContent||'').join(''));
   expect(text).not.toMatch(/[›↗]/);
  }
 });

 test('Contact routing cards keep equal padding and grid gap: '+route, async({page})=>{
  await page.setViewportSize({width:1100,height:900});
  await page.goto(route);
  const metrics=await page.locator('.contact-routing .service-grid').evaluate((grid)=>{
   const style=getComputedStyle(grid);
   const cards=[...grid.querySelectorAll(':scope > .card')].map((card)=>{
    const cs=getComputedStyle(card);
    const box=card.getBoundingClientRect();
    return {paddingTop:cs.paddingTop,paddingBottom:cs.paddingBottom,top:box.top,bottom:box.bottom,height:box.height};
   });
   return {display:style.display,gap:style.gap,columns:style.gridTemplateColumns,cards};
  });
  expect(metrics.display).toBe('grid');
  expect(metrics.cards.length).toBe(2);
  expect(metrics.cards[0].paddingTop).toBe(metrics.cards[1].paddingTop);
  expect(metrics.cards[0].paddingBottom).toBe(metrics.cards[1].paddingBottom);
  // Two columns on desktop: cards should not stack with zero gap.
  expect(metrics.columns.split(' ').filter(Boolean).length).toBeGreaterThanOrEqual(2);
 });
}
