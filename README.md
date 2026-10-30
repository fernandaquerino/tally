# 💰 Tally

> **The finance app for people who live off their own company (CNPJ).** Manage business and personal money in the same place, with AI that tells you how much of your revenue is actually yours.

**Status:** 🚧 in development — discovery done and the full app backlog being mapped. There is no usable release yet.

---

## The problem

Millions of Brazilians live off their own company (CNPJ) — micro-entrepreneurs (MEIs), freelancers, independent consultants. Their financial life has a trait no app addresses: **personal and business are the same person, but they need to be different money.**

The result: ~60% of MEIs have already used personal money to pay company debts (Sebrae), the monthly tax (DAS) comes as a shock, and "I billed R$ 12k, why is there nothing left?" is the unanswered question. Personal finance apps (Mobills, Organizze, Pierre) ignore the business side; business tools (Cora, MEI Fácil) ignore personal life.

## The solution

Tally handles both lives together, without mixing them:

- 🧾 **Income splitter** — got R$ 5,000 from a client? Tally splits it right away: tax, reserve, and what's actually your salary
- 🟦🟩 **Personal/business in one click** — every transaction has context; a mixed card is separated in the reports
- 💳 **Credit card modeled correctly** — statement by billing period, projected installments, a balance that adds up
- 🤖 **AI that works, not that stalls** — natural-language entry ("lunch with client 45, company"), categorization that learns, a 3-sentence weekly summary and warnings before the shock (DAS in 7 days, MEI ceiling at 85%)
- 📤 **Your data is yours** — full export in one click, always

## Stack

| Layer    | Technology                                                                              |
| -------- | --------------------------------------------------------------------------------------- |
| Frontend | Next.js 15 (App Router) · React Query · Zustand · Tailwind + shadcn/ui                   |
| Backend  | NestJS (modular monolith) · REST `/v1`                                                   |
| Data     | PostgreSQL 16 · Prisma · Redis (BullMQ)                                                  |
| AI       | LLM via API (parsing, categorization, summaries) — strict validation, human always confirms |
| Infra    | Vercel (web) · Railway/Fly (api+db) · GitHub Actions                                     |
| Monorepo | pnpm workspaces + Turborepo                                                              |

Decisions recorded as ADRs: [web-first](docs/architecture/adr/0001-web-first.md) · [Next+Nest](docs/architecture/adr/0002-stack-next-nest.md) · [Postgres+Prisma](docs/architecture/adr/0003-postgres-prisma.md) · [card by statement](docs/architecture/adr/0005-cartao-por-fatura.md) · [money in cents](docs/architecture/adr/0006-dinheiro-em-centavos.md) · [manual-first, no Open Finance](docs/architecture/adr/0007-manual-first-sem-open-finance.md)

## Repository structure

```
tally/
├── apps/
│   ├── web/          # Next.js — landing + authenticated app (PWA)
│   └── api/          # NestJS — REST API /v1
├── packages/
│   ├── shared/       # Zod schemas, API types, money utils
│   └── config/       # shared eslint, tsconfig
├── prisma/           # schema, migrations, seed
└── docs/             # 📚 discovery, product, UX and architecture
```

## Running locally

> ⚠️ The code is still being built (milestone M0).

```bash
# prerequisites: Node 20+, pnpm, Docker

git clone https://github.com/<user>/tally.git
cd tally
pnpm install

cp .env.example .env        # local values ready for development

docker compose up -d        # Postgres + Redis

pnpm dev                    # web on :3000, api on :3001
```

### Local infrastructure

```bash
# start Postgres and Redis in the background
docker compose up -d

# check state and healthchecks
docker compose ps

# stop the containers, keeping the data
docker compose down

# full reset: stop containers and delete the local volumes
docker compose down -v
```

The named volume `tally_postgres_data` keeps PostgreSQL data across restarts and
`docker compose down` runs. The reset command with `-v` is destructive and should
only be used when you need to recreate the environment. By default, the services
are published on `localhost:5433` (PostgreSQL) and `localhost:6380` (Redis),
avoiding conflicts with local installations on the default ports; both can be
changed in the `.env` file.

Useful scripts: `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm test:e2e` · `pnpm build` · `pnpm format`

### Quality and git hooks

The project uses [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged)
to validate each commit, plus a CI workflow that runs on every pull request.

**Installation:** the hooks are configured automatically after `pnpm install`
(the `prepare` script, which runs `husky`). No manual step is needed — if you've
already installed the dependencies, the `pre-commit` hook is already active.

**What runs on `pre-commit`:** only fast checks on the staged files (via
`lint-staged`):

- `*.{ts,tsx,js,jsx,mjs,cjs}` → `eslint --fix` + `prettier --write`
- `*.{json,md,yml,yaml,css}` → `prettier --write`

Lint errors that can't be auto-fixed **block the commit**. `typecheck`, the full
test suite and `build` are left to CI, so the local commit stays fast.

```bash
# format the whole repo manually, if needed
pnpm format

# skip the hooks in an emergency (avoid in day-to-day use)
git commit --no-verify
```

**CI:** the [`.github/workflows/ci.yml`](.github/workflows/ci.yml) workflow runs on
pull requests (and on pushes to `main`) and runs, in sequence, `pnpm format:check`,
`pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build`. Any failure fails the check.

## Documentation

| Area                                                                 | Where                                                                                                          |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 🧭 Discovery (research, competitive analysis, hypotheses)            | [`docs/discovery/`](docs/discovery/)                                                                           |
| 🎯 Product (vision, audience, MVP scope, metrics)                    | [`docs/product/`](docs/product/)                                                                               |
| 🎨 UX (journeys, flows, design principles)                           | [`docs/ux/`](docs/ux/)                                                                                         |
| 🏗️ Architecture (system design, domain/data model, threat model, ADRs) | [`docs/architecture/`](docs/architecture/) — start with [`architecture.md`](docs/architecture/architecture.md) |

> The internal documentation under `docs/` is written in Brazilian Portuguese.

## Main screens

The roadmap is organized by screens/domains to make development on GitHub Projects easier:

- **Dashboard** — overview, 3 key numbers, business panel and alerts
- **Transactions** — quick entry, personal/business, recurrences, installments and income split
- **Accounts** — personal/business accounts, derived balances, transfers and balance audit
- **Categories** — default and custom categories per context
- **Cards** — cards, statements by billing period, installments, closing and payment
- **Goals** — personal/business financial goals, progress and contributions
- **Debts** — debts, installments, payment priority and future commitment
- **Reports** — monthly closing, personal/business/all filters, drill-down and export
- **Settings** — profile, tax, split rules, security, data and preferences

## Roadmap (milestones)

- [ ] **Sprint 0 — Foundation:** monorepo, Next.js, NestJS, PostgreSQL, Redis, Prisma, CI, seed, minimal design system and ADRs
- [ ] **Sprint 1 — App Shell + Auth:** register/login, session, tenancy, tax onboarding, authenticated layout and sidebar with all screens
- [ ] **Sprint 2 — Dashboard:** home with 3 numbers, business panel, upcoming alerts and latest transactions
- [ ] **Sprint 3 — Transactions:** CRUD, entry in under 10s, filters, recurrences, installments and the business income splitter
- [ ] **Sprint 4 — Accounts:** personal/business accounts, derived balances, transfers, owner's draw and reconciliation
- [ ] **Sprint 5 — Categories:** per-context categories, default/custom categories and last-used category suggestion
- [ ] **Sprint 6 — Cards:** cards, statements, installment purchases, automatic closing and statement payment
- [ ] **Sprint 7 — Goals:** personal/business goals, progress, contributions and a compact dashboard widget
- [ ] **Sprint 8 — Debts:** debt registry, installments, payments, prioritization and impact on future commitment
- [ ] **Sprint 9 — Reports:** monthly report, personal/business/all filters, expandable charts, drill-down and CSV/JSON export
- [ ] **Sprint 10 — Settings:** profile, tax settings, split rules, security, export, account deletion and preferences
- [ ] **Sprint 11 — AI + Alerts:** natural-language entry, categorization with feedback, insights, alerts and weekly summary
- [ ] **Sprint 12 — PWA + Beta:** installable PWA, offline queue, idempotency, observability, E2E, deploy, backup/restore and beta checklist

> Note: the original MVP prioritized the AHA moment of the business income split. This roadmap is the **full portfolio app** version, already including Goals and Debts as screens planned from the start.

Post-beta: CSV/OFX import, accountant view, family account, Open Finance and integrations with invoicing/accounting providers.

## Non-negotiable principles

1. **Numbers that add up are sacred** — every total is auditable; a balance is derived, never a stored "truth"
2. **Tenant isolation in every query** — IDOR tests are a release gate
3. **AI proposes, a human confirms** — the LLM never persists anything and never computes taxes
4. **The exit is easy** — exporting everything in one minute is a feature, not a risk

## License

[MIT](LICENSE) © fernandaquerino

---

_A solo project built in public — also made to practice Next.js and NestJS deeply. Feedback and ideas are welcome via issues._
