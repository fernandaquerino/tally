# Domain Model — Tally

> Ubiquitous language + business rules. The data model (tables) is in `data-model.md`.

## Core concepts

### Context — the heart of Tally

All money belongs to a context: **PF** (personal) or **PJ** (company). A user has 1 PF context and 0..1 PJ context in the MVP (multi-CNPJ is for later).

- The PJ context carries the **FiscalProfile**: regime (MEI | SIMPLES), bracket, effective rate, annual ceiling.
- Rule: rates/ceilings are **versioned configuration** (a `fiscal_rules` table with validity), never hardcoded — the tax reform will change this.

### Account

Where money sits: checking account, wallet, **reserve**. Belongs to a context. Has a derived balance (never stored as truth — always recomputable from transactions; a materialized snapshot only as an invalidatable cache).

### Card and Invoice — ADR-0005

- A card is NOT an account. A card purchase doesn't move an account's balance.
- A card has a `closing_day` and a `due_day`. An invoice = a grouping of transactions by cycle (accrual).
- A card can receive PF **and** PJ purchases (a mixed card) — the context lives on the transaction, not on the card.
- **Paying the invoice** = an account transaction (cash) linked to the invoice.
- Installments: an N-installment purchase generates N transactions, one per future invoice, linked by `installment_group_id`.
- Invoice states: `open → closed → paid` (partial allowed: `partially_paid`).

### Transaction

An atomic financial event. Always has: amount (cents, ADR-0006), context, category, accrual date, and **either** an account **or** an invoice (never both).
Types: `income` | `expense` | `transfer` (a pair of legs linked by `transfer_id`).

### Split (income splitter) — the differentiator

Applied to PJ income. Generates, in an atomic transaction:

1. A tax **Provision** (a future commitment, not an expense yet)
2. A transfer to the reserve account
3. **Owner's draw**: a special **PJ → PF** transfer (the only bridge between contexts)
   Rules: percentages come from the FiscalProfile + preferences; the user can adjust per income; everything references the `split_id` (auditability).

### Provision

Money committed to a certain destination (DAS, IR). States: `pending → paid` (becomes a realized PJ expense) or `cancelled`. Feeds the home's "future committed" number and the reminders.

### Category

Per context (PJ categories ≠ PF), with system defaults + custom ones. Soft-delete only (historical transactions point to it).

### Insight / Alert (AI)

AI v1 output: `weekly_summary`, `provision_reminder`, `anomaly`, `mei_ceiling`. Always with the evidence payload (the transactions that generated it) — the "numbers that add up" principle.

### Household (v2 — model early, implement later)

Groups users (a family). In the MVP: every user has a 1-person household. The cost of creating the entity now: low. The cost of a multi-tenant retrofit later: high. Every query already filters by household_id.

## Invariants (mandatory tests)

1. The sum of a transfer's legs = 0.
2. A transaction has an account XOR an invoice.
3. The owner's draw is the only PF←PJ flow; there's no PF→PJ in the MVP (a capital contribution is for later).
4. Account balance = Σ the account's transactions (a verifiable property; a daily reconciliation job logs divergence as an incident).
5. Σ of an installment_group's installments = the purchase's total amount (cents: the remainder on the last installment).
6. A closed invoice is immutable (corrections = an adjustment transaction, never an edit).
7. A paid provision generates exactly 1 linked expense.

## Glossary (the product's language)

> UI copy in the right column is kept in Brazilian Portuguese (product's displayed text).

| Technical term | How the product says it |
| -------------- | ----------------------- |
| Owner's draw   | "Seu salário"           |
| Provision      | "Separado para imposto" |
| Accrual        | "Mês da compra"         |
| Cash           | "Quando o dinheiro sai" |
| Context        | "Pessoal / Empresa"     |
