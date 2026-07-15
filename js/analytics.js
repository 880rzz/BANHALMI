/* BANHALMI GA4 — consent-first loader. No Google request is made before explicit consent. */
(function () {
  "use strict";

  var MEASUREMENT_ID = "G-90C452LJKQ";
  var CONSENT_KEY = "banhalmi_consent_v3";
  var CONSENT_VERSION = "3.0";
  var CONSENT_TTL_MS = 180 * 24 * 60 * 60 * 1000;
  var scriptId = "banhalmi-ga4";
  var configured = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500
  });

  function validStoredConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      return !!(data && data.version === CONSENT_VERSION && data.choice === "all" && data.savedAt && Date.now() - data.savedAt <= CONSENT_TTL_MS);
    } catch (error) {
      return false;
    }
  }

  function load() {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });

    if (!configured) {
      configured = true;
      window.gtag("js", new Date());
      window.gtag("config", MEASUREMENT_ID, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        send_page_view: true
      });
    }

    if (!document.getElementById(scriptId)) {
      var script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
      document.head.appendChild(script);
    }
  }

  function clearAnalyticsCookies() {
    var host = location.hostname;
    var domains = [host, "." + host, ".norbertbanhalmi.com", "norbertbanhalmi.com"];
    var names = document.cookie.split(";").map(function (part) { return part.split("=")[0].trim(); }).filter(function (name) {
      return name === "_ga" || name.indexOf("_ga_") === 0;
    });
    names.forEach(function (name) {
      domains.forEach(function (domain) {
        document.cookie = name + "=; Max-Age=0; path=/; domain=" + domain + "; SameSite=Lax";
      });
      document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax";
    });
  }

  function revoke() {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    clearAnalyticsCookies();
  }

  window.BANHALMI_ANALYTICS = {
    measurementId: MEASUREMENT_ID,
    grant: load,
    revoke: revoke,
    hasConsent: validStoredConsent
  };

  if (validStoredConsent()) load();
})();
