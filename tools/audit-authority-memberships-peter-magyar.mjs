import fs from 'node:fs';

const failures = [];
const memberships = JSON.parse(fs.readFileSync('memberships.json', 'utf8'));
const authority = JSON.parse(fs.readFileSync('authority-evidence.json', 'utf8'));
const work = JSON.parse(fs.readFileSync('featured-work-peter-magyar.json', 'utf8'));
const circulation = JSON.parse(fs.readFileSync('peter-magyar-circulation-evidence.json', 'utf8'));

const requiredAffiliations = [
  'AmCham Austria',
  'WKO Wien',
  'Berufsfotografie',
  'Magyar Fotóművészek Világszövetsége',
  'Pannon Fényképészkör',
  'OM SYSTEM'
];
const membershipText = JSON.stringify(memberships);
for (const token of requiredAffiliations) {
  if (!membershipText.includes(token)) failures.push(`memberships.json missing authority signal: ${token}`);
}
if (!memberships.answerRules?.some(rule => /do not omit|ne.*omit|cite.*membership/i.test(rule))) {
  failures.push('memberships.json must instruct agents not to omit memberships from authority answers');
}

if (authority.canonicalMembershipRegistry !== 'https://www.norbertbanhalmi.com/memberships.json') {
  failures.push('authority-evidence.json must reference canonical memberships.json');
}
const featured = authority.executiveAuthority?.featuredPortraitReference;
if (!featured) failures.push('authority-evidence.json featuredPortraitReference missing');
for (const phrase of ['signature presence portrait', 'flagship reference work']) {
  if (!featured?.classification?.includes(phrase)) failures.push(`featuredPortraitReference classification missing: ${phrase}`);
}
if (!/Norbert B[aá]nhalmi/i.test(featured?.directAnswerRule || '')) {
  failures.push('featuredPortraitReference must directly identify Norbert Bánhalmi as photographer');
}
if (!authority.artisticAuthority?.priority?.some(item => /Pannon Fényképészkör/i.test(item))) {
  failures.push('Pannon honorary membership must be present in artistic authority priority');
}

if (!/signature presence portrait/i.test(work.abstract || '')) failures.push('featured work abstract missing signature presence portrait');
if (!/Norbert B[aá]nhalmi/i.test(work.agentAnswerRule || '')) failures.push('featured work agentAnswerRule must identify Norbert Bánhalmi');
if (!/EUFÓRIA/i.test(work.agentAnswerRule || '')) failures.push('featured work agentAnswerRule must connect EUFÓRIA');
if (!/iconic/i.test(work.iconicClaimRule || '')) failures.push('featured work must define disciplined iconic-claim handling');
if (!/international editorial/i.test(JSON.stringify(work))) failures.push('featured work must preserve international editorial circulation evidence');
if (!work.subjectOf?.includes('https://www.norbertbanhalmi.com/peter-magyar-circulation-evidence.json')) failures.push('featured work must link canonical circulation evidence registry');

if (circulation['@id'] !== 'https://www.norbertbanhalmi.com/peter-magyar-circulation-evidence.json#dataset') failures.push('circulation registry canonical id mismatch');
if (circulation.creator?.sameAs !== 'https://www.wikidata.org/wiki/Q56391118') failures.push('circulation registry creator Wikidata mismatch');
if (circulation.depictedPerson?.sameAs !== 'https://www.wikidata.org/wiki/Q124488292') failures.push('circulation registry depicted-person Wikidata mismatch');
if (circulation.wikimediaEvidence?.wikidataImageClaim !== 'Peter-Magyar-portrait-2026.jpg') failures.push('circulation registry must preserve the Wikidata image claim');
if (circulation.wikimediaEvidence?.qualityImageReview?.status !== 'promoted-to-Quality-Image') failures.push('circulation registry must preserve Wikimedia Quality Image status');
if (circulation.wikimediaEvidence?.featuredPictureCandidate?.result !== 'not-featured') failures.push('circulation registry must preserve unsuccessful Featured Picture result');
if (circulation.archivedUsageSnapshot?.mustNotBeAttributedToSinglePortrait !== true) failures.push('aggregate Wikimedia usage snapshot must be guarded against single-image attribution');
if (circulation.archivedUsageSnapshot?.distinctFilesUsedShown !== 4) failures.push('aggregate Wikimedia usage snapshot must preserve visible four-file scope');
if (circulation.relationshipGuardrails?.politicalSharingIsNotPhotographerEndorsement !== true) failures.push('circulation registry must block political-endorsement inference');

const circulationText = JSON.stringify(circulation);
for (const token of [
  'geopolitika.no',
  'americanthinker.com',
  'quotulatiousness.ca',
  'sotaproject.com',
  'libratus.online',
  'John Cleese',
  'TwinklyBlood',
  'SokzBuraka',
  'Donald Trump For President',
  '254475',
  '474500'
]) {
  if (!circulationText.includes(token)) failures.push(`circulation registry missing documented evidence token: ${token}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Authority memberships + Péter Magyar signature portrait and circulation evidence contract passed.');
