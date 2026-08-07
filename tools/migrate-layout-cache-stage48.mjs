import fs from 'node:fs';
import path from 'node:path';

const root='.';
const cssPath='assets/css/style.css';
const siteConfigPath='assets/js/site-config.js';
const token='20260807-layout-cache-v48';
const marker='/* STAGE48-LAYOUT-CACHE-CONTRACT:START */';

let css=fs.readFileSync(cssPath,'utf8');
if(css.includes(marker)) throw new Error('Stage 48 CSS contract already exists');
css += `\n\n${marker}\n/* Safari-safe document floor + verified trust-card rhythm. */\nhtml{min-height:100%;background:#202530!important}\nbody{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column}\nbody>main,#main{flex:1 0 auto;width:100%;min-width:0}\nbody>.site-footer,.site-footer{flex:0 0 auto;width:100%}\n.trust-proof .grid-3{gap:24px!important;row-gap:24px!important}\n.trust-proof .grid-3>.card{margin:0!important;border-radius:12px}\n@media(max-width:760px){.trust-proof .grid-3{gap:16px!important;row-gap:16px!important}}\n/* STAGE48-LAYOUT-CACHE-CONTRACT:END */\n`;
fs.writeFileSync(cssPath,css);

let config=fs.readFileSync(siteConfigPath,'utf8');
config=config.replace(/\/assets\/css\/mega-menu\.css\?v=[^'\"]+/g,`/assets/css/mega-menu.css?v=${token}`);
config=config.replace(/\/assets\/js\/mega-menu\.js\?v=[^'\"]+/g,`/assets/js/mega-menu.js?v=${token}`);
if(!config.includes(`/assets/css/mega-menu.css?v=${token}`)) throw new Error('mega-menu CSS cache key did not update');
fs.writeFileSync(siteConfigPath,config);

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
walk(root);
let styleRefs=0, configRefs=0, changed=0;
for(const file of files){
  let html=fs.readFileSync(file,'utf8');
  const original=html;
  html=html.replace(/(href=["']\/assets\/css\/style\.css)(?:\?[^"']*)?(["'])/g,(_,a,b)=>{styleRefs++;return `${a}?v=${token}${b}`});
  html=html.replace(/(src=["']\/assets\/js\/site-config\.js)(?:\?[^"']*)?(["'])/g,(_,a,b)=>{configRefs++;return `${a}?v=${token}${b}`});
  if(html!==original){fs.writeFileSync(file,html);changed++;}
}
if(styleRefs<40) throw new Error(`Too few style.css references updated: ${styleRefs}`);
if(configRefs<40) throw new Error(`Too few site-config.js references updated: ${configRefs}`);
for(const file of files){
  const html=fs.readFileSync(file,'utf8');
  if(/\/assets\/css\/style\.css\?v=(?!20260807-layout-cache-v48)/.test(html)) throw new Error(`Stale style cache key in ${file}`);
  if(/\/assets\/js\/site-config\.js\?v=(?!20260807-layout-cache-v48)/.test(html)) throw new Error(`Stale site-config cache key in ${file}`);
}
console.log(`Stage 48: ${changed} HTML files updated; style refs ${styleRefs}; site-config refs ${configRefs}.`);
