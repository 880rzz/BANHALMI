/* QUOTE-RADIO-SPACING-AUTHORITY-20260827:START */
/* Keep native radio controls in a dedicated visual column so iOS/Safari never
   lets the control touch or overlap the option copy. */
@media (max-width: 720px){
  html body .smart-quote-layout :is(.option-row,.category-card){
    grid-template-columns:32px minmax(0,1fr)!important;
    column-gap:16px!important;
  }
  html body .smart-quote-layout :is(.option-row,.category-card) > input[type="radio"]{
    justify-self:start!important;
    align-self:start!important;
    margin-top:.2rem!important;
  }
}
/* QUOTE-RADIO-SPACING-AUTHORITY-20260827:END */
