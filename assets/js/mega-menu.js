/* BANHALMI descriptive mega menu — inspired by the ART navigation, adapted to the business site. */
(function () {
  'use strict';

  var copy = {
    en: {
      label: 'Navigation', close: 'Close menu', menu: 'Open menu',
      primary: [
        { href: '/about/', title: 'Oeuvre', desc: 'The professional and artistic path behind BANHALMI since 1999.' },
        { href: '/archive/', title: 'Archive', desc: 'Books, exhibitions, projects and selected source material.' },
        { href: '/faq/', title: 'FAQ', desc: 'Clear answers about preparation, process, delivery and usage.' },
        { href: '/contact/', title: 'Contact', desc: 'Studios, direct contact and the people coordinating your project.' }
      ],
      servicesTitle: 'Services', servicesDesc: 'Choose the visual task you need to solve.',
      services: [
        { href: '/portrait/', title: 'Portrait Photography', desc: 'Headshots, executive portraits and personal visual positioning.' },
        { href: '/lifestyle/', title: 'Brand Photography', desc: 'Coherent image systems for leaders, teams and organisations.' },
        { href: '/event-photography/', title: 'C-Level Events', desc: 'Discreet, context-aware coverage for leadership and corporate settings.' },
        { href: '/glamour/', title: 'Fine Art Photography', desc: 'Author-led portraiture and artistic work centred on identity and presence.' }
      ],
      cta: 'Build Your Package', ctaDesc: 'Create a preliminary scope and orientation estimate for your project.',
      art: 'BANHALMI ART', artDesc: 'Enter the independent artistic oeuvre and source archive.',
      foot: 'Vienna · Budapest · Central Europe'
    },
    hu: {
      label: 'Navigáció', close: 'Menü bezárása', menu: 'Menü megnyitása',
      primary: [
        { href: '/hu/eletmu/', title: 'Életmű', desc: 'A BANHALMI szakmai és művészeti útja 1999-től napjainkig.' },
        { href: '/hu/archivum/', title: 'Archívum', desc: 'Könyvek, kiállítások, projektek és válogatott forrásanyagok.' },
        { href: '/hu/gyik/', title: 'GYIK', desc: 'Egyértelmű válaszok az előkészítésről, folyamatról, átadásról és jogokról.' },
        { href: '/hu/kapcsolat/', title: 'Kapcsolat', desc: 'Stúdiók, közvetlen elérhetőségek és a projektet koordináló személyek.' }
      ],
      servicesTitle: 'Szolgáltatások', servicesDesc: 'Válassza ki, milyen vizuális feladatot kell megoldanunk.',
      services: [
        { href: '/hu/portre/', title: 'Portréfotózás', desc: 'Headshot, executive portré és személyes vizuális pozicionálás.' },
        { href: '/hu/brand/', title: 'Brandfotózás', desc: 'Következetes képi rendszer vezetőknek, csapatoknak és szervezeteknek.' },
        { href: '/hu/rendezvenyfotozas/', title: 'C-Level események', desc: 'Diszkrét, kontextusérzékeny dokumentáció vezetői és vállalati helyzetekben.' },
        { href: '/hu/muveszi-fotografia/', title: 'Művészi fotográfia', desc: 'Szerzői portré és alkotói munka identitásról, jelenlétről és emberi történetekről.' }
      ],
      cta: 'Csomag összeállítása', ctaDesc: 'Készítsen előzetes projekttervet és tájékoztató kalkulációt.',
      art: 'BANHALMI ART', artDesc: 'Lépjen be az önálló művészeti életműbe és forrásarchívumba.',
      foot: 'Bécs · Budapest · Közép-Európa'
    },
    de: {
      label: 'Navigation', close: 'Menü schließen', menu: 'Menü öffnen',
      primary: [
        { href: '/de-at/lebenswerk/', title: 'Lebenswerk', desc: 'Der professionelle und künstlerische Weg hinter BANHALMI seit 1999.' },
        { href: '/de-at/archiv/', title: 'Archiv', desc: 'Bücher, Ausstellungen, Projekte und ausgewählte Quellen.' },
        { href: '/de-at/faq/', title: 'FAQ', desc: 'Klare Antworten zu Vorbereitung, Ablauf, Lieferung und Nutzungsrechten.' },
        { href: '/de-at/kontakt/', title: 'Kontakt', desc: 'Studios, direkte Kontaktdaten und die Koordination Ihres Projekts.' }
      ],
      servicesTitle: 'Leistungen', servicesDesc: 'Wählen Sie die visuelle Aufgabe, die wir lösen sollen.',
      services: [
        { href: '/de-at/portrait/', title: 'Porträtfotografie', desc: 'Headshots, Executive-Porträts und persönliche visuelle Positionierung.' },
        { href: '/de-at/brand/', title: 'Brand-Fotografie', desc: 'Kohärente Bildsysteme für Führungskräfte, Teams und Organisationen.' },
        { href: '/de-at/eventfotografie/', title: 'C-Level-Events', desc: 'Diskrete, kontextbewusste Begleitung von Leadership- und Corporate-Formaten.' },
        { href: '/de-at/fine-art/', title: 'Fine-Art-Fotografie', desc: 'Autorengeführte Porträts und künstlerische Arbeiten über Identität und Präsenz.' }
      ],
      cta: 'Paket zusammenstellen', ctaDesc: 'Erstellen Sie einen vorläufigen Projektumfang und eine Orientierungskalkulation.',
      art: 'BANHALMI ART', artDesc: 'Öffnen Sie das eigenständige künstlerische Werk- und Quellenarchiv.',
      foot: 'Wien · Budapest · Mitteleuropa'
    }
  };

  function language() {
    var lang = String(document.documentElement.lang || 'en').toLowerCase();
    return lang.indexOf('hu') === 0 ? 'hu' : lang.indexOf('de') === 0 ? 'de' : 'en';
  }

  function item(data, extraClass) {
    var wrap = document.createElement('div');
    wrap.className = 'bn-mega-item' + (extraClass ? ' ' + extraClass : '');
    var link = document.createElement('a');
    link.href = data.href;
    link.className = 'bn-mega-link';
    link.textContent = data.title;
    var desc = document.createElement('p');
    desc.className = 'bn-mega-desc';
    desc.textContent = data.desc;
    wrap.appendChild(link);
    wrap.appendChild(desc);
    return wrap;
  }

  function build() {
    var header = document.querySelector('.site-header');
    var nav = header && header.querySelector('.nav');
    var button = nav && nav.querySelector('.menu-btn');
    if (!header || !nav || !button || document.getElementById('bn-mega-menu')) return;

    var lang = language();
    var text = copy[lang];
    var overlay = document.createElement('div');
    overlay.id = 'bn-mega-menu';
    overlay.className = 'bn-mega-menu';
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');

    var panel = document.createElement('div');
    panel.className = 'bn-mega-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', text.label);

    var intro = document.createElement('div');
    intro.className = 'bn-mega-intro';
    intro.innerHTML = '<span class="bn-mega-eyebrow">BANHALMI</span><p>' + text.foot + '</p>';
    panel.appendChild(intro);

    var grid = document.createElement('div');
    grid.className = 'bn-mega-grid';

    var mainColumn = document.createElement('div');
    mainColumn.className = 'bn-mega-column bn-mega-primary';
    text.primary.forEach(function (entry) { mainColumn.appendChild(item(entry)); });

    var serviceColumn = document.createElement('div');
    serviceColumn.className = 'bn-mega-column bn-mega-services';
    var serviceHead = document.createElement('div');
    serviceHead.className = 'bn-mega-section-head';
    serviceHead.innerHTML = '<span>' + text.servicesTitle + '</span><p>' + text.servicesDesc + '</p>';
    serviceColumn.appendChild(serviceHead);
    text.services.forEach(function (entry) { serviceColumn.appendChild(item(entry, 'bn-mega-service')); });

    grid.appendChild(mainColumn);
    grid.appendChild(serviceColumn);
    panel.appendChild(grid);

    var footer = document.createElement('div');
    footer.className = 'bn-mega-footer';
    var quoteHref = lang === 'hu' ? '/hu/ajanlatkeres/' : lang === 'de' ? '/de-at/anfrage/' : '/requestaquote/';
    footer.appendChild(item({ href: quoteHref, title: text.cta, desc: text.ctaDesc }, 'bn-mega-cta'));
    footer.appendChild(item({ href: 'https://art.norbertbanhalmi.com/' + (lang === 'hu' ? 'hu/' : lang === 'de' ? 'de-at/' : ''), title: text.art, desc: text.artDesc }, 'bn-mega-art'));
    panel.appendChild(footer);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    var lastFocus = null;
    function setOpen(open) {
      if (open) lastFocus = document.activeElement;
      document.body.classList.toggle('bn-mega-open', open);
      overlay.hidden = !open;
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.setAttribute('aria-label', open ? text.close : text.menu);
      if (open) {
        window.requestAnimationFrame(function () {
          var first = overlay.querySelector('a');
          if (first) first.focus();
        });
      } else if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      }
    }

    button.setAttribute('aria-controls', 'bn-mega-menu');
    button.setAttribute('aria-label', text.menu);
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(!document.body.classList.contains('bn-mega-open'));
    }, true);

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay || event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (event) {
      if (!document.body.classList.contains('bn-mega-open')) return;
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return; }
      if (event.key !== 'Tab') return;
      var focusable = Array.prototype.slice.call(overlay.querySelectorAll('a[href],button:not([disabled])'));
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build, { once: true });
  else build();
})();