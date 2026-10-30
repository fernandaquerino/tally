# Data Model — Tally MVP (PostgreSQL + Prisma)

> Conventions: `id` uuid v7 · `created_at/updated_at` timestamps on everything · money as `bigint` in cents (ADR-0006) · soft-delete via `deleted_at` where indicated · all user-data tables have `household_id` (multi-tenant from day 1).

## Tables

```sql
households (
  id uuid PK, name text, created_at, updated_at
)

users (
  id uuid PK, household_id FK→households,
  email citext UNIQUE, password_hash text NULL,      -- NULL if OAuth
  google_id text NULL UNIQUE, github_id text NULL UNIQUE, name text,
  created_at, updated_at
)

contexts (
  id uuid PK, household_id FK, user_id FK,
  kind enum('PF','PJ'), label text,
  UNIQUE(user_id, kind)                               -- MVP: 1 PF + 0..1 PJ
)

fiscal_profiles (
  id uuid PK, context_id FK UNIQUE,                   -- PJ context only
  regime enum('MEI','SIMPLES'), simples_annex text NULL,
  effective_tax_bp int,                               -- basis points: 600 = 6%
  reserve_bp int DEFAULT 1500,
  annual_ceiling_cents bigint,                        -- MEI ceiling
  rules_version text                                  -- logical FK to fiscal_rules
)

fiscal_rules (                                        -- versioned config (the reform!)
  id uuid PK, regime text, version text,
  valid_from date, valid_to date NULL, payload jsonb
)

accounts (
  id uuid PK, household_id FK, context_id FK,
  name text, kind enum('checking','wallet','reserve'),
  archived_at timestamptz NULL
)

cards (
  id uuid PK, household_id FK,
  name text, closing_day int CHECK 1..28, due_day int CHECK 1..28,
  limit_cents bigint NULL, default_context_id FK NULL,
  archived_at NULL
)

invoices (
  id uuid PK, card_id FK,
  cycle_start date, cycle_end date, due_date date,
  status enum('open','closed','partially_paid','paid'),
  closed_total_cents bigint NULL,                     -- frozen at closing
  UNIQUE(card_id, cycle_start)
)

categories (
  id uuid PK, household_id FK NULL,                   -- NULL = system default
  context_kind enum('PF','PJ','BOTH'), name text, icon text,
  parent_id FK NULL, deleted_at NULL
)

transactions (
  id uuid PK, household_id FK, context_id FK,
  type enum('income','expense','transfer'),
  amount_cents bigint CHECK != 0,                     -- income +, expense −
  description text, occurred_on date,                 -- accrual
  category_id FK NULL,
  account_id FK NULL, invoice_id FK NULL,
  CHECK (num_nonnulls(account_id, invoice_id) = 1),   -- account XOR invoice
  transfer_id uuid NULL,                              -- links the 2 legs
  installment_group_id uuid NULL, installment_no int NULL, installment_of int NULL,
  split_id FK NULL,                                   -- came from a split?
  created_via enum('form','ai','import','system'),
  idempotency_key text NULL UNIQUE,
  deleted_at NULL
)

splits (
  id uuid PK, household_id FK,
  source_transaction_id FK→transactions,              -- the PJ income
  tax_bp int, reserve_bp int,
  applied_at timestamptz
)

provisions (
  id uuid PK, household_id FK, context_id FK,
  kind enum('DAS','IR','OTHER'), amount_cents bigint,
  due_date date, status enum('pending','paid','cancelled'),
  split_id FK NULL,
  paid_transaction_id FK NULL                         -- expense generated on payment
)

invoice_payments (
  id uuid PK, invoice_id FK, transaction_id FK,       -- cash leg
  amount_cents bigint
)

insights (
  id uuid PK, household_id FK, user_id FK,
  kind enum('weekly_summary','provision_reminder','anomaly','mei_ceiling'),
  title text, body text, evidence jsonb,              -- ids of the source transactions
  read_at NULL, created_at
)

ai_feedback (
  id uuid PK, user_id FK,
  input_text text, proposed jsonb, accepted jsonb,    -- correction = signal
  created_at
)

refresh_tokens (
  id uuid PK, user_id FK, family_id uuid, token_hash text UNIQUE,
  expires_at, revoked_at NULL, replaced_by_id uuid NULL,   -- rotation + reuse detection (ADR-0008)
  user_agent text, ip text
)

audit_log (
  id uuid PK, household_id FK, user_id FK,
  action text, entity text, entity_id uuid, diff jsonb, created_at
)
```

## Critical indexes

```sql
transactions: (household_id, occurred_on DESC), (invoice_id), (context_id, occurred_on),
              (installment_group_id), (category_id)
invoices:     (card_id, status)
provisions:   (household_id, status, due_date)
insights:     (user_id, read_at)
```

## Derivations (never store as truth)

- Account balance = Σ the account's transactions → a **materialized view `account_balances`** refreshed on a write commit (or a trigger); a daily reconciliation job compares and logs divergence.
- Open invoice total = Σ the invoice's transactions; frozen in `closed_total_cents` at closing (invariant 6: a closed invoice is immutable).
- "Future committed" = pending provisions + installments of future invoices.

## Migration rules

- Prisma Migrate; migrations in the repository; never edit an applied migration.
- Every destructive change in 2 steps (expand → contract) — even solo, it builds the habit.

## Deliberate decisions (see the ADRs)

- Cents in bigint (ADR-0006) · the invoice as an entity (ADR-0005) · household from day 1 (a cheap v2) · no Open Finance in the MVP schema — when it comes, it enters as a `connections` + `imported_transactions` staging without touching the core (ADR-0007).
