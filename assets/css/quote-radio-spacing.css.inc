/* QUOTE-RADIO-SPACING-AUTHORITY-20260827:START */
/* Keep native radio controls in a dedicated visual column so iOS/Safari never
   lets the control touch or overlap the option copy. The radio remains
   vertically centred in the complete choice row on every mobile viewport. */
@media (max-width: 720px){
  html body .smart-quote-layout :is(.option-row,.category-card){
    grid-template-columns:32px minmax(0,1fr)!important;
    column-gap:16px!important;
  }
  html body .smart-quote-layout :is(.option-row,.category-card) > input[type="radio"]{
    justify-self:start!important;
    align-self:center!important;
    margin-top:0!important;
    margin-bottom:0!important;
  }
}
/* QUOTE-RADIO-SPACING-AUTHORITY-20260827:END */
