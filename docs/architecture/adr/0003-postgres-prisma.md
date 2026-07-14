# ADR-0003: PostgreSQL + Prisma

**Status:** Aceito · **Data:** 2026-07-13

## Contexto

Dados financeiros exigem transações ACID (o split cria 3-4 registros atomicamente — invariantes do domain-model), integridade referencial e consultas relacionais (fatura ⇄ transações ⇄ contexto).

## Opções consideradas

### A: PostgreSQL + Prisma (escolhida)

**Prós:** ACID; constraints (CHECKs das invariantes) no banco; Prisma = DX excelente p/ solo dev, migrations versionadas, tipos gerados; ecossistema Nest maduro; jsonb cobre payloads flexíveis (fiscal_rules, evidence).
**Contras:** Prisma abstrai SQL avançado (mitigável com views/SQL raw parametrizado quando preciso).

### B: MongoDB

**Contras decisivos:** transações multi-documento piores; sem FKs/CHECKs nativos; modelagem relacional (fatura/parcelas/split) vira aplicação. Descartada.

### C: Postgres + TypeORM/Drizzle

TypeORM: manutenção irregular. Drizzle: ótimo, mas Prisma tem curva menor e docs melhores para o objetivo de aprendizado. Escolha reversível (é só a camada de acesso).

## Decisão

PostgreSQL 16 com Prisma. Invariantes críticas duplicadas como constraints no banco (não só na aplicação).

## Consequências

- Fica mais fácil: atomicidade do split, reconciliação, migrations.
- Fica mais difícil: nada relevante no MVP.
- Revisitar quando: relatórios pesarem (read replica / views materializadas — já previsto em data-model).
