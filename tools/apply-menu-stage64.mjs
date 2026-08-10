import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const oldToken='20260810-menu-footer-v63';
const newToken='20260810-menu-fullscreen-v64';

function read(p){return fs.readFileSync(path.join(root,p),'utf8')}
function write(p,s){fs.writeFileSync(path.join(root,p),s,'utf8')}

let js=read('assets/js/mega-menu.js');
const journalBuild=/var jh=document\.createElement\('div'\);jh\.className='bn-mega-section-head bn-mega-journal-head';jh\.innerHTML='<span>'\+t\.journalTitle\+'<\\\/span>';foot\.append\(jh\);t\.journal\.forEach\(function\(x\)\{foot\.append\(node\(x,'bn-mega-journal'\)\);\}\);/;
if(!journalBuild.test(js)) throw new Error('Journal build block not found');
js=js.replace(journalBuild,'');
write('assets/js/mega-menu.js',js);

let css=read('assets/css/mega-menu.css');
if(!css.includes('STAGE64-ART-LIKE-FULLSCREEN-MENU:START')){
css += `\n\n/* STAGE64-ART-LIKE-FULLSCREEN-MENU:START\n   Business navigation now follows the calmer ART full-screen rhythm: no blog\n   catalogue in the menu, three balanced editorial columns, generous spacing,\n   and one-screen desktop composition. */\n@media(min-width:861px){\n  .bn-mega-panel{\n    width:min(1320px,100%);\n    padding:clamp(6rem,10vh,7.6rem) clamp(2.5rem,6vw,6rem) clamp(2rem,4vh,3rem)!important;\n    grid-template-rows:auto minmax(0,1fr)!important;\n  }\n  .bn-mega-intro{padding-bottom:clamp(1rem,2vh,1.5rem)!important}\n  .bn-mega-grid{\n    grid-template-columns:repeat(3,minmax(0,1fr))!important;\n    gap:clamp(2.75rem,5vw,6rem)!important;\n    align-content:center!important;\n    padding:clamp(1.75rem,4vh,3rem) 0 0!important;\n  }\n  .bn-mega-item,.bn-mega-service,.bn-mega-footer .bn-mega-item{padding:.18rem 0 clamp(.72rem,1.35vh,1rem)!important}\n  .bn-mega-link{font-size:clamp(1.45rem,2.45vh,2.15rem)!important;line-height:1.04!important}\n  .bn-mega-service .bn-mega-link{font-size:clamp(1.25rem,2vh,1.72rem)!important}\n  .bn-mega-footer{display:block!important}\n  .bn-mega-footer .bn-mega-link{font-size:clamp(1.15rem,1.8vh,1.5rem)!important}\n  .bn-mega-desc,.bn-mega-footer .bn-mega-desc{display:block!important;font-size:clamp(.78rem,1.15vh,.92rem)!important;line-height:1.42!important}\n  .bn-mega-section-head{margin-bottom:1rem!important;padding-bottom:.8rem!important}\n  .bn-mega-section-head>span{font-size:.75rem!important}\n  .bn-mega-cta,.bn-mega-art{margin-top:.65rem!important;padding:.85rem 1rem!important;border-radius:12px!important}\n  .bn-mega-journal-head,.bn-mega-journal{display:none!important}\n}\n@media(max-width:860px){\n  .bn-mega-journal-head,.bn-mega-journal{display:none!important}\n}\n/* STAGE64-ART-LIKE-FULLSCREEN-MENU:END */\n`;
}
write('assets/css/mega-menu.css',css);

for(const file of ['assets/js/site-config.js','tools/audit-menu-footer-stage63.mjs']){
  let s=read(file).replaceAll(oldToken,newToken);
  write(file,s);
}

const audit=`import fs from 'node:fs';\nconst errors=[];\nconst js=fs.readFileSync('assets/js/mega-menu.js','utf8');\nconst css=fs.readFileSync('assets/css/mega-menu.css','utf8');\nconst config=fs.readFileSync('assets/js/site-config.js','utf8');\nif(/bn-mega-journal-head/.test(js.split('function build')[1]||''))errors.push('journal heading is still rendered in menu');\nif(/t\\.journal\\.forEach/.test(js.split('function build')[1]||''))errors.push('journal links are still rendered in menu');\nfor(const t of ['STAGE64-ART-LIKE-FULLSCREEN-MENU:START','grid-template-columns:repeat(3,minmax(0,1fr))','align-content:center','bn-mega-journal-head,.bn-mega-journal'])if(!css.includes(t))errors.push('missing Stage64 CSS '+t);\nfor(const t of ['mega-menu.css?v=${newToken}','mega-menu.js?v=${newToken}'])if(!config.includes(t))errors.push('cache token missing '+t);\nif(errors.length){console.error(errors.join('\\n'));process.exit(1)}\nconsole.log('Stage 64 passed: BANHALMI menu is blog-free, full-screen, balanced and cache-busted.');\n`;
write('tools/audit-menu-fullscreen-stage64.mjs',audit);

let pkg=JSON.parse(read('package.json'));
if(!pkg.scripts.audit.includes('audit-menu-fullscreen-stage64.mjs')) pkg.scripts.audit += ' && node tools/audit-menu-fullscreen-stage64.mjs';
write('package.json',JSON.stringify(pkg,null,2)+'\n');

function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(?:html|js|mjs|css)$/.test(e.name)){let s=fs.readFileSync(p,'utf8');const n=s.replaceAll(oldToken,newToken);if(n!==s)fs.writeFileSync(p,n,'utf8')}}}
walk(root);
console.log('Stage64 menu migration applied.');
