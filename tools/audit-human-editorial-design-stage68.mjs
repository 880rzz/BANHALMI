import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const css=fs.readFileSync('assets/css/style.css','utf8');
const config=fs.readFileSync('assets/js/site-config.js','utf8');
const errors=[];
const token='20260810-human-editorial-v68';
for(const s of ['STAGE68-HUMAN-EDITORIAL-DESIGN:START','--editorial-reading:68ch','overflow-wrap:anywhere','text-wrap:balance','min-width:0','--editorial-card-pad']) if(!css.includes(s)) errors.push('style.css missing '+s);
if(!config.includes('mega-menu.css?v='+token)||!config.includes('mega-menu.js?v='+token)) errors.push('site-config cache token not Stage68');
const ignored=new Set(['.git','node_modules','redirects']); const files=[];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(ignored.has(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))files.push(p)}} walk(root);
let indexed=0;
for(const f of files){const h=fs.readFileSync(f,'utf8');if(/<link[^>]+rel=["']canonical["']/i.test(h)&&!/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(h)) indexed++;
  for(const m of h.matchAll(/style=["']([^"']+)["']/gi)){const s=m[1];if(/font-size\s*:\s*(?:[0-9](?:\.[0-9]+)?px|0\.[0-7][0-9]*rem)/i.test(s))errors.push(path.relative(root,f)+': inline sub-reading-size text');if(/white-space\s*:\s*nowrap/i.test(s))errors.push(path.relative(root,f)+': inline nowrap can break responsive text');}
  for(const m of h.matchAll(/\/assets\/css\/style\.css\?v=([^"']+)/g)) if(m[1]!==token) errors.push(path.relative(root,f)+': stale style token '+m[1]);
}
const banned=[
 ['portrait/index.html','timeless form'],
 ['hu/portre/index.html','nem csak az alapján, melyik fotó a legerősebb önmagában'],
 ['hu/brand/index.html','nem csak az alapján, melyik fotó a legerősebb önmagában'],
 ['hu/rendezvenyfotozas/index.html','nem csak az alapján, melyik fotó a legerősebb önmagában'],
 ['de-at/portrait/index.html','Das Ergebnis ist nicht nur ein Ordner mit Fotos'],
 ['de-at/brand/index.html','Das Ergebnis ist nicht nur ein Ordner mit Fotos'],
 ['de-at/eventfotografie/index.html','Das Ergebnis ist nicht nur ein Ordner mit Fotos'],
 ['de-at/fine-art/index.html','nicht nur gut aussehen'],
 ['de-at/speier-viko/index.html','nicht nur eine Botschaft dekorieren']
];
for(const [f,s] of banned)if(fs.readFileSync(f,'utf8').includes(s))errors.push(f+': mechanical wording returned: '+s);
for(const f of ['index.html','hu/index.html','de-at/index.html','portrait/index.html','hu/portre/index.html','de-at/portrait/index.html','lifestyle/index.html','hu/brand/index.html','de-at/brand/index.html','event-photography/index.html','hu/rendezvenyfotozas/index.html','de-at/eventfotografie/index.html']){const h=fs.readFileSync(f,'utf8');if(!h.includes('/assets/css/style.css?v='+token))errors.push(f+': missing Stage68 style token');}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Stage68 human editorial + Apple design audit passed across ${files.length} HTML files (${indexed} canonical/indexable surfaces): responsive text safety, shared cache authority and reviewed HU/EN/DE copy are locked.`);
