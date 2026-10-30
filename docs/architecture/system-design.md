# System Design — Tally MVP

## Requirements

### Functional (from mvp-scope.md)

Transaction entry (form + natural language via AI) · PF/PJ contexts · card by statement · income split with provisions · PJ panel · monthly summary · alerts/weekly summary · CSV export · auth.

### Non-functional

| Requirement                      | Target                                           | Rationale                   |
| -------------------------------- | ------------------------------------------------ | --------------------------- |
| p95 latency (transaction CRUD)   | <300ms                                           | The 10s promise             |
| Availability                     | ≥99.5%                                           | Solo dev; no aggressive SLA |
| Initial scale                    | ~1k users, ~100 req/s peak                       | MVP; don't over-engineer    |
| Data integrity                   | Zero loss; auditable                             | Trust differentiator        |
| Cost                             | <US$ 50/month infra + an AI cap                  | Bootstrapped                |
| Team                             | 1 dev (also a Next/Nest learning goal)           | Simplicity > elegance       |

## High-level view

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (desktop / mobile PWA)                              │
│  Next.js (App Router) — SSR/ISR marketing + authenticated SPA│
└──────────────┬──────────────────────────────────────────────┘
               │ HTTPS (REST/JSON, httpOnly cookies)
┌──────────────▼──────────────────────────────────────────────┐
│  NestJS API (modular monolith)                               │
│  modules: auth · users · households(v2) · contexts ·         │
│  accounts · cards · invoices · transactions · splits ·       │
│  provisions · categories · insights(AI) · exports · jobs     │
└───────┬───────────────────────┬─────────────────┬───────────┘
        │ Prisma                │ BullMQ          │ HTTPS
┌───────▼────────┐     ┌────────▼───────┐  ┌──────▼──────────┐
│  PostgreSQL    │     │  Redis (queues,│  │  LLM API        │
│  (single       │     │  light cache)  │  │  (categorize,   │
│  source of     │     │                │  │  parse, summary)│
│  truth)        │     │                │  │                 │
└────────────────┘     └────────────────┘  └─────────────────┘
```

Key decisions: a modular monolith (not microservices — implicit ADR: a team of 1), REST (not GraphQL: less learning and security surface), a single source of truth on the server (anti-Mobills lesson: no authoritative state on the client).

## Critical flows

### Natural-language entry (F3)

```
1. POST /ai/parse-transaction {text}
2. Nest → LLM (prompt with the user's categories + contexts) → structured JSON
3. Response = PROPOSAL (doesn't persist)
4. User confirms → POST /transactions (normal payload)
5. User corrections become a signal (ai_feedback table) for future few-shot
```

Rules: 5s timeout with a fallback to the form; Zod/class-validator validation of the LLM's JSON (never trust the output); controlled cost: a small model + cache of the user's repeated patterns.

### Income split (F4) — transactional

```
POST /transactions/:id/split {rules}
→ In ONE database transaction (Prisma $transaction):
   1. PJ income (already created)
   2. provision (tax) — status: pending, due_date
   3. reserve transfer (PJ → reserve account)
   4. owner's-draw transfer (PJ context → PF context)
→ Everything references split_id (auditability: click the number → see the origin)
```

### Asynchronous jobs (BullMQ)

- `weekly-summary`: a weekly cron → aggregates the user's month → the LLM generates 3 sentences → email + in-app
- `provision-reminders`: a daily cron → provisions due in 7/1 days → notification
- `invoice-close`: a daily cron → closes statements whose cycle ended
- `anomaly-check` (basic): spend > Nx the category's average → alert
  Rationale for Redis/BullMQ: only for jobs; if it gets heavy early, degrade to a simple cron (@nestjs/schedule) without Redis — a reversible decision.

## API (sketch of the main resources)

```
POST   /auth/register | /auth/login | /auth/refresh
GET    /me
CRUD   /accounts /cards /categories
GET    /cards/:id/invoices · GET /invoices/:id
CRUD   /transactions (?context=PF|PJ&month=)
POST   /transactions/:id/split
CRUD   /provisions · POST /provisions/:id/pay
POST   /ai/parse-transaction
GET    /reports/monthly?month= · GET /reports/pj-panel
GET    /exports/full (CSV/JSON)
```

Conventions: cursor-based pagination on /transactions; an idempotency-key on write POSTs (safe retry on the offline PWA); /v1 versioning from the start.

## PWA / offline (minimum scope)

- Installable (manifest + service worker)
- A local queue (IndexedDB) only for CREATING transactions offline → flush with an idempotency-key
- Offline reads: the last cached snapshot, marked as "stale"
- Out of scope: offline editing, complex conflict resolution (a source of bugs; anti-Wallet lesson)

## Observability

- Structured logs (pino) + request-id
- Sentry (front + API)
- Guardrail metrics: p95 latency, 5xx errors, AI cost/day
- Health checks for deploy

## Deploy (MVP)

- Front: Vercel (native Next)
- API + Postgres + Redis: Railway/Fly/Render (1 region, São Paulo if possible)
- Migrations: Prisma Migrate in CI before the deploy
- Backups: daily Postgres snapshot + a monthly restore test (a ritual, not just config)

## What to revisit when it grows

- Separate the workers from the API (same code, distinct processes)
- Read replicas if reports get heavy
- A dedicated email queue
- Rate limit per plan (today: global per IP+user)
- Multi-region: not before thousands of users
