import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dir=path.resolve(import.meta.dirname,'../.github/workflows');
const errors=[];
const workflows=new Map();

for(const name of await readdir(dir)){
  if(!/\.ya?ml$/.test(name)||name.startsWith('_')) continue;
  const text=await readFile(path.join(dir,name),'utf8');
  workflows.set(name,text);

  if(/contents:\s*write/i.test(text)) errors.push(name+': contents write permission is forbidden');
  if(/git\s+push/i.test(text)) errors.push(name+': permanent workflow must not push');
  if(/git\s+commit/i.test(text)) errors.push(name+': permanent workflow must not commit');

  for(const forbidden of [
    /npm\s+run\s+fix:/i,
    /npm\s+run\s+sync:/i,
    /sync-sitemap-lastmod\.mjs/i,
    /\s--write(?:\s|$)/i
  ]){
    if(forbidden.test(text)) errors.push(name+': permanent workflow invokes a source-mutating maintenance command: '+forbidden);
  }
}

const pages=workflows.get('pages.yml')||'';
const auditPos=pages.indexOf('run: npm run audit');
const browserPos=pages.indexOf('run: npm run test:browser');
const artifactPos=pages.indexOf('- name: Prepare immutable Pages artifact');
if(auditPos<0||browserPos<0||artifactPos<0||!(auditPos<browserPos&&browserPos<artifactPos)){
  errors.push('pages.yml must gate artifact preparation behind static audit and browser regression in that order');
}
if(!/git archive --format=tar HEAD \| tar -xf - -C _site/.test(pages)){
  errors.push('pages.yml must build the public artifact from committed HEAD, never from a possibly mutated working tree');
}
if(!/printf '%s\\n' \"\$GITHUB_SHA\" > _site\/deployment-sha\.txt/.test(pages)){
  errors.push('pages.yml must stamp the exact source SHA into the artifact');
}
if(!/Verify exact commit is live on the custom domain/.test(pages)){
  errors.push('pages.yml must verify the exact deployed SHA on the custom domain');
}

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Workflow safety audit passed: permanent workflows are read-only, mutating maintenance commands are isolated, and Pages deploys only audited committed HEAD with exact-SHA verification.');
