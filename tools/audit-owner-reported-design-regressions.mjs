import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const siteDir=path.resolve(process.env.AUDIT_SITE_DIR||'_site');
const widths=[375,390,430,768,1024,1280,1440];
const candidates=['/','/hu/','/de-at/','/portrait/','/hu/portre/','/de-at/portrait/','/partners/','/hu/partnerek/','/de-at/partner/','/faq/','/hu/gyik/','/de-at/faq/','/glamour/','/hu/muveszi-fotografia/','/de-at/fine-art/','/requestaquote/','/hu/ajanlatkeres/','/de-at/anfrage/'];
const pages=candidates.filter(p=>fs.existsSync(path.join(siteDir,p==='/'?'index.html':p.replace(/^\//,'')+'index.html')));
const failures=[];
const browser=await chromium.launch({headless:true});
for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1});
  for(const pathname of pages){
    const page=await context.newPage();
    await page.goto(new URL(pathname,base).href,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForTimeout(180);
    const issues=await page.evaluate(()=>{
      const out=[];const px=v=>parseFloat(v)||0;const vis=e=>{if(!e)return false;const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
      const w=innerWidth;
      if(document.documentElement.scrollWidth>w+2)out.push(`horizontal overflow ${document.documentElement.scrollWidth-w}px`);
      for(const h of document.querySelectorAll('main h1,main h2,main h3')){if(!vis(h))continue;const fs=px(getComputedStyle(h).fontSize);const max=h.matches('h1')?(w<=430?40:w<=768?44:58):h.matches('h2')?(w<=430?30:w<=768?32:38):28;if(fs>max)out.push(`${h.tagName} oversized ${fs.toFixed(1)}>${max}`)}
      for(const intro of document.querySelectorAll('main .section-head,main .section-intro,main .service-intro,main .content-intro')){if(!vis(intro))continue;const kids=[...intro.children].filter(e=>vis(e)&&e.matches('h1,h2,h3,p,.lead,.eyebrow,.label,.kicker'));if(kids.length<2)continue;const lefts=kids.map(e=>e.getBoundingClientRect().left);if(Math.max(...lefts)-Math.min(...lefts)>5)out.push('content-axis drift')}
      for(const section of document.querySelectorAll('main section')){if(!vis(section)||section.matches('.hero,.hero-section,.statement,.immersive,.cta-band'))continue;const r=section.getBoundingClientRect(),s=getComputedStyle(section),text=(section.innerText||'').trim(),media=section.querySelectorAll('img,video,figure,.gallery').length;if(w>=1024&&r.height>1500&&text.length<420&&media<2)out.push(`sparse section ${r.height.toFixed(0)}px`);if(w>=1024&&(px(s.paddingTop)>112||px(s.paddingBottom)>112))out.push(`section padding ${s.paddingTop}/${s.paddingBottom}`)}
      const main=document.querySelector('main'),footer=document.querySelector('.site-footer,footer');if(vis(main)&&vis(footer)){const gap=footer.getBoundingClientRect().top-main.getBoundingClientRect().bottom;if(gap>80)out.push(`main/footer gap ${gap.toFixed(0)}px`)}
      if(w>=1280){for(const grid of document.querySelectorAll('main .grid-3')){if(!vis(grid))continue;const kids=[...grid.children].filter(vis);if(kids.length>=3){const tops=kids.slice(0,3).map(e=>Math.round(e.getBoundingClientRect().top));if(new Set(tops).size!==1)out.push('three-card block not 3-up at wide desktop')}}}
      const quote=document.querySelector('.smart-quote-layout');if(vis(quote)){for(const radio of document.querySelectorAll('.smart-quote-layout input[type="radio"]')){if(!vis(radio))continue;const r=radio.getBoundingClientRect();if(Math.abs(r.width-24)>1||Math.abs(r.height-24)>1)out.push(`radio geometry ${r.width.toFixed(0)}x${r.height.toFixed(0)}`)}if(w>=1024){const intro=document.querySelector('.smart-quote-layout>.quote-intro'),form=document.querySelector('.smart-quote-layout>.form');if(vis(intro)&&vis(form)){const ir=intro.getBoundingClientRect(),fr=form.getBoundingClientRect();if(fr.width<ir.width*1.2)out.push(`quote workspace narrow ${fr.width.toFixed(0)}/${ir.width.toFixed(0)}`)}}}
      return [...new Set(out)];
    });
    if(issues.length)failures.push(`${width}px ${pathname}: ${issues.join(' | ')}`);
    await page.close();
  }
  await context.close();
}
await browser.close();
if(failures.length){console.error('Owner-reported BANHALMI design regression gate failed:\n'+failures.join('\n'));process.exit(1)}
console.log(`Owner-reported BANHALMI design regression gate passed: ${pages.length} pages × ${widths.length} required widths.`);
