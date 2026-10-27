#!/usr/bin/env node
/**
 * Release gate: Wix Fotótörténelem snapshot invariants.
 * Blog is NOT in Google Image Licensable scope. This gate only blocks:
 * - BlogPosting exact-one regressions
 * - invented Banhalmi copyright on Class C third-party images
 * - regression of already-proven six-field writes (historical canary/bulk)
 * It does NOT require Google licensing metadata on remaining covers.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SNAP = path.join(
  ROOT,
  "docs/ecosystem-closure-20261027/image-rights-20261027/WIX_IMAGE_RIGHTS_513_AUDIT.json"
);
const errors = [];
const fail = (m) => errors.push(m);

if (!fs.existsSync(SNAP)) {
  console.error("FAIL: missing WIX_IMAGE_RIGHTS_513_AUDIT.json");
  process.exit(1);
}

const doc = JSON.parse(fs.readFileSync(SNAP, "utf8"));
const summary = doc.summary || {};
const posts = doc.posts || [];

if (summary.totalItems !== 513) fail(`totalItems expected 513, got ${summary.totalItems}`);
if (summary.blogPostingExactOne !== 513) {
  fail(`blogPostingExactOne expected 513, got ${summary.blogPostingExactOne}`);
}
if (summary.fetchErrors !== 0) fail(`fetchErrors expected 0, got ${summary.fetchErrors}`);
if (!Array.isArray(posts) || posts.length !== 513) {
  fail(`posts array length expected 513, got ${posts?.length}`);
}

const SIX = ["contentUrl", "creator", "creditText", "copyrightNotice", "license", "acquireLicensePage"];
let googleComplete = 0;
for (const p of posts) {
  if (p.primary !== 1) fail(`${p.itemId || p.url}: primary BlogPosting count ${p.primary} (expected 1)`);
  if (p.googleSix) {
    googleComplete += 1;
    for (const f of SIX) {
      const v = p[f];
      const ok =
        v != null &&
        (typeof v === "string" ? v.trim().length > 0 : typeof v === "object" ? !!(v.name || v["@id"] || v.url) : true);
      if (!ok) fail(`${p.itemId}: googleSix post missing ${f}`);
    }
    // Class C must never carry Banhalmi copyright
    if (p.bucket === "C") {
      const notice = String(p.copyrightNotice || "");
      const credit = String(p.creditText || "");
      if (/©\s*Bánhalmi|©\s*Banhalmi|BANHALMI Photography/i.test(notice)) {
        fail(`${p.itemId}: Class C third-party image must not use Banhalmi copyrightNotice`);
      }
      if (/BANHALMI Photography/i.test(credit) && !/Library of Congress|Public Domain|Met |Commons/i.test(credit)) {
        // allow empty; block only clear commercial Banhalmi credit on C
        if (/Bánhalmi Norbert \/ BANHALMI Photography/i.test(credit)) {
          fail(`${p.itemId}: Class C must not use Banhalmi Photography commercial credit`);
        }
      }
    }
  } else if (p.status !== "INPUT-NEM-ELÉRHETŐ" && p.status !== "NO_IMAGEOBJECT" && p.status !== "FETCH_ERROR") {
    // allow only documented statuses for incomplete
    if (p.status && p.status !== "GOOGLE_SIX_COMPLETE") {
      // incomplete without googleSix should be INPUT-NEM-ELÉRHETŐ or NO_IMAGEOBJECT
      if (!["INPUT-NEM-ELÉRHETŐ", "NO_IMAGEOBJECT"].includes(p.status)) {
        fail(`${p.itemId}: unexpected status ${p.status}`);
      }
    }
  }
}

if (summary.googleComplete !== googleComplete) {
  fail(`summary.googleComplete ${summary.googleComplete} != recount ${googleComplete}`);
}
if (googleComplete < 54) {
  fail(`googleComplete regression: expected at least 54 proven posts, got ${googleComplete}`);
}

if (errors.length) {
  console.error("Wix image-rights snapshot audit FAILED:");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log(
  `Wix image-rights snapshot PASS: exact-one 513/513; googleSix ${googleComplete}; unknown/incomplete allowed without invented Banhalmi copyright.`
);
