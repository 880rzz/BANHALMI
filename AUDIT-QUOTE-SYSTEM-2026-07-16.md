# BANHALMI ajánlati rendszer — végső audit

Dátum: 2026-07-16

## Auditált fájlok

- `hu/ajanlatkeres/index.html`
- `requestaquote/index.html`
- `de-at/anfrage/index.html`
- `assets/js/main.js`
- `assets/js/quote-calculator.js`
- `assets/js/quote-pdf.js`
- `pricing.json`

## Azonnal javított hibák

1. A három oldal script-cache verziója frissült, hogy a böngésző ne a korábbi JavaScriptet használja.
2. A PDF stúdiós fotózásnál már nem jelenít meg üres vagy placeholder „utazási ország” sort.
3. Nemzetközi helyszín esetén a PDF nagy összegkártyája „kalkulált részösszegként” jelenik meg, mert az utazás és logisztika nincs benne.
4. A PDF-letöltés gomb induláskor le van tiltva, és csak a teljes, validált `pricing.json` betöltése után válik aktívvá.
5. A PDF-gomb az űrlapon kívüli elhelyezése ellenére is követi az árlista betöltési állapotát.
6. A magyar Fine Art brand opció gépi értéke egységesen `artbrand` lett.
7. Javítva lett az angol és német egyórás időtartam nyelvtana.

## Ellenőrzések

- Mindhárom JavaScript-fájl szintaktikailag hibátlan.
- A `pricing.json` érvényes JSON.
- Mindhárom nyelvi oldalon azonos a 79 mező neve és sorrendje.
- Nincs duplikált HTML `id`.
- A kötelező ügyfél-, számlázási-, kapcsolat- és adatvédelmi mezők mindhárom nyelven megvannak.
- Minden rádiógombcsoportnak pontosan egy alapértelmezett választása van.
- Az információs gombok nem küldik el az űrlapot, és van akadálymentes megnevezésük.
- A PDF és a küldés árlista nélkül blokkolt.

## Számítási regressziós tesztek

- Headshot CV: 120,00 EUR bruttó.
- Brand, 1 fő, 3 kép: 499,00 EUR bruttó.
- Brand, 1 fő, 4 kép: 534,00 EUR bruttó.
- Fine Art, 2 kép: 690,00 EUR bruttó.
- Fine Art, 3 kép: 735,00 EUR bruttó.
- Csoport, 12 fő / 1 óra: 2 fotósállomás.
- Csoport, 12 fő / 2 óra: 1 fotósállomás.
- Portré, 1 fő / 10 azonnali kép: 5 retusóra.
- Brand, 1 fő / 10 azonnali kép: 2 retusóra.
- Rendezvény, 600 fő / 1 óra: 3 fotós, 830,00 EUR bruttó.
- Német vállalkozás: az előzetes ár továbbra is 20% osztrák ÁFÁ-val számol; a 0% csak ellenőrzés után válhat érvényessé.
- Nemzetközi helyszín: egyedi utazási ajánlat és kalkulált részösszeg.

## Környezeti ellenőrzés

Az eredeti csomag `site-config.js` fájlja a következő Worker-végpontra mutat:

`https://banhalmi-form-gateway.6ymnrwgnv9.workers.dev/api/banhalmi-form`

A frontend konfiguráció és a payload-előkészítés konzisztens. A Worker, a Google Apps Script, a Google Sheet-oszlopkezelés és a visszaigazoló e-mail szerveroldali kódja nem része a javítási csomagnak, ezért ezek végponttól végpontig történő működése ebből a ZIP-ből nem bizonyítható.
