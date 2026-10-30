# Success Metrics — Tally

## North Star

**Users who close the month knowing their "real available"** = in the month, used the splitter on ≥1 income **and** viewed the monthly summary.
Why: it captures the core value (PF/PJ clarity), correlates with retention and precedes conversion.

## Metrics tree

### Acquisition

- Visitors → sign up (initial target: ≥3% of the landing)
- Cost per sign up per channel (content/SEO vs. communities vs. paid)
- % of sign ups who identify as MEI/PJ in onboarding (beachhead purity — target ≥70%)

### Activation (first 7 days)

- **A1:** recorded 5+ transactions — target ≥50%
- **A2:** configured the PJ context (regime) — target ≥60% of those who declared PJ
- **A3 (AHA):** used the splitter on the 1st PJ income — target ≥40%
- Time to the first entry (target: <5 min from sign up)

### Retention

- Week 4 active: ≥25% (category median ~30% at 100 days — target to hit)
- Consecutive months with a "closed month" (recurring North Star)
- % of transactions via AI vs. form (a friction proxy; healthy: AI growing)

### Revenue

- Free→Pro conversion in the 1st cycle: ≥5%
- Monthly Pro churn: <5%
- MRR (track, no target in the MVP)

### Quality / trust

- Data integrity complaints: **zero tolerance** (each case = an incident)
- AI categorization accuracy (acceptance without correction): ≥80% after 1 month of use
- Quarterly NPS (reference: >40 good for the category)
- AI cost per active user/month: a cap defined before the beta (guardrail T3)

## Guardrails (metrics that must NOT get worse)

- p95 latency of manual entry < 300ms (the 10s promise dies if the API is slow)
- API uptime ≥ 99.5%
- Full data export time < 1 min (trust)

## Instrumentation (MVP)

- Minimum events: signup, onboarding_step, transaction_created (props: via_ai, context, type), split_applied, invoice_viewed, weekly_summary_opened, export_csv, upgrade
- Tool: PostHog (self-host or free cloud tier) — decided in a future ADR
- Dashboards: activation (weekly), cohort retention (monthly), conversion funnel

## Ritual

- Weekly review: activation + guardrails
- Monthly review: retention cohorts + North Star + AI cost
