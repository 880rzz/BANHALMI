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

// Align page-level WebPage JSON-LD with the localized title/description metadata.
// Person and Organization descriptions are intentionally left untouched so the executive-first
// identity remains the primary entity definition.
text = text.replace(
  "  write(page.path, h);\n}",
  "  const canonical = 'https://www.norbertbanhalmi.com/' + (page.path === 'glamour/index.html' ? 'glamour/' : page.path.replace(/index\\.html$/, ''));\n  h = h.replace(/<script\\b([^>]*type=[\\\"']application\\/ld\\+json[\\\"'][^>]*)>([\\s\\S]*?)<\\/script>/gi, (full, attrs, raw) => {\n    try {\n      const data = JSON.parse(raw);\n      const nodes = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];\n      const pageTypes = new Set(['WebPage','ProfilePage','AboutPage','ContactPage','FAQPage','CollectionPage']);\n      for (const node of nodes) {\n        const types = [].concat(node?.['@type'] || []);\n        const id = String(node?.['@id'] || '');\n        const isCurrentPage = node?.url === canonical || id === canonical + '#webpage' || id === canonical + '#page';\n        if (isCurrentPage && types.some(type => pageTypes.has(type))) {\n          node.name = page.title;\n          node.description = page.desc;\n        }\n      }\n      return `<script${attrs}>${JSON.stringify(data)}</script>`;\n    } catch {\n      return full;\n    }\n  });\n  write(page.path, h);\n}"
);

// The migration patches the canonical audit. Use an exact canonical name check rather than
// embedding a slash-sensitive regular expression into generated JavaScript source.
text = text.replace(
  "fail(services.some((service) => service.id === 'fine-art' && /Fine Art \\/ Artists & Performers Photography/i.test(service.name)), 'Fine Art / Artists & Performers canonical service missing');",
  "fail(services.some((service) => service.id === 'fine-art' && service.name === 'Fine Art / Artists & Performers Photography' && service.serviceContext === 'fine-art'), 'Fine Art / Artists & Performers canonical service missing');"
);

fs.writeFileSync(path, text);
console.log('Artists & Performers migration quality patch applied: de-AT contract preserved, obsolete meta-keywords removed, WebPage schema aligned with search metadata, customer-intent reference added and executive-first identity retained.');
