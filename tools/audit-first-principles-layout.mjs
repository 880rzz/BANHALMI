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
        const lh=px(getComputedStyle(el).lineHeight),fs=px(getComputedStyle(el).fontSize);if(fs>0&&lh/fs<1.32)out.push(`${name(el)} body leading ${(lh/fs).toFixed(2)} < 1.32`);
      }

      for(const el of document.querySelectorAll('main section')){
        if(!visible(el)||el.matches('.hero,.hero-section,.statement,.immersive,.cta-band,[data-layout="immersive"]')||el.closest('.gallery'))continue;
        const r=el.getBoundingClientRect(),text=(el.innerText||'').replace(/\s+/g,' ').trim(),media=el.querySelectorAll('img,video,figure,.gallery').length;
        if(w>=1024&&r.height>1500&&text.length<420&&media<2)out.push(`${name(el)} sparse section ${r.height.toFixed(0)}px / ${text.length} chars`);
        const s=getComputedStyle(el);if(w>=1024&&(px(s.paddingTop)>112||px(s.paddingBottom)>112))out.push(`${name(el)} excessive section padding ${s.paddingTop}/${s.paddingBottom}`);
        const kids=[...el.children].filter(visible);if(kids.length){const first=kids[0].getBoundingClientRect(),last=kids[kids.length-1].getBoundingClientRect();const topGap=first.top-r.top,bottomGap=r.bottom-last.bottom;const lim=w<=620?110:150;if(topGap>lim)out.push(`${name(el)} unexplained top whitespace ${topGap.toFixed(0)}px`);if(bottomGap>lim)out.push(`${name(el)} unexplained bottom whitespace ${bottomGap.toFixed(0)}px`)}
      }

      for(const h of document.querySelectorAll('main h1,main h2,main h3,header h1')){
        if(!visible(h))continue;const fs=px(getComputedStyle(h).fontSize);
        // Animated text-reveal headings can use a zero-size semantic wrapper while
        // their visible descendant spans carry the rendered type. The approved
        // visual audit already treats those wrappers as non-measurable; keep this
        // first-principles gate consistent so it never reports a false 0px scale.
        if(fs<1)continue;
        let min=0,max=999;
        if(h.matches('h1')){min=w<=430?34:42;max=w<=430?50:w<=768?58:74}
        else if(h.matches('h2')){min=w<=430?27:29;max=w<=430?40:50}
        else {min=18;max=28}
        if(fs<min||fs>max)out.push(`${name(h)} type scale ${fs.toFixed(1)}px outside ${min}-${max}px`)
      }

      for(const h of document.querySelectorAll('main h1,main h2,main h3')){
        if(!visible(h)||px(getComputedStyle(h).fontSize)<1)continue;let n=h.nextElementSibling;if(!n||!visible(n)||!n.matches('p,.lead,.description,.section-description,.hero-description,.service-description'))continue;
        const hr=h.getBoundingClientRect(),nr=n.getBoundingClientRect(),gap=nr.top-hr.bottom;const min=w<=620?10:12,max=w<=620?28:34;if(gap<min||gap>max)out.push(`${name(h)} → ${name(n)} gap ${gap.toFixed(0)}px outside ${min}-${max}px`)
      }

      for(const intro of document.querySelectorAll('main .section-head,main .section-intro,main .service-intro,main .content-intro')){
        if(!visible(intro))continue;const nodes=[...intro.children].filter(el=>visible(el)&&el.matches('h1,h2,h3,p,.lead,.eyebrow,.label,.kicker,[class*="eyebrow"],[class*="kicker"]'));if(nodes.length<2)continue;const lefts=nodes.map(el=>el.getBoundingClientRect().left),spread=Math.max(...lefts)-Math.min(...lefts);if(spread>5)out.push(`${name(intro)} optical-axis drift ${spread.toFixed(1)}px`)
      }

      for(const cell of document.querySelectorAll('main .card,main .step,main .process-card,main .process-step,main .workflow-card,main .service-card,main .evidence-card,main .trust-card,main .panel,main .cell,main .fp-choice')){
        if(!visible(cell))continue;const s=getComputedStyle(cell),r=cell.getBoundingClientRect();const wall=px(s.borderLeftWidth)+px(s.borderRightWidth)+px(s.borderTopWidth)+px(s.borderBottomWidth)>0||s.backgroundColor!=='rgba(0, 0, 0, 0)';if(!wall)continue;
        const pads=[px(s.paddingTop),px(s.paddingRight),px(s.paddingBottom),px(s.paddingLeft)];const minPad=w<=620?18:20;if(Math.min(...pads)<minPad)out.push(`${name(cell)} four-side padding ${pads.map(v=>v.toFixed(0)).join('/')}px`);if(Math.max(...pads)-Math.min(...pads)>10)out.push(`${name(cell)} asymmetric cell inset ${pads.map(v=>v.toFixed(0)).join('/')}px`);
        const kids=[...cell.children].filter(visible);for(const kid of kids.slice(0,5)){const kr=kid.getBoundingClientRect();if(kr.left-r.left<15||r.right-kr.right<15)out.push(`${name(cell)} child touches cell wall (${(kr.left-r.left).toFixed(0)}/${(r.right-kr.right).toFixed(0)}px)`)}if(w<=620&&(cell.innerText||'').trim().length>100&&r.width<240)out.push(`${name(cell)} cramped mobile text cell ${r.width.toFixed(0)}px`)
      }

      if(w<=620){for(const layout of document.querySelectorAll('main *')){if(!visible(layout))continue;const s=getComputedStyle(layout);if(!['grid','flex'].includes(s.display))continue;const kids=[...layout.children].filter(visible);if(kids.length<2)continue;const rows=new Set(kids.map(k=>Math.round(k.getBoundingClientRect().top/4)*4));if(rows.size>=kids.length)continue;for(const kid of kids){const text=(kid.innerText||'').replace(/\s+/g,' ').trim();const r=kid.getBoundingClientRect();if(text.length>100&&r.width<240)out.push(`${name(layout)} generic cramped mobile child ${name(kid)} ${r.width.toFixed(0)}px`)}}}

      const footer=document.querySelector('.site-footer,footer');const main=document.querySelector('main');if(main&&footer&&visible(main)&&visible(footer)){const gap=footer.getBoundingClientRect().top-main.getBoundingClientRect().bottom;if(gap>80)out.push(`main/footer unexplained gap ${gap.toFixed(0)}px`)}
      for(const a of document.querySelectorAll('.site-header a.active,.site-header a[aria-current="page"]')){if(!visible(a))continue;const s=getComputedStyle(a);if(px(s.borderRadius)>8)out.push(`active navigation pill radius ${s.borderRadius}`);if(px(s.borderTopWidth)+px(s.borderRightWidth)+px(s.borderBottomWidth)+px(s.borderLeftWidth)>0)out.push(`active navigation framed`)}

      const quote=document.querySelector('[data-smart-quote],#build-package,.smart-quote-layout');if(quote&&visible(quote)&&w>=1024){const layout=document.querySelector('.smart-quote-layout'),intro=document.querySelector('.smart-quote-layout>.quote-intro'),form=document.querySelector('.smart-quote-layout>.form');if(layout&&intro&&form&&visible(intro)&&visible(form)){const ir=intro.getBoundingClientRect(),fr=form.getBoundingClientRect();if(fr.width<ir.width*1.45)out.push(`quote workspace too narrow: form ${fr.width.toFixed(0)}px vs intro ${ir.width.toFixed(0)}px`);if(w>=1280&&fr.width<690)out.push(`quote form desktop width ${fr.width.toFixed(0)}px < 690px`)}}
      for(const card of document.querySelectorAll('.card,.service-card,.case-card,.fact-card,.quote-summary-card')){if(!visible(card))continue;const r=card.getBoundingClientRect(),text=(card.innerText||'').replace(/\s+/g,' ').trim(),media=card.querySelectorAll('img,video,figure').length;if(w>=1024&&r.height>700&&text.length<260&&media===0)out.push(`${name(card)} oversized card ${r.height.toFixed(0)}px/${text.length} chars`)}

      return [...new Set(out)].slice(0,160);
    });
    if(issues.length)failures.push(`${width}px ${pathname}: ${issues.join(' | ')}`);
    await page.close();
  }
  await context.close();
}
await browser.close();
if(failures.length){console.error(`First-principles BANHALMI layout audit found ${failures.length} failing page/viewport combinations.`);console.error(failures.join('\n'));process.exit(1)}
console.log(`First-principles BANHALMI layout audit passed: ${pages.length} pages across ${widths.length} widths; typography scale, heading-description rhythm, four-side cell inset, axis, whitespace, reading measure, mobile density, navigation and footer geometry are within contract.`);
await import('./audit-layout-authority-browser.mjs');
