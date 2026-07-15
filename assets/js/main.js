/* NORBERTBANHALMI.COM — minimal interactions. No analytics loads before consent. */
(function () {
  "use strict";

  // Mobile menu
  var nav = document.querySelector(".nav");
  var btn = document.querySelector(".menu-btn");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      nav.classList.toggle("open");
      var isOpen = nav.classList.contains("open");
      document.documentElement.classList.toggle("nav-open", isOpen);
      btn.setAttribute("aria-expanded", isOpen);
    });
    nav.querySelectorAll(".nav-links a,.lang-switch a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        document.documentElement.classList.remove("nav-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }



  // Production 2.3 navigation hardening: close on outside click and Escape.
  document.addEventListener("click", function (event) {
    if (!nav ||!btn ||!nav.classList.contains("open")) return;
    if (!nav.contains(event.target)) {
      nav.classList.remove("open");
      document.documentElement.classList.remove("nav-open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", function (event) {
    if (!nav ||!btn) return;
    if (event.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      document.documentElement.classList.remove("nav-open");
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
    }
  });



  // Desktop footer columns stay open like Apple's information architecture;
  // on small screens they return to compact native accordions.
  var footerMedia = window.matchMedia("(min-width: 681px)");
  var footerAccordions = Array.prototype.slice.call(document.querySelectorAll("details.footer-accordion"));
  footerAccordions.forEach(function (details) {
    details.open = false;
  });

  function syncFooterAccordions(event) {
    var desktop = event && typeof event.matches === "boolean" ? event.matches : footerMedia.matches;
    footerAccordions.forEach(function (details) {
      details.open = desktop;
    });
  }
  if (footerAccordions.length) {
    syncFooterAccordions();
    if (typeof footerMedia.addEventListener === "function") footerMedia.addEventListener("change", syncFooterAccordions);
    else if (typeof footerMedia.addListener === "function") footerMedia.addListener(syncFooterAccordions);
  }

  // Scroll reveal (respects reduced motion)
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Versioned cookie/optional-service consent gate.
  var KEY = "banhalmi_consent_v3";
  var CONSENT_VERSION = "3.0";
  var CONSENT_TTL_MS = 180 * 24 * 60 * 60 * 1000;
  var bar = document.querySelector(".cookie");
  function readChoice() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) {
        ["banhalmi_consent", "banhalmi_consent_v2"].forEach(function (legacyKey) {
          if (localStorage.getItem(legacyKey)) localStorage.removeItem(legacyKey);
        });
        return null;
      }
      var data = JSON.parse(raw);
      if (!data || data.version !== CONSENT_VERSION || !data.savedAt || Date.now() - data.savedAt > CONSENT_TTL_MS) {
        localStorage.removeItem(KEY); return null;
      }
      return data.choice;
    } catch (e) { return null; }
  }
  function saveChoice(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({choice:choice,version:CONSENT_VERSION,savedAt:Date.now(),expiresAt:Date.now()+CONSENT_TTL_MS})); } catch (e) {}
  }
  function hasReviewComponent() { return !!document.querySelector('[data-third-party-reviews="true"]'); }
  var reviewDetails = null;
  var reviewDetailsHandler = null;
  var reviewLoaderArmed = false;
  var reviewScriptsLoading = false;

  function findReviewDetails(target) {
    if (!target) return null;
    if (target.matches && target.matches("details")) return target;
    return target.querySelector("details.review-drawer") || target.querySelector("details") || target.closest("details");
  }

  function hasScriptSource(fragment) {
    return Array.prototype.some.call(document.scripts, function (script) {
      return String(script.src || "").indexOf(fragment) !== -1;
    });
  }

  function reviewCopy() {
    var lang = String(document.documentElement.lang || "en").toLowerCase();
    if (lang.indexOf("hu") === 0) return {
      note: "A Google-vélemények külső szolgáltatáson keresztül töltődnek be. A megjelenítéshez fogadja el az opcionális szolgáltatásokat.",
      button: "Süti-beállítások megnyitása",
      loading: "Az ügyfélvélemények betöltése…"
    };
    if (lang.indexOf("de") === 0) return {
      note: "Google-Bewertungen werden über einen externen Dienst geladen. Bitte akzeptieren Sie optionale Dienste, um sie anzuzeigen.",
      button: "Cookie-Einstellungen öffnen",
      loading: "Kundenstimmen werden geladen…"
    };
    return {
      note: "Google reviews are loaded through an external service. Please accept optional services to display them.",
      button: "Open cookie settings",
      loading: "Loading client reviews…"
    };
  }

  function getReviewWidget(details) {
    return details ? details.querySelector('[class*="elfsight-app-"]') : null;
  }

  function removeReviewConsentNote(details) {
    if (!details) return;
    var note = details.querySelector(".reviews-consent-note");
    if (note) note.remove();
  }

  function showReviewConsentNote(details) {
    if (!details || details.querySelector(".reviews-consent-note")) return;
    var copy = reviewCopy();
    var widget = getReviewWidget(details);
    var note = document.createElement("div");
    note.className = "reviews-consent-note";
    note.setAttribute("role", "status");
    var text = document.createElement("p");
    text.textContent = copy.note;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-ghost";
    button.textContent = copy.button;
    button.addEventListener("click", function () { openCookieSettings(); });
    note.appendChild(text);
    note.appendChild(button);
    if (widget) details.insertBefore(note, widget); else details.appendChild(note);
  }

  function setReviewLoading(details, isLoading) {
    if (!details) return;
    var widget = getReviewWidget(details);
    if (!widget) return;
    if (isLoading) {
      var copy = reviewCopy();
      widget.setAttribute("aria-busy", "true");
      widget.setAttribute("data-loading-label", copy.loading);
      details.classList.add("reviews-loading");
    } else {
      widget.removeAttribute("aria-busy");
      details.classList.remove("reviews-loading");
    }
  }

  function loadReviewScripts() {
    if (!hasReviewComponent() || reviewScriptsLoading) return;
    var target = document.querySelector('[data-third-party-reviews="true"]');
    var details = findReviewDetails(target);
    if (details && !details.open) return;

    reviewScriptsLoading = true;
    removeReviewConsentNote(details);
    setReviewLoading(details, true);

    // Wait until the opened <details> element has a measurable layout before
    // Elfsight scans the widget container.
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        var pathName = window.location.pathname.replace(/\/index\.html$/, "/");
        var isLanguageHomepage = pathName === "/" || pathName === "/hu/" || pathName === "/de-at/";
        if (isLanguageHomepage && !hasScriptSource("cdn.trustindex.io/assets/js/richsnippet.js")) {
          var ti = document.createElement("script");
          ti.id = "trustindex-richsnippet";
          ti.defer = true;
          ti.async = true;
          ti.src = "https://cdn.trustindex.io/assets/js/richsnippet.js?c307c9433572g62e";
          document.head.appendChild(ti);
        }

        if (document.querySelector('[class*="elfsight-app-"]') && !hasScriptSource("elfsightcdn.com/platform.js")) {
          var ef = document.createElement("script");
          ef.id = "elfsight-platform";
          ef.defer = true;
          ef.async = true;
          ef.src = "https://elfsightcdn.com/platform.js";
          ef.addEventListener("load", function () { setReviewLoading(details, false); });
          ef.addEventListener("error", function () {
            reviewScriptsLoading = false;
            setReviewLoading(details, false);
          });
          document.head.appendChild(ef);
        } else {
          setReviewLoading(details, false);
        }
      });
    });
  }

  function setupReviewLoader() {
    if (!hasReviewComponent() || reviewLoaderArmed) return;
    var target = document.querySelector('[data-third-party-reviews="true"]');
    reviewDetails = findReviewDetails(target);
    if (!reviewDetails) {
      reviewLoaderArmed = true;
      if (readChoice() === "all") loadReviewScripts();
      return;
    }

    reviewLoaderArmed = true;
    reviewDetailsHandler = function () {
      if (!reviewDetails || !reviewDetails.open) return;
      if (readChoice() === "all") loadReviewScripts();
      else {
        showReviewConsentNote(reviewDetails);
        openCookieSettings();
      }
    };
    reviewDetails.addEventListener("toggle", reviewDetailsHandler);
    if (reviewDetails.open) reviewDetailsHandler();
  }

  function grant() {
    if (window.BANHALMI_ANALYTICS && typeof window.BANHALMI_ANALYTICS.grant === "function") window.BANHALMI_ANALYTICS.grant();
    setupReviewLoader();
    removeReviewConsentNote(reviewDetails);
    if (reviewDetails && reviewDetails.open) loadReviewScripts();
  }

  function revokeThirdPartyScripts() {
    if (window.BANHALMI_ANALYTICS && typeof window.BANHALMI_ANALYTICS.revoke === "function") window.BANHALMI_ANALYTICS.revoke();
    reviewScriptsLoading = false;
    ["trustindex-richsnippet", "elfsight-platform"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    document.querySelectorAll('iframe[src*="trustindex"],iframe[src*="elfsight"],script[src*="trustindex"],script[src*="elfsight"]').forEach(function (el) { el.remove(); });
    document.querySelectorAll('[class*="elfsight-app-"]').forEach(function (widget) {
      widget.innerHTML = "";
      widget.removeAttribute("aria-busy");
    });
    if (reviewDetails && reviewDetails.open) showReviewConsentNote(reviewDetails);
  }

  function openCookieSettings() {
    if (!bar) return;
    bar.classList.add("show");
    var first = bar.querySelector("button");
    if (first) first.focus({preventScroll:true});
  }

  setupReviewLoader();
  if (bar) {
    var initialChoice = readChoice();
    if (!initialChoice) bar.classList.add("show");
    else if (initialChoice === "all") grant();
    var accept = bar.querySelector("[data-accept]"), decline = bar.querySelector("[data-decline]");
    if (accept) accept.addEventListener("click", function () {
      saveChoice("all");
      bar.classList.remove("show");
      grant();
    });
    if (decline) decline.addEventListener("click", function () {
      var wasAll = readChoice() === "all";
      saveChoice("essential");
      revokeThirdPartyScripts();
      bar.classList.remove("show");
      if (wasAll) window.location.reload();
    });
  }
  document.querySelectorAll("[data-cookie-settings]").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      openCookieSettings();
    });
  });


  // Budget guidance for the guided quote builder
  document.querySelectorAll('[data-budget-select]').forEach(function(sel){
    var box = document.querySelector(sel.getAttribute('data-target'));
    var lang = sel.getAttribute('data-lang') || 'en';
    var copy = {
      en: {
        small:'This usually fits a focused 30-minute Executive Headshot: one strong portrait for LinkedIn, press or a website profile.',
        medium:'This usually fits an Executive Portrait session with calmer preparation, guided image selection and more strategic use.',
        large:'This can support Personal Branding or a broader portrait set for website, media and public communication.',
        xlarge:'This range is suitable for team, event or corporate visual systems, depending on scope and usage rights.',
        custom:'For larger or mixed projects, a personal quote is the right way to define scope, licensing and delivery rhythm.',
        unsure:'If the budget is not clear yet, describe the result you need. I will recommend the smallest format that can honestly do the job.'
      },
      hu: {
        small:'Ez jellemzően egy fókuszált, 30 perces Executive Headshot keret: egy erős portré LinkedInre, sajtóhoz vagy weboldalra.',
        medium:'Ebbe általában egy nyugodtabb Executive Portrait folyamat fér bele, előkészítéssel, irányított képkiválasztással és stratégiai felhasználással.',
        large:'Ez már alkalmas personal branding vagy több képből álló portrésorozat tervezésére weboldalra, médiára és nyilvános kommunikációra.',
        xlarge:'Ez a tartomány csapat-, rendezvény- vagy vállalati vizuális rendszerhez illik, a terjedelemtől és felhasználási jogoktól függően.',
        custom:'Nagyobb vagy vegyes projektnél személyes ajánlat szükséges, hogy a terjedelem, jogok és átadási ritmus tiszta legyen.',
        unsure:'Ha még nem biztos a keret, írja le, milyen eredményre van szüksége. A legkisebb korrekt formátumot fogom javasolni.'
      },
      de: {
        small:'Das passt meist zu einem fokussierten 30-Minuten Executive Headshot: ein starkes Portrait für LinkedIn, Presse oder Website.',
        medium:'Das passt meist zu einer Executive Portrait Session mit ruhiger Vorbereitung, geführter Auswahl und strategischer Nutzung.',
        large:'Damit lässt sich Personal Branding oder ein breiteres Portrait-Set für Website, Medien und öffentliche Kommunikation planen.',
        xlarge:'Dieser Rahmen eignet sich für Team-, Event- oder Corporate-Visual-Systeme, abhängig von Umfang und Nutzungsrechten.',
        custom:'Für größere oder gemischte Projekte ist ein persönliches Angebot sinnvoll, damit Umfang, Rechte und Lieferung klar sind.',
        unsure:'Wenn das Budget noch offen ist, beschreiben Sie das gewünschte Ergebnis. Ich empfehle das kleinste Format, das die Aufgabe ehrlich erfüllen kann.'
      }
    };
    function update(){
      if(!box) return;
      while(box.firstChild){ box.removeChild(box.firstChild); }
      var strong = document.createElement('strong');
      strong.textContent = (sel.options[sel.selectedIndex]? sel.options[sel.selectedIndex].text: '');
      box.appendChild(strong);
      box.appendChild(document.createElement('br'));
      box.appendChild(document.createTextNode((copy[lang][sel.value] || '')));
    }
    sel.addEventListener('change', update); update();
  });


  // Contact and quote forms — send JSON to the configured endpoint.
  // Forms require a verified JSON-capable endpoint. Use the first-party Worker route in site-config.js.
  function readField(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el? String(el.value || '').trim(): '';
  }
  function readChecked(form, name) {
    return Array.prototype.slice.call(form.querySelectorAll('[name="' + name + '"]:checked')).map(function (el) { return el.value; });
  }
  function readRadio(form, name) {
    var el = form.querySelector('[name="' + name + '"]:checked');
    return el? el.value: '';
  }
  function normalizeVatId(value) {
    return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  }
  function isEuReverseChargeEligible(vatId, companyName) {
    var prefixes = ['BE','BG','CZ','DK','DE','EE','IE','EL','GR','ES','FR','HR','IT','CY','LV','LT','LU','HU','MT','NL','PL','PT','RO','SI','SK','FI','SE'];
    var raw = normalizeVatId(vatId);
    if (!companyName || raw.length < 4) return false;
    var prefix = raw.slice(0, 2);
    return prefix!== 'AT' && prefixes.indexOf(prefix)!== -1;
  }
  function normalizeUiLanguage(lang) {
    var value = String(lang || 'en').toLowerCase();
    if (value.indexOf('hu') === 0) return 'hu';
    if (value.indexOf('de') === 0) return 'de';
    return 'en';
  }
  function selectedOptionText(form, name) {
    var field = form && form.elements ? form.elements[name] : null;
    if (!field) return '';
    if (field.tagName === 'SELECT' && field.selectedIndex >= 0) {
      return (field.options[field.selectedIndex].textContent || '').trim();
    }
    return readField(form, name);
  }
  function categoryLabel(category, lang) {
    lang = normalizeUiLanguage(lang);
    var map = {
      en: {individual:'Individual portrait', group:'Group portraits', brand:'Brand photography', art:'Fine art photography', event:'C-level event photography'},
      hu: {individual:'Egyéni portré', group:'Csoportos portré', brand:'Brand fotózás', art:'Művészi fotózás', event:'C-szintű rendezvényfotózás'},
      de: {individual:'Einzelporträt', group:'Gruppenporträts', brand:'Brand-Fotografie', art:'Fine-Art-Fotografie', event:'C-Level-Eventfotografie'}
    };
    return (map[lang] && map[lang][category]) || category;
  }
  function buildQuotePayload(form) {
    var lang = normalizeUiLanguage(form.getAttribute('data-lang') || document.documentElement.lang || 'en');
    var quoteEngine = window.BANHALMI_QUOTE;
    var estimate = quoteEngine && typeof quoteEngine.paint === 'function'? quoteEngine.paint(form): quoteEngine && typeof quoteEngine.calculate === 'function'? quoteEngine.calculate(form): null;
    var category = readRadio(form, 'category') || 'individual';
    var companyName = readField(form, 'company');
    var vatId = readField(form, 'vat_id');
    var reverse = estimate?!!estimate.reverse: isEuReverseChargeEligible(vatId, companyName);
    var addons = readChecked(form, 'addons');
    var payload = {
      language: lang,
      pageUrl: window.location.href,
      turnstileToken: readField(form, 'cf-turnstile-response'),
      formType: 'quote',
      payloadVersion: 'banhalmi-quote-v3-shared-engine',
      formTitle: 'BANHALMI guided quote request',
      category: categoryLabel(category, lang),
      categoryCode: category,
      packageName: '',
      duration: '',
      peopleCount: '',
      retouchedImages: readField(form, 'retouched_images'),
      retouchMode: '',
      photographerCount: category === 'group'? readField(form, 'photographers'): (readField(form, 'photographer_team') || ''),
      coordinationPreference: readField(form, 'coordination_preference'),
      projectGoals: readChecked(form, 'project_goals').join(', '),
      amchamMember:!!form.querySelector('[name="amcham_member"]:checked'),
      amchamCountry: readField(form, 'amcham_country'),
      amchamBenefit: '',
      locationType: readField(form, 'location'),
      locationDetails: readField(form, 'specific_location'),
      preferredDates: readField(form, 'timeframe'),
      preferredTime: readField(form, 'preferred_time'),
      addons: addons.join(', '),
      budget: readField(form, 'budget'),
      netAmount: estimate? String(estimate.net): readField(form, 'estimate_net'),
      vatRate: reverse? '0%': '20%',
      vatAmount: estimate? String(estimate.vat): readField(form, 'estimate_vat'),
      grossAmount: estimate? String(estimate.gross): readField(form, 'estimate_gross'),
      reverseCharge: reverse,
      euVatNumber: normalizeVatId(vatId),
      name: readField(form, 'name'),
      email: readField(form, 'email'),
      phone: readField(form, 'phone'),
      companyName: companyName,
      billingAddress: readField(form, 'billing_address'),
      message: readField(form, 'message'),
      privacyAcknowledged:!!form.querySelector('[name="privacy_acknowledged"]:checked'),
      sendCopy:!!form.querySelector('[name="send_copy"]:checked'),
      estimateSummary: estimate? estimate.parts: readField(form, 'estimate_summary'),
      estimateVatMode: estimate? estimate.vatMode: readField(form, 'estimate_vat_mode')
    };
    if (category === 'individual') {
      payload.packageName = readRadio(form, 'individual_mode');
      payload.duration = payload.packageName === 'quick30'? '30 minutes': (payload.packageName === 'guided120'? '2 hours': '1 hour');
      payload.retouchMode = 'selected retouched images';
    } else if (category === 'group') {
      payload.peopleCount = readField(form, 'people_count');
      payload.photographerCount = readField(form, 'photographers') || readField(form, 'photographer_team');
      payload.retouchMode = readRadio(form, 'group_delivery') === 'instant'? 'immediate retouching / max 6 people': 'later retouching / originals delivered immediately / 48h retouching';
      payload.packageName = 'group-' + (readRadio(form, 'group_delivery') || 'later');
      payload.duration = 'from 1 hour, depending on team size';
    } else if (category === 'brand') {
      payload.packageName = readRadio(form, 'brand_duration');
      payload.duration = ({brand60:'1 hour', brand120:'2 hours', brand180:'3 hours', brand240:'4 hours'})[payload.packageName] || '';
      payload.retouchMode = 'immediate selection, retouching per selected image';
    } else if (category === 'art') {
      payload.packageName = [readRadio(form, 'art_type'), readField(form, 'art_duration') || 'art60'].filter(Boolean).join(' / ');
      payload.duration = ({art60:'1 hour', art120:'2 hours', art180:'3 hours'})[readField(form, 'art_duration') || 'art60'] || 'selected fine-art block';
      payload.retouchMode = 'fine art retouching per selected image';
    } else if (category === 'event') {
      payload.packageName = readRadio(form, 'event_duration');
      payload.duration = ({event60:'1 hour', event120:'2 hours', event180:'3 hours', event240:'4 hours', eventFullDay:'full day / up to 8 hours'})[payload.packageName] || '';
      payload.retouchMode = 'event selection and retouching per selected image';
    }
    var selectedRetouches = parseInt(payload.retouchedImages || '0', 10) || 0;
    if (payload.amchamMember && selectedRetouches > 0) {
      var extra = Math.ceil(selectedRetouches * 0.5);
      payload.amchamBenefit = 'Professional Network Benefit: +' + extra + ' additional retouched images at no extra cost (' + (selectedRetouches + extra) + ' total).';
    } else if (payload.amchamMember) {
      payload.amchamBenefit = 'Professional Network Benefit applies: 50% additional retouched images once the final image count is confirmed.';
    }
    return payload;
  }
  function buildGenericPayload(form) {
    var data = new FormData(form);
    var payload = { language: form.getAttribute('data-lang') || document.documentElement.lang || 'en', pageUrl: window.location.href, payloadVersion: 'banhalmi-contact-v2', formType: form.getAttribute('data-form-kind') || 'contact', formTitle: form.getAttribute('data-form-title') || 'BANHALMI contact form', category: form.getAttribute('data-form-kind') === 'contact'? 'Contact': '' };
    data.forEach(function (value, key) {
      if (key === 'website') return;
      payload[key] = value;
    });
    payload.privacyAcknowledged =!!form.querySelector('[name="privacy_acknowledged"]:checked');
    delete payload.privacy_acknowledged;
    return payload;
  }

  function updateProjectSummary(form) {
    var box = form.querySelector('[data-project-summary]');
    if (!box) return;
    var lang = normalizeUiLanguage(form.getAttribute('data-lang') || document.documentElement.lang || 'en');
    var labels = {
      en: {service:'Service', location:'Location', date:'Preferred date', photographers:'Photographer(s)', retouch:'Retouched images', budget:'Budget', amcham:'AmCham member', yes:'Yes — Professional Network Benefit applies', no:'No / not specified'},
      hu: {service:'Szolgáltatás', location:'Helyszín', date:'Időpontpreferencia', photographers:'Fotósok száma', retouch:'Retusált képek száma', budget:'Költségkeret', amcham:'AmCham-tagság', yes:'Igen — szakmai hálózati kedvezmény figyelembe véve', no:'Nem / nincs megadva'},
      de: {service:'Leistung', location:'Ort', date:'Wunschtermin', photographers:'Fotograf:innen', retouch:'Retuschierte Bilder', budget:'Budgetrahmen', amcham:'AmCham-Mitgliedschaft', yes:'Ja — Netzwerkvorteil berücksichtigt', no:'Nein / nicht angegeben'}
    };
    var l = labels[lang] || labels.en;
    var service = categoryLabel(readRadio(form, 'category') || 'individual', lang);
    var location = readField(form, 'specific_location') || selectedOptionText(form, 'location') || '—';
    var date = selectedOptionText(form, 'timeframe') || '—';
    var photographers = readField(form, 'photographer_team') || readField(form, 'photographers') || '—';
    var retouches = readField(form, 'retouched_images') || '—';
    var budget = readField(form, 'budget') || '—';
    var amcham = form.querySelector('[name="amcham_member"]:checked')? l.yes: l.no;
    function set(sel, text) { var el = box.querySelector(sel); if (el) el.textContent = text; }
    set('[data-summary-service]', l.service + ': ' + service);
    set('[data-summary-location]', l.location + ': ' + location);
    set('[data-summary-date]', l.date + ': ' + date);
    set('[data-summary-photographers]', l.photographers + ': ' + photographers);
    set('[data-summary-retouch]', l.retouch + ': ' + retouches);
    set('[data-summary-budget]', l.budget + ': ' + budget);
    set('[data-summary-amcham]', l.amcham + ': ' + amcham);
    var copy = form.querySelector('[data-amcham-copy]');
    if (copy) { copy.hidden =!form.querySelector('[name="amcham_member"]:checked'); }
  }
  document.querySelectorAll('[data-amcham-toggle]').forEach(function(input){
    var form = input.closest('form');
    input.addEventListener('change', function(){ if(form) updateProjectSummary(form); });
  });
  document.querySelectorAll('[data-smart-quote]').forEach(function(form){
    form.addEventListener('input', function(){ updateProjectSummary(form); });
    form.addEventListener('change', function(){ updateProjectSummary(form); });
    updateProjectSummary(form);
  });

  document.querySelectorAll("[data-contact-form]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (form.elements.website && form.elements.website.value) { form.elements.website.value = ""; } /* clear accidental autofill instead of silently dropping the submission; the backend honeypot still catches direct bot POSTs */
      var isQuote = form.getAttribute('data-form-kind') === 'quote' || (form.elements.form_type && form.elements.form_type.value === 'quote');
      var payload = isQuote? buildQuotePayload(form): buildGenericPayload(form);
      payload.pageUrl = window.location.href;
      payload.submittedAt = new Date().toISOString();
      var config = window.BANHALMI_CONFIG || {};
      var endpoint = config.formEndpoint || (isQuote? config.quoteEndpoint: config.contactEndpoint) || window.BANHALMI_FORM_ENDPOINT || "";
      var note = form.querySelector("[data-form-note]");
      var submit = form.querySelector('[type="submit"]');
      var submitLabel = submit ? submit.textContent : '';
      function setSubmitBusy(isBusy) {
        if (!submit) return;
        var lang = form.getAttribute('data-lang') || document.documentElement.lang || 'en';
        var key = lang.indexOf('hu') === 0 ? 'hu' : lang.indexOf('de') === 0 ? 'de' : 'en';
        var busyCopy = { en:'Sending…', de:'Wird gesendet…', hu:'Küldés folyamatban…' };
        submit.disabled = !!isBusy;
        if (isBusy) { submit.setAttribute('aria-busy', 'true'); submit.textContent = busyCopy[key] || busyCopy.en; }
        else { submit.removeAttribute('aria-busy'); submit.textContent = submitLabel; }
      }
      function message(type) {
        var lang = form.getAttribute('data-lang') || document.documentElement.lang || 'en';
        var successCopy = isQuote ? {
          en:'Thank you. Your quote request has been sent.',
          de:'Vielen Dank. Ihre Anfrage wurde gesendet.',
          hu:'Köszönöm. Az ajánlatkérés elküldésre került.'
        } : {
          en:'Thank you. Your message has been sent.',
          de:'Vielen Dank. Ihre Nachricht wurde gesendet.',
          hu:'Köszönöm. Az üzenet elküldésre került.'
        };
        var successUnverifiedCopy = isQuote ? {
          en:'Thank you. Your quote request has been sent. Please check your confirmation email; if it does not arrive, write directly to the contact address.',
          de:'Vielen Dank. Ihre Anfrage wurde gesendet. Bitte prüfen Sie die Bestätigungs-E-Mail; falls sie nicht ankommt, schreiben Sie bitte direkt an die Kontaktadresse.',
          hu:'Köszönöm. Az ajánlatkérés elküldésre került. Kérem, ellenőrizze a visszaigazoló e-mailt; ha nem érkezik meg, írjon közvetlenül a kapcsolati címre.'
        } : {
          en:'Thank you. Your message has been sent. Please check your confirmation email; if it does not arrive, write directly to the contact address.',
          de:'Vielen Dank. Ihre Nachricht wurde gesendet. Bitte prüfen Sie die Bestätigungs-E-Mail; falls sie nicht ankommt, schreiben Sie bitte direkt an die Kontaktadresse.',
          hu:'Köszönöm. Az üzenet elküldésre került. Kérem, ellenőrizze a visszaigazoló e-mailt; ha nem érkezik meg, írjon közvetlenül a kapcsolati címre.'
        };
        var copy = {
          success: successCopy,
          successUnverified: successUnverifiedCopy,
          error: {
            en:'The browser could not verify the server response. Please send the request by email or try again.',
            de:'Der Browser konnte die Serverantwort nicht verifizieren. Bitte senden Sie die Anfrage per E-Mail oder versuchen Sie es erneut.',
            hu:'A böngésző nem tudta ellenőrizni a szerver válaszát. Kérem, küldje el e-mailben, vagy próbálja újra.'
          }
        };
        var key = lang.indexOf('hu') === 0? 'hu': lang.indexOf('de') === 0? 'de': 'en';
        return (copy[type] && copy[type][key]) || copy[type].en;
      }
      function showNote(text, isError) {
        setSubmitBusy(false);
        if (note) {
          note.hidden = false;
          note.textContent = text || message('success');
          note.style.color = isError? '#8a2f18': 'var(--gold-deep)';
          note.scrollIntoView({ behavior: reduce? "auto": "smooth", block: "center" });
        }
      }
      function openMailFallback() {
        var supportEmail = (window.BANHALMI_CONFIG && window.BANHALMI_CONFIG.supportEmail) || 'hello@norbertbanhalmi.com';
        var subject = encodeURIComponent((isQuote? 'BANHALMI quote request — ': 'BANHALMI enquiry — ') + (payload.category || payload.subject || payload.service || 'photography'));
        var body = encodeURIComponent(Object.keys(payload).map(function (key) { return key + ': ' + payload[key]; }).join("\n"));
        window.location.href = "mailto:" + supportEmail + "?subject=" + subject + "&body=" + body;
      }
      function fallbackMailto(options) {
        options = options || {};
        setSubmitBusy(false);
        var isAppsScript = /script\.google\.com\/macros\/s\//.test(endpoint || '');
        if (options.fromVerifiedSubmit && isAppsScript) {
          var lang = form.getAttribute('data-lang') || document.documentElement.lang || 'en';
          var key = lang.indexOf('hu') === 0? 'hu': lang.indexOf('de') === 0? 'de': 'en';
          var copy = {
            en:'The request may have reached the server, but the browser could not verify the Google Apps Script response. Please check your confirmation email; do not resend unless no confirmation arrives.',
            de:'Die Anfrage wurde möglicherweise gesendet, aber der Browser konnte die Google-Apps-Script-Antwort nicht verifizieren. Bitte prüfen Sie die Bestätigungs-E-Mail und senden Sie nicht erneut, außer es kommt keine Bestätigung an.',
            hu:'Az üzenet valószínűleg elindult, de a böngésző nem tudta ellenőrizni a Google Apps Script válaszát. Kérem, nézze meg, érkezik-e visszaigazoló e-mail; csak akkor küldje újra, ha nem érkezik megerősítés.'
          };
          showNote(copy[key] || copy.en, true);
          return;
        }
        openMailFallback();
        showNote(message('error'), true);
      }
      function submitVerified() {
        return fetch(endpoint, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "text/plain;charset=utf-8", "Accept": "application/json,text/plain,*/*" },
          mode: "cors",
          credentials: "omit",
          keepalive: true
        }).then(function(response){
          if (!response) throw new Error('No response from form endpoint');
          return response.text().then(function(text){
            var data = {};
            try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { raw:text }; }
            if (!response.ok || (data && data.ok === false)) {
              var err = new Error((data && data.error) || ('Form endpoint returned HTTP ' + response.status));
              err.status = response.status; err.payload = data; throw err;
            }
            return data;
          });
        });
      }
      setSubmitBusy(true);
      if (endpoint && window.fetch) {
        submitVerified().then(function(data){
          showNote(message(data && data.unverified? 'successUnverified': 'success') + (data && data.submissionId? ' ID: ' + data.submissionId: ''), false);
          form.reset();
          if (window.turnstile) { try { window.turnstile.reset(); } catch (e) {} }
          if (isQuote && window.BANHALMI_QUOTE && typeof window.BANHALMI_QUOTE.paint === 'function') { window.BANHALMI_QUOTE.paint(form); }
        }).catch(function(error){
          if (window.turnstile) { try { window.turnstile.reset(); } catch (e) {} }
          var text = String(error && error.message || '');
          if (/configuration|WORKER_SHARED_SECRET|gateway/i.test(text)) {
            var lang = form.getAttribute('data-lang') || document.documentElement.lang || 'en';
            var key = lang.indexOf('hu') === 0? 'hu': lang.indexOf('de') === 0? 'de': 'en';
            var configCopy = {
              en:'The form service is not fully configured yet. Please send the request by email; the website administrator has been notified.',
              hu:'Az űrlapszolgáltatás beállítása még nem teljes. Kérem, küldje el a megkeresést e-mailben; a weboldal kezelője értesítést kapott.',
              de:'Der Formulardienst ist noch nicht vollständig konfiguriert. Bitte senden Sie die Anfrage per E-Mail; die Websiteverwaltung wurde informiert.'
            };
            showNote(configCopy[key] || configCopy.en, true);
          } else { fallbackMailto({fromVerifiedSubmit:true}); }
        });
      } else {
        fallbackMailto();
      }
    });
  });

  // ---------- Portfolio gallery: lazy-load, filter, lightbox ----------
  var grid = document.querySelector("[data-gallery]");
  if (grid) {
    // Lazy-load images via data-src
    var imgs = grid.querySelectorAll("img[data-src]");
    function load(img) {
      if (img.dataset.avif && document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0) {
        img.src = img.dataset.avif;
      } else {
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.src = img.dataset.src;
      }
      img.addEventListener("load", function () { img.classList.add("loaded"); });
      img.removeAttribute("data-src");
    }
    if ("IntersectionObserver" in window) {
      var lio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { load(e.target); lio.unobserve(e.target); } });
      }, { rootMargin: "300px 0px" });
      imgs.forEach(function (im) { lio.observe(im); });
    } else {
      imgs.forEach(load);
    }

    // Category filter
    var filters = document.querySelectorAll("[data-filter]");
    var sections = document.querySelectorAll("[data-cat-section]");
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filter");
        filters.forEach(function (b) { b.setAttribute("aria-pressed", b === btn); });
        sections.forEach(function (s) {
          var show = (cat === "all" || s.getAttribute("data-cat-section") === cat);
          s.classList.toggle("pf-hidden",!show);
        });
      });
    });

    // Lightbox
    var lb = document.querySelector("[data-lightbox]");
    if (lb) {
      var lbImg = lb.querySelector("img");
      var lbCap = lb.querySelector(".lb-cap");
      var items = [];
      var current = 0;
      function refreshItems() {
        items = Array.prototype.slice.call(grid.querySelectorAll(".pf-item:not(.pf-hidden) [data-large]"));
      }
      function show(i) {
        refreshItems();
        if (!items.length) return;
        current = (i + items.length) % items.length;
        var el = items[current];
        lbImg.src = el.getAttribute("data-large");
        lbCap.textContent = el.getAttribute("data-cap") || "";
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
      }
      function close() { lb.classList.remove("open"); document.body.style.overflow = ""; lbImg.src = ""; }
      grid.addEventListener("click", function (ev) {
        var t = ev.target.closest("[data-large]");
        if (!t) return;
        refreshItems();
        show(items.indexOf(t));
      });
      lb.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
      lb.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
      lb.querySelector(".lb-close").addEventListener("click", close);
      lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
      document.addEventListener("keydown", function (e) {
        if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight") show(current + 1);
        else if (e.key === "ArrowLeft") show(current - 1);
      });
    }
  }

  // Apple-inspired motion system — restrained, accessible and performance-safe.
  (function () {
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var canObserve = "IntersectionObserver" in window;
    var rootElement = document.documentElement;
    var skipSelector = "form, nav, footer, .nav-links, .cookie, .universal-lightbox, .age-verification-dialog, [data-no-motion]";

    function shouldSkip(element) {
      return !element || !!element.closest(skipSelector);
    }

    var textNodes = Array.prototype.slice.call(document.querySelectorAll(
      "main h1, main h2, main h3, main h4, main .lead, main .eyebrow, main p, main li, main blockquote, main dt, main dd"
    )).filter(function (element) {
      return !shouldSkip(element);
    });

    var parentCounts = new WeakMap();
    textNodes.forEach(function (element) {
      element.classList.add("text-reveal");
      var parent = element.parentElement || document.body;
      var count = parentCounts.get(parent) || 0;
      element.style.setProperty("--motion-delay", Math.min(count, 4) * 38 + "ms");
      parentCounts.set(parent, count + 1);
    });

    var mediaNodes = Array.prototype.slice.call(document.querySelectorAll([
      ".editorial-image",
      ".service-hero-image",
      ".case-study-hero-image",
      ".pf-item",
      ".collage-gallery figure",
      ".service-lower-gallery-item",
      ".banhalmi-gallery-item",
      ".banhalmi-fine-art-gallery-item",
      ".hero-figure",
      ".person-profile-hero-media",
      ".amcham-profile-media",
      ".about-portrait-split figure",
      ".oeuvre-teaser figure",
      ".archive-card figure",
      ".image-open"
    ].join(","))).filter(function (element) {
      return !shouldSkip(element) && !element.closest(".universal-lightbox");
    });

    mediaNodes.forEach(function (element, index) {
      element.classList.add("apple-media", "media-reveal");
      element.style.setProperty("--motion-delay", Math.min(index % 4, 3) * 42 + "ms");
    });

    // CSS only hides enhanced elements after this class is present, so content remains visible if JS fails.
    rootElement.classList.add("motion-ready");

    function revealImmediately() {
      textNodes.forEach(function (element) { element.classList.add("is-visible"); });
      mediaNodes.forEach(function (element) { element.classList.add("is-motion-visible"); });
    }

    if (reduceMotion || !canObserve) {
      revealImmediately();
      return;
    }

    var textObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        textObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });

    var mediaObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-motion-visible");
        mediaObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

    textNodes.forEach(function (element) { textObserver.observe(element); });
    mediaNodes.forEach(function (element) { mediaObserver.observe(element); });
  })();

  // Very light hero depth on pointer devices only; no mobile parallax and no layout movement.
  (function () {
    var heroImage = document.querySelector(".hero.hero-image-first .hero-figure img:not(.hero-center-logo), .editorial-hero img:not(.hero-center-logo)");
    if (!heroImage) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia && window.matchMedia("(max-width: 900px)").matches) return;
    var figure = heroImage.closest(".hero-figure, .editorial-hero, .service-hero-image");
    if (!figure) return;
    var ticking = false;
    function update() {
      ticking = false;
      var rect = figure.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      var shift = Math.max(-5, Math.min(5, (progress - 0.5) * 10));
      heroImage.style.setProperty("--hero-scroll-y", shift.toFixed(2) + "px");
    }
    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }
    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
  })();

  // Service lower galleries — progressive reveal for performance without removing SEO-visible HTML when JavaScript is disabled.
  document.querySelectorAll('.service-lower-gallery-grid').forEach(function(grid){
    var items = Array.prototype.slice.call(grid.querySelectorAll('.service-lower-gallery-item'));
    if (items.length <= 18 || grid.dataset.galleryEnhanced === 'true') return;
    grid.dataset.galleryEnhanced = 'true';
    grid.classList.add('is-gallery-collapsed');
    var lang = (document.documentElement.lang || 'en').toLowerCase();
    var isHu = lang.indexOf('hu') === 0;
    var isDe = lang.indexOf('de') === 0;
    var openText = isHu ? 'További képek' : isDe ? 'Weitere Bilder' : 'More images';
    var closeText = isHu ? 'Kevesebb kép' : isDe ? 'Weniger Bilder' : 'Fewer images';
    var wrap = document.createElement('div');
    wrap.className = 'service-gallery-toggle';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost';
    btn.setAttribute('aria-expanded','false');
    btn.textContent = openText;
    btn.addEventListener('click', function(){
      var collapsed = grid.classList.toggle('is-gallery-collapsed');
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      btn.textContent = collapsed ? openText : closeText;
      if (collapsed) grid.scrollIntoView({behavior:'smooth', block:'start'});
    });
    wrap.appendChild(btn);
    grid.insertAdjacentElement('afterend', wrap);
  });

})();

/* BANHALMI universal gallery lightbox with 18+ self-declaration gate — 2026-07-08. */
(function(){
  var galleries = Array.prototype.slice.call(document.querySelectorAll('[data-universal-gallery]'));
  var lb = document.querySelector('[data-universal-lightbox]');
  if(!galleries.length || !lb) return;
  var items=[]; var current=0; var pendingIndex=null; var lastTrigger=null;
  var img=lb.querySelector('img'); var cap=lb.querySelector('figcaption'); var linkBox=lb.querySelector('.universal-lightbox-links'); if(!linkBox){linkBox=document.createElement('div');linkBox.className='universal-lightbox-links';cap.insertAdjacentElement('afterend',linkBox);}
  var lang=(document.documentElement.lang||'en').toLowerCase();
  var copy=lang.indexOf('hu')===0 ? {
    title:'Felnőtteknek szóló művészi tartalom',
    body:'A kiválasztott kép intim vagy művészi testtanulmányt tartalmaz. A megnyitással megerősíted, hogy elmúltál 18 éves.',
    accept:'Elmúltam 18 éves — megnyitás', decline:'Még nem / bezárás'
  } : lang.indexOf('de')===0 ? {
    title:'Künstlerischer Inhalt für Erwachsene',
    body:'Das ausgewählte Bild enthält eine intime oder künstlerische Körperstudie. Mit dem Öffnen bestätigst du, mindestens 18 Jahre alt zu sein.',
    accept:'Ich bin 18 oder älter — öffnen', decline:'Noch nicht / schließen'
  } : {
    title:'Adult artistic content',
    body:'The selected image contains an intimate or artistic body study. By opening it, you confirm that you are 18 years of age or older.',
    accept:'I am 18 or older — open', decline:'Not yet / close'
  };
  var ageVerified=false;
  try{ageVerified=sessionStorage.getItem('banhalmi_age_18_verified')==='yes';}catch(e){}
  function collect(){items=[];galleries.forEach(function(g){items=items.concat(Array.prototype.slice.call(g.querySelectorAll('[data-lightbox-src]')));});}
  function isRestricted(el){return !!el && el.getAttribute('data-age-restricted')==='true';}
  function buildAgeDialog(){
    var d=document.createElement('div'); d.className='age-verification-dialog'; d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true'); d.setAttribute('aria-hidden','true'); d.setAttribute('aria-labelledby','age-verification-title');
    d.innerHTML='<div class="age-verification-panel"><div class="age-verification-kicker" aria-hidden="true">18+</div><h2 id="age-verification-title"></h2><p></p><div class="age-verification-actions"><button type="button" class="btn btn-primary" data-age-accept></button><button type="button" class="btn btn-ghost" data-age-decline></button></div></div>';
    d.querySelector('h2').textContent=copy.title; d.querySelector('p').textContent=copy.body; d.querySelector('[data-age-accept]').textContent=copy.accept; d.querySelector('[data-age-decline]').textContent=copy.decline;
    d.querySelector('[data-age-accept]').addEventListener('click',function(){ageVerified=true;try{sessionStorage.setItem('banhalmi_age_18_verified','yes');}catch(e){}closeAgeDialog(false);var idx=pendingIndex;pendingIndex=null;if(idx!==null)openAt(idx);});
    d.querySelector('[data-age-decline]').addEventListener('click',function(){pendingIndex=null;closeAgeDialog(true);});
    d.addEventListener('click',function(e){if(e.target===d){pendingIndex=null;closeAgeDialog(true);}});
    document.body.appendChild(d); return d;
  }
  var ageDialog=buildAgeDialog();
  ageDialog.inert=true;
  function showAgeDialog(index,trigger){pendingIndex=index;lastTrigger=trigger||null;ageDialog.inert=false;ageDialog.classList.add('open');ageDialog.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';ageDialog.querySelector('[data-age-accept]').focus();}
  function closeAgeDialog(restore){ageDialog.classList.remove('open');ageDialog.setAttribute('aria-hidden','true');ageDialog.inert=true;document.body.style.overflow='';if(restore&&lastTrigger)lastTrigger.focus();}
  function requestOpen(index,trigger){collect();if(!items.length)return;index=(index+items.length)%items.length;if(isRestricted(items[index])&&!ageVerified){showAgeDialog(index,trigger||items[index]);return;}openAt(index);}
  function openAt(index){collect();if(!items.length)return;lb.inert=false;current=(index+items.length)%items.length;var el=items[current];img.src=el.getAttribute('data-lightbox-src');img.alt=el.getAttribute('data-lightbox-cap')||'';cap.textContent=el.getAttribute('data-lightbox-cap')||'';linkBox.innerHTML='';for(var n=1;n<=12;n++){var href=el.getAttribute('data-lightbox-link-'+n);var label=el.getAttribute('data-lightbox-link-'+n+'-label');if(href&&label){var a=document.createElement('a');a.href=href;if(/^https?:\/\//i.test(href)){a.target='_blank';a.rel='noopener noreferrer';}a.textContent=label+' ↗';linkBox.appendChild(a);}}linkBox.hidden=!linkBox.children.length;lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';lb.querySelector('.universal-lightbox-close').focus();}
  function close(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');lb.inert=true;document.body.style.overflow='';img.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';img.alt='';if(lastTrigger)lastTrigger.focus();}
  galleries.forEach(function(g){g.addEventListener('click',function(e){var b=e.target.closest('[data-lightbox-src]');if(!b)return;collect();lastTrigger=b;requestOpen(items.indexOf(b),b);});});
  lb.querySelector('.universal-lightbox-close').addEventListener('click',close);
  lb.querySelector('.universal-lightbox-next').addEventListener('click',function(){requestOpen(current+1);});
  lb.querySelector('.universal-lightbox-prev').addEventListener('click',function(){requestOpen(current-1);});
  lb.addEventListener('click',function(e){if(e.target===lb)close();});
  document.addEventListener('keydown',function(e){
    if(ageDialog.classList.contains('open')){if(e.key==='Escape'){pendingIndex=null;closeAgeDialog(true);}return;}
    if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')close(); if(e.key==='ArrowRight')requestOpen(current+1); if(e.key==='ArrowLeft')requestOpen(current-1);
  });
})();


/* Privacy-enhanced YouTube poster activation */
(() => {
  const activate = (poster) => {
    if (!poster || poster.dataset.youtubeLoaded === 'true') return;
    const id = poster.dataset.youtubeId;
    if (!id) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.title = 'YouTube video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    poster.dataset.youtubeLoaded = 'true';
    poster.replaceChildren(iframe);
  };
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.youtube-poster-button');
    if (button) activate(button.closest('.youtube-poster'));
  });
})();
