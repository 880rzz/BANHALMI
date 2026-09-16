import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const base=(process.env.LIVE_PIXEL_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const authority=JSON.parse(fs.readFileSync('data/design-authority.json','utf8'));
const viewports=authority.visualGeometry?.requiredDesktopViewports||[];
const maxHeroFraction=Number(authority.visualGeometry?.homepageHeroMaxViewportFraction||0.92);
const footerFraction=Number(authority.layout?.documentFlow?.footerMaxViewportFractionOnTabletDesktop||0.4);
const footerAbsolute=Number(authority.layout?.documentFlow?.footerAbsoluteMaxPx||360);
const cardWidthTolerance=Number(authority.visualGeometry?.sameRowCardWidthTolerancePx||1);
const cardHeightTolerance=Number(authority.visualGeometry?.sameRowCardHeightTolerancePx||1);
const ctaTolerance=Number(authority.visualGeometry?.ctaYPositionTolerancePx||2);
const reviewsPaddingMax=Number(authority.visualGeometry?.reviewsSectionPaddingMaxPx||72);
const pages=[
  {lang:'en',kind:'home',pathname:'/'},{lang:'en',kind:'portrait',pathname:'/portrait/'},{lang:'en',kind:'brand',pathname:'/lifestyle/'},
  {lang:'hu',kind:'home',pathname:'/hu/'},{lang:'hu',kind:'portrait',pathname:'/hu/portre/'},{lang:'hu',kind:'brand',pathname:'/hu/brand/'},
  {lang:'de-at',kind:'home',pathname:'/de-at/'},{lang:'de-at',kind:'portrait',pathname:'/de-at/portrait/'},{lang:'de-at',kind:'brand',pathname:'/de-at/brand/'}
];
for(const width of [1440,1920,2560,3840]) if(!viewports.some(v=>Number(v.width)===width)) throw new Error(`Live pixel authority missing ${width}px viewport`);
if(authority.visualGeometry?.runtimeGeometryOverridesAllowed!==false) throw new Error('Runtime geometry overrides must be prohibited');

const outDir=path.resolve('artifacts/live-pixel-geometry');
fs.mkdirSync(outDir,{recursive:true});
const failures=[];
const reports=[];
const browser=await chromium.launch({headless:true});

function deltasByRow(items){
  const rows=[];
  for(const item of items){let row=rows.find(r=>Math.abs(r.top-item.top)<=2);if(!row){row={top:item.top,items:[]};rows.push(row)}row.items.push(item)}
  return rows.filter(r=>r.items.length>1).map(row=>{const widths=row.items.map(i=>i.width),heights=row.items.map(i=>i.height),ctas=row.items.map(i=>i.ctaY).filter(Number.isFinite);return {top:row.top,count:row.items.length,widthVariance:Math.max(...widths)-Math.min(...widths),heightVariance:Math.max(...heights)-Math.min(...heights),ctaYVariance:ctas.length>1?Math.max(...ctas)-Math.min(...ctas):0}});
}

for(const vp of viewports){
  const width=Number(vp.width),height=Number(vp.height);
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  for(const target of pages){
    const page=await context.newPage();
    const url=new URL(target.pathname,base).href;
    try{await page.goto(url,{waitUntil:'networkidle',timeout:45000})}catch(error){failures.push(`${width}x${height} ${target.pathname}: navigation ${error.message}`);await page.close();continue}
    await page.evaluate(async()=>{document.documentElement.style.scrollBehavior='auto';const images=[...document.images];for(const image of images)image.loading='eager';for(let y=0;y<document.documentElement.scrollHeight;y+=Math.max(480,innerHeight*.75)){scrollTo(0,y);await new Promise(r=>setTimeout(r,30))}await Promise.all(images.map(image=>image.decode?.().catch(()=>{})||Promise.resolve()));scrollTo(0,0)});
    const result=await page.evaluate(()=>{
      const px=v=>parseFloat(v)||0;
      const visible=el=>{if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};
      const rect=el=>{if(!visible(el))return null;const r=el.getBoundingClientRect();return {top:r.top+scrollY,left:r.left,width:r.width,height:r.height,bottom:r.bottom+scrollY,right:r.right}};
      const footer=document.querySelector('.site-footer'),primary=footer?.querySelector('.footer-grid'),bottom=footer?.querySelector('.footer-bottom'),ecosystem=footer?.querySelector('.banhalmi-ecosystem')||document.querySelector('body>.banhalmi-ecosystem');
      const primaryChildren=primary?[...primary.children].filter(visible).map(rect):[];
      const renderedRows=[...new Set(primaryChildren.map(r=>Math.round(r.top)))].length;
      const bands=[primary,bottom,ecosystem].filter(visible).map(rect);
      const splitVisual=document.querySelector('main[data-homepage-redesign]>.hero-visual-only'),splitCopy=document.querySelector('main[data-homepage-redesign]>.hero-copy-only');
      const hero=splitVisual||document.querySelector('main .hero,main section:first-child');
      let heroRect=rect(hero);
      if(splitVisual&&splitCopy&&visible(splitCopy)){const a=rect(splitVisual),b=rect(splitCopy);heroRect={top:Math.min(a.top,b.top),left:Math.min(a.left,b.left),width:Math.max(a.right,b.right)-Math.min(a.left,b.left),height:Math.max(a.bottom,b.bottom)-Math.min(a.top,b.top),bottom:Math.max(a.bottom,b.bottom),right:Math.max(a.right,b.right)}}
      const heroMedia=[...document.querySelectorAll('main .hero figure,main .hero picture,main .hero img,main>.hero-visual-only figure,main>.hero-visual-only picture,main>.hero-visual-only img')].filter(visible).slice(0,8).map(el=>({tag:el.tagName.toLowerCase(),...rect(el)}));
      const heroChildren=hero?[...hero.children].filter(visible).map(rect):[];
      const next=splitCopy?.nextElementSibling||hero?.nextElementSibling,nextRect=rect(next),background=el=>el?getComputedStyle(el).backgroundColor:null;
      const cardGroups=[...document.querySelectorAll('main .cards,main .service-process-grid,main .archive-cards')].filter(visible).map((grid,index)=>({index,className:String(grid.className||''),cards:[...grid.children].filter(visible).map(card=>{const r=rect(card),cta=[...card.querySelectorAll('.btn,.btn-link,.button,.more,.card-action,.card-cta,.service-actions,.archive-actions')].filter(visible).at(-1),cr=rect(cta);return {...r,ctaY:cr?.top??null}})}));
      const reviews=document.querySelector('main .reviews-drawer-section'),rs=reviews&&visible(reviews)?getComputedStyle(reviews):null;
      return {footer:rect(footer),footerRows:renderedRows,footerBandCount:bands.length,footerBands:{primary:rect(primary),bottom:rect(bottom),ecosystem:rect(ecosystem)},hero:{box:heroRect,topGap:heroRect&&heroChildren.length?Math.min(...heroChildren.map(r=>r.top))-heroRect.top:null,bottomGap:heroRect&&heroChildren.length?heroRect.bottom-Math.max(...heroChildren.map(r=>r.bottom)):null,media:heroMedia},nextSection:{box:nextRect,heroBackground:background(hero),background:background(next),continuous:!!(heroRect&&nextRect&&Math.abs(nextRect.top-heroRect.bottom)<=2)},cardGroups,reviews:rs?{paddingTop:px(rs.paddingTop),paddingBottom:px(rs.paddingBottom)}:null};
    });
    const issues=[];
    if(!result.footer)issues.push('footer missing');else{const allowed=Math.min(Number(vp.footerMaxPx||footerAbsolute),footerAbsolute,height*footerFraction);if(result.footer.height>allowed+1)issues.push(`footer ${result.footer.height.toFixed(1)}px > ${allowed.toFixed(1)}px`)}
    if(result.footerRows!==1)issues.push(`footer primary rendered rows ${result.footerRows} != 1`);
    if(result.footerBandCount!==3)issues.push(`footer visual bands ${result.footerBandCount} != 3`);
    for(const name of ['primary','bottom','ecosystem'])if(!result.footerBands[name])issues.push(`footer ${name} band missing`);
    if(result.reviews&&(result.reviews.paddingTop>reviewsPaddingMax+1||result.reviews.paddingBottom>reviewsPaddingMax+1))issues.push(`reviews padding exceeds ${reviewsPaddingMax}px`);
    if(!result.hero.box)issues.push('hero missing');
    if(!result.hero.media.length)issues.push('hero image/picture/figure geometry missing');
    if(result.hero.box&&target.kind==='home'&&result.hero.box.height>Math.min(Number(vp.homepageHeroMaxPx),height*maxHeroFraction)+2)issues.push('homepage hero exceeds authority');
    if(!result.nextSection.continuous)issues.push('hero-to-next-section background continuity gap');
    for(const group of result.cardGroups)for(const row of deltasByRow(group.cards)){if(row.widthVariance>cardWidthTolerance)issues.push(`${group.className} card width variance ${row.widthVariance.toFixed(1)}px > ${cardWidthTolerance}px`);if(row.heightVariance>cardHeightTolerance)issues.push(`${group.className} card height variance ${row.heightVariance.toFixed(1)}px > ${cardHeightTolerance}px`);if(row.ctaYVariance>ctaTolerance)issues.push(`${group.className} CTA Y variance ${row.ctaYVariance.toFixed(1)}px > ${ctaTolerance}px`)}
    const slug=`${width}x${height}-${target.lang}-${target.kind}`;
    await page.screenshot({path:path.join(outDir,`${slug}.png`),fullPage:true});
    reports.push({viewport:{width,height},...target,geometry:result,issues});
    if(issues.length)failures.push(`${slug}: ${issues.join(' | ')}`);
    await page.close();
  }
  await context.close();
}
await browser.close();

const parity=[];
for(const vp of viewports)for(const kind of ['home','portrait','brand']){const set=reports.filter(r=>r.viewport.width===Number(vp.width)&&r.kind===kind);if(set.length!==3){failures.push(`${vp.width}px ${kind}: language parity missing route`);continue}const footerHeights=set.map(r=>r.geometry.footer?.height).filter(Number.isFinite),footerVariance=Math.max(...footerHeights)-Math.min(...footerHeights),rowCounts=[...new Set(set.map(r=>r.geometry.footerRows))],bandCounts=[...new Set(set.map(r=>r.geometry.footerBandCount))];parity.push({viewport:Number(vp.width),kind,footerHeightVariance:footerVariance,rowCounts,bandCounts});if(rowCounts.length!==1||bandCounts.length!==1)failures.push(`${vp.width}px ${kind}: language footer structure parity failed`);if(footerVariance>footerAbsolute*.15)failures.push(`${vp.width}px ${kind}: language footer height variance ${footerVariance.toFixed(1)}px exceeds 15%`)}
const report={contract:'BANHALMI-LIVE-PIXEL-GEOMETRY-V22',designVersion:authority.version,base,viewports,pages,reports,languageParity:parity,failures};
fs.writeFileSync(path.join(outDir,'report.json'),JSON.stringify(report,null,2));
if(failures.length){console.error(`BANHALMI live pixel geometry failed (${failures.length}):`);failures.forEach(f=>console.error(`- ${f}`));process.exit(1)}
console.log(`BANHALMI live pixel geometry passed: ${pages.length} EN/HU/DE-AT routes across ${viewports.length} desktop/4K viewports; footer bands/rows/boxes, hero gaps/media/continuity, equal cards, CTA alignment and language parity verified.`);
