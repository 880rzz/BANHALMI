import fs from 'node:fs';import path from 'node:path';
const errors=[];const root=process.cwd();const old='20260810-menu-polish-v65',fresh='20260810-menu-frame-hotfix-v66';
const config=fs.readFileSync('assets/js/site-config.js','utf8');const css=fs.readFileSync('assets/css/mega-menu.css','utf8');const js=fs.readFileSync('assets/js/mega-menu.js','utf8');
for(const asset of ['mega-menu.css','mega-menu.js'])if(!config.includes(asset+'?v='+fresh))errors.push('site-config does not request fresh '+asset);
if(!js.includes("'bn-mega-pricing'"))errors.push('pricing entry is not frameless bn-mega-pricing');
if(js.includes("'bn-mega-cta'"))errors.push('legacy framed pricing class is still emitted');
if(!css.includes('STAGE66-MENU-FRAME-HOTFIX:START'))errors.push('final frameless CSS guard missing');
const files=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))files.push(p)}}walk(root);
let checked=0;for(const f of files){const h=fs.readFileSync(f,'utf8');if(!h.includes('/assets/js/site-config.js'))continue;checked++;if(!h.includes('/assets/js/site-config.js?v='+fresh))errors.push(path.relative(root,f)+': stale site-config cache token');if(!h.includes('/assets/css/style.css?v='+fresh))errors.push(path.relative(root,f)+': stale style cache token');if(h.includes('/assets/js/site-config.js?v='+old)||h.includes('/assets/css/style.css?v='+old))errors.push(path.relative(root,f)+': old v65 release reference remains');}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log(`Stage 68 menu frame/cache hotfix passed across ${checked} production HTML pages.`);
