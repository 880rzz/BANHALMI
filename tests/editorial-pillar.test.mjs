import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = path => fs.readFileSync(path, 'utf8');
const j = path => JSON.parse(read(path));
const docs = 'https://www.banhalmiphotography.com/blog-entity.jsonld';
const person = 'https://www.banhalmi.art/#about';
const blog = 'https://blog.banhalmi.art/';
const blogId = blog + '#blog', websiteId = blog + '#website';
const manifest = j('data/machine-core.json').editorialPublication;
const agent = j('.well-known/agent.json');
const policy = j('ecosystem-layer-policy.json');
const entry = j('ai-entry.json').editorialPublication;
const graph = new Map(j('blog-entity.jsonld')['@graph'].map(n => [n['@id'], n]));
assert.deepEqual(entry, manifest);
assert.equal(manifest['@id'], blogId);
assert.equal(manifest.creator, person);
assert.equal(manifest.role, 'canonical-editorial-education');
assert.equal(manifest.entity, docs);
assert.equal(agent.editorialPublication.entity, docs);
assert.ok(agent.read.every(url => url.startsWith('/api/v1/')), 'protocol endpoints remain separate from the editorial reference');
assert.deepEqual(policy.layer1Core.properties.map(p => p.id), ['professional', 'art', 'blog']);
assert.equal(policy.layer1Core.properties[2].machineEntity, docs);
assert.equal(graph.get(blogId)?.['@type'], 'Blog');
assert.equal(graph.get(websiteId)?.['@type'], 'WebSite');
assert.equal(graph.get(websiteId).mainEntity['@id'], blogId);
assert.equal(graph.get(blogId).creator['@id'], person);
assert.equal(graph.get(blogId).isPartOf['@id'], websiteId);
assert.equal(graph.get(blogId).sameAs, undefined);
const professional = j('entity.jsonld')['@graph'];
assert.ok(professional.find(n => n['@id'] === 'https://www.banhalmiphotography.com/#website').mentions.some(n => n['@id'] === websiteId));
assert.ok(!JSON.stringify(professional.find(n => n['@id'] === person).sameAs).includes('blog.banhalmi.art'));
const locales = {
  'hu-HU': ['hu/index.html', 'hu/eletmu/index.html', ''],
  'en-GB': ['index.html', 'about/index.html', '/en'],
  'de-AT': ['de-at/index.html', 'de-at/werk/index.html', '/de']
};
const ecosystem = j('ecosystem.json').canonicalWebsites.find(n => n.role === 'editorial-knowledge-layer');
for (const [locale, [home, about, prefix]] of Object.entries(locales)) {
  const url = prefix ? blog.slice(0, -1) + prefix : blog;
  const routes = manifest.locales[locale];
  assert.equal(url, routes.url);
  assert.equal(url, ecosystem.localizedReadingRoutes[locale]);
  assert.equal(url, agent.editorialPublication.locales[locale]);
  assert.equal(graph.get(url+'#editorial-landing').mainEntity['@id'], blogId);
  for (const p of [routes.photographyHistory, routes.vipachReports, routes.portraitPractice]) {
    assert.ok(p.startsWith(blog.slice(0,-1)+prefix+'/blog/categories/'), locale+': wrong content owner / locale');
    assert.equal(graph.get(p+'#collection')?.inLanguage, locale);
  }
  for (const [i,file] of [home,about].entries()) {
    const page = read(file);
    const editorial = page.match(/<section\b[^>]*id="editorial-publication"[^>]*>[\s\S]*?<\/section>/)?.[0];
    assert.ok(editorial, file+' must have a distinct visible editorial section');
    assert.ok(page.includes('<link href="/blog-entity.jsonld" rel="alternate"'));
    for (const p of [url, routes.photographyHistory, ...(i ? [routes.vipachReports, routes.portraitPractice] : [])]) assert.ok(editorial.includes('href="' + p + '"'), file+' needs direct editorial URL '+p);
    assert.ok(!/requestaquote|\/anfrage|\/ajanlatkeres|data-smart-quote/.test(editorial), file+' editorial should not offer booking or price');
    if (i) assert.ok(!page.match(/<section\b[^>]*id="artistic-archive"[^>]*>[\s\S]*?<\/section>/)?.[0].includes('blog.banhalmi.art'), file+' must not present Blog as part of ART');
  }
}
for (const file of ['llms.txt', 'ai.txt', 'llms-full.txt']) {
  const text=read(file);
  assert.match(text, /first-hand photography stories/);
  assert.match(text, /selected VIPACH event reports/);
  for (const {url} of Object.values(manifest.locales)) assert.ok(text.includes(url), file+' missing localized discovery');
}
assert.match(read('ai.txt').match(/^- Preferred concise answer:.*$/m)[0], /blog\.banhalmi\.art/);
console.log('Editorial pillar: one author relationship, separate purposes, and exact 3L human/agent entry points.');
