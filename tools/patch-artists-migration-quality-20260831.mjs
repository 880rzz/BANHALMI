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

// Align the three Fine Art / Artists & Performers page-level WebPage JSON-LD nodes with localized SEO metadata.
text = text.replace(
  "  write(page.path, h);\n}",
  "  const canonical = 'https://www.norbertbanhalmi.com/' + (page.path === 'glamour/index.html' ? 'glamour/' : page.path.replace(/index\\.html$/, ''));\n  h = h.replace(/<script\\b([^>]*type=[\\\"']application\\/ld\\+json[\\\"'][^>]*)>([\\s\\S]*?)<\\/script>/gi, (full, attrs, raw) => {\n    try {\n      const data = JSON.parse(raw);\n      const nodes = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];\n      const pageTypes = new Set(['WebPage','ProfilePage','AboutPage','ContactPage','FAQPage','CollectionPage']);\n      for (const node of nodes) {\n        const types = [].concat(node?.['@type'] || []);\n        const id = String(node?.['@id'] || '');\n        const isCurrentPage = node?.url === canonical || id === canonical + '#webpage' || id === canonical + '#page';\n        if (isCurrentPage && types.some(type => pageTypes.has(type))) {\n          node.name = page.title;\n          node.description = page.desc;\n        }\n      }\n      return `<script${attrs}>${JSON.stringify(data)}</script>`;\n    } catch {\n      return full;\n    }\n  });\n  write(page.path, h);\n}"
);

// The earlier quote migration changed search metadata before its page-level WebPage schema name.
// Repair all three quote pages generically from their current title/description, then enrich their
// page-level about.knowsAbout vocabulary without altering Person/Organization identity nodes.
text = text.replace(
  "// 6) Long-form LLM reference is source-authored (unlike llms.txt/ai.txt projections), so update it directly.",
  `// 5b) Keep quote-page SEO and page-level Schema in exact parity after Artists & Performers expansion.\nfor (const quotePath of ['requestaquote/index.html','hu/ajanlatkeres/index.html','de-at/anfrage/index.html']) {\n  let q = read(quotePath);\n  const rawTitle = q.match(/<title>([\\s\\S]*?)<\\/title>/i)?.[1] || '';\n  const title = rawTitle.replace(/&amp;/gi, '&').replace(/&quot;/gi, '\\"').replace(/&#39;|&apos;/gi, \"'\").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');\n  const desc = q.match(/<meta\\s+content=\"([^\"]*)\"\\s+name=\"description\"\\s*\\/>/i)?.[1] || '';\n  const canonical = q.match(/<link\\s+href=\"([^\"]+)\"\\s+rel=\"canonical\"\\s*\\/>/i)?.[1] || '';\n  const vocabulary = ['actor headshot photography','acting portfolio photography','dance photography','movement photography','performing artist portfolio photography','model portfolio photography','editorial portrait photography'];\n  q = q.replace(/<script\\b([^>]*type=[\\\"']application\\/ld\\+json[\\\"'][^>]*)>([\\s\\S]*?)<\\/script>/gi, (full, attrs, raw) => {\n    try {\n      const data = JSON.parse(raw);\n      const nodes = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];\n      for (const node of nodes) {\n        const types = [].concat(node?.['@type'] || []);\n        const id = String(node?.['@id'] || '');\n        if (types.includes('WebPage') && (node?.url === canonical || id === canonical + '#webpage')) {\n          node.name = title;\n          node.description = desc;\n          if (node.about && typeof node.about === 'object') {\n            node.about.knowsAbout = uniq([...(node.about.knowsAbout || []), ...vocabulary]);\n          }\n          if (node.isPartOf?.about && typeof node.isPartOf.about === 'object') {\n            node.isPartOf.about.knowsAbout = uniq([...(node.isPartOf.about.knowsAbout || []), ...vocabulary]);\n          }\n        }\n      }\n      return \\`<script\\${attrs}>\\${JSON.stringify(data)}</script>\\`;\n    } catch { return full; }\n  });\n  write(quotePath, q);\n}\n\n// 6) Long-form LLM reference is source-authored (unlike llms.txt/ai.txt projections), so update it directly.`
);

// The canonical audit is now a direct read-only guard. This replacement only protects historical
// copies of the migration script and is harmless when the old fragment is absent.
text = text.replace(
  "fail(services.some((service) => service.id === 'fine-art' && /Fine Art \\/ Artists & Performers Photography/i.test(service.name)), 'Fine Art / Artists & Performers canonical service missing');",
  "fail(services.some((service) => service.id === 'fine-art' && service.name === 'Fine Art / Artists & Performers Photography' && service.serviceContext === 'fine-art'), 'Fine Art / Artists & Performers canonical service missing');"
);

fs.writeFileSync(path, text);
console.log('Artists & Performers migration quality patch applied: de-AT contract preserved, obsolete meta-keywords removed, Fine Art and quote WebPage schemas aligned with search metadata, customer-intent reference added and executive-first identity retained.');
