# MVP Scope — Tally (web-first)

## Cutting principle

MVP = the smallest slice that delivers Rafael's AHA moment: **"for the first time I know how much of my revenue is mine"**. Everything that doesn't serve that moment is cut.

## Platform decision

**Responsive web app (Next.js) — no mobile app in the MVP.** Rationale and trade-offs in ADR-0001. Scope implications:

- A mobile experience via **a polished responsive layout + PWA** (installable, a home-screen icon) — daily logging happens on the phone
- Keyboard shortcuts and information density on desktop (the web advantage: reports, closed month, accountant view)

## ✅ Within the MVP

### 1. Entry foundation

- [ ] Income/expense entry in <10s (smart defaults, last-used category, a keyboard shortcut on desktop)
- [ ] Natural-language entry via AI ("lunch with client 45 reais, company")
- [ ] 1-click PF/PJ toggle on any transaction
- [ ] Recurrences and installments (12x is the Brazilian mental model)
- [ ] Default + custom categories, per PF/PJ context

### 2. Credit card modeled correctly (ADR-0005)

- [ ] A statement as a grouping; accrual vs. cash; closing and due date
- [ ] Future installments projected in the correct statements
- [ ] A mixed card (PF and PJ purchases) with separation in reports

### 3. The PJ heart (the differentiator)

- [ ] Regime registration (MEI / Simples with a bracket) → basic rates as versioned configuration
- [ ] **Income splitter**: on each PJ income, a suggested tax/reserve/owner's-draw split (configurable percentages)
- [ ] A DAS/tax provision with a due-date reminder
- [ ] Owner's draw as the PJ→PF bridge
- [ ] PJ panel: the month's revenue, provisioned, available, MEI ceiling alert

### 4. AI v1 (lean and proactive)

- [ ] Natural-language parsing for entry
- [ ] Automatic categorization that learns from corrections
- [ ] A proactive weekly summary (3 sentences, email + in-app)
- [ ] Alerts: provision due date, spending outside the pattern, spending pace vs. the month
- ❌ Out of AI v1: unlimited open chat, customizable agents

### 5. Unified monthly view

- [ ] Home with 3 numbers: PJ result · personal available · future committed
- [ ] A monthly report by category with a PF/PJ/all filter
- [ ] CSV export (trust + accountant)

### 6. Reliability foundation (invisible, non-negotiable)

- [ ] The API as the single source of truth (no divergent client/server state — anti-Mobills lesson)
- [ ] Automatic backup + a full export by the user
- [ ] Secure auth (see threat-model.md)

## ❌ Out of the MVP

| Feature                  | Rationale                                                                  | Destination            |
| ------------------------ | -------------------------------------------------------------------------- | ---------------------- |
| Native mobile app        | Web-first (ADR-0001); the PWA covers logging on the phone                  | v2                     |
| Open Finance             | Unstable in the market, expensive, a paywall over an unstable feature = the worst reviews | v2+ (ADR-0007)         |
| Family account           | Permission complexity; Rafael doesn't need it for the AHA                  | v2 — an upgrade reason  |
| Debt module              | Tertiary persona; the MVP shows debts as committed                        | v2–3                   |
| Long financial plan      | The MVP delivers the month's plan; the life plan comes after the habit    | v2                     |
| Open AI chat / agents    | High cost; Pierre territory — enter later with a context advantage         | v1.5 (limited in Pro)  |
| In-app invoice / DAS     | Cora/MEI Fácil territory; regulatory                                      | A partnership, maybe never |
| Investments             | A manual balance is enough                                                 | v3 / a partnership     |
| Receipt OCR              | Natural language solves 80%                                                | v1.5                   |

## Monetization — [HYPOTHESIS H2]

- **Free:** unlimited entry, 1 PJ context, 1 card, monthly report, entry AI
- **Tally Pro (R$ 14.90–19.90/month):** automatic splitter, proactive alerts, AI weekly summary, multiple cards/accounts, exports
- A 30-day trial · grandfathering for early users

## Success criteria (90 days)

- Activation: ≥50% record 5+ transactions in the 1st week
- AHA: ≥40% use the splitter on the first PJ income
- W4 retention: ≥25%
- Free→paid conversion: ≥5%
- Qualitative: users describe Tally as "the app for people who are PJ"
