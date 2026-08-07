import fs from 'node:fs';
import path from 'node:path';

const oldToken='20260807-layout-cache-v48';
const newToken='20260807-blue-palette-v49';
let changed=0;
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(['.git','node_modules'].includes(entry.name)) continue;
    const p=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(p);
    else if(entry.name.endsWith('.html')){
      let s=fs.readFileSync(p,'utf8');
      if(s.includes(oldToken)){
        s=s.replaceAll(oldToken,newToken);
        fs.writeFileSync(p,s); changed++;
      }
    }
  }
}
walk('.');
let cfg=fs.readFileSync('assets/js/site-config.js','utf8');
if(!cfg.includes(oldToken)) throw new Error('site-config old cache token missing');
cfg=cfg.replaceAll(oldToken,newToken);
fs.writeFileSync('assets/js/site-config.js',cfg);
if(changed<10) throw new Error(`Unexpectedly few HTML cache updates: ${changed}`);
console.log(`Propagated ${newToken} across ${changed} HTML files and site-config.js.`);
// Stage 50 rerun marker: retry after concurrent CI commits advanced main.
