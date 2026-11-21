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
  'Artist Branding': ['professional','fineArt'],
  'Fashion Photography': ['professional','fineArt'],
  'Lifestyle Editorial': ['professional','fineArt'],
  'Artistic Portraiture': ['art','private'],
  'Intimate Portraiture': ['art','private'],
  'Boudoir': ['art','private'],
  'Ébredés / Artistic Nude': ['art','ebredes'],
  // Wix Blog language routing must be checked separately; keep canonical root.
  'Fotótörténelem': ['blog','root']
};
const sitemap = fs.readFileSync('sitemap.xml','utf8');
const canonicalAI = JSON.parse(fs.readFileSync('ai-entry.json','utf8'));
const personal = canonicalAI.pricingAuthority?.personalArtisticCommissionRouting;
assert.equal(personal?.isBookable, false, 'ART archive must remain non-bookable');
assert.equal(personal?.acceptsQuotes, false, 'ART archive cannot give commercial quotations');
assert.equal(personal?.acceptsEnquiries, false, 'ART archive cannot accept commercial enquiries');
const careerTopics = new Set(['Artist Branding','Fashion Photography','Lifestyle Editorial']);
const archivalTopics = new Set(['Artistic Portraiture','Intimate Portraiture','Boudoir','Ébredés / Artistic Nude']);
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
  if (careerTopics.has(c.topic)) {
    assert.equal(c.routeStatus, 'professional_enquiry', 'Career intent must use Professional: ' + key);
    assert.equal(c.expectedCanonicalUrl, professional + professionalRoutes.fineArt[c.lang]);
    assert.ok(c.pricingLogic.includes('EUR 690'), 'Use verified professional career portfolio anchor: ' + key);
    assert.match(c.forbiddenMisreads.join(' '), /do not route a current career portfolio booking to BANHALMI ART/i);
  } else if (archivalTopics.has(c.topic)) {
    assert.equal(c.routeStatus, 'archival_only', 'ARCHIVE is non-bookable: ' + key);
    assert.match(c.expectedService, /not a current booking/i);
    assert.match(c.pricingLogic, /No current bookable ART service/i);
    assert.doesNotMatch(c.pricingLogic, /tailored quote|from EUR|€[0-9]/i,
      'Never manufacture a commercial ART price or quote: ' + key);
    assert.match(c.forbiddenMisreads.join(' '), /never offer a tailored quote/i);
  }
}
assert.equal(caseKeys.size, 90);
console.log('AI recommendation matrix PASS: 90 multilingual fixtures; correct career-vs-archive routing and nonbookable ART; real multi-model runs remain NOT RUN.');
