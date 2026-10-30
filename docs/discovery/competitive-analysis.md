# Competitive Analysis — Tally

> July/2026 research. A condensed version; the full per-app analysis (reviews, pains, prices) in the original benchmark document.

## Market map

| App                   | Origin | Price (useful plan) | Open Finance          | AI               | PJ                  | Family              | Card by statement | Strength                               | Weakness                 |
| --------------------- | ------ | ------------------- | --------------------- | ---------------- | ------------------- | ------------------- | ----------------- | -------------------------------------- | ------------------------ |
| Mobills               | 🇧🇷     | ~R$ 120/year        | ✅ unstable           | Basic            | ❌                  | ❌                  | Partial           | Completeness + brand                   | Unreliable sync          |
| Organizze             | 🇧🇷     | ~R$ 135/year        | ✅ smaller coverage   | Basic            | An account label    | Shared login        | Partial           | Simplicity                             | Low ceiling              |
| Minhas Economias      | 🇧🇷     | Freemium            | ✅                    | ❌               | Account separation  | ❌                  | Partial           | Reliability                            | Dated                    |
| Wallet (BudgetBakers) | 🇨🇿     | ~US$ 20/year        | Aggregators           | Categorization   | ❌                  | Shared              | ❌                | Flexible budgets                       | Sync + data loss         |
| Pierre (CloudWalk)    | 🇧🇷     | R$ 39/month         | ✅ 100+ banks         | ⭐ Multi-agent   | ❌                  | ❌                  | Via OF            | Proactive conversational AI            | Pricey, no PJ, no manual |
| Despezzas             | 🇧🇷     | Freemium            | ✅ unstable for some  | Connected chat   | ❌                  | ❌                  | Yes               | Value for money                        | Unstable OF behind paywall|
| Copilot Money         | 🇺🇸     | US$ 95/year         | Plaid US              | ⭐ Categorization | ❌                  | Weak                | N/A               | Design + swipe review                  | Apple-only, no BR        |
| YNAB                  | 🇺🇸     | US$ 109/year        | Plaid US/EU           | ❌ deliberate    | ❌                  | ✅ 6 people         | N/A               | Methodology + community                | Rigid, doesn't translate to BR |
| Monarch Money         | 🇺🇸     | US$ 100–199/year    | 13k institutions      | Assistant        | Plus tier (new)     | ⭐ Best             | N/A               | Dashboard for couples                  | Price, 7-day trial       |
| LAPI                  | 🇧🇷     | Freemium            | ❌ by design          | Coach + OCR      | ❌                  | ✅ + accountant     | ⭐ Reference      | Privacy + cross-platform               | Manual friction          |
| ZMoney                | 🇧🇷     | Free                | ❌                    | ❌               | ❌                  | ❌                  | ❌                | Price + content                        | No differentiator        |
| Servora               | ❓     | —                   | —                     | —                | —                   | —                   | —                 | **Not identified — awaiting a link**   | —                        |

## The 5 cross-cutting pains of the market

1. **Bank sync that breaks** — pain #1 of Mobills, Wallet and Despezzas; Open Finance is an expectation but nobody delivers it reliably.
2. **Data loss/divergence** — severe cases in Mobills (web ≠ app) and Wallet (corrupted transactions without backup).
3. **Poorly modeled credit card** — accrual vs. cash; only LAPI treats it as a priority. It generates the eternal "the balance doesn't add up".
4. **Paywall over unstable features** — charging for buggy Open Finance generates the worst reviews (Despezzas, Mobills).
5. **Family/couple as a hack** — shared login or an extra charge; Monarch proves the value abroad, in Brazil it's vague.

## Identified empty spaces

- **PF+PJ hybrid**: none of the 12 addresses it. Organizze/Minhas Economias only have "account separation". Pierre (the AI leader) ignores PJ. Cora/MEI Fácil are PJ-only and fiscal.
- **AI with fiscal context**: "having AI" is already a commodity (Pierre, Despezzas, Minhas Finanças, LAPI); AI that understands the DAS, owner's draw and MEI ceiling doesn't exist.
- **Reliability as a brand**: the whole market fails at data integrity.

## Competitors to monitor (quarterly)

- **Pierre/CloudWalk**: if they launch PJ context, they attack our core. InfinitePay is their distribution channel.
- **Cora / MEI Fácil**: if they move down into personal life, they attack from the other side.
- **Monarch**: a Plus tier with small business signals that the hybrid is a global trend.

## Lessons applied to Tally

| Lesson                            | Source                   | Application                                   |
| --------------------------------- | ------------------------ | --------------------------------------------- |
| Entry in seconds retains          | Organizze                | UX requirement #1                             |
| Card by statement is the rare win | LAPI                     | A data model from day 1 (ADR-0005)            |
| Proactive AI > reactive chat      | Pierre                   | Weekly summary + alerts before open chat      |
| Paid = what works best            | Despezzas (anti-example) | OF only when stable                           |
| A short trial generates complaints| Monarch                  | A 30-day trial                                |
| Price increases erode the base    | YNAB                     | Grandfathering of early users                 |
| Delegation to the accountant is gold | LAPI                  | v1.5 roadmap                                  |
| Content = cheap acquisition       | Mobills, ZMoney          | A "finance for PJ" blog/SEO                   |
