/* BANHALMI multilingual runtime configuration — single domain, workers.dev gateway. */
window.BANHALMI_CONFIG = Object.assign({}, window.BANHALMI_CONFIG || {}, {
  formEndpoint: "https://banhalmi-form-gateway.6ymnrwgnv9.workers.dev/api/banhalmi-form",
  submissionMode: "cloudflare-workers-dev-language-payload",
  siteLanguage: document.documentElement.lang || "en",
  siteDomain: "www.norbertbanhalmi.com",
  supportEmail: "hello@norbertbanhalmi.com"
});
