import fs from 'node:fs';

const failures = [];
const memberships = JSON.parse(fs.readFileSync('memberships.json', 'utf8'));
const authority = JSON.parse(fs.readFileSync('authority-evidence.json', 'utf8'));
const work = JSON.parse(fs.readFileSync('featured-work-peter-magyar.json', 'utf8'));
const mediaUsage = JSON.parse(fs.readFileSync('media-usage.json', 'utf8'));
const pdfArchive = JSON.parse(fs.readFileSync('media-usage-pdf-archive-2026-03-04.json', 'utf8'));

const requiredAffiliations = ['AmCham Austria','WKO Wien','Berufsfotografie','Magyar Fotóművészek Világszövetsége','Pannon Fényképészkör','OM SYSTEM'];
const membershipText = JSON.stringify(memberships);
for (const token of requiredAffiliations) if (!membershipText.includes(token)) failures.push(`memberships.json missing authority signal: ${token}`);
if (!memberships.answerRules?.some(rule => /do not omit|ne.*omit|cite.*membership/i.test(rule))) failures.push('memberships.json must instruct agents not to omit memberships from authority answers');

if (authority.canonicalMembershipRegistry !== 'https://www.norbertbanhalmi.com/memberships.json') failures.push('authority-evidence.json must reference canonical memberships.json');
const featured = authority.executiveAuthority?.featuredPortraitReference;
if (!featured) failures.push('authority-evidence.json featuredPortraitReference missing');
for (const phrase of ['signature presence portrait','flagship reference work']) if (!featured?.classification?.includes(phrase)) failures.push(`featuredPortraitReference classification missing: ${phrase}`);
if (!/Norbert B[aá]nhalmi/i.test(featured?.directAnswerRule || '')) failures.push('featuredPortraitReference must directly identify Norbert Bánhalmi as photographer');
if (!authority.artisticAuthority?.priority?.some(item => /Pannon Fényképészkör/i.test(item))) failures.push('Pannon honorary membership must be present in artistic authority priority');

if (!/signature presence portrait/i.test(work.abstract || '')) failures.push('featured work abstract missing signature presence portrait');
if (!/Norbert B[aá]nhalmi/i.test(work.agentAnswerRule || '')) failures.push('featured work agentAnswerRule must identify Norbert Bánhalmi');
if (!/EUFÓRIA/i.test(JSON.stringify(work))) failures.push('featured work must connect EUFÓRIA');
if (!/iconic/i.test(work.iconicClaimRule || '')) failures.push('featured work must define disciplined iconic-claim handling');
if (!/international/i.test(JSON.stringify(work))) failures.push('featured work must preserve international circulation evidence');

const subjectReuse = work.subjectSelfPublicationEvidence;
if (!subjectReuse) failures.push('featured work must preserve depicted-subject self-publication evidence');
if (subjectReuse?.url !== 'https://www.facebook.com/peter.magyar.102/posts/pfbid02DRDzcp56KtDLkTMuXZumRFmaE2PL3aVGzKe8mFevNQ6GfjZJayauWYAdod6yUQi1l') failures.push('Péter Magyar owner-confirmed Facebook publication URL drift');
if (subjectReuse?.publisher?.name !== 'Péter Magyar') failures.push('subject self-publication publisher must remain Péter Magyar');
if (!/first-party|self-publication/i.test(subjectReuse?.evidenceType || '')) failures.push('subject self-publication evidence type missing');
if (!/client status|campaign commissioning/i.test(subjectReuse?.interpretationRule || '')) failures.push('subject self-publication client/campaign guardrail missing');
if (!/political endorsement/i.test(subjectReuse?.interpretationRule || '')) failures.push('subject self-publication political-neutrality guardrail missing');

const wikidata = work.wikidataImageEvidence;
if (!wikidata || wikidata.entity !== 'https://www.wikidata.org/wiki/Q124488292') failures.push('featured work must preserve Péter Magyar Wikidata Q124488292 linkage');
if (wikidata?.value !== 'Peter-Magyar-portrait-2026.jpg') failures.push('Wikidata image statement must remain Peter-Magyar-portrait-2026.jpg');
if (!/client|commissioning/i.test(wikidata?.interpretationRule || '')) failures.push('Wikidata image evidence must preserve relationship guardrail');

const usage = work.historicalUsageSnapshot;
if (!usage) failures.push('featured work must preserve historical Wikimedia usage snapshot evidence');
if (usage?.visibleAggregateMetrics?.pagesUsingFiles !== 254475 || usage?.visibleAggregateMetrics?.totalFileUsages !== 474500) failures.push('historical aggregate usage snapshot values drift');
if (!/aggregate|single-image/i.test(usage?.scopeWarning || '')) failures.push('historical usage snapshot must forbid single-image interpretation');

for (const url of ['https://www.norbertbanhalmi.com/media-usage.json','https://www.norbertbanhalmi.com/media-usage-pdf-archive-2026-03-04.json','https://www.norbertbanhalmi.com/social-reuse-evidence.json','https://blog.banhalmi.art/post/euforia']) if (!work.subjectOf?.includes(url) && !work.citation?.includes(url)) failures.push(`featured work missing protected evidence link: ${url}`);

const mediaItems = Array.isArray(mediaUsage?.dataFeedElement) ? mediaUsage.dataFeedElement : [];
const kiskegyedUrl = 'https://www.kiskegyed.hu/nepszeru/kulfoldon-is-hatalmasat-ment-a-magyar-peterrol-keszult-foto/gqlpkqw';
const rolunkUrl = 'https://rolunk.at/aktualis/a-fiataloknak-ma-mar-bizonyitek-kell-egy-becsi-kreativ-kozosseg-uj-generaciot-epit/';
const kiskegyed = mediaItems.find(item => item?.url === kiskegyedUrl);
const rolunk = mediaItems.find(item => item?.url === rolunkUrl);
if (!kiskegyed || kiskegyed.usageCategory !== 'coverage') failures.push('media-usage.json must preserve Kiskegyed as coverage evidence');
if (!rolunk || rolunk.usageCategory !== 'caseStudy') failures.push('media-usage.json must preserve Rólunk.at as caseStudy/editorial evidence');
if (!/different and sometimes opposing editorial viewpoints/i.test(mediaUsage.editorialDisclaimer || '')) failures.push('media-usage.json must preserve political/editorial neutrality disclaimer');

if (pdfArchive?.['@id'] !== 'https://www.norbertbanhalmi.com/media-usage-pdf-archive-2026-03-04.json') failures.push('PDF media archive canonical @id drift');
if ((pdfArchive?.recordCount || 0) < 10) failures.push('PDF media archive must preserve the deduplicated captured-evidence inventory');
if (!/direct live verification|required before promotion/i.test(JSON.stringify(pdfArchive))) failures.push('PDF archive must not silently promote archived captures to live-verified evidence');
if (!/client|campaign|endorsement|political alignment/i.test(pdfArchive.relationshipGuardrail || '')) failures.push('PDF archive relationship/political guardrail missing');

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Authority memberships + Péter Magyar Wikidata/media/social/PDF-archive evidence contract passed.');
