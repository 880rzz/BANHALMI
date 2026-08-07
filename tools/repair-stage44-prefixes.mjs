import fs from 'node:fs';

const file='assets/css/style.css';
let css=fs.readFileSync(file,'utf8');
let changes=0;

function replaceRegex(re,to,expectedMin=1,label='pattern'){
  const matches=[...css.matchAll(new RegExp(re.source,re.flags.includes('g')?re.flags:`${re.flags}g`))];
  if(matches.length<expectedMin) throw new Error(`Expected at least ${expectedMin} occurrence(s): ${label}`);
  css=css.replace(re,to);
  changes+=matches.length;
}

replaceRegex(/(^|\n)([ \t]*)font-smoothing:antialiased;/gm,'$1$2-webkit-font-smoothing:antialiased;',2,'font-smoothing');
replaceRegex(/(^|\n)([ \t]*)appearance:checkbox;/gm,'$1$2-webkit-appearance:checkbox;',2,'appearance checkbox');
replaceRegex(/(^|\n)([ \t]*)transform:translateZ\(0\);\n[ \t]*transform:translateZ\(0\);/m,'$1$2transform:translateZ(0);\n$2-webkit-transform:translateZ(0);',1,'duplicate transform pair');
replaceRegex(/(^|\n)([ \t]*)overflow-scrolling:touch;/gm,'$1$2-webkit-overflow-scrolling:touch;',1,'overflow scrolling');

if(/^\s*-webkit-\s*$/m.test(css)) throw new Error('Standalone -webkit- fragment still present after repair');
for(const required of ['-webkit-font-smoothing:antialiased;','-webkit-appearance:checkbox;','-webkit-transform:translateZ(0);','-webkit-overflow-scrolling:touch;']){
  if(!css.includes(required)) throw new Error(`Required vendor-prefixed declaration missing after repair: ${required}`);
}
fs.writeFileSync(file,css);
console.log(`Stage 44 repair restored ${changes} valid vendor-prefixed declarations; standalone fragments remain removed.`);
