/* BANHALMI Quote Mobile Authority 2026-08-26
   Final quote-category geometry across mobile, tablet and desktop. */
html body main .smart-quote-layout .category-card{
  min-height:0!important;
  height:auto!important;
  padding:14px!important;
  align-content:start!important;
}
html body main .smart-quote-layout .category-card>span{
  min-width:0!important;
  width:auto!important;
  max-width:100%!important;
  overflow-wrap:anywhere!important;
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
