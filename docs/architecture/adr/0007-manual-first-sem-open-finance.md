# ADR-0007: Manual-first — no Open Finance in the MVP

**Status:** Accepted · **Date:** 2026-07-13

## Context

Open Finance is a market expectation (40M+ consents in Brazil), but the benchmark shows: (1) it is the biggest source of negative reviews for competitors (unstable sync, duplicates); (2) charging for an unstable feature generates the worst ratings; (3) aggregators charge per connection — heavy pre-revenue; (4) sustaining connections requires a team that doesn't exist (solo dev). In tension: manual-entry friction is the biggest cause of abandonment in the category (hypothesis H3 addresses this).

## Options

### A: Open Finance in the MVP

**Pros:** lower friction; expectation parity. **Cons:** fixed pre-revenue cost; regulatory/technical complexity; inheriting the market's pain #1 with no capacity to sustain it; delays the launch by months.

### B: Manual-first with AI + import (chosen)

Entry <10s + natural language (AI) in the MVP; CSV/OFX import in v1.5; Open Finance in v2+ when there's revenue and evidence.
**Pros:** ships fast; truly tests H3 and H4; the schema already anticipates OF arriving without a retrofit (a staging `imported_transactions`).
**Cons:** real churn risk from friction (H3); an unfavorable comparison with Pierre on automation.

## Decision

Option B. The beta measures H3 explicitly: if churn cites typing friction as reason #1, bringing OF forward becomes top priority (a documented trigger in assumptions.md).

## Consequences

- Gets easier: shipping, controlling cost, perceived quality.
- Gets harder: acquiring those who already expect automatic connection (the landing message should anchor on the split, not on tracking).
- Revisit when: H3 is invalidated OR revenue ≥ the projected aggregator cost × 3.
