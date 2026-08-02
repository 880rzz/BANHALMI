import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');const skip=new Set(['.git','node_modules','.github','playwright-report','test-results']);const files=[];const errors=[];
async function walk(d){for(const e of await readdir(d,{withFileTypes:true})){if(skip.has(e.name))continue;const f=path.join(d,e.name);if(e.isDirectory())await walk(f);else if(e.name.endsWith('.html'))files.push(f)}}await walk(root);
function lang(rel){return rel.startsWith('hu/')?'hu':rel.startsWith('de-at/')?'de':'en'}
const expected={en:'https://www.banhalmi.art/#works',hu:'https://www.banhalmi.art/hu/#works',de:'https://www.banhalmi.art/de-at/#works'};
for(const file of files){const rel=path.relative(root,file).replaceAll('\\','/');const html=await readFile(file,'utf8');if(!/<ul class=["']nav-links["']/i.test(html))continue;const gallery=[...html.matchAll(/data-nav-role=["']gallery["'][^>]*href=["']([^"']+)["']/gi)];if(gallery.length!==1)errors.push(rel+': expected one Gallery navigation item, found '+gallery.length);else if(gallery[0][1]!==expected[lang(rel)])errors.push(rel+': wrong-language Gallery target '+gallery[0][1]);if(!/data-nav-role=["']oeuvre["']/i.test(html))errors.push(rel+': Oeuvre navigation role missing');if(/1999 ótas/.test(html))errors.push(rel+': Hungarian typo remains')}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log('Professional navigation ecosystem audit passed: Oeuvre and Gallery are separate, language-correct destinations.');
