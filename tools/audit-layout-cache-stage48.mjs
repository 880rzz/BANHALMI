import fs from 'node:fs';
import path from 'node:path';

const css=fs.readFileSync('assets/css/style.css','utf8');
const config=fs.readFileSync('assets/js/site-config.js','utf8');
const token='20260807-layout-cache-v48';
const errors=[];

for(const required of [
  'STAGE48-LAYOUT-CACHE-CONTRACT:START',
  'html{min-height:100%;background:#202530!important}',
  'body>main,#main{flex:1 0 auto;width:100%;min-width:0}',
  '.trust-proof .grid-3{gap:24px!important;row-gap:24px!important}',
  '@media(max-width:760px){.trust-proof .grid-3{gap:16px!important;row-gap:16px!important}}'
]) if(!css.includes(required)) errors.push(`style.css missing: ${required}`);

if(!config.includes(`/assets/css/mega-menu.css?v=${token}`)) errors.push('site-config.js mega-menu CSS cache token mismatch');
if(!config.includes(`/assets/js/mega-menu.js?v=${token}`)) errors.push('site-config.js mega-menu JS cache token mismatch');

const skip=new Set(['.git','node_modules','.github']);
const files=[];
function walk(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(skip.has(e.name)) continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory()) walk(full);
    else if(e.name.endsWith('.html')) files.push(full);
  }
}
walk('.');
let styleRefs=0, configRefs=0;
for(const file of files){
  const html=fs.readFileSync(file,'utf8');
  for(const m of html.matchAll(/\/assets\/css\/style\.css\?v=([^"']+)/g)){
    styleRefs++;
    if(m[1]!==token) errors.push(`${file}: stale style.css token ${m[1]}`);
  }
  for(const m of html.matchAll(/\/assets\/js\/site-config\.js\?v=([^"']+)/g)){
    configRefs++;
    if(m[1]!==token) errors.push(`${file}: stale site-config.js token ${m[1]}`);
  }
}
if(styleRefs<40) errors.push(`Expected >=40 versioned style.css refs, found ${styleRefs}`);
if(configRefs<40) errors.push(`Expected >=40 versioned site-config.js refs, found ${configRefs}`);

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Stage 48 layout/cache audit passed: ${styleRefs} style refs, ${configRefs} site-config refs, Safari footer floor and trust spacing are canonical.`);
