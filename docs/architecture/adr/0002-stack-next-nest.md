# ADR-0002: Stack — Next.js (front) + NestJS (API) + TypeScript

**Status:** Accepted · **Date:** 2026-07-13

## Context

A solo project with a dual goal: ship the MVP and practice Next and Nest (a stated requirement of the founder). End-to-end TypeScript reduces classes of bugs and allows sharing types.

## Options considered

### A: Next full-stack (API routes/server actions, no Nest)

**Pros:** less code, one deploy. **Cons:** doesn't meet the goal of learning Nest; an API coupled to the front makes the future mobile app harder (it will consume the same API); the financial domain (invariants, jobs, queues) is better organized in Nest modules.

### B: Next + NestJS separated (chosen)

**Pros:** the learning goal; an independent API ready for mobile v2; Nest's DI/modules/guards help with invariants and multi-tenancy; BullMQ integrates well.
**Cons:** two applications to operate; some validation duplication (mitigated with a shared package of Zod schemas).

### C: Next + a backend in another language (Go/Elixir)

Rejected: outside the learning goal; context cost.

## Decision

Next.js (App Router) for the front (SSR landing + authenticated app) and NestJS for the REST API. Strict TypeScript in both; shared validation via the `@tally/shared` package (Zod).

## Consequences

- Gets easier: future mobile (API ready), domain organization, learning.
- Gets harder: two deploys, CORS/cookies between domains (use app./api. subdomains with a cookie on the root domain).
- Revisit when: probably never — the decision is also the project's goal.
