import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base=(process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const siteDir=path.resolve(process.env.AUDIT_SITE_DIR||'_site');
const widths=[390,768,1024,1440];
const failures=[];
const reports=[];
function walk(dir){const out=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())out.push(...walk(f));else if(e.isFile()&&e.name.endsWith('.html'))out.push(f)}return out}
function toUrl(file){const rel=path.relative(siteDir,file).split(path.sep).join('/');if(rel==='index.html')return '/';if(rel.endsWith('/index.html'))return `/${rel.slice(0,-10)}`;return `/${rel}`}
function discover(){const pages=[];for(const file of walk(siteDir)){const html=fs.readFileSync(file,'utf8');if(!/<main\b/i.test(html)||/http-equiv=["']refresh["']/i.test(html)||/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html))continue;pages.push(toUrl(file))}return [...new Set(pages)].sort()}
const pages=discover();
const browser=await chromium.launch({headless:true});
for(const width of widths){
 const context=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1});
 for(const pathname of pages){
  const page=await context.newPage();
  try{await page.goto(new URL(pathname,base).href,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(120)}catch(e){failures.push(`${width}px ${pathname}: navigation ${e.message}`);await page.close();continue}
  const result=await page.evaluate(()=>{
   const issues=[];const px=v=>parseFloat(v)||0;
   const visible=el=>{if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};
   const name=el=>`${el.tagName.toLowerCase()}${el.id?'#'+el.id:''}${el.className?'.'+String(el.className).trim().replace(/\s+/g,'.').slice(0,100):''}`;
   const w=innerWidth, bodyBg=getComputedStyle(document.body).backgroundColor;
   const isLeftAligned=s=>s.textAlign==='left'||s.textAlign==='start';
   if(document.documentElement.scrollWidth>document.documentElement.clientWidth+1)issues.push(`document horizontal overflow ${document.documentElement.scrollWidth-document.documentElement.clientWidth}px`);
   const longText=[...document.querySelectorAll('main p,main li,main blockquote')].filter(el=>visible(el)&&(el.innerText||'').replace(/\s+/g,' ').trim().length>=120);
   for(const el of longText){const s=getComputedStyle(el),r=el.getBoundingClientRect();const fs=px(s.fontSize),lh=px(s.lineHeight)/(fs||1);const centeredAllowed=!!el.closest('.cta-band,.hero-centered,.centered,.site-footer,.error-page,.statement');if(s.textAlign==='justify')issues.push(`${name(el)} uses justified text`);if(!isLeftAligned(s)&&!centeredAllowed)issues.push(`${name(el)} long prose text-align=${s.textAlign}`);if(fs<14)issues.push(`${name(el)} long prose font-size ${fs.toFixed(1)}px < 14px`);if(lh<1.35||lh>1.82)issues.push(`${name(el)} long prose line-height ${lh.toFixed(2)}`);if(w>=1024&&r.width>860)issues.push(`${name(el)} long prose width ${r.width.toFixed(0)}px > 860px`);if(w<=768&&!el.closest('.gallery,.collage')&&(r.left<15||r.right>w-15))issues.push(`${name(el)} page gutter [${r.left.toFixed(1)},${(w-r.right).toFixed(1)}]px`);}
   for(const h of document.querySelectorAll('main h1,main h2,main h3,header h1')){if(!visible(h))continue;const s=getComputedStyle(h),r=h.getBoundingClientRect(),fs=px(s.fontSize),lh=px(s.lineHeight)/(fs||1);if(fs<1)continue;if(lh<0.98||lh>1.32)issues.push(`${name(h)} heading line-height ${lh.toFixed(2)}`);const tag=h.tagName.toLowerCase();const lim=tag==='h1'?(w<=430?[32,50]:w<=768?[34,58]:[38,70]):tag==='h2'?(w<=430?[24,42]:[24,48]):[17.5,34];if(fs<lim[0]||fs>lim[1])issues.push(`${name(h)} font-size ${fs.toFixed(1)}px outside ${lim[0]}–${lim[1]}px`);if(w<=768&&!h.closest('.gallery,.collage')&&(r.left<15||r.right>w-15))issues.push(`${name(h)} heading violates page gutter [${r.left.toFixed(1)},${r.right.toFixed(1)}]`);}
   // Full-bleed is asserted only for components that explicitly declare that contract.
   for(const sec of document.querySelectorAll('main > section.full-bleed,main > section[data-full-bleed="true"]')){if(!visible(sec))continue;const r=sec.getBoundingClientRect(),s=getComputedStyle(sec);const bg=s.backgroundColor;const visiblyColored=bg!=='rgba(0, 0, 0, 0)'&&bg!==bodyBg;if(visiblyColored&&r.width<w-2)issues.push(`${name(sec)} colored section not full viewport (${r.width.toFixed(0)}/${w})`);if(s.contentVisibility==='auto')issues.push(`${name(sec)} content-visibility:auto can create blank bands`);}
   // Body-copy alignment inside standard section heads and prose containers.
   for(const c of document.querySelectorAll('main .section-head,main .prose,main .legal')){if(!visible(c))continue;for(const el of c.querySelectorAll('p,li,h2,h3'))if(visible(el)&&!el.closest('.cta-band')&&getComputedStyle(el).textAlign==='justify')issues.push(`${name(el)} justified editorial text`);}
   // Spacing rhythm: display text remains attached to its semantic copy, without collisions or arbitrary voids.
   for(const h of document.querySelectorAll('main h1,main h2,main h3')){if(!visible(h))continue;let n=h.nextElementSibling;while(n&&!visible(n))n=n.nextElementSibling;if(!n||!n.matches('p,ul,ol,blockquote,.lead,.cards,.steps,.gallery'))continue;const a=h.getBoundingClientRect(),b=n.getBoundingClientRect(),gap=b.top-a.bottom;if(gap<4)issues.push(`${name(h)} → ${name(n)} gap ${gap.toFixed(1)}px too tight`);if(gap>56&&!h.closest('.hero'))issues.push(`${name(h)} → ${name(n)} gap ${gap.toFixed(1)}px too loose`);}
   // Touch geometry on mobile/tablet. Native checkbox/radio controls use their associated labels as the touch target.
   if(w<=768){for(const el of [...document.querySelectorAll('button,summary,input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]),select,textarea,.btn,.menu-btn,.nav-cta')].filter(visible)){const r=el.getBoundingClientRect();if(r.height<43.5)issues.push(`${name(el)} touch height ${r.height.toFixed(1)}px < 44px`);if((el.matches('button,.menu-btn')||el.getAttribute('role')==='button')&&r.width<43.5)issues.push(`${name(el)} touch width ${r.width.toFixed(1)}px < 44px`);}}
   // Cards/cells: restrained radii, sufficient inner whitespace, no crushed content cells.
   for(const el of document.querySelectorAll('.card,.service-card,.case-card,.fact-card,.quote-step,.category-card,.option-row,.quote-summary-card')){if(!visible(el))continue;const s=getComputedStyle(el),r=el.getBoundingClientRect();const pl=px(s.paddingLeft),pr=px(s.paddingRight),pt=px(s.paddingTop),pb=px(s.paddingBottom);const hasWall=s.backgroundColor!=='rgba(0, 0, 0, 0)'||px(s.borderTopWidth)+px(s.borderRightWidth)+px(s.borderBottomWidth)+px(s.borderLeftWidth)>0;if(hasWall&&(pl<10||pr<10))issues.push(`${name(el)} cell horizontal padding ${pl.toFixed(0)}/${pr.toFixed(0)}px`);if(hasWall&&px(s.borderRadius)>28)issues.push(`${name(el)} radius ${s.borderRadius} > 28px`);if(r.width<120&&(el.innerText||'').trim().length>80)issues.push(`${name(el)} content cell width ${r.width.toFixed(0)}px`);if(pt>90||pb>90)issues.push(`${name(el)} cell vertical padding ${pt.toFixed(0)}/${pb.toFixed(0)}px`);}
   // Standard container widths and shell containment.
   for(const wrap of document.querySelectorAll('main .wrap')){if(!visible(wrap))continue;const r=wrap.getBoundingClientRect();if(r.right>w+2||r.left<-2)issues.push(`${name(wrap)} wrap escapes viewport [${r.left.toFixed(1)},${r.right.toFixed(1)}]`);}
   return {issues:[...new Set(issues)].slice(0,160),longText:longText.length,sections:[...document.querySelectorAll('main>section')].filter(visible).length};
  });
  reports.push({width,pathname,longText:result.longText,sections:result.sections,issues:result.issues.length});if(result.issues.length)failures.push(`${width}px ${pathname}: ${result.issues.join(' | ')}`);await page.close();
 }
 await context.close();
}
await browser.close();
fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/apple-visual-quality.json',JSON.stringify({pages:pages.length,widths,reports,failures},null,2));
if(failures.length){console.error(`BANHALMI Apple visual quality audit found ${failures.length} failing page/viewport combinations.`);console.error(failures.join('\n'));process.exit(1)}
console.log(`BANHALMI Apple visual quality audit passed: ${pages.length} pages × ${widths.length} viewports; typography, leading, alignment, reading measure, gutters, explicit full-bleed sections, controls and cell geometry verified.`);
