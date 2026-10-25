# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-menu-active-state.spec.mjs >> legal and contact card stacks keep visible separation
- Location: tests/mobile-menu-active-state.spec.mjs:116:1

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 20
Received:    16
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=e3]:
    - navigation "Main navigation" [ref=e5]:
      - link "BANHALMI emblem BANHALMI" [ref=e6] [cursor=pointer]:
        - /url: /
        - img "BANHALMI emblem" [ref=e7]
        - generic [ref=e8]: BANHALMI
      - group "Language" [ref=e9]:
        - link "EN" [ref=e10] [cursor=pointer]:
          - /url: /faq/
        - link "DE" [ref=e11] [cursor=pointer]:
          - /url: /de-at/faq/
        - link "HU" [ref=e12] [cursor=pointer]:
          - /url: /hu/gyik/
      - button "Open menu" [ref=e13] [cursor=pointer]
  - main [ref=e17]:
    - generic [ref=e19]:
      - paragraph [ref=e20]: FAQ
      - heading "Frequently Asked Questions" [level=1] [ref=e21]
      - paragraph [ref=e23]: It is normal to have practical questions before a photography project. Here are the answers—plain and simple.
    - generic [ref=e25]:
      - group [ref=e26]:
        - generic "Is this a one-off shoot or can we work together over time? +" [ref=e27] [cursor=pointer]
      - generic [ref=e28]:
        - heading "Portraits & preparation" [level=2] [ref=e29]
        - generic [ref=e30]:
          - group [ref=e31]:
            - generic "Who is a leadership portrait for? +" [ref=e32] [cursor=pointer]
          - group [ref=e33]:
            - generic "What is the difference between a headshot and a leadership portrait? +" [ref=e34] [cursor=pointer]
          - group [ref=e35]:
            - generic "How should I prepare for the session? +" [ref=e36] [cursor=pointer]
          - group [ref=e37]:
            - generic "Can you help with posing? +" [ref=e38] [cursor=pointer]
      - generic [ref=e39]:
        - heading "Production & locations" [level=2] [ref=e40]
        - generic [ref=e41]:
          - group [ref=e42]:
            - generic "Do you work on location? +" [ref=e43] [cursor=pointer]
          - group [ref=e44]:
            - generic "Can you provide styling, hair and make-up? +" [ref=e45] [cursor=pointer]
          - group [ref=e46]:
            - generic "Can several people be photographed in one production? +" [ref=e47] [cursor=pointer]
          - group [ref=e48]:
            - generic "Can you provide more than one photographer? +" [ref=e49] [cursor=pointer]
      - generic [ref=e50]:
        - heading "Retouching, delivery & files" [level=2] [ref=e51]
        - generic [ref=e52]:
          - group [ref=e53]:
            - generic "Is on-site immediate retouching available? +" [ref=e54] [cursor=pointer]
          - group [ref=e55]:
            - generic "Can you deliver print-ready files? +" [ref=e56] [cursor=pointer]
          - group [ref=e57]:
            - generic "How are the final images selected? +" [ref=e58] [cursor=pointer]
          - group [ref=e59]:
            - generic "How quickly are images delivered? +" [ref=e60] [cursor=pointer]
      - generic [ref=e61]:
        - heading "Brand, events & artistic commissions" [level=2] [ref=e62]
        - generic [ref=e63]:
          - group [ref=e64]:
            - generic "What does visual brand positioning include? +" [ref=e65] [cursor=pointer]
          - group [ref=e66]:
            - generic "Do you photograph C-level events? +" [ref=e67] [cursor=pointer]
          - group [ref=e68]:
            - generic "Is fine-art or intimate photography possible? +" [ref=e69] [cursor=pointer]
      - generic [ref=e70]:
        - heading "Pricing, rights & administration" [level=2] [ref=e71]
        - generic [ref=e72]:
          - group [ref=e73]:
            - generic "Is the calculated price final? +" [ref=e74] [cursor=pointer]
          - group [ref=e75]:
            - generic "How are usage rights handled? +" [ref=e76] [cursor=pointer]
          - group [ref=e77]:
            - generic "Do you support EU reverse charge? +" [ref=e78] [cursor=pointer]
          - group [ref=e79]:
            - generic "What happens to my images under GDPR? +" [ref=e80] [cursor=pointer]
    - generic [ref=e82]:
      - heading "Not sure which option fits?" [level=2] [ref=e83]
      - link "Pricing & quote" [ref=e84] [cursor=pointer]:
        - /url: /requestaquote/
    - generic [ref=e86]:
      - generic [ref=e87]:
        - paragraph [ref=e88]: Project rules and privacy
        - heading "One authoritative place for each answer" [level=2] [ref=e89]
        - paragraph [ref=e90]: Preparation questions stay here. Contract terms, payment, delivery, licensing and data protection are maintained in their canonical legal pages so the wording does not drift between documents.
      - generic [ref=e91]:
        - article [ref=e92]:
          - heading "Fees, booking and project terms" [level=3] [ref=e93]
          - paragraph [ref=e94]: The accepted written offer and the Terms & Conditions define fees, booking, rescheduling and the project framework.
          - link "Read the Terms & Conditions →" [ref=e95] [cursor=pointer]:
            - /url: /terms-conditions/
        - article [ref=e96]:
          - heading "Privacy and personal data" [level=3] [ref=e97]
          - paragraph [ref=e98]: The Privacy Notice explains data processing, storage, access, deletion and cross-domain measurement.
          - link "Read the Privacy Notice →" [ref=e99] [cursor=pointer]:
            - /url: /privacy-policy/
        - article [ref=e100]:
          - heading "Delivery and image use" [level=3] [ref=e101]
          - paragraph [ref=e102]: Delivery, approvals and permitted image use are defined by the accepted offer together with the contractual terms.
          - link "Review delivery and licence terms →" [ref=e103] [cursor=pointer]:
            - /url: /terms-conditions/
    - region "Questions clients ask before they book" [ref=e104]:
      - generic [ref=e105]:
        - heading "Questions clients ask before they book" [level=2] [ref=e107]
        - generic [ref=e108]:
          - group [ref=e109]:
            - generic "How many outfits should I bring for an executive or personal-brand session? +" [ref=e110] [cursor=pointer]
          - group [ref=e111]:
            - generic "Can a professional portrait also feel personal or artistic? +" [ref=e112] [cursor=pointer]
          - group [ref=e113]:
            - generic "How many retouched photographs do I receive? +" [ref=e114] [cursor=pointer]
          - group [ref=e115]:
            - generic "Can we select and retouch the best portraits immediately after the session? +" [ref=e116] [cursor=pointer]
          - group [ref=e117]:
            - generic "What should I do with hair and make-up? +" [ref=e118] [cursor=pointer]
          - group [ref=e119]:
            - generic "What does a starter model portfolio need? +" [ref=e120] [cursor=pointer]
          - group [ref=e121]:
            - generic "Can you create photographs specifically for dating profiles? +" [ref=e122] [cursor=pointer]
          - group [ref=e123]:
            - generic "Do you photograph artistic nude portraits of men as well as women? +" [ref=e124] [cursor=pointer]
          - group [ref=e125]:
            - generic "Can an artistic nude session use more than one location? +" [ref=e126] [cursor=pointer]
          - group [ref=e127]:
            - generic "What should an event organiser send before the assignment? +" [ref=e128] [cursor=pointer]
          - group [ref=e129]:
            - generic "What level of event retouching is included? +" [ref=e130] [cursor=pointer]
    - group [ref=e134]:
      - generic "What kinds of artistic photography can I commission? +" [ref=e135] [cursor=pointer]
    - region [ref=e136]:
      - generic [ref=e137]:
        - heading "Artists & Performers" [level=2] [ref=e139]
        - generic [ref=e140]:
          - group [ref=e141]:
            - generic "Do you photograph actors, dancers and performing artists? +" [ref=e142] [cursor=pointer]
          - group [ref=e143]:
            - generic "What should an actor portfolio or casting headshot communicate? +" [ref=e144] [cursor=pointer]
          - group [ref=e145]:
            - generic "How is dance photography different from a standard portrait session? +" [ref=e146] [cursor=pointer]
          - group [ref=e147]:
            - generic "Can professional hair, make-up and styling be arranged? +" [ref=e148] [cursor=pointer]
          - group [ref=e149]:
            - generic "Can an artistic or performing-artist session be bought as a gift? +" [ref=e150] [cursor=pointer]
          - group [ref=e151]:
            - generic "Which quote option should an actor, dancer or model choose? +" [ref=e152] [cursor=pointer]
  - contentinfo [ref=e153]:
    - generic [ref=e154]:
      - generic [ref=e155]:
        - generic [ref=e156]:
          - link "BANHALMI emblem BANHALMI" [ref=e157] [cursor=pointer]:
            - /url: /
            - img "BANHALMI emblem" [ref=e158]
            - generic [ref=e159]: BANHALMI
          - paragraph [ref=e160]: BANHALMI — executive portraiture, brand photography and visual communication from Vienna and Budapest, with a substantial New York reference archive.
          - link "WKO Vienna company profile of Banhalmi Norbert e.U." [ref=e161] [cursor=pointer]:
            - /url: https://firmen.wko.at/norbert-banhalmi-visuelle-strategische-partnerschaft-f%C3%BCr-f%C3%BChrungskr%C3%A4fte/wien/?firmaid=12bd142c-5fcf-4457-9a90-47fbff162b40
            - img "WKO Wien"
        - group [ref=e162]:
          - generic "Services +" [ref=e163] [cursor=pointer]
        - group [ref=e164]:
          - generic "Archive +" [ref=e165] [cursor=pointer]
        - group [ref=e166]:
          - generic "Profile +" [ref=e167] [cursor=pointer]
        - group [ref=e168]:
          - generic "Social media +" [ref=e169] [cursor=pointer]
        - group [ref=e170]:
          - generic "Memberships +" [ref=e171] [cursor=pointer]
        - generic [ref=e172]:
          - heading "Contact" [level=3] [ref=e173]
          - list [ref=e174]:
            - listitem [ref=e175]:
              - strong [ref=e176]:
                - link "Vienna studio" [ref=e177] [cursor=pointer]:
                  - /url: https://maps.app.goo.gl/QsMeDA8Bgq5yKxAo8
                  - text: Vienna studio
                  - generic [ref=e178]: ↗
              - generic [ref=e179]: Schwedenplatz 2, Top 8–9, 1010 Wien
              - link "+43 677 647 332 62" [ref=e180] [cursor=pointer]:
                - /url: tel:+4367764733262
            - listitem [ref=e181]:
              - strong [ref=e182]:
                - link "Vienna office" [ref=e183] [cursor=pointer]:
                  - /url: https://g.page/r/CdO4Kej3jIkfEBM
                  - text: Vienna office
                  - generic [ref=e184]: ↗
              - generic [ref=e185]: Gersthofer Straße 150–154/6/2, 1180 Wien
              - generic [ref=e186]: Client meetings by appointment
            - listitem [ref=e187]:
              - strong [ref=e188]:
                - link "Budapest studio" [ref=e189] [cursor=pointer]:
                  - /url: https://maps.app.goo.gl/nEvcjbCA1wmgQtXJA
                  - text: Budapest studio
                  - generic [ref=e190]: ↗
              - generic [ref=e191]: Lágymányosi u. 15, 1111 Budapest
              - link "+43 677 647 332 62" [ref=e192] [cursor=pointer]:
                - /url: tel:+4367764733262
          - generic [ref=e193]:
            - link "Contact" [ref=e194] [cursor=pointer]:
              - /url: /contact/
            - link "hello@norbertbanhalmi.com" [ref=e195] [cursor=pointer]:
              - /url: mailto:hello@norbertbanhalmi.com
            - link "WhatsApp +43 677 616 55592" [ref=e196] [cursor=pointer]:
              - /url: https://wa.me/4367761655592
              - text: WhatsApp +43 677 616 55592
              - generic [ref=e197]: ↗
        - generic [ref=e198]:
          - heading "Legal" [level=3] [ref=e199]
          - list [ref=e200]:
            - listitem [ref=e201]:
              - generic [ref=e202]: GISA
              - strong [ref=e203]: 36592951 · 36593897
            - listitem [ref=e204]:
              - generic [ref=e205]: VAT / UID
              - strong [ref=e206]: ATU80445314
            - listitem [ref=e207]:
              - generic [ref=e208]: GLN
              - strong [ref=e209]: "9110037983878"
      - generic [ref=e210]:
        - generic [ref=e211]: © BANHALMI Photography — since 1999 · Banhalmi Norbert e.U.
        - generic [ref=e212]:
          - link "Trust Center" [ref=e213] [cursor=pointer]:
            - /url: /trust/
          - text: ·
          - link "Legal Notice" [ref=e214] [cursor=pointer]:
            - /url: /impressum/
          - text: ·
          - link "Privacy Policy" [ref=e215] [cursor=pointer]:
            - /url: /privacy-policy/
          - text: ·
          - link "Terms" [ref=e216] [cursor=pointer]:
            - /url: /terms-conditions/
          - text: ·
          - link "Cookies" [ref=e217] [cursor=pointer]:
            - /url: /cookie-policy/
          - text: ·
          - button "Cookie settings" [ref=e218] [cursor=pointer]
          - text: ·
          - link "Accessibility" [ref=e219] [cursor=pointer]:
            - /url: /accessibility/
    - navigation "Official BANHALMI network" [ref=e220]:
      - link "Professional website" [ref=e221] [cursor=pointer]:
        - /url: https://www.norbertbanhalmi.com/
      - link "Art archive" [ref=e222] [cursor=pointer]:
        - /url: https://www.banhalmi.art/
        - text: Art archive
        - generic [ref=e223]: ↗
      - link "Essays & blog" [ref=e224] [cursor=pointer]:
        - /url: https://blog.banhalmi.art/en/
        - text: Essays & blog
        - generic [ref=e225]: ↗
  - dialog "Cookies" [ref=e226]:
    - paragraph [ref=e227]: This website uses technically necessary storage. Google Analytics, Microsoft Clarity and optional review services load only after your consent.
    - generic [ref=e228]:
      - button "Accept" [ref=e229] [cursor=pointer]
      - button "Only necessary" [ref=e230] [cursor=pointer]
  - text: +
```

# Test source

```ts
  19  |     const menu = page.locator('#bn-mega-menu[aria-hidden="false"]');
  20  |     await expect(menu).toBeVisible();
  21  |     const active = menu.locator('a.bn-mega-link[aria-current="page"]');
  22  |     await expect(active).toHaveCount(1);
  23  |     await expect(active).toHaveText(entry.label);
  24  |     const styles = await active.evaluate((element) => {
  25  |       const style = getComputedStyle(element);
  26  |       return { backgroundColor:style.backgroundColor,borderTopWidth:style.borderTopWidth,borderRightWidth:style.borderRightWidth,borderBottomWidth:style.borderBottomWidth,borderLeftWidth:style.borderLeftWidth,borderRadius:style.borderRadius,boxShadow:style.boxShadow,outlineStyle:style.outlineStyle,textDecorationLine:style.textDecorationLine };
  27  |     });
  28  |     expect(styles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  29  |     expect(styles.borderTopWidth).toBe('0px');
  30  |     expect(styles.borderRightWidth).toBe('0px');
  31  |     expect(styles.borderBottomWidth).toBe('0px');
  32  |     expect(styles.borderLeftWidth).toBe('0px');
  33  |     expect(styles.borderRadius).toBe('0px');
  34  |     expect(styles.boxShadow).toBe('none');
  35  |     expect(styles.outlineStyle).toBe('none');
  36  |     expect(styles.textDecorationLine).toContain('underline');
  37  |     expect(jsErrors).toEqual([]);
  38  |   });
  39  | }
  40  | 
  41  | test('pointer-open pricing menu never frames or auto-focuses Executive Portraits', async ({ page }) => {
  42  |   await page.goto('/requestaquote/', { waitUntil: 'domcontentloaded' });
  43  |   await page.locator('.menu-btn').click();
  44  |   const first = page.locator('#bn-mega-menu a.bn-mega-link').first();
  45  |   await expect(first).toHaveText('Executive Portraits');
  46  |   await expect(first).not.toBeFocused();
  47  |   const s = await first.evaluate((element) => { const style=getComputedStyle(element); return {backgroundColor:style.backgroundColor,borderTopWidth:style.borderTopWidth,borderRightWidth:style.borderRightWidth,borderBottomWidth:style.borderBottomWidth,borderLeftWidth:style.borderLeftWidth,borderRadius:style.borderRadius,boxShadow:style.boxShadow,outlineStyle:style.outlineStyle}; });
  48  |   expect(s.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  49  |   expect(s.borderTopWidth).toBe('0px');
  50  |   expect(s.borderRightWidth).toBe('0px');
  51  |   expect(s.borderBottomWidth).toBe('0px');
  52  |   expect(s.borderLeftWidth).toBe('0px');
  53  |   expect(s.borderRadius).toBe('0px');
  54  |   expect(s.boxShadow).toBe('none');
  55  |   expect(s.outlineStyle).toBe('none');
  56  | });
  57  | 
  58  | 
  59  | test('first mobile tap opens immediately with single-stage menu runtime', async ({ page }) => {
  60  |   let menuRequests = 0;
  61  |   page.on('request', request => {
  62  |     if (/\/assets\/js\/mega-menu(?:-v65-base)?\.js/.test(new URL(request.url()).pathname)) menuRequests += 1;
  63  |   });
  64  |   await page.goto('/', { waitUntil: 'domcontentloaded' });
  65  |   const button = page.locator('.menu-btn');
  66  |   await expect(button).toBeVisible();
  67  |   const start = Date.now();
  68  |   await button.click();
  69  |   const menu = page.locator('#bn-mega-menu[aria-hidden="false"]');
  70  |   await expect(menu).toBeVisible({ timeout: 1000 });
  71  |   expect(Date.now() - start).toBeLessThan(1000);
  72  |   await expect(button).toHaveAttribute('aria-expanded', 'true');
  73  |   expect(menuRequests).toBeLessThanOrEqual(1);
  74  | });
  75  | 
  76  | test('mobile menu drops empty pricing/about heads and keeps one journal +', async ({ page }) => {
  77  |   await page.goto('/', { waitUntil: 'domcontentloaded' });
  78  |   await page.locator('.menu-btn').click();
  79  |   const menu = page.locator('#bn-mega-menu[aria-hidden="false"]');
  80  |   await expect(menu).toBeVisible();
  81  |   const heads = await menu.locator('.bn-mega-section-head > span').allTextContents();
  82  |   expect(heads.map(t => t.trim().toLowerCase())).not.toEqual(
  83  |     expect.arrayContaining(['pricing · quote', 'about · contact'])
  84  |   );
  85  |   expect(heads.some(t => /pricing\s*·\s*quote/i.test(t))).toBe(false);
  86  |   expect(heads.some(t => /about\s*·\s*contact/i.test(t))).toBe(false);
  87  |   await expect(menu.locator('.bn-mega-pricing .bn-mega-link')).toHaveText('Pricing & packages');
  88  |   await expect(menu.locator('.bn-mega-footer .bn-mega-link').first()).toHaveText('About BANHALMI');
  89  |   const journal = menu.locator('details.bn-mega-journal');
  90  |   await expect(journal).toBeVisible();
  91  |   const summary = journal.locator('summary');
  92  |   const marker = await summary.evaluate(node => {
  93  |     const pseudo = getComputedStyle(node, '::after').content;
  94  |     const explicit = [...node.querySelectorAll('[aria-hidden="true"]')]
  95  |       .filter(child => ['+', '−', '–'].includes((child.textContent || '').trim())).length;
  96  |     return { pseudo, explicit };
  97  |   });
  98  |   expect(marker.pseudo).toBe('"+"');
  99  |   expect(marker.explicit).toBe(0);
  100 | });
  101 | 
  102 | 
  103 | test('review drawer exposes a visible disclosure chevron', async ({ page }) => {
  104 |   await page.goto('/portrait/', { waitUntil: 'domcontentloaded' });
  105 |   const summary = page.locator('details.review-drawer > summary').first();
  106 |   await expect(summary).toBeVisible();
  107 |   const pseudo = await summary.evaluate(el => {
  108 |     const s = getComputedStyle(el, '::after');
  109 |     return { content:s.content, width:s.width, height:s.height, display:s.display };
  110 |   });
  111 |   expect(pseudo.display).not.toBe('none');
  112 |   expect(pseudo.width).not.toBe('0px');
  113 |   expect(pseudo.height).not.toBe('0px');
  114 | });
  115 | 
  116 | test('legal and contact card stacks keep visible separation', async ({ page }) => {
  117 |   await page.goto('/faq/', { waitUntil: 'domcontentloaded' });
  118 |   const legalGap = await page.locator('.legal-navigation .service-grid').evaluate(el => getComputedStyle(el).rowGap);
> 119 |   expect(parseFloat(legalGap)).toBeGreaterThanOrEqual(20);
      |                                ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  120 |   await page.goto('/contact/', { waitUntil: 'domcontentloaded' });
  121 |   const contactGap = await page.locator('.contact-routing .service-grid').evaluate(el => getComputedStyle(el).rowGap);
  122 |   expect(parseFloat(contactGap)).toBeGreaterThanOrEqual(20);
  123 | });
  124 | 
```