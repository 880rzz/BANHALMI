/* BANHALMI analytics — consent-first GA4 + Microsoft Clarity. No analytics request is made before explicit consent. */
(function () {
  "use strict";

  var started = false;
  var fallbackTimer = null;

  function initAnalytics() {
    if (started) return;
    started = true;
    if (fallbackTimer) clearTimeout(fallbackTimer);

    var MEASUREMENT_ID = "G-90C452LJKQ";
    var CLARITY_PROJECT_ID = "ky4j4kbgt7";
    var CONSENT_KEY = "banhalmi_consent_v3";
    var CONSENT_VERSION = "3.0";
    var CONSENT_TTL_MS = 180 * 24 * 60 * 60 * 1000;
    var gaScriptId = "banhalmi-ga4";
    var clarityScriptId = "banhalmi-clarity";
    var gaConfigured = false;
    var analyticsAllowed = false;
    var cleanupTimers = [];

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
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

    function ensureClarityQueue() {
      // Always reinstall a queue stub on grant so a prior revoke noop cannot
      // swallow consentv2 before the Clarity tag redefines window.clarity.
      window.clarity = function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
    }

    function loadClarity() {
      if (!analyticsAllowed) return;
      ensureClarityQueue();
      window.clarity("consentv2", {
        ad_Storage: "denied",
        analytics_Storage: "granted"
      });
      if (!document.getElementById(clarityScriptId)) {
        var script = document.createElement("script");
        script.id = clarityScriptId;
        script.async = true;
        script.src = "https://www.clarity.ms/tag/" + encodeURIComponent(CLARITY_PROJECT_ID) + "?ref=bwt";
        document.head.appendChild(script);
      }
    }

    function loadGA() {
      if (!analyticsAllowed) return;
      window["ga-disable-" + MEASUREMENT_ID] = false;
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        personalization_storage: "denied",
        functionality_storage: "denied"
      });

      if (!gaConfigured) {
        gaConfigured = true;
        window.gtag("js", new Date());
        window.gtag("config", MEASUREMENT_ID, {
          anonymize_ip: true,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
          linker: {
            domains: ["banhalmiphotography.com", "banhalmi.art"]
          },
          send_page_view: true
        });
      }

      if (!document.getElementById(gaScriptId)) {
        var script = document.createElement("script");
        script.id = gaScriptId;
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
        document.head.appendChild(script);
      }
    }

    function grant() {
      analyticsAllowed = true;
      cleanupTimers.forEach(function (timer) { clearTimeout(timer); });
      cleanupTimers = [];
      loadGA();
      loadClarity();
    }

    function expireCookie(name, domain) {
      var domainPart = domain ? "; domain=" + domain : "";
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; path=/" + domainPart + "; SameSite=Lax";
    }

    function clearAnalyticsCookiesNow() {
      var host = location.hostname;
      var domains = ["", host, "." + host, ".banhalmiphotography.com", "banhalmiphotography.com", ".banhalmi.art", "banhalmi.art"];
      var known = {
        _ga: 1, _gid: 1, _gat: 1, _clck: 1, _clsk: 1, CLID: 1, MUID: 1, ANONCHK: 1, MR: 1, SM: 1
      };
      var names = document.cookie.split(";").map(function (part) { return part.split("=")[0].trim(); }).filter(function (name) {
        return !!name && (known[name] || name.indexOf("_ga_") === 0 || name.indexOf("_cl") === 0);
      });
      names.forEach(function (name) {
        domains.forEach(function (domain) { expireCookie(name, domain); });
      });
    }

    function clearAnalyticsCookies() {
      cleanupTimers.forEach(function (timer) { clearTimeout(timer); });
      cleanupTimers = [];
      clearAnalyticsCookiesNow();
      [50, 250, 1000, 2500].forEach(function (delay) {
        cleanupTimers.push(setTimeout(function () {
          if (!analyticsAllowed) clearAnalyticsCookiesNow();
        }, delay));
      });
    }

    function removeOptionalAnalyticsScripts() {
      [gaScriptId, clarityScriptId].forEach(function (id) {
        var script = document.getElementById(id);
        if (script && script.parentNode) script.parentNode.removeChild(script);
      });
      Array.prototype.slice.call(document.querySelectorAll('script[src*="clarity.ms"],script[src*="googletagmanager.com/gtag/js"]')).forEach(function (script) {
        if (script.parentNode) script.parentNode.removeChild(script);
      });
    }

    function neutralizeClarity() {
      try {
        if (typeof window.clarity === "function") {
          try { window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" }); } catch (e1) {}
          try { window.clarity("consent", false); } catch (e2) {}
          try { window.clarity("stop"); } catch (e3) {}
        }
      } catch (error) {}
      // Drop any queued Clarity calls and prevent further network from the stub.
      var dead = function () { return undefined; };
      dead.q = [];
      window.clarity = dead;
    }

    function revoke() {
      analyticsAllowed = false;
      window["ga-disable-" + MEASUREMENT_ID] = true;
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        personalization_storage: "denied",
        functionality_storage: "denied"
      });
      try {
        window.gtag("config", MEASUREMENT_ID, {
          send_page_view: false,
          allow_google_signals: false,
          allow_ad_personalization_signals: false
        });
      } catch (error) {}
      neutralizeClarity();
      removeOptionalAnalyticsScripts();
      clearAnalyticsCookies();
      // Re-assert disable after script teardown in case gtag rehydrated state.
      window["ga-disable-" + MEASUREMENT_ID] = true;
    }

    window.BANHALMI_ANALYTICS = {
      measurementId: MEASUREMENT_ID,
      clarityProjectId: CLARITY_PROJECT_ID,
      grant: grant,
      revoke: revoke,
      hasConsent: validStoredConsent
    };

    if (validStoredConsent()) grant();
    else revoke();
  }

  ["pointerdown", "keydown", "touchstart"].forEach(function (type) {
    window.addEventListener(type, initAnalytics, { once: true, passive: true, capture: true });
  });

  function scheduleFallback() {
    fallbackTimer = setTimeout(initAnalytics, 6000);
  }

  if (document.readyState === "complete") scheduleFallback();
  else window.addEventListener("load", scheduleFallback, { once: true });
})();
