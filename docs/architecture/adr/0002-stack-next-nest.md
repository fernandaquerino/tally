# ADR-0002: Stack — Next.js (front) + NestJS (API) + TypeScript

**Status:** Aceito · **Data:** 2026-07-13

## Contexto
Projeto solo com duplo objetivo: lançar o MVP e praticar Next e Nest (requisito declarado do fundador). TypeScript ponta a ponta reduz classes de bug e permite compartilhar tipos.

## Opções consideradas
### A: Next full-stack (API routes/server actions, sem Nest)
**Prós:** menos código, um deploy. **Contras:** não atende o objetivo de aprender Nest; API acoplada ao front dificulta o app mobile futuro (que consumirá a mesma API); domínio financeiro (invariantes, jobs, filas) se organiza melhor em módulos Nest.

### B: Next + NestJS separados (escolhida)
**Prós:** objetivo de aprendizado; API independente pronta pro mobile v2; DI/módulos/guards do Nest ajudam nas invariantes e no multi-tenant; BullMQ integra bem.
**Contras:** duas aplicações para operar; alguma duplicação de validação (mitigada com pacote compartilhado de schemas Zod).

### C: Next + backend em outra linguagem (Go/Elixir)
Descartada: fora do objetivo de aprendizado; custo de contexto.

## Decisão
Next.js (App Router) para o front (landing SSR + app autenticada) e NestJS para a API REST. TypeScript estrito em ambos; validação compartilhada via pacote `@tally/shared` (Zod).

## Consequências
- Fica mais fácil: mobile futuro (API pronta), organização do domínio, aprendizado.
- Fica mais difícil: dois deploys, CORS/cookies entre domínios (usar subdomínios app./api. com cookie no domínio raiz).
- Revisitar quando: nunca provavelmente — decisão também é o objetivo do projeto.
