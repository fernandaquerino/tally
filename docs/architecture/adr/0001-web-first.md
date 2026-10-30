# ADR-0001: Web-first — defer the native mobile app

**Status:** Accepted · **Date:** 2026-07-13 · **Decider:** founder

## Context

The MVP needs to be shipped by 1 dev, who also has the explicit goal of practicing Next.js and NestJS. The original discovery recommended mobile-first (daily expense logging happens on the phone — a category fact). Forces in tension: speed of learning/delivery vs. fit with the mobile logging habit.

## Options considered

### A: Mobile-first (React Native/Flutter)

**Pros:** aligned with the logging habit; store presence.
**Cons:** stack outside the learning goal; slower release cycle (store review); two surfaces (app + web admin) for 1 dev; worse for reports/accountant view.

### B: Responsive web-first + PWA (chosen)

**Pros:** a single surface; continuous deploy; the desired stack (Next/Nest); desktop is great for reports, month closing and the accountant view — strong cases for the PJ persona; an installable PWA covers mobile logging reasonably.
**Cons:** a PWA < a native app in logging friction (no widget, limited push notifications on iOS); a direct risk to H3 (retention without low friction).

### C: Both in parallel

Rejected: unfeasible for 1 dev.

## Decision

Web-first with Next.js, with **mobile responsive + PWA treated as a first-class requirement** (not an afterthought): a fixed entry button, a 1-column form, an offline creation queue, installable.

## Consequences

- Gets easier: iterate fast, learn the stack, serve reports/desktop.
- Gets harder: competing on mobile logging friction with native apps; push on iOS.
- Mitigations: natural-language entry (fewer taps), email/web notifications for alerts.
- Revisit when: (a) H3 shows churn due to mobile friction, or (b) retention is validated and revenue justifies the app (v2). Sentinel metric: % of mobile sessions and the mobile vs. desktop logging rate.
