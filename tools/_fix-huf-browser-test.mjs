import fs from 'node:fs';

const path='tests/quote-calculator.spec.mjs';
let source=fs.readFileSync(path,'utf8');

const before=`      const after = amount(await gross.textContent());
      expect(after).toBeGreaterThan(0);
      expect(amount(await page.locator('input[name="estimate_gross"]').inputValue())).toBeCloseTo(after, 1);`;
const after=`      const after = amount(await gross.textContent());
      expect(after).toBeGreaterThan(0);
      const visibleAmountField = route.lang === 'hu' ? 'estimate_display_gross' : 'estimate_gross';
      expect(amount(await page.locator(\`input[name="\${visibleAmountField}"]\`).inputValue())).toBeCloseTo(after, 1);`;
const assertionCount=source.split(before).length-1;
if(assertionCount!==1)throw new Error('Expected one legacy visible/canonical currency assertion, found '+assertionCount);
source=source.replace(before,after);

const oldHufPattern="toContainText(/88[ .]?000/)";
const newHufPattern="toContainText(/88[\\s\\u00a0]?000/)";
const patternCount=source.split(oldHufPattern).length-1;
if(patternCount!==1)throw new Error('Expected one legacy HUF spacing assertion, found '+patternCount);
source=source.replace(oldHufPattern,newHufPattern);

fs.writeFileSync(path,source);
fs.rmSync('tools/_fix-huf-browser-test.mjs');
fs.rmSync('.github/workflows/_fix-huf-browser-test.yml');
