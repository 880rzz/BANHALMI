import fs from 'node:fs';
import path from 'node:path';

const oldToken='20260810-menu-fullscreen-v64';
const newToken='20260810-menu-polish-v65';
const skip=new Set(['.git','node_modules']);
function walk(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(skip.has(e.name)) continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory()) walk(full);
    else if(/\.(html|css|js|mjs|json|md|txt)$/i.test(e.name)){
      const src=fs.readFileSync(full,'utf8');
      if(src.includes(oldToken)) fs.writeFileSync(full,src.split(oldToken).join(newToken),'utf8');
    }
  }
}
walk('.');

const jsFile='assets/js/mega-menu.js';
let js=fs.readFileSync(jsFile,'utf8');
const before="foot.append(node([art,t.art,t.artDesc],'bn-mega-art'));grid.append(main,svc,foot);";
const after="main.append(node([art,t.art,t.artDesc],'bn-mega-art'));grid.append(main,svc,foot);";
if(!js.includes(after)){
  if(!js.includes(before)) throw new Error('mega-menu ART placement anchor missing');
  js=js.replace(before,after);
  fs.writeFileSync(jsFile,js,'utf8');
}

const cssFile='assets/css/mega-menu.css';
let css=fs.readFileSync(cssFile,'utf8');
if(!css.includes('STAGE65-MENU-POLISH:START')){
css += `\n\n/* STAGE65-MENU-POLISH:START\n   Desktop menu refinement: active state has no pill/frame, typography is easier\n   to read, CTA labels have breathing room, and BANHALMI ART belongs with the\n   oeuvre/archive group instead of the support column. */\n:root{--bn-menu-gold:#D3B85A;--bn-menu-soft:#C4CFDA;--bn-menu-line:rgba(211,184,90,.28)}\n.bn-mega-link.active,.bn-mega-link[aria-current=\"page\"]{\n  border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important;\n  border-radius:0!important;padding-left:0!important;padding-right:0!important;\n  text-decoration-line:underline!important;text-decoration-thickness:1px!important;text-underline-offset:.22em!important;\n}\n.bn-mega-cta,.bn-mega-art{box-sizing:border-box!important;padding:1rem 1.15rem!important}\n.bn-mega-primary .bn-mega-art{margin-top:.55rem!important}\n@media(min-width:861px){\n  .bn-mega-grid{grid-template-columns:minmax(210px,.9fr) minmax(270px,1.08fr) minmax(420px,1.58fr)!important;gap:clamp(1.8rem,3.4vw,4rem)!important}\n  .bn-mega-link{font-size:clamp(1.16rem,1.95vh,1.58rem)!important;line-height:1.07!important}\n  .bn-mega-desc{font-size:clamp(.79rem,1.34vh,.95rem)!important;line-height:1.38!important;margin-top:.28rem!important}\n  .bn-mega-service .bn-mega-link{font-size:clamp(1.14rem,1.82vh,1.48rem)!important}\n  .bn-mega-footer .bn-mega-link{font-size:clamp(1.05rem,1.64vh,1.34rem)!important}\n  .bn-mega-footer .bn-mega-desc{font-size:clamp(.77rem,1.28vh,.91rem)!important}\n  .bn-mega-section-head>span{font-size:clamp(.72rem,1.22vh,.84rem)!important}\n  .bn-mega-section-head p{font-size:clamp(.78rem,1.28vh,.92rem)!important}\n  .bn-mega-cta,.bn-mega-primary .bn-mega-art{padding:clamp(.82rem,1.4vh,1.05rem) clamp(1rem,1.7vw,1.3rem)!important}\n}\n/* STAGE65-MENU-POLISH:END */\n`;
fs.writeFileSync(cssFile,css,'utf8');
}

const testFile='tools/audit-menu-polish-stage65.mjs';
fs.writeFileSync(testFile,`import fs from 'node:fs';\nconst js=fs.readFileSync('assets/js/mega-menu.js','utf8');\nconst css=fs.readFileSync('assets/css/mega-menu.css','utf8');\nconst config=fs.readFileSync('assets/js/site-config.js','utf8');\nconst errors=[];\nfor(const t of ['STAGE65-MENU-POLISH:START','--bn-menu-gold:#D3B85A','border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important','padding:1rem 1.15rem!important'])if(!css.includes(t))errors.push('missing '+t);\nif(!js.includes(\"main.append(node([art,t.art,t.artDesc],'bn-mega-art'))\"))errors.push('BANHALMI ART is not in the primary oeuvre column');\nif(js.includes(\"foot.append(node([art,t.art,t.artDesc],'bn-mega-art'))\"))errors.push('BANHALMI ART still rendered in support column');\nfor(const t of ['mega-menu.css?v=20260810-menu-polish-v65','mega-menu.js?v=20260810-menu-polish-v65'])if(!config.includes(t))errors.push('stale menu cache token '+t);\nfunction ch(v){v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}function lum(h){h=h.replace('#','');const a=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16));return .2126*ch(a[0])+.7152*ch(a[1])+.0722*ch(a[2])}function cr(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}\nfor(const bg of ['#202530','#29303F','#2D3444']){const r=cr('#D3B85A',bg);if(r<4.5)errors.push('menu gold contrast '+r.toFixed(2)+' on '+bg);}\nif(errors.length){console.error(errors.join('\\n'));process.exit(1)}console.log('Stage 65 passed: menu active state is frameless, BANHALMI ART sits with the oeuvre group, CTA padding is safe, desktop type is larger, and dark-surface gold remains WCAG AA.');\n`,'utf8');

const pkgFile='package.json';
const pkg=JSON.parse(fs.readFileSync(pkgFile,'utf8'));
if(!pkg.scripts.audit.includes('audit-menu-polish-stage65.mjs')) pkg.scripts.audit += ' && node tools/audit-menu-polish-stage65.mjs';
fs.writeFileSync(pkgFile,JSON.stringify(pkg,null,2)+'\n');
console.log('Stage 65 menu polish applied.');
