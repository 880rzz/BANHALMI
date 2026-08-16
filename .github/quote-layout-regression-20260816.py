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
@media (max-width:620px){
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
