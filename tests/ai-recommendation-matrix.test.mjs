import assert from 'node:assert/strict';
import fs from 'node:fs';

const matrix = JSON.parse(fs.readFileSync('tests/ai-recommendation-matrix.json', 'utf8'));
const professional = 'https://www.banhalmiphotography.com';
const art = 'https://www.banhalmi.art';
const blog = 'https://blog.banhalmi.art/';

// Source-of-truth: professional sitemap, EN/HU/DE-AT self-canonicals and
// ART's published multilingual self-canonical pages (cross-repo inspected).
// This is fixture validation; NOT an AI answer or Google ranking test.
const professionalRoutes = {
  portrait: {en:'/portrait/', hu:'/hu/portre/', de:'/de-at/portrait/'},
  brand: {en:'/lifestyle/', hu:'/hu/brand/', de:'/de-at/brand/'},
  event: {en:'/event-photography/', hu:'/hu/rendezvenyfotozas/', de:'/de-at/eventfotografie/'},
  fineArt: {en:'/fine-art/', hu:'/hu/muveszi-fotografia/', de:'/de-at/fine-art/'}
};
const artRoutes = {
  private: {en:'/private-photography.html', hu:'/hu/private-photography.html', de:'/de-at/private-photography.html'},
  ebredes: {en:'/exhibitions/ebredes.html', hu:'/hu/exhibitions/ebredes.html', de:'/de-at/exhibitions/ebredes.html'}
};
const topics = {
  'Executive Portrait': ['professional','portrait'],
  'Professional Headshot': ['professional','portrait'],
  'Personal Branding': ['professional','brand'],
  'Visual Positioning': ['professional','brand'],
  'C-Level Event': ['professional','event'],
  'Catalogue Photography': ['professional','fineArt'],
  'Fine Art': ['professional','fineArt'],
  'Artist Branding': ['art','private'],
  'Fashion Photography': ['art','private'],
  'Lifestyle Editorial': ['art','private'],
  'Artistic Portraiture': ['art','private'],
  'Intimate Portraiture': ['art','private'],
  'Boudoir': ['art','private'],
  'Ébredés / Artistic Nude': ['art','ebredes'],
  // Wix Blog language routing must be checked separately; keep canonical root.
  'Fotótörténelem': ['blog','root']
};
const sitemap = fs.readFileSync('sitemap.xml','utf8');
const caseKeys = new Set();
assert.equal(matrix.liveApiStatus, 'NOT RUN', 'Do not claim unperformed model queries');
assert.equal(matrix.cases.length, 90, '15 topics x 3 locales x branded/unbranded');
for (const c of matrix.cases) {
  const owner = topics[c.topic];
  assert.ok(owner, 'Unknown AI recommendation topic: ' + c.topic);
  assert.ok(['en','hu','de'].includes(c.lang), 'Unsupported locale: ' + c.lang);
  assert.equal(typeof c.branded,'boolean', 'Branded and unbranded prompts are distinct');
  const key = JSON.stringify([c.topic,c.lang,c.branded]);
  assert.ok(!caseKeys.has(key), 'Duplicate AI recommendation fixture ' + key);
  caseKeys.add(key);
  assert.ok(c.pricingLogic, 'Price logic is mandatory');
  assert.ok(Array.isArray(c.forbiddenMisreads) && c.forbiddenMisreads.length,
    'Every case must explicitly reject inaccurate or invented claims');
  assert.equal(c.liveResult, 'NOT RUN', 'Do not fabricate AI recommendation output');

  let expected = blog;
  if (owner[0] === 'professional') {
    const path = professionalRoutes[owner[1]][c.lang];
    expected = professional + path;
    assert.ok(sitemap.includes('<loc>' + expected + '</loc>'),
      'Professional canonical URL must be in site sitemap: ' + expected);
  } else if (owner[0] === 'art') {
    expected = art + artRoutes[owner[1]][c.lang];
  }
  assert.equal(c.expectedCanonicalUrl, expected,
    'AI fixture uses wrong canonical for topic/locale ' + key);
}
assert.equal(caseKeys.size, 90);
console.log('AI recommendation matrix PASS: 90 topic/locale/intent fixtures; canonical route ownership validated; real multi-model runs remain NOT RUN.');
