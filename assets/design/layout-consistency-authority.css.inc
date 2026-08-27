/* BANHALMI Layout Consistency Authority 2026-08-27
   Final presentation authority for screenshot-reported alignment, disclosure
   typography, CTA axis and homepage decision-path geometry. This fragment is
   merged last into production CSS so page-specific legacy rules cannot restore
   mixed alignment or oversized disclosure typography. */

/* 1. Left-aligned editorial/content axis: headings, copy and actions share one
   starting edge unless the component is explicitly a centered CTA. */
html body main :is(.section-head,.prose,.structural-prose,.service-deep-dive-content,.service-deep-dive-content .wrap,.service-deep-dive-content .section-head,.service-deep-dive-content .prose){
  text-align:left!important;
}
html body main :is(.section-head,.prose,.structural-prose,.service-deep-dive-content .section-head,.service-deep-dive-content .prose){
  margin-left:0!important;
  margin-right:auto!important;
}
html body main :is(.section-head,.prose,.structural-prose,.service-deep-dive-content) :is(h1,h2,h3,h4,p,ul,ol,blockquote){
  text-align:left!important;
}
html body main :is(.section-head,.prose,.structural-prose,.service-deep-dive-content) :is(.button-row,.hero-actions,.presence-links){
  justify-content:flex-start!important;
  text-align:left!important;
}

/* 2. Explicit centered CTA contract. Heading, supporting copy and actions all
   use the same centered axis; no more left-heading / centered-button mismatch. */
html body main .cta-band>.wrap,
html body main .cta-band .wrap,
html body main :is(.final-cta,.faq-cta,.conversion-cta)>.wrap{
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:center!important;
  text-align:center!important;
}
html body main .cta-band :is(h1,h2,h3,p,.lead),
html body main :is(.final-cta,.faq-cta,.conversion-cta) :is(h1,h2,h3,p,.lead){
  width:min(100%,760px)!important;
  max-width:760px!important;
  margin-left:auto!important;
  margin-right:auto!important;
  text-align:center!important;
  text-wrap:balance!important;
}
html body main .cta-band :is(.button-row,.hero-actions),
html body main :is(.final-cta,.faq-cta,.conversion-cta) :is(.button-row,.hero-actions){
  width:100%!important;
  justify-content:center!important;
  text-align:center!important;
}

/* 3. Homepage decision bridge: the fine-art path and both next actions read as
   intentional controls rather than loose text beneath the cards. */
html body main[data-homepage-redesign] .fp-art-path{
  display:flex!important;
  align-items:center!important;
  justify-content:flex-start!important;
  flex-wrap:wrap!important;
  gap:12px 16px!important;
  margin-top:26px!important;
  text-align:left!important;
}
html body main[data-homepage-redesign] .fp-art-path>span{
  margin:0!important;
  line-height:1.45!important;
}
html body main[data-homepage-redesign] .fp-art-path>a,
html body main[data-homepage-redesign] .fp-decision-actions .fp-text-action{
  display:inline-flex!important;
  min-height:44px!important;
  align-items:center!important;
  justify-content:center!important;
  padding:10px 18px!important;
  border:1px solid rgba(32,37,48,.18)!important;
  border-radius:999px!important;
  background:#fff!important;
  color:#202530!important;
  font-weight:650!important;
  line-height:1.2!important;
  text-decoration:none!important;
  white-space:normal!important;
}
html body main[data-homepage-redesign] .fp-art-path>a:hover,
html body main[data-homepage-redesign] .fp-decision-actions .fp-text-action:hover{
  border-color:rgba(183,156,68,.7)!important;
}
html body main[data-homepage-redesign] .fp-decision-actions{
  display:flex!important;
  flex-wrap:wrap!important;
  align-items:center!important;
  justify-content:flex-start!important;
  gap:12px!important;
  margin-top:22px!important;
}
html body main[data-homepage-redesign] .fp-decision-actions>a{
  margin:0!important;
}

/* 4. Service/framework disclosure rhythm. Summary text stays compact; opened
   content returns to a readable editorial scale and one clean left axis. */
html body main details.service-deep-dive>summary,
html body main details.project-framework-drawer>summary{
  min-height:56px!important;
  padding-top:15px!important;
  padding-bottom:15px!important;
  font-size:clamp(.98rem,1.15vw,1.08rem)!important;
  line-height:1.32!important;
  text-align:left!important;
}
html body main details.service-deep-dive>summary :is(span,strong,small),
html body main details.project-framework-drawer>summary :is(span,strong,small){
  line-height:1.32!important;
  text-align:left!important;
}
html body main details.service-deep-dive>summary small,
html body main details.project-framework-drawer>summary small{
  font-size:.9em!important;
  font-weight:450!important;
}
html body main .service-deep-dive-content>section>.wrap{
  display:block!important;
  text-align:left!important;
}
html body main .service-deep-dive-content :is(h2,h3){
  max-width:24ch!important;
  margin-left:0!important;
  margin-right:auto!important;
  text-align:left!important;
}
html body main .service-deep-dive-content h2{
  font-size:clamp(1.9rem,3vw,2.75rem)!important;
  line-height:1.08!important;
}
html body main .service-deep-dive-content h3{
  font-size:clamp(1.15rem,1.55vw,1.4rem)!important;
  line-height:1.2!important;
}
html body main .service-deep-dive-content :is(p,li){
  max-width:68ch!important;
  font-size:clamp(.98rem,1.1vw,1.08rem)!important;
  line-height:1.62!important;
  text-align:left!important;
}
html body main .service-deep-dive-content :is(h2,h3)+p{
  margin-top:14px!important;
}

/* 5. Cards and FAQ/disclosure rows share consistent text geometry. */
html body main :is(.card,.fp-choice,.faq-topic,details)>:is(h2,h3,h4,p,strong,span,em){
  text-align:left;
}
html body main .fp-choice{
  text-align:left!important;
}
html body main .fp-choice :is(strong,span,em){
  display:block!important;
  margin-left:0!important;
  text-align:left!important;
}
html body main .fp-choice strong{line-height:1.18!important}
html body main .fp-choice span{line-height:1.5!important}
html body main .fp-choice em{line-height:1.35!important}
html body main .faq-topic details>summary,
html body main details.faq-item>summary{
  text-align:left!important;
  line-height:1.38!important;
}

/* 6. Quote desktop proportions and choice geometry. Preserve readable left
   explanation without letting it dominate, while all radios remain centred. */
html body main .smart-quote-layout :is(.option-row,.category-card)>input[type="radio"]{
  align-self:center!important;
  margin-top:0!important;
  margin-bottom:0!important;
}
@media(min-width:1081px){
  html body main .smart-quote-layout{
    grid-template-columns:minmax(250px,320px) minmax(0,1fr)!important;
    column-gap:clamp(28px,3vw,44px)!important;
    align-items:start!important;
  }
  html body main .smart-quote-layout>.quote-intro,
  html body main .smart-quote-layout>.quote-side,
  html body main .smart-quote-layout>.quote-sidebar{
    min-width:0!important;
    max-width:320px!important;
  }
}

/* Mobile keeps the same semantic axes without crowding. */
@media(max-width:720px){
  html body main[data-homepage-redesign] .fp-art-path,
  html body main[data-homepage-redesign] .fp-decision-actions{
    align-items:stretch!important;
    flex-direction:column!important;
  }
  html body main[data-homepage-redesign] .fp-art-path>a,
  html body main[data-homepage-redesign] .fp-decision-actions>a{
    width:100%!important;
  }
  html body main .service-deep-dive-content h2{
    font-size:clamp(1.75rem,8vw,2.2rem)!important;
  }
  html body main details.service-deep-dive>summary,
  html body main details.project-framework-drawer>summary{
    font-size:1rem!important;
  }
}
