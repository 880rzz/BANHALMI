import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const cssPath=path.join(root,'assets/css/style.css');
let css=fs.readFileSync(cssPath,'utf8');
if(css.includes('--title-accent:')) throw new Error('title accent token already exists');
if(!css.includes('--navy-soft:#2D3444;')) throw new Error('navy-soft anchor missing');
css=css.replace('--navy-soft:#2D3444;','--navy-soft:#2D3444;\n  --title-accent:#2F6F78; /* WCAG AA on #fff and #f5f5f7; reserved for sparse display emphasis */');
css += '\n\n/* STAGE52-TYPE-ACCENT:START — sparse Apple-like semantic emphasis */\n.title-accent{color:var(--title-accent)}\n.title-accent--block{display:block}\n/* STAGE52-TYPE-ACCENT:END */\n';
fs.writeFileSync(cssPath,css);

const replacements={
  'index.html':[
    ['<h1>I photograph leaders and organisations for the places where their images actually need to work.</h1>','<h1>I photograph leaders and organisations <span class="title-accent title-accent--block">for the places where their images actually need to work.</span></h1>'],
    ['<h2>Throughout my life, I have explored presence through photography.</h2>','<h2>Throughout my life, I have explored <span class="title-accent title-accent--block">presence through photography.</span></h2>']
  ],
  'hu/index.html':[
    ['<h1>Vezetői portrék és vizuális pozicionálás vezetőknek és szervezeteknek.</h1>','<h1>Vezetői portrék és <span class="title-accent title-accent--block">vizuális pozicionálás vezetőknek és szervezeteknek.</span></h1>'],
    ['<h2>Egész életemben a fotográfián keresztül a jelenlétet kutattam.</h2>','<h2>Egész életemben a fotográfián keresztül <span class="title-accent title-accent--block">a jelenlétet kutattam.</span></h2>']
  ],
  'de-at/index.html':[
    ['<h1>Ich fotografiere Führungskräfte und Organisationen für die Situationen, in denen ihre Bilder tatsächlich funktionieren müssen.</h1>','<h1>Ich fotografiere Führungskräfte und Organisationen <span class="title-accent title-accent--block">für die Situationen, in denen ihre Bilder tatsächlich funktionieren müssen.</span></h1>'],
    ['<h2>Mein ganzes Leben lang habe ich durch die Fotografie Präsenz erforscht.</h2>','<h2>Mein ganzes Leben lang habe ich durch die Fotografie <span class="title-accent title-accent--block">Präsenz erforscht.</span></h2>']
  ]
};
for(const [file,pairs] of Object.entries(replacements)){
  const p=path.join(root,file); let html=fs.readFileSync(p,'utf8');
  for(const [from,to] of pairs){const n=html.split(from).length-1;if(n!==1)throw new Error(`${file}: expected exactly one heading match, found ${n}`);html=html.replace(from,to)}
  fs.writeFileSync(p,html);
}

let htmlCount=0, oldCount=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html')){let s=fs.readFileSync(p,'utf8');const n=(s.match(/style\.css\?v=20260807-blue-palette-v49/g)||[]).length;if(n){oldCount+=n;s=s.replaceAll('style.css?v=20260807-blue-palette-v49','style.css?v=20260807-type-accent-v50');fs.writeFileSync(p,s)}htmlCount++}}}
walk(root);
if(oldCount<50) throw new Error(`expected broad v49 cache propagation, found ${oldCount}`);
console.log(`BANHALMI type accent migrated; ${oldCount} stylesheet links updated across ${htmlCount} HTML files.`);
