import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl=(process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const siteDir=process.env.AUDIT_SITE_DIR||'_site';
const scope=process.env.LAYOUT_AUDIT_SCOPE||'all';
const widths=(process.env.LAYOUT_AUDIT_WIDTHS||'375,390,430,768,1024,1440').split(',').map(Number).filter(Boolean);

const files=[];
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full);
    else if(entry.name.endsWith('.html')) files.push(full);
  }
}
walk(siteDir);
const source=new Map(files.map(file=>[file,fs.readFileSync(file,'utf8')]));
const faqFiles=files.filter(file=>source.get(file).includes('faq-topic'));
const quoteFiles=files.filter(file=>source.get(file).includes('smart-quote-layout')&&source.get(file).includes('category-card'));
const heroFiles=files.filter(file=>/class=["'][^"']*\bhero\b/.test(source.get(file)));

if((scope==='faq'||scope==='all')&&!faqFiles.length) throw new Error('Layout authority browser audit: no FAQ pages discovered.');
if((scope==='quote'||scope==='all')&&!quoteFiles.length) throw new Error('Layout authority browser audit: no smart quote pages discovered.');

function urlFor(file){
  let rel=file.slice(siteDir.length).replace(/\\/g,'/');
  rel=rel.replace(/index\.html$/,'');
  return baseUrl+rel;
}

const browser=await chromium.launch({headless:true});
const failures=[];
let checks=0;

for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:1200}});

  if(scope==='faq'||scope==='all'){
    for(const file of faqFiles){
      await page.goto(urlFor(file),{waitUntil:'networkidle'});
      const result=await page.evaluate(()=>{
        const topics=[...document.querySelectorAll('section.faq-topic')];
        const topicBands=topics.map(el=>{const c=getComputedStyle(el);return {pt:parseFloat(c.paddingTop)||0,pb:parseFloat(c.paddingBottom)||0}});
        const header=document.querySelector('.site-header');
        const main=document.querySelector('main');
        const firstHeading=main?.querySelector('h1,h2');
        const gap=header&&firstHeading?firstHeading.getBoundingClientRect().top-header.getBoundingClientRect().bottom:null;
        return {topicBands,gap,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
      });
      if(result.topicBands.some(x=>x.pt>=50||x.pb>=50)) failures.push(`${file} @${width}: nested FAQ topic inherited page-band padding ${JSON.stringify(result.topicBands)}`);
      if(result.gap!=null&&result.gap>190) failures.push(`${file} @${width}: header-to-first-heading gap ${result.gap.toFixed(1)}px`);
      if(result.overflow>1) failures.push(`${file} @${width}: horizontal overflow ${result.overflow}px`);
      checks++;
    }
  }

  if(scope==='quote'||scope==='all'){
    for(const file of quoteFiles){
      await page.goto(urlFor(file),{waitUntil:'networkidle'});
      const result=await page.evaluate(()=>{
        const cards=[...document.querySelectorAll('.smart-quote-layout .category-card')];
        const failures=[];
        for(const card of cards){
          const cr=card.getBoundingClientRect();
          const info=card.querySelector('.info-tip');
          const desc=card.querySelector('em');
          const title=card.querySelector('strong');
          const input=card.querySelector('input');
          const nodes=[info,desc,title,input].filter(Boolean);
          const bottoms=nodes.map(n=>n.getBoundingClientRect().bottom);
          const slack=bottoms.length?cr.bottom-Math.max(...bottoms):cr.height;
          const pos=info?getComputedStyle(info).position:null;
          const ir=info?.getBoundingClientRect();
          if(pos!=='static') failures.push(`info position=${pos}`);
          if(slack>34) failures.push(`bottom slack=${slack.toFixed(1)}px`);
          if(cr.height>180) failures.push(`card height=${cr.height.toFixed(1)}px`);
          if(ir&&(ir.left<cr.left-1||ir.right>cr.right+1||ir.top<cr.top-1||ir.bottom>cr.bottom+1)) failures.push('info control outside card bounds');
        }
        return {count:cards.length,failures,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
      });
      if(!result.count) failures.push(`${file} @${width}: no quote category cards rendered`);
      for(const failure of result.failures) failures.push(`${file} @${width}: ${failure}`);
      if(result.overflow>1) failures.push(`${file} @${width}: horizontal overflow ${result.overflow}px`);
      checks++;
    }
  }

  if(scope==='hero'||scope==='all'){
    for(const file of heroFiles){
      await page.goto(urlFor(file),{waitUntil:'networkidle'});
      const result=await page.evaluate(()=>{
        const header=document.querySelector('.site-header');
        const hero=document.querySelector('main .hero, main>section.hero, .hero');
        if(!header||!hero) return null;
        const gap=hero.getBoundingClientRect().top-header.getBoundingClientRect().bottom;
        return {gap,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
      });
      if(result&&result.gap>4) failures.push(`${file} @${width}: header-to-hero box gap ${result.gap.toFixed(1)}px`);
      if(result&&result.overflow>1) failures.push(`${file} @${width}: horizontal overflow ${result.overflow}px`);
      checks++;
    }
  }

  await page.close();
}
await browser.close();

if(failures.length){
  console.error(`Layout authority browser audit failed (${failures.length} issue(s), ${checks} route/viewport checks):`);
  for(const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Layout authority browser audit passed (${checks} route/viewport checks; scope=${scope}).`);
