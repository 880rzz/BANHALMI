import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl=(process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const siteDir=process.env.AUDIT_SITE_DIR||'_site';
const widths=(process.env.BANHALMI_DESIGN_WIDTHS||'390,768,1440').split(',').map(Number).filter(Boolean);
const designAuthority=JSON.parse(fs.readFileSync(path.resolve('data/design-authority.json'),'utf8'));
const pageMaxPx=Number(designAuthority.pageMaxPx);
if(!Number.isFinite(pageMaxPx)||pageMaxPx<800)throw new Error(`Invalid canonical pageMaxPx in data/design-authority.json: ${designAuthority.pageMaxPx}`);
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,e.name);if(e.isDirectory())walk(full);else if(e.isFile()&&e.name.endsWith('.html'))files.push(full)}}
walk(siteDir);
const contentFiles=files.filter(file=>{const rel=path.relative(siteDir,file).replaceAll('\\','/');const html=fs.readFileSync(file,'utf8');if(rel.startsWith('redirects/'))return false;if(/http-equiv=["']refresh["']/i.test(html)&&html.length<7000)return false;return /<main\b/i.test(html)&&!/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)});
function urlFor(file){let rel=path.relative(siteDir,file).replaceAll('\\','/');rel=rel.replace(/index\.html$/,'');return `${baseUrl}/${rel}`.replace(/([^:]\/)\/+/g,'$1')}
const browser=await chromium.launch({headless:true});const failures=[];let checks=0;
for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:1100}});
  for(const file of contentFiles){
    const rel=path.relative(siteDir,file).replaceAll('\\','/');
    await page.goto(urlFor(file),{waitUntil:'networkidle'});
    const r=await page.evaluate((canonicalPageMaxPx)=>{
      const visible=el=>{if(!el)return false;const s=getComputedStyle(el),b=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&b.width>0&&b.height>0};
      const de=document.documentElement;
      const header=document.querySelector('.site-header');
      const main=document.querySelector('main');
      const footer=document.querySelector('.site-footer');
      const surfaces=[];
      for(const el of document.querySelectorAll('main>section[data-surface]')){
        if(!visible(el))continue;
        const s=getComputedStyle(el);
        surfaces.push({surfaceName:el.getAttribute('data-surface'),bg:s.backgroundColor,color:s.color});
      }
      const wraps=[];
      for(const w of document.querySelectorAll('main .wrap')){
        if(!visible(w))continue;
        const b=w.getBoundingClientRect();
        if(b.width>Math.min(innerWidth,canonicalPageMaxPx)+4)wraps.push(b.width);
      }
      const info=[...document.querySelectorAll('.smart-quote-layout .info-tip[data-tooltip]')].filter(visible).map(el=>({position:getComputedStyle(el).position,b:el.getBoundingClientRect(),card:el.closest('.category-card,.option-row')?.getBoundingClientRect()||null}));
      const mainBox=visible(main)?main.getBoundingClientRect():null;
      const footerBox=visible(footer)?footer.getBoundingClientRect():null;
      return {
        overflow:de.scrollWidth-de.clientWidth,
        headerHeight:visible(header)?header.getBoundingClientRect().height:0,
        surfaces,wraps,info,
        mainRight:mainBox?.right??0,
        footerRight:footerBox?.right??0,
        footerLeft:footerBox?.left??0,
        footerTop:footerBox?.top??null,
        mainBottom:mainBox?.bottom??null
      };
    },pageMaxPx);
    if(r.overflow>1)failures.push(`${rel} @${width}: document horizontal overflow ${r.overflow}px`);
    if(r.headerHeight&&(r.headerHeight<48||r.headerHeight>110))failures.push(`${rel} @${width}: header height ${r.headerHeight.toFixed(1)}px`);
    if(r.mainRight>width+2)failures.push(`${rel} @${width}: main escapes viewport (${r.mainRight.toFixed(1)}px)`);
    if(r.footerRight>width+2||r.footerLeft<-2)failures.push(`${rel} @${width}: footer escapes viewport [${r.footerLeft.toFixed(1)},${r.footerRight.toFixed(1)}]`);
    if(r.footerTop!=null&&r.mainBottom!=null&&r.footerTop<r.mainBottom-2)failures.push(`${rel} @${width}: footer overlaps main content by ${(r.mainBottom-r.footerTop).toFixed(1)}px`);
    for(const w of r.wraps)failures.push(`${rel} @${width}: .wrap exceeds canonical pageMaxPx ${pageMaxPx}px (${w.toFixed(1)}px)`);
    for(const s of r.surfaces){
      if(s.surfaceName==='white'&&s.bg!=='rgb(255, 255, 255)')failures.push(`${rel} @${width}: white surface rendered ${s.bg}`);
      if(s.surfaceName==='soft'&&s.bg!=='rgb(245, 245, 247)')failures.push(`${rel} @${width}: soft surface rendered ${s.bg}`);
      if(s.surfaceName==='dark'&&!['rgb(13, 27, 46)','rgb(32, 37, 48)','rgb(28, 31, 38)'].includes(s.bg))failures.push(`${rel} @${width}: dark surface rendered ${s.bg}`);
    }
    for(const i of r.info){
      if(i.position!=='static')failures.push(`${rel} @${width}: quote info-tip position=${i.position}`);
      if(i.card&&(i.b.left<i.card.left-1||i.b.right>i.card.right+1||i.b.top<i.card.top-1||i.b.bottom>i.card.bottom+1))failures.push(`${rel} @${width}: quote info-tip escapes its option card`);
    }
    checks++;
  }
  await page.close();
}
await browser.close();
if(failures.length){
  console.error(`BANHALMI exhaustive design audit failed (${failures.length} issue(s), ${checks} route/viewport checks):`);
  for(const f of failures.slice(0,250))console.error(`- ${f}`);
  if(failures.length>250)console.error(`... ${failures.length-250} more`);
  process.exit(1);
}
console.log(`BANHALMI exhaustive design audit passed: ${contentFiles.length} content pages × ${widths.length} viewports = ${checks} render checks; document overflow, shell containment, canonical pageMaxPx=${pageMaxPx}, surfaces and quote controls verified against data/design-authority.json.`);
