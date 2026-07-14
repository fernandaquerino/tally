# ADR-0004: Monorepo com pnpm workspaces (+ Turborepo)

**Status:** Aceito · **Data:** 2026-07-13

## Contexto
Duas aplicações (web, api) + código compartilhado (schemas Zod, tipos, utilitários de dinheiro). Solo dev: custo de contexto entre repositórios é alto.

## Opções
### A: Dois repositórios
**Contras:** versionar `@tally/shared` via npm privado ou copy-paste; PRs duplos; drift de tipos.

### B: Monorepo pnpm workspaces + Turborepo (escolhida)
**Prós:** um clone, um PR, tipos compartilhados por import direto; cache de build; padrão de mercado que também vale aprender.
**Contras:** setup inicial um pouco maior; deploys precisam de filtro por app (Vercel e Railway suportam).

## Decisão
```
tally/
├── apps/web        (Next.js)
├── apps/api        (NestJS)
├── packages/shared (schemas Zod, tipos, money utils)
└── packages/config (eslint, tsconfig)
```

## Consequências
- Fica mais fácil: consistência de tipos, refactors cross-app.
- Revisitar quando: nunca no horizonte do projeto.
