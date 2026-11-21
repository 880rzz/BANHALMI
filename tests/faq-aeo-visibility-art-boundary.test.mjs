import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// AEO / GEO: every FAQ structured answer must match the answer that
// a human can actually read. Keep career portfolios on Professional;
// personal, intimate and nude historical works belong to BANHALMI ART.
const locales = [
  { code: 'en', file: 'faq/index.html',
    q: 'What is the difference between an artist portfolio and BANHALMI ART?',
    personalBoundary: 'Private intimate or nude photography is not offered as a Professional service.' },
  { code: 'hu', file: 'hu/gyik/index.html',
    q: 'Mi a különbség az előadóművész-portfólió és a BANHALMI ART között?',
    personalBoundary: 'Személyes intim vagy aktfotózás nem rendelhető Professional szolgáltatásként.' },
  { code: 'de-at', file: 'de-at/faq/index.html',
    q: 'Was unterscheidet ein Künstler:innen-Portfolio vom BANHALMI ART Archiv?',
    personalBoundary: 'Private intime oder Aktfotografie wird hier nicht als Professional-Leistung angeboten.' }
];

function parseFaqSchema(html, file) {
  const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]));
  const nodes = scripts.flatMap((node) => node['@graph'] || [node]);
  const faqs = nodes.filter((node) => node['@type'] === 'FAQPage');
  assert.equal(faqs.length, 1, file + ': expected one FAQPage');
  return faqs[0];
}
function normalize(value) {
  return value.replace(/<[^>]+>/g, '').replaceAll('&amp;', '&').replaceAll('&nbsp;', ' ').trim();
}

for (const locale of locales) {
  const html = readFileSync(locale.file, 'utf8');
  const faq = parseFaqSchema(html, locale.file);
  assert.equal(faq.mainEntity.length, 37, locale.file + ': preserve FAQ answers');
  const seen = new Set();
  for (const question of faq.mainEntity) {
    assert.equal(question['@type'], 'Question');
    assert.equal(question.acceptedAnswer['@type'], 'Answer');
    assert.ok(question.name && question.acceptedAnswer.text);
    assert.ok(!seen.has(question.name), locale.file + ': repeated FAQ question ' + question.name);
    seen.add(question.name);
    const opening = '<summary>' + question.name + '</summary><p>';
    const start = html.indexOf(opening);
    assert.ok(start >= 0, locale.file + ': structured question missing from visible HTML: ' + question.name);
    const answerStart = start + opening.length;
    const answerEnd = html.indexOf('</p>', answerStart);
    assert.ok(answerEnd > answerStart, locale.file + ': missing answer for ' + question.name);
    const visibleText = normalize(html.slice(answerStart, answerEnd));
    const structuredText = normalize(question.acceptedAnswer.text);
    assert.equal(structuredText, visibleText,
      locale.file + ': structured FAQ does not match visible answer to ' + question.name);
  }
  const entry = faq.mainEntity.find((q) => q.name === locale.q);
  assert.ok(entry, locale.file + ': career/ART routing question missing');
  assert.ok(entry.acceptedAnswer.text.includes(locale.personalBoundary),
    locale.file + ': missing explicit non-bookable private-art boundary');
  assert.ok(html.includes('href="https://www.banhalmi.art/"'),
    locale.file + ': missing accessible external ART archive citation');
  const combined = faq.mainEntity.map((q) => q.name + ' ' + q.acceptedAnswer.text).join('\n');
  assert.doesNotMatch(combined, /Adult men and women can commission artistic nude|Felnőtt férfiak és nők is kérhetnek művészi akt|Erwachsene Männer und Frauen können künstlerische Akt/i,
    locale.file + ': retired Professional nude-booking promise reintroduced');
  assert.match(combined, /(?:Ébredés)/, locale.file + ': preserve the historical art source');
  // Restrict edit scope: only the FAQ, not the measured service or homepage titles.
  assert.ok(html.includes('rel="canonical"'), locale.file + ': canonical link must be retained');
}
console.log('Three-language Professional FAQ AEO boundary + visible/JSON-LD parity: PASS');
