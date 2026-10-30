# ADR-0008: Cookie-based authentication and tenancy derived from the session

**Status:** Accepted · **Date:** 2026-08-04

## Context

Tally stores private financial data and needs to protect the authenticated area from the start. Authentication must work between Next.js and the NestJS API without exposing credentials to the browser's JavaScript, while authorization must ensure that no request arbitrarily chooses the `userId` or `householdId` used in queries.

In the MVP, each person starts as the `OWNER` of an individual household, but the model already uses `HouseholdMember` to allow future evolution without removing multi-tenant isolation. Since web and API are separate applications, the strategy must also handle cookies, CORS, session renewal, logout and protection against refresh token theft or reuse.

The main forces are:

- minimize the impact of an access token theft;
- prevent cross-household access (IDOR/BOLA);
- keep the session after a page reload without using `localStorage`;
- allow revocation and detection of refresh token reuse;
- keep the API as the single authority for authentication and authorization;
- avoid a distributed session infrastructure more complex than needed for the MVP.

## Options considered

### A: Long-lived JWT stored in the browser

The frontend would store a single JWT in `localStorage` or memory and send it in the `Authorization` header.

**Pros:** simple implementation; no need to persist sessions in the database.  
**Cons:** a token in `localStorage` is accessible in case of XSS; reloading the page loses tokens kept only in memory; a long JWT widens the abuse window; logout offers no effective revocation. Rejected for not meeting the trust level required by a financial product.

### B: Short JWT in a cookie and a rotating refresh token (chosen)

The API issues a short-lived JWT access token and an opaque refresh token. Both travel only in `httpOnly` cookies; the refresh token is rotated and its original value is never stored in the database.

**Pros:** reduces XSS exposure; limits the access token's lifetime; allows revocation, logout and reuse detection; keeps the server as the session authority.  
**Cons:** requires persistence and a rotation transaction; requires care with cookies, CORS, CSRF and concurrent refresh requests; an already-issued access token remains valid until it expires.

### C: An opaque session queried in the database on every request

A single random session identifier would be stored in a cookie, and each authenticated request would query the session in PostgreSQL or Redis.

**Pros:** immediate revocation and a simple mental model.  
**Cons:** adds a session read to every request; increases database/cache dependency on the critical path; doesn't bring enough benefit in the MVP versus a short JWT with a persisted refresh.

### D: Authentication controlled by Next.js/Auth.js

Next.js would be responsible for the session and would pass identity to the API.

**Pros:** convenient integration with pages and OAuth providers.  
**Cons:** creates two authorities or requires additional trust between web and API; makes it harder to apply the same policy to future clients; moves tenancy authorization outside the API. Rejected at this stage. OAuth can be incorporated later without transferring session authority to the frontend.

## Decision

Adopt option B. The NestJS API will be solely responsible for validating credentials, issuing and renewing tokens, setting cookies and deriving the identity used by authorization. The web will never receive tokens in JSON, will never store tokens in `localStorage` or Zustand, and will reconstruct the session via an authenticated `GET /v1/me` endpoint.

### Access token

- It will be a JWT signed and validated exclusively by the API.
- It will have a default lifetime of 15 minutes, configurable per environment.
- It will contain only minimal claims: the user identifier (`sub`), `householdId`, role in the household, token identifier (`jti`), issuance and expiration, plus validated `iss` and `aud`.
- It will not contain email, name, fiscal or financial data.
- It will be sent in an `httpOnly` cookie, `Secure` in production and `SameSite=Lax`.
- The frontend will not validate the JWT nor have access to the API's secret or private key.

The access token will not have a denylist in the MVP. On logout or upon detecting compromise, the refresh tokens are revoked and the cookies are removed; a previously stolen access token can remain valid for at most its short expiration. If that risk ceases to be acceptable, this ADR will need to be superseded by a strategy with a queryable session or a denylist.

### Refresh token and rotation

- The refresh token will be an opaque, cryptographically random, high-entropy value; it will not be a JWT.
- Only a deterministic hash of the token will be persisted. The plaintext token will exist only in the client's cookie.
- Each token will belong to a rotation family and will have an expiration, a revocation date and enough reference to identify its replacement.
- `POST /v1/auth/refresh` will perform, in a single database transaction, the validation of the current token, its revocation and the creation of its successor.
- Reusing an already-rotated token will revoke all active refresh tokens of the same family and require a new login.
- The client must perform refresh in a single flow to avoid concurrent rotations of the same session.
- `POST /v1/auth/logout` will revoke the presented family and remove the cookies, even when the logout response may be idempotent.

The password hash and the refresh token hash have different needs. Passwords will be protected with Argon2id and parameters configured and tested for the environment. Refresh tokens, having server-generated entropy, may use a deterministic cryptographic hash suitable for lookup and comparison, without storing the original value.

### Cookies, CORS and CSRF

- Access and refresh will use separate cookies, with names and lifetimes centralized in the API configuration.
- The refresh cookie will have the narrowest `Path` compatible with the refresh and logout endpoints; the access cookie needs to reach the authenticated endpoints.
- Cookies will be host-only by default. A shared domain will only be configured when the production topology requires it and it is documented.
- The API will accept credentials only from explicitly allowed web origins; no wildcard CORS with credentials.
- Write endpoints will validate a trusted origin, in addition to `SameSite=Lax`. If web and API need to operate cross-site, explicit CSRF protection will be mandatory before switching to `SameSite=None`.
- Cookies will be cleared using the same name, domain and path attributes used at creation.

### Sign up and initial household

Sign up will atomically create:

1. the user with a password protected by Argon2id;
2. an individual household;
3. the `HouseholdMember` link with the `OWNER` role;
4. the first refresh token family, if sign up also starts the session.

Failure at any step will undo the whole operation. The client will never send `userId`, `householdId` or role as an authorization source.

### Authorization and tenancy

- The `AuthGuard` will validate the access token's signature, expiration, issuer and audience and produce a typed authenticated identity.
- The `TenancyGuard` will derive the tenancy context from that identity; parameters sent by the client will never replace that context.
- Domain repositories will require `householdId` received from the authenticated context and apply that filter to all queries.
- Role-sensitive operations or membership changes will re-validate the association on the server, since a JWT's claims may become outdated until expiration.
- Missing resources and resources belonging to another household must produce responses that don't allow enumerating third-party data.
- Every authenticated endpoint will have an isolation test in which a user tries to access another household's resource.

### Session on the web

- `GET /v1/me` will be the source of truth of the session visible to the web.
- The session state will be treated as server state, preferably via React Query; Zustand may keep only ephemeral interface state.
- The `(app)` area layout will redirect people without a session to `/login`, but this navigation protection will not replace the API guards.
- Login, sign up, refresh and logout will use requests with credentials enabled.
- After logout, the session cache will be removed or invalidated before the redirect.

### Operational protections

- Login and sign up will respond without revealing credential details and will not log passwords, tokens, cookies or full emails.
- Authentication endpoints will have rate limiting by IP and, when applicable, by normalized identifier, with generic responses for invalid credentials.
- Secrets and token parameters will be validated at startup and kept out of the repository.
- Reuse, revocation and authentication failure events may be audited without logging the token or financial data.

## Consequences

- Gets easier: restoring the session without exposing tokens to JavaScript; revoking refresh tokens; detecting theft via reuse; keeping a single identity authority; applying tenancy consistently in the API.
- Gets harder: coordinating concurrent refresh; configuring cookies between web and API; testing expiration, rotation, reuse, logout, CORS and CSRF; handling the small window in which a revoked access token remains valid.
- Accepted trade-off: the MVP tolerates the access token's maximum residual validity of 15 minutes to avoid a query or denylist on every request.
- Revisit when: there are multiple households selectable per user; OAuth/social login; a native app; a need for immediate revocation; a truly cross-site deployment; or evidence that PostgreSQL persistence/rotation became a bottleneck.

## Actions

1. [x] Add the refresh token model and a new Prisma migration, including family and rotation/revocation data.
2. [x] Create the auth module in NestJS with Argon2id, JWT issuance, cookies and transactional rotation.
3. [x] Create `AuthGuard`, `TenancyGuard` and the typed authenticated context.
4. [x] Create `GET /v1/me` and the shared authentication contracts.
5. [x] Create login/sign up pages and session state on the web without local token persistence.
6. [x] Add rate limiting and origin validation on the authentication endpoints.
7. [ ] Cover atomic sign up, login, refresh, reuse, logout and cross-household isolation with automated tests. — _Partial: **cross-household isolation (IDOR) covered** (see the 2026-08-05 note); the service/e2e tests for sign up/login/refresh/reuse/logout are still missing._

## Implementation note (2026-08-05) — global tenancy (S1-02)

- `AuthGuard` and `TenancyGuard` became **global** (`APP_GUARD`, order `Auth → Tenancy`): every route is fail-closed by default. Identity/health routes opt out with the `@Public()` decorator.
- Domains access the database through a `TenantScopedRepository` (`common/repositories`), whose `scope(householdId, where)` injects the session's `householdId` **last**, making it impossible to forge the tenant via input. The `@CurrentHousehold()` decorator hands that id to the handlers.
- Isolation proven by an A/B IDOR test with a real Postgres (`*.int.test.ts`, runs in CI and locally with `TEST_DATABASE_URL`). The API's test runner became **Vitest**.

## Implementation note (2026-08-04)

- The `PrismaClient` and the schema moved to the workspace package **`@tally/db`** (`packages/db`), consumed by the API via `PrismaService` and by the seed. A structural decision (it doesn't change this ADR's policy); see also ADR-0004.
- A non-sensitive hint cookie `tally_session` (host-only, no token) lets the Next middleware know there's a session without reading the httpOnly access token; the client's silent refresh renews the 15-minute access token transparently.

### OAuth (Google + GitHub) on the backend

Consistent with the rejection of Option D, social login runs **on the API** (Authorization Code flow, implemented without passport), not on Next.js/Auth.js:

- `GET /v1/auth/oauth/:provider` → generates `state` (a single-use httpOnly cookie, CSRF) and redirects to consent.
- `GET /v1/auth/oauth/:provider/callback` → validates the `state`, exchanges the `code`, reads the profile and **issues the same session** (httpOnly cookies + rotating refresh). Redirects to `WEB_APP_URL/dashboard`, or `/login?error=…` on failure.
- Account linking: first by **provider id** (`google_id`/`github_id`); if none, links to an existing account **only with a verified email** (avoids takeover, threat-model S); otherwise creates a new account without a password. An email already used by another account without verification → an error asking to log in with a password.
- Providers are **optional** (credentials in env); without credentials the endpoint redirects with `error=oauth_unavailable`. The API remains the single session authority — the front only has anchors to the endpoints.
