#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
OLD_IDS = {
    "https://www.norbertbanhalmi.com/about/",
    "https://www.norbertbanhalmi.com/about/#person",
    "https://www.norbertbanhalmi.com/hu/eletmu/#person",
    "https://www.norbertbanhalmi.com/de-at/werk/#person",
}
PERSON_ID = "https://www.banhalmi.art/norbert-banhalmi#person"
PROFILE_URL = "https://www.banhalmi.art/norbert-banhalmi"

PERSON_CORE = {
    "@type": "Person",
    "@id": PERSON_ID,
    "url": PROFILE_URL,
    "name": "Bánhalmi Norbert",
    "alternateName": ["Norbert Banhalmi", "Norbert Bánhalmi", "Norbert BANHALMI", "BANHALMI"],
    "givenName": "Norbert",
    "familyName": "Bánhalmi",
    "birthDate": "1979-05-14",
    "birthPlace": {"@type": "Place", "name": "Budapest", "sameAs": "https://www.wikidata.org/wiki/Q1781"},
    "nationality": {"@type": "Country", "name": "Magyarország", "sameAs": "https://www.wikidata.org/wiki/Q28"},
    "jobTitle": ["Fotóművész", "Fine art photographer", "Alkalmazott fotográfus", "Fotográfiai kurátor", "Executive portréfotós", "Vizuális brandstratéga"],
    "email": "mailto:hello@norbertbanhalmi.com",
    "image": {"@id": "https://www.norbertbanhalmi.com/about/#portrait"},
    "identifier": [
        {"@type": "PropertyValue", "propertyID": "Wikidata", "value": "Q56391118", "url": "https://www.wikidata.org/wiki/Q56391118"},
        {"@type": "PropertyValue", "propertyID": "Google Knowledge Graph MID", "value": "/g/11f5lxwl_6"},
    ],
    "homeLocation": {"@id": "https://www.banhalmi.art/#studio-vienna"},
    "workLocation": [{"@id": "https://www.banhalmi.art/#studio-budapest"}, {"@id": "https://www.banhalmi.art/#studio-vienna"}],
    "knowsLanguage": [
        {"@type": "Language", "name": "Magyar", "alternateName": "hu"},
        {"@type": "Language", "name": "Angol", "alternateName": "en"},
        {"@type": "Language", "name": "Német", "alternateName": "de"},
    ],
    "knowsAbout": ["Fotóművészet", "Fine art photography", "Alkalmazott fotográfia", "Dokumentarista fotográfia", "Portréfotózás", "Executive portréfotózás", "Vizuális brandstratégia", "Fotográfiai kurátori munka", "Művészeti könyvek", "Kiállítási projektek", "Fotográfiai oktatás"],
    "memberOf": [
        {"@type": "Organization", "name": "OM SYSTEM (Olympus) — brand ambassador Hungary", "url": "https://www.milcclub.com/ambassadors"},
        {"@type": "Organization", "name": "Pannon Fényképészkör Egyesület", "url": "https://fenykepeszkor.hu/"},
        {"@type": "Organization", "name": "WKO Wien — Landesinnung der Berufsfotografen", "url": "https://firmen.wko.at/norbert-banhalmi-visuelle-strategische-partnerschaft-f%C3%BCr-f%C3%BChrungskr%C3%A4fte/wien/?firmaid=12bd142c-5fcf-4457-9a90-47fbff162b40"},
        {"@type": "Organization", "name": "AmCham Austria", "url": "https://amcham.at/members-list/"},
        {"@type": "Organization", "name": "Magyar Fotóművészek Világszövetsége", "url": "https://www.mfvsz.com/hu/tagsag/"},
    ],
    "award": ["Turul-díj 2021", "Turul-díj 2022", "Top 100 of Hungary 2022", "Turul-díj 2023", "Turul-díj 2024", "Turul-díj 2025"],
    "worksFor": {"@id": "https://www.norbertbanhalmi.com/#organization"},
    "subjectOf": [{"@id": "https://www.banhalmi.art/#website"}, {"@id": "https://www.norbertbanhalmi.com/#website"}],
    "sameAs": [
        "https://www.wikidata.org/wiki/Q56391118",
        "https://cherrydeck.com/profile/norbert.banhalmi",
        "https://hu.wikipedia.org/wiki/B%C3%A1nhalmi_Norbert",
        "https://www.instagram.com/norbert.banhalmi/",
        "https://www.linkedin.com/in/norbertbanhalmi/",
        "https://www.facebook.com/banhalmi.norbert",
        "https://www.youtube.com/@norbert.banhalmi",
        "https://www.pinterest.com/norbertbanhalmi/",
        "https://www.tiktok.com/@banhalmi.norbert",
        "https://x.com/norbertbanhalmi",
        "https://www.saatchiart.com/norbertbanhalmi",
    ],
}

JSONLD_RE = re.compile(r'(<script[^>]+type=["\']application/ld\+json["\'][^>]*>)(.*?)(</script>)', re.I | re.S)


def replace_ids(obj):
    if isinstance(obj, dict):
        for k, v in list(obj.items()):
            if k == "@id" and v in OLD_IDS:
                obj[k] = PERSON_ID
            else:
                replace_ids(v)
    elif isinstance(obj, list):
        for item in obj:
            replace_ids(item)


def is_primary_person(node):
    if not isinstance(node, dict) or node.get("@type") != "Person":
        return False
    if node.get("@id") in OLD_IDS or node.get("@id") == PERSON_ID:
        return True
    same_as = node.get("sameAs", [])
    return isinstance(same_as, list) and "https://www.wikidata.org/wiki/Q56391118" in same_as


def align_jsonld(source):
    def repl(match):
        try:
            data = json.loads(match.group(2))
        except json.JSONDecodeError:
            return match.group(0)
        replace_ids(data)
        candidates = []
        if isinstance(data, dict) and isinstance(data.get("@graph"), list):
            candidates.extend(data["@graph"])
        elif isinstance(data, dict):
            candidates.append(data)
        for node in candidates:
            if is_primary_person(node):
                preserved = {k: v for k, v in node.items() if k in {"description", "mainEntityOfPage", "hasOccupation", "alumniOf", "hasCredential", "citation", "additionalProperty", "affiliation"}}
                node.clear()
                node.update(PERSON_CORE)
                node.update(preserved)
        return match.group(1) + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + match.group(3)
    return JSONLD_RE.sub(repl, source)


def align_json_file(path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return False
    original = json.dumps(data, ensure_ascii=False, sort_keys=True)
    replace_ids(data)
    candidates = data.get("@graph", []) if isinstance(data, dict) else []
    if isinstance(data, dict) and data.get("@type") == "Person":
        candidates = [data]
    for node in candidates:
        if is_primary_person(node):
            preserved = {k: v for k, v in node.items() if k in {"description", "mainEntityOfPage", "hasOccupation", "alumniOf", "hasCredential", "citation", "additionalProperty", "affiliation"}}
            node.clear(); node.update(PERSON_CORE); node.update(preserved)
    updated = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    if json.dumps(data, ensure_ascii=False, sort_keys=True) != original:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def clean_hungarian_oeuvre(source):
    replacements = {
        "Norbert Banhalmi portrait.": "Bánhalmi Norbert portréja.",
        "Stefánia Palace, Budapest": "Stefánia Palota, Budapest",
        "Hungarian House, New York": "Magyar Ház, New York",
        "Hungary, travelling project": "Magyarország, vándorprojekt",
        "Rege Gallery, Tihany": "Rege Galéria, Tihany",
        "Vienna · Munich": "Bécs · München",
        "Bewusst Sein Im Fokus, Vienna": "Bewusst Sein Im Fokus, Bécs",
        "CITYgalleryVIENNA, Vienna": "CITYgalleryVIENNA, Bécs",
        "<span>Article</span>": "<span>Cikk</span>",
        "<span>Video</span>": "<span>Videó</span>",
    }
    for old, new in replacements.items():
        source = source.replace(old, new)

    bilingual_titles = {
        "Az igazi Nők / Real Women": "Az igazi Nők",
        "Régi kacér idők / The Good Old Flirty Days": "Régi kacér idők",
        "Magyar nők New Yorkban / Hungarian Women in New York": "Magyar nők New Yorkban",
        "A Nő ötven árnyalata / 50 Shades of Woman": "A Nő ötven árnyalata",
        "Apa lettem / I Became a Father": "Apa lettem",
        "Mérföldkövek ’56 / Milestones ’56": "Mérföldkövek ’56",
        "Ébredés – az Új kezdet / Awakening": "Ébredés – az Új kezdet",
        "Szösszenetek / Snippets": "Szösszenetek",
        "A Nő világa / The World of Woman": "A Nő világa",
        "Te is lehetsz… / You Can Be Too…": "Te is lehetsz…",
        "A valóság hamis arcai / The False Faces of Reality": "A valóság hamis arcai",
        "Én a Nő / I Am the Woman": "Én a Nő",
        "Más kép / Más / Different Image Different": "Más kép / Más",
        "Ébredés – az Új kezdet! / Awakening: The New Beginning!": "Ébredés – az Új kezdet!",
    }
    for old, new in bilingual_titles.items():
        source = source.replace(old, new)
    return source

changed = []
for path in ROOT.rglob("*"):
    if any(part in {".git", "node_modules"} for part in path.parts) or not path.is_file():
        continue
    if path.suffix.lower() == ".html":
        text = path.read_text(encoding="utf-8")
        updated = align_jsonld(text)
        for old in OLD_IDS:
            updated = updated.replace(f'"@id":"{old}"', f'"@id":"{PERSON_ID}"')
        if path.as_posix().endswith("hu/eletmu/index.html"):
            updated = clean_hungarian_oeuvre(updated)
        if updated != text:
            path.write_text(updated, encoding="utf-8")
            changed.append(str(path.relative_to(ROOT)))
    elif path.suffix.lower() in {".json", ".jsonld"}:
        if align_json_file(path):
            changed.append(str(path.relative_to(ROOT)))

hu = (ROOT / "hu/eletmu/index.html").read_text(encoding="utf-8")
for forbidden in [" / Awakening", " / Real Women", " / Snippets", " / The World of Woman", " / I Became a Father", "<span>Article</span>", "<span>Video</span>"]:
    if forbidden in hu:
        raise SystemExit(f"Hungarian oeuvre audit failed: {forbidden}")

all_text = "\n".join(p.read_text(encoding="utf-8", errors="ignore") for p in ROOT.rglob("*") if p.is_file() and p.suffix.lower() in {".html", ".json", ".jsonld"})
if '"@type":"Person","@id":"https://www.norbertbanhalmi.com/about/"' in all_text:
    raise SystemExit("Legacy primary Person ID remains")
if PERSON_ID not in all_text:
    raise SystemExit("Canonical ART Person ID missing")

print(f"Updated {len(changed)} files")
for item in changed:
    print(item)
