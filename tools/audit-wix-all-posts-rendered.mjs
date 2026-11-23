/**
 * Read-only exhaustive published Wix browser audit.
 * One actual Chromium DOM/render at a representative viewport for EACH of
 * 555 published posts; additionally, 7 categories and the homepage in each
 * language at mobile and desktop widths. This is not a human aesthetic
 * approval, image provenance statement, or 7-viewports-per-article audit.
 *
 * npm ci && npx playwright install --with-deps chromium
 * WIX_LOCALE=hu node tools/audit-wix-all-posts-rendered.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium, devices } from 'playwright';

const LANG = process.env.WIX_LOCALE;
if (!['hu','en','de'].includes(LANG)) {
  console.error('WIX_LOCALE must be one of hu,en,de'); process.exit(2);
}
const fixture = JSON.parse(fs.readFileSync('tools/fixtures/wix-20261123-live-urls.json','utf8'));
const posts = fixture.posts.filter(x => x.lang === LANG);
if (fixture.posts.length !== 555 || posts.length !== 185)
  throw new Error('Fixture not in expected 555/185 trilingual state — refresh from published Wix API first');

const categories = {
  hu: [
    'vipach-fotografiai-kozosseg','noi-tortenetek','lifestyle-es-portfoliofotozas',
    'no-filter-oszinte-tortenetek','aktfotozas-muveszi-szemmel','portre-es-headshotfotozas','fototortenelem'
  ],
  en: [
    'vipach-photography-community','womens-stories','portrait-portfolio-photography',
    'no-filter-honest-stories','fine-art-nude-photography','portrait-headshot-photography','photography-history'
  ],
  de: [
    'vipach-fotografie-community','geschichten-von-frauen','portraet-portfoliofotografie',
    'no-filter-ehrliche-geschichten','kuenstlerische-aktfotografie','portraet-headshotfotografie','fotogeschichte'
  ]
};
const BASE = 'https://blog.banhalmi.art';
const prefix = LANG === 'hu' ? '' : '/' + LANG;
const pages = [];
posts.forEach((item,i) => {
  const width = [390,768,1440][i%3];
  pages.push({type:'post',url:item.url,width,lang:LANG,index:i});
});
for(const slug of categories[LANG]) {
  for(const width of [390,1440]) {
    pages.push({type:'category',url:BASE+prefix+'/blog/categories/'+slug,width,lang:LANG});
  }
}
for(const width of [390,1440]) {
  pages.push({type:'home',url:BASE+(prefix||'/'),width,lang:LANG});
}
const out='artifacts/wix-555-rendered/'+LANG;
fs.mkdirSync(out,{recursive:true});
const failures=[],warnings=[],rows=[];
const shouldScreenshot=(entry,issueCount) => entry.type!=='post' || (entry.index%15===0) || issueCount>0;
const expectedHost='blog.banhalmi.art';
const browser=await chromium.launch({headless:true});
let next=0;
const canonicalComparable=(raw) => {
  try {
    const u=new URL(raw);
    return u.protocol+'//'+u.host+u.pathname.replace(/\/+$/,'');
  } catch { return null; }
};
async function run(entry) {
  const options=entry.width<500 ?
    {...devices['iPhone 13'],viewport:{width:entry.width,height:844}} :
    entry.width<=1024 ? {...devices['iPad (gen 7)'],viewport:{width:entry.width,height:1024}} :
    {viewport:{width:entry.width,height:900},deviceScaleFactor:1};
  const ctx=await browser.newContext(options);
  const p=await ctx.newPage();
  const rec={type:entry.type,url:entry.url,lang:entry.lang,width:entry.width,
    status:null,finalUrl:null,canonical:null,title:null,visibleH1:false,
    visibleImages:0,imagesWithMissingAlt:0,bodyLength:0,overflow:0,
    possibleCoverHero:false,ogImage:false,externalLinks:0,
    issues:[],advisories:[],screenshot:null};
  try {
    for(let attempt=0;attempt<2;attempt++) {
      const response=await p.goto(entry.url,{waitUntil:'domcontentloaded',timeout:45000})
        .catch(e=>{ if(attempt)throw e; return null;});
      rec.status=response?.status()??0;
      rec.finalUrl=p.url();
      await p.waitForTimeout(1550+(attempt*1200));
      if(rec.status===200) {
        const f=await p.evaluate(() => {
          const visible=el => {
            const r=el.getBoundingClientRect();
            const s=getComputedStyle(el);
            return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden';
          };
          const imgs=[...document.querySelectorAll('img')].filter(visible);
          const allLinks=[...document.querySelectorAll('a[href]')];
          const innerText=document.body?.innerText||'';
          const og=document.querySelector('meta[property="og:image"]')?.getAttribute('content')||null;
          return {
            canonical:document.querySelector('link[rel="canonical"]')?.getAttribute('href')||null,
            title:document.title||null,
            visibleH1:[...document.querySelectorAll('h1')].some(visible),
            visibleImages:imgs.length,
            imagesWithMissingAlt:imgs.filter(x=>!x.hasAttribute('alt')).length,
            bodyLength:innerText.length,
            overflow:Math.max(document.documentElement.scrollWidth,document.body?.scrollWidth||0)-innerWidth,
            possibleCoverHero:imgs.some(img=>{
              const r=img.getBoundingClientRect();
              return r.top>=0&&r.top<220&&r.width>innerWidth*.84&&r.height>Math.min(440,innerHeight*.52);
            }),
            ogImage:Boolean(og),
            externalLinks:allLinks.filter(a=>{try{return new URL(a.href).host!==location.host;}catch{return false;}}).length
          };
        });
        Object.assign(rec,f);
        if(rec.visibleH1&&rec.title&&rec.canonical)break;
      }
      if(attempt===0) await p.waitForTimeout(600);
    }
    if(rec.status!==200)rec.issues.push('HTTP '+rec.status);
    if(canonicalComparable(rec.finalUrl)!==canonicalComparable(entry.url))rec.issues.push('Unexpected final URL '+rec.finalUrl);
    if(!rec.visibleH1)rec.issues.push('No visible H1 after stable browser render and retry');
    if(!rec.title?.trim())rec.issues.push('Missing rendered title');
    if(entry.type==='post'&&canonicalComparable(rec.canonical)!==canonicalComparable(entry.url))
      rec.issues.push('Unexpected self-canonical '+rec.canonical);
    if(rec.overflow>24)rec.issues.push('Horizontal document overflow '+rec.overflow+'px');
    else if(rec.overflow>8)rec.advisories.push('Small overflow '+rec.overflow+'px');
    if(rec.possibleCoverHero)rec.advisories.push('Review potential large lead image (may be legitimate in-body media)');
    if(entry.type==='post'&&!rec.ogImage)rec.advisories.push('Missing visible og:image meta (may be non-image article)');
    if(entry.type==='post'&&rec.bodyLength<250)rec.advisories.push('Very short rendered page text; inspect manually');
    if(rec.imagesWithMissingAlt)rec.advisories.push('Images missing alt attribute '+rec.imagesWithMissingAlt+' (decorative unknown)');
    if(shouldScreenshot(entry,rec.issues.length)) {
      const name=entry.type+'-'+(entry.index??categories[LANG].indexOf(entry.url.split('/').at(-1)))+'-'+entry.width+'.png';
      rec.screenshot=name;
      await p.screenshot({path:path.join(out,name),fullPage:false,timeout:15000})
        .catch(e=>{rec.advisories.push('Screenshot unavailable: '+String(e?.message||e).slice(0,90));});
    }
  } catch(err) {
    rec.issues.push('Browser error '+String(err?.message||err).slice(0,240));
  } finally {
    await ctx.close();
    rows.push(rec);
    if(rec.issues.length)failures.push({url:rec.url,width:rec.width,issues:rec.issues});
    if(rec.advisories.length)warnings.push({url:rec.url,width:rec.width,advisories:rec.advisories});
  }
}
async function worker() {
  while(next<pages.length) {
    const entry=pages[next++];
    await run(entry);
    await new Promise(resolve=>setTimeout(resolve,300));
  }
}
try {await Promise.all([worker(),worker()]);}
finally {await browser.close();}
rows.sort((a,b)=>a.url.localeCompare(b.url)||a.width-b.width);
const summary={
  locale:LANG,generatedAt:new Date().toISOString(),fixtureCount:fixture.posts.length,
  checkedPosts:rows.filter(x=>x.type==='post').length,
  checkedCategories:rows.filter(x=>x.type==='category').length,
  checkedHomes:rows.filter(x=>x.type==='home').length,
  viewportCounts:rows.reduce((acc,x)=>{acc[x.width]=(acc[x.width]||0)+1;return acc;},{}),
  failures:failures.length,warnings:warnings.length,
  possibleLargeLeads:rows.filter(x=>x.possibleCoverHero).length,
  screenshotCount:rows.filter(x=>x.screenshot).length
};
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({summary,scope:'Chromium rendered DOM every article at exactly one of 390/768/1440 (rotating) and all seven category pages and homepage at 390 and 1440 for one locale. Read-only. Human editorial judgment and authoritative creator/license provenance are NOT automated proofs.',rows,failures,warnings},null,2)+'\n');
console.log('WIX-555-RENDERED '+JSON.stringify(summary));
for(const x of failures.slice(0,30))console.error('FAIL '+JSON.stringify(x));
for(const x of warnings.slice(0,20))console.warn('ADVISORY '+JSON.stringify(x));
if(rows.filter(x=>x.type==='post').length!==185||
  rows.filter(x=>x.type==='category').length!==14||
  rows.filter(x=>x.type==='home').length!==2||failures.length)process.exitCode=1;
