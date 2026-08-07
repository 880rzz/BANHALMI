import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const textExt = new Set(['.html', '.json', '.jsonld', '.txt']);
const skipDirs = new Set(['.git', 'node_modules', '_site', 'playwright-report', 'test-results']);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.well-known') continue;
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (textExt.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

const replacements = [
  [
    'This static service website is prepared for GitHub Pages / GitHub-hosted publication. Email services are provided through Google Cloud / Google Workspace infrastructure. The central life-work archive banhalmi.art is hosted on Wix.',
    'This professional service website and the central life-work archive banhalmi.art are published through GitHub Pages / GitHub-hosted static infrastructure. Email services are provided through Google Cloud / Google Workspace infrastructure.'
  ],
  [
    'BANHALMI — commissioned photography and an artistic practice developed between Vienna, Budapest and New York.',
    'BANHALMI — commissioned photography based in Vienna and Budapest, with a significant New York chapter in the artistic oeuvre.'
  ],
  [
    'BANHALMI — alkalmazott fotográfia és művészeti életmű Bécs, Budapest és New York tengelyén.',
    'BANHALMI — alkalmazott fotográfia bécsi és budapesti működési bázissal, a művészeti életmű jelentős New York-i fejezetével.'
  ],
  [
    'BANHALMI — Auftragsfotografie und künstlerisches Werk zwischen Wien, Budapest und New York.',
    'BANHALMI — Auftragsfotografie mit operativen Standorten in Wien und Budapest und einem bedeutenden New-York-Kapitel im künstlerischen Werk.'
  ],
  [
    'he lives and works in Vienna and maintains professional ties to Budapest',
    'he works from active operational bases in Vienna and Budapest'
  ],
  [
    'Technikai megfelelőségi tervezet, amelyet az aktív szolgáltatói szerződések és az osztrák jog alapján véglegesíteni szükséges.',
    'A tájékoztató az aktív szolgáltatói és technikai beállításokat írja le, és az alkalmazandó osztrák és uniós adatvédelmi szabályokkal együtt értelmezendő.'
  ],
  [
    'Sie ist ein technischer Compliance-Entwurf und muss mit den aktiven Dienstleisterverträgen und dem österreichischen Recht abgeglichen werden.',
    'Sie beschreibt die aktiven Dienstleister- und technischen Einstellungen und ist zusammen mit den anwendbaren österreichischen und unionsrechtlichen Datenschutzvorschriften zu verstehen.'
  ]
];

// Ambassador is an affiliation/professional role, not a membership.
const omMemberObject = '{"@type":"Organization","name":"OM SYSTEM (Olympus) — brand ambassador Hungary","url":"https://www.milcclub.com/ambassadors"},';

let changedFiles = 0;
for (const file of walk(root)) {
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  for (const [from, to] of replacements) text = text.split(from).join(to);
  text = text.split(omMemberObject).join('');
  if (text !== before) {
    fs.writeFileSync(file, text);
    changedFiles += 1;
  }
}

// Reduce LLM entry noise without deleting implementation contracts: move low-priority blocks below the core reference layer.
const llmFiles = ['llms.txt', 'ai.txt'];
const movableBlocks = [
  'QUOTE-SERVICE-CONTEXT',
  'FINE-ART-PRIVATE-JOURNEY',
  'SERVICE-PAGE-FRAMEWORK',
  'SERVICE-CONVERSION-PATH',
  'HOMEPAGE-DECISION-PATH',
  'SERVICE-DECISION-CARDS'
];
for (const rel of llmFiles) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  let text = fs.readFileSync(file, 'utf8');
  const moved = [];
  for (const id of movableBlocks) {
    const re = new RegExp(`\\n?<!-- ${id}:START -->[\\s\\S]*?<!-- ${id}:END -->\\n?`, 'g');
    text = text.replace(re, match => {
      moved.push(match.trim());
      return '\n';
    });
  }
  if (moved.length) {
    text = text.trimEnd() + '\n\n## Implementation reference — lower priority for identity answers\n' +
      'The following blocks describe internal service and conversion behaviour. They are reference material, not primary identity, geography or authority signals.\n\n' +
      moved.join('\n\n') + '\n';
    fs.writeFileSync(file, text);
  }
}

console.log(`Stage 39 remediation applied to ${changedFiles} text files; LLM implementation blocks were demoted without deletion.`);
