# AGENTS.md — Tally

> Persistent instructions for AI agents working in this repository.
> Read this file before any change. It is the contract for product, architecture, folders, scope and quality.

> Glossary: **PF** (Pessoa Física) = the person's personal money; **PJ** (Pessoa Jurídica) = their company's money. These two abbreviations are core product concepts and are kept throughout.

---

## 0. How to use this file

This file should guide any AI agent, such as Codex, Claude Code, Cursor Agent or ChatGPT, when working on the **Tally** project.

Before acting:

1. Read this `AGENTS.md`.
2. Read the current issue or request.
3. Read the relevant documents in `docs/` and the related ADRs.
4. Read the repository files before editing.
5. Make the smallest complete change possible.
6. Run the available checks.
7. At the end, explain what changed, where it changed, what was validated and what is still pending.

This project is personal, but it should be treated as a real product: **production-minded, portfolio-grade, incremental, testable, secure and financially correct**.

Tally deals with money, financial data and sensitive decisions. Any agent must prioritize **trust, integrity, privacy and auditability** over apparent speed.

---

## 1. Product vision

**Product name:** Tally  
**Repository:** `fernandaquerino/tally`  
**Type:** a finance web app for people who live off their own company (CNPJ).  
**Primary user:** a person who is also a legal entity — a micro-entrepreneur (MEI), freelancer, independent (PJ) consultant, self-employed professional or solo service provider.

Tally is the finance app for people who need to see **personal (PF) and business (PJ) in the same place, without mixing the money**.

It helps answer:

- How much came in this month?
- How much of that revenue is really mine?
- How much do I need to set aside for tax?
- How much goes to the company's reserve?
- How much can I withdraw as my salary?
- What's committed in credit cards, installments, goals and debts?
- What's personal (PF), what's business (PJ) and what's mixed?
- Which alerts do I need to see before the shock?
- How do I close the month clearly and auditably?
- How do I export my data for myself or my accountant?

The product's core pain:

> Personal (PF) and business (PJ) are the same person, but they need to be different money.

The product's AHA moment:

> "For the first time I know how much of my PJ revenue is really mine."

Tally is not just a financial CRUD. It's a built-in method to separate revenue, taxes, reserve, owner's draw, personal life, credit card, goals and debts.

---

## 2. Product principles

1. **The split is the method.** The central differentiator is turning PJ income into tax, reserve and personal salary.
2. **Ten seconds or nothing.** Recording a transaction should take under 10 seconds. If a screen adds friction to entry, justify it or cut it.
3. **PF and PJ always visible, never mixed.** Every transaction, report, number and alert must make clear whether it is PF, PJ or both.
4. **The number before the chart.** The main question is "how much can I spend?", not "which chart looks nice?".
5. **Numbers that add up are sacred.** Every total must be derivable, auditable and reconcilable.
6. **AI proposes, a human confirms.** The AI never silently persists an action, never computes taxes and never replaces domain validation.
7. **Warn before the shock.** The app must warn about the DAS (monthly tax), the MEI ceiling, the card bill, debt and spending pace before the problem becomes urgent.
8. **Simple on entry, deep on demand.** The first experience should be light; reports, tax settings and details stay behind "see more".
9. **Trust is a feature.** Backup, export, auditing and transparent deletion are part of the product, not technical extras.
10. **Paid = what works best.** Never put a paywall on top of an unstable feature.
11. **Real web.** Desktop should have density, shortcuts and tables; the mobile PWA should allow quick entry usable with a thumb.
12. **Human language, not bank language.** Use "your salary" before "owner's draw", "set aside for tax" before "tax provision".
13. **A simple working thing beats a complex half-done one.** Don't over-engineer before delivering end-to-end value.

---

## 3. Scope of the full portfolio app

The current roadmap is the **full app by screens** version, including Dashboard, Transactions, Accounts, Categories, Cards, Goals, Debts, Reports, Settings, AI and PWA.

The order was organized to make development easier on GitHub Projects and to demonstrate full-stack maturity.

### Within the planned scope

- authentication and user;
- fiscal and financial onboarding;
- authenticated app shell with a sidebar;
- dashboard with 3 key numbers;
- PF/PJ transactions;
- quick entry in under 10s;
- natural-language entry with AI;
- default and custom categories;
- PF/PJ accounts;
- credit card modeled by statement;
- installments and recurrences;
- PJ income splitter;
- tax provisions;
- owner's draw as the PJ → PF bridge;
- PF/PJ financial goals;
- debts, installments and prioritization;
- monthly reports with PF/PJ/All filters;
- CSV/JSON export;
- settings for profile, security, fiscal, split and data;
- alerts and weekly summary;
- installable PWA;
- a minimal offline queue for creating transactions;
- minimal observability;
- unit, integration and E2E tests of the critical flows;
- beta deploy.

### Out of scope without an explicit issue and ADR

Don't implement without a clear issue and an approved ADR:

- native mobile app;
- Open Finance;
- automatic bank import;
- invoice issuing;
- paying the DAS inside the app;
- an own bank account;
- credit/loans;
- advanced investments;
- RAG, embeddings or pgvector;
- customizable AI agents;
- unlimited open financial chat;
- advanced multi-user/family;
- an accountant view with granular permissions;
- regulatory fiscal integrations;
- receipt OCR;
- complex gamification.

These items are `Future` until a formal decision.

---

## 4. Official stack

Don't add libraries outside this stack without clearly justifying the trade-off.

| Layer            | Technology                                                     |
| ---------------- | -------------------------------------------------------------- |
| Monorepo         | pnpm workspaces + Turborepo                                    |
| Frontend         | Next.js 15 App Router                                          |
| UI               | Tailwind CSS + shadcn/ui + own components                      |
| Server state     | React Query                                                    |
| UI state         | Zustand for ephemeral state                                    |
| Forms            | React Hook Form + Zod                                          |
| Backend          | NestJS modular monolith                                        |
| API              | REST `/v1`                                                     |
| Language         | TypeScript strict                                              |
| Database         | PostgreSQL 16                                                  |
| ORM              | Prisma + Prisma Migrate                                        |
| Queues/light cache | Redis + BullMQ                                                |
| AI               | LLM via API, called only by the backend                        |
| PWA/offline      | Service worker + IndexedDB for a minimal queue                 |
| Tests            | Vitest, Testing Library, Playwright                            |
| Local infra      | Docker Compose                                                 |
| CI/CD            | GitHub Actions                                                 |
| Deploy           | Vercel for web; Railway/Fly/Render for API, Postgres and Redis |

Before installing any new package, answer in the PR or issue:

```md
## Why do I need this package?

- Problem it solves:
- Alternatives considered:
- Why it can't be done with what already exists:
- Impact on bundle/maintenance:
- Security or privacy risks:
```

If there's no justification, don't install it.

---

## 5. Expected folder structure

The monorepo's target structure:

```txt
tally/
├── apps/
│   ├── web/                              # Next.js — landing + authenticated app + PWA
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (marketing)/          # landing, blog, SEO
│   │       │   ├── (auth)/               # login, sign up, callback, onboarding
│   │       │   └── (app)/                # authenticated routes
│   │       │       ├── dashboard/
│   │       │       ├── transacoes/
│   │       │       ├── contas/
│   │       │       ├── categorias/
│   │       │       ├── cartoes/
│   │       │       ├── metas/
│   │       │       ├── dividas/
│   │       │       ├── relatorios/
│   │       │       └── settings/
│   │       ├── components/
│   │       │   ├── ui/                   # shadcn/local primitives if not in a package
│   │       │   ├── app/                  # AppShell, Sidebar, Topbar, PageHeader
│   │       │   ├── feedback/             # EmptyState, LoadingState, ErrorState, Toast
│   │       │   ├── charts/               # Recharts wrappers
│   │       │   └── data-display/         # MetricCard, DataTable, ContextBadge
│   │       ├── features/
│   │       │   ├── auth/
│   │       │   ├── onboarding/
│   │       │   ├── dashboard/
│   │       │   ├── transactions/
│   │       │   ├── accounts/
│   │       │   ├── categories/
│   │       │   ├── cards/
│   │       │   ├── invoices/
│   │       │   ├── split/
│   │       │   ├── provisions/
│   │       │   ├── goals/
│   │       │   ├── debts/
│   │       │   ├── reports/
│   │       │   ├── settings/
│   │       │   ├── ai-entry/
│   │       │   └── insights/
│   │       ├── lib/                      # api client, auth helpers, money/date formatters
│   │       ├── stores/                   # Zustand for ephemeral UI
│   │       ├── styles/                   # tokens/css vars if needed
│   │       └── pwa/                      # service worker, IndexedDB, offline queue
│   │
│   └── api/                              # NestJS REST API /v1
│       └── src/
│           ├── main.ts
│           ├── app.module.ts
│           ├── config/                   # env validation/typed config
│           ├── common/                   # guards, filters, interceptors, decorators
│           ├── prisma/                   # PrismaService
│           └── modules/
│               ├── auth/
│               ├── users/
│               ├── households/
│               ├── onboarding/
│               ├── contexts/
│               ├── accounts/
│               ├── categories/
│               ├── cards/
│               ├── invoices/
│               ├── transactions/
│               ├── splits/
│               ├── provisions/
│               ├── goals/
│               ├── debts/
│               ├── reports/
│               ├── exports/
│               ├── fiscal/
│               ├── ai/
│               ├── insights/
│               ├── settings/
│               └── jobs/
│
├── packages/
│   ├── shared/                           # Zod schemas, API types, money/date utils
│   └── config/                           # shared eslint, tsconfig, prettier
│
├── prisma/                               # schema.prisma, migrations and seed
├── docs/
│   ├── discovery/
│   ├── product/
│   ├── ux/
│   └── architecture/
│       ├── adr/
│       ├── architecture.md
│       ├── system-design.md
│       ├── domain-model.md
│       ├── data-model.md
│       └── threat-model.md
├── scripts/                              # idempotent scripts
├── .github/workflows/                    # CI/CD
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
├── tsconfig.base.json
├── README.md
└── AGENTS.md
```

### Golden rule for folders

- If something has product domain, put it in the corresponding feature/domain.
- If something is a generic visual primitive, put it in `components/ui` or the appropriate package.
- If something is a shared contract, put it in `packages/shared`.
- If something is a backend rule, put it in `apps/api/src/modules/<domain>`.
- If something talks to the database, it must go through a backend repository/service, never through the frontend.
- If something is an architectural decision, document it or update an ADR.

---

## 6. What goes in each folder

### `apps/api/src/modules/<domain>`

Each NestJS domain should follow, whenever it makes sense:

```txt
modules/<domain>/
├── <domain>.module.ts
├── <domain>.controller.ts
├── <domain>.service.ts
├── <domain>.repository.ts
├── dto/
├── mappers/
├── entities/              # internal domain types, if needed
├── policies/              # specific authorization rules, if needed
└── tests/
```

Rules:

- the controller is thin;
- the service holds business logic;
- the repository is the only domain layer that talks to Prisma;
- the DTO validates input;
- the mapper converts database → response;
- a module should not access another domain's repository directly without a public service;
- every domain query must receive `householdId` derived from the session/token;
- never accept `householdId` or `userId` as an authorization source coming from the client.

### `apps/web/src/features/<domain>`

Each web feature should follow:

```txt
features/<domain>/
├── components/
├── hooks/
├── services/              # calls to the api client or thin server actions
├── types/                 # local UI types
├── utils/                 # feature-specific util
└── constants.ts
```

Rules:

- a feature component can know the domain;
- a feature component should not become generic UI without reason;
- query/mutation hooks live in the feature;
- heavy data transformation does not live in the JSX;
- don't create `features/shared` as a junk drawer;
- domain names in code can be in English, but the UI must be PT-BR.

### `packages/shared`

Use for:

- shared Zod schemas;
- request/response types;
- domain enums;
- pure money utils;
- pure date utils;
- genuinely global shared constants.

Don't put here:

- React;
- NestJS;
- PrismaClient;
- business logic that depends on the database;
- rendering logic.

### `prisma/`

Use for:

- `schema.prisma`;
- versioned migrations;
- local seed;
- database-related scripts.

Rules:

- never edit an old, already-applied migration;
- generate a new migration for a schema change;
- review a migration before considering it done;
- the seed must use fictional, realistic data;
- don't put real personal financial data in the seed.

### `docs/architecture/adr`

Use for architectural decisions.

An ADR is not decoration. If a decision changes, update the ADR.

---

## 7. "Never do this under any circumstances" rules

These rules are mandatory.

### Product and scope

- Don't turn Tally into a generic Mobills.
- Don't turn Tally into an ERP, invoice issuer or digital bank.
- Don't implement Open Finance without an explicit issue and ADR.
- Don't create an open AI chat before the lean AI v1 is stable.
- Don't hide the user's PF/PJ context.
- Don't create a chart-heavy dashboard before answering "how much can I spend?".
- Don't treat goals and debts as visual decoration; they affect future commitment.
- Don't create screens with only mocked data and call them done.
- Don't add childish gamification in a serious finance product.

### Architecture

- Don't put business logic inside a React component.
- Don't put business logic inside a NestJS controller.
- Don't access Prisma from the frontend.
- Don't duplicate financial rules across Next and Nest.
- Don't create one monolithic global store for server data.
- Don't store server data in Zustand/localStorage as the source of truth.
- Don't create a giant `utils.ts`.
- Don't create an abstraction with only one real usage.
- Don't refactor the whole architecture during a small issue.
- Don't implement microservices in the MVP/full portfolio app without an ADR.

### Money and financial domain

- Don't use `number`, `float`, `double`, `parseFloat` or loose decimal computation for money.
- Don't store money in reais as a decimal in the database.
- Don't display a sum that can't be audited.
- Don't save a balance as the single source of truth.
- Don't edit a closed statement directly.
- Don't treat a credit card as a regular account.
- Don't mix accrual and cash without making it explicit.
- Don't compute taxes via an LLM.
- Don't hardcode a tax rate in a component or prompt.
- Don't create a split that doesn't add up to an exact sum of cents.

### Security and data

- Don't trust `userId` or `householdId` coming from the client.
- Don't return another household's data.
- Don't log tokens, passwords, JWTs, cookies, full emails, financial values, transaction descriptions or sensitive fiscal data.
- Don't store tokens in localStorage.
- Don't commit `.env`, secrets, keys or credentials.
- Don't expose stack traces in production responses.
- Don't skip authorization on update/delete.
- Don't render AI text without sanitization when there's a risk of unsafe HTML/markdown.

### Database

- Don't manually edit an applied migration.
- Don't create a domain table without `householdId`, except for a justified global table.
- Don't hard delete financial data by default.
- Don't use JSON/JSONB as a shortcut to avoid modeling without an ADR.
- Don't remove fields/tables without a migration and without adjusting consumers.
- Don't do a destructive cascade on financial data without understanding the impact.

### Frontend

- Don't use `any` to silence TypeScript.
- Don't use `// @ts-ignore` without an explanation and a follow-up issue.
- Don't create a Client Component when a Server Component solves it.
- Don't remove the focus outline without replacing it with a visible focus.
- Don't leave a screen with remote data without loading/error/empty.
- Don't use hardcoded English text in the UI, except for unavoidable technical terms.
- Don't use color as the only differentiator between PF/PJ.
- Don't hide the primary action.
- Don't create a form that loses data when submit fails.

### Tests and quality

- Don't remove a test to make the build pass without explaining.
- Don't skip lint/typecheck if the command exists.
- Don't leave stray `console.log`.
- Don't swallow errors with an empty `catch {}`.
- Don't finish an issue saying it's done if you didn't run the checks or explain why not.

---

## 8. Product domains

### 8.1 Auth and user

Responsible for:

- sign up;
- login;
- logout;
- session refresh;
- profile;
- timezone;
- preferences;
- account security.

Rules:

- `userId` always comes from the session/token.
- Private routes require authentication.
- Don't return the password hash.
- The session must use an httpOnly/Secure/SameSite cookie when applicable.
- Sensitive tokens never go to localStorage.

### 8.2 Household and tenancy

Even if there's only one person at first, the model must be born prepared for a `household`.

Responsible for:

- isolating financial data;
- allowing a future family/accountant without a brutal refactor;
- ensuring every domain query filters by `householdId`.

Rules:

- `householdId` comes from the server.
- The client never decides the authoritative household.
- Every financial table must have `householdId`.
- IDOR tests are mandatory for authenticated endpoints.

### 8.3 Fiscal and financial onboarding

Responsible for collecting the minimum data to deliver value:

- profile: PF, MEI, Simples, PJ service provider;
- simplified fiscal bracket/regime;
- tax/reserve percentage;
- initial accounts;
- optional initial card;
- optional initial goal;
- optional initial debt.

Rules:

- Progressive disclosure: don't turn onboarding into an accountant's form.
- Ask the minimum to generate the 3 key numbers.
- Fiscal data is configuration, not computation by AI.

### 8.4 Dashboard

Responsible for answering quickly:

- PJ result;
- personal available;
- future committed;
- PJ panel;
- upcoming provisions;
- alerts;
- latest transactions;
- goals in progress;
- relevant debts.

Rules:

- The home prioritizes numbers, not charts.
- Every number must be clickable or auditable.
- Show PF/PJ clearly.
- Don't create decorative cards with no action or explanation.

### 8.5 Transactions

The operational core of the app.

Expected types:

- income;
- expense;
- transfer;
- adjustment;
- statement payment;
- debt payment;
- goal contribution;
- provision;
- split.

Rules:

- creation in under 10s;
- every transaction has a PF/PJ context;
- every transaction has a source: `form`, `ai`, `import`, `system`;
- every transaction must belong to an account or statement, respecting the domain rules;
- critical mutations must be auditable;
- deleting must be a soft delete when there's relevant financial history.

### 8.6 Categories

Responsible for classifying transactions.

Rules:

- default categories exist for PF and PJ;
- custom categories belong to the household;
- a category can have a PF, PJ or both context;
- the last-used category can speed up entry;
- the AI can suggest a category, but the user confirms.

### 8.7 Accounts

Responsible for cash on hand.

Possible types:

- PF checking account;
- PJ checking account;
- wallet;
- reserve;
- savings;
- manual account.

Rules:

- the displayed balance is derived from transactions;
- a materialized balance, if it exists, is cache/reconciliation, not the source of truth;
- a transfer between accounts must generate two auditable legs;
- the owner's draw is the PJ → PF bridge;
- don't mix an account with a credit card.

### 8.8 Cards and statements

The credit card must be modeled correctly.

Expected entities:

- card;
- invoice;
- invoice payment;
- installment group;
- transactions linked to the statement.

Rules:

- a statement is an accrual grouping;
- paying a statement is cash;
- an installment purchase creates installments in the correct statements;
- an open statement has a derived total;
- a closed statement freezes the total and becomes immutable;
- correcting a closed statement must happen via an audited adjustment;
- a mixed PF/PJ card must separate reports by context.

### 8.9 PJ income split

The split is the heart of Tally.

When PJ income comes in, the app should suggest:

- tax/DAS/IR/fiscal reserve;
- company reserve;
- salary/owner's draw;
- available amount.

Rules:

- the split must run in an atomic database transaction;
- all legs must reference `splitId`;
- percentages are configurable;
- fiscal rules are versioned;
- the LLM never computes taxes;
- cent rounding must add up exactly.

### 8.10 Provisions

Responsible for money set aside for a future obligation.

Examples:

- DAS;
- IR;
- accountant;
- monthly reserve;
- configurable taxes.

Rules:

- a provision has a status: pending, paid, canceled;
- a provision has a due date;
- a D-7 and D-1 reminder when applicable;
- paying a provision generates a transaction or marks it settled with auditing.

### 8.11 Goals

A real screen of the full app.

Examples:

- emergency reserve;
- replace a laptop;
- vacation;
- pay off a debt;
- tax reserve;
- a PJ minimum-cash goal.

Expected fields:

- name;
- PF/PJ context;
- target amount in cents;
- current/contributed amount;
- optional target date;
- status;
- priority;
- contributions linked to transactions.

Rules:

- a goal is not just a visual card;
- contributions must be auditable;
- a goal affects planning, but must not lie about the balance;
- PF and PJ goals can coexist;
- the dashboard can show a compact widget.

### 8.12 Debts

A real screen of the full app.

Examples:

- an overdue card;
- a loan;
- financing;
- a debt to an individual;
- an installment tax;
- a PJ debt.

Expected fields:

- creditor;
- PF/PJ context;
- principal in cents;
- current balance in cents;
- optional interest rate;
- installments;
- due date;
- priority;
- status;
- linked payments.

Rules:

- a debt impacts future commitment;
- payments reduce the balance;
- future installments must appear in projection;
- prioritization must be explainable;
- don't promise professional financial advice;
- show the criteria: interest, due date, amount, risk.

### 8.13 Reports

Responsible for closing and analysis.

Expected reports:

- monthly report;
- categories;
- PF/PJ/All;
- cash flow;
- statements;
- goals;
- debts;
- CSV/JSON export;
- drill-down of the numbers.

Rules:

- a report must be auditable;
- relevant filters go in the URL when it makes sense;
- a chart is an expandable detail;
- export must respect the household and authorization;
- an export must not leak another user's data.

### 8.14 Settings

Responsible for:

- profile;
- theme preferences;
- fiscal settings;
- split rules;
- default categories;
- security;
- export;
- account deletion;
- LGPD;
- plan/subscription in the future.

Rules:

- sensitive settings require authorization;
- account deletion must be explicit;
- a full export must be easy;
- changing a fiscal rule must not rewrite history without a clear flow.

### 8.15 AI and alerts

AI v1 is lean and proactive.

It may contain:

- natural-language entry parsing;
- suggested categorization;
- weekly summary;
- explanation of alerts;
- insights with evidence.

It must not contain without an ADR:

- unlimited open chat;
- customizable agents;
- RAG;
- embeddings;
- complex financial recommendations;
- fiscal computation by an LLM.

Rules:

- the AI returns a proposal;
- the proposal goes through a Zod schema;
- the user confirms before persisting;
- a timeout falls back to a form;
- versioned prompts;
- tests with a mocked model;
- costs measured per user/day when implemented.

### 8.16 PWA and offline

Minimum scope:

- installable app;
- service worker;
- an offline queue only for creating transactions;
- IndexedDB;
- flush with `Idempotency-Key`;
- offline reading as a stale snapshot.

Out of the initial scope:

- offline editing;
- complex conflict resolution;
- full sync;
- advanced push notifications.

---

## 9. Roadmap per sprint

### Sprint 0 — Foundation

Focus: infrastructure, technical base and ADRs.

Deliverable: the app runs locally, the API responds to a healthcheck, the database comes up, CI validates, a minimal design system exists.

Typical issues:

- monorepo with pnpm workspaces;
- Turborepo;
- Docker Compose with Postgres 16 and Redis;
- Next.js base setup;
- NestJS base setup;
- initial Prisma;
- `.env.example`;
- CI with lint, typecheck and test;
- minimal design system;
- initial ADRs.

### Sprint 1 — App Shell + Auth

Deliverable: the user can register/log in, go through initial onboarding and see the authenticated layout with the full sidebar.

Includes:

- auth;
- session;
- tenancy;
- fiscal onboarding;
- AppShell;
- Sidebar;
- Topbar;
- empty routes of the main screens;
- route guards;
- basic authorization tests.

### Sprint 2 — Dashboard

Deliverable: an initial dashboard with 3 numbers, a PJ panel, alerts and latest transactions.

Includes:

- main cards;
- PJ panel;
- future-committed widget;
- latest transactions;
- upcoming alerts;
- empty/loading/error;
- aggregated APIs.

### Sprint 3 — Transactions

Deliverable: PF/PJ transaction CRUD with quick entry, filters, recurrences, installments and the PJ income splitter.

Includes:

- list screen;
- new-transaction modal/form;
- filters;
- detail;
- split;
- recurrence;
- installments;
- invariant tests.

### Sprint 4 — Accounts

Deliverable: PF/PJ accounts, derived balances, transfers, owner's draw and reconciliation.

### Sprint 5 — Categories

Deliverable: default and custom categories per context, used in entry and reports.

### Sprint 6 — Cards

Deliverable: cards, statements, installment purchases, closing and statement payment.

### Sprint 7 — Goals

Deliverable: PF/PJ goals with progress, contributions and a dashboard widget.

### Sprint 8 — Debts

Deliverable: debts with installments, payments, priority and impact on future commitment.

### Sprint 9 — Reports

Deliverable: a monthly PF/PJ/All report, expandable charts, drill-down and export.

### Sprint 10 — Settings

Deliverable: profile, fiscal, split rules, security, data, export and account deletion.

### Sprint 11 — AI + Alerts

Deliverable: natural-language entry, categorization, feedback, insights, alerts and weekly summary.

### Sprint 12 — PWA + Beta

Deliverable: installable PWA, offline queue, idempotency, observability, E2E tests, deploy, backup/restore and a beta checklist.

---

## 10. Mandatory ADRs

Write or update ADRs in `docs/architecture/adr`.

Expected or suggested ADRs:

- `0001-web-first.md`
- `0002-stack-next-nest.md`
- `0003-postgres-prisma.md`
- `0004-monorepo.md`
- `0005-cartao-por-fatura.md`
- `0006-dinheiro-em-centavos.md`
- `0007-manual-first-sem-open-finance.md`
- `0008-auth-e-tenancy.md`
- `0009-ia-v1-propoe-humano-confirma.md`
- `0010-metas-e-dividas-no-app-completo.md`

Template:

```md
# ADR-0000 — Title

## Status

Proposed | Accepted | Superseded

## Context

Explain the problem and the forces involved.

## Options considered

- Option A
- Option B

## Decision

Explain the choice.

## Consequences

- Positive
- Negative
- Trade-offs
```

Don't implement a solution that contradicts an accepted ADR without updating the ADR.

---

## 11. Backend guidelines — NestJS

### Controllers

Controllers should:

- validate session/authorization;
- receive parameters;
- validate input;
- call the service;
- return a standardized response.

Controllers should not:

- contain business logic;
- assemble complex Prisma queries;
- decide financial logic;
- do heavy transformation.

### Services

Services should:

- concentrate business logic;
- orchestrate repositories;
- apply financial invariants;
- use Prisma transactions when needed;
- be testable.

Examples of service rules:

- income split;
- statement closing;
- statement payment;
- goal contribution;
- debt payment;
- settling a provision;
- report generation.

### Repositories

Repositories should:

- be the only domain layer that talks directly to Prisma;
- always filter by `householdId`;
- return only the needed data;
- not contain complex product rules;
- not accept an arbitrary `householdId` from the client.

Conceptual example:

```ts
await repository.findTransactionById({
  householdId: request.householdId,
  transactionId,
});
```

Never:

```ts
await repository.findTransactionById(transactionId);
```

### DTOs and validation

- Always validate input on the backend.
- If the schema is shared with the frontend, use `packages/shared`.
- Reject invalid input with a structured error.
- Validate AI output with Zod before using it.

Suggested envelope:

```ts
{
  data: T;
}
```

Suggested error:

```ts
{
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

### HTTP status

- `200` read/update OK;
- `201` creation OK;
- `204` delete with no body;
- `400` malformed request;
- `401` not authenticated;
- `403` no permission;
- `404` resource not found or not belonging to the household;
- `409` domain conflict;
- `422` input validation;
- `500` unexpected error with no sensitive details.

### Expected REST routes

Use the `/v1` prefix from the start.

```txt
POST   /v1/auth/register
POST   /v1/auth/login
POST   /v1/auth/refresh
POST   /v1/auth/logout
GET    /v1/me

GET    /v1/onboarding
POST   /v1/onboarding

GET    /v1/dashboard
GET    /v1/dashboard/pj-panel

GET    /v1/accounts
POST   /v1/accounts
PATCH  /v1/accounts/:id
DELETE /v1/accounts/:id
POST   /v1/accounts/transfer

GET    /v1/categories
POST   /v1/categories
PATCH  /v1/categories/:id
DELETE /v1/categories/:id

GET    /v1/transactions
POST   /v1/transactions
GET    /v1/transactions/:id
PATCH  /v1/transactions/:id
DELETE /v1/transactions/:id
POST   /v1/transactions/:id/split

GET    /v1/cards
POST   /v1/cards
PATCH  /v1/cards/:id
DELETE /v1/cards/:id
GET    /v1/cards/:id/invoices
GET    /v1/invoices/:id
POST   /v1/invoices/:id/pay

GET    /v1/goals
POST   /v1/goals
PATCH  /v1/goals/:id
DELETE /v1/goals/:id
POST   /v1/goals/:id/contributions

GET    /v1/debts
POST   /v1/debts
PATCH  /v1/debts/:id
DELETE /v1/debts/:id
POST   /v1/debts/:id/payments

GET    /v1/provisions
POST   /v1/provisions/:id/pay

GET    /v1/reports/monthly
GET    /v1/reports/pj-panel
GET    /v1/exports/full

POST   /v1/ai/parse-transaction
GET    /v1/insights
POST   /v1/insights/:id/read

PATCH  /v1/settings
DELETE /v1/account
```

### Idempotency

Write POSTs that may be repeated must accept an `Idempotency-Key`, especially:

- offline transaction creation;
- split;
- statement payment;
- debt payment;
- goal contribution.

---

## 12. Frontend guidelines — Next.js

### Server Components by default

Use Server Components when:

- the screen only loads data;
- there's no local interactive state;
- it doesn't use a browser API;
- it doesn't use user events.

Use Client Components when:

- there's a form;
- there are interactive filters;
- there's a controlled modal/dropdown;
- there's local state;
- there's a React Query mutation;
- there's access to IndexedDB/service worker;
- there's an interactive chart.

Mark `"use client"` on the smallest possible component, never on the whole page without need.

### Page organization

Pages in `app/` should be thin. They can:

- assemble layout;
- fetch initial data;
- call feature components;
- define metadata.

Pages should not:

- contain giant JSX;
- contain domain logic;
- contain complex transformation;
- scatter `fetch()` without a layer.

### API client

Centralize HTTP calls in:

```txt
apps/web/src/lib/api/
```

or in services per feature:

```txt
features/transactions/services/transactions-api.ts
```

Don't scatter raw `fetch()` across many components.

### React Query

Use for server data:

- transactions;
- accounts;
- cards;
- categories;
- goals;
- debts;
- reports;
- settings.

Rules:

- query keys must be predictable;
- relevant filters go into the query key;
- mutations invalidate the affected queries;
- optimistic update only when rollback is clear;
- don't duplicate server data in Zustand.

### Zustand

Use only for ephemeral UI:

- open modal;
- selected visual context;
- collapsed sidebar;
- temporary non-sensitive draft;
- local filters before applying.

Don't use Zustand as an authoritative local database.

### Forms

- React Hook Form + Zod.
- Client validation improves UX; the backend is the final source.
- Errors appear near the field.
- Submit has a loading state.
- A form must not clear if the request fails.
- Money must enter/leave as cents, with formatting at the edge.

### Lists and tables

Every list with remote data needs:

- loading;
- error;
- empty;
- pagination or cursor when it grows;
- clear filters;
- a no-results search state.

### Accessibility

Mandatory:

- labels on inputs;
- buttons with accessible text;
- visible focus;
- keyboard navigation;
- minimum AA contrast;
- `aria-describedby` for field errors;
- modals with focus trap;
- PF/PJ with icon + text, not only color.

---

## 13. Design system and UI

The design should be:

- light-professional;
- clear;
- modern;
- calm;
- useful;
- trustworthy;
- dense on desktop and simple on mobile;
- with strong visual hierarchy;
- without dashboard clutter.

Visual references:

- Linear;
- Copilot Money;
- Raycast;
- Stripe Dashboard;
- Vercel Dashboard;
- Nubank for simple language;
- Notion for organization;
- Cursor for contextual AI.

Anti-references:

- a gray corporate dashboard;
- too many charts with no action;
- childish gamification;
- a finance app that looks like an abandoned spreadsheet;
- a bank interface full of jargon.

### Suggested tokens

```txt
Background: #F8FAFC or #FAFAFB
Surface: #FFFFFF
Surface subtle: #F3F4F6
Text primary: #111827
Text secondary: #6B7280
Primary: #7C6FF7
Primary dark: #5B4FE8
Border: #E5E7EB
Success: soft green
Warning: soft yellow
Danger: red only for a real alert
PJ: blue/icon + label
PF: green/icon + label
```

### Minimum components

- `Button`
- `Input`
- `MoneyInput`
- `Textarea`
- `Select`
- `Card`
- `Badge`
- `Chip`
- `Checkbox`
- `Dialog`
- `Dropdown`
- `Tabs`
- `SegmentedControl`
- `Skeleton`
- `Toast`
- `DataTable`
- `MetricCard`
- `ContextBadge`
- `PageHeader`
- `EmptyState`
- `LoadingState`
- `ErrorState`

### Important product components

- `QuickEntryModal`
- `AIEntryField`
- `AIProposalCard`
- `SplitPanel`
- `PJPanel`
- `ProvisionCard`
- `InvoiceView`
- `InstallmentTag`
- `GoalProgressCard`
- `DebtPriorityCard`
- `MonthlyReport`
- `ExportPanel`

`SplitPanel` is a critical product component. It must be simple, auditable and tested.

### Microcopy

Use phrases like (kept in Brazilian Portuguese — product UI copy):

- "Quanto desse dinheiro é realmente seu?"
- "Separado para imposto"
- "Seu salário estimado"
- "Dinheiro da empresa"
- "Dinheiro pessoal"
- "Comprometido futuro"
- "Ver de onde veio esse número"
- "A IA sugeriu. Você confirma."
- "Exportar meus dados"

Avoid:

- "provisão tributária" with no explanation;
- "cashflow statement";
- "advanced financial forecast";
- a bank tone;
- too many emojis;
- language that sounds like a promise of financial consulting.

---

## 14. Database and Prisma

### Conventions

- Prisma is the official source of the physical schema.
- Migrations are versioned in `prisma/migrations`.
- Table/column names in the database can use the Prisma convention, but keep consistency.
- Money must be stored in cents with `BigInt`/`bigint`.
- Every financial entity must have `householdId`.
- Every main entity must have `createdAt`, `updatedAt` and, when it makes sense, `deletedAt`.
- Use constraints and indexes for important invariants.

### Mandatory rules

- Every domain query filters by `householdId`.
- Don't accept `householdId` from the client as an authorization source.
- Don't create a financial table without an FK to a household.
- Don't edit an old applied migration.
- Don't use JSON as an excuse to avoid modeling.
- Don't cascade-delete data without understanding the impact.
- Don't create a new PrismaClient in each repository. Reuse `PrismaService`.
- Raw SQL only with justification, typing and care about injection.

### Money

- Monetary values always in cents.
- The API may serialize cents as a string to avoid precision loss.
- Formatting only at the edge with `Intl.NumberFormat`.
- Never use a float for financial computation.
- A proportional split must distribute the remaining cents deterministically.

### Important invariants

- A transaction belongs to an account or a statement, not both without an explicit rule.
- A closed statement is not directly editable.
- A balance is derived from transactions.
- A split must add up exactly to the original total.
- A transfer must have linked legs.
- A statement payment must connect cash and accrual.
- A debt payment must reduce the debt balance and generate history.
- A goal contribution must be auditable.

### Soft delete

Prefer `deletedAt` for:

- transactions;
- accounts;
- custom categories;
- cards;
- goals;
- debts;
- provisions;
- important historical settings.

Hard delete only in an explicit account-deletion / LGPD-purge flow.

### Seeds

Seeds must create fictional, realistic data, for example:

- user "Rafael";
- a PJ account;
- a PF account;
- a mixed card;
- PJ income from a client;
- an applied split;
- a reserve goal;
- an installment debt;
- a monthly report with auditable data.

Don't put the user's real data.

---

## 15. Authentication and authorization

Expected architecture:

- Auth/session in Next.js when applicable;
- JWT/session validated by NestJS;
- httpOnly/Secure/SameSite cookies for sensitive tokens;
- `userId` and `householdId` extracted on the server;
- `AuthGuard` → `TenancyGuard` → `PlanGuard`, when there are plans.

### Rules

- Every private route requires authentication.
- Every mutation checks resource ownership.
- Never trust ids sent by the client for authorization.
- When fetching a resource by `id`, also filter by `householdId`.
- IDOR must be tested on authenticated endpoints.

Conceptual example:

```ts
findDebtById({ id, householdId });
```

Never:

```ts
findDebtById(id);
```

---

## 16. Security and privacy

Tally stores sensitive financial data.

Never log:

- passwords;
- password hashes;
- JWTs;
- cookies;
- refresh tokens;
- full emails;
- financial values;
- full transaction descriptions;
- fiscal data;
- card data;
- the full content sent to the AI;
- secrets.

### LocalStorage

Don't use localStorage for:

- tokens;
- session;
- financial data;
- transactions;
- balances;
- goals;
- debts;
- fiscal data.

It may be used only for non-sensitive ephemeral UI, if needed.

### Env

- `.env` should never be committed.
- `.env.example` contains variable names without real values.
- Validate envs at startup when possible.

### Errors

- In production, responses don't leak stack traces.
- Messages for the user are clear, but without internal details.
- Structured logs must use `requestId`.

### LGPD

- A full export must exist.
- Account deletion must have a clear flow.
- A real purge must be documented.
- Data must be minimized.
- Avoid collecting full CPF/CNPJ in the MVP/initial app if it isn't needed.

---

## 17. AI — Tally's rules

AI is part of the app, but with strict limits.

### Allowed in AI v1

- natural-language transaction parsing;
- category suggestion;
- weekly summary based on numbers computed by SQL;
- textual insight with evidence;
- deterministic alerts explained in simple language.

### Forbidden without an ADR

- unlimited open chat;
- autonomous agents;
- RAG;
- embeddings;
- pgvector;
- executing actions without confirmation;
- fiscal computation by an LLM;
- investment/credit recommendations;
- sending a full statement to the prompt;
- tool calling that changes data without explicit confirmation.

### Mandatory rules

- The LLM never persists data directly.
- Every output becomes a proposal.
- The proposal goes through a Zod schema.
- The user confirms or edits.
- A timeout falls back to a form.
- The prompt must separate instructions from the user's content.
- Prompts are versioned in `apps/api/src/modules/ai/prompts` or equivalent.
- Tests use a mocked model.
- Prompt content must be minimized.
- Tax rates and fiscal rules come from the database/configuration, never from the model.

---

## 18. Tests

Prioritize tests where there's real risk:

- per-household isolation;
- financial computations;
- income split;
- statement by accrual;
- statement payment;
- debt payment;
- goal contribution;
- monthly report;
- export;
- auth/authorization;
- AI parse fallback;
- PWA offline/idempotency.

### Unit tests

Use for:

- money utils;
- split;
- fiscal rules;
- future-committed computation;
- goal-progress computation;
- debt-balance computation;
- mappers;
- validators.

### Integration tests

Use for:

- service + repository;
- Prisma with a test database;
- per-household authorization;
- transaction creation/listing;
- statement closing;
- export;
- reports.

### Component tests

Use for:

- `MoneyInput`;
- `QuickEntryModal`;
- `SplitPanel`;
- `AIProposalCard`;
- `InvoiceView`;
- `GoalProgressCard`;
- `DebtPriorityCard`;
- empty/loading/error states.

### E2E

Critical flows:

1. sign up/login;
2. fiscal onboarding;
3. open the dashboard;
4. create a PF/PJ account;
5. create a category;
6. record a transaction in under 10s;
7. record PJ income;
8. apply a split;
9. see the updated dashboard;
10. create a card and an installment purchase;
11. close/pay a statement;
12. create a goal and a contribution;
13. create a debt and a payment;
14. open the monthly report;
15. export data.

### Regression rule

A fixed bug should become a test whenever possible.

---

## 19. Expected commands

Before assuming a command, check `package.json`.

Desired commands:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

Database:

```bash
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

If a command doesn't exist and the issue asks for setup, create the script in the appropriate `package.json`.

Before finishing a change, run as much as possible:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If it doesn't run, explain why.

---

## 20. Agent workflow

When you receive a task:

1. Identify the sprint and the domain.
2. Read the full issue/request.
3. Read the relevant files.
4. Check the related ADRs.
5. Make a short plan before big changes.
6. Implement the smallest complete change.
7. Don't change files outside the scope without need.
8. Update tests and documentation if the contract changed.
9. Run the checks.
10. Finish with an objective summary.

### Expected final response after implementation

```md
## What was done

- ...

## Files changed

- `path/file.ts` — reason

## Checks

- `pnpm lint` ✅
- `pnpm typecheck` ✅
- `pnpm test` didn't run because ...

## Notes

- Risk: ...
- Decision Needed: ...
- Future: ...
```

---

## 21. Git, branches and commits

### Branches

Suggested format:

```txt
sprint-0/setup-monorepo
sprint-1/auth-app-shell
sprint-2/dashboard
sprint-3/transactions-core
sprint-6/cards-invoices
sprint-8/debts
```

### Commits

Use simple Conventional Commits:

```txt
feat: configure pnpm workspace
feat(api): add transactions module
feat(web): add quick entry modal
feat(db): model invoices
fix(api): enforce household filter on debts
test(api): cover split cents distribution
docs: add ADR for card invoices
chore: add lint workflow
```

### Don't mix in the same commit

- feature + big refactor;
- schema + redesign;
- auth + complex dashboard;
- mass lint + functional change;
- a new dependency + several features;
- AI + a financial schema change without a test.

---

## 22. Issues and labels

Use small, traceable issues.

Expected labels:

- `sprint-0` through `sprint-12`;
- `domain:auth`;
- `domain:onboarding`;
- `domain:dashboard`;
- `domain:transacoes`;
- `domain:contas`;
- `domain:categorias`;
- `domain:cartoes`;
- `domain:metas`;
- `domain:dividas`;
- `domain:relatorios`;
- `domain:settings`;
- `domain:ia`;
- `domain:pwa`;
- `stack:api`;
- `stack:web`;
- `stack:db`;
- `stack:infra`;
- `stack:ui`;
- `stack:shared`;
- `type:feature`;
- `type:bug`;
- `type:docs`;
- `type:adr`;
- `type:refactor`;
- `type:test`;
- `priority:critical`;
- `priority:high`;
- `priority:normal`;
- `priority:low`.

Template:

```md
## Context

Why this issue exists and what problem it solves.

## Scope

- [ ] Concrete item
- [ ] Concrete item

## Out of scope

- What doesn't enter now

## Acceptance criteria

- Given that...
- When...
- Then...

## Technical notes

- Endpoint:
- Components:
- Schema:
- Tests:
```

---

## 23. Code quality

### TypeScript

- `strict` on.
- Don't use `any` without justification.
- Prefer explicit types at the edges.
- Use inference inside functions when it's clear.
- Don't use `as unknown as` to force a type.

### Functions

- Small functions.
- A name that explains intent.
- Avoid the boolean trap with many booleans.
- Prefer a params object when a function grows.
- Separate pure computation from side effects.

### Components

- Small, cohesive components.
- Typed props.
- Avoid a 300-line component.
- Separate container/data fetching from presentation when it improves clarity.
- Domain components live in the feature.
- Generic components live in the design system.

### Errors

- Handle predictable errors.
- Don't swallow errors silently.
- Use useful messages.
- Structured logging on the backend with no sensitive data.

---

## 24. Performance

Don't optimize early, but avoid bad decisions.

- Don't fetch a giant list without pagination.
- Don't recompute heavy transformation on render without need.
- Don't put everything as a Client Component.
- Don't load a heavy library without justification.
- Don't render complex charts without a fallback.
- Don't do N+1 queries on the backend.
- Don't generate the monthly report with multiple unnecessary queries without measuring.
- Don't call the LLM on render or initial load.

Use pagination/filters for:

- transactions;
- statements;
- goals;
- debts;
- detailed reports;
- insights.

---

## 25. Minimum observability

Even in a side project, record:

- API errors with a request id;
- authentication failures with no sensitive data;
- aggregated validation failures when useful;
- timing of critical endpoints;
- AI cost/latency when AI exists;
- reconciliation divergence;
- job failure;
- export failure;
- offline queue failure.

Expected tools:

- structured logs;
- Sentry front/API;
- healthcheck;
- simple metrics;
- basic alerts on deploy.

Don't implement advanced observability before the foundation, except for a specific issue.

---

## 26. Definition of done

An issue is only done when:

- it compiles;
- lint passes or the failure is documented;
- typecheck passes or the failure is documented;
- a relevant test was created/updated when applicable;
- the main flow was validated manually or by a test;
- the UI has loading/error/empty when it fetches data;
- data is filtered by the authenticated user/household;
- money is handled in cents;
- displayed numbers are auditable;
- documentation/ADR was updated when the contract changed;
- there's no out-of-scope change;
- there's no `console.log`, unjustified `any` or vague TODO;
- risks and pending items were flagged.

---

## 27. Current priority

At the start of the project, prioritize Sprint 0 and Sprint 1.

Recommended order:

1. monorepo;
2. Docker Compose;
3. Next.js base;
4. NestJS base;
5. Prisma/Postgres base;
6. Redis base;
7. shared packages;
8. CI;
9. minimal design system;
10. auth;
11. tenancy;
12. onboarding;
13. AppShell/Sidebar;
14. ADRs.

Don't jump to AI, Open Finance, sophisticated charts or advanced screens before the foundation is stable.

---

## 28. Senior mentorship mode

This project also serves the user's technical growth. The agent should act as a senior mentor.

Expected behaviors:

- explain trade-offs;
- point out risks;
- suggest alternatives;
- separate `Risk`, `Decision Needed` and `Future`;
- don't silently decide architecture;
- teach the pattern used;
- suggest relevant tests;
- help turn a technical decision into a PR/interview explanation;
- keep the focus on incremental delivery;
- remember that clarity and trust matter more than complexity.

Signaling:

- `Risk` — can break production, security, performance, money or trust.
- `Decision Needed` — an architectural/product choice needs validation.
- `Future` — a valid improvement, but out of the current scope.

---

## 29. Final reminder

Tally should help a person who lives off their own company (CNPJ) know how much of the money is the company's, how much is tax, how much is reserve and how much is really theirs.

Whenever in doubt between a flashy solution and a trustworthy one, choose the trustworthy one.

Whenever in doubt between a pretty chart and an auditable number, choose the auditable number.

Whenever in doubt between magic AI and a confirmable flow, choose the confirmable flow.

Whenever in doubt between a sophisticated abstraction and a simple implementation that works, choose the simple one.

The goal is not to look complex. The goal is to be useful, secure and hard to break.
