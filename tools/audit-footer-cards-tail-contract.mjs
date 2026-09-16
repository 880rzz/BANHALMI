import fs from 'node:fs';

const failures=[];
const authority=JSON.parse(fs.readFileSync('data/design-authority.json','utf8'));
const fluid=fs.readFileSync('assets/css/fluid-4k-rhythm.css','utf8');
const boot=fs.readFileSync('assets/js/fluid-rhythm-boot.js','utf8');
const hardener=fs.readFileSync('tools/harden-production-artifact.mjs','utf8');
const footer=authority.layout?.footer||{};
const flow=authority.layout?.documentFlow||{};
const must=(ok,msg)=>{if(!ok)failures.push(msg)};

must(Number(footer.desktopColumns)===11,'desktop footer primary band must remain eleven-track geometry');
must(Number(footer.desktopBands)===3,'desktop footer must remain a three-band composition');
must(Number(footer.primaryRows)===1,'desktop footer primary band must remain one rendered row');
must(Number(footer.compactDesktopColumns)===6&&Number(footer.tabletColumns)===6,'intermediate footer must remain six-column compact geometry');
must(Number(footer.paddingTopPx)===18&&Number(footer.paddingBottomPx)===12,'desktop footer padding contract changed');
must(Number(footer.desktopGapPx)===16,'desktop footer gap contract changed');
must(flow.documentBackground==='#202530','document floor must match dark footer');
must(Number(flow.footerAfterDocumentGapMaxPx)===2,'footer-after-document overhang tolerance changed');
must(Number(flow.footerMaxViewportFractionOnTabletDesktop)<=0.4,'desktop footer viewport fraction became too permissive');
must(Number(flow.footerAbsoluteMaxPx)<=360,'desktop footer absolute maximum became too permissive');
must(/grid-template-columns:repeat\(11,minmax\(0,1fr\)\)!important/.test(fluid),'canonical desktop footer must remain a single primary row across eleven tracks');
must(/grid-template-columns:repeat\(6,minmax\(0,1fr\)\)!important/.test(fluid),'canonical intermediate footer six-column geometry missing');
must(fluid.includes('grid-template-rows:auto!important')&&fluid.includes('grid-auto-flow:row!important'),'desktop footer primary band must stay one rendered row');
must(fluid.includes(':is(.cards,.service-process-grid,.archive-cards){align-items:stretch!important}'),'equal-card grid stretch contract missing');
must(/:is\(\.cards,\.service-process-grid,\.archive-cards\)>:is\(\.card,\.archive-card,article\)\{[^}]*height:100%!important;[^}]*align-self:stretch!important;[^}]*display:flex!important;[^}]*flex-direction:column!important/.test(fluid),'equal-card flex-column contract missing');
must(/:is\(\.btn,\.btn-link,\.button,\.more,\.card-action,\.card-cta,\.service-actions,\.archive-actions\):last-child\{margin-top:auto!important\}/.test(fluid),'card action alignment contract missing');
must((fluid.match(/min-height:24px!important/g)||[]).length>=2,'compact footer contact actions must retain at least 24px height');
must(!fluid.includes('min-height:22px!important'),'compact footer must not regress below 24px');
must(boot.includes('/assets/css/fluid-4k-rhythm.css?v=20260916-live-pixel-v22'),'live-pixel cache-bust token missing');
must(fluid.trimEnd().endsWith('/* LIVE-PIXEL-GEOMETRY-V22 */'),'V22 must be the final canonical stylesheet marker');
must(fluid.includes('@media (min-width:769px) and (max-width:1179px)'),'canonical intermediate footer compaction missing');
must(fluid.includes('@media (min-width:1180px) and (max-width:1439px)'),'canonical small-desktop footer compaction missing');
must(fluid.includes('@media (min-width:621px) and (max-width:768px)'),'canonical 768px tablet footer compaction missing');
must(!boot.includes('style.textContent'),'runtime geometry injection must not return');
must(hardener.includes('must never regenerate or append footer/card geometry'),'hardener must declare the V22 no-regeneration contract');
must(!hardener.includes('compactFooterReplacement')&&!hardener.includes('smallDesktopFooter'),'hardener must not restore V20/V21 footer geometry');

if(failures.length){
  console.error(`BANHALMI footer/card/tail contract failed (${failures.length}):`);
  failures.forEach(f=>console.error(`- ${f}`));
  process.exit(1);
}
console.log('BANHALMI footer/card/tail contract passed: three-band desktop footer, compact intermediate geometry, equal cards and canonical CSS authority are protected.');
