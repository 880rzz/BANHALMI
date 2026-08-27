/* BANHALMI Quote Mobile Authority 2026-08-27
   Final quote-category geometry across mobile, tablet and desktop.
   This service-specific authority intentionally outranks the generic [class$="-card"]
   optical-axis rule so quote choices stay compact without touching their cell walls. */
html body:not([data-qa-x1]):not([data-qa-x2]):not([data-qa-x3]):not([data-qa-x4]):not([data-qa-x5]):not([data-qa-x6]) main .smart-quote-layout .category-card.category-card.category-card{
  min-height:0!important;
  height:max-content!important;
  padding:16px!important;
  align-content:start!important;
  align-items:start!important;
  align-self:start!important;
  justify-content:start!important;
  grid-auto-rows:max-content!important;
  grid-template-rows:max-content max-content!important;
}
html body:not([data-qa-x1]):not([data-qa-x2]):not([data-qa-x3]):not([data-qa-x4]):not([data-qa-x5]):not([data-qa-x6]) main .smart-quote-layout .category-card>span{
  min-width:0!important;
  width:auto!important;
  max-width:100%!important;
  overflow-wrap:anywhere!important;
  align-self:start!important;
}
html body:not([data-qa-x1]):not([data-qa-x2]):not([data-qa-x3]):not([data-qa-x4]):not([data-qa-x5]):not([data-qa-x6]) main .smart-quote-layout .category-card strong{
  line-height:1.22!important;
}
html body:not([data-qa-x1]):not([data-qa-x2]):not([data-qa-x3]):not([data-qa-x4]):not([data-qa-x5]):not([data-qa-x6]) main .smart-quote-layout .category-card em{
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
    grid-template-rows:none!important;
  }
  html body:not([data-qa-x1]):not([data-qa-x2]):not([data-qa-x3]):not([data-qa-x4]):not([data-qa-x5]):not([data-qa-x6]) main .smart-quote-layout .category-card.category-card.category-card{
    height:fit-content!important;
    min-height:0!important;
    padding:10px 16px!important;
    align-self:start!important;
    align-content:start!important;
  }
  html body:not([data-qa-x1]):not([data-qa-x2]):not([data-qa-x3]):not([data-qa-x4]):not([data-qa-x5]):not([data-qa-x6]) main .smart-quote-layout .category-card em{
    font-size:.8125rem!important;
    line-height:1.28!important;
  }
}
@media(min-width:621px){
  html body:not([data-qa-x1]):not([data-qa-x2]):not([data-qa-x3]):not([data-qa-x4]):not([data-qa-x5]):not([data-qa-x6]) main .smart-quote-layout .category-card{
    grid-template-columns:24px minmax(0,1fr)!important;
    column-gap:10px!important;
  }
}
@media(max-width:620px){
  html body:not([data-qa-x1]):not([data-qa-x2]):not([data-qa-x3]):not([data-qa-x4]):not([data-qa-x5]):not([data-qa-x6]) main .smart-quote-layout .category-card.category-card.category-card{
    grid-template-columns:18px minmax(0,1fr)!important;
    grid-template-rows:max-content max-content!important;
    column-gap:8px!important;
    padding:16px!important;
  }
  html body:not([data-qa-x1]):not([data-qa-x2]):not([data-qa-x3]):not([data-qa-x4]):not([data-qa-x5]):not([data-qa-x6]) main .category-card>span{
    min-width:0!important;
    width:auto!important;
    max-width:100%!important;
    overflow-wrap:anywhere!important;
  }
}
