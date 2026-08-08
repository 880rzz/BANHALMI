import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const failures=[];
const homes=['index.html','hu/index.html','de-at/index.html'];
for(const file of homes){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  if(/<script\b[^>]*src=[\"']https:\/\/(?:cdn\.trustindex\.io|elfsightcdn\.com)\//i.test(html)) failures.push(file+': third-party review script must not load from static HTML');
}
const main=fs.readFileSync(path.join(root,'assets/js/main.js'),'utf8');
for(const token of ['readChoice() === \"all\"','details && !details.open','cdn.trustindex.io/assets/js/richsnippet.js','elfsightcdn.com/platform.js']){
  if(!main.includes(token)) failures.push('main.js missing gated review-loader contract: '+token);
}
if(failures.length){for(const failure of failures) console.error('FAIL '+failure);process.exit(1);}
console.log('Stage 56 third-party performance audit passed: Trustindex and Elfsight are absent from static HTML and remain consent-plus-interaction gated.');
