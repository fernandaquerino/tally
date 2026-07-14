# System Design — Tally MVP

## Requisitos

### Funcionais (do mvp-scope.md)
Registro de transações (form + linguagem natural via IA) · contextos PF/PJ · cartão por fatura · split de recebimento com provisões · painel PJ · resumo mensal · alertas/resumo semanal · exportação CSV · auth.

### Não-funcionais
| Requisito | Alvo | Racional |
|---|---|---|
| Latência p95 (CRUD transação) | <300ms | Promessa dos 10s |
| Disponibilidade | ≥99,5% | Solo dev; sem SLA agressivo |
| Escala inicial | ~1k usuários, ~100 req/s pico | MVP; não superengenheirar |
| Integridade de dados | Zero perda; auditável | Diferencial de confiança |
| Custo | <US$ 50/mês infra + teto de IA | Bootstrapped |
| Time | 1 dev (também objetivo de aprendizado Next/Nest) | Simplicidade > elegância |

## Visão de alto nível

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (desktop / mobile PWA)                              │
│  Next.js (App Router) — SSR/ISR marketing + SPA autenticada  │
└──────────────┬──────────────────────────────────────────────┘
               │ HTTPS (REST/JSON, cookies httpOnly)
┌──────────────▼──────────────────────────────────────────────┐
│  NestJS API (monólito modular)                               │
│  módulos: auth · users · households(v2) · contexts ·         │
│  accounts · cards · invoices · transactions · splits ·       │
│  provisions · categories · insights(IA) · exports · jobs     │
└───────┬───────────────────────┬─────────────────┬───────────┘
        │ Prisma                │ BullMQ          │ HTTPS
┌───────▼────────┐     ┌────────▼───────┐  ┌──────▼──────────┐
│  PostgreSQL    │     │  Redis (filas, │  │  LLM API        │
│  (fonte única  │     │  cache leve)   │  │  (categorizar,  │
│  de verdade)   │     │                │  │  parsear, resumo)│
└────────────────┘     └────────────────┘  └─────────────────┘
```

Decisões-chave: monólito modular (não microserviços — ADR implícito: time de 1), REST (não GraphQL: menos superfície de aprendizado e de segurança), fonte única de verdade no servidor (anti-lição Mobills: nada de estado autoritativo no cliente).

## Fluxos críticos

### Lançamento por linguagem natural (F3)
```
1. POST /ai/parse-transaction {text}
2. Nest → LLM (prompt com categorias do usuário + contextos) → JSON estruturado
3. Resposta = PROPOSTA (não persiste)
4. Usuário confirma → POST /transactions (payload normal)
5. Correções do usuário viram sinal (tabela ai_feedback) p/ few-shot futuro
```
Regras: timeout 5s com fallback pro formulário; validação Zod/class-validator do JSON da LLM (nunca confiar na saída); custo controlado: modelo pequeno + cache de padrões repetidos do usuário.

### Split de recebimento (F4) — transacional
```
POST /transactions/:id/split {rules}
→ Em UMA transação de banco (Prisma $transaction):
   1. receita PJ (já criada)
   2. provision (imposto) — status: pending, due_date
   3. transfer reserva (PJ → conta-reserva)
   4. transfer pró-labore (contexto PJ → contexto PF)
→ Tudo referencia split_id (auditabilidade: clicar no número → ver origem)
```

### Jobs assíncronos (BullMQ)
- `weekly-summary`: cron semanal → agrega mês do usuário → LLM gera 3 frases → e-mail + in-app
- `provision-reminders`: cron diário → provisões a vencer em 7/1 dias → notificação
- `invoice-close`: cron diário → fecha faturas cujo ciclo terminou
- `anomaly-check` (básico): gasto > Nx média da categoria → alerta
Racional do Redis/BullMQ: só para jobs; se pesar no início, degrada para cron simples (@nestjs/schedule) sem Redis — decisão reversível.

## API (esboço dos recursos principais)
```
POST   /auth/register | /auth/login | /auth/refresh
GET    /me
CRUD   /accounts /cards /categories
GET    /cards/:id/invoices · GET /invoices/:id
CRUD   /transactions (?context=PF|PJ&month=)
POST   /transactions/:id/split
CRUD   /provisions · POST /provisions/:id/pay
POST   /ai/parse-transaction
GET    /reports/monthly?month= · GET /reports/pj-panel
GET    /exports/full (CSV/JSON)
```
Convenções: paginação cursor-based em /transactions; idempotency-key em POSTs de escrita (retry seguro no PWA offline); versionamento /v1 desde o início.

## PWA / offline (escopo mínimo)
- Instalável (manifest + service worker)
- Fila local (IndexedDB) só para CRIAÇÃO de transações offline → flush com idempotency-key
- Leituras offline: último snapshot cacheado, marcado como "desatualizado"
- Fora do escopo: edição offline, resolução de conflito complexa (fonte de bugs; anti-lição Wallet)

## Observabilidade
- Logs estruturados (pino) + request-id
- Sentry (front + API)
- Métricas de guardrail: latência p95, erros 5xx, custo IA/dia
- Health checks p/ deploy

## Deploy (MVP)
- Front: Vercel (Next nativo)
- API + Postgres + Redis: Railway/Fly/Render (1 região, São Paulo se possível)
- Migrations: Prisma Migrate no CI antes do deploy
- Backups: snapshot diário do Postgres + teste de restore mensal (ritual, não só config)

## O que revisitar quando crescer
- Separar workers de API (mesmo código, processos distintos)
- Read replicas se relatórios pesarem
- Fila de e-mail dedicada
- Rate limit por plano (hoje: global por IP+user)
- Multi-região: não antes de milhares de usuários
