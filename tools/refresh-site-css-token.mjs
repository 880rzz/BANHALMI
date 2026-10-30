#!/usr/bin/env node
// Update the canonical CSS cache token across all published HTML files.
// Usage: node tools/refresh-site-css-token.mjs design-YYYYMMDD-description --write
import fs from 'node:fs';
import path from 'node:path';
const [token, mode] = process.argv.slice(2);
if (!/^design-[a-z0-9-]+$/.test(token ?? '') || mode !== '--write') {
  console.error('Usage: node tools/refresh-site-css-token.mjs design-YYYYMMDD-description --write');
  process.exit(2);
}
const skip = new Set(['.git','node_modules','.github','artifacts','_site']);
const pages = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, {withFileTypes:true})) {
    if (skip.has(item.name)) continue;
    const file = path.join(dir,item.name);
    if (item.isDirectory()) walk(file);
    else if (item.isFile() && item.name.endsWith('.html')) pages.push(file);
  }
}
walk('.');
let changed=0, references=0;
for (const file of pages) {
  const before=fs.readFileSync(file,'utf8');
  const pattern=/\/assets\/css\/site\.css\?v=design-[a-z0-9-]+/g;
  const matches=[...before.matchAll(pattern)];
  if (matches.length !== 1) throw new Error(file+': expected exactly one canonical CSS link; got '+matches.length);
  references++;
  const after=before.replace(pattern,'/assets/css/site.css?v='+token);
  if (after!==before) { fs.writeFileSync(file,after); changed++; }
}
if (references < 50) throw new Error('Too few HTML references: '+references);
console.log('Canonical CSS token '+token+': '+changed+' changed, '+references+' checked.');
