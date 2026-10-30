# ADR-0004: Monorepo with pnpm workspaces (+ Turborepo)

**Status:** Accepted · **Date:** 2026-07-13

## Context

Two applications (web, api) + shared code (Zod schemas, types, money utilities). Solo dev: the context cost of switching between repositories is high.

## Options

### A: Two repositories

**Cons:** versioning `@tally/shared` via a private npm or copy-paste; double PRs; type drift.

### B: pnpm workspaces monorepo + Turborepo (chosen)

**Pros:** one clone, one PR, shared types via direct import; build cache; an industry-standard worth learning too.
**Cons:** slightly larger initial setup; deploys need a per-app filter (Vercel and Railway support it).

## Decision

```
tally/
├── apps/web        (Next.js)
├── apps/api        (NestJS)
├── packages/shared (Zod schemas, types, money utils)
└── packages/config (eslint, tsconfig)
```

## Consequences

- Gets easier: type consistency, cross-app refactors.
- Revisit when: never within the project's horizon.
