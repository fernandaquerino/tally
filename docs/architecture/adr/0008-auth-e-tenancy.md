# ADR-0008: Autenticação por cookies e tenancy derivada da sessão

**Status:** Aceito · **Data:** 2026-08-04

## Contexto

O Tally armazena dados financeiros privados e precisa proteger a área autenticada desde o início. A autenticação deve funcionar entre o Next.js e a API NestJS sem expor credenciais ao JavaScript do browser, enquanto a autorização precisa garantir que nenhuma requisição escolha arbitrariamente o `userId` ou o `householdId` usado nas consultas.

No MVP, cada pessoa começa como `OWNER` de um household individual, mas o modelo já usa `HouseholdMember` para permitir evolução futura sem remover o isolamento multi-tenant. Como web e API são aplicações separadas, a estratégia também precisa tratar cookies, CORS, renovação de sessão, logout e proteção contra roubo ou reutilização de refresh tokens.

As forças principais são:

- minimizar o impacto do roubo de um access token;
- impedir acesso cruzado entre households (IDOR/BOLA);
- manter a sessão após recarregar a página sem usar `localStorage`;
- permitir revogação e detecção de reuso do refresh token;
- manter a API como única autoridade de autenticação e autorização;
- evitar uma infraestrutura de sessão distribuída mais complexa que o necessário para o MVP.

## Opções consideradas

### A: JWT de longa duração armazenado no browser

O frontend armazenaria um único JWT em `localStorage` ou memória e o enviaria no header `Authorization`.

**Prós:** implementação simples; não exige persistência de sessões no banco.  
**Contras:** token em `localStorage` fica acessível em caso de XSS; recarregar a página perde tokens mantidos apenas em memória; JWT longo amplia a janela de abuso; logout não oferece revogação efetiva. Descartada por não atender ao nível de confiança exigido por um produto financeiro.

### B: JWT curto em cookie e refresh token rotativo (escolhida)

A API emite um access token JWT de curta duração e um refresh token opaco. Ambos trafegam somente em cookies `httpOnly`; o refresh token é rotacionado e seu valor original nunca é armazenado no banco.

**Prós:** reduz exposição a XSS; limita a duração do access token; permite revogação, logout e detecção de reuso; mantém o servidor como autoridade da sessão.  
**Contras:** exige persistência e transação de rotação; requer cuidado com cookies, CORS, CSRF e requisições concorrentes de refresh; um access token já emitido permanece válido até expirar.

### C: Sessão opaca consultada no banco em toda requisição

Um único identificador aleatório de sessão seria armazenado em cookie, e cada requisição autenticada consultaria a sessão no PostgreSQL ou Redis.

**Prós:** revogação imediata e modelo mental simples.  
**Contras:** adiciona leitura de sessão a toda requisição; aumenta dependência de banco/cache no caminho crítico; não traz benefício suficiente no MVP frente ao JWT curto com refresh persistido.

### D: Autenticação controlada pelo Next.js/Auth.js

O Next.js seria responsável pela sessão e repassaria identidade para a API.

**Prós:** integração conveniente com páginas e providers OAuth.  
**Contras:** cria duas autoridades ou exige confiança adicional entre web e API; dificulta aplicar a mesma política a futuros clientes; desloca a autorização de tenancy para fora da API. Descartada nesta fase. OAuth poderá ser incorporado depois sem transferir a autoridade da sessão para o frontend.

## Decisão

Adotar a opção B. A API NestJS será a única responsável por validar credenciais, emitir e renovar tokens, definir cookies e derivar a identidade usada pela autorização. O web nunca receberá tokens em JSON, nunca armazenará tokens em `localStorage` ou Zustand e reconstruirá a sessão por um endpoint autenticado `GET /v1/me`.

### Access token

- Será um JWT assinado e validado exclusivamente pela API.
- Terá duração padrão de 15 minutos, configurável por ambiente.
- Conterá somente claims mínimas: identificador do usuário (`sub`), `householdId`, papel no household, identificador do token (`jti`), emissão e expiração, além de `iss` e `aud` validados.
- Não conterá e-mail, nome, dados fiscais ou financeiros.
- Será enviado em cookie `httpOnly`, `Secure` em produção e `SameSite=Lax`.
- O frontend não validará o JWT nem terá acesso ao segredo ou à chave privada da API.

O access token não terá denylist no MVP. Ao fazer logout ou detectar comprometimento, os refresh tokens são revogados e os cookies são removidos; um access token previamente roubado pode permanecer válido por no máximo sua curta expiração. Se esse risco deixar de ser aceitável, será necessário substituir esta ADR por uma estratégia com sessão consultável ou denylist.

### Refresh token e rotação

- O refresh token será um valor opaco, criptograficamente aleatório e de alta entropia; não será JWT.
- Apenas um hash determinístico do token será persistido. O token em claro existirá somente no cookie do cliente.
- Cada token pertencerá a uma família de rotação e terá expiração, data de revogação e referência suficiente para identificar sua substituição.
- `POST /v1/auth/refresh` executará, em uma única transação de banco, a validação do token atual, sua revogação e a criação do sucessor.
- A reutilização de um token já rotacionado revogará todos os refresh tokens ativos da mesma família e exigirá novo login.
- O cliente deverá executar refresh em fluxo único para evitar rotações concorrentes da mesma sessão.
- `POST /v1/auth/logout` revogará a família apresentada e removerá os cookies, mesmo quando a resposta de logout puder ser idempotente.

O hash de senha e o hash de refresh token têm necessidades diferentes. Senhas serão protegidas com Argon2id e parâmetros configurados e testados para o ambiente. Refresh tokens, por terem entropia gerada pelo servidor, poderão usar hash criptográfico determinístico adequado para busca e comparação, sem armazenar o valor original.

### Cookies, CORS e CSRF

- Access e refresh usarão cookies separados, com nomes e durações centralizados na configuração da API.
- O refresh cookie terá o menor `Path` compatível com os endpoints de refresh e logout; o access cookie precisa alcançar os endpoints autenticados.
- Cookies serão host-only por padrão. Um domínio compartilhado somente será configurado quando a topologia de produção exigir e estiver documentada.
- A API aceitará credenciais apenas das origens web explicitamente permitidas; não será usado CORS curinga com credenciais.
- Endpoints de escrita validarão origem confiável, além de `SameSite=Lax`. Se web e API precisarem operar em contexto cross-site, será obrigatória uma proteção CSRF explícita antes de mudar para `SameSite=None`.
- Cookies serão limpos usando os mesmos atributos de nome, domínio e caminho usados na criação.

### Cadastro e household inicial

O cadastro criará atomicamente:

1. o usuário com senha protegida por Argon2id;
2. um household individual;
3. o vínculo `HouseholdMember` com papel `OWNER`;
4. a primeira família de refresh token, caso o cadastro também inicie a sessão.

Falha em qualquer etapa desfará toda a operação. O client nunca enviará `userId`, `householdId` ou papel como fonte de autorização.

### Autorização e tenancy

- O `AuthGuard` validará assinatura, expiração, emissor e audiência do access token e produzirá uma identidade autenticada tipada.
- O `TenancyGuard` derivará o contexto de tenancy dessa identidade; parâmetros enviados pelo client nunca substituirão esse contexto.
- Repositories de domínio exigirão `householdId` recebido do contexto autenticado e aplicarão esse filtro em todas as consultas.
- Operações sensíveis a papel ou alteração de membership revalidarão a associação no servidor, pois claims de um JWT podem ficar desatualizadas até sua expiração.
- Recursos ausentes e recursos pertencentes a outro household devem produzir respostas que não permitam enumerar dados de terceiros.
- Todo endpoint autenticado terá teste de isolamento no qual um usuário tenta acessar um recurso de outro household.

### Sessão no web

- `GET /v1/me` será a fonte de verdade da sessão visível ao web.
- O estado de sessão será tratado como estado de servidor, preferencialmente via React Query; Zustand poderá guardar apenas estado efêmero de interface.
- O layout da área `(app)` redirecionará pessoas sem sessão para `/login`, mas essa proteção de navegação não substituirá os guards da API.
- Login, cadastro, refresh e logout usarão requests com credenciais habilitadas.
- Após logout, o cache de sessão será removido ou invalidado antes do redirecionamento.

### Proteções operacionais

- Login e cadastro responderão sem revelar detalhes de credenciais e não registrarão senha, token, cookie ou e-mail completo.
- Endpoints de autenticação terão rate limit por IP e, quando aplicável, por identificador normalizado, com respostas genéricas para credenciais inválidas.
- Segredos e parâmetros de token serão validados na inicialização e mantidos fora do repositório.
- Eventos de reuso, revogação e falha de autenticação poderão ser auditados sem registrar o token nem dados financeiros.

## Consequências

- Fica mais fácil: restaurar sessão sem expor tokens ao JavaScript; revogar refresh tokens; detectar roubo por reuso; manter uma única autoridade de identidade; aplicar tenancy consistentemente na API.
- Fica mais difícil: coordenar refresh concorrente; configurar cookies entre web e API; testar expiração, rotação, reuso, logout, CORS e CSRF; tratar o pequeno intervalo em que um access token revogado continua válido.
- Trade-off aceito: o MVP tolera a validade residual máxima de 15 minutos do access token para evitar uma consulta ou denylist em toda requisição.
- Revisitar quando: houver múltiplos households selecionáveis por usuário; OAuth/social login; aplicativo nativo; necessidade de revogação imediata; implantação realmente cross-site; ou evidência de que a persistência/rotação no PostgreSQL virou gargalo.

## Ações

1. [x] Adicionar o modelo de refresh token e uma nova migration Prisma, incluindo família e dados de rotação/revogação.
2. [x] Criar o módulo de auth no NestJS com Argon2id, emissão de JWT, cookies e rotação transacional.
3. [x] Criar `AuthGuard`, `TenancyGuard` e o contexto autenticado tipado.
4. [x] Criar `GET /v1/me` e os contratos compartilhados de autenticação.
5. [x] Criar páginas de login/cadastro e estado de sessão no web sem persistência local de tokens.
6. [x] Adicionar rate limit e validação de origem nos endpoints de autenticação.
7. [ ] Cobrir cadastro atômico, login, refresh, reuso, logout e isolamento entre households com testes automatizados. — _Parcial: **isolamento entre households (IDOR) coberto** (ver nota 2026-08-05); faltam ainda os testes de service/e2e de cadastro/login/refresh/reuso/logout._

## Nota de implementação (2026-08-05) — tenancy global (S1-02)

- `AuthGuard` e `TenancyGuard` passaram a ser **globais** (`APP_GUARD`, ordem `Auth → Tenancy`): toda rota é fail-closed por padrão. Rotas de identidade/health optam por sair com o decorator `@Public()`.
- Domínios acessam o banco por meio de `TenantScopedRepository` (`common/repositories`), cujo `scope(householdId, where)` injeta o `householdId` da sessão **por último**, tornando impossível forjar o tenant via input. O decorator `@CurrentHousehold()` entrega esse id aos handlers.
- Isolamento provado por teste A/B de IDOR com Postgres real (`*.int.test.ts`, roda no CI e localmente com `TEST_DATABASE_URL`). O runner de testes da API passou a ser o **Vitest**.

## Nota de implementação (2026-08-04)

- O `PrismaClient` e o schema passaram a viver no pacote workspace **`@tally/db`** (`packages/db`), consumido pela API via `PrismaService` e pelo seed. Decisão de estrutura (não altera a política desta ADR); ver também ADR-0004.
- Cookie-dica não sensível `tally_session` (host-only, sem token) permite ao middleware do Next saber que há sessão sem ler o access token httpOnly; o refresh silencioso no client renova o access de 15min de forma transparente.

### OAuth (Google + GitHub) no backend

Coerente com a rejeição da Opção D, o login social roda **na API** (Authorization Code flow, implementado sem passport), não no Next.js/Auth.js:

- `GET /v1/auth/oauth/:provider` → gera `state` (cookie httpOnly single-use, CSRF) e redireciona ao consentimento.
- `GET /v1/auth/oauth/:provider/callback` → valida o `state`, troca o `code`, lê o perfil e **emite a mesma sessão** (cookies httpOnly + refresh rotativo). Redireciona para `WEB_APP_URL/dashboard`, ou `/login?error=…` em falha.
- Vínculo de conta: primeiro por **provider id** (`google_id`/`github_id`); se não houver, vincula a uma conta existente **apenas com e-mail verificado** (evita takeover, threat-model S); senão cria conta nova sem senha. E-mail já usado por outra conta sem verificação → erro pedindo login por senha.
- Providers são **opcionais** (credenciais em env); sem credenciais o endpoint redireciona com `error=oauth_unavailable`. A API segue sendo a única autoridade de sessão — o front só tem âncoras para os endpoints.
