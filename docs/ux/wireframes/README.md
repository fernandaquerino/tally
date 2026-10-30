# Wireframes — Tally MVP

> Tool: Figma (project link: _to add_). This directory holds PNG/PDF exports of the stable versions + decision notes.

## MVP screen inventory (checklist)

### Entry flow

- [ ] Landing page (pain: "Billed well. Why is there nothing left?")
- [ ] Sign up / login
- [ ] Onboarding — CNPJ question (MEI/Simples/no)
- [ ] Onboarding — bracket + reserve %

### Core

- [ ] Home (3 numbers: PJ result · personal available · committed) — desktop and mobile
- [ ] Quick-entry modal (F2)
- [ ] AI entry field/flow with a confirmation card (F3)
- [ ] **Income split screen (F4)** ⭐ — the most important screen in the product; prototype first and test (H4)
- [ ] Transaction list with a PF/PJ filter and search

### Card

- [ ] Card list
- [ ] The card screen = a statement list
- [ ] Statement detail (the cycle's transactions, installments, PF vs PJ, status)

### PJ

- [ ] PJ panel (revenue, provisioned, available, MEI ceiling with a bar)
- [ ] Provisions (list + mark as paid)

### Closing and data

- [ ] Monthly summary / close the month (F7)
- [ ] Settings (fiscal regime, split %, categories)
- [ ] Data export

### States

- [ ] Empty home (a tutorial with sample data)
- [ ] AI error (degradation to a form)
- [ ] Offline (PWA, sync queue)

## Export naming convention

`NN-screen-name--vX.png` (e.g. `04-split-recebimento--v2.png`)

## Prototyping order (for the H4 test)

1. Income split → 2. Home → 3. Quick entry → 4. Card statement → the rest
