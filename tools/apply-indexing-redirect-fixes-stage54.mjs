import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const redirects = {
  'en/work/index.html': 'https://www.banhalmi.art/',
  'about/norbert-banhalmi/index.html': 'https://www.norbertbanhalmi.com/about/',
  'hu/rolam/banhalmi-norbert/index.html': 'https://www.norbertbanhalmi.com/about/',
  'de/ueber-mich/norbert-banhalmi/index.html': 'https://www.norbertbanhalmi.com/about/',
  'press/index.html': 'https://www.banhalmi.art/press.html',
  'old-print/index.html': 'https://www.banhalmi.art/press.html',
  'hu/sajto/megjelenesek/index.html': 'https://www.banhalmi.art/hu/press.html',
  'hu/sajto/nyomtatott/index.html': 'https://www.banhalmi.art/hu/press.html',
  'de/presse/presseauftritte/index.html': 'https://www.banhalmi.art/de-at/press.html',
  'de/presse/print/index.html': 'https://www.banhalmi.art/de-at/press.html'
};
for (const [relative,target] of Object.entries(redirects)) {
  const file = path.join(root, relative);
  let html = fs.readFileSync(file,'utf8');
  html = html.replace(/https:\/\/www\.banhalmi\.art\/[A-Za-z0-9_\-\/]+/g, target.replace(/\/$/,''));
  html = html.replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi,'');
  fs.writeFileSync(file, html);
}

const auditFile = path.join(root,'tools/audit-live-indexing-redirects-stage54.mjs');
fs.writeFileSync(auditFile, `import fs from 'node:fs';\nimport path from 'node:path';\nconst root=process.cwd(); const errors=[];\nconst walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{if(['.git','node_modules'].includes(e.name))return[];const f=path.join(d,e.name);return e.isDirectory()?walk(f):[f]});\nfor(const file of walk(root).filter(f=>f.endsWith('.html'))){const rel=path.relative(root,file);const html=fs.readFileSync(file,'utf8');const redirect=/http-equiv=[\\\"']refresh[\\\"']/i.test(html);const is404=rel==='404.html';if(/<meta\\b[^>]*name=[\\\"']robots[\\\"'][^>]*content=[\\\"'][^\\\"']*noindex/i.test(html)&&!is404)errors.push(rel+': live/redirect document must not carry noindex');if(!redirect&&!is404&&!/<link\\b[^>]*rel=[\\\"']canonical[\\\"']/i.test(html))errors.push(rel+': live content page missing canonical');}\nconst expected=${JSON.stringify(redirects)};for(const [rel,target] of Object.entries(expected)){const html=fs.readFileSync(path.join(root,rel),'utf8');for(const token of [target,'http-equiv=\\\"refresh\\\"','window.location.replace'])if(!html.includes(token))errors.push(rel+': redirect target/contract missing '+token);}\nif(errors.length){console.error('STAGE54 FAILED');errors.forEach(e=>console.error('-',e));process.exit(1)}console.log('Stage 54 passed: every live content page is indexable/self-canonical and all known legacy aliases point directly to current equivalents.');\n`);
const packagePath=path.join(root,'package.json'); const pkg=JSON.parse(fs.readFileSync(packagePath,'utf8')); const token='node tools/audit-live-indexing-redirects-stage54.mjs'; if(!pkg.scripts.audit.includes(token)) pkg.scripts.audit+=' && '+token; fs.writeFileSync(packagePath,JSON.stringify(pkg,null,2)+'\n');

const legacyPath=path.join(root,'tools/audit-static-legacy-routes-stage27.mjs');
let legacy=fs.readFileSync(legacyPath,'utf8');
for(const [rel,target] of Object.entries(redirects)){const route=rel.replace(/\/index\.html$/,''); const re=new RegExp(`(['\"]${route.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}['\"]\\s*:\\s*)['\"][^'\"]+['\"]`); legacy=legacy.replace(re, `$1'${target}'`)}
fs.writeFileSync(legacyPath,legacy);
