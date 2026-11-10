import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const blog = {
  en: "https://blog.banhalmi.art/en/post/smoke-and-laser-the-dutch-are-coming",
  de: "https://blog.banhalmi.art/de/post/rauch-und-laser-die-holl%C3%A4nder-greifen-an",
  hu: "https://blog.banhalmi.art/post/fust-es-lezer-tamadnak-a-hollandok",
};
const onsoranje = "https://www.onsoranje.nl/node/79207";

const pages = [
  ["event-photography/index.html", blog.en, "Event photography report", "Dutch national football team · EURO 2020 Budapest"],
  ["de-at/eventfotografie/index.html", blog.de, "Eventfotografie-Bericht", "Niederländische Fußballnationalmannschaft · EURO 2020 Budapest"],
  ["hu/rendezvenyfotozas/index.html", blog.hu, "Rendezvényfotós beszámoló", "Holland labdarúgó-válogatott · EURO 2020 Budapest"],
];

for (const [path, primaryBlog, reportLabel, title] of pages) {
  const html = readFileSync(path, "utf8");
  assert.match(html, /data-trust-proof="stage6"/);
  assert.ok(html.includes('data-event-refs="true"'), path + ": missing delicate event-refs block");
  assert.doesNotMatch(html, /event-credit-card/, path + ": heavy event-credit cards must not remain");
  assert.ok(html.includes('data-event-report="onsoranje-euro2020"'), path + ": missing event-report marker");
  assert.ok(html.includes(title), path + ": missing visible report title");
  assert.ok(html.includes(reportLabel), path + ": missing report link label");
  assert.ok(html.includes(primaryBlog), path + ": missing language-matched blog URL");
  assert.ok(html.includes(blog.en) && html.includes(blog.de) && html.includes(blog.hu), path + ": all three blog language URLs must be visible");
  assert.ok(html.includes(onsoranje), path + ": missing OnsOranje official URL");
  assert.match(html, new RegExp(`data-editorial-post="true"[^>]*data-event-report="onsoranje-euro2020"|data-event-report="onsoranje-euro2020"[^>]*data-editorial-post="true"`));
  assert.ok(html.includes(`href="${primaryBlog}"`), path + ": editorial/report href mismatch");
}

console.log("OnsOranje EURO 2020 event report visibility: PASS");
