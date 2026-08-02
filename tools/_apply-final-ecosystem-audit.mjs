import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const changed = [];
const skip = new Set(['.git', 'node_modules', '.github', 'playwright-report', 'test-results']);

const nav = {
  en: { oeuvre: '/about/', gallery: 'https://www.banhalmi.art/#works', label: 'Gallery' },
  hu: { oeuvre: '/hu/eletmu/', gallery: 'https://www.banhalmi.art/hu/#works', label: 'Galéria' },
  de: { oeuvre: '/de-at/werk/', gallery: 'https://www.banhalmi.art/de-at/#works', label: 'Galerie' },
};

function languageOf(rel) {
  if (rel.startsWith('hu/')) return 'hu';
  if (rel.startsWith('de-at/')) return 'de';
  return 'en';
}

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (const file of await walk(root)) {
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  const original = await readFile(file, 'utf8');
  let html = original.replaceAll('1999 ótas', '1999 óta');
  const t = nav[languageOf(rel)];

  if (/<ul class="nav-links">/i.test(html) && !html.includes('data-nav-role="gallery"')) {
    const item = new RegExp(`(<li><a([^>]*)href="${escapeRegExp(t.oeuvre)}"([^>]*)>[\\s\\S]*?<\\/a><\\/li>)`, 'i');
    html = html.replace(item, (block) => {
      const oeuvre = block.replace('<a', '<a data-nav-role="oeuvre"');
      const gallery = `<li><a data-nav-role="gallery" href="${t.gallery}" rel="me">${t.label}</a></li>`;
      return `${oeuvre}${gallery}`;
    });
  }

  if (html !== original) {
    await writeFile(file, html, 'utf8');
    changed.push(rel);
  }
}

const llmsPath = path.join(root, 'llms.txt');
let llms = await readFile(llmsPath, 'utf8');
if (!llms.includes('Art archive gallery:')) {
  llms = llms.replace('Artistic source archive: https://www.banhalmi.art/\n',
    'Artistic source archive: https://www.banhalmi.art/\nArt archive gallery: https://www.banhalmi.art/#works\nHuman-readable artist profile: https://www.banhalmi.art/#about\nArchive career chronology: https://www.banhalmi.art/#journey\nCanonical Person identifier: https://www.banhalmi.art/norbert-banhalmi#person\n');
  await writeFile(llmsPath, llms, 'utf8');
  changed.push('llms.txt');
}

const aiPath = path.join(root, 'ai.txt');
try {
  let ai = await readFile(aiPath, 'utf8');
  if (!ai.includes('Art archive gallery:')) {
    ai += '\n\nArt archive gallery: https://www.banhalmi.art/#works\nHuman-readable artist profile: https://www.banhalmi.art/#about\nArchive career chronology: https://www.banhalmi.art/#journey\nCanonical Person identifier: https://www.banhalmi.art/norbert-banhalmi#person\n';
    await writeFile(aiPath, ai, 'utf8');
    changed.push('ai.txt');
  }
} catch {}

const unsafeWorkflows = [
  '.github/workflows/apply-homepage-human-voice.yml',
  '.github/workflows/apply-oeuvre-human-voice.yml',
  '.github/workflows/final-live-content-fix.yml',
  '.github/workflows/full-cross-site-audit-fixes.yml',
  '.github/workflows/strict-com-diagnostics.yml',
  '.github/workflows/strict-live-remediation.yml',
];
const unsafeTools = [
  'tools/final-live-content-fix.mjs',
  'tools/fix-cross-site-audit.mjs',
  'tools/remediate-strict-live-audit.mjs',
];
for (const rel of [...unsafeWorkflows, ...unsafeTools]) {
  try {
    await unlink(path.join(root, rel));
    changed.push(rel);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const navTest = `import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');const skip=new Set(['.git','node_modules','.github','playwright-report','test-results']);const files=[];const errors=[];
async function walk(d){for(const e of await readdir(d,{withFileTypes:true})){if(skip.has(e.name))continue;const f=path.join(d,e.name);if(e.isDirectory())await walk(f);else if(e.name.endsWith('.html'))files.push(f)}}await walk(root);
function lang(rel){return rel.startsWith('hu/')?'hu':rel.startsWith('de-at/')?'de':'en'}
const expected={en:'https://www.banhalmi.art/#works',hu:'https://www.banhalmi.art/hu/#works',de:'https://www.banhalmi.art/de-at/#works'};
for(const file of files){const rel=path.relative(root,file).replaceAll('\\\\','/');const html=await readFile(file,'utf8');if(!/<ul class=["']nav-links["']/i.test(html))continue;const gallery=[...html.matchAll(/data-nav-role=["']gallery["'][^>]*href=["']([^"']+)["']/gi)];if(gallery.length!==1)errors.push(rel+': expected one Gallery navigation item, found '+gallery.length);else if(gallery[0][1]!==expected[lang(rel)])errors.push(rel+': wrong-language Gallery target '+gallery[0][1]);if(!/data-nav-role=["']oeuvre["']/i.test(html))errors.push(rel+': Oeuvre navigation role missing');if(/1999 ótas/.test(html))errors.push(rel+': Hungarian typo remains')}
if(errors.length){console.error(errors.join('\\n'));process.exit(1)}console.log('Professional navigation ecosystem audit passed: Oeuvre and Gallery are separate, language-correct destinations.');
`;
await writeFile(path.join(root, 'tools/audit-navigation-ecosystem.mjs'), navTest, 'utf8');
changed.push('tools/audit-navigation-ecosystem.mjs');

const workflowTest = `import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const dir=path.resolve(import.meta.dirname,'../.github/workflows');const errors=[];
for(const name of await readdir(dir)){if(!/\\.ya?ml$/.test(name)||name.startsWith('_'))continue;const text=await readFile(path.join(dir,name),'utf8');if(/contents:\\s*write/i.test(text))errors.push(name+': contents write permission is forbidden');if(/git\\s+push/i.test(text))errors.push(name+': permanent workflow must not push');if(/git\\s+commit/i.test(text))errors.push(name+': permanent workflow must not commit');if(/npm\\s+run\\s+fix:/i.test(text))errors.push(name+': workflow invokes a mutating fixer')}
if(errors.length){console.error(errors.join('\\n'));process.exit(1)}console.log('Workflow safety audit passed: permanent workflows are read-only and cannot rewrite source.');
`;
await writeFile(path.join(root, 'tools/audit-workflow-safety.mjs'), workflowTest, 'utf8');
changed.push('tools/audit-workflow-safety.mjs');

const packagePath = path.join(root, 'package.json');
const pkg = JSON.parse(await readFile(packagePath, 'utf8'));
delete pkg.scripts['fix:cross-site'];
delete pkg.scripts['fix:strict-live'];
pkg.scripts['audit:navigation-ecosystem'] = 'node tools/audit-navigation-ecosystem.mjs';
pkg.scripts['audit:workflow-safety'] = 'node tools/audit-workflow-safety.mjs';
for (const command of ['node tools/audit-navigation-ecosystem.mjs', 'node tools/audit-workflow-safety.mjs']) {
  if (!pkg.scripts.audit.includes(command)) pkg.scripts.audit += ` && ${command}`;
}
await writeFile(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
changed.push('package.json');

const readmePath = path.join(root, 'README.md');
let readme = await readFile(readmePath, 'utf8');
if (!readme.includes('## Ecosystem and automation contract')) {
  readme += `\n## Ecosystem and automation contract\n\n- \`norbertbanhalmi.com\` is the professional service and enquiry site.\n- \`banhalmi.art\` is the artistic source archive.\n- The professional Oeuvre page remains a commercial-context overview; Gallery links directly to the language-matched \`banhalmi.art/#works\` destination.\n- The canonical Person identifier is \`https://www.banhalmi.art/norbert-banhalmi#person\`; its human-readable profile is \`https://www.banhalmi.art/#about\`.\n- Permanent GitHub Actions are read-only. Historical rewrite/remediation workflows and broad source-mutating fixers were removed to prevent audited corrections from being reverted.\n`;
  await writeFile(readmePath, readme, 'utf8');
  changed.push('README.md');
}

console.log(JSON.stringify({changed:[...new Set(changed)].sort(),total:new Set(changed).size},null,2));
