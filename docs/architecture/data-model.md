# Modelo de Dados — Tally MVP (PostgreSQL + Prisma)

> Convenções: `id` uuid v7 · timestamps `created_at/updated_at` em tudo · dinheiro `bigint` em centavos (ADR-0006) · soft-delete via `deleted_at` onde indicado · todas as tabelas de dados do usuário têm `household_id` (multi-tenant desde o dia 1).

## Tabelas

```sql
households (
  id uuid PK, name text, created_at, updated_at
)

users (
  id uuid PK, household_id FK→households,
  email citext UNIQUE, password_hash text NULL,      -- NULL se OAuth
  google_id text NULL UNIQUE, name text,
  created_at, updated_at
)

contexts (
  id uuid PK, household_id FK, user_id FK,
  kind enum('PF','PJ'), label text,
  UNIQUE(user_id, kind)                               -- MVP: 1 PF + 0..1 PJ
)

fiscal_profiles (
  id uuid PK, context_id FK UNIQUE,                   -- só contexto PJ
  regime enum('MEI','SIMPLES'), simples_annex text NULL,
  effective_tax_bp int,                               -- basis points: 600 = 6%
  reserve_bp int DEFAULT 1500,
  annual_ceiling_cents bigint,                        -- teto MEI
  rules_version text                                  -- FK lógica p/ fiscal_rules
)

fiscal_rules (                                        -- config versionada (reforma!)
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
  closed_total_cents bigint NULL,                     -- congelado no fechamento
  UNIQUE(card_id, cycle_start)
)

categories (
  id uuid PK, household_id FK NULL,                   -- NULL = default de sistema
  context_kind enum('PF','PJ','BOTH'), name text, icon text,
  parent_id FK NULL, deleted_at NULL
)

transactions (
  id uuid PK, household_id FK, context_id FK,
  type enum('income','expense','transfer'),
  amount_cents bigint CHECK != 0,                     -- income +, expense −
  description text, occurred_on date,                 -- competência
  category_id FK NULL,
  account_id FK NULL, invoice_id FK NULL,
  CHECK (num_nonnulls(account_id, invoice_id) = 1),   -- conta XOR fatura
  transfer_id uuid NULL,                              -- liga as 2 pernas
  installment_group_id uuid NULL, installment_no int NULL, installment_of int NULL,
  split_id FK NULL,                                   -- veio de um split?
  created_via enum('form','ai','import','system'),
  idempotency_key text NULL UNIQUE,
  deleted_at NULL
)

splits (
  id uuid PK, household_id FK,
  source_transaction_id FK→transactions,              -- a receita PJ
  tax_bp int, reserve_bp int,
  applied_at timestamptz
)

provisions (
  id uuid PK, household_id FK, context_id FK,
  kind enum('DAS','IR','OTHER'), amount_cents bigint,
  due_date date, status enum('pending','paid','cancelled'),
  split_id FK NULL,
  paid_transaction_id FK NULL                         -- despesa gerada ao pagar
)

invoice_payments (
  id uuid PK, invoice_id FK, transaction_id FK,       -- perna de caixa
  amount_cents bigint
)

insights (
  id uuid PK, household_id FK, user_id FK,
  kind enum('weekly_summary','provision_reminder','anomaly','mei_ceiling'),
  title text, body text, evidence jsonb,              -- ids das transações-fonte
  read_at NULL, created_at
)

ai_feedback (
  id uuid PK, user_id FK,
  input_text text, proposed jsonb, accepted jsonb,    -- correção = sinal
  created_at
)

refresh_tokens (
  id uuid PK, user_id FK, token_hash text, expires_at, revoked_at NULL,
  user_agent text, ip inet
)

audit_log (
  id uuid PK, household_id FK, user_id FK,
  action text, entity text, entity_id uuid, diff jsonb, created_at
)
```

## Índices críticos
```sql
transactions: (household_id, occurred_on DESC), (invoice_id), (context_id, occurred_on),
              (installment_group_id), (category_id)
invoices:     (card_id, status)
provisions:   (household_id, status, due_date)
insights:     (user_id, read_at)
```

## Derivações (nunca armazenar como verdade)
- Saldo de conta = Σ transactions da conta → **view materializada `account_balances`** com refresh no commit de escrita (ou trigger); job diário de reconciliação compara e loga divergência.
- Total da fatura aberta = Σ transactions da invoice; congela em `closed_total_cents` no fechamento (invariante 6: fatura fechada imutável).
- "Comprometido futuro" = provisions pending + parcelas de faturas futuras.

## Regras de migração
- Prisma Migrate; migrations no repositório; nunca editar migration aplicada.
- Toda mudança destrutiva em 2 passos (expand → contract) — mesmo solo, cria o hábito.

## Decisões deliberadas (ver ADRs)
- Centavos em bigint (ADR-0006) · fatura como entidade (ADR-0005) · household desde o dia 1 (v2 barata) · sem Open Finance no schema do MVP — quando vier, entra como `connections` + `imported_transactions` staging sem tocar o core (ADR-0007).
