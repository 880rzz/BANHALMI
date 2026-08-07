import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
let refs=0;
function walk(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(['.git','node_modules','.github'].includes(e.name)) continue;
    const p=path.join(dir,e.name);
    if(e.isDirectory()) walk(p);
    else if(e.name.endsWith('.html')){
      let s=fs.readFileSync(p,'utf8');
      const n=(s.match(/site-config\.js\?v=20260807-blue-palette-v49/g)||[]).length;
      if(n){refs+=n;s=s.replaceAll('site-config.js?v=20260807-blue-palette-v49','site-config.js?v=20260807-type-accent-v50');fs.writeFileSync(p,s)}
    }
  }
}
walk(root);
if(refs<40) throw new Error(`expected >=40 site-config v49 refs, found ${refs}`);
console.log(`BANHALMI site-config cache aligned to v50 on ${refs} references.`);
