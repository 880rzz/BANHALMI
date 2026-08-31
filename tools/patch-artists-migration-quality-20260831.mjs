import fs from 'node:fs';

const path = 'tools/apply-artists-performers-machine-layer-20260831.mjs';
let text = fs.readFileSync(path, 'utf8');

const replacements = [
  [
    "service.name = { ...(service.name || {}), en: 'Fine Art / Artists & Performers', hu: 'Művészi fotózás / Művészek és előadóművészek', de: 'Fine Art / Künstler:innen & Performer:innen' };",
    "service.name = { en: 'Fine Art / Artists & Performers', hu: 'Művészi fotózás / Művészek és előadóművészek', 'de-AT': 'Fine Art / Künstler:innen & Performer:innen' };"
  ],
  [
    "service.audiences = { en: ['artists','actors','dancers','performers','models','creative professionals'], hu: ['művészek','színészek','táncosok','előadóművészek','modellek','kreatív szakemberek'], de: ['Künstler:innen','Schauspieler:innen','Tänzer:innen','Performer:innen','Models','Kreativschaffende'] };",
    "service.audiences = { en: ['artists','actors','dancers','performers','models','creative professionals'], hu: ['művészek','színészek','táncosok','előadóművészek','modellek','kreatív szakemberek'], 'de-AT': ['Künstler:innen','Schauspieler:innen','Tänzer:innen','Performer:innen','Models','Kreativschaffende'] };"
  ],
  [
    "  if (!h.includes('data-artists-performers-semantic')) {\n    const semantic = `<meta data-artists-performers-semantic=\"\" name=\"keywords\" content=\"${page.tokens.join(', ')}\">`;\n    h = h.replace('</head>', semantic + '</head>');\n  }",
    "  if (!h.includes('data-artists-performers-semantic')) {\n    const semantic = '<!-- data-artists-performers-semantic: service vocabulary is expressed in JSON-LD knowsAbout and the canonical machine core -->';\n    h = h.replace('</head>', semantic + '</head>');\n  }"
  ]
];

for (const [from, to] of replacements) {
  if (!text.includes(from)) throw new Error('Expected migration fragment not found: ' + from.slice(0, 90));
  text = text.replace(from, to);
}

// Keep the canonical machine reference graph explicit for answer engines.
text = text.replace(
  "core.schemaVersion = '1.2';",
  "core.schemaVersion = '1.2';\n  core.canonicalReferences.customerIntent = 'https://www.norbertbanhalmi.com/customer-intent-model.json';"
);

// Expand pricing publisher prose without changing the executive-first positioning.
text = text.replace(
  "const service = (p.services || []).find(x => x.id === 'fine-art');",
  "p.publisher.description = 'BANHALMI is an executive-first photography and visual-branding practice led by Norbert Banhalmi, providing professional headshots, executive portraits, C-level business and event photography, brand photography, Fine Art / Artists & Performers photography and strategic visual positioning in Vienna and Budapest, with agreed projects available worldwide.';\n  const service = (p.services || []).find(x => x.id === 'fine-art');"
);

fs.writeFileSync(path, text);
console.log('Artists & Performers migration quality patch applied: de-AT contract preserved, obsolete meta-keywords removed, customer-intent reference added, executive-first pricing description retained.');
