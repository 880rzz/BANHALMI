import fs from 'node:fs';

const cssPath='assets/css/style.css';
let css=fs.readFileSync(cssPath,'utf8');
const replacements=[
  ['--navy:#1d1d1f','--navy:#202530'],
  ['--navy-soft:#2d2d2f','--navy-soft:#2D3444'],
  ['--graphite:#1d1d1f','--graphite:#202530'],
  ['--ink:#1d1d1f','--ink:#202530']
];
for(const [from,to] of replacements){
  if(!css.includes(from)) throw new Error(`Expected token missing: ${from}`);
  css=css.replaceAll(from,to);
}
if(!css.includes('.site-footer{background:#202530')) throw new Error('Footer must remain on #202530');
fs.writeFileSync(cssPath,css);
console.log('BANHALMI deep-blue palette applied to ink and dark surfaces.');
