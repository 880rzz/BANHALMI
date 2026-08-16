from pathlib import Path

p = Path('assets/css/site.css')
s = p.read_text(encoding='utf-8')
marker = '/* APPLE-RESPONSIVE-CONTRACT-V1:END */'
if marker not in s:
    raise SystemExit('final contract marker missing')
block = r'''
/* QUOTE-LAYOUT-REGRESSION-20260816:START */
/* Keep quote choices optically compact: intrinsic rows, no distributed empty space. */
html body .smart-quote-layout{
  align-items:start!important;
}
html body .smart-quote-layout>.form,
html body .smart-quote-layout [data-smart-quote]{
  align-content:start!important;
}
html body .smart-quote-layout .category-grid{
  align-content:start!important;
  align-items:start!important;
  grid-auto-rows:max-content!important;
  height:auto!important;
  min-height:0!important;
  row-gap:10px!important;
}
html body .smart-quote-layout .quote-step{
  height:auto!important;
  min-height:0!important;
  align-self:start!important;
  margin-bottom:14px!important;
  padding:18px 20px!important;
}
html body .smart-quote-layout .quote-step h3{
  margin-bottom:12px!important;
}
html body .smart-quote-layout .option-stack{
  gap:8px!important;
  margin-bottom:10px!important;
}
html body .smart-quote-layout :is(.grid-2,.grid-3,.check-grid,.production-grid){
  row-gap:10px!important;
  align-items:start!important;
}
html body .smart-quote-layout :is(.category-card,.option-row){
  margin:0!important;
  min-height:0!important;
  height:auto!important;
  align-self:start!important;
}
html body .smart-quote-layout .conditional-panel{
  margin-bottom:10px!important;
}
html body .smart-quote-layout .conditional-panel[hidden]{
  display:none!important;
}
html body .smart-quote-layout .quote-step > :last-child{
  margin-bottom:0!important;
}
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
/* Footer metadata row: copyright flush left, legal/utility links flush right,
   one shared baseline on desktop. */
.site-footer .footer-bottom{
  display:flex!important;
  width:100%!important;
  align-items:center!important;
  justify-content:space-between!important;
  gap:24px!important;
  margin-top:28px!important;
  padding-top:16px!important;
  line-height:1.4!important;
}
.site-footer .footer-bottom > span:first-child{
  flex:0 0 auto!important;
  margin:0!important;
  white-space:nowrap!important;
  text-align:left!important;
}
.site-footer .footer-bottom > span:last-child{
  flex:1 1 auto!important;
  min-width:0!important;
  margin:0!important;
  display:flex!important;
  flex-wrap:nowrap!important;
  justify-content:flex-end!important;
  align-items:center!important;
  text-align:right!important;
  white-space:nowrap!important;
}
@media (max-width:980px){
  .site-footer .footer-bottom{
    display:grid!important;
    grid-template-columns:1fr!important;
    align-items:start!important;
    justify-content:stretch!important;
    gap:8px!important;
  }
  .site-footer .footer-bottom > span:first-child{
    white-space:normal!important;
  }
  .site-footer .footer-bottom > span:last-child{
    display:block!important;
    text-align:left!important;
    white-space:normal!important;
  }
}
@media (max-width:620px){
  html body .smart-quote-layout .quote-step{
    margin-bottom:12px!important;
    padding:16px!important;
  }
  html body .smart-quote-layout .category-grid,
  html body .smart-quote-layout .option-stack,
  html body .smart-quote-layout :is(.grid-2,.grid-3,.check-grid,.production-grid){
    row-gap:8px!important;
    gap:8px!important;
  }
  html body .smart-quote-layout .option-row{
    grid-template-columns:24px minmax(0,1fr)!important;
    column-gap:10px!important;
  }
  html body .smart-quote-layout .option-row > span{
    grid-template-columns:minmax(0,1fr) 44px!important;
    column-gap:10px!important;
  }
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
