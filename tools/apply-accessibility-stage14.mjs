import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const htmlFiles=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(entry.name))continue;const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else if(entry.name.endsWith('.html'))htmlFiles.push(p)}}
walk(root);
const link='<link href="/assets/css/accessibility-stage14.css?v=20260802" rel="stylesheet"/>';
let changed=0;
for(const file of htmlFiles){let html=fs.readFileSync(file,'utf8');if(html.includes('accessibility-stage14.css'))continue;const idx=html.indexOf('</head>');if(idx<0)continue;html=html.slice(0,idx)+link+html.slice(idx);fs.writeFileSync(file,html);changed++;}
console.log(`Stage fourteen accessibility stylesheet linked in ${changed} HTML files.`);
