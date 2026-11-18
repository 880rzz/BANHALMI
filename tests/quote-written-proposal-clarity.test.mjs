import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const cases = [
  { file: 'requestaquote/index.html', label: 'From estimate to written proposal.', keywords: ['deliverables', 'retouching', 'usage rights', 'timing', 'location', 'VAT'] },
  { file: 'hu/ajanlatkeres/index.html', label: 'A becsléstől az írásos ajánlatig.', keywords: ['retusálás', 'felhasználási jogokat', 'időzítést', 'helyszínt', 'áfával'] },
  { file: 'de-at/anfrage/index.html', label: 'Von der Schätzung zum schriftlichen Angebot.', keywords: ['Retusche', 'Nutzungsrechte', 'Termin', 'Ort', 'USt.'] }
];
for (const { file, label, keywords } of cases) {
  const html = readFileSync(file, 'utf8');
  const section = html.match(/<section class="quote-pricing-overview"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, file + ': offer choice section must exist');
  assert.equal((section.match(/class="quote-price-card"/g) || []).length, 4,
    file + ': all four existing service choices retained');
  const para = section.match(/<p class="quote-price-footnote"><strong>[^<]+<\/strong>[^<]+<\/p>/g) || [];
  assert.equal(para.length, 1, file + ': exactly one visible proposal explanation');
  assert.ok(para[0].includes(label), file + ': language-specific explanation retained');
  for (const word of keywords) assert.ok(para[0].includes(word), file + ': missing quote detail ' + word);
  assert.ok(html.includes('<details class="quote-calculator-disclosure" id="quote-calculator">'),
    file + ': calculator remains an optional disclosure for direct visitors');
  assert.ok(!html.includes('<details class="quote-calculator-disclosure" id="quote-calculator" open'),
    file + ': no forced full-form expansion');
  assert.ok(section.includes('#quote-calculator'), file + ': cards still open calculator after selection');
}
console.log('Written quote clarity PASS: EN/HU/DE, four choices, calculator disclosure preserved.');
