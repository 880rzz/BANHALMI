import fs from 'node:fs';
import path from 'node:path';
const failures=[];
const skip=new Set(['.git','node_modules','_site','dist','coverage','assets','api','.well-known']);
function attrs(tag){const o={};for(const m of tag.matchAll(/([:\w-]+)=(["'])(.*?)\2/g))o[m[1].toLowerCase()]=m[3];return o}
function isRedirect(h){return /<meta[^>]+http-equiv=["']refresh["']/i.test(h)||(/location\.(?:replace|href)\s*=/i.test(h)&&!/<main\b/i.test(h))}
function get(h,key){for(const m of h.matchAll(/<meta\b[^>]*>/gi)){const a=attrs(m[0]);if(a.name?.toLowerCase()===key||a.property?.toLowerCase()===key)return a.content||''}return''}
function walk(d,b=''){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(e.isDirectory()&&skip.has(e.name))continue;const rel=path.posix.join(b,e.name),abs=path.join(d,e.name);if(e.isDirectory())walk(abs,rel);else if(e.isFile()&&e.name.endsWith('.html'))inspect(rel,abs)}}
function truncated(v){return /(?:…|\.\.\.)\s*$/.test(v)}
function inspect(rel,abs){const h=fs.readFileSync(abs,'utf8');if(isRedirect(h))return;const main=h.match(/<main\b[\s\S]*?<\/main>/i)?.[0]||'';if(main.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().length<160)return;const d=get(h,'description'),og=get(h,'og:description'),tw=get(h,'twitter:description');if(!d)failures.push(`${rel}: meta description missing`);if(!og)failures.push(`${rel}: og:description missing`);if(!tw)failures.push(`${rel}: twitter:description missing`);if(d&&truncated(d))failures.push(`${rel}: artificially truncated meta description: ${d}`);if(og&&truncated(og))failures.push(`${rel}: artificially truncated og:description`);if(tw&&truncated(tw))failures.push(`${rel}: artificially truncated twitter:description`);if(og&&tw&&og!==tw)failures.push(`${rel}: OG/Twitter social description drift`);if(d&&(d.length<65||d.length>210))failures.push(`${rel}: meta description length ${d.length} outside 65–210 character quality band`)}
walk('.');
if(failures.length){console.error('BANHALMI metadata quality audit FAILED:\n'+failures.map(x=>' - '+x).join('\n'));process.exit(1)}
console.log('BANHALMI metadata quality audit passed across all real content pages: complete search metadata and synchronized social descriptions.');
