import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const base=(process.env.LIVE_PIXEL_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const authority=JSON.parse(fs.readFileSync('data/design-authority.json','utf8'));
const viewports=authority.visualGeometry?.requiredDesktopViewports||[];
const maxHeroFraction=Number(authority.visualGeometry?.homepageHeroMaxViewportFraction||0.92);
const footerFraction=Number(authority.layout?.documentFlow?.footerMaxViewportFractionOnTabletDesktop||0.54);
const footerAbsolute=Number(authority.layout?.documentFlow?.footerAbsoluteMaxPx||480);
const cardTolerance=Number(authority.visualGeometry?.sameRowCardHeightTolerancePx||2);
const cardWidthTolerance=Number(authority.visualGeometry?.sameRowCardWidthTolerancePx||1);
const ctaTolerance=Number(authority.visualGeometry?.sameRowCtaAlignmentTolerancePx||2);
const heroGapTolerance=Number(authority.visualGeometry?.heroEdgeGapTolerancePx||1);
const footerPrimaryRows=Number(authority.visualGeometry?.footerPrimaryRows||1);
const footerVisualBands=Number(authority.visualGeometry?.footerVisualBands||3);
const reviewsPaddingMax=Number(authority.visualGeometry?.reviewsSectionPaddingMaxPx||72);
const megaFirstMax=Number(authority.visualGeometry?.megaMenuFirstContentMaxPx||132);
const megaBottomMax=Number(authority.visualGeometry?.megaMenuBottomWhitespaceMaxPx||104);
const pages=[
  {lang:'en',kind:'home',pathname:'/'},
  {lang:'en',kind:'portrait',pathname:'/portrait/'},
  {lang:'en',kind:'brand',pathname:'/lifestyle/'},
  {lang:'hu',kind:'home',pathname:'/hu/'},
  {lang:'hu',kind:'portrait',pathname:'/hu/portre/'},
  {lang:'hu',kind:'brand',pathname:'/hu/brand/'},
  {lang:'de',kind:'home',pathname:'/de-at/'},
  {lang:'de',kind:'portrait',pathname:'/de-at/portrait/'},
  {lang:'de',kind:'brand',pathname:'/de-at/brand/'}
];
const requiredWidths=[1440,1920,2560,3840];
const actualWidths=viewports.map(v=>Number(v.width));
for(const w of requiredWidths){if(!actualWidths.includes(w)) throw new Error(`Live pixel authority missing ${w}px viewport`)}
if(authority.visualGeometry?.runtimeGeometryOverridesAllowed!==false) throw new Error('Runtime geometry overrides must be prohibited');

const outDir=path.resolve('artifacts/live-pixel-geometry');
fs.mkdirSync(outDir,{recursive:true});
const failures=[];
const reports=[];
const browser=await chromium.launch({headless:true});

function sameRowIssues(cards){
  const rows=[];
  for(const card of cards){
    let row=rows.find(r=>Math.abs(r.top-card.top)<=2);
    if(!row){row={top:card.top,items:[]};rows.push(row)}
    row.items.push(card);
  }
  const issues=[];
  for(const row of rows){
    if(row.items.length<2) continue;
    const hs=row.items.map(i=>i.height),ws=row.items.map(i=>i.width);
    const heightDelta=Math.max(...hs)-Math.min(...hs);
    const widthDelta=Math.max(...ws)-Math.min(...ws);
    const ctas=row.items.map(i=>i.ctaBottom).filter(Number.isFinite);
    const ctaDelta=ctas.length>1?Math.max(...ctas)-Math.min(...ctas):0;
    if(heightDelta>cardTolerance||widthDelta>cardWidthTolerance||ctaDelta>ctaTolerance) issues.push({top:row.top,heightDelta,widthDelta,ctaDelta,heights:hs,widths:ws,ctaBottoms:ctas});
  }
  return issues;
}

for(const vp of viewports){
  const width=Number(vp.width),height=Number(vp.height);
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  for(const target of pages){
    const page=await context.newPage();
    const url=new URL(target.pathname,base).href;
    try{
      await page.goto(url,{waitUntil:'networkidle',timeout:45000});
    }catch(error){
      failures.push(`${width}x${height} ${target.pathname}: navigation ${error.message}`);
      await page.close();
      continue;
    }
    await page.evaluate(async()=>{
      document.documentElement.style.scrollBehavior='auto';
      for(let y=0;y<document.documentElement.scrollHeight;y+=Math.max(500,innerHeight*.8)){
        scrollTo(0,y);
        await new Promise(resolve=>setTimeout(resolve,35));
      }
      await Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});setTimeout(resolve,1500)})));
      scrollTo(0,0);
      await new Promise(resolve=>setTimeout(resolve,100));
    });
    const result=await page.evaluate(({kind})=>{
      const px=v=>parseFloat(v)||0;
      const isVisible=el=>{if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};
      const rect=el=>{const r=el.getBoundingClientRect();return {top:r.top+scrollY,left:r.left,width:r.width,height:r.height,bottom:r.bottom+scrollY,right:r.right}};
      const footer=document.querySelector('.site-footer');
      const footerPrimary=footer?.querySelector('.footer-grid');
      const footerBottom=footer?.querySelector('.footer-bottom');
      const footerEcosystem=footer?.querySelector('.banhalmi-ecosystem')||document.querySelector('body>.banhalmi-ecosystem');
      const reviews=document.querySelector('main .reviews-drawer-section');
      const renderedRows=parent=>{
        if(!parent)return 0;
        const tops=[...parent.children].filter(isVisible).map(el=>rect(el).top).sort((a,b)=>a-b);
        return tops.reduce((rows,top)=>rows.some(value=>Math.abs(value-top)<=2)?rows:[...rows,top],[]).length;
      };
      const footerStyle=footer&&getComputedStyle(footer),primaryStyle=footerPrimary&&getComputedStyle(footerPrimary);
      const data={footer:footer&&isVisible(footer)?{...rect(footer),viewportRatio:rect(footer).height/innerHeight,paddingTop:px(footerStyle.paddingTop),paddingBottom:px(footerStyle.paddingBottom),primary:rect(footerPrimary),bottom:rect(footerBottom),ecosystem:rect(footerEcosystem),primaryRows:renderedRows(footerPrimary),columns:primaryStyle.gridTemplateColumns,rows:primaryStyle.gridTemplateRows,visualBands:[footerPrimary,footerBottom,footerEcosystem].filter(isVisible).length}:null,reviews:null,hero:null,cardFamilies:[],gallery:null,mega:null};
      if(reviews&&isVisible(reviews)){const s=getComputedStyle(reviews);data.reviews={...rect(reviews),paddingTop:px(s.paddingTop),paddingBottom:px(s.paddingBottom)}}
      if(kind==='home'){
        const main=document.querySelector('main[data-homepage-redesign="stage76"]');
        const visual=main?.querySelector(':scope>.hero-visual-only');
        const copy=main?.querySelector(':scope>.hero-copy-only');
        const figure=visual?.querySelector('.hero-figure,figure');
        const picture=figure?.querySelector('picture');
        const image=picture?.querySelector('img');
        const sections=[...main?.querySelectorAll(':scope>section')||[]].filter(isVisible);
        const next=visual&&sections.find(section=>section!==visual&&rect(section).top>=rect(visual).bottom-1);
        if(isVisible(visual)&&isVisible(copy)){
          const vr=rect(visual),cr=rect(copy),fr=rect(figure),pr=rect(picture),ir=rect(image),nr=rect(next);
          data.hero={visual:vr,copy:cr,figure:fr,picture:pr,image:ir,next:nr,height:Math.max(vr.height,cr.height),figureTopGap:fr.top-vr.top,pictureTopGap:pr.top-fr.top,imageTopGap:ir.top-fr.top,imageBottomGap:fr.bottom-ir.bottom,nextGap:nr.top-vr.bottom,nextBackground:getComputedStyle(next).backgroundColor};
        }
      }
      if(kind==='portrait'){
        const gallery=document.querySelector('main .collage-gallery');
        if(gallery&&isVisible(gallery)){
          const s=getComputedStyle(gallery),r=rect(gallery);
          data.gallery={...r,columns:Math.round(px(s.columnCount)),imageCount:gallery.querySelectorAll('img').length,className:String(gallery.className||''),columnGap:px(s.columnGap)};
        }
      }
      const grids=[...document.querySelectorAll('main :is(.fp-decision-grid,.cards,.service-process-grid,.archive-cards)')].filter(isVisible);
      data.cardFamilies=grids.map(grid=>{
        const cards=[...grid.children].filter(el=>isVisible(el)&&el.matches('.card,.fp-choice,.archive-card'));
        return {className:String(grid.className||''),columns:getComputedStyle(grid).gridTemplateColumns,cards:cards.map(card=>{const r=rect(card);const ctas=[...card.querySelectorAll(':scope :is(.more,.btn-link,.btn)')].filter(isVisible);return {...r,ctaBottom:ctas.length?rect(ctas.at(-1)).bottom:null,alignSelf:getComputedStyle(card).alignSelf,display:getComputedStyle(card).display}})};
      }).filter(family=>family.cards.length>1);
      return data;
    },{kind:target.kind});

    const issues=[];
    if(!result.footer) issues.push('footer missing');
    else {
      const allowed=Math.min(Number(vp.footerMaxPx||footerAbsolute),footerAbsolute,height*footerFraction);
      if(result.footer.height>allowed+2) issues.push(`footer ${result.footer.height.toFixed(1)}px > ${allowed.toFixed(1)}px`);
      if(result.footer.primaryRows!==footerPrimaryRows) issues.push(`footer primary rows ${result.footer.primaryRows} != ${footerPrimaryRows}`);
      if(result.footer.visualBands!==footerVisualBands) issues.push(`footer visual bands ${result.footer.visualBands} != ${footerVisualBands}`);
    }
    if(result.reviews&&(result.reviews.paddingTop>reviewsPaddingMax+1||result.reviews.paddingBottom>reviewsPaddingMax+1)) issues.push(`reviews padding ${result.reviews.paddingTop.toFixed(1)}/${result.reviews.paddingBottom.toFixed(1)}px > ${reviewsPaddingMax}px`);
    if(target.kind==='home'){
      if(!result.hero) issues.push('split homepage hero missing');
      else {
        const allowed=Math.min(Number(vp.homepageHeroMaxPx),height*maxHeroFraction);
        if(result.hero.height>allowed+2) issues.push(`homepage hero ${result.hero.height.toFixed(1)}px > ${allowed.toFixed(1)}px`);
        if(Math.abs(result.hero.visual.height-result.hero.copy.height)>2) issues.push(`hero panels differ by ${Math.abs(result.hero.visual.height-result.hero.copy.height).toFixed(1)}px`);
        for(const [label,gap] of Object.entries({figureTop:result.hero.figureTopGap,pictureTop:result.hero.pictureTopGap,imageTop:result.hero.imageTopGap,imageBottom:result.hero.imageBottomGap,next:result.hero.nextGap})) if(Math.abs(gap)>heroGapTolerance) issues.push(`hero ${label} gap ${gap.toFixed(1)}px > ${heroGapTolerance}px`);
      }
    }
    for(const family of result.cardFamilies){
      const rowIssues=sameRowIssues(family.cards);
      if(rowIssues.length){
        const heightDelta=Math.max(...rowIssues.map(x=>x.heightDelta));
        const widthDelta=Math.max(...rowIssues.map(x=>x.widthDelta));
        const ctaDelta=Math.max(...rowIssues.map(x=>x.ctaDelta));
        issues.push(`${family.className||'cards'} variance height ${heightDelta.toFixed(1)}px width ${widthDelta.toFixed(1)}px CTA ${ctaDelta.toFixed(1)}px`);
      }
    }
    if(target.kind==='portrait'){
      if(!result.gallery) issues.push('portrait collage gallery not found');
      else if(result.gallery.columns<Number(vp.portraitGalleryColumns)) issues.push(`portrait gallery ${result.gallery.columns} columns < ${vp.portraitGalleryColumns}`);
    }

    const slug=`${width}x${height}-${target.lang}-${target.kind}`;
    if(target.lang==='en'&&target.kind==='home'){
      const button=page.locator('.menu-btn').first();
      if(await button.count()){
        await button.click();
        await page.waitForTimeout(350);
        const mega=await page.evaluate(()=>{
          const panel=document.querySelector('.bn-mega-panel');
          if(!panel)return null;
          const s=getComputedStyle(panel),pr=panel.getBoundingClientRect();
          if(s.display==='none'||s.visibility==='hidden'||pr.height<=0)return null;
          const candidates=[...panel.querySelectorAll('h2,h3,a,p')].filter(el=>{const x=getComputedStyle(el),r=el.getBoundingClientRect();return x.display!=='none'&&x.visibility!=='hidden'&&r.width>0&&r.height>0});
          if(!candidates.length)return {height:pr.height,firstContent:null,bottomWhitespace:null};
          const rs=candidates.map(el=>el.getBoundingClientRect());
          return {height:pr.height,firstContent:Math.min(...rs.map(r=>r.top))-pr.top,bottomWhitespace:pr.bottom-Math.max(...rs.map(r=>r.bottom))};
        });
        result.mega=mega;
        if(!mega) issues.push('mega menu panel not measurable');
        else {
          if(mega.firstContent!=null&&mega.firstContent>megaFirstMax) issues.push(`mega first content ${mega.firstContent.toFixed(1)}px > ${megaFirstMax}px`);
          if(mega.bottomWhitespace!=null&&mega.bottomWhitespace>megaBottomMax) issues.push(`mega bottom whitespace ${mega.bottomWhitespace.toFixed(1)}px > ${megaBottomMax}px`);
        }
        await page.screenshot({path:path.join(outDir,`${slug}-mega-open.png`),fullPage:false});
        await page.keyboard.press('Escape');
      } else issues.push('mega menu button missing');
    }

    await page.screenshot({path:path.join(outDir,`${slug}.png`),fullPage:true});
    reports.push({viewport:{width,height},...target,geometry:result,issues});
    if(issues.length) failures.push(`${slug}: ${issues.join(' | ')}`);
    await page.close();
  }
  await context.close();
}
await browser.close();
for(const vp of viewports){
  for(const kind of ['home','portrait','brand']){
    const group=reports.filter(r=>r.viewport.width===Number(vp.width)&&r.kind===kind);
    const signatures=new Map();
    for(const item of group){
      item.geometry.cardFamilies.forEach((family,index)=>{
        const key=`${kind}:${index}:${family.className}`;
        const widths=family.cards.map(card=>card.width);
        const value={lang:item.lang,count:family.cards.length,width:widths[0]||0,columns:family.columns};
        if(!signatures.has(key))signatures.set(key,[]);
        signatures.get(key).push(value);
      });
    }
    for(const [key,values] of signatures){
      if(values.length!==3)continue;
      const widthDelta=Math.max(...values.map(v=>v.width))-Math.min(...values.map(v=>v.width));
      if(widthDelta>cardWidthTolerance||new Set(values.map(v=>`${v.count}|${v.columns}`)).size>1) failures.push(`${vp.width} ${key}: EN/HU/DE geometry parity failed ${JSON.stringify(values)}`);
    }
  }
}
const report={contract:'BANHALMI-LIVE-PIXEL-GEOMETRY-V22',designVersion:authority.version,base,viewports,pages,reports,failures};
fs.writeFileSync(path.join(outDir,'report.json'),JSON.stringify(report,null,2));
if(failures.length){
  console.error(`BANHALMI live pixel geometry failed (${failures.length} page/viewport combinations):`);
  failures.forEach(f=>console.error(`- ${f}`));
  process.exit(1);
}
console.log(`BANHALMI live pixel geometry passed: ${pages.length} pages across ${viewports.length} desktop/4K viewports with detailed hero edges, three footer bands, Brand/Portrait, card families, CTA alignment, multilingual parity, portrait gallery and mega-menu geometry verified.`);
