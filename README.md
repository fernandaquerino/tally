# 💰 Tally

> **O app financeiro para quem vive de CNPJ.** Controle o PJ e o pessoal no mesmo lugar, com IA que te diz quanto do seu faturamento é realmente seu.

**Status:** 🚧 em desenvolvimento — discovery concluído e backlog do app completo em mapeamento. Ainda não há release utilizável.

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

> ⚠️ O código ainda está em construção (milestone M0).

```bash
# pré-requisitos: Node 20+, pnpm, Docker

git clone https://github.com/<user>/tally.git
cd tally
pnpm install

cp .env.example .env        # valores locais prontos para desenvolvimento

docker compose up -d        # Postgres + Redis

pnpm dev                    # web em :3000, api em :3001
```

### Infraestrutura local

```bash
# subir Postgres e Redis em segundo plano
docker compose up -d

# consultar estado e healthchecks
docker compose ps

# derrubar os containers preservando os dados
docker compose down

# reset completo: derruba containers e apaga os volumes locais
docker compose down -v
```

O volume nomeado `tally_postgres_data` mantém os dados do PostgreSQL entre
reinícios e execuções de `docker compose down`. O comando de reset com `-v` é
destrutivo e deve ser usado somente quando for necessário recriar o ambiente.
Por padrão, os serviços são publicados em `localhost:5433` (PostgreSQL) e
`localhost:6380` (Redis), evitando conflito com instalações locais nas portas
padrão; ambos podem ser alterados no arquivo `.env`.

Scripts úteis: `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm test:e2e` · `pnpm build` · `pnpm format`

### Qualidade e git hooks

O projeto usa [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged)
para validar cada commit, e um workflow de CI que roda em todo pull request.

**Instalação:** os hooks são configurados automaticamente após `pnpm install`
(script `prepare`, que executa `husky`). Não é preciso nenhum passo manual — se
você já instalou as dependências, o hook de `pre-commit` já está ativo.

**O que roda no `pre-commit`:** apenas verificações rápidas sobre os arquivos
_staged_ (via `lint-staged`):

- `*.{ts,tsx,js,jsx,mjs,cjs}` → `eslint --fix` + `prettier --write`
- `*.{json,md,yml,yaml,css}` → `prettier --write`

Erros de lint que não podem ser corrigidos automaticamente **bloqueiam o commit**.
`typecheck`, testes completos e `build` ficam por conta da CI, para não deixar o
commit local lento.

```bash
# formatar todo o repositório manualmente, se necessário
pnpm format

# pular os hooks em uma emergência (evite usar no dia a dia)
git commit --no-verify
```

**CI:** o workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) roda em
pull requests (e em pushes para `main`) e executa, em sequência, `pnpm lint`,
`pnpm typecheck`, `pnpm test` e `pnpm build`. Qualquer falha reprova a checagem.

## Documentação

| Área                                                                        | Onde                                                                                                           |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 🧭 Discovery (pesquisa, análise competitiva, hipóteses)                     | [`docs/discovery/`](docs/discovery/)                                                                           |
| 🎯 Produto (visão, público, escopo do MVP, métricas)                        | [`docs/product/`](docs/product/)                                                                               |
| 🎨 UX (jornadas, fluxos, princípios de design)                              | [`docs/ux/`](docs/ux/)                                                                                         |
| 🏗️ Arquitetura (system design, modelo de domínio/dados, threat model, ADRs) | [`docs/architecture/`](docs/architecture/) — comece por [`architecture.md`](docs/architecture/architecture.md) |

## Telas principais

O roadmap foi organizado por telas/domínios para facilitar o desenvolvimento no GitHub Projects:

- **Dashboard** — visão geral, 3 números principais, painel PJ e alertas
- **Transações** — lançamento rápido, PF/PJ, recorrências, parcelamentos e split de recebimento
- **Contas** — contas PF/PJ, saldos derivados, transferências e auditoria de saldo
- **Categorias** — categorias padrão e customizadas por contexto
- **Cartões** — cartões, faturas por competência, parcelas, fechamento e pagamento
- **Metas** — objetivos financeiros PF/PJ, progresso e contribuições
- **Dívidas** — dívidas, parcelas, prioridade de pagamento e comprometido futuro
- **Relatórios** — fechamento mensal, filtros PF/PJ/Tudo, drill-down e exportação
- **Settings** — perfil, fiscal, regras de split, segurança, dados e preferências

## Roadmap (milestones)

- [ ] **Sprint 0 — Fundação:** monorepo, Next.js, NestJS, PostgreSQL, Redis, Prisma, CI, seed, design system mínimo e ADRs
- [ ] **Sprint 1 — App Shell + Auth:** registro/login, sessão, tenancy, onboarding fiscal, layout autenticado e sidebar com todas as telas
- [ ] **Sprint 2 — Dashboard:** home com 3 números, painel PJ, próximos alertas e últimas transações
- [ ] **Sprint 3 — Transações:** CRUD, lançamento em menos de 10s, filtros, recorrências, parcelamentos e divisor de recebimento PJ
- [ ] **Sprint 4 — Contas:** contas PF/PJ, saldos derivados, transferências, pró-labore e reconciliação
- [ ] **Sprint 5 — Categorias:** categorias por contexto, categorias padrão/customizadas e sugestão de última categoria usada
- [ ] **Sprint 6 — Cartões:** cartões, faturas, compra parcelada, fechamento automático e pagamento de fatura
- [ ] **Sprint 7 — Metas:** metas PF/PJ, progresso, contribuições e widget compacto no dashboard
- [ ] **Sprint 8 — Dívidas:** cadastro de dívidas, parcelas, pagamentos, priorização e impacto no comprometido futuro
- [ ] **Sprint 9 — Relatórios:** relatório mensal, filtros PF/PJ/Tudo, gráficos expansíveis, drill-down e export CSV/JSON
- [ ] **Sprint 10 — Settings:** perfil, configurações fiscais, regras de split, segurança, exportação, exclusão de conta e preferências
- [ ] **Sprint 11 — IA + Alertas:** lançamento por linguagem natural, categorização com feedback, insights, alertas e resumo semanal
- [ ] **Sprint 12 — PWA + Beta:** PWA instalável, fila offline, idempotência, observabilidade, E2E, deploy, backup/restore e checklist beta

> Observação: o MVP original priorizava o momento AHA do split PJ. Este roadmap é a versão **app completo de portfólio**, já incluindo Metas e Dívidas como telas planejadas desde o começo.

Pós-beta: import CSV/OFX, visão do contador, conta família, Open Finance e integrações com emissores de NF/contabilidade.

## Princípios inegociáveis

1. **Números que batem são sagrados** — todo total é auditável; saldo é derivado, nunca "verdade" armazenada
2. **Isolamento por tenant em toda query** — testes de IDOR são gate de release
3. **IA propõe, humano confirma** — a LLM nunca persiste nada e nunca calcula imposto
4. **A saída é fácil** — exportar tudo em 1 minuto é feature, não risco

## Licença

📝 A definir antes do repositório se tornar público (ver `Decision Needed` em [`docs/architecture/architecture.md`](docs/architecture/architecture.md#13-documentação-do-repositório)).

---

_Projeto solo em construção pública — feito também para praticar Next.js e NestJS a fundo. Feedback e ideias são bem-vindos via issues._
