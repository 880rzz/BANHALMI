/* Homepage service intent analytics. No network request or personal data before analytics consent. */
(function () {
  "use strict";
  var routes = {
    "/": {
      locale: "en",
      services: {
        "/portrait/": "portrait",
        "/lifestyle/": "brand",
        "/event-photography/": "event",
        "/fine-art/": "artists"
      }
    },
    "/hu/": {
      locale: "hu",
      services: {
        "/hu/portre/": "portrait",
        "/hu/brand/": "brand",
        "/hu/rendezvenyfotozas/": "event",
        "/hu/muveszi-fotografia/": "artists"
      }
    },
    "/de-at/": {
      locale: "de",
      services: {
        "/de-at/portrait/": "portrait",
        "/de-at/brand/": "brand",
        "/de-at/eventfotografie/": "event",
        "/de-at/fine-art/": "artists"
      }
    }
  };
  var route = routes[window.location.pathname];
  if (!route) return;

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || typeof target.closest !== "function") return;
    var card = target.closest("#services .cards > a.card");
    if (!card) return;
    var service = route.services[card.getAttribute("href")];
    if (!service) return;

    var analytics = window.BANHALMI_ANALYTICS;
    if (!analytics || typeof analytics.hasConsent !== "function" || !analytics.hasConsent()) return;
    if (typeof window.gtag !== "function") return;

    // Fixed, non-identifying values. GA4 already registers event_category
    // and event_label as custom dimensions on its Professional property.
    window.gtag("event", "select_content", {
      content_type: "service",
      item_id: service,
      event_category: "homepage_service",
      event_label: route.locale + "_" + service
    });
  });
})();
