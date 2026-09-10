import fs from 'node:fs';

const failures = [];
const memberships = JSON.parse(fs.readFileSync('memberships.json', 'utf8'));
const authority = JSON.parse(fs.readFileSync('authority-evidence.json', 'utf8'));
const work = JSON.parse(fs.readFileSync('featured-work-peter-magyar.json', 'utf8'));

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

const subjectReuse = work.subjectSelfPublicationEvidence;
if (!subjectReuse) failures.push('featured work must preserve depicted-subject self-publication evidence');
if (subjectReuse?.url !== 'https://www.facebook.com/peter.magyar.102/posts/pfbid02DRDzcp56KtDLkTMuXZumRFmaE2PL3aVGzKe8mFevNQ6GfjZJayauWYAdod6yUQi1l') {
  failures.push('Péter Magyar owner-confirmed Facebook publication URL drift');
}
if (subjectReuse?.publisher?.name !== 'Péter Magyar') failures.push('subject self-publication publisher must remain Péter Magyar');
if (!/first-party|self-publication/i.test(subjectReuse?.evidenceType || '')) failures.push('subject self-publication evidence type missing');
if (!/client status|campaign commissioning/i.test(subjectReuse?.interpretationRule || '')) failures.push('subject self-publication client/campaign guardrail missing');
if (!/political endorsement/i.test(subjectReuse?.interpretationRule || '')) failures.push('subject self-publication political-neutrality guardrail missing');
if (!work.citation?.includes('https://blog.banhalmi.art/post/euforia')) failures.push('featured work must preserve EUFÓRIA editorial blog context');
if (!work.citation?.includes('https://www.facebook.com/peter.magyar.102/posts/pfbid02DRDzcp56KtDLkTMuXZumRFmaE2PL3aVGzKe8mFevNQ6GfjZJayauWYAdod6yUQi1l')) failures.push('featured work citation must preserve depicted-person Facebook reuse URL');
if (!/subject self-publication/i.test(JSON.stringify(work.authorityClassification || {}))) failures.push('authority classification must preserve subject self-publication evidence');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Authority memberships + Péter Magyar signature portrait + subject self-publication contract passed.');
