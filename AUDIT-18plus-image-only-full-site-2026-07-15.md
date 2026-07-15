# BANHALMI — 18+ képkezelés és teljes weboldal-audit

Dátum: 2026-07-15

## Elvégzett módosítások

- A galériák fölött/alatt megjelenő általános 18+ tájékoztató blokk eltávolítva mindhárom művészeti oldalról:
  - `/glamour/`
  - `/hu/muveszi-fotografia/`
  - `/de-at/fine-art/`
- A 18+ védelem kizárólag a korhatáros képeken maradt meg.
- Nyelvenként 17 korhatáros kép használ sötétített előnézetet, képszintű 18+ jelölést és megnyitás előtti életkor-megerősítést.
- A korhatáros képeket kezelő CSS javítva: a korábbi, egymásnak ellentmondó `display`-, pozicionálási és panelstílusok szétválasztva.
- A 18+ jelölés látható, a megerősítő párbeszédablak pedig megfelelően megnyitható.
- Blur nincs: a korhatáros előnézet sötétítést használ.
- A CSS cache-verzió frissítve: `style.css?v=20260715-image-age-fix`.
- A kapcsolati oldalak túl hosszú meta-, Open Graph- és Twitter-leírásai rövidítve mindhárom nyelven.
- A lightbox 1×1 pixeles helyőrző képei `width="1"` és `height="1"` méretet kaptak a layout shift megelőzésére.
- A géppel olvasható fine-art tartalmi szabály frissítve: „blurred previews” helyett „darkened previews”.

## 18+ ellenőrzés

- Általános 18+ blokk a HTML-oldalakon: **0**
- Korhatáros képek az angol művészeti oldalon: **17**
- Korhatáros képek a magyar művészeti oldalon: **17**
- Korhatáros képek a német művészeti oldalon: **17**
- Képszintű 18+ badge-ek: **51 / 51**
- Képszintű `data-age-restricted` kapuk: **51 / 51**
- Sötétített, külön előnézeti kép használata: **51 / 51**
- Eredeti korhatáros kép közvetlen előnézeti megjelenítése: **0**
- CSS `blur()` vagy `backdrop-filter: blur()` előfordulás: **0**

## Teljes technikai audit

### Oldalszerkezet és SEO

- HTML-fájlok: **71**
- Aktív oldalak: **52**
- Régi URL-eket kezelő átirányítások: **19**
- Sitemap URL-ek: **51** (az aktív, indexelhető oldalak; a 404 oldal nélkül)
- Hiányzó title: **0**
- Hiányzó meta description: **0**
- Túl hosszú title: **0**
- Túl hosszú meta description: **0**
- Hibás H1-darabszám aktív oldalon: **0**
- Duplikált aktív oldali title: **0**
- Duplikált aktív oldali meta description: **0**
- Hibás canonical: **0**
- Hibás vagy hiányos EN / HU-HU / DE-AT / x-default hreflang készlet: **0**
- Nem kölcsönös hreflang kapcsolat: **0**
- Sitemap és canonical eltérés: **0**

### Linkek és fájlok

- Hibás belső oldalhivatkozás: **0**
- Hiányzó helyi kép: **0**
- Hiányzó CSS- vagy JavaScript-fájl: **0**
- Hiányzó `srcset`-forrás: **0**
- Duplikált HTML `id`: **0**
- Régi X-profil (`x.com/banhalminorbert`): **0**
- Használt X-profil: `https://x.com/norbertbanhalmi`

### Képek és akadálymentesség

- Ellenőrzött HTML-képek: **672**
- Hiányzó `alt`: **0**
- Hiányzó szélesség vagy magasság: **0**
- `decoding="async"`: **672 / 672**
- Reszponzív `srcset`: **492** kép
- Lazy loading: **492** kép
- Név nélküli normál űrlapmező: **0**
- A kilenc `website` mező szándékos, `aria-hidden="true"`, `tabindex="-1"` honeypot spamvédelem.

### Strukturált adatok

- Feldolgozott JSON-LD blokkok: **194**
- Hibás JSON-LD: **0**
- Ellenőrzött `ImageObject` node-ok: **672**
- Hiányzó `license`: **0**
- Hiányzó `copyrightNotice`: **0**
- Hiányzó `acquireLicensePage`: **0**
- Hibás kép-`creator`: **0**
- Érvénytelen `dateModified`: **0**
- Hibás önálló JSON / JSON-LD fájl: **0**

### Integrációk és tartalom

- Trustindex rich snippet script: minden HTML-oldalon pontosan egyszer.
- Elfsight lenyitható véleményblokk: **18** oldalon.
- A véleményblokk szerkezete megmaradt.
- Kapcsolati és ajánlatkérő űrlapok: **9**, a nyelvi és spamvédelmi mezőkkel együtt.
- A hat szolgáltatási terület mindhárom főoldalon és a meglévő szolgáltatási struktúrában szerepel:
  - Headshot
  - Executive portré
  - C-level üzleti fotózás
  - C-level eseményfotózás csapattal
  - Művészi fotózás / nude art
  - Brandfotózás és vizuális pozicionálás
- Viko neve:
  - EN: **Viko Speier**
  - DE: **Viko Speier**
  - HU: **Speier Vikó**
- AmCham Austria-link félkövéren szerepel mindhárom Viko-oldalon.
- `nude work` előfordulás: **0**

## Szintaktikai ellenőrzés

- `assets/js/main.js`: Node.js szintaktikai ellenőrzés sikeres.
- CSS kapcsos zárójelek és a korhatáros komponens szelektorai ellenőrizve.
- `sitemap.xml`: érvényesen feldolgozható.

## Végső állapot

A kódszintű és fájlszintű audit során nem maradt azonosított kritikus vagy indexelést akadályozó hiba. A 18+ védelem most kizárólag az érintett képekhez kapcsolódik, nem jelenik meg általános oldalszintű blokként.
