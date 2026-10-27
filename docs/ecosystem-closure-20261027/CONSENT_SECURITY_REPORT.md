# CONSENT_SECURITY_REPORT

Generálva: 2026-10-27T09:34:57+01:00 Europe/Budapest

## Státusz: PRODUCTION-ELLENŐRZÖTT (nincs új consent rendszer ebben a körben)

### Controllable first-party
- Analytics ne induljon consent előtt — PASS (prior settle)
- deny / accept / revoke — PASS
- first-party `_ga*` cleanup — controllable

### Third-party platform limitation
- Clarity / Bing domain cookie teljes törlését ne követeljük, ha a böngésző/platform nem engedi
- Residual 3P ≠ active first-party tracking after deny/revoke

Nincs consent regresszió a schema/docs closure során.
