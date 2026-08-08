import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const robots = fs.readFileSync(path.join(root,'robots.txt'),'utf8');
if (!/User-agent:\s*\*/i.test(robots) || !/Allow:\s*\//i.test(robots)) errors.push('robots.txt must allow the canonical professional site');
const walk = (dir) => fs.readdirSync(dir,{withFileTypes:true}).flatMap((e)=>{ if(['.git','node_modules'].includes(e.name)) return []; const full=path.join(dir,e.name); return e.isDirectory()?walk(full):[full]; });
for (const file of walk(root).filter((p)=>p.endsWith('.html'))) {
  const html = fs.readFileSync(file,'utf8');
  if (/http-equiv=[\"']refresh[\"']/i.test(html) && /<meta\b[^>]*name=[\"']robots[\"'][^>]*content=[\"'][^\"']*noindex/i.test(html)) errors.push(path.relative(root,file)+': redirect alias must not combine redirect with noindex');
}
for (const relative of ['privacy-policy/index.html','hu/adatvedelem/index.html','de-at/datenschutz/index.html']) {
  const html=fs.readFileSync(path.join(root,relative),'utf8');
  for (const token of ['www.norbertbanhalmi.com','www.banhalmi.art','blog.banhalmi.art','Google Analytics 4','Trustindex','Elfsight','data-privacy-domain-scope']) if (!html.includes(token)) errors.push(relative+': privacy scope/processors missing '+token);
}
if (errors.length) { console.error('SEO / GDPR / INDEXING STAGE 53 FAILED'); errors.forEach((e)=>console.error('-',e)); process.exit(1);}
console.log('SEO/GDPR/indexing Stage 53 passed: redirects, robots and cross-domain processor scope are consistent.');
