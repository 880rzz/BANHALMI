/* BANHALMI Quote Mobile Authority 2026-08-26
   Final narrow-screen geometry for the quote category selector. */
@media(max-width:620px){
  html body:not([data-qa-x1]):not([data-qa-x2]):not([data-qa-x3]):not([data-qa-x4]):not([data-qa-x5]):not([data-qa-x6]) main .category-card{
    grid-template-columns:18px minmax(0,1fr)!important;
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
