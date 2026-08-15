import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const siteDir=path.resolve(process.env.AUDIT_SITE_DIR||'_site');
const widths=[390,768,1024,1440];
const failures=[];

function walk(dir){const out=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())out.push(...walk(f));else if(e.isFile()&&e.name.endsWith('.html'))out.push(f)}return out}
function toUrl(file){const rel=path.relative(siteDir,file).split(path.sep).join('/');if(rel==='index.html')return '/';if(rel.endsWith('/index.html'))return `/${rel.slice(0,-10)}`;return `/${rel}`}
function discover(){const pages=[];for(const file of walk(siteDir)){const html=fs.readFileSync(file,'utf8');if(!/<main\b/i.test(html)||/http-equiv=["']refresh["']/i.test(html)||!/assets\/css\//i.test(html))continue;pages.push(toUrl(file))}return [...new Set(pages)].sort()}
const pages=discover();
const browser=await chromium.launch({headless:true});

for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1});
  for(const pathname of pages){
    const page=await context.newPage();
    try{await page.goto(new URL(pathname,base).href,{waitUntil:'domcontentloaded',timeout:30000})}catch(e){failures.push(`${width}px ${pathname}: navigation ${e.message}`);await page.close();continue}
    await page.waitForTimeout(180);
    const issues=await page.evaluate(()=>{
      const out=[];
      const visible=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};
      const px=v=>parseFloat(v)||0;
      const name=el=>`${el.tagName.toLowerCase()}${el.id?'#'+el.id:''}${el.className?'.'+String(el.className).trim().replace(/\s+/g,'.').slice(0,90):''}`;
      const w=innerWidth;

      for(const el of document.querySelectorAll('main p,main li')){
        if(!visible(el)||(el.innerText||'').trim().length<140)continue;
        const r=el.getBoundingClientRect();if(w>=1024&&r.width>860)out.push(`${name(el)} long-form width ${r.width.toFixed(0)}px`);
      }

      for(const el of document.querySelectorAll('main section')){
        if(!visible(el)||el.matches('.hero,.statement,.cta-band')||el.closest('.gallery'))continue;
        const r=el.getBoundingClientRect(),text=(el.innerText||'').replace(/\s+/g,' ').trim(),media=el.querySelectorAll('img,video,figure,.gallery').length;
        if(w>=1024&&r.height>1500&&text.length<420&&media<2)out.push(`${name(el)} sparse section ${r.height.toFixed(0)}px / ${text.length} chars`);
        const s=getComputedStyle(el);if(w>=1024&&(px(s.paddingTop)>132||px(s.paddingBottom)>132))out.push(`${name(el)} excessive section padding ${s.paddingTop}/${s.paddingBottom}`);
      }

      for(const h of document.querySelectorAll('main h1,main h2,header h1')){
        if(!visible(h))continue;const fs=px(getComputedStyle(h).fontSize),max=w<=430?50:w<=768?58:70;if(fs>max)out.push(`${name(h)} display size ${fs.toFixed(1)}px > ${max}px`);
      }

      const quote=document.querySelector('[data-smart-quote],#build-package,.smart-quote-layout');
      if(quote&&visible(quote)&&w>=1024){
        const layout=document.querySelector('.smart-quote-layout');
        const intro=document.querySelector('.smart-quote-layout>.quote-intro');
        const form=document.querySelector('.smart-quote-layout>.form');
        if(layout&&intro&&form&&visible(intro)&&visible(form)){
          const ir=intro.getBoundingClientRect(),fr=form.getBoundingClientRect();
          if(fr.width<ir.width*1.45)out.push(`quote workspace too narrow: form ${fr.width.toFixed(0)}px vs intro ${ir.width.toFixed(0)}px`);
          if(w>=1280&&fr.width<690)out.push(`quote form desktop width ${fr.width.toFixed(0)}px < 690px`);
        }
        for(const step of document.querySelectorAll('.quote-step')){
          if(!visible(step))continue;const s=getComputedStyle(step),r=step.getBoundingClientRect();
          const pads=[px(s.paddingTop),px(s.paddingRight),px(s.paddingBottom),px(s.paddingLeft)];
          if(Math.max(...pads)>26)out.push(`${name(step)} padding ${pads.map(x=>x.toFixed(0)).join('/')}px`);
          if(px(s.borderRadius)>18)out.push(`${name(step)} radius ${s.borderRadius}`);
          const text=(step.innerText||'').replace(/\s+/g,' ').trim();if(text.length<140&&r.height>420)out.push(`${name(step)} low information density ${r.height.toFixed(0)}px/${text.length} chars`);
        }
        for(const card of document.querySelectorAll('.category-card,.option-row')){
          if(!visible(card))continue;const s=getComputedStyle(card);const pads=[px(s.paddingTop),px(s.paddingRight),px(s.paddingBottom),px(s.paddingLeft)];
          if(Math.max(...pads)>15)out.push(`${name(card)} card padding ${pads.map(x=>x.toFixed(0)).join('/')}px`);
          if(px(s.borderRadius)>16)out.push(`${name(card)} card radius ${s.borderRadius}`);
        }
        for(const card of document.querySelectorAll('.quote-summary-card')){
          if(!visible(card))continue;const s=getComputedStyle(card);if(Math.max(px(s.paddingTop),px(s.paddingRight),px(s.paddingBottom),px(s.paddingLeft))>28)out.push(`${name(card)} summary padding too large`);
        }
      }

      for(const card of document.querySelectorAll('.card,.service-card,.case-card,.fact-card,.quote-summary-card')){
        if(!visible(card))continue;const r=card.getBoundingClientRect(),text=(card.innerText||'').replace(/\s+/g,' ').trim(),media=card.querySelectorAll('img,video,figure').length;
        if(w>=1024&&r.height>700&&text.length<260&&media===0)out.push(`${name(card)} oversized card ${r.height.toFixed(0)}px/${text.length} chars`);
      }

      return [...new Set(out)].slice(0,100);
    });
    if(issues.length)failures.push(`${width}px ${pathname}: ${issues.join(' | ')}`);
    await page.close();
  }
  await context.close();
}
await browser.close();
if(failures.length){console.error(`First-principles BANHALMI layout audit found ${failures.length} failing page/viewport combinations.`);console.error(failures.join('\n'));process.exit(1)}
console.log(`First-principles BANHALMI layout audit passed: ${pages.length} pages across ${widths.length} widths; density, hierarchy and quote-builder geometry are within contract.`);
await import('./audit-layout-authority-browser.mjs');
