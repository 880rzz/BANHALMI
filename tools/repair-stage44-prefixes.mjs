import fs from 'node:fs';

const file='assets/css/style.css';
let css=fs.readFileSync(file,'utf8');
let changes=0;

function replaceAllExact(from,to,expectedMin=1){
  const count=css.split(from).length-1;
  if(count<expectedMin) throw new Error(`Expected at least ${expectedMin} occurrence(s): ${from}`);
  css=css.split(from).join(to);
  changes+=count;
}

replaceAllExact('font-smoothing:antialiased;','-webkit-font-smoothing:antialiased;',2);
replaceAllExact('appearance:checkbox;','-webkit-appearance:checkbox;',2);
replaceAllExact('transform:translateZ(0);\n  transform:translateZ(0);','transform:translateZ(0);\n  -webkit-transform:translateZ(0);',1);
replaceAllExact('overflow-scrolling:touch;','-webkit-overflow-scrolling:touch;',1);

if(/^\s*-webkit-\s*$/m.test(css)) throw new Error('Standalone -webkit- fragment still present after repair');
fs.writeFileSync(file,css);
console.log(`Stage 44 repair restored ${changes} valid vendor-prefixed declarations; standalone fragments remain removed.`);
