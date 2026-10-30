# ADR-0006: Money as an integer in cents (bigint)

**Status:** Accepted · **Date:** 2026-07-13

## Context

Float for money produces rounding errors (0.1 + 0.2 ≠ 0.3). In a financial app, a single diverging cent destroys trust (design principle 6).

## Options

- **A: float/double** — rejected (rounding).
- **B: decimal/numeric in the database + Decimal.js** — correct, but Prisma's Decimal types are awkward objects in TS and serialize poorly to JSON.
- **C: integer in cents, bigint (chosen)** — exact native arithmetic; `amount_cents: 500000` = R$ 5,000.00; formatting only at the edge (Intl.NumberFormat).

## Decision

`bigint` cents throughout the backend and API (JSON as a string when it exceeds Number.MAX_SAFE_INTEGER — in practice personal values fit in a number, but the API contract defines a string for safety). Utilities in `@tally/shared/money`: parse, format, proportional split with **the remainder on the last installment** (invariant 5).

## Consequences

- Gets easier: exact equality, tests, reconciliation.
- Gets harder: remembering to convert at the edge (a lint rule forbidding `parseFloat` in a money context).
- Revisit when: multi-currency (v3+): add `currency` + minor units per currency; the integer base remains valid.
