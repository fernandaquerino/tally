# Assumptions and Hypotheses — Tally

> Every relevant product decision rests on an assumption. If the assumption falls, the decision is revisited.

## Product hypotheses (testable)

| ID  | Hypothesis                                                               | Test                                | Invalidation criterion                  | Status         |
| --- | ------------------------------------------------------------------------ | ----------------------------------- | --------------------------------------- | -------------- |
| H1  | The PJ hybrid feels the PF/PJ pain intensely enough to switch tools      | 10–12 interviews                    | <60% report the pain spontaneously      | 🔴 not tested  |
| H2  | They pay R$ 15–30/month                                                  | Interviews + a landing with a price | The dominant anchor = "free only"       | 🔴 not tested  |
| H3  | Excellent manual entry + AI sustains use without Open Finance            | Beta; W4 retention + churn reason   | Churn cites typing friction as #1       | 🔴 not tested  |
| H4  | The income splitter is the AHA moment                                    | Prototype test                      | A generalized lukewarm reaction         | 🔴 not tested  |
| H5  | The family account is an upgrade reason, not an acquisition one          | Interviews + waitlist ranking       | Family appears as pain #1               | 🔴 not tested  |
| H6  | Proactive AI (warns) > chat AI (answers)                                 | A/B in the beta                     | Higher use/retention in the chat group  | 🔴 not tested  |

## Business assumptions

- P1: The market of "one-person" PJs (MEI + single-owner Simples) is large enough (millions of active CNPJs) and growing with "pejotização". **Risk: low.**
- P2: Pierre/CloudWalk won't launch PJ context in the next ~12 months. **Risk: medium — monitor quarterly.**
- P3: Basic MEI/Simples rules remain stable enough during the tax reform transition. **Mitigation: rules as versioned configuration, not hardcode (see domain-model).**

## Technical assumptions

- T1: Next.js + NestJS give enough speed for a solo dev to ship the MVP (it's also a learning goal). — ADR-0002
- T2: A well-made responsive web app is acceptable for logging on the phone until the native app exists. **Risk: medium — daily logging happens on the phone; the PWA mitigates it.** — ADR-0001
- T3: AI cost per user stays controllable by limiting AI v1 to categorization + weekly summary (no free chat).
- T4: PostgreSQL serves the whole MVP without needing other stores (Redis optional for queues). — ADR-0003

## Invalidation log

| Date | Assumption | What happened | Decision taken |
| ---- | ---------- | ------------- | -------------- |
| —    | —          | —             | —              |
