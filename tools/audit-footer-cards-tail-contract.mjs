import fs from 'node:fs';

const failures=[];
const authority=JSON.parse(fs.readFileSync('data/design-authority.json','utf8'));
const fluid=fs.readFileSync('assets/css/fluid-4k-rhythm.css','utf8');
const boot=fs.readFileSync('assets/js/fluid-rhythm-boot.js','utf8');
const footer=authority.layout?.footer||{};
const flow=authority.layout?.documentFlow||{};
const must=(ok,msg)=>{if(!ok)failures.push(msg)};

must(Number(footer.desktopColumns)===6,'desktop footer must remain six columns so eight footer groups resolve into two rows');
must(Number(footer.paddingTopPx)===40&&Number(footer.paddingBottomPx)===28,'desktop footer open padding contract changed');
must(Number(footer.desktopGapPx)===28,'desktop footer open gap contract changed');
must(flow.documentBackground==='#202530','document floor must match dark footer to prevent Safari white tail after footer');
must(Number(flow.footerAfterDocumentGapMaxPx)===2,'footer-after-document overhang tolerance changed');
must(fluid.includes('grid-template-columns:minmax(220px,1.6fr) repeat(5,minmax(110px,1fr)) !important'),'fluid footer must remain six-column at desktop breakpoint');
must(fluid.includes('html body main .archive-cards > .archive-card{'),'archive card equal-height selector missing');
must(fluid.includes('height:100% !important;')&&fluid.includes('flex-direction:column !important;'),'archive cards must remain equal-height flex columns');
must(fluid.includes('html body main :is(.archive-card,.card) .more{\n  margin-top:auto;'),'archive-card bottom CTA alignment contract missing');
must(boot.includes('/assets/css/fluid-4k-rhythm.css?v=20260915-footer-cards-v1'),'fluid footer/card cache-bust token missing');

if(failures.length){
  console.error(`BANHALMI footer/card/tail contract failed (${failures.length}):`);
  failures.forEach(f=>console.error(`- ${f}`));
  process.exit(1);
}
console.log('BANHALMI footer/card/tail contract passed: two-row desktop footer, equal archive cards, dark document floor and cache-bust token are protected.');
