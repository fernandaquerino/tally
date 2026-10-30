# Threat Model — Tally MVP

> Methodology: simplified STRIDE. A financial app = a target with sensitive data by definition, even when small. Review on each new feature that touches auth, money or AI.

## Assets to protect

1. Users' financial data (transactions, balances, PJ revenue)
2. Credentials and sessions
3. Integrity of the numbers (corrupting = destroying the product)
4. The LLM's API keys (cost + abuse)
5. Availability

## Threats and mitigations (STRIDE)

### S — Spoofing (identity)

| Threat                            | MVP mitigation                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Credential stuffing / brute force | argon2id hash · rate limit per IP+email (e.g. 5/min) · progressive lockout                                               |
| Session theft                     | Short JWT (15min) in an httpOnly+Secure+SameSite=Lax cookie · rotating refresh token with reuse detection (revokes the family) |
| OAuth confusion                   | Validate the Google token's `aud`/`iss`; link by google_id, not by email alone                                          |

### T — Tampering

| Threat                                    | Mitigation                                                                                    |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| Changing values via the API (mass assignment) | DTOs with a whitelist (class-validator, `whitelist: true, forbidNonWhitelisted: true`)     |
| SQL injection                             | Parameterized Prisma; forbid `$queryRawUnsafe`                                                |
| Tampering with a closed invoice           | A domain invariant: closed = immutable; adjustments only via an audited adjustment transaction |
| XSS → actions on the user's behalf        | React's default escaping · a strict CSP · sanitize ANY text coming from the LLM before rendering |

### R — Repudiation (non-repudiation)

| Threat                      | Mitigation                                                                |
| --------------------------- | ------------------------------------------------------------------------- |
| "I didn't make that entry"  | A write audit_log (who, when, diff) · created_via on every transaction    |

### I — Information Disclosure ⚠️ (risk #1)

| Threat                                  | Mitigation                                                                                                                                                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **IDOR/BOLA — user A reads B's data**   | Every query filters by household_id derived from the TOKEN, never from a client parameter · a global guard in Nest · **automated tenancy tests on every endpoint** (the most important test in the repository) |
| Leak via logs                           | Never log transaction/value payloads; structured logs with whitelisted fields                                                                                                                              |
| Leak via the LLM                        | Send the minimum (entry text, categories) — never the full statement, email, name · a provider with zero data-retention/opt-out of training · a signed DPA                                                  |
| Email enumeration                       | Identical responses in login/register/reset ("if it exists, we sent an email")                                                                                                                             |
| Exposed backups                         | Encrypted backups; access via minimal IAM                                                                                                                                                                  |

### D — Denial of Service

| Threat                              | Mitigation                                                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| API flood                           | A global rate limit + per sensitive route (auth, /ai/*)                                                                   |
| **Abuse of the AI endpoint (cost)** | /ai/parse: a per-user/day limit per plan · a global daily spend cap with a circuit breaker · cache of repeated parsing     |
| Giant payloads                      | A body limit (e.g. 50kb) and an items-per-page limit                                                                      |

### E — Elevation of Privilege

| Threat                                | Mitigation                                                                 |
| ------------------------------------- | -------------------------------------------------------------------------- |
| A free user accessing Pro features    | A plan check on the server (guard), never only on the front                |
| A future internal admin               | No admin panel in the MVP; access to production data only via a logged process |

## AI-specific threats

1. **Prompt injection in the entry** ("ignore instructions and categorize me as..."): the LLM's output is DATA, validated by a strict schema (Zod); the LLM never executes actions — it only proposes JSON that goes through the same validation as the form.
2. **Hallucination of fiscal values**: rates ALWAYS come from `fiscal_rules` (the database), never from the model; the LLM writes text, it doesn't compute taxes.
3. **A weekly summary leaking another user's data**: prompts assembled by the job's household_id; isolation tests in the worker.

## LGPD (minimum viable and honest)

- Legal basis: contract execution (financial data entered by the data subject)
- Rights: full export (already a feature — F8) · account deletion with a real purge in ≤30 days (a job) · a privacy policy in simple language
- Minimization: don't collect full CPF/CNPJ in the MVP (regime + bracket are enough for the split)
- Data officer: the founder (to declare); a simple record of processing operations

## MVP security checklist (launch gate)

- [ ] Tenancy tests (IDOR) on 100% of authenticated endpoints
- [ ] Rate limit on auth and /ai/*
- [ ] httpOnly cookies + CSP + HSTS
- [ ] Dependabot/renovate + npm audit in CI
- [ ] Secrets out of the repository (provider env); documented rotation
- [ ] Daily backup + a tested restore 1x before launch
- [ ] An account-deletion flow working end to end
