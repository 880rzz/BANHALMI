import fs from 'node:fs';
import path from 'node:path';

const cssPath='assets/css/mega-menu.css';
const jsPath='assets/js/mega-menu.js';
const configPath='assets/js/site-config.js';
const auditPath='tools/audit-menu-footer-stage63.mjs';
const huAuditPath='tools/audit-hungarian-copy.mjs';
const blueAuditPath='tools/audit-blue-palette-contrast-stage51.mjs';
const packagePath='package.json';
const token='20260810-menu-footer-v63';
const oldToken='20260807-type-accent-v50';

let css=fs.readFileSync(cssPath,'utf8');
if(!css.includes('STAGE63-DESKTOP-MENU-FOOTER:START')){
css += `\n\n/* STAGE63-DESKTOP-MENU-FOOTER:START\n   Desktop navigation is a single-screen editorial overview. The third column\n   is internally split so support, journal, pricing and ART stay visible without\n   viewport scrolling. Mobile keeps the existing scrollable stacked pattern. */\n.site-footer{\n  background:\n    radial-gradient(circle at 72% 0%,rgba(183,156,68,.11) 0,rgba(183,156,68,0) 32%),\n    linear-gradient(145deg,#2D3444 0%,#29303F 46%,#202530 100%)!important;\n}\n@media(min-width:861px){\n  .bn-mega-menu{overflow:hidden!important}\n  .bn-mega-panel{\n    width:min(1440px,100%);height:100dvh;min-height:0;overflow:hidden;\n    display:grid;grid-template-rows:auto minmax(0,1fr);\n    padding:clamp(4.65rem,8vh,5.6rem) clamp(1.75rem,4vw,4.5rem) clamp(.7rem,1.6vh,1.1rem);\n  }\n  .bn-mega-intro{align-items:center;padding-bottom:clamp(.45rem,.8vh,.7rem)}\n  .bn-mega-grid{\n    min-height:0;overflow:hidden;align-content:start;align-items:start;\n    grid-template-columns:minmax(180px,.78fr) minmax(240px,1fr) minmax(440px,1.72fr);\n    gap:clamp(1.5rem,3vw,3.5rem);padding:clamp(.65rem,1.4vh,1rem) 0 0;\n  }\n  .bn-mega-item{padding:.05rem 0 clamp(.26rem,.58vh,.44rem)}\n  .bn-mega-link{font-size:clamp(1.02rem,1.65vh,1.38rem);line-height:1.03;letter-spacing:-.025em}\n  .bn-mega-desc{margin-top:.12rem;font-size:clamp(.65rem,1.02vh,.76rem);line-height:1.24}\n  .bn-mega-section-head{margin-bottom:clamp(.28rem,.55vh,.46rem);padding-bottom:clamp(.28rem,.55vh,.44rem)}\n  .bn-mega-section-head>span{font-size:clamp(.62rem,.95vh,.72rem)}\n  .bn-mega-section-head p{margin-top:.12rem;font-size:clamp(.64rem,1vh,.74rem);line-height:1.22}\n  .bn-mega-service{padding:.03rem 0 clamp(.23rem,.5vh,.38rem)}\n  .bn-mega-service .bn-mega-link{font-size:clamp(.98rem,1.5vh,1.26rem)}\n  .bn-mega-footer{\n    display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));\n    column-gap:clamp(1rem,2vw,2rem);row-gap:0;align-content:start;min-height:0;\n  }\n  .bn-mega-footer .bn-mega-section-head{grid-column:1/-1}\n  .bn-mega-footer .bn-mega-item{min-width:0;padding:.03rem 0 clamp(.22rem,.48vh,.36rem)}\n  .bn-mega-footer .bn-mega-link{font-size:clamp(.88rem,1.28vh,1.08rem)}\n  .bn-mega-footer .bn-mega-desc{font-size:clamp(.61rem,.9vh,.7rem);line-height:1.2}\n  .bn-mega-footer .bn-mega-journal .bn-mega-desc,\n  .bn-mega-footer .bn-mega-cta .bn-mega-desc,\n  .bn-mega-footer .bn-mega-art .bn-mega-desc{display:none}\n  .bn-mega-cta,.bn-mega-art{margin-top:.12rem!important;padding:.45rem .6rem!important;border-radius:10px}\n}\n@media(min-width:861px) and (max-height:760px){\n  .bn-mega-panel{padding-top:4.25rem;padding-bottom:.45rem}\n  .bn-mega-intro p{display:none}\n  .bn-mega-grid{padding-top:.42rem}\n  .bn-mega-desc{display:none}\n  .bn-mega-section-head p{display:none}\n  .bn-mega-item,.bn-mega-service,.bn-mega-footer .bn-mega-item{padding-bottom:.24rem}\n  .bn-mega-link{font-size:clamp(.92rem,1.55vh,1.12rem)}\n  .bn-mega-service .bn-mega-link,.bn-mega-footer .bn-mega-link{font-size:clamp(.86rem,1.35vh,1rem)}\n}\n/* STAGE63-DESKTOP-MENU-FOOTER:END */\n`;
fs.writeFileSync(cssPath,css);
}

let menu=fs.readFileSync(jsPath,'utf8');
menu=menu.replace("cta:'Build Your Package'","cta:'Pricing & packages'")
         .replace("cta:'Projekt összeállítása'","cta:'Árak és csomagajánlatok'")
         .replace("cta:'Paket zusammenstellen'","cta:'Preise & Pakete'");
fs.writeFileSync(jsPath,menu);

let config=fs.readFileSync(configPath,'utf8');
config=config.replace(/mega-menu\.css\?v=[^'\"]+/g,`mega-menu.css?v=${token}`)
             .replace(/mega-menu\.js\?v=[^'\"]+/g,`mega-menu.js?v=${token}`);
fs.writeFileSync(configPath,config);

function walk(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(['.git','node_modules','.github'].includes(e.name)) continue;
    const p=path.join(dir,e.name);
    if(e.isDirectory()) walk(p);
    else if(e.name.endsWith('.html')){
      let h=fs.readFileSync(p,'utf8');
      h=h.replaceAll(`style.css?v=${oldToken}`,`style.css?v=${token}`)
         .replaceAll(`site-config.js?v=${oldToken}`,`site-config.js?v=${token}`);
      fs.writeFileSync(p,h);
    }
  }
}
walk('.');

let huAudit=fs.readFileSync(huAuditPath,'utf8');
huAudit=huAudit.replace("\"cta:'Projekt összeállítása'\"","\"cta:'Árak és csomagajánlatok'\"");
if(!huAudit.includes("cta:'Projekt összeállítása'\", 'kontextusérzékeny")){
  huAudit=huAudit.replace("\"cta:'Csomag összeállítása'\", 'kontextusérzékeny dokumentáció'","\"cta:'Csomag összeállítása'\", \"cta:'Projekt összeállítása'\", 'kontextusérzékeny dokumentáció'");
}
fs.writeFileSync(huAuditPath,huAudit);

let blueAudit=fs.readFileSync(blueAuditPath,'utf8');
blueAudit=blueAudit.replaceAll(oldToken,token).replace('v50 type accent cache token missing','Stage 63 cache token missing');
fs.writeFileSync(blueAuditPath,blueAudit);

const audit=`import fs from 'node:fs';\nconst errors=[];\nconst css=fs.readFileSync('assets/css/mega-menu.css','utf8');\nconst js=fs.readFileSync('assets/js/mega-menu.js','utf8');\nconst config=fs.readFileSync('assets/js/site-config.js','utf8');\nfor(const t of ['STAGE63-DESKTOP-MENU-FOOTER:START','height:100dvh','grid-template-columns:repeat(2,minmax(0,1fr))','max-height:760px','linear-gradient(145deg,#2D3444 0%,#29303F 46%,#202530 100%)'])if(!css.includes(t))errors.push('mega-menu.css missing '+t);\nfor(const t of ['Pricing & packages','Árak és csomagajánlatok','Preise & Pakete'])if(!js.includes(t))errors.push('mega-menu.js missing '+t);\nfor(const t of ['mega-menu.css?v=${token}','mega-menu.js?v=${token}'])if(!config.includes(t))errors.push('site-config.js missing '+t);\nif(errors.length){console.error(errors.join('\\n'));process.exit(1)}\nconsole.log('Stage 63 passed: desktop menu is single-viewport, multilingual pricing labels are semantic, and footer uses the blue gradient authority.');\n`;
fs.writeFileSync(auditPath,audit);

const pkg=JSON.parse(fs.readFileSync(packagePath,'utf8'));
if(!pkg.scripts.audit.includes('audit-menu-footer-stage63.mjs')) pkg.scripts.audit += ' && node tools/audit-menu-footer-stage63.mjs';
pkg.scripts['audit:menu-footer']='node tools/audit-menu-footer-stage63.mjs';
fs.writeFileSync(packagePath,JSON.stringify(pkg,null,2)+'\n');
console.log('Stage 63 menu/footer repair prepared.');
