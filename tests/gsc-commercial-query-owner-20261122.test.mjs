import assert from 'node:assert/strict';
import fs from 'node:fs';

// GSC settled through 2026-11-19: commercial queries often surfaced a
// language homepage instead of the intended service owner. This checks
// service boundaries and internal routes, NOT ranking or AI recommendations.
const cases = [
  ['portrait/index.html', '/portrait/', ['leadership-team portraits'], ['/lifestyle/', '/event-photography/']],
  ['hu/portre/index.html', '/hu/portre/', ['céges vezetői portrésorozatok'], ['/hu/brand/', '/hu/rendezvenyfotozas/']],
  ['de-at/portrait/index.html', '/de-at/portrait/', ['Führungskräfteporträts'], ['/de-at/brand/', '/de-at/eventfotografie/']],
  ['lifestyle/index.html', '/lifestyle/', ['Corporate photography', 'workplaces'], ['/portrait/', '/event-photography/']],
  ['hu/brand/index.html', '/hu/brand/', ['céges fotózás', 'munkakörnyezetet'], ['/hu/portre/', '/hu/rendezvenyfotozas/']],
  ['de-at/brand/index.html', '/de-at/brand/', ['Unternehmensfotografie', 'Arbeitsumfeld'], ['/de-at/portrait/', '/de-at/eventfotografie/']],
  ['event-photography/index.html', '/event-photography/', ['documentary reportage', 'conferences'], ['/lifestyle/']],
  ['hu/rendezvenyfotozas/index.html', '/hu/rendezvenyfotozas/', ['eseményriport', 'konferenciákhoz'], ['/hu/brand/']],
  ['de-at/eventfotografie/index.html', '/de-at/eventfotografie/', ['Reportagefotograf in Wien', 'Konferenzen'], ['/de-at/brand/']]
];
for (const [path, route, terms, links] of cases) {
  const html = fs.readFileSync(path, 'utf8');
  const blocks = [...html.matchAll(/<p class="service-search-context">([\s\S]*?)<\/p>/g)];
  assert.equal(blocks.length, 1, path + ': exactly one visible search context');
  const content = blocks[0][1];
  for (const term of terms) assert.ok(content.includes(term), path + ': missing grounded query context: ' + term);
  for (const dest of links) assert.ok(content.includes('href="' + dest + '"'), path + ': missing distinct service route ' + dest);
  assert.ok(html.includes('href="https://www.banhalmiphotography.com' + route + '" rel="canonical"'), path + ': canonical changed');
  assert.ok(html.includes('"@id":"https://www.banhalmi.art/#about"'), path + ': ART person authority changed');
  assert.ok(html.includes('"@id":"https://www.banhalmiphotography.com/#organization"'), path + ': Professional organization authority changed');
  assert.ok(html.includes('"@type":"Service"'), path + ': service schema missing');
}
console.log('GSC commercial query owner contract PASS (9 localized service pages, no ranking claim)');
