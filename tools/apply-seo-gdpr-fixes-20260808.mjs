import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const walk = (dir) => fs.readdirSync(dir, {withFileTypes:true}).flatMap((entry) => {
  if (['.git','node_modules'].includes(entry.name)) return [];
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

let cleaned = 0;
for (const file of walk(ROOT).filter((p) => p.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  if (!/http-equiv=["']refresh["']/i.test(html)) continue;
  const next = html.replace(/<meta\b[^>]*>/gi, (tag) => {
    const robots = /name=["']robots["']/i.test(tag);
    const noindex = /content=["'][^"']*noindex[^"']*["']/i.test(tag);
    return robots && noindex ? '' : tag;
  });
  if (next !== html) { fs.writeFileSync(file, next); cleaned++; }
}

const legacyAudit = path.join(ROOT, 'tools/audit-static-legacy-routes-stage27.mjs');
let legacy = fs.readFileSync(legacyAudit, 'utf8');
legacy = legacy.replace("    'noindex,follow',\n", '');
legacy = legacy.replace("  for (const required of [\n", "  if (/noindex/i.test(html)) errors.push(`${file}: redirect alias must not carry noindex; redirect and canonical are the consolidation signals`);\n  for (const required of [\n");
fs.writeFileSync(legacyAudit, legacy);

const privacySections = {
  'privacy-policy/index.html': `<section class="section-band" data-privacy-domain-scope><div class="wrap"><h2>Websites covered by this notice</h2><p>This privacy notice covers BANHALMI web processing on <strong>www.norbertbanhalmi.com</strong>, <strong>www.banhalmi.art</strong> and <strong>blog.banhalmi.art</strong>, where Bánhalmi Norbert e.U. acts as the controller unless a page states otherwise.</p><h2>Optional processors and embedded services</h2><p>Google Analytics 4 (Google Ireland Limited / Google LLC), Trustindex and Elfsight are optional services and load only after consent where they are used. Their processing, transfer notes and consent controls are described in the Cookie Policy and Trust Center.</p></div></section>`,
  'hu/adatvedelem/index.html': `<section class="section-band" data-privacy-domain-scope><div class="wrap"><h2>A tájékoztató hatálya alá tartozó webhelyek</h2><p>Ez az adatvédelmi tájékoztató a BANHALMI adatkezelésére terjed ki a <strong>www.norbertbanhalmi.com</strong>, <strong>www.banhalmi.art</strong> és <strong>blog.banhalmi.art</strong> webhelyeken, ahol eltérő tájékoztatás hiányában Bánhalmi Norbert e.U. az adatkezelő.</p><h2>Opcionális adatfeldolgozók és beágyazott szolgáltatások</h2><p>A Google Analytics 4 (Google Ireland Limited / Google LLC), a Trustindex és az Elfsight opcionális szolgáltatások; ahol használatban vannak, csak hozzájárulás után töltődnek be. Az adatkezelésük, az adattovábbítási információk és a hozzájárulás kezelése a Süti szabályzatban és a Trust Centerben szerepel.</p></div></section>`,
  'de-at/datenschutz/index.html': `<section class="section-band" data-privacy-domain-scope><div class="wrap"><h2>Von diesem Hinweis erfasste Websites</h2><p>Dieser Datenschutzhinweis gilt für die BANHALMI-Datenverarbeitung auf <strong>www.norbertbanhalmi.com</strong>, <strong>www.banhalmi.art</strong> und <strong>blog.banhalmi.art</strong>, soweit auf einer Seite nichts Abweichendes angegeben ist. Verantwortlicher ist Bánhalmi Norbert e.U.</p><h2>Optionale Auftragsverarbeiter und eingebettete Dienste</h2><p>Google Analytics 4 (Google Ireland Limited / Google LLC), Trustindex und Elfsight sind optionale Dienste und werden, soweit eingesetzt, erst nach Einwilligung geladen. Verarbeitung, Übermittlungshinweise und Einwilligungssteuerung sind in der Cookie-Richtlinie und im Trust Center beschrieben.</p></div></section>`
};
for (const [relative, section] of Object.entries(privacySections)) {
  const file = path.join(ROOT, relative);
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('data-privacy-domain-scope')) {
    html = html.replace('</main>', section + '</main>');
    fs.writeFileSync(file, html);
  }
}

const stage53 = `import fs from 'node:fs';\nimport path from 'node:path';\n\nconst root = process.cwd();\nconst errors = [];\nconst robots = fs.readFileSync(path.join(root,'robots.txt'),'utf8');\nif (!/User-agent:\\s*\\*/i.test(robots) || !/Allow:\\s*\\//i.test(robots)) errors.push('robots.txt must allow the canonical professional site');\nconst walk = (dir) => fs.readdirSync(dir,{withFileTypes:true}).flatMap((e)=>{ if(['.git','node_modules'].includes(e.name)) return []; const full=path.join(dir,e.name); return e.isDirectory()?walk(full):[full]; });\nfor (const file of walk(root).filter((p)=>p.endsWith('.html'))) {\n  const html = fs.readFileSync(file,'utf8');\n  if (/http-equiv=[\\\"']refresh[\\\"']/i.test(html) && /<meta\\b[^>]*name=[\\\"']robots[\\\"'][^>]*content=[\\\"'][^\\\"']*noindex/i.test(html)) errors.push(path.relative(root,file)+': redirect alias must not combine redirect with noindex');\n}\nfor (const relative of ['privacy-policy/index.html','hu/adatvedelem/index.html','de-at/datenschutz/index.html']) {\n  const html=fs.readFileSync(path.join(root,relative),'utf8');\n  for (const token of ['www.norbertbanhalmi.com','www.banhalmi.art','blog.banhalmi.art','Google Analytics 4','Trustindex','Elfsight','data-privacy-domain-scope']) if (!html.includes(token)) errors.push(relative+': privacy scope/processors missing '+token);\n}\nif (errors.length) { console.error('SEO / GDPR / INDEXING STAGE 53 FAILED'); errors.forEach((e)=>console.error('-',e)); process.exit(1);}\nconsole.log('SEO/GDPR/indexing Stage 53 passed: redirects, robots and cross-domain processor scope are consistent.');\n`;
fs.writeFileSync(path.join(ROOT,'tools/audit-seo-gdpr-indexing-stage53.mjs'), stage53);
const packagePath = path.join(ROOT,'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath,'utf8'));
const token = 'node tools/audit-seo-gdpr-indexing-stage53.mjs';
if (!pkg.scripts.audit.includes(token)) pkg.scripts.audit += ' && ' + token;
fs.writeFileSync(packagePath, JSON.stringify(pkg,null,2)+'\n');
console.log(`Applied BANHALMI SEO/GDPR fixes; cleaned ${cleaned} redirect alias document(s).`);
