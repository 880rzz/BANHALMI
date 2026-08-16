from pathlib import Path

p = Path('assets/css/site.css')
s = p.read_text(encoding='utf-8')
marker = '/* APPLE-RESPONSIVE-CONTRACT-V1:END */'
if marker not in s:
    raise SystemExit('final contract marker missing')
block = r'''
/* QUOTE-LAYOUT-REGRESSION-20260816:START */
/* Keep quote choices optically compact: intrinsic rows, no distributed empty space. */
html body .smart-quote-layout .category-grid{
  align-content:start!important;
  align-items:start!important;
  grid-auto-rows:max-content!important;
  height:auto!important;
  min-height:0!important;
}
html body .smart-quote-layout .quote-step{
  height:auto!important;
  min-height:0!important;
  align-self:start!important;
  margin-bottom:14px!important;
  padding:18px 20px!important;
}
html body .smart-quote-layout .quote-step h3{margin-bottom:12px!important;}
html body .smart-quote-layout .option-stack{gap:8px!important;margin-bottom:10px!important;}
html body .smart-quote-layout .category-grid{gap:10px!important;row-gap:10px!important;}
html body .smart-quote-layout .grid-2,
html body .smart-quote-layout .grid-3,
html body .smart-quote-layout .check-grid,
html body .smart-quote-layout .production-grid{row-gap:10px!important;column-gap:10px!important;align-items:start!important;}
html body .smart-quote-layout .category-card,
html body .smart-quote-layout .option-row{margin:0!important;min-height:0!important;height:auto!important;align-self:start!important;}

/* Choice row contract: radio at the left inner edge, copy in the fluid middle,
   and the 44px info target locked to the right edge on the same visual row. */
html body .smart-quote-layout .option-row{
  display:grid!important;
  grid-template-columns:24px minmax(0,1fr)!important;
  column-gap:12px!important;
  align-items:center!important;
}
html body .smart-quote-layout .option-row > input[type="radio"]{
  grid-column:1!important;
  justify-self:start!important;
  align-self:center!important;
  margin:0!important;
  inline-size:24px!important;
  block-size:24px!important;
  min-width:24px!important;
  min-height:24px!important;
}
html body .smart-quote-layout .option-row > span{
  grid-column:2!important;
  display:grid!important;
  width:100%!important;
  min-width:0!important;
  grid-template-columns:minmax(0,1fr) 44px!important;
  column-gap:14px!important;
  align-items:center!important;
  line-height:1.42!important;
}
html body .smart-quote-layout .option-row > span > .info-tip{
  position:static!important;
  grid-column:2!important;
  grid-row:1!important;
  justify-self:end!important;
  align-self:center!important;
  margin:0!important;
}

/* Contract/licensing drawer: preserve breathing room between intro copy, card grid,
   action row and the following legal bridge. The drawer must never visually collide
   with the next section. */
html body .quote-deep-details > section.pricing-licensing-clarity{
  padding-top:clamp(34px,4vw,52px)!important;
  padding-bottom:clamp(42px,4.8vw,64px)!important;
}
html body .quote-deep-details .pricing-licensing-clarity .section-head{
  margin-bottom:clamp(34px,4vw,48px)!important;
}
html body .quote-deep-details .pricing-licensing-clarity .section-head > :last-child{
  margin-bottom:0!important;
}
html body .quote-deep-details .pricing-licensing-clarity .card-grid{
  margin-top:0!important;
  margin-bottom:clamp(34px,4vw,48px)!important;
  row-gap:clamp(18px,2.2vw,26px)!important;
  column-gap:clamp(18px,2.2vw,26px)!important;
}
html body .quote-deep-details .pricing-licensing-clarity .button-row{
  margin:0!important;
  padding-top:2px!important;
}
html body .quote-deep-details > section.quote-legal-bridge{
  margin-top:0!important;
  padding-top:clamp(42px,4.8vw,64px)!important;
  padding-bottom:clamp(42px,4.8vw,64px)!important;
  border-top:1px solid var(--line)!important;
}
html body .quote-deep-details > section.quote-legal-bridge .section-head{
  margin-bottom:clamp(24px,3vw,34px)!important;
}
html body .quote-deep-details > section.quote-legal-bridge .service-actions{
  margin-top:0!important;
  padding-top:0!important;
}

/* Footer metadata row: copyright flush left, utility links flush right on desktop. */
@media (min-width:981px){
  html body .site-footer .footer-bottom{
    display:grid!important;
    grid-template-columns:max-content minmax(0,1fr)!important;
    align-items:center!important;
    column-gap:28px!important;
    row-gap:0!important;
    width:100%!important;
  }
  html body .site-footer .footer-bottom > span:first-child{
    justify-self:start!important;
    text-align:left!important;
    white-space:nowrap!important;
  }
  html body .site-footer .footer-bottom > span:last-child{
    justify-self:end!important;
    text-align:right!important;
    white-space:nowrap!important;
  }
}
@media (max-width:980px){
  html body .site-footer .footer-bottom{grid-template-columns:1fr!important;row-gap:8px!important;}
  html body .site-footer .footer-bottom > span:first-child,
  html body .site-footer .footer-bottom > span:last-child{justify-self:start!important;text-align:left!important;white-space:normal!important;}
}
@media (max-width:620px){
  html body .smart-quote-layout .option-row{grid-template-columns:24px minmax(0,1fr)!important;column-gap:10px!important;}
  html body .smart-quote-layout .option-row > span{grid-template-columns:minmax(0,1fr) 44px!important;column-gap:10px!important;}
  html body .quote-deep-details > section.pricing-licensing-clarity,
  html body .quote-deep-details > section.quote-legal-bridge{padding-top:30px!important;padding-bottom:36px!important;}
  html body .quote-deep-details .pricing-licensing-clarity .section-head{margin-bottom:28px!important;}
  html body .quote-deep-details .pricing-licensing-clarity .card-grid{margin-bottom:30px!important;row-gap:14px!important;column-gap:14px!important;}
}
/* QUOTE-LAYOUT-REGRESSION-20260816:END */
'''
if '/* QUOTE-LAYOUT-REGRESSION-20260816:START */' in s:
    a = s.index('/* QUOTE-LAYOUT-REGRESSION-20260816:START */')
    b = s.index('/* QUOTE-LAYOUT-REGRESSION-20260816:END */', a) + len('/* QUOTE-LAYOUT-REGRESSION-20260816:END */')
    s = s[:a] + block.strip() + s[b:]
else:
    s = s.replace(marker, block + '\n' + marker)
p.write_text(s, encoding='utf-8')
