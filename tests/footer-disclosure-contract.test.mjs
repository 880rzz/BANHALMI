import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const css=readFileSync("assets/css/site.css","utf8");
const js=readFileSync("assets/js/main.js","utf8");
assert.ok(css.includes("FOOTER-DISCLOSURE-ICON-CONTRACT"),"Footer icon authority missing");
const contract=css.slice(css.indexOf("/* FOOTER-DISCLOSURE-ICON-CONTRACT"));
assert.match(contract,/footer-accordion>summary::before\{content:none;display:none;/);
assert.match(contract,/footer-accordion>summary::after\{content:none;display:none;/);
assert.match(contract,/@media \(max-width:720px\)/);
assert.match(contract,/footer-accordion\[open\]>summary::after/);
assert.match(js,/matchMedia\("\(min-width: 721px\)"\)/);
assert.match(js,/details\.open = desktopFooter\.matches/);
assert.match(js,/summary\.setAttribute\("aria-expanded"/);
for(const p of ["index.html","hu/index.html","de-at/index.html"]){
 const html=readFileSync(p,"utf8");
 assert.ok(html.includes("footer-accordion"),p+": footer disclosure missing");
}
console.log("Footer icon and responsive disclosure source contract: PASS");
