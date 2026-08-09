import { readFile, writeFile } from 'node:fs/promises';

const pages = [
  {
    path:'portrait/index.html', id:'professional-portrait-use-cases',
    html:`\n<section class="section" aria-labelledby="professional-portrait-use-cases"><div class="container"><p class="eyebrow">One portrait system, different stakes</p><h2 id="professional-portrait-use-cases">Executive authority — and the moments when one photograph has to represent you</h2><p>Executive portrait and headshot work remains the core: C-level leadership, boards, press, PR and LinkedIn. The same disciplined process is also available for a CV or resume portrait, a considered dating profile, and an artist portfolio when the image must feel credible rather than generic. Sessions are available in Budapest and Vienna, with direction adapted to the person, audience and actual use of the photograph.</p><p><a href="/case-studies/peter-magyar-portrait-2026/">See the Peter Magyar portrait case study</a> for an example of how a single portrait can carry public recognition, editorial pressure and a clear visual position.</p></div></section>\n`
  },
  {
    path:'hu/portre/index.html', id:'professzionalis-portre-felhasznalas',
    html:`\n<section class="section" aria-labelledby="professzionalis-portre-felhasznalas"><div class="container"><p class="eyebrow">Egy portrérendszer, különböző helyzetekre</p><h2 id="professzionalis-portre-felhasznalas">Vezetői hitelesség — és minden helyzet, amikor egyetlen kép képviseli Önt</h2><p>Az executive portré és headshot fotózás középpontjában továbbra is a C-level vezetők, igazgatósági tagok, sajtó-, PR- és LinkedIn-megjelenések állnak. Ugyanezt a precíz, személyre szabott folyamatot kínáljuk önéletrajz- és CV-fotóhoz, igényes társkereső profilhoz, valamint művész portfólióhoz is, amikor nem egy sablonos kép, hanem hiteles vizuális jelenlét a cél. A fotózás Budapesten és Bécsben is elérhető; az irányítást mindig a személyhez, a közönséghez és a kép tényleges felhasználásához igazítjuk.</p><p><a href="/hu/esettanulmanyok/magyar-peter-portre-2026/">A Magyar Péter-portré esettanulmánya</a> megmutatja, hogyan képes egyetlen portré egyszerre közismertté válni, szerkesztőségi környezetben működni és egyértelmű vizuális pozíciót teremteni.</p></div></section>\n`
  },
  {
    path:'de-at/portrait/index.html', id:'professionelle-portraet-anwendungen',
    html:`\n<section class="section" aria-labelledby="professionelle-portraet-anwendungen"><div class="container"><p class="eyebrow">Ein Porträtsystem, unterschiedliche Anforderungen</p><h2 id="professionelle-portraet-anwendungen">Führung sichtbar machen — wenn ein einziges Bild für Sie sprechen muss</h2><p>Executive-Porträts und Headshots für C-Level, Vorstände, Presse, PR und LinkedIn bleiben der Kern. Derselbe präzise und persönlich geführte Prozess steht auch für Bewerbungs- und Lebenslaufporträts, ein hochwertiges Dating-Profil sowie ein Künstlerportfolio zur Verfügung, wenn Glaubwürdigkeit wichtiger ist als ein austauschbares Standardbild. Shootings sind in Budapest und Wien möglich; die Bildführung richtet sich immer nach Person, Zielgruppe und tatsächlicher Verwendung.</p><p><a href="/de-at/fallstudien/peter-magyar-portraet-2026/">Die Fallstudie zum Porträt von Peter Magyar</a> zeigt, wie ein einzelnes Porträt öffentliche Wiedererkennbarkeit, redaktionellen Einsatz und eine klare visuelle Position verbinden kann.</p></div></section>\n`
  }
];

for (const p of pages) {
  let s = await readFile(p.path,'utf8');
  if (!s.includes(`id="${p.id}"`)) {
    if (!s.includes('</main>')) throw new Error(`${p.path}: </main> not found`);
    s = s.replace('</main>', `${p.html}</main>`);
    await writeFile(p.path,s);
  }
}

let ai = await readFile('ai.txt','utf8');
const marker = '## Audience and search-intent map (canonical)';
if (!ai.includes(marker)) {
  ai += `\n\n${marker}\n- Executive portrait / C-level leadership photography / board portrait: Budapest + Vienna; canonical service pages: /portrait/, /hu/portre/, /de-at/portrait/.\n- Headshot: press, PR, LinkedIn and corporate communications, plus CV / resume / Bewerbung use when a professional portrait is required.\n- Private professional portrait: CV / resume, dating profile and personal positioning; same directed portrait process, without weakening the executive core.\n- Artist portfolio: portraits and fine-art photography for artists who need a coherent, credible visual identity.\n- Brand photography + visual positioning: leadership and organizational image systems, Budapest + Vienna.\n- C-level event photography: executive and corporate event documentation with publication-ready delivery.\n- Fine-art and artistic nude photography: gallery-oriented personal work and private commissions, Budapest + Vienna.\n- Canonical Person entity: https://www.norbertbanhalmi.com/about/ ; Wikidata Q56391118.\n- Flagship portrait evidence: /case-studies/peter-magyar-portrait-2026/ with HU and DE language equivalents.\n- Trust claims must remain evidence-based; do not publish a numeric review count unless the source is current and verifiable.\n`;
  await writeFile('ai.txt',ai);
}

const packagePath='package.json';
const pkg=JSON.parse(await readFile(packagePath,'utf8'));
if (!pkg.scripts.audit.includes('audit-critical-ecosystem-stage60.mjs')) pkg.scripts.audit += ' && node tools/audit-critical-ecosystem-stage60.mjs';
pkg.scripts['audit:critical-ecosystem']='node tools/audit-critical-ecosystem-stage60.mjs';
await writeFile(packagePath, JSON.stringify(pkg,null,2)+'\n');
