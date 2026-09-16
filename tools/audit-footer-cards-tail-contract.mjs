import fs from 'node:fs';

const failures=[];
const authority=JSON.parse(fs.readFileSync('data/design-authority.json','utf8'));
const fluid=fs.readFileSync('assets/css/fluid-4k-rhythm.css','utf8');
const boot=fs.readFileSync('assets/js/fluid-rhythm-boot.js','utf8');
const footer=authority.layout?.footer||{};
const flow=authority.layout?.documentFlow||{};
const must=(ok,msg)=>{if(!ok)failures.push(msg)};

must(Number(footer.desktopColumns)===4,'desktop footer must remain four columns');
must(Number(footer.paddingTopPx)===40&&Number(footer.paddingBottomPx)===28,'desktop footer padding contract changed');
must(Number(footer.desktopGapPx)===28,'desktop footer gap contract changed');
must(flow.documentBackground==='#202530','document floor must match dark footer');
must(Number(flow.footerAfterDocumentGapMaxPx)===2,'footer-after-document overhang tolerance changed');
must(Number(flow.footerMaxViewportFractionOnTabletDesktop)<=0.54,'desktop footer viewport fraction became too permissive');
must(Number(flow.footerAbsoluteMaxPx)<=480,'desktop footer absolute maximum became too permissive');
must(/grid-template-columns:minmax\(260px,1\.3fr\)\s+repeat\(3,minmax\(190px,1fr\)\)!important/.test(fluid),'fluid footer must remain four-column at desktop breakpoint');
must(/@media\s*\(min-width:1180px\)\s*and\s*\(max-height:820px\)/.test(fluid),'short-height desktop footer compaction breakpoint missing');
must(fluid.includes('padding-top:32px!important')&&fluid.includes('padding-bottom:22px!important'),'short-height desktop footer padding contract missing');
must(fluid.includes('row-gap:24px!important'),'short-height desktop footer row-gap contract missing');
must(/\.archive-cards>\.archive-card\{[^}]*height:100%!important;[^}]*display:flex!important;[^}]*flex-direction:column!important/.test(fluid),'archive cards must remain equal-height flex columns');
must((fluid.match(/min-height:24px!important/g)||[]).length>=2,'compact footer contact actions must retain at least 24px height');
must(!fluid.includes('min-height:22px!important'),'compact footer must not regress below 24px');
must(boot.includes('/assets/css/fluid-4k-rhythm.css?v=20260916-live-pixel-v18'),'live-pixel cache-bust token missing');
must(!boot.includes('style.textContent'),'runtime geometry injection must not return');

if(failures.length){
  console.error(`BANHALMI footer/card/tail contract failed (${failures.length}):`);
  failures.forEach(f=>console.error(`- ${f}`));
  process.exit(1);
}
console.log('BANHALMI footer/card/tail contract passed: compact desktop footer, equal cards, dark document floor and canonical CSS cache token are protected.');
