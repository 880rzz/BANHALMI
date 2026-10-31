import fs from 'node:fs';
import path from 'node:path';

const files=[];const skip=new Set(['.git','node_modules','.github','artifacts','_site']);
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(skip.has(entry.name))continue;const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.isFile()&&entry.name.endsWith('.html'))files.push(full);}}
walk('.');
const errors=[];let references=0;const tokens=new Set();
for(const file of files){const html=fs.readFileSync(file,'utf8');for(const match of html.matchAll(/\/assets\/css\/site\.css\?v=([^"']+)/g)){references++;tokens.add(match[1]);if(!/^design-[a-z0-9-]+$/.test(match[1]))errors.push(`${file}: invalid site.css cache token ${match[1]}`);}}
if(references<50)errors.push(`expected at least 50 versioned site.css references, found ${references}`);
if(tokens.size!==1)errors.push(`source HTML must use exactly one site.css token, found: ${[...tokens].join(', ')}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`CSS cache-token audit passed: ${references} site.css references share one canonical token ${[...tokens][0]}.`);

// Single-source contract: every source page must parser-discover only site.css.
const cssFiles=fs.readdirSync('assets/css').filter(name=>name.endsWith('.css'));
if(cssFiles.length!==1||cssFiles[0]!=='site.css')throw Error('Expected exactly one maintained CSS source: site.css');
for(const file of files){
  const html=fs.readFileSync(file,'utf8');
  if(html.includes('/assets/css/fluid-4k-rhythm.css')||html.includes('data-fluid-4k-rhythm'))
    throw Error(file+': legacy secondary stylesheet reintroduced');
  const directStyles=[...html.matchAll(/<link\b(?=[^>]*\bhref=(["'])\/assets\/css\/site\.css\?v=[^"']+\1)[^>]*>/gi)];
  if(directStyles.length!==1)throw Error(file+': expected one parser-discovered canonical site.css link, got '+directStyles.length);
}
console.log('Canonical CSS source audit passed: one site.css, '+files.length+' HTML pages with one versioned CSS link each.');

// Multilingual homepage phrase-integrity regression contract.
// Wrapping is allowed between service links, never inside a service name.
const css=fs.readFileSync('assets/css/site.css','utf8');
if(!/\.eyebrow\[data-service-owner-links\]\s*>\s*a\s*\{\s*white-space:\s*nowrap\s*;\s*\}/.test(css))
  throw Error('Homepage service links must preserve their complete phrases');
for(const [route,phrases] of [
  ['index.html',['Portrait&nbsp;photography','Personal&nbsp;branding','Event&nbsp;photography','Artists&nbsp;&amp;&nbsp;Performers']],
  ['hu/index.html',['Portréfotózás','Brandfotózás','Rendezvényfotózás','Művészek&nbsp;és&nbsp;előadók']],
  ['de-at/index.html',['Portraitfotografie','Personal&nbsp;Branding','Eventfotografie','Kunst&nbsp;&amp;&nbsp;Performance']]
]){
  const html=fs.readFileSync(route,'utf8');
  const labels=html.match(/<p class="eyebrow" data-service-owner-links="20261015">([\s\S]*?)<\/p>/)?.[1];
  if(!labels)throw Error(route+': missing canonical homepage service links');
  for(const phrase of phrases){
    if(!labels.includes('>'+phrase+'</a>'))throw Error(route+': missing intact service phrase '+phrase);
  }
}
console.log('Multilingual homepage phrase-integrity contract passed: EN/HU/DE');
