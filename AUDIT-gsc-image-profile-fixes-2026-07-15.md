# Google Search Console structured-data fixes — 2026-07-15

## Corrected issues

- Image metadata: every `ImageObject.creator` is now an explicit `Person` or `Organization` object and includes `name`.
- ProfilePage metadata: every `dateModified` is now a complete ISO 8601 date-time value with timezone.
- Image licensing metadata: all HTML `ImageObject` entries include `license`, `copyrightNotice`, and `acquireLicensePage`.

## Validation

- HTML files checked: 71
- JSON-LD blocks parsed: 194
- HTML ImageObject nodes checked: 672
- Invalid creator objects: 0
- Missing acquireLicensePage: 0
- Missing license: 0
- Missing copyrightNotice: 0
- Invalid dateModified values: 0
- JSON-LD parse errors: 0
