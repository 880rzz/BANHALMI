/* BANHALMI multilingual runtime configuration — single domain, workers.dev gateway. */
window.BANHALMI_CONFIG = Object.assign({}, window.BANHALMI_CONFIG || {}, {
  formEndpoint: "https://banhalmi-form-gateway.6ymnrwgnv9.workers.dev/api/banhalmi-form",
  submissionMode: "cloudflare-workers-dev-language-payload",
  siteLanguage: document.documentElement.lang || "en",
  siteDomain: "www.norbertbanhalmi.com",
  supportEmail: "hello@norbertbanhalmi.com",
  analyticsMeasurementId: "G-90C452LJKQ"
});

/* Keep the PDF action in the form flow, directly below the submit action, on every language version. */
(function placeQuotePdfActionBelowSubmit(){
  function place(){
    document.querySelectorAll('[data-smart-quote]').forEach(function(form){
      var submitActions = form.querySelector('.quote-submit-actions');
      var pdfButton = document.querySelector('[data-download-quote-pdf]');
      var pdfActions = pdfButton && pdfButton.closest('.quote-actions');
      if(!submitActions || !pdfActions) return;
      submitActions.insertAdjacentElement('afterend', pdfActions);
      pdfActions.classList.add('quote-submit-pdf-actions');
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', place, {once:true});
  else place();
})();
