# Security Policy — Progetto Gestione Corsi ITS

> Scopo: fornire regole, pratiche e configurazioni consigliate per proteggere l'applicazione (backend Flask + PyMongo + Pydantic, frontend React + MUI) durante sviluppo, test e produzione.

---

## 1. Ambito
Questa policy copre:
- codice backend (Flask + PyMongo + Pydantic)
- codice frontend (React/TypeScript)
- infrastruttura (DB Mongo, server, CI/CD)
- pipeline di build e deployment
- processi di sviluppo e gestione segreti

Si applica a tutti i contributori del repo e ai deploy target.

---

## 2. Principi generali
- **Least privilege**: ogni componente e utente ha solo i permessi strettamente necessari.  
- **Defense in depth**: più livelli di protezione (network, app, DB, client).  
- **Fail secure**: in caso di errore non esporre dati sensibili.  
- **Single source of truth per segreti**: non committare mai segreti su Git.  
- **Validazione sempre**: validare e sanificare input lato server (e lato client come UX).  
- **Logging sicuro**: log strutturati, senza PII né segreti.

---

## 3. Gestione credenziali & segreti
- Non inserire in repo: password, connection strings, chiavi API, certificati.  
- Usare variabili d'ambiente o secret manager (HashiCorp Vault, AWS Secrets Manager, Azure KeyVault, GCP Secret Manager).  
- Rotazione regolare delle credenziali (policy temporale, es. 90 giorni).  
- Accesso minimo al DB: creare utenti DB con permessi `readWrite` solo sulle collezioni necessarie; evitare account admin per l'app.  
- Evitare `mongodb://user:pass@host` hard-coded. Preferire: `MONGODB_URI` in env.

---

## 4. Autenticazione e autorizzazione
### Autenticazione
- Preferire JWT con:
  - `access_token` a breve durata (es. 15min)
  - `refresh_token` a durata più lunga memorizzato in **httpOnly, Secure, SameSite=strict** cookie
  - firma con alg sicuro (es. HS256 o RS256). Se possibile usare RS256 e gestione chiavi pubbliche/private.
- Alternativa: sessione server-side con cookie sicuro (`Secure`, `HttpOnly`, `SameSite=Lax/Strict`).
- Password: usare hashing forte (bcrypt/argon2), salting integrato, policy di complessità minima.
- Login lockout/ratelimit su tentativi falliti.
- MFA per account amministrativi.

### Autorizzazione
- RBAC o ABAC per risorse sensibili (admin, teacher, student).
- In ogni endpoint verificare sia l’identità che i permessi (principio "never trust client").
- Deny-by-default: accesso negato se non esplicitamente permesso.

---

## 5. API Security
- Tutte le API devono essere disponibili solo tramite HTTPS (TLS >= 1.2).  
- Abilitare HSTS (es. `Strict-Transport-Security: max-age=31536000; includeSubDomains`).  
- Introdurre Rate Limiting (es. `flask-limiter`) per prevenire abuso (IP-based, user-based).  
- Input validation: usare **Pydantic** per validazione schema/typing in tutte le route; rifiutare payload non validi (400).  
- Usare prepared/parameterized queries / pipeline Mongo per evitare injection; sanificare campi usati come `$where` o operatori.  
- Filtrare e validare ObjectId: convertire string -> `ObjectId` in un helper centralizzato e catturare errori.  
- Proteggere controller che modificano dati con CSRF token o usare cookie SameSite + token in header.

---

## 6. Frontend security
- Non memorizzare token accessibili via JavaScript (preferire HttpOnly cookies).  
- Evitare salvare segreti nel localStorage.  
- Content Security Policy (CSP) per limitare fonti di script, style e media. Esempio base:
- Content-Security-Policy:
- default-src 'self';
- script-src 'self' [https://cdn.jsdelivr.net](https://cdn.jsdelivr.net);
- style-src 'self' 'unsafe-inline' [https://fonts.googleapis.com](https://fonts.googleapis.com);
- img-src 'self' data:;
- font-src 'self' [https://fonts.gstatic.com](https://fonts.gstatic.com);
- Proteggere contro XSS: usare librerie che escano HTML, evitare `dangerouslySetInnerHTML` o sanificare in modo robusto (DOMPurify).  
- Gestire correttamente CORS: in produzione permettere solo origini autorizzate, non `*`. In sviluppo usare proxy.  
- HTTP security headers (via server):
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Permissions-Policy` per funzioni browser

---

## 7. Database (MongoDB) hardening
- Abilitare autenticazione su MongoDB e usare utenti con privilegi minimi.  
- Disabilitare accesso remoto non necessario; bind IP o usare VPC.  
- Abilitare TLS tra app e DB.  
- Impostare auditing se disponibile per azioni CRUD critiche.  
- Creare indici per query critiche ma attenzione a informazioni sensibili negli indici.  
- Eseguire backup regolari e verificare procedure di restore.

---

## 8. Protezione contro vulnerabilità comuni
- **Injection**: validazione Pydantic, evitare costruzione dinamica di query con input non provato.  
- **XSS**: escape output e CSP.  
- **CSRF**: usare token CSRF o cookie SameSite + header-bound token.  
- **Broken Auth**: JWT short TTL, revoca refresh token, session invalidation su logout.  
- **Sensitive Data Exposure**: criptare dati sensibili a riposo (se richiesto, es. PII), trasmissione solo via TLS.  
- **Insecure deserialization**: non usare pickle per dati provenienti dal client.  
- Fare riferimento a OWASP Top 10 come checklist periodica.

---

## 9. Logging, monitoring e auditing
- Logare eventi di sicurezza: login/logout, accesso negato, operazioni CRUD critiche, errori server.  
- Redigere logs strutturati (JSON) e non contenere PII né segreti.  
- Conservazione log con retention policy (es. 90 giorni) e accesso limitato.  
- Integrate alerting (Sentry, Prometheus + Alertmanager) per errori e anomali.  
- Abilitare healthchecks e metriche per uptime.

---

## 10. CI/CD e gestione dipendenze
- Scansione dipendenze automatiche in pipeline (safety, pip-audit, GitHub Dependabot).  
- SAST/DAST (es. bandit, semgrep, OWASP ZAP) in pipeline: fail build su vulnerabilità critiche.  
- Non esporre variabili d’ambiente sensibili nei log di CI.  
- Build reproducible e artefatti firmati se necessario.  
- Accesso ai deploy privilegiato e gestito da account dedicati.

---

## 11. Testing di sicurezza
- Testare regolarmente con:
- Unit tests + integration tests
- Penetration testing (annuale o prima di major release)
- DAST scan (OWASP ZAP)
- Fuzzing input critici
- Testare la gestione ObjectId e validazioni Pydantic esplicitamente.

---

## 12. Backup & Disaster Recovery
- Backup automatici delle collezioni critiche (giornaliero, settimanale).  
- Procedure di restore testate periodicamente.  
- Conservazione backup off-site o in storage separato (retention policy + encryption at rest).

---

## 13. Incident response
- Definire playbook:  
1. Identificazione & categorizzazione incidente  
2. Contenimento (isolare servizi compromessi)  
3. Eradicazione (remediation)  
4. Recovery (restore da backup)  
5. Post-mortem & miglioramenti  
- Contatti d’emergenza e responsabilità chiare (owner, comms, legal).  
- Conservare timeline eventi e log immutabili per investigazioni.

---

## 14. Privacy & compliance
- Redigere elenco dati PII e definire come vengono trattati (minimizzazione dati).  
- Conformità GDPR: registro dei trattamenti, base legale, Diritti interessati.  
- Conservare solo i dati necessari e per il tempo necessario.

---

## 15. Checklist rapida per PR / release
- [ ] Nessun segreto committato
- [ ] Dipendenze aggiornate e scan passati
- [ ] Test automatici verdi (unit/integration)
- [ ] SAST/DAST eseguiti (no blockers)
- [ ] Revisione codice (2 reviewers per cambi critici)
- [ ] Configurazioni di produzione (TLS, HSTS, CORS) verificate

---

## 16. Esempi pratici (config snippet)

### Flask — sicurezza headers (es. Flask-Talisman)
```py
from flask_talisman import Talisman
talisman = Talisman(
  app,
  content_security_policy={
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
  },
  force_https=True,
  strict_transport_security=True,
)
```
