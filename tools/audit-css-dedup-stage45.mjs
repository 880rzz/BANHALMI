import fs from 'node:fs';

const css=fs.readFileSync('assets/css/style.css','utf8');
const errors=[];
const marker='/* Production v3 — editorial SEO/GEO and Platon-inspired language sections */';

const markerCount=css.split(marker).length-1;
if(markerCount!==1) errors.push(`style.css must contain exactly one Production v3 editorial block; found ${markerCount}`);

for(const required of [
  '.editorial-about-expanded{background:#fff;}',
  '.banhalmi-platon-service-intro{',
  '.legal-grid{',
  '.professional-network .prose{',
  '.project-team-select, .amcham-benefit-box, .project-goals, .project-summary',
  '.service-info-cards{',
  '.site-header{',
  '.nav-links{',
  '.footer-brand-col{',
  '.menu-btn{display:inline-flex;}',
  '/* STAGE43-INLINE-PRESENTATION:START */'
]){
  if(!css.includes(required)) errors.push(`style.css missing Stage 45 retained design contract: ${required}`);
}

// The removed duplicate began at the second Production-v3 marker and repeated
// a long navigation/form/editorial sequence byte-for-byte. A second marker is
// therefore a deterministic regression, not an intentional override layer.
if(css.indexOf(marker)!==css.lastIndexOf(marker)){
  errors.push('style.css reintroduced the exact historical Production-v3 duplicate layer');
}

if(errors.length){
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Stage 45 CSS deduplication audit passed: one authoritative Production-v3 block remains and retained design contracts are present.');
