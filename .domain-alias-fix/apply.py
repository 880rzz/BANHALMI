from __future__ import annotations

# One-time migration for canonical www/apex entry-domain alignment.
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AT_WWW = "https://www.banhalmi.at/"
AT_APEX = "https://banhalmi.at/"
HU_WWW = "https://www.banhalminorbert.hu/"
HU_APEX = "https://banhalminorbert.hu/"


def add_aliases_recursive(value):
    if isinstance(value, dict):
        for key, item in list(value.items()):
            if key == "sameAs" and isinstance(item, list):
                additions = []
                if AT_WWW in item and AT_APEX not in item:
                    additions.append(AT_APEX)
                if HU_WWW in item and HU_APEX not in item:
                    additions.append(HU_APEX)
                if additions:
                    value[key] = item + additions
            add_aliases_recursive(value.get(key))
    elif isinstance(value, list):
        for item in value:
            add_aliases_recursive(item)


def update_json(path: str):
    file = ROOT / path
    data = json.loads(file.read_text(encoding="utf-8"))
    add_aliases_recursive(data)
    file.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def update_ecosystem():
    file = ROOT / "ecosystem.json"
    data = json.loads(file.read_text(encoding="utf-8"))
    for entry in data.get("languageEntryDomains", []):
        url = entry.get("url")
        if url == HU_WWW:
            entry["hostVariants"] = [HU_WWW, HU_APEX]
        elif url == AT_WWW:
            entry["hostVariants"] = [AT_WWW, AT_APEX]
    rules = data.setdefault("canonicalRules", [])
    rule = "Treat www and apex forms of each entry domain as equivalent redirect aliases: www.banhalmi.at and banhalmi.at; www.banhalminorbert.hu and banhalminorbert.hu."
    if rule not in rules:
        rules.insert(1, rule)
    data["dateModified"] = "2026-07-29T17:45:00+02:00"
    data["schemaVersion"] = "2026-07-29-v3"
    file.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def update_text(path: str):
    file = ROOT / path
    text = file.read_text(encoding="utf-8")
    marker = "## Official language-entry domain variants"
    block = (
        "\n\n## Official language-entry domain variants\n"
        "- Austrian German entry aliases: https://www.banhalmi.at/ and https://banhalmi.at/ both permanently redirect to https://www.norbertbanhalmi.com/de-at/.\n"
        "- Hungarian entry aliases: https://www.banhalminorbert.hu/ and https://banhalminorbert.hu/ both permanently redirect to https://www.norbertbanhalmi.com/hu/.\n"
        "- These four hostnames are redirect aliases only. They are not separate websites, Person entities or Organization entities, and must not be used as canonical or hreflang targets.\n"
    )
    if marker not in text:
        text = text.rstrip() + block + "\n"
        file.write_text(text, encoding="utf-8")


def verify():
    for path in ["entity.jsonld", "entity-graph.json", "knowledge.json"]:
        text = (ROOT / path).read_text(encoding="utf-8")
        json.loads(text)
        for alias in (AT_WWW, AT_APEX, HU_WWW, HU_APEX):
            if alias not in text:
                raise SystemExit(f"{path}: missing {alias}")
    eco = json.loads((ROOT / "ecosystem.json").read_text(encoding="utf-8"))
    variants = [u for item in eco["languageEntryDomains"] for u in item.get("hostVariants", [])]
    for alias in (AT_WWW, AT_APEX, HU_WWW, HU_APEX):
        if alias not in variants:
            raise SystemExit(f"ecosystem.json: missing host variant {alias}")
    audit = (ROOT / "tools/audit-domain-aliases.mjs").read_text(encoding="utf-8")
    for alias in (AT_WWW, AT_APEX, HU_WWW, HU_APEX):
        if alias not in audit:
            raise SystemExit(f"alias audit missing {alias}")


for name in ["entity.jsonld", "entity-graph.json", "knowledge.json"]:
    update_json(name)
update_ecosystem()
for name in ["ai.txt", "llms.txt", "llms-full.txt"]:
    update_text(name)
verify()
print("Domain alias SEO/GEO/schema alignment verified.")
