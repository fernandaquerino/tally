# 💰 Tally

> **O app financeiro para quem vive de CNPJ.** Controle o PJ e o pessoal no mesmo lugar, com IA que te diz quanto do seu faturamento é realmente seu.

**Status:** 🚧 em desenvolvimento — fase de discovery/fundação (pré-MVP). Ainda não há release utilizável.

---

## O problema

Milhões de brasileiros vivem de CNPJ próprio — MEIs, freelancers, consultores PJ. A vida financeira deles tem uma característica que nenhum app atende: **PF e PJ são a mesma pessoa, mas precisam ser dinheiros diferentes.**

O resultado: ~60% dos MEIs já usaram dinheiro pessoal pra pagar dívidas da empresa (Sebrae), o DAS vem como susto, e "faturei R$ 12 mil, por que não sobrou nada?" é a pergunta sem resposta. Os apps de finanças pessoais (Mobills, Organizze, Pierre) ignoram o PJ; as ferramentas PJ (Cora, MEI Fácil) ignoram a vida pessoal.

## A solução

O Tally trata as duas vidas juntas, sem misturá-las:

- 🧾 **Divisor de recebimento** — entrou R$ 5.000 de um cliente? O Tally separa na hora: imposto, reserva, e o que é de fato o seu salário
- 🟦🟩 **PF/PJ em 1 clique** — toda transação tem contexto; cartão misto é separado nos relatórios
- 💳 **Cartão modelado certo** — fatura por competência, parcelas projetadas, saldo que bate
- 🤖 **IA que trabalha, não que enrola** — lançamento por linguagem natural ("almoço com cliente 45, empresa"), categorização que aprende, resumo semanal em 3 frases e avisos antes do susto (DAS em 7 dias, teto MEI a 85%)
- 📤 **Seus dados são seus** — exportação completa em 1 clique, sempre

## Stack

| Camada   | Tecnologia                                                                                |
| -------- | ----------------------------------------------------------------------------------------- |
| Frontend | Next.js 15 (App Router) · React Query · Zustand · Tailwind + shadcn/ui                    |
| Backend  | NestJS (monólito modular) · REST `/v1`                                                    |
| Dados    | PostgreSQL 16 · Prisma · Redis (BullMQ)                                                   |
| IA       | LLM via API (parsing, categorização, resumos) — validação estrita, humano sempre confirma |
| Infra    | Vercel (web) · Railway/Fly (api+db) · GitHub Actions                                      |
| Monorepo | pnpm workspaces + Turborepo                                                               |

Decisões registradas em ADRs: [web-first](docs/architecture/adr/0001-web-first.md) · [Next+Nest](docs/architecture/adr/0002-stack-next-nest.md) · [Postgres+Prisma](docs/architecture/adr/0003-postgres-prisma.md) · [cartão por fatura](docs/architecture/adr/0005-cartao-por-fatura.md) · [dinheiro em centavos](docs/architecture/adr/0006-dinheiro-em-centavos.md) · [manual-first sem Open Finance](docs/architecture/adr/0007-manual-first-sem-open-finance.md)

## Estrutura do repositório

```
tally/
├── apps/
│   ├── web/          # Next.js — landing + app autenticada (PWA)
│   └── api/          # NestJS — API REST /v1
├── packages/
│   ├── shared/       # schemas Zod, tipos da API, utils de dinheiro
│   └── config/       # eslint, tsconfig compartilhados
├── prisma/           # schema, migrations, seed
└── docs/             # 📚 discovery, produto, UX e arquitetura
```

## Rodando localmente

> ⚠️ O código ainda está em construção (milestone M0). Instruções-alvo:

```bash
# pré-requisitos: Node 20+, pnpm, Docker

git clone https://github.com/<user>/tally.git
cd tally
pnpm install

cp .env.example .env        # preencha as variáveis

docker compose up -d        # Postgres + Redis
pnpm db:migrate             # aplica migrations
pnpm db:seed                # dados de exemplo

pnpm dev                    # web em :3000, api em :3001
```

Scripts úteis: `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm test:e2e` · `pnpm build`

## Documentação

| Área                                                                        | Onde                                                                                                           |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 🧭 Discovery (pesquisa, análise competitiva, hipóteses)                     | [`docs/discovery/`](docs/discovery/)                                                                           |
| 🎯 Produto (visão, público, escopo do MVP, métricas)                        | [`docs/product/`](docs/product/)                                                                               |
| 🎨 UX (jornadas, fluxos, princípios de design)                              | [`docs/ux/`](docs/ux/)                                                                                         |
| 🏗️ Arquitetura (system design, modelo de domínio/dados, threat model, ADRs) | [`docs/architecture/`](docs/architecture/) — comece por [`architecture.md`](docs/architecture/architecture.md) |

## Roadmap (milestones)

- [ ] **M0 — Fundação:** monorepo, CI, Docker, deploy hello-world
- [ ] **M1 — Walking skeleton:** auth, tenancy (+ testes de IDOR), CRUD de transações PF/PJ, home com 3 números
- [ ] **M2 — O diferencial:** onboarding fiscal, divisor de recebimento, provisões, painel PJ
- [ ] **M3 — Cartão por fatura:** faturas, parcelamento, fechamento, pagamento
- [ ] **M4 — IA v1:** lançamento por linguagem natural, categorização, resumo semanal
- [ ] **M5 — Beta:** PWA/offline, exportação, e-mails, checklist de segurança

Pós-MVP: import CSV/OFX e visão do contador (v1.5) → conta família e metas (v2) → Open Finance (v2+).

## Princípios inegociáveis

1. **Números que batem são sagrados** — todo total é auditável; saldo é derivado, nunca "verdade" armazenada
2. **Isolamento por tenant em toda query** — testes de IDOR são gate de release
3. **IA propõe, humano confirma** — a LLM nunca persiste nada e nunca calcula imposto
4. **A saída é fácil** — exportar tudo em 1 minuto é feature, não risco

## Licença

📝 A definir antes do repositório se tornar público (ver `Decision Needed` em [`docs/architecture/architecture.md`](docs/architecture/architecture.md#13-documentação-do-repositório)).

---

_Projeto solo em construção pública — feito também para praticar Next.js e NestJS a fundo. Feedback e ideias são bem-vindos via issues._
