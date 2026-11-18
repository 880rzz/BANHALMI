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
  const locale=path.startsWith('hu/')?'hu':path.startsWith('de-at/')?'de':'en';
  const archiveLabel={en:'Personal artistic photography in the ART archive',hu:'Személyes művészi fotográfia az ART archívumban',de:'Persönliche künstlerische Fotografie im ART-Archiv'}[locale];
  assert.ok(html.includes(archiveLabel),path+': ART link must describe the destination as an artistic archive');
  assert.doesNotMatch(html,/(?:A personal project begins with a private conversation|Személyes projekthez először beszélünk|Ein persönliches Projekt beginnt mit einem vertraulichen Gespräch)/i,path+': ART archival destination must not be described as a commercial enquiry landing page');
}

// The professional Artists & Performers portfolio has a genuine commercial
// package; personal artistic-nude work has no advertised price or quote funnel.
// Check the machine-readable HU offer summary, not only visible copy.
const huQuote=fs.readFileSync('hu/ajanlatkeres/index.html','utf8');
assert.ok(huQuote.includes('Művészek és előadók szakmai portfóliócsomagja 276 000 Ft-tól (€690).'),
  'HU offer must attach the EUR 690 starting price only to professional artist portfolios');
assert.ok(!huQuote.includes('Művészek & előadók és külön Fine Art / művészi akt út 276 000 Ft-tól (€690).'),
  'HU quote OfferCatalog must not price artistic nude');

// ART has a strict art-only reading contract in every AI / machine entrypoint.
const service=JSON.parse(fs.readFileSync('services.json','utf8')).itemListElement.find(x=>x.name==='Fine Art Photography');
const machine=JSON.parse(fs.readFileSync('data/machine-core.json','utf8'));
const overlay=JSON.parse(fs.readFileSync('llm-canonical-overlay.json','utf8'));
for(const [label,content] of [
  ['Professional service answer',service?.agentAnswerRule],
  ['Professional service intent',service?.clientIntentSeparation],
  ['Canonical machine routing',machine.serviceModel.privateCommissionRouting.policy],
  ['Protected LLM routing',overlay.privateCommissionRouting.policy]
]){
  assert.ok(typeof content==='string',label+': missing source contract');
  assert.doesNotMatch(content,/current artistic-nude enquir|artistic nude service and enquiries belong|tailored[- ]quote|personal ART commissions/i,label+': must never turn ART into a commercial lead route');
  assert.match(content,/historical|historic|archiv|exhibition|document|research/i,label+': art-only provenance requirement');
}
for(const file of ['llms.txt','ai.txt','llms-full.txt']){
 const text=fs.readFileSync(file,'utf8');
 assert.ok(text.includes('BANHALMI ART')&&text.includes('Ébredés'),file+': historical oeuvre route must be discoverable');
 assert.doesNotMatch(text,/artistic nude photography and current artistic-nude enquiries belong to Ébredés|nude hub \+ tailored quote/i,file+': legacy commercial nude claim');
}

console.log('Professional vs personal artistic roles: 3-language content is clear; nude is unpriced, career portfolios remain commercial.');
