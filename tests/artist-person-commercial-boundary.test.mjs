import fs from 'node:fs';
import assert from 'node:assert/strict';

const variants=[
  ['fine-art/index.html',/any theme or style/i,/no public artistic-nude price/i],
  ['hu/muveszi-fotografia/index.html',/bármilyen témát és stílust/i,/nincs nyilvános aktfotózási ára/i],
  ['de-at/fine-art/index.html',/jedes Thema und jeden Stil/i,/keinen veröffentlichten Aktfotografie-Preis/i]
];
for(const [path,scope,unpriced] of variants){
  const html=fs.readFileSync(path,'utf8');
  assert.match(html,scope,path+': open artistic theme/style scope missing');
  assert.match(html,unpriced,path+': nude pricing boundary missing');
  assert.doesNotMatch(html,/Artistic nude\? Enquire|Művészi akt\? Érdeklődés|Künstlerischer Akt\? Anfrage/,path+': transactional nude CTA reintroduced');
  assert.match(html,/id="professional-portfolio"/,path+': career-facing commercial portfolio route missing');
  assert.match(html,/https:\/\/www\.banhalmi\.art\//,path+': personal ART archive must remain visible as distinct provenance');
  assert.match(html,/data-pricing-disclosure="service"/,path+': legitimate Professional portfolio pricing disclosure missing');
}
console.log('Professional vs personal artistic roles: 3-language content is clear; nude is unpriced, career portfolios remain commercial.');
