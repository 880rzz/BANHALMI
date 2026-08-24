const fs=require('node:fs');
const p='package.json';
let s=fs.readFileSync(p,'utf8');
s=s.replace(/ && node tools\/audit-visual-rhythm-regression(?:-20260825)?\.mjs/g,'');
fs.writeFileSync(p,s);
console.log('Removed redundant visual rhythm audit hook; Apple contract remains sole design authority.');
