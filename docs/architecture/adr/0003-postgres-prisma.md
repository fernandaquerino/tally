# ADR-0003: PostgreSQL + Prisma

**Status:** Accepted · **Date:** 2026-07-13

## Context

Financial data requires ACID transactions (the split atomically creates 3-4 records — domain-model invariants), referential integrity and relational queries (statement ⇄ transactions ⇄ context).

## Options considered

### A: PostgreSQL + Prisma (chosen)

**Pros:** ACID; constraints (CHECKs of the invariants) in the database; Prisma = excellent DX for a solo dev, versioned migrations, generated types; a mature Nest ecosystem; jsonb covers flexible payloads (fiscal_rules, evidence).
**Cons:** Prisma abstracts advanced SQL (can be mitigated with views/parameterized raw SQL when needed).

### B: MongoDB

**Decisive cons:** worse multi-document transactions; no native FKs/CHECKs; relational modeling (statement/installments/split) becomes application code. Rejected.

### C: Postgres + TypeORM/Drizzle

TypeORM: irregular maintenance. Drizzle: great, but Prisma has a smaller learning curve and better docs for the learning goal. A reversible choice (it's only the access layer).

## Decision

PostgreSQL 16 with Prisma. Critical invariants duplicated as database constraints (not only in the application).

## Consequences

- Gets easier: split atomicity, reconciliation, migrations.
- Gets harder: nothing relevant in the MVP.
- Revisit when: reports get heavy (read replica / materialized views — already anticipated in data-model).
