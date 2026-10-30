# ADR-0005: Credit card modeled by statement (accrual vs. cash)

**Status:** Accepted · **Date:** 2026-07-13

## Context

The benchmark showed that "the balance doesn't add up" due to a poorly modeled card is a chronic pain of the category (reviews of Mobills, Organizze; LAPI makes it a differentiator). In Brazil, installment purchases in N× are the dominant mental model. Refactoring this modeling later is extremely expensive — the decision needs to be born right.

## Options

### A: Card as an account with a negative balance (the category's common mistake)

**Pros:** simple to implement. **Cons:** mixes accrual and cash; future installments become a hack; the balance "lies" — exactly the market's pain #3. Rejected.

### B: Statement as a grouping entity (chosen)

A card purchase → goes into the cycle's statement (accrual). A statement payment → an account transaction (cash). Installments = N transactions across N future statements (`installment_group_id`). A closed statement is immutable.
**Pros:** numbers that add up; a correct future-commitment projection; a mixed PF/PJ card is possible (context on the transaction).
**Cons:** more entities and rules (closing, states, partial payment); closing jobs.

## Decision

Option B, with domain-model invariants 2, 5 and 6 as mandatory tests and a daily cycle-closing job.

## Consequences

- Gets easier: user trust; "future committed" on the home; a correct PF/PJ report on a mixed card.
- Gets harder: the initial implementation (~the most complex MVP feature after the split).
- Revisit when: never — it's foundational.
