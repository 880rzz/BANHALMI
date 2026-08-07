import fs from 'node:fs';

const css=fs.readFileSync('assets/css/style.css','utf8');
const marker='/* Production v3 — editorial SEO/GEO and Platon-inspired language sections */';
const first=css.indexOf(marker);
const second=css.indexOf(marker,first+marker.length);
const third=css.indexOf(marker,second+marker.length);
if(first<0||second<0||third>=0) throw new Error(`Expected exactly two Production v3 markers; got first=${first}, second=${second}, third=${third}`);

let lcp=0;
while(first+lcp<css.length && second+lcp<css.length && css[first+lcp]===css[second+lcp]) lcp++;
const common=css.slice(second,second+lcp);
const safeNewline=common.lastIndexOf('\n');
const safeBrace=Math.max(common.lastIndexOf('\n}\n'),common.lastIndexOf('}\n\n'));
const safeEnd=safeBrace>=0?safeBrace+2:safeNewline+1;
const before=css.slice(Math.max(0,second-220),second);
const after=css.slice(second+safeEnd,second+safeEnd+320);
const firstAfter=css.slice(first+safeEnd,first+safeEnd+320);

console.log(JSON.stringify({
  first,
  second,
  distance:second-first,
  lcpChars:lcp,
  safeEndChars:safeEnd,
  commonLines:common.slice(0,safeEnd).split('\n').length-1,
  beforeSecond:before,
  afterSecond:after,
  afterFirst:firstAfter
},null,2));
