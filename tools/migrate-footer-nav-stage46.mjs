import fs from 'node:fs';
import path from 'node:path';

const cssPath='assets/css/style.css';
const css=fs.readFileSync(cssPath,'utf8');
const marker='/* STAGE46-FOOTER-VIEWPORT-AND-NAV-CLARITY */';
if(css.includes(marker)) throw new Error('Stage 46 CSS marker already exists');

const replacements=[
  ['Build Your Package','Pricing & quote'],
  ['Projekt összeállítása','Árak és ajánlat'],
  ['Paket zusammenstellen','Preise & Angebot']
];

function walk(dir,out=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(['.git','node_modules','.github'].includes(e.name)) continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory()) walk(full,out);
    else if(e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const files=walk('.');
const before=new Map(replacements.map(([from])=>[from,0]));
for(const file of files){
  const html=fs.readFileSync(file,'utf8');
  for(const [from] of replacements) before.set(from,before.get(from)+(html.split(from).length-1));
}
for(const [from,count] of before){
  if(count===0) throw new Error(`Expected menu/footer label not found: ${from}`);
}

let changed=0;
for(const file of files){
  let html=fs.readFileSync(file,'utf8');
  const original=html;
  for(const [from,to] of replacements) html=html.split(from).join(to);
  if(html!==original){fs.writeFileSync(file,html);changed++;}
}

const stageCss=`\n\n${marker}\n/* Short pages must end on the footer, not expose the white document canvas. */\nhtml,body{min-height:100%}\nbody{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column}\nbody>.site-footer{margin-top:auto;width:100%}\n/* Footer brand uses the high-contrast dark-surface gold; the global brand span uses the light-surface text gold. */\n.site-footer .brand,.site-footer .brand span,.site-footer .brand-word{color:#CBB45F}\n`;
fs.writeFileSync(cssPath,css+stageCss);

for(const file of files){
  const html=fs.readFileSync(file,'utf8');
  for(const [from] of replacements){
    if(html.includes(from)) throw new Error(`Old navigation wording remains in ${file}: ${from}`);
  }
}
console.log(`Stage 46 updated ${changed} HTML files. Counts: ${JSON.stringify(Object.fromEntries(before))}`);
