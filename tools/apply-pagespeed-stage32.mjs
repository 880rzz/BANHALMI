import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(root, p), s);

const stylePath = 'assets/css/style.css';
let css = read(stylePath);
if (!css.includes('/* PAGESPEED-STAGE32:START */')) {
  css += `
/* PAGESPEED-STAGE32:START */
/* Footer-only accessible gold: #CBB45F on #202530 is ~7.5:1 (WCAG AAA). */
.site-footer{--footer-gold:#CBB45F;}
.site-footer h3,
.site-footer .footer-accordion summary{
  color:var(--footer-gold)!important;
  opacity:1!important;
  font-weight:650!important;
}
.site-footer .footer-accordion summary:hover,
.site-footer .footer-accordion summary:focus-visible{color:#fff!important;}
.site-footer .footer-bottom{color:#AEB4C2!important;}
.site-footer .footer-bottom a,
.site-footer .footer-bottom button{color:#D2D2D7!important;}
.site-footer .footer-bottom a:hover,
.site-footer .footer-bottom a:focus-visible,
.site-footer .footer-bottom button:hover,
.site-footer .footer-bottom button:focus-visible{color:#fff!important;}
/* PAGESPEED-STAGE32:END */
`;
  write(stylePath, css);
}

const a11yPath = 'assets/css/accessibility-stage14.css';
let a11y = read(a11yPath);
if (!a11y.includes('/* PAGESPEED-STAGE32-TARGETS:START */')) {
  a11y += `
/* PAGESPEED-STAGE32-TARGETS:START */
@media (max-width:680px), (pointer:coarse){
  .lang-switch a,
  .site-footer a,
  .site-footer button,
  .banhalmi-ecosystem a{
    min-height:44px;
    display:inline-flex;
    align-items:center;
  }
  .lang-switch a{min-width:44px;justify-content:center;padding-inline:8px;}
  .site-footer li>a{padding-block:7px;}
  .banhalmi-ecosystem a{padding-block:8px;}
}
/* PAGESPEED-STAGE32-TARGETS:END */
`;
  write(a11yPath, a11y);
}

const replacements = new Map([
  ['BANHALMI — executive portraiture, brand photography and visual communication between Vienna and Budapest.', 'BANHALMI — executive portraiture, brand photography and visual communication from Vienna and Budapest, with a substantial New York reference archive.'],
  ['BANHALMI — vezetői portré, brandfotózás és vizuális kommunikáció Bécs és Budapest között.', 'BANHALMI — vezetői portré, brandfotózás és vizuális kommunikáció bécsi és budapesti bázissal, jelentős New York-i referenciaanyaggal.'],
  ['BANHALMI — Führungskräfteporträts, Brandfotografie und visuelle Kommunikation zwischen Wien und Budapest.', 'BANHALMI — Führungskräfteporträts, Brandfotografie und visuelle Kommunikation mit Standorten in Wien und Budapest und einem umfangreichen New-York-Referenzarchiv.']
]);
const counts = new Map([...replacements.keys()].map((k) => [k, 0]));
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '_site'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) {
      let html = fs.readFileSync(full, 'utf8');
      const original = html;
      for (const [from, to] of replacements) {
        const n = html.split(from).length - 1;
        counts.set(from, counts.get(from) + n);
        html = html.split(from).join(to);
      }
      if (html !== original) fs.writeFileSync(full, html);
    }
  }
}
walk(root);
for (const [phrase, count] of counts) {
  if (count < 10) throw new Error(`Footer positioning replacement coverage unexpectedly low: ${count} for ${phrase}`);
}

const llmsPath = 'llms.txt';
let llms = read(llmsPath);
if (!llms.startsWith('# BANHALMI\n\n>')) {
  llms = llms.replace('# BANHALMI / Norbert Banhalmi', '## BANHALMI / Norbert Banhalmi');
  llms = `# BANHALMI\n\n> Professional photography and visual positioning by Norbert Bánhalmi for leaders and organisations. Vienna and Budapest are two active operational bases; a substantial New York chapter in the photographic archive provides international reference. New York is not presented as a studio or operational base.\n\n${llms}`;
  write(llmsPath, llms);
}

const packagePath = 'package.json';
const pkg = JSON.parse(read(packagePath));
if (!pkg.scripts.audit.includes('audit-internal-anchor-targets-stage31.mjs')) {
  pkg.scripts.audit += ' && node tools/audit-internal-anchor-targets-stage31.mjs';
}
pkg.scripts['audit:internal-anchors'] = 'node tools/audit-internal-anchor-targets-stage31.mjs';
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log('PageSpeed stage 32 migration applied: accessible footer, touch targets, New York reference context, llms entry structure and fragment audit wiring.');
