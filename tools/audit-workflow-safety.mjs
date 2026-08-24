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
const sourceAuditPos=pages.indexOf('- name: Run source contract audits');
const artifactPos=pages.indexOf('- name: Prepare immutable Pages artifact');
const browserPos=pages.indexOf('- name: Run exhaustive browser QA');
const lighthouseMobilePos=pages.indexOf('- name: Run mobile Lighthouse strict 100 gate');
const lighthouseDesktopPos=pages.indexOf('- name: Run desktop Lighthouse strict 100 gate');
const uploadPos=pages.indexOf('- name: Upload the exact audited Pages artifact');

if(
  [sourceAuditPos,artifactPos,browserPos,lighthouseMobilePos,lighthouseDesktopPos,uploadPos].some((p)=>p<0) ||
  !(sourceAuditPos<artifactPos && artifactPos<browserPos && browserPos<lighthouseMobilePos && lighthouseMobilePos<lighthouseDesktopPos && lighthouseDesktopPos<uploadPos)
){
  errors.push('pages.yml must run source audits first, build an immutable committed artifact, then browser QA and both Lighthouse 100 gates before uploading the deployable artifact');
}
if(!/git archive --format=tar HEAD \| tar -xf - -C _site/.test(pages)){
  errors.push('pages.yml must build the public artifact from committed HEAD, never from a possibly mutated working tree');
}
if(!/printf '%s\\n' \"\$GITHUB_SHA\" > _site\/deployment-sha\.txt/.test(pages)){
  errors.push('pages.yml must stamp the exact source SHA into the artifact');
}
if(!/Verify exact .*commit is live on custom domain/i.test(pages)){
  errors.push('pages.yml must verify the exact deployed SHA on the custom domain');
}
if(!/needs:\s*exact-live/.test(pages)){
  errors.push('pages.yml production live gate must depend on exact-live verification');
}

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Workflow safety audit passed: permanent workflows are read-only, source mutation commands are forbidden, deployment uses committed HEAD, browser and Lighthouse gates precede artifact upload, and exact-live SHA verification gates production validation.');
