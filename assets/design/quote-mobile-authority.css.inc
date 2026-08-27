/* BANHALMI Quote Mobile Authority 2026-08-27
   Final quote-category geometry across mobile, tablet and desktop.
   Keeps the category controls intrinsically sized so translated copy cannot
   create stretched rows or large empty tails at desktop widths. */
html body main .smart-quote-layout .category-card{
  min-height:0!important;
  height:max-content!important;
  padding:12px!important;
  align-content:start!important;
  align-items:start!important;
  align-self:start!important;
  grid-auto-rows:max-content!important;
}
html body main .smart-quote-layout .category-card>span{
  min-width:0!important;
  width:auto!important;
  max-width:100%!important;
  overflow-wrap:anywhere!important;
  align-self:start!important;
}
html body main .smart-quote-layout .category-card strong{
  line-height:1.22!important;
}
html body main .smart-quote-layout .category-card em{
  font-size:.875rem!important;
  line-height:1.30!important;
  margin-top:2px!important;
}
@media(min-width:1024px){
  html body main .smart-quote-layout{
    grid-template-columns:minmax(220px,.45fr) minmax(0,1.55fr)!important;
    gap:28px!important;
  }
  html body main .smart-quote-layout .category-grid{
    align-content:start!important;
    align-items:start!important;
    grid-auto-rows:max-content!important;
  }
  html body main .smart-quote-layout .category-card{
    padding:8px 12px 7px!important;
  }
  html body main .smart-quote-layout .category-card em{
    font-size:.8125rem!important;
    line-height:1.28!important;
  }
}
@media(min-width:621px){
  html body main .smart-quote-layout .category-card{
    grid-template-columns:24px minmax(0,1fr)!important;
    column-gap:10px!important;
  }
}
@media(max-width:620px){
  html body:not([data-qa-x1]):not([data-qa-x2]):not([data-qa-x3]):not([data-qa-x4]):not([data-qa-x5]):not([data-qa-x6]) main .category-card{
    grid-template-columns:18px minmax(0,1fr)!important;
    column-gap:8px!important;
    padding:14px!important;
  }
  html body:not([data-qa-x1]):not([data-qa-x2]):not([data-qa-x3]):not([data-qa-x4]):not([data-qa-x5]):not([data-qa-x6]) main .category-card>span{
    min-width:0!important;
    width:auto!important;
    max-width:100%!important;
    overflow-wrap:anywhere!important;
  }
}
