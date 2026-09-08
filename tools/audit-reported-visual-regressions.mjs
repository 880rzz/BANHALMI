import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base=(process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const siteDir=path.resolve(process.env.AUDIT_SITE_DIR||'_site');
const widths=[390,768,1440,1920];
const failures=[];
function routeFor(rel){if(rel==='index.html')return '/';if(rel.endsWith('/index.html'))return '/'+rel.slice(0,-10);return '/'+rel;}
function walk(dir,out=[]){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f,out);else if(e.isFile()&&e.name.endsWith('.html'))out.push(f)}return out}
const routes=[...new Set(walk(siteDir).filter(f=>{const h=fs.readFileSync(f,'utf8');return /<main\b/i.test(h)&&!/http-equiv=["']refresh["']/i.test(h)}).map(f=>routeFor(path.relative(siteDir,f).split(path.sep).join('/'))))];
const browser=await chromium.launch({headless:true});
for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1});
  for(const route of routes){
    const page=await context.newPage();await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(100);
    const issues=await page.evaluate(()=>{
      const out=[];const visible=el=>{if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};
      const px=v=>parseFloat(v)||0;
      const body=getComputedStyle(document.body);if(body.display==='flex'&&body.flexDirection==='column')out.push('body still uses viewport-filling flex column');
      const footer=document.querySelector('.site-footer');if(visible(footer)){const fr=footer.getBoundingClientRect();const kids=[...footer.children].filter(visible);if(kids.length){const last=kids.at(-1).getBoundingClientRect();const tail=fr.bottom-last.bottom;if(tail>160)out.push(`footer tail whitespace ${tail.toFixed(0)}px`)}if(fr.height>innerHeight*.85&&(footer.innerText||'').trim().length<1800)out.push(`footer height ${fr.height.toFixed(0)}px occupies >85% viewport`)}
      for(const a of document.querySelectorAll('.site-header .nav-links a.active,.site-header .nav-links a[aria-current="page"],.site-header .nav-links .active>a,.site-header .lang-switch a.active,.site-header .lang-switch a[aria-current="page"]')){if(!visible(a))continue;const s=getComputedStyle(a);const border=px(s.borderTopWidth)+px(s.borderRightWidth)+px(s.borderBottomWidth)+px(s.borderLeftWidth);if(border>0)out.push('active navigation has border');if(s.boxShadow!=='none')out.push('active navigation has box shadow');if(s.backgroundColor!=='rgba(0, 0, 0, 0)'&&s.backgroundColor!=='transparent')out.push(`active navigation has background ${s.backgroundColor}`);if(px(s.borderRadius)>1)out.push(`active navigation has radius ${s.borderRadius}`)}
      for(const topic of document.querySelectorAll('.faq-topic')){if(!visible(topic))continue;const h=topic.querySelector(':scope>h2,:scope>h3');const first=topic.querySelector(':scope>.faq>details');if(visible(h)&&visible(first)){const drift=Math.abs(h.getBoundingClientRect().left-first.getBoundingClientRect().left);if(drift>4)out.push(`FAQ topic axis drift ${drift.toFixed(1)}px`)}}
      return [...new Set(out)];
    });
    if(issues.length)failures.push(`${width}px ${route}: ${issues.join(' | ')}`);await page.close();
  }
  await context.close();
}
await browser.close();
if(failures.length){console.error(`Reported visual regression audit failed on ${failures.length} page/viewport combinations.`);console.error(failures.join('\n'));process.exit(1)}
console.log(`Reported visual regression audit passed: no framed active navigation, viewport-filling footer, footer tail void or FAQ-axis drift across ${routes.length} pages at ${widths.join('/')}px.`);
