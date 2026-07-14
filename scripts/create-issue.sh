#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Tally — Criar labels, milestones e issues no GitHub
# Repositório: fernandaquerino/tally
# Project ID: 9
#
# Pré-requisitos:
#   gh auth login
#   gh extension install github/gh-projects (se necessário)
#
# Uso:
#   chmod +x create-tally-issues-option-b.sh
#   ./create-tally-issues-option-b.sh
# ============================================================

REPO="fernandaquerino/tally"
OWNER="fernandaquerino"
PROJECT_ID="9"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${YELLOW}→${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; }

validate_environment() {
  command -v gh >/dev/null 2>&1 || {
    fail "GitHub CLI não encontrado. Instale com: brew install gh"
    exit 1
  }

  gh auth status >/dev/null 2>&1 || {
    fail "Você precisa autenticar com: gh auth login"
    exit 1
  }

  gh repo view "$REPO" >/dev/null 2>&1 || {
    fail "Repositório não encontrado ou sem permissão: $REPO"
    exit 1
  }
}

create_label() {
  local name="$1"
  local color="$2"
  local description="$3"

  local existing
  existing=$(LABEL_NAME="$name" gh label list \
    --repo "$REPO" \
    --search "$name" \
    --json name \
    --jq '.[] | select(.name == env.LABEL_NAME) | .name' \
    2>/dev/null | head -n 1 || true)

  if [ -n "$existing" ]; then
    info "Label já existe: $name"
    return
  fi

  gh label create "$name" \
    --repo "$REPO" \
    --color "$color" \
    --description "$description" \
    >/dev/null 2>&1

  log "Label criada: $name"
}

create_milestone() {
  local title="$1"
  local description="${2:-}"

  local existing
  existing=$(MILESTONE_TITLE="$title" gh api "repos/$REPO/milestones?state=all" \
    --jq '.[] | select(.title == env.MILESTONE_TITLE) | .title' \
    2>/dev/null | head -n 1 || true)

  if [ -n "$existing" ]; then
    info "Milestone já existe: $title"
    return
  fi

  if [ -n "$description" ]; then
    gh api "repos/$REPO/milestones" \
      --method POST \
      -f title="$title" \
      -f description="$description" \
      -f state="open" \
      >/dev/null 2>&1
  else
    gh api "repos/$REPO/milestones" \
      --method POST \
      -f title="$title" \
      -f state="open" \
      >/dev/null 2>&1
  fi

  log "Milestone criado: $title"
}

create_issue() {
  local title="$1"
  local body="$2"
  local labels="$3"
  local milestone="$4"

  local existing_issue_url
  existing_issue_url=$(TITLE="$title" gh issue list \
    --repo "$REPO" \
    --state all \
    --limit 500 \
    --json title,url \
    --jq '.[] | select(.title == env.TITLE) | .url' \
    2>/dev/null | head -n 1 || true)

  if [ -n "$existing_issue_url" ]; then
    info "Issue já existe, pulando → $existing_issue_url"
    return
  fi

  info "Criando: $title"

  local issue_url
  if issue_url=$(gh issue create \
    --repo "$REPO" \
    --title "$title" \
    --body "$body" \
    --label "$labels" \
    --milestone "$milestone" \
    2>/dev/null); then
    log "Criada → $issue_url"

    if ! gh project item-add "$PROJECT_ID" --owner "$OWNER" --url "$issue_url" >/dev/null 2>&1; then
      info "Não foi possível adicionar ao Project $PROJECT_ID automaticamente. Verifique permissões/extensão gh-projects."
    fi
  else
    fail "Erro ao criar: $title"
  fi

  sleep 0.35
}

validate_environment

info "Criando labels..."
create_label "frontend" "0075ca" "Frontend / UI"
create_label "backend" "e4e669" "Backend / API"
create_label "database" "0e8a16" "Banco de dados / schema"
create_label "ai" "7057ff" "Camada de IA"
create_label "infra" "5319e7" "Infraestrutura / CI/CD / deploy"
create_label "docs" "cfd3d7" "Documentação"
create_label "security" "b60205" "Segurança / privacidade"
create_label "testing" "0075ca" "Testes automatizados"
create_label "design-system" "d93f0b" "Design system / UI foundation"
create_label "pwa" "0e8a16" "PWA / offline"
create_label "jobs" "fbca04" "Filas, crons e jobs assíncronos"
create_label "integrations" "1d76db" "Integrações externas"
create_label "domain:auth" "5319e7" "Autenticação, sessão e autorização"
create_label "domain:onboarding" "7c6ff7" "Onboarding inicial"
create_label "domain:dashboard" "1d76db" "Dashboard e visão geral"
create_label "domain:transacoes" "fbca04" "Transações e lançamento rápido"
create_label "domain:contas" "bfdadc" "Contas, saldos e transferências"
create_label "domain:categorias" "0e8a16" "Categorias PF/PJ"
create_label "domain:cartoes" "c5def5" "Cartões, faturas e parcelas"
create_label "domain:metas" "0969da" "Metas financeiras"
create_label "domain:dividas" "d4c5f9" "Dívidas e priorização de pagamento"
create_label "domain:relatorios" "1d76db" "Relatórios e visão mensal"
create_label "domain:settings" "5319e7" "Configurações, perfil, fiscal e conta"
create_label "domain:pj" "0052cc" "Coração PJ, split, provisões, teto MEI"
create_label "domain:ia" "7057ff" "IA, insights e alertas"
create_label "domain:exports" "cfd3d7" "Exportação e portabilidade de dados"
create_label "stack:web" "0075ca" "Next.js / aplicação web"
create_label "stack:api" "e4e669" "NestJS / API REST"
create_label "stack:db" "0e8a16" "PostgreSQL, Prisma e migrations"
create_label "stack:infra" "5319e7" "Docker, CI/CD, deploy"
create_label "stack:shared" "bfdadc" "Pacotes compartilhados"
create_label "stack:ui" "d93f0b" "Componentes UI"
create_label "type:feature" "0e8a16" "Nova funcionalidade"
create_label "type:chore" "cfd3d7" "Configuração ou manutenção técnica"
create_label "type:docs" "cfd3d7" "Documentação"
create_label "type:test" "0075ca" "Testes"
create_label "type:adr" "7057ff" "Architecture Decision Record"
create_label "type:refactor" "fbca04" "Refatoração"
create_label "priority:critical" "b60205" "Bloqueia o projeto"
create_label "priority:high" "d93f0b" "Alta prioridade"
create_label "priority:normal" "fbca04" "Prioridade normal"
create_label "priority:low" "cfd3d7" "Baixa prioridade"
create_label "sprint-0" "7c6ff7" "Issue planejada para a Sprint 0"
create_label "sprint-1" "7c6ff7" "Issue planejada para a Sprint 1"
create_label "sprint-2" "7c6ff7" "Issue planejada para a Sprint 2"
create_label "sprint-3" "7c6ff7" "Issue planejada para a Sprint 3"
create_label "sprint-4" "7c6ff7" "Issue planejada para a Sprint 4"
create_label "sprint-5" "7c6ff7" "Issue planejada para a Sprint 5"
create_label "sprint-6" "7c6ff7" "Issue planejada para a Sprint 6"
create_label "sprint-7" "7c6ff7" "Issue planejada para a Sprint 7"
create_label "sprint-8" "7c6ff7" "Issue planejada para a Sprint 8"
create_label "sprint-9" "7c6ff7" "Issue planejada para a Sprint 9"
create_label "sprint-10" "7c6ff7" "Issue planejada para a Sprint 10"
create_label "sprint-11" "7c6ff7" "Issue planejada para a Sprint 11"
create_label "sprint-12" "7c6ff7" "Issue planejada para a Sprint 12"

log "Labels criadas."

info "Criando milestones..."
create_milestone "Sprint 0 - Fundação" "Monorepo, apps base, banco, Docker, CI, design system mínimo e ADRs."
create_milestone "Sprint 1 - App Shell + Auth" "Autenticação, onboarding, layout autenticado, sidebar com todas as telas e isolamento por tenant."
create_milestone "Sprint 2 - Dashboard" "Dashboard principal com três números, painel PJ, alertas e visão resumida."
create_milestone "Sprint 3 - Transações" "CRUD de transações, lançamento rápido, PF/PJ, recorrências, parcelamentos e split de recebimento."
create_milestone "Sprint 4 - Contas" "Contas PF/PJ, saldos derivados, transferências e detalhes de conta."
create_milestone "Sprint 5 - Categorias" "Categorias padrão e customizadas por contexto, organização e uso em filtros/relatórios."
create_milestone "Sprint 6 - Cartões" "Cartões, faturas por competência, parcelas futuras, fechamento e pagamento de fatura."
create_milestone "Sprint 7 - Metas" "Metas financeiras PF/PJ, progresso, contribuições e visão de planejamento."
create_milestone "Sprint 8 - Dívidas" "Dívidas, parcelas, juros, estratégia de pagamento e impacto no comprometido futuro."
create_milestone "Sprint 9 - Relatórios" "Relatórios mensais, filtros PF/PJ/Tudo, gráficos, drill-down e exportação."
create_milestone "Sprint 10 - Settings" "Perfil, preferências, configurações fiscais, regras de split, segurança e LGPD."
create_milestone "Sprint 11 - IA + Alertas" "Parsing por linguagem natural, categorização, feedback, insights, alertas e resumo semanal."
create_milestone "Sprint 12 - PWA + Beta" "PWA/offline, observabilidade, testes E2E, deploy, backup/restore e checklist beta."

log "Milestones criados."

# ============================================================
# Criar issues da Sprint 0
# ============================================================
info "Criando issues da Sprint 0..."

create_issue "[S0-01] Configurar monorepo com pnpm workspaces e Turborepo" "$(cat <<'EOF'
## Contexto
    O Tally será desenvolvido em monorepo com apps web/API e pacotes compartilhados, mantendo tipos, schemas e configurações no mesmo repositório.

    ## Escopo
    - [ ] Criar estrutura `apps/web` e `apps/api`
- [ ] Criar `packages/shared` e `packages/config`
- [ ] Configurar `pnpm-workspace.yaml`
- [ ] Configurar Turborepo com pipeline de lint, typecheck, test e build
- [ ] Criar scripts raiz `dev`, `lint`, `typecheck`, `test`, `build`
- [ ] Garantir instalação pela raiz com `pnpm install`

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] `pnpm install` funciona na raiz
- [ ] `pnpm dev` consegue acionar os apps base
- [ ] A estrutura final bate com o README/architecture

    ## Notas técnicas
    - Base esperada: `apps/web`, `apps/api`, `packages/shared`, `packages/config`, `prisma`, `docs`.
EOF
)" "sprint-0,type:chore,priority:critical,infra,stack:infra,stack:shared" "Sprint 0 - Fundação"

create_issue "[S0-02] Configurar Docker Compose com Postgres 16 e Redis" "$(cat <<'EOF'
## Contexto
    O desenvolvimento local precisa ser previsível e refletir a arquitetura com PostgreSQL como fonte da verdade e Redis para filas/rate limit.

    ## Escopo
    - [ ] Criar `docker-compose.yml`
- [ ] Adicionar serviço `postgres` com volume persistente
- [ ] Adicionar serviço `redis`
- [ ] Criar `.env.example` com variáveis de banco e Redis
- [ ] Documentar comandos para subir, derrubar e resetar ambiente

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] `docker compose up -d` sobe Postgres e Redis
- [ ] Postgres mantém dados entre reinícios
- [ ] `.env.example` permite bootstrap do projeto

    ## Notas técnicas
    - Postgres 16; Redis usado inicialmente por BullMQ e rate limit.
EOF
)" "sprint-0,type:chore,priority:critical,infra,database,stack:infra,stack:db" "Sprint 0 - Fundação"

create_issue "[S0-03] Criar setup base do Next.js 15 com App Router" "$(cat <<'EOF'
## Contexto
    A aplicação web será a interface principal do Tally, com marketing SSR/ISR e área autenticada web-first/PWA.

    ## Escopo
    - [ ] Criar app Next.js em `apps/web`
- [ ] Configurar TypeScript strict
- [ ] Configurar Tailwind CSS
- [ ] Configurar estrutura `app/(marketing)`, `app/(auth)` e `app/(app)`
- [ ] Criar página inicial simples
- [ ] Preparar aliases de importação

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] `pnpm --filter web dev` roda sem erro
- [ ] Home renderiza com Tailwind funcionando
- [ ] Estrutura de rotas está preparada para as sprints de telas

    ## Notas técnicas
    - Não implementar layout final ainda; isso entra em Sprint 1.
EOF
)" "sprint-0,type:chore,priority:critical,frontend,stack:web" "Sprint 0 - Fundação"

create_issue "[S0-04] Criar setup base da API NestJS" "$(cat <<'EOF'
## Contexto
    A API será um monólito modular por domínio, com controllers finos e services responsáveis pelas invariantes do domínio financeiro.

    ## Escopo
    - [ ] Criar app NestJS em `apps/api`
- [ ] Configurar `ConfigModule`
- [ ] Criar endpoint `GET /v1/health`
- [ ] Criar filtro global de erros
- [ ] Criar interceptor de envelope de resposta
- [ ] Configurar CORS e prefixo global `/v1`

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] `GET /v1/health` retorna sucesso
- [ ] Erros seguem formato `{ error: { code, message } }`
- [ ] API carrega variáveis de ambiente

    ## Notas técnicas
    - Controllers finos; regra de negócio deve ir para services.
EOF
)" "sprint-0,type:chore,priority:critical,backend,stack:api" "Sprint 0 - Fundação"

create_issue "[S0-05] Configurar Prisma e migration inicial" "$(cat <<'EOF'
## Contexto
    O banco deve nascer com Prisma, migrations versionadas e base para usuários, households e dados financeiros multi-tenant.

    ## Escopo
    - [ ] Instalar Prisma no monorepo
- [ ] Criar `prisma/schema.prisma`
- [ ] Configurar conexão com PostgreSQL
- [ ] Criar models iniciais `User`, `Household`, `HouseholdMember`
- [ ] Criar migration inicial
- [ ] Criar scripts `db:migrate`, `db:generate`, `db:studio`, `db:seed`

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Migration inicial roda contra Postgres local
- [ ] Prisma Client é gerado
- [ ] Prisma Studio abre sem erro

    ## Notas técnicas
    - Toda entidade de domínio futura deverá carregar `householdId`.
EOF
)" "sprint-0,type:chore,priority:critical,database,stack:db" "Sprint 0 - Fundação"

create_issue "[S0-06] Criar packages/shared com schemas e money utils" "$(cat <<'EOF'
## Contexto
    Schemas Zod e utilitários de dinheiro precisam ser compartilhados entre front e back para evitar validações divergentes.

    ## Escopo
    - [ ] Criar package `@tally/shared`
- [ ] Configurar exports do pacote
- [ ] Criar helpers de dinheiro em centavos
- [ ] Criar tipos `MoneyCents`, `ContextType`, `TransactionType`
- [ ] Criar schema Zod base para paginação e datas
- [ ] Adicionar testes unitários dos money utils

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Web e API conseguem importar de `@tally/shared`
- [ ] Testes garantem formatação e parse seguro de centavos
- [ ] Nenhum helper usa `parseFloat` para dinheiro

    ## Notas técnicas
    - Dinheiro deve trafegar como centavos; formatar apenas na borda.
EOF
)" "sprint-0,type:feature,priority:critical,stack:shared,database,testing" "Sprint 0 - Fundação"

create_issue "[S0-07] Criar design system mínimo" "$(cat <<'EOF'
## Contexto
    As telas serão construídas em cima de primitivos consistentes para reduzir retrabalho e manter a identidade visual desde o início.

    ## Escopo
    - [ ] Criar pasta `apps/web/src/components/ui`
- [ ] Criar `Button`, `Input`, `MoneyInput`, `Select`, `Dialog`, `Card`, `Badge`
- [ ] Criar `EmptyState`, `LoadingState`, `ErrorState` e `Toast`
- [ ] Criar tokens básicos de cor, radius, spacing e tipografia
- [ ] Criar exemplos de uso na página de desenvolvimento

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Componentes aceitam `className`
- [ ] Componentes têm estados disabled/loading/error quando aplicável
- [ ] MoneyInput trabalha em centavos

    ## Notas técnicas
    - Referências visuais: Linear + Copilot Money; acessibilidade AA.
EOF
)" "sprint-0,type:feature,priority:high,frontend,design-system,stack:ui" "Sprint 0 - Fundação"

create_issue "[S0-08] Configurar CI com lint, typecheck, test e build" "$(cat <<'EOF'
## Contexto
    O projeto é portfolio fullstack e precisa validar qualidade automaticamente a cada PR.

    ## Escopo
    - [ ] Criar workflow `.github/workflows/ci.yml`
- [ ] Configurar setup Node + pnpm cache
- [ ] Rodar `pnpm lint`
- [ ] Rodar `pnpm typecheck`
- [ ] Rodar `pnpm test`
- [ ] Rodar `pnpm build`
- [ ] Fazer workflow rodar em pull requests

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] PR dispara CI
- [ ] CI falha se lint/typecheck/test/build falharem
- [ ] CI passa no estado inicial

    ## Notas técnicas
    - Deixar integration/e2e completo para Sprint 12 se ficar pesado agora.
EOF
)" "sprint-0,type:chore,priority:critical,infra,testing,stack:infra" "Sprint 0 - Fundação"

create_issue "[S0-09] Criar seed inicial Rafael PJ" "$(cat <<'EOF'
## Contexto
    O produto precisa de dados realistas para testar o dashboard, split PJ, cartão, metas e dívidas desde cedo.

    ## Escopo
    - [ ] Criar script `prisma/seed.ts`
- [ ] Criar usuário Rafael com household
- [ ] Criar contas PF e PJ
- [ ] Criar categorias PF/PJ
- [ ] Criar cartão com fatura aberta
- [ ] Criar transações de exemplo
- [ ] Criar meta e dívida de exemplo

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] `pnpm db:seed` popula banco local
- [ ] Dados aparecem coerentes nas telas conforme forem implementadas
- [ ] Seed pode ser resetado sem duplicar dados

    ## Notas técnicas
    - Usar dados fictícios; não inserir PII real.
EOF
)" "sprint-0,type:chore,priority:high,database,stack:db" "Sprint 0 - Fundação"

create_issue "[S0-10] Escrever ADRs iniciais de arquitetura" "$(cat <<'EOF'
## Contexto
    As principais decisões precisam estar registradas antes da implementação para demonstrar raciocínio técnico e trade-offs.

    ## Escopo
    - [ ] Criar pasta `docs/architecture/adr`
- [ ] Escrever ADR web-first/PWA
- [ ] Escrever ADR Next.js + NestJS
- [ ] Escrever ADR PostgreSQL + Prisma
- [ ] Escrever ADR monorepo
- [ ] Escrever ADR dinheiro em centavos
- [ ] Escrever ADR manual-first sem Open Finance

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] ADRs estão commitados
- [ ] Cada ADR contém contexto, decisão e consequências
- [ ] README aponta para os ADRs

    ## Notas técnicas
    - Use decisões já descritas nos docs; não precisa inventar decisões novas.
EOF
)" "sprint-0,type:adr,type:docs,priority:high,docs,infra" "Sprint 0 - Fundação"

# ============================================================
# Criar issues da Sprint 1
# ============================================================
info "Criando issues da Sprint 1..."

create_issue "[S1-01] Implementar autenticação com registro, login e logout" "$(cat <<'EOF'
## Contexto
    A área autenticada precisa existir desde cedo para validar tenancy, dados privados e rotas protegidas.

    ## Escopo
    - [ ] Criar endpoints `/v1/auth/register`, `/login`, `/refresh`, `/logout`
- [ ] Hash de senha com argon2id
- [ ] JWT curto em cookie httpOnly
- [ ] Refresh token rotativo
- [ ] Criar páginas de login e cadastro
- [ ] Criar estado de sessão no web

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário consegue criar conta e entrar
- [ ] Usuário não autenticado não acessa área app
- [ ] Logout invalida a sessão no cliente

    ## Notas técnicas
    - Seguir estratégia de cookie httpOnly e refresh token rotativo.
EOF
)" "sprint-1,type:feature,priority:critical,security,backend,frontend,domain:auth,stack:api,stack:web" "Sprint 1 - App Shell + Auth"

create_issue "[S1-02] Implementar Household e TenancyGuard" "$(cat <<'EOF'
## Contexto
    O isolamento por household é um princípio inegociável; toda query deve ser filtrada pelo tenant derivado da sessão, não do cliente.

    ## Escopo
    - [ ] Criar `TenancyGuard` global
- [ ] Injetar `householdId` no request autenticado
- [ ] Criar decorator para acessar household atual
- [ ] Criar repository helper que exige `householdId`
- [ ] Criar teste A/B com dois usuários e dois households

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário A não acessa dados do usuário B
- [ ] Endpoints autenticados têm household resolvido no servidor
- [ ] Teste de IDOR inicial passa

    ## Notas técnicas
    - Este é o gate técnico mais importante do app.
EOF
)" "sprint-1,type:feature,priority:critical,security,backend,domain:auth,stack:api" "Sprint 1 - App Shell + Auth"

create_issue "[S1-03] Criar onboarding fiscal inicial" "$(cat <<'EOF'
## Contexto
    Para o Tally explicar quanto do faturamento é realmente do usuário, ele precisa conhecer o contexto PJ mínimo: regime, faixa e regras de reserva.

    ## Escopo
    - [ ] Criar rota `/onboarding`
- [ ] Criar passos: perfil, contexto PJ, regime MEI/Simples, reserva padrão, cartão/conta inicial
- [ ] Persistir progresso no backend
- [ ] Permitir pular campos opcionais
- [ ] Redirecionar usuário novo para onboarding

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário novo cai no onboarding
- [ ] Dados fiscais mínimos são salvos
- [ ] Usuário conclui e vai para o dashboard

    ## Notas técnicas
    - Linguagem de gente: “separado para imposto” antes de “provisão”.
EOF
)" "sprint-1,type:feature,priority:critical,frontend,backend,domain:onboarding,domain:pj" "Sprint 1 - App Shell + Auth"

create_issue "[S1-04] Criar AppShell com sidebar completa" "$(cat <<'EOF'
## Contexto
    A estrutura do app precisa refletir todas as telas imaginadas: Dashboard, Transações, Contas, Categorias, Cartões, Metas, Dívidas, Relatórios e Settings.

    ## Escopo
    - [ ] Criar layout autenticado `app/(app)`
- [ ] Criar `AppShell`, `Sidebar`, `Topbar` e `PageHeader`
- [ ] Adicionar navegação para todas as páginas principais
- [ ] Criar active state por rota
- [ ] Criar versão responsiva mobile
- [ ] Adicionar botão global de nova transação

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Sidebar mostra todas as telas do app
- [ ] Rotas vazias renderizam sem quebrar
- [ ] Layout funciona em desktop e mobile

    ## Notas técnicas
    - Páginas podem começar como placeholders, mas já precisam existir.
EOF
)" "sprint-1,type:feature,priority:critical,frontend,domain:dashboard,stack:web" "Sprint 1 - App Shell + Auth"

create_issue "[S1-05] Criar placeholders das páginas principais" "$(cat <<'EOF'
## Contexto
    Antes de implementar cada domínio, as rotas devem existir para validar navegação, layout e ordem mental do produto.

    ## Escopo
    - [ ] Criar `/dashboard`
- [ ] Criar `/transactions`
- [ ] Criar `/accounts`
- [ ] Criar `/categories`
- [ ] Criar `/cards`
- [ ] Criar `/goals`
- [ ] Criar `/debts`
- [ ] Criar `/reports`
- [ ] Criar `/settings`

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Todas as rotas da sidebar carregam
- [ ] Cada página tem título e descrição
- [ ] Nenhuma rota autenticada aparece fora do layout

    ## Notas técnicas
    - Use nomes de rota em inglês no código e labels/textos em português na UI.
EOF
)" "sprint-1,type:chore,priority:high,frontend,stack:web" "Sprint 1 - App Shell + Auth"

create_issue "[S1-06] Criar API client e providers do app web" "$(cat <<'EOF'
## Contexto
    O frontend deve consumir a API de forma padronizada, com React Query para dados de servidor e Zustand apenas para estado efêmero de UI.

    ## Escopo
    - [ ] Criar `lib/api-client`
- [ ] Configurar base URL por env
- [ ] Configurar React Query Provider
- [ ] Criar tratamento padrão de erro
- [ ] Criar Zustand store para UI global
- [ ] Criar helpers de query keys por domínio

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Hooks conseguem consumir `/v1/health` ou `/v1/me`
- [ ] Erros HTTP aparecem em formato amigável
- [ ] React Query Devtools habilitado em dev

    ## Notas técnicas
    - Não duplicar dados de servidor no Zustand.
EOF
)" "sprint-1,type:chore,priority:high,frontend,stack:web" "Sprint 1 - App Shell + Auth"

create_issue "[S1-07] Criar guard de rotas autenticadas no Next.js" "$(cat <<'EOF'
## Contexto
    As páginas do app devem ser privadas; marketing e login ficam públicos.

    ## Escopo
    - [ ] Separar rotas públicas e privadas
- [ ] Criar redirect de usuário não autenticado
- [ ] Criar redirect de usuário autenticado para dashboard
- [ ] Criar loading state de sessão
- [ ] Adicionar teste de comportamento básico

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário não logado é enviado para login
- [ ] Usuário logado não acessa login/cadastro desnecessariamente
- [ ] Sessão carregando não pisca conteúdo privado

    ## Notas técnicas
    - Evitar vazamento de conteúdo privado durante hydration.
EOF
)" "sprint-1,type:feature,priority:high,frontend,security,domain:auth" "Sprint 1 - App Shell + Auth"

create_issue "[S1-08] Criar modelo de fiscal_rules versionadas" "$(cat <<'EOF'
## Contexto
    As regras fiscais não podem ficar hardcoded nem serem calculadas por IA. Elas devem ser versionadas no banco.

    ## Escopo
    - [ ] Criar model `FiscalRule`
- [ ] Criar seed de regras MEI/Simples básicas
- [ ] Criar service para buscar regra vigente
- [ ] Criar testes unitários de regra por data
- [ ] Expor leitura no onboarding/settings

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Split consegue consultar regra fiscal vigente
- [ ] Regra antiga não é sobrescrita ao criar nova versão
- [ ] Teste cobre mudança de vigência

    ## Notas técnicas
    - Não precisa cobrir legislação completa; MVP usa configuração básica e versionada.
EOF
)" "sprint-1,type:feature,priority:high,database,backend,domain:pj,stack:db,stack:api" "Sprint 1 - App Shell + Auth"

# ============================================================
# Criar issues da Sprint 2
# ============================================================
info "Criando issues da Sprint 2..."

create_issue "[S2-01] Criar layout visual do Dashboard" "$(cat <<'EOF'
## Contexto
    O dashboard é a primeira resposta do app: mostrar o que importa antes de gráficos complexos.

    ## Escopo
    - [ ] Criar rota `/dashboard` real
- [ ] Criar grid responsivo de cards
- [ ] Criar área de alertas
- [ ] Criar área de últimas transações
- [ ] Criar bloco de painel PJ
- [ ] Aplicar loading, empty e error states

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Dashboard carrega com dados do seed
- [ ] Layout não quebra em mobile
- [ ] Usuário entende os 3 números principais sem abrir relatório

    ## Notas técnicas
    - Princípio: número antes do gráfico.
EOF
)" "sprint-2,type:feature,priority:critical,frontend,domain:dashboard,stack:web" "Sprint 2 - Dashboard"

create_issue "[S2-02] Criar endpoint de resumo do Dashboard" "$(cat <<'EOF'
## Contexto
    O dashboard precisa de dados agregados calculados no servidor para evitar regras financeiras duplicadas no cliente.

    ## Escopo
    - [ ] Criar `GET /v1/dashboard/summary`
- [ ] Calcular resultado PJ do mês
- [ ] Calcular disponível pessoal
- [ ] Calcular comprometido futuro
- [ ] Retornar próximos alertas
- [ ] Garantir filtro por household

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Endpoint retorna somente dados do household atual
- [ ] Valores são derivados de transações, contas, cartões e dívidas
- [ ] Teste cobre household A vs B

    ## Notas técnicas
    - Não persistir totais como fonte de verdade; derivar ou materializar com reconciliação.
EOF
)" "sprint-2,type:feature,priority:critical,backend,database,domain:dashboard,domain:pj,stack:api" "Sprint 2 - Dashboard"

create_issue "[S2-03] Criar MetricCard e cards dos 3 números" "$(cat <<'EOF'
## Contexto
    A home do Tally deve responder rapidamente: resultado PJ, disponível pessoal e comprometido futuro.

    ## Escopo
    - [ ] Criar `MetricCard`
- [ ] Criar card Resultado PJ
- [ ] Criar card Disponível pessoal
- [ ] Criar card Comprometido futuro
- [ ] Adicionar tooltip “como calculamos”
- [ ] Permitir clique para drill-down futuro

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Cards exibem centavos formatados corretamente
- [ ] Cards têm loading skeleton
- [ ] Tooltip explica a composição do número

    ## Notas técnicas
    - Qualquer número exibido deve ser auditável.
EOF
)" "sprint-2,type:feature,priority:critical,frontend,domain:dashboard,design-system" "Sprint 2 - Dashboard"

create_issue "[S2-04] Criar widget Painel PJ no Dashboard" "$(cat <<'EOF'
## Contexto
    O Tally precisa reforçar seu diferencial logo na home: visão de faturamento, provisão, disponível e teto MEI.

    ## Escopo
    - [ ] Criar `PJPanel`
- [ ] Mostrar faturamento do mês
- [ ] Mostrar reservado para imposto
- [ ] Mostrar disponível para retirada
- [ ] Mostrar barra de uso do teto MEI
- [ ] Criar empty state quando usuário não configurou PJ

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Painel PJ usa dados do endpoint de dashboard
- [ ] Alerta visual aparece quando teto configurado chega a 85%
- [ ] Empty state direciona para settings/onboarding fiscal

    ## Notas técnicas
    - Não usar cor como único codificador; incluir label e ícone.
EOF
)" "sprint-2,type:feature,priority:high,frontend,domain:dashboard,domain:pj" "Sprint 2 - Dashboard"

create_issue "[S2-05] Criar widget de próximos alertas" "$(cat <<'EOF'
## Contexto
    O produto deve avisar antes do susto: imposto vencendo, gasto fora do padrão e ritmo de gastos.

    ## Escopo
    - [ ] Criar componente `AlertsWidget`
- [ ] Listar alertas pendentes
- [ ] Diferenciar severidade
- [ ] Permitir marcar como lido
- [ ] Linkar alerta para tela relacionada

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Alertas aparecem no dashboard
- [ ] Marcar como lido remove da lista principal
- [ ] Alertas têm CTA claro

    ## Notas técnicas
    - Máximo 1 alerta proativo/dia será tratado na Sprint 11.
EOF
)" "sprint-2,type:feature,priority:normal,frontend,domain:dashboard,domain:ia" "Sprint 2 - Dashboard"

create_issue "[S2-06] Criar widget de últimas transações" "$(cat <<'EOF'
## Contexto
    O usuário precisa conferir rapidamente se os últimos lançamentos foram registrados no contexto certo.

    ## Escopo
    - [ ] Criar `RecentTransactionsList`
- [ ] Mostrar descrição, valor, contexto PF/PJ e categoria
- [ ] Linkar para detalhe da transação
- [ ] Criar skeleton e empty state
- [ ] Adicionar CTA para nova transação

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Lista exibe transações do mês atual
- [ ] ContextBadge aparece em cada item
- [ ] Clique abre a tela/detalhe da transação

    ## Notas técnicas
    - Usar mesmo componente de valor/contexto da listagem de transações.
EOF
)" "sprint-2,type:feature,priority:normal,frontend,domain:dashboard,domain:transacoes" "Sprint 2 - Dashboard"

create_issue "[S2-07] Testar Dashboard com seed e cenários vazios" "$(cat <<'EOF'
## Contexto
    Dashboard é página crítica e precisa funcionar tanto para usuário novo quanto para usuário com dados.

    ## Escopo
    - [ ] Criar testes de componentes dos cards
- [ ] Criar teste de hook/endpoint summary
- [ ] Criar fixture de usuário sem transações
- [ ] Criar fixture de usuário com PJ, cartão e dívida
- [ ] Validar estados loading, empty e error

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Testes passam no CI
- [ ] Usuário novo vê orientação clara
- [ ] Usuário com seed vê valores coerentes

    ## Notas técnicas
    - Valores financeiros devem ser assertados em centavos.
EOF
)" "sprint-2,type:test,priority:high,testing,domain:dashboard" "Sprint 2 - Dashboard"

# ============================================================
# Criar issues da Sprint 3
# ============================================================
info "Criando issues da Sprint 3..."

create_issue "[S3-01] Modelar Transaction, Transfer e InstallmentGroup" "$(cat <<'EOF'
## Contexto
    Transações são o core operacional do app e precisam suportar PF/PJ, conta ou fatura, recorrência, parcelamento e origem.

    ## Escopo
    - [ ] Criar models de transação no Prisma
- [ ] Criar `installment_group_id`
- [ ] Criar campo `context` PF/PJ
- [ ] Criar campo `created_via`
- [ ] Criar constraints conta XOR fatura
- [ ] Criar migration e seed atualizado

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Migration roda sem erro
- [ ] Conta XOR fatura é garantido no banco
- [ ] Parcelas podem pertencer a um grupo

    ## Notas técnicas
    - Essa modelagem impacta cartão e relatórios.
EOF
)" "sprint-3,type:feature,priority:critical,database,domain:transacoes,stack:db" "Sprint 3 - Transações"

create_issue "[S3-02] Criar CRUD de transações na API" "$(cat <<'EOF'
## Contexto
    A API deve centralizar regras de criação, edição, listagem e exclusão de transações com segurança multi-tenant.

    ## Escopo
    - [ ] Criar módulo `transactions`
- [ ] Criar `GET /v1/transactions` com cursor pagination
- [ ] Criar `POST /v1/transactions`
- [ ] Criar `PATCH /v1/transactions/:id`
- [ ] Criar `DELETE /v1/transactions/:id`
- [ ] Adicionar filtros por mês, contexto, categoria e tipo

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] CRUD funciona via API
- [ ] Todas as queries filtram por household
- [ ] Paginação por cursor funciona

    ## Notas técnicas
    - POST deve aceitar `Idempotency-Key` para PWA offline.
EOF
)" "sprint-3,type:feature,priority:critical,backend,database,domain:transacoes,stack:api" "Sprint 3 - Transações"

create_issue "[S3-03] Criar QuickEntryModal para lançamento em menos de 10s" "$(cat <<'EOF'
## Contexto
    O registro rápido é um princípio central: se lançar for lento, o usuário abandona o app.

    ## Escopo
    - [ ] Criar modal global de nova transação
- [ ] Criar campos valor, descrição, data, tipo, contexto, conta/cartão, categoria
- [ ] Adicionar defaults inteligentes
- [ ] Adicionar atalho `N` no desktop
- [ ] Salvar e resetar rapidamente
- [ ] Mostrar toast de sucesso/erro

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário consegue registrar transação sem sair da tela atual
- [ ] Fluxo feliz leva poucos campos obrigatórios
- [ ] Após salvar, listas e dashboard são invalidados

    ## Notas técnicas
    - IA entra na Sprint 11; aqui o formulário manual precisa funcionar perfeitamente.
EOF
)" "sprint-3,type:feature,priority:critical,frontend,domain:transacoes,stack:web" "Sprint 3 - Transações"

create_issue "[S3-04] Criar tela de listagem de transações" "$(cat <<'EOF'
## Contexto
    A página Transações deve ser a central de auditoria diária do usuário.

    ## Escopo
    - [ ] Implementar `/transactions`
- [ ] Criar tabela/lista responsiva
- [ ] Mostrar data, descrição, categoria, contexto, conta/cartão e valor
- [ ] Criar grouping por data no mobile
- [ ] Adicionar paginação/infinite load
- [ ] Criar loading/empty/error states

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Transações aparecem agrupadas de forma legível
- [ ] ContextBadge aparece em todas as linhas
- [ ] Página funciona com 0, 10 e 100+ transações

    ## Notas técnicas
    - Densidade elegante no desktop; leitura rápida no mobile.
EOF
)" "sprint-3,type:feature,priority:critical,frontend,domain:transacoes" "Sprint 3 - Transações"

create_issue "[S3-05] Criar filtros e busca de transações" "$(cat <<'EOF'
## Contexto
    O usuário precisa encontrar e auditar lançamentos por contexto, período, categoria, conta/cartão e texto.

    ## Escopo
    - [ ] Criar `TransactionsFilterBar`
- [ ] Filtros por mês, contexto PF/PJ/Tudo, tipo e categoria
- [ ] Busca por texto
- [ ] Sincronizar filtros na URL
- [ ] Criar chips de filtro ativo
- [ ] Adicionar botão limpar filtros

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Filtros atualizam a URL
- [ ] Link com filtros pode ser compartilhado/reaberto
- [ ] Busca não quebra paginação

    ## Notas técnicas
    - SearchParams no Next; React Query key inclui filtros.
EOF
)" "sprint-3,type:feature,priority:high,frontend,domain:transacoes,domain:categorias" "Sprint 3 - Transações"

create_issue "[S3-06] Criar detalhe, edição e exclusão de transação" "$(cat <<'EOF'
## Contexto
    Todo número precisa ser auditável; ao clicar numa transação, o usuário deve entender origem e impactos.

    ## Escopo
    - [ ] Criar drawer/panel de detalhe
- [ ] Exibir dados completos da transação
- [ ] Permitir editar campos permitidos
- [ ] Permitir excluir com confirmação
- [ ] Mostrar origem `form|ai|import|system`
- [ ] Mostrar vínculo com fatura/split quando existir

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário edita transação e lista atualiza
- [ ] Exclusão exige confirmação
- [ ] Transação vinculada a fatura fechada respeita regra de imutabilidade

    ## Notas técnicas
    - Fatura fechada deve gerar ajuste, não edição silenciosa.
EOF
)" "sprint-3,type:feature,priority:high,frontend,backend,domain:transacoes" "Sprint 3 - Transações"

create_issue "[S3-07] Implementar recorrências de transações" "$(cat <<'EOF'
## Contexto
    Recorrências reduzem fricção para gastos fixos e receitas previsíveis.

    ## Escopo
    - [ ] Criar model `RecurringRule`
- [ ] Criar API para criar regra recorrente
- [ ] Gerar próximas ocorrências
- [ ] Criar UI de recorrência no formulário
- [ ] Permitir pausar/cancelar recorrência
- [ ] Criar job simples para materializar próximas transações

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário cria transação mensal recorrente
- [ ] Próxima ocorrência aparece no comprometido futuro
- [ ] Pausar regra impede novas ocorrências

    ## Notas técnicas
    - Começar com mensal; semanal/anual podem entrar depois se pesar.
EOF
)" "sprint-3,type:feature,priority:normal,backend,frontend,jobs,domain:transacoes" "Sprint 3 - Transações"

create_issue "[S3-08] Implementar parcelamento no fluxo de transações" "$(cat <<'EOF'
## Contexto
    Parcelamento 12x é modelo mental brasileiro e impacta cartão, comprometido futuro e relatórios.

    ## Escopo
    - [ ] Adicionar opção de parcelamento no formulário
- [ ] Gerar N transações ligadas por `installment_group_id`
- [ ] Distribuir centavos corretamente
- [ ] Projetar parcelas futuras
- [ ] Criar tag `1/12`, `2/12` etc.
- [ ] Testar soma total das parcelas

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Parcelas somam exatamente o total original
- [ ] Parcelas futuras aparecem nos meses corretos
- [ ] UI mostra número da parcela

    ## Notas técnicas
    - Resto de centavos deve ir para a última parcela.
EOF
)" "sprint-3,type:feature,priority:high,backend,frontend,domain:transacoes,domain:cartoes" "Sprint 3 - Transações"

create_issue "[S3-09] Criar fluxo do divisor de recebimento PJ" "$(cat <<'EOF'
## Contexto
    Este é o momento AHA do Tally: a receita PJ vira imposto, reserva e salário disponível de forma auditável.

    ## Escopo
    - [ ] Criar `SplitService`
- [ ] Criar endpoint `POST /v1/transactions/:id/split`
- [ ] Criar `SplitPanel` no frontend
- [ ] Sugerir imposto/reserva/pró-labore
- [ ] Permitir ajuste de percentuais
- [ ] Criar provisão e transferências numa transação atômica
- [ ] Linkar todas as pernas por `split_id`

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Receita PJ pode ser dividida em uma operação atômica
- [ ] Usuário vê quanto vira “seu salário”
- [ ] Todas as pernas do split são auditáveis

    ## Notas técnicas
    - LLM nunca calcula imposto; regras vêm de `fiscal_rules`.
EOF
)" "sprint-3,type:feature,priority:critical,backend,frontend,database,domain:pj,domain:transacoes" "Sprint 3 - Transações"

create_issue "[S3-10] Testar invariantes de transações e split" "$(cat <<'EOF'
## Contexto
    As invariantes financeiras precisam ser testadas antes de avançar para contas, cartões e relatórios.

    ## Escopo
    - [ ] Testar conta XOR fatura
- [ ] Testar soma de parcelas
- [ ] Testar split transacional
- [ ] Testar edição bloqueada em fatura fechada
- [ ] Testar idempotência em POST
- [ ] Testar tenancy em endpoints de transações

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Testes rodam no CI
- [ ] Falha de split não deixa dados parciais
- [ ] Usuário A não acessa transações do usuário B

    ## Notas técnicas
    - Priorizar testes de service e integration com Postgres.
EOF
)" "sprint-3,type:test,priority:critical,testing,domain:transacoes,domain:pj" "Sprint 3 - Transações"

# ============================================================
# Criar issues da Sprint 4
# ============================================================
info "Criando issues da Sprint 4..."

create_issue "[S4-01] Modelar contas PF/PJ e saldos derivados" "$(cat <<'EOF'
## Contexto
    Contas representam onde o dinheiro está, mas saldo precisa ser derivado das transações para manter confiança.

    ## Escopo
    - [ ] Criar model `Account`
- [ ] Criar tipos: corrente, poupança, dinheiro, reserva, outra
- [ ] Adicionar contexto PF/PJ
- [ ] Criar migration
- [ ] Criar estratégia de saldo derivado
- [ ] Atualizar seed

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Conta pertence a um household
- [ ] Conta tem contexto PF/PJ
- [ ] Saldo não é fonte autoritativa manual

    ## Notas técnicas
    - Saldo pode ser view/materializado, mas sempre reconciliável.
EOF
)" "sprint-4,type:feature,priority:critical,database,domain:contas,stack:db" "Sprint 4 - Contas"

create_issue "[S4-02] Criar CRUD de contas na API" "$(cat <<'EOF'
## Contexto
    O usuário precisa gerenciar contas sem depender de Open Finance no MVP.

    ## Escopo
    - [ ] Criar módulo `accounts`
- [ ] Criar endpoints CRUD `/v1/accounts`
- [ ] Adicionar endpoint de saldo por conta
- [ ] Validar exclusão quando houver transações
- [ ] Garantir tenancy em todos os endpoints

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] CRUD de contas funciona
- [ ] Conta com transações não é excluída sem regra clara
- [ ] Saldo retorna em centavos

    ## Notas técnicas
    - Preferir soft delete para contas com histórico.
EOF
)" "sprint-4,type:feature,priority:critical,backend,domain:contas,stack:api" "Sprint 4 - Contas"

create_issue "[S4-03] Criar tela Contas" "$(cat <<'EOF'
## Contexto
    A tela Contas deve mostrar a separação PF/PJ e ajudar a entender onde o dinheiro está.

    ## Escopo
    - [ ] Implementar `/accounts`
- [ ] Listar contas por contexto
- [ ] Mostrar saldo derivado
- [ ] Criar CTA para nova conta
- [ ] Criar empty state
- [ ] Criar cards de total PF, total PJ e reserva

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário vê contas PF e PJ separadas
- [ ] Saldo das contas bate com transações
- [ ] Empty state orienta criar a primeira conta

    ## Notas técnicas
    - Contexto sempre visível.
EOF
)" "sprint-4,type:feature,priority:high,frontend,domain:contas" "Sprint 4 - Contas"

create_issue "[S4-04] Criar formulário de conta" "$(cat <<'EOF'
## Contexto
    Criar conta precisa ser simples, mas com dados suficientes para relatórios e split.

    ## Escopo
    - [ ] Criar modal de criar/editar conta
- [ ] Campos nome, tipo, contexto, saldo inicial opcional
- [ ] Validar nome obrigatório
- [ ] Permitir marcar conta como reserva de imposto
- [ ] Atualizar lista após salvar

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário cria conta PF e PJ
- [ ] Conta reserva pode ser usada no split
- [ ] Erros de validação aparecem no formulário

    ## Notas técnicas
    - Saldo inicial deve virar transação de ajuste, não número solto.
EOF
)" "sprint-4,type:feature,priority:normal,frontend,domain:contas" "Sprint 4 - Contas"

create_issue "[S4-05] Implementar transferências entre contas" "$(cat <<'EOF'
## Contexto
    Transferências são essenciais para pró-labore, reserva e movimentação PF/PJ sem bagunçar receita/despesa.

    ## Escopo
    - [ ] Criar tipo `transfer` ou par de transações vinculadas
- [ ] Criar endpoint de transferência
- [ ] Criar UI de transferência
- [ ] Permitir PJ → PF como pró-labore
- [ ] Garantir soma zero entre origem/destino

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Transferência debita uma conta e credita outra
- [ ] Pró-labore aparece como ponte PJ→PF
- [ ] Transferência não entra como despesa/receita indevidamente

    ## Notas técnicas
    - Esse fluxo será usado pelo SplitPanel.
EOF
)" "sprint-4,type:feature,priority:high,backend,frontend,domain:contas,domain:pj" "Sprint 4 - Contas"

create_issue "[S4-06] Criar detalhe de conta com extrato filtrado" "$(cat <<'EOF'
## Contexto
    Ao clicar numa conta, o usuário deve conseguir auditar a composição do saldo.

    ## Escopo
    - [ ] Criar rota `/accounts/:id`
- [ ] Mostrar dados da conta
- [ ] Listar transações da conta
- [ ] Mostrar saldo inicial, entradas, saídas e saldo atual
- [ ] Adicionar filtros simples
- [ ] Linkar transações para detalhe

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário audita saldo da conta
- [ ] Detalhe respeita tenancy
- [ ] Conta sem transações mostra estado vazio útil

    ## Notas técnicas
    - Reutilizar componentes da listagem de transações.
EOF
)" "sprint-4,type:feature,priority:normal,frontend,domain:contas,domain:transacoes" "Sprint 4 - Contas"

create_issue "[S4-07] Criar job de reconciliação de saldos" "$(cat <<'EOF'
## Contexto
    Divergência de saldo destrói confiança; o sistema deve detectar inconsistências automaticamente.

    ## Escopo
    - [ ] Criar job `reconciliation`
- [ ] Comparar saldos derivados com materializados, se houver
- [ ] Registrar divergência como incidente interno
- [ ] Criar log sem PII
- [ ] Criar teste com divergência artificial

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Job roda manualmente em dev
- [ ] Divergência gera registro/alerta interno
- [ ] Teste prova detecção de inconsistência

    ## Notas técnicas
    - Não expor erro técnico ao usuário final no MVP.
EOF
)" "sprint-4,type:feature,priority:high,jobs,backend,database,domain:contas" "Sprint 4 - Contas"

# ============================================================
# Criar issues da Sprint 5
# ============================================================
info "Criando issues da Sprint 5..."

create_issue "[S5-01] Modelar categorias por contexto PF/PJ" "$(cat <<'EOF'
## Contexto
    Categorias organizam lançamentos e relatórios; precisam respeitar contexto PF/PJ sem impedir categorias compartilhadas.

    ## Escopo
    - [ ] Criar model `Category`
- [ ] Campos nome, ícone, cor, contexto, tipo, ordem
- [ ] Permitir categorias globais do sistema e customizadas do usuário
- [ ] Criar migration
- [ ] Atualizar seed

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Categorias podem ser PF, PJ ou ambas
- [ ] Categorias do sistema não são apagadas por usuário
- [ ] Categorias customizadas pertencem ao household

    ## Notas técnicas
    - Não usar cor como único significado.
EOF
)" "sprint-5,type:feature,priority:critical,database,domain:categorias,stack:db" "Sprint 5 - Categorias"

create_issue "[S5-02] Criar CRUD de categorias na API" "$(cat <<'EOF'
## Contexto
    O backend deve controlar categorias padrão/customizadas e impedir inconsistências em transações existentes.

    ## Escopo
    - [ ] Criar módulo `categories`
- [ ] Criar endpoints CRUD
- [ ] Criar endpoint de categorias padrão
- [ ] Validar exclusão quando houver transações
- [ ] Permitir arquivar categoria

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário cria e edita categoria
- [ ] Categoria usada pode ser arquivada, não apagada silenciosamente
- [ ] Listagem filtra por contexto

    ## Notas técnicas
    - Arquivar preserva histórico dos relatórios.
EOF
)" "sprint-5,type:feature,priority:high,backend,domain:categorias,stack:api" "Sprint 5 - Categorias"

create_issue "[S5-03] Criar tela Categorias" "$(cat <<'EOF'
## Contexto
    A tela Categorias deve permitir organizar o app sem parecer configuração complexa demais.

    ## Escopo
    - [ ] Implementar `/categories`
- [ ] Listar categorias por PF/PJ/Todas
- [ ] Mostrar ícone, nome, tipo e uso
- [ ] Criar CTA de nova categoria
- [ ] Criar empty state para customizadas
- [ ] Permitir reordenar categorias

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário vê categorias padrão e customizadas
- [ ] Filtro por contexto funciona
- [ ] Reordenar atualiza a ordem

    ## Notas técnicas
    - Progressive disclosure: mostrar avançado apenas quando necessário.
EOF
)" "sprint-5,type:feature,priority:high,frontend,domain:categorias" "Sprint 5 - Categorias"

create_issue "[S5-04] Criar modal de criar/editar categoria" "$(cat <<'EOF'
## Contexto
    Criar categoria precisa ser rápido e funcionar tanto para uso pessoal quanto PJ.

    ## Escopo
    - [ ] Campos nome, tipo, contexto, ícone e cor
- [ ] Validação de nome duplicado por contexto
- [ ] Permitir arquivar categoria
- [ ] Mostrar prévia do chip/badge
- [ ] Atualizar selects de transação após salvar

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário cria categoria PJ
- [ ] Categoria nova aparece no QuickEntryModal
- [ ] Duplicidade é bloqueada com mensagem clara

    ## Notas técnicas
    - Ícone + label sempre; cor é suporte visual.
EOF
)" "sprint-5,type:feature,priority:normal,frontend,domain:categorias" "Sprint 5 - Categorias"

create_issue "[S5-05] Implementar sugestão de última categoria usada" "$(cat <<'EOF'
## Contexto
    Para reduzir fricção, o formulário de transação deve sugerir categoria com base em descrição/contexto/último uso.

    ## Escopo
    - [ ] Criar endpoint ou service de sugestão simples
- [ ] Salvar último uso por descrição normalizada
- [ ] Aplicar sugestão no QuickEntryModal
- [ ] Permitir usuário trocar facilmente
- [ ] Registrar correção para IA futura

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Descrição recorrente sugere categoria anterior
- [ ] Usuário pode ignorar a sugestão
- [ ] Sugestão não salva sem confirmação

    ## Notas técnicas
    - IA avançada entra Sprint 11; aqui é heurística simples.
EOF
)" "sprint-5,type:feature,priority:normal,backend,frontend,domain:categorias,domain:transacoes" "Sprint 5 - Categorias"

create_issue "[S5-06] Testar categorias nos fluxos de transação e relatório" "$(cat <<'EOF'
## Contexto
    Categorias impactam registros e relatórios; bugs aqui espalham inconsistência pelo produto.

    ## Escopo
    - [ ] Testar CRUD de categorias
- [ ] Testar arquivamento com transações antigas
- [ ] Testar filtro por contexto
- [ ] Testar categoria nova no formulário de transação
- [ ] Testar relatório por categoria com categoria arquivada

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Testes passam no CI
- [ ] Arquivar categoria não quebra relatório histórico
- [ ] Usuário A não acessa categoria de B

    ## Notas técnicas
    - Cobrir backend e componentes principais.
EOF
)" "sprint-5,type:test,priority:high,testing,domain:categorias,domain:transacoes,domain:relatorios" "Sprint 5 - Categorias"

# ============================================================
# Criar issues da Sprint 6
# ============================================================
info "Criando issues da Sprint 6..."

create_issue "[S6-01] Modelar cartões, faturas e pagamentos de fatura" "$(cat <<'EOF'
## Contexto
    Cartão é uma das maiores fontes de erro em apps financeiros; precisa ser modelado por fatura, competência e pagamento.

    ## Escopo
    - [ ] Criar models `Card`, `Invoice`, `InvoicePayment`
- [ ] Adicionar ciclo de fechamento e vencimento
- [ ] Adicionar status `open|closed|paid|partially_paid`
- [ ] Congelar total de fatura fechada
- [ ] Criar migration
- [ ] Atualizar seed com cartão e faturas

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Fatura agrupa compras do ciclo correto
- [ ] Fatura fechada congela total
- [ ] Pagamento de fatura é caixa separado da competência

    ## Notas técnicas
    - ADR cartão por fatura deve guiar a implementação.
EOF
)" "sprint-6,type:feature,priority:critical,database,domain:cartoes,stack:db" "Sprint 6 - Cartões"

create_issue "[S6-02] Criar CRUD de cartões na API" "$(cat <<'EOF'
## Contexto
    O usuário precisa cadastrar cartões manualmente e associar compras às faturas corretas.

    ## Escopo
    - [ ] Criar módulo `cards`
- [ ] Criar CRUD `/v1/cards`
- [ ] Criar endpoints de faturas por cartão
- [ ] Criar endpoint de fatura por id
- [ ] Criar endpoint `POST /v1/invoices/:id/pay`
- [ ] Garantir tenancy

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Cartão pode ser criado/editado/arquivado
- [ ] Faturas são listadas por cartão
- [ ] Pagamento de fatura gera transação de conta

    ## Notas técnicas
    - Não permitir excluir cartão com histórico sem arquivamento.
EOF
)" "sprint-6,type:feature,priority:critical,backend,domain:cartoes,stack:api" "Sprint 6 - Cartões"

create_issue "[S6-03] Criar tela Cartões" "$(cat <<'EOF'
## Contexto
    A tela Cartões deve mostrar limite, fatura atual, vencimento e gastos PF/PJ mistos.

    ## Escopo
    - [ ] Implementar `/cards`
- [ ] Listar cartões
- [ ] Mostrar fatura atual e vencimento
- [ ] Mostrar status da fatura
- [ ] Mostrar separação PF/PJ da fatura
- [ ] Criar CTA novo cartão

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário vê cartões cadastrados
- [ ] Fatura atual aparece com status claro
- [ ] Cartão sem faturas mostra orientação

    ## Notas técnicas
    - Card misto deve destacar PF/PJ com ContextBadge.
EOF
)" "sprint-6,type:feature,priority:high,frontend,domain:cartoes" "Sprint 6 - Cartões"

create_issue "[S6-04] Criar formulário de cartão" "$(cat <<'EOF'
## Contexto
    Cadastrar cartão deve capturar fechamento/vencimento para projetar faturas corretamente.

    ## Escopo
    - [ ] Campos nome, bandeira, limite opcional, dia de fechamento, dia de vencimento
- [ ] Validar dias do mês
- [ ] Permitir contexto padrão PF/PJ
- [ ] Criar/editar via modal
- [ ] Arquivar cartão

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário cria cartão com fechamento/vencimento
- [ ] Validação impede dias inválidos
- [ ] Cartão aparece no QuickEntryModal

    ## Notas técnicas
    - Limite pode ser opcional para reduzir fricção.
EOF
)" "sprint-6,type:feature,priority:normal,frontend,domain:cartoes" "Sprint 6 - Cartões"

create_issue "[S6-05] Criar InvoiceView" "$(cat <<'EOF'
## Contexto
    A fatura precisa ser auditável: compras, parcelas, total fechado e pagamento.

    ## Escopo
    - [ ] Criar rota/drawer de fatura
- [ ] Listar transações da fatura
- [ ] Mostrar parcelas futuras
- [ ] Mostrar total aberto/fechado
- [ ] Mostrar botão pagar fatura
- [ ] Mostrar histórico de pagamentos
- [ ] Bloquear edição direta se fechada

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário entende total da fatura
- [ ] Pagamento muda status da fatura
- [ ] Fatura fechada não permite alteração silenciosa

    ## Notas técnicas
    - Correção de fatura fechada deve virar ajuste auditado.
EOF
)" "sprint-6,type:feature,priority:critical,frontend,domain:cartoes,domain:transacoes" "Sprint 6 - Cartões"

create_issue "[S6-06] Implementar alocação automática de compra na fatura correta" "$(cat <<'EOF'
## Contexto
    Ao lançar compra no cartão, o sistema deve decidir a fatura por data, fechamento e vencimento.

    ## Escopo
    - [ ] Criar service de ciclo de fatura
- [ ] Calcular fatura correta para compra à vista
- [ ] Calcular faturas futuras para parcelamento
- [ ] Criar faturas automaticamente quando necessário
- [ ] Cobrir datas próximas ao fechamento

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Compra antes/depois do fechamento cai na fatura correta
- [ ] Parcelamento cria parcelas nos meses corretos
- [ ] Testes cobrem virada de mês

    ## Notas técnicas
    - Essa regra não deve viver no frontend.
EOF
)" "sprint-6,type:feature,priority:critical,backend,domain:cartoes,domain:transacoes" "Sprint 6 - Cartões"

create_issue "[S6-07] Criar job de fechamento de fatura" "$(cat <<'EOF'
## Contexto
    Faturas devem fechar automaticamente quando o ciclo termina e se tornar imutáveis.

    ## Escopo
    - [ ] Criar job `invoice-close`
- [ ] Identificar faturas cujo fechamento passou
- [ ] Congelar `closed_total_cents`
- [ ] Mudar status para `closed`
- [ ] Registrar audit log
- [ ] Testar com fake timers

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Job fecha fatura correta
- [ ] Total fechado não muda com edições posteriores
- [ ] Correção exige ajuste auditado

    ## Notas técnicas
    - Job diário via BullMQ ou schedule simples se Redis atrasar.
EOF
)" "sprint-6,type:feature,priority:high,jobs,backend,domain:cartoes" "Sprint 6 - Cartões"

create_issue "[S6-08] Testar ciclo completo de cartão no E2E" "$(cat <<'EOF'
## Contexto
    Cartão é crítico e precisa de fluxo de ponta a ponta para evitar regressões.

    ## Escopo
    - [ ] Criar teste Playwright: criar cartão
- [ ] Lançar compra parcelada
- [ ] Ver fatura atual e futura
- [ ] Fechar fatura via job/manual helper
- [ ] Pagar fatura
- [ ] Validar relatório PF/PJ

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] E2E passa no CI ou em comando local documentado
- [ ] Fluxo valida competência vs caixa
- [ ] Fatura paga atualiza dashboard/contas

    ## Notas técnicas
    - Pode entrar no job E2E da Sprint 12 se ficar pesado no CI inicial.
EOF
)" "sprint-6,type:test,priority:high,testing,domain:cartoes" "Sprint 6 - Cartões"

# ============================================================
# Criar issues da Sprint 7
# ============================================================
info "Criando issues da Sprint 7..."

create_issue "[S7-01] Modelar metas financeiras" "$(cat <<'EOF'
## Contexto
    Mesmo que o coração seja PJ, a versão completa do app precisa mapear metas para planejamento pessoal e empresarial.

    ## Escopo
    - [ ] Criar model `Goal`
- [ ] Campos nome, contexto, valor alvo, valor atual, prazo, status e tipo
- [ ] Permitir meta vinculada a conta/categoria
- [ ] Criar model de contribuições se necessário
- [ ] Criar migration e seed

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Meta pertence ao household
- [ ] Meta pode ser PF ou PJ
- [ ] Valor é armazenado em centavos

    ## Notas técnicas
    - Metas entram no app completo para evitar lacuna de planejamento.
EOF
)" "sprint-7,type:feature,priority:high,database,domain:metas,stack:db" "Sprint 7 - Metas"

create_issue "[S7-02] Criar CRUD de metas na API" "$(cat <<'EOF'
## Contexto
    Metas precisam ter API própria para tela, dashboard futuro e alertas.

    ## Escopo
    - [ ] Criar módulo `goals`
- [ ] Criar CRUD `/v1/goals`
- [ ] Criar endpoint de progresso
- [ ] Permitir concluir/pausar meta
- [ ] Garantir tenancy

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário cria, edita, pausa e conclui meta
- [ ] Progress retorna percentual e valor faltante
- [ ] Usuário A não acessa metas de B

    ## Notas técnicas
    - Não incluir investimento automático.
EOF
)" "sprint-7,type:feature,priority:high,backend,domain:metas,stack:api" "Sprint 7 - Metas"

create_issue "[S7-03] Criar tela Metas" "$(cat <<'EOF'
## Contexto
    A tela Metas deve dar clareza de objetivo sem virar planejamento financeiro complexo.

    ## Escopo
    - [ ] Implementar `/goals`
- [ ] Listar metas ativas e concluídas
- [ ] Mostrar progresso em cards
- [ ] Filtrar por PF/PJ/Todas
- [ ] Criar CTA nova meta
- [ ] Criar empty state

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário vê metas por contexto
- [ ] Progresso é legível
- [ ] Empty state sugere primeira meta simples

    ## Notas técnicas
    - Tom leve: “guardar para reserva”, “trocar notebook”, “imposto anual”.
EOF
)" "sprint-7,type:feature,priority:high,frontend,domain:metas" "Sprint 7 - Metas"

create_issue "[S7-04] Criar formulário de meta" "$(cat <<'EOF'
## Contexto
    Criar meta precisa capturar objetivo, valor e prazo com pouca fricção.

    ## Escopo
    - [ ] Campos nome, contexto, valor alvo, prazo, conta/categoria opcional
- [ ] Validar valor positivo
- [ ] Permitir editar meta
- [ ] Permitir pausar/concluir
- [ ] Mostrar prévia do prazo mensal necessário

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário cria meta PF/PJ
- [ ] Formulário mostra quanto precisa guardar por mês
- [ ] Erros são claros

    ## Notas técnicas
    - Cálculo simples; não prometer retorno financeiro.
EOF
)" "sprint-7,type:feature,priority:normal,frontend,domain:metas" "Sprint 7 - Metas"

create_issue "[S7-05] Criar fluxo de contribuição para meta" "$(cat <<'EOF'
## Contexto
    A meta precisa sair do visual e conectar com movimentações reais do usuário.

    ## Escopo
    - [ ] Permitir adicionar contribuição manual
- [ ] Opcionalmente vincular contribuição a uma transação/transferência
- [ ] Atualizar progresso
- [ ] Exibir histórico de contribuições
- [ ] Permitir desfazer contribuição com auditabilidade

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Contribuição aumenta progresso
- [ ] Histórico mostra origem
- [ ] Meta concluída ao atingir 100%

    ## Notas técnicas
    - No futuro isso pode se conectar com regras automáticas.
EOF
)" "sprint-7,type:feature,priority:normal,backend,frontend,domain:metas,domain:contas" "Sprint 7 - Metas"

create_issue "[S7-06] Integrar metas ao Dashboard" "$(cat <<'EOF'
## Contexto
    Dashboard pode mostrar poucas metas relevantes sem roubar foco dos 3 números principais.

    ## Escopo
    - [ ] Criar widget compacto de metas
- [ ] Mostrar meta prioritária ou próxima do prazo
- [ ] Linkar para tela Metas
- [ ] Criar empty state discreto
- [ ] Garantir que widget não apareça acima dos 3 números

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Widget aparece com metas ativas
- [ ] Clique abre tela Metas
- [ ] Dashboard sem metas continua limpo

    ## Notas técnicas
    - Número antes do gráfico; metas são suporte.
EOF
)" "sprint-7,type:feature,priority:low,frontend,domain:dashboard,domain:metas" "Sprint 7 - Metas"

create_issue "[S7-07] Testar metas" "$(cat <<'EOF'
## Contexto
    Metas envolvem dinheiro e progresso; precisam de testes de cálculo e tenancy.

    ## Escopo
    - [ ] Testar CRUD API
- [ ] Testar cálculo de progresso
- [ ] Testar contribuição
- [ ] Testar conclusão automática
- [ ] Testar filtros PF/PJ
- [ ] Testar componentes de meta

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Testes passam no CI
- [ ] Cálculo usa centavos
- [ ] Tenancy coberta

    ## Notas técnicas
    - Garantir arredondamento estável em percentual.
EOF
)" "sprint-7,type:test,priority:normal,testing,domain:metas" "Sprint 7 - Metas"

# ============================================================
# Criar issues da Sprint 8
# ============================================================
info "Criando issues da Sprint 8..."

create_issue "[S8-01] Modelar dívidas, parcelas e pagamentos" "$(cat <<'EOF'
## Contexto
    A tela Dívidas deve ajudar o usuário a enxergar comprometimento futuro e decidir o que pagar primeiro.

    ## Escopo
    - [ ] Criar model `Debt`
- [ ] Campos credor, descrição, contexto, saldo, taxa, vencimento, status
- [ ] Criar model `DebtInstallment` ou schedule
- [ ] Criar vínculo com pagamentos/transações
- [ ] Criar migration e seed

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Dívida pertence ao household
- [ ] Valores são em centavos
- [ ] Dívida pode gerar parcelas futuras

    ## Notas técnicas
    - Evitar aconselhamento financeiro absoluto; mostrar critérios e cálculos.
EOF
)" "sprint-8,type:feature,priority:high,database,domain:dividas,stack:db" "Sprint 8 - Dívidas"

create_issue "[S8-02] Criar CRUD de dívidas na API" "$(cat <<'EOF'
## Contexto
    O backend deve centralizar cálculos de saldo, parcelas, juros e status da dívida.

    ## Escopo
    - [ ] Criar módulo `debts`
- [ ] Criar CRUD `/v1/debts`
- [ ] Criar endpoint de parcelas
- [ ] Criar endpoint de pagamento
- [ ] Criar endpoint de resumo/prioridade
- [ ] Garantir tenancy

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário cria dívida e parcelas
- [ ] Pagamento reduz saldo
- [ ] Prioridade retorna critério transparente

    ## Notas técnicas
    - Cálculos simples no MVP completo; refinamento pode vir depois.
EOF
)" "sprint-8,type:feature,priority:high,backend,domain:dividas,stack:api" "Sprint 8 - Dívidas"

create_issue "[S8-03] Criar tela Dívidas" "$(cat <<'EOF'
## Contexto
    A tela Dívidas precisa mostrar clareza, não culpa: o usuário deve entender saldo, vencimentos e prioridade.

    ## Escopo
    - [ ] Implementar `/debts`
- [ ] Listar dívidas abertas e quitadas
- [ ] Mostrar saldo total devedor
- [ ] Mostrar próxima parcela
- [ ] Mostrar prioridade sugerida
- [ ] Filtrar por PF/PJ/Todas
- [ ] Criar empty state acolhedor

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário vê dívida total e próximas parcelas
- [ ] Prioridade é visível e explicada
- [ ] Empty state não tem tom julgador

    ## Notas técnicas
    - Linguagem humana e sem vergonha financeira.
EOF
)" "sprint-8,type:feature,priority:high,frontend,domain:dividas" "Sprint 8 - Dívidas"

create_issue "[S8-04] Criar formulário de dívida" "$(cat <<'EOF'
## Contexto
    Cadastrar dívida precisa capturar o suficiente para priorizar sem exigir planilha completa.

    ## Escopo
    - [ ] Campos credor, saldo, parcela, vencimento, taxa opcional, contexto e categoria
- [ ] Permitir dívida parcelada ou saldo único
- [ ] Validar valores positivos
- [ ] Criar/editar via modal
- [ ] Permitir anexar observação

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário cria dívida simples em poucos campos
- [ ] Taxa de juros é opcional
- [ ] Dívida aparece na lista e dashboard

    ## Notas técnicas
    - Não exigir CET exato no MVP; permitir aproximação.
EOF
)" "sprint-8,type:feature,priority:normal,frontend,domain:dividas" "Sprint 8 - Dívidas"

create_issue "[S8-05] Criar estratégia de priorização de dívidas" "$(cat <<'EOF'
## Contexto
    Uma das dores do usuário é saber qual dívida pagar primeiro; o app deve sugerir com base em juros, atraso e vencimento.

    ## Escopo
    - [ ] Criar service de score de prioridade
- [ ] Critérios: juros, atraso, vencimento próximo, saldo
- [ ] Expor explicação do score
- [ ] Criar componente `DebtPriorityCard`
- [ ] Permitir ordenar por prioridade

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Lista pode ser ordenada por prioridade
- [ ] Cada sugestão explica o motivo
- [ ] Usuário pode ignorar sugestão sem bloquear fluxo

    ## Notas técnicas
    - Não fazer promessa legal/financeira; mostrar “sugestão baseada nos dados cadastrados”.
EOF
)" "sprint-8,type:feature,priority:high,backend,frontend,domain:dividas" "Sprint 8 - Dívidas"

create_issue "[S8-06] Criar fluxo de pagamento de dívida" "$(cat <<'EOF'
## Contexto
    Pagar dívida deve gerar uma transação e atualizar saldo devedor de forma auditável.

    ## Escopo
    - [ ] Criar ação pagar parcela/dívida
- [ ] Gerar transação vinculada
- [ ] Atualizar saldo restante
- [ ] Permitir pagamento parcial
- [ ] Registrar audit log
- [ ] Atualizar dashboard e comprometido futuro

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Pagamento cria transação
- [ ] Saldo da dívida reduz corretamente
- [ ] Histórico mostra pagamentos

    ## Notas técnicas
    - Evitar editar saldo manualmente sem histórico.
EOF
)" "sprint-8,type:feature,priority:high,backend,frontend,domain:dividas,domain:transacoes" "Sprint 8 - Dívidas"

create_issue "[S8-07] Integrar dívidas ao comprometido futuro" "$(cat <<'EOF'
## Contexto
    O número “comprometido futuro” deve considerar parcelas de cartão, recorrências e dívidas.

    ## Escopo
    - [ ] Atualizar endpoint de dashboard
- [ ] Incluir próximas parcelas de dívidas
- [ ] Expor breakdown do comprometido futuro
- [ ] Criar drill-down para dívidas
- [ ] Atualizar testes de cálculo

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Comprometido futuro inclui dívidas abertas
- [ ] Usuário consegue ver composição do número
- [ ] Testes cobrem dívidas + cartão + recorrências

    ## Notas técnicas
    - Esse vínculo justifica Dívidas no app completo.
EOF
)" "sprint-8,type:feature,priority:high,backend,frontend,domain:dashboard,domain:dividas" "Sprint 8 - Dívidas"

create_issue "[S8-08] Criar alertas de vencimento de dívidas" "$(cat <<'EOF'
## Contexto
    Dívida vencendo deve virar alerta antes do susto, alinhado ao princípio de avisar antes do problema.

    ## Escopo
    - [ ] Criar regra determinística de D-7 e D-1
- [ ] Criar insight/alerta in-app
- [ ] Opcionalmente enviar e-mail na Sprint 11/12
- [ ] Permitir marcar como lido
- [ ] Linkar alerta para dívida

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Alerta aparece antes do vencimento
- [ ] Alerta linka para a dívida correta
- [ ] Usuário pode marcar como lido

    ## Notas técnicas
    - Evitar spam: respeitar limite de alertas proativos.
EOF
)" "sprint-8,type:feature,priority:normal,backend,frontend,jobs,domain:dividas,domain:ia" "Sprint 8 - Dívidas"

create_issue "[S8-09] Testar dívidas e priorização" "$(cat <<'EOF'
## Contexto
    Cálculos de dívida precisam ser previsíveis para não orientar o usuário de forma errada.

    ## Escopo
    - [ ] Testar CRUD e tenancy
- [ ] Testar pagamento parcial e total
- [ ] Testar score de prioridade
- [ ] Testar comprometido futuro com dívida
- [ ] Testar alertas de vencimento

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Testes passam no CI
- [ ] Saldo nunca fica negativo indevidamente
- [ ] Prioridade é explicável nos testes

    ## Notas técnicas
    - Usar fixtures com juros e vencimentos variados.
EOF
)" "sprint-8,type:test,priority:high,testing,domain:dividas" "Sprint 8 - Dívidas"

# ============================================================
# Criar issues da Sprint 9
# ============================================================
info "Criando issues da Sprint 9..."

create_issue "[S9-01] Criar endpoint de relatório mensal" "$(cat <<'EOF'
## Contexto
    Relatórios são a visão de fechamento: o usuário precisa entender mês, contexto e categorias com números auditáveis.

    ## Escopo
    - [ ] Criar `GET /v1/reports/monthly?month=`
- [ ] Agregar receitas, despesas, transferências e resultado
- [ ] Separar PF/PJ/Tudo
- [ ] Agrupar por categoria
- [ ] Incluir cartão por competência
- [ ] Incluir dívidas no comprometido futuro

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Endpoint retorna mês fechado por contexto
- [ ] Categoria bate com transações
- [ ] Cartão usa competência, não pagamento de fatura

    ## Notas técnicas
    - LLM não calcula números de relatório.
EOF
)" "sprint-9,type:feature,priority:critical,backend,database,domain:relatorios,stack:api" "Sprint 9 - Relatórios"

create_issue "[S9-02] Criar tela Relatórios" "$(cat <<'EOF'
## Contexto
    A página Relatórios deve consolidar a visão mensal sem competir com o dashboard.

    ## Escopo
    - [ ] Implementar `/reports`
- [ ] Criar seletor de mês
- [ ] Criar filtro PF/PJ/Tudo
- [ ] Mostrar resumo do mês
- [ ] Mostrar seções por categoria
- [ ] Criar estado vazio do mês

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário alterna mês e contexto
- [ ] Resumo atualiza corretamente
- [ ] Mês sem dados mostra orientação útil

    ## Notas técnicas
    - Gráficos são apoio, não resposta principal.
EOF
)" "sprint-9,type:feature,priority:high,frontend,domain:relatorios" "Sprint 9 - Relatórios"

create_issue "[S9-03] Criar relatório por categoria com drill-down" "$(cat <<'EOF'
## Contexto
    O usuário deve clicar em uma categoria e ver as transações que compõem aquele número.

    ## Escopo
    - [ ] Criar `CategoryReportTable`
- [ ] Mostrar total por categoria
- [ ] Permitir expandir categoria
- [ ] Listar transações do grupo
- [ ] Linkar para detalhe de transação
- [ ] Mostrar percentual do total

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Cada número de categoria é auditável
- [ ] Drill-down respeita filtros PF/PJ/mês
- [ ] Categoria arquivada aparece no histórico

    ## Notas técnicas
    - Números que batem são sagrados.
EOF
)" "sprint-9,type:feature,priority:high,frontend,domain:relatorios,domain:categorias" "Sprint 9 - Relatórios"

create_issue "[S9-04] Criar gráficos expansíveis de relatório" "$(cat <<'EOF'
## Contexto
    Gráficos ajudam na leitura, mas não devem esconder os números principais.

    ## Escopo
    - [ ] Criar `ChartCard`
- [ ] Criar gráfico de despesas por categoria
- [ ] Criar gráfico de fluxo mensal
- [ ] Criar estado loading/empty
- [ ] Garantir acessibilidade de dados tabulares

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Gráficos aparecem como detalhe expansível
- [ ] Dados principais existem em tabela/texto
- [ ] Mobile continua legível

    ## Notas técnicas
    - Não usar gráfico como única forma de comunicar.
EOF
)" "sprint-9,type:feature,priority:normal,frontend,domain:relatorios,design-system" "Sprint 9 - Relatórios"

create_issue "[S9-05] Criar relatório de mês fechado" "$(cat <<'EOF'
## Contexto
    O fechamento mensal é importante para PJ: entender faturamento, imposto separado, retirada e comprometimentos.

    ## Escopo
    - [ ] Criar `MonthCloseReport`
- [ ] Mostrar resultado PJ
- [ ] Mostrar provisões criadas/pagas
- [ ] Mostrar pró-labore transferido
- [ ] Mostrar cartão e dívidas do mês
- [ ] Criar CTA exportar

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Relatório resume o mês do PJ
- [ ] Usuário consegue auditar as origens
- [ ] CTA de exportação funciona quando implementado

    ## Notas técnicas
    - Este relatório alimenta futuro resumo semanal/mensal da IA.
EOF
)" "sprint-9,type:feature,priority:high,frontend,backend,domain:relatorios,domain:pj" "Sprint 9 - Relatórios"

create_issue "[S9-06] Implementar exportação CSV/JSON" "$(cat <<'EOF'
## Contexto
    Exportar dados é parte da confiança: a saída deve ser fácil e útil para contador/backup pessoal.

    ## Escopo
    - [ ] Criar `GET /v1/exports/full`
- [ ] Exportar transações, contas, cartões, categorias, metas e dívidas
- [ ] Criar export CSV de relatório mensal
- [ ] Criar botão exportar em Relatórios
- [ ] Garantir streaming ou geração síncrona segura no MVP

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário baixa CSV/JSON
- [ ] Arquivo contém apenas dados do household
- [ ] Export inclui Metas e Dívidas

    ## Notas técnicas
    - Sem PII desnecessária; valores em centavos ou formatados com cabeçalho claro.
EOF
)" "sprint-9,type:feature,priority:high,backend,frontend,domain:exports,domain:relatorios" "Sprint 9 - Relatórios"

create_issue "[S9-07] Testar relatórios e exportação" "$(cat <<'EOF'
## Contexto
    Relatórios consolidam vários domínios e precisam detectar divergências cedo.

    ## Escopo
    - [ ] Testar relatório mensal com PF/PJ/Tudo
- [ ] Testar categoria com drill-down
- [ ] Testar cartão por competência
- [ ] Testar dívidas no comprometido futuro
- [ ] Testar exportação por tenancy

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Testes passam no CI
- [ ] Export não vaza dados de outro household
- [ ] Relatório bate com fixtures

    ## Notas técnicas
    - Fixtures devem incluir cartão, dívida, meta e split PJ.
EOF
)" "sprint-9,type:test,priority:critical,testing,domain:relatorios,domain:exports" "Sprint 9 - Relatórios"

# ============================================================
# Criar issues da Sprint 10
# ============================================================
info "Criando issues da Sprint 10..."

create_issue "[S10-01] Criar tela Settings com navegação interna" "$(cat <<'EOF'
## Contexto
    Settings concentra perfil, fiscal, regras de split, segurança, exportação e preferências.

    ## Escopo
    - [ ] Implementar `/settings`
- [ ] Criar abas/seções Perfil, Fiscal, Split, Segurança, Dados e Aparência
- [ ] Criar layout responsivo
- [ ] Mostrar estado de salvamento
- [ ] Adicionar breadcrumbs/voltar

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário navega entre seções
- [ ] Settings funciona em mobile
- [ ] Estados de loading/error existem

    ## Notas técnicas
    - Não esconder ações críticas em menus confusos.
EOF
)" "sprint-10,type:feature,priority:high,frontend,domain:settings" "Sprint 10 - Settings"

create_issue "[S10-02] Criar configurações de perfil" "$(cat <<'EOF'
## Contexto
    O usuário precisa editar dados básicos de conta sem misturar com configurações financeiras.

    ## Escopo
    - [ ] Criar endpoint `PATCH /v1/me`
- [ ] Editar nome e imagem/avatar opcional
- [ ] Mostrar e-mail não editável inicialmente
- [ ] Criar formulário de perfil
- [ ] Adicionar validação e toast

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário atualiza nome
- [ ] Sessão reflete alteração
- [ ] Validação impede dados inválidos

    ## Notas técnicas
    - Não implementar troca de e-mail se atrasar.
EOF
)" "sprint-10,type:feature,priority:normal,frontend,backend,domain:settings,domain:auth" "Sprint 10 - Settings"

create_issue "[S10-03] Criar configurações fiscais PJ" "$(cat <<'EOF'
## Contexto
    O coração PJ depende de regime, faixa e parâmetros de provisão configuráveis.

    ## Escopo
    - [ ] Criar tela Fiscal
- [ ] Editar regime MEI/Simples/faixa
- [ ] Editar data de vencimento padrão do imposto
- [ ] Mostrar regra fiscal vigente
- [ ] Explicar que cálculo é estimativo/configurado
- [ ] Salvar no backend

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário altera regime/faixa
- [ ] Split futuro usa nova configuração
- [ ] UI explica impacto da alteração

    ## Notas técnicas
    - Não prometer cálculo fiscal oficial; evitar linguagem jurídica.
EOF
)" "sprint-10,type:feature,priority:critical,frontend,backend,domain:settings,domain:pj" "Sprint 10 - Settings"

create_issue "[S10-04] Criar configurações de regras do split" "$(cat <<'EOF'
## Contexto
    O usuário precisa ajustar percentuais de imposto, reserva e pró-labore para adaptar o método à realidade dele.

    ## Escopo
    - [ ] Criar tela de regras do split
- [ ] Editar percentual de imposto/reserva/salário
- [ ] Validar soma e limites
- [ ] Mostrar simulação com R$ 5.000
- [ ] Salvar versão da regra
- [ ] Usar regra no SplitPanel

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário ajusta percentuais
- [ ] Simulação atualiza em tempo real
- [ ] Novo split usa regra atual

    ## Notas técnicas
    - Guardar histórico básico para auditabilidade.
EOF
)" "sprint-10,type:feature,priority:critical,frontend,backend,domain:settings,domain:pj" "Sprint 10 - Settings"

create_issue "[S10-05] Criar configurações de segurança" "$(cat <<'EOF'
## Contexto
    Segurança e privacidade são parte do posicionamento de confiança do Tally.

    ## Escopo
    - [ ] Mostrar sessões/dispositivos se disponível
- [ ] Criar ação sair de todos os dispositivos
- [ ] Criar troca de senha
- [ ] Mostrar política de privacidade simples
- [ ] Criar seção de dados sensíveis minimizados

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário troca senha
- [ ] Usuário consegue encerrar sessões
- [ ] Ações críticas pedem confirmação

    ## Notas técnicas
    - Pode simplificar sessões no MVP se refresh token family ainda não expõe lista.
EOF
)" "sprint-10,type:feature,priority:normal,frontend,backend,security,domain:settings" "Sprint 10 - Settings"

create_issue "[S10-06] Criar seção Dados: exportar e excluir conta" "$(cat <<'EOF'
## Contexto
    A saída fácil é princípio inegociável: o usuário deve conseguir exportar tudo e excluir a conta sem labirinto.

    ## Escopo
    - [ ] Adicionar botão exportar dados completos
- [ ] Adicionar botão excluir conta
- [ ] Criar confirmação forte para exclusão
- [ ] Criar endpoint `DELETE /v1/account`
- [ ] Criar job/registro de purge LGPD <=30 dias

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Exportação pode ser iniciada em Settings
- [ ] Exclusão exige confirmação explícita
- [ ] Purge é registrado para processamento

    ## Notas técnicas
    - Não apagar silenciosamente sem trilha.
EOF
)" "sprint-10,type:feature,priority:high,frontend,backend,security,domain:settings,domain:exports" "Sprint 10 - Settings"

create_issue "[S10-07] Criar preferências de aparência e formato" "$(cat <<'EOF'
## Contexto
    Preferências deixam o app mais confortável sem comprometer o core.

    ## Escopo
    - [ ] Adicionar tema claro/escuro/sistema
- [ ] Salvar preferência local ou servidor
- [ ] Adicionar preferência de moeda BRL fixa inicialmente
- [ ] Adicionar preferência de semana/mês se necessário
- [ ] Aplicar tema no AppShell

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Tema alterna sem quebrar layout
- [ ] Preferência persiste
- [ ] Contraste continua AA

    ## Notas técnicas
    - Evitar gastar tempo demais em customização antes do beta.
EOF
)" "sprint-10,type:feature,priority:low,frontend,domain:settings,design-system" "Sprint 10 - Settings"

create_issue "[S10-08] Testar Settings e ações críticas" "$(cat <<'EOF'
## Contexto
    Settings contém ações sensíveis que precisam ser protegidas e previsíveis.

    ## Escopo
    - [ ] Testar atualização de perfil
- [ ] Testar regras fiscais/split
- [ ] Testar exportação
- [ ] Testar exclusão de conta
- [ ] Testar troca de senha
- [ ] Testar acessibilidade das confirmações

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Testes passam no CI
- [ ] Ações críticas têm confirmação
- [ ] Usuário A não altera Settings de B

    ## Notas técnicas
    - Priorizar testes de API para ações sensíveis.
EOF
)" "sprint-10,type:test,priority:high,testing,domain:settings,security" "Sprint 10 - Settings"

# ============================================================
# Criar issues da Sprint 11
# ============================================================
info "Criando issues da Sprint 11..."

create_issue "[S11-01] Criar módulo de IA e guardrails de prompts" "$(cat <<'EOF'
## Contexto
    A IA do Tally deve propor, não executar: saída validada, prompts versionados e sem dados desnecessários.

    ## Escopo
    - [ ] Criar módulo `ai` na API
- [ ] Criar pasta `ai/prompts`
- [ ] Criar contrato de provider LLM
- [ ] Criar timeout e circuit breaker simples
- [ ] Separar conteúdo do usuário das instruções
- [ ] Criar logs sem PII

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Provider pode ser mockado em testes
- [ ] Timeout não quebra o lançamento manual
- [ ] Prompts ficam versionados no repositório

    ## Notas técnicas
    - Nunca chamar LLM direto do browser.
EOF
)" "sprint-11,type:feature,priority:critical,backend,ai,domain:ia,stack:api" "Sprint 11 - IA + Alertas"

create_issue "[S11-02] Implementar parse de transação por linguagem natural" "$(cat <<'EOF'
## Contexto
    O usuário deve poder escrever “almoço com cliente 45 reais, empresa” e receber uma proposta confirmável.

    ## Escopo
    - [ ] Criar `POST /v1/ai/parse-transaction`
- [ ] Enviar categorias e contextos mínimos ao prompt
- [ ] Validar saída com Zod
- [ ] Retornar proposta, nunca persistir
- [ ] Criar fallback para formulário em timeout/erro
- [ ] Criar cache simples de padrões repetidos

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Endpoint retorna proposta estruturada
- [ ] Saída inválida vira fallback
- [ ] Nenhuma transação é criada sem confirmação

    ## Notas técnicas
    - Modelo pequeno; controlar custo por usuário/dia.
EOF
)" "sprint-11,type:feature,priority:critical,backend,ai,domain:ia,domain:transacoes" "Sprint 11 - IA + Alertas"

create_issue "[S11-03] Criar AIEntryField e AIProposalCard" "$(cat <<'EOF'
## Contexto
    A experiência de IA deve ser rápida, editável e transparente.

    ## Escopo
    - [ ] Criar campo de linguagem natural no QuickEntryModal
- [ ] Criar `AIProposalCard`
- [ ] Permitir confirmar em 1 clique
- [ ] Permitir editar proposta antes de salvar
- [ ] Mostrar estado parsing/error/fallback
- [ ] Registrar correções do usuário

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário transforma texto em proposta
- [ ] Confirmar cria transação pelo pipeline normal
- [ ] Editar antes de salvar funciona

    ## Notas técnicas
    - IA propõe, humano confirma.
EOF
)" "sprint-11,type:feature,priority:critical,frontend,ai,domain:ia,domain:transacoes" "Sprint 11 - IA + Alertas"

create_issue "[S11-04] Implementar feedback de categorização" "$(cat <<'EOF'
## Contexto
    Correções do usuário são o melhor caminho para personalizar a IA sem fine-tuning.

    ## Escopo
    - [ ] Criar model `AiFeedback`
- [ ] Salvar correção de categoria/contexto
- [ ] Usar exemplos recentes no prompt
- [ ] Criar endpoint interno/service
- [ ] Criar testes com provider mockado

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Correção é persistida
- [ ] Prompt futuro usa exemplos do household
- [ ] Feedback não vaza entre usuários

    ## Notas técnicas
    - Poucos examples por usuário para controlar tokens.
EOF
)" "sprint-11,type:feature,priority:normal,backend,ai,database,domain:ia,domain:categorias" "Sprint 11 - IA + Alertas"

create_issue "[S11-05] Criar insights e alertas determinísticos" "$(cat <<'EOF'
## Contexto
    Nem todo insight precisa de LLM. Alertas de provisão, teto MEI e dívida vencendo devem ser regras confiáveis.

    ## Escopo
    - [ ] Criar model `Insight`
- [ ] Criar service de alertas determinísticos
- [ ] Criar regras: provisão D-7/D-1, teto MEI 85%, dívida vencendo, gasto fora do padrão
- [ ] Criar endpoint `GET /v1/insights`
- [ ] Criar endpoint marcar como lido

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Insights aparecem por household
- [ ] Usuário marca insight como lido
- [ ] Regras não dependem de LLM

    ## Notas técnicas
    - Máximo 1 alerta proativo/dia por usuário quando notificar.
EOF
)" "sprint-11,type:feature,priority:high,backend,jobs,domain:ia,domain:pj,domain:dividas" "Sprint 11 - IA + Alertas"

create_issue "[S11-06] Criar UI de Insights/Alertas" "$(cat <<'EOF'
## Contexto
    Alertas precisam aparecer no dashboard e também ter um lugar consultável.

    ## Escopo
    - [ ] Criar componente `InsightCard`
- [ ] Mostrar insights no Dashboard
- [ ] Criar lista/drawer de insights
- [ ] Permitir marcar como lido
- [ ] Linkar para entidade relacionada
- [ ] Criar empty state positivo

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Insight tem título, descrição e evidência/link
- [ ] Marcar como lido atualiza UI
- [ ] Dashboard mostra apenas alertas relevantes

    ## Notas técnicas
    - Evitar tom alarmista.
EOF
)" "sprint-11,type:feature,priority:normal,frontend,domain:ia,domain:dashboard" "Sprint 11 - IA + Alertas"

create_issue "[S11-07] Criar job de resumo semanal" "$(cat <<'EOF'
## Contexto
    Resumo semanal é a IA proativa do MVP: SQL calcula números, LLM apenas redige três frases.

    ## Escopo
    - [ ] Criar job `weekly-summary`
- [ ] Agregar dados semana/mês por SQL
- [ ] Enviar agregados mínimos para LLM
- [ ] Salvar insight com evidence
- [ ] Enviar e-mail se configurado
- [ ] Criar teste com provider mockado

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Resumo semanal é gerado a partir de dados reais
- [ ] Números vêm do SQL, não da LLM
- [ ] Insight contém evidências auditáveis

    ## Notas técnicas
    - Sem chat aberto nesta sprint.
EOF
)" "sprint-11,type:feature,priority:high,backend,jobs,ai,domain:ia,domain:relatorios" "Sprint 11 - IA + Alertas"

create_issue "[S11-08] Criar infraestrutura de e-mail para alertas" "$(cat <<'EOF'
## Contexto
    Alguns alertas precisam chegar fora do app, especialmente provisão/imposto e resumo semanal.

    ## Escopo
    - [ ] Escolher provider de e-mail simples
- [ ] Criar módulo `mail`
- [ ] Criar templates: provisão, dívida vencendo, resumo semanal
- [ ] Criar opt-in/out em settings se necessário
- [ ] Criar logs sem PII sensível

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] E-mail de teste é enviado em dev/staging
- [ ] Templates são claros e sem dados excessivos
- [ ] Usuário pode controlar recebimento se implementado

    ## Notas técnicas
    - Pode usar modo console/local no MVP se provider atrasar.
EOF
)" "sprint-11,type:feature,priority:normal,backend,integrations,domain:ia,domain:settings" "Sprint 11 - IA + Alertas"

create_issue "[S11-09] Implementar rate limit e orçamento de IA" "$(cat <<'EOF'
## Contexto
    Custo de IA precisa ser controlado para não tornar o produto inviável.

    ## Escopo
    - [ ] Criar rate limit por usuário/IP em `/ai/*`
- [ ] Registrar tokens estimados por usuário/dia
- [ ] Criar teto diário global
- [ ] Criar fallback quando limite estourar
- [ ] Expor mensagem amigável

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário não consegue abusar do endpoint IA
- [ ] Limite global desativa IA sem derrubar CRUD manual
- [ ] Logs permitem acompanhar custo

    ## Notas técnicas
    - Redis pode ser usado; degradar de forma controlada.
EOF
)" "sprint-11,type:feature,priority:high,backend,ai,security,domain:ia" "Sprint 11 - IA + Alertas"

create_issue "[S11-10] Testar IA com fixtures e snapshots" "$(cat <<'EOF'
## Contexto
    IA não pode deixar o CI flakey nem gerar ações indevidas; tudo deve ser testável com mock.

    ## Escopo
    - [ ] Criar provider LLM mockado
- [ ] Criar fixtures de frases comuns
- [ ] Testar parse válido
- [ ] Testar saída inválida
- [ ] Testar timeout/fallback
- [ ] Snapshot dos prompts principais
- [ ] Testar que proposta não persiste sem confirmação

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Testes de IA não chamam provider real
- [ ] Fallback funciona
- [ ] Nenhuma ação da IA bypassa validação

    ## Notas técnicas
    - Custos e flakiness ficam fora do CI.
EOF
)" "sprint-11,type:test,priority:critical,testing,ai,domain:ia" "Sprint 11 - IA + Alertas"

# ============================================================
# Criar issues da Sprint 12
# ============================================================
info "Criando issues da Sprint 12..."

create_issue "[S12-01] Configurar PWA instalável" "$(cat <<'EOF'
## Contexto
    O MVP é web-first, mas o registro diário acontece no celular; PWA precisa ser de primeira classe.

    ## Escopo
    - [ ] Criar manifest
- [ ] Adicionar ícones
- [ ] Configurar service worker
- [ ] Criar prompt de instalação discreto
- [ ] Testar instalação em mobile
- [ ] Adicionar meta tags de theme color

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] App é instalável
- [ ] Ícone aparece corretamente
- [ ] PWA não quebra navegação autenticada

    ## Notas técnicas
    - Prompt após uso recorrente, não na primeira visita.
EOF
)" "sprint-12,type:feature,priority:high,frontend,pwa,stack:web" "Sprint 12 - PWA + Beta"

create_issue "[S12-02] Implementar fila offline de criação de transações" "$(cat <<'EOF'
## Contexto
    Offline deve cobrir o mínimo valioso: criar transação no celular e sincronizar depois com idempotência.

    ## Escopo
    - [ ] Criar IndexedDB store de pending transactions
- [ ] Adicionar criação offline no QuickEntryModal
- [ ] Enviar `Idempotency-Key` no flush
- [ ] Criar retry ao reconectar
- [ ] Criar indicador de pendências
- [ ] Bloquear edição offline

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Usuário cria transação offline
- [ ] Ao reconectar, transação sincroniza uma única vez
- [ ] UI mostra status pendente/sincronizado

    ## Notas técnicas
    - Só criação offline; edição/conflitos fora do escopo.
EOF
)" "sprint-12,type:feature,priority:critical,frontend,backend,pwa,domain:transacoes" "Sprint 12 - PWA + Beta"

create_issue "[S12-03] Criar suporte backend para idempotência" "$(cat <<'EOF'
## Contexto
    O backend deve aceitar retries seguros da fila offline sem duplicar transações.

    ## Escopo
    - [ ] Criar model/tabela de idempotency keys
- [ ] Aplicar em POSTs críticos
- [ ] Retornar resposta anterior para key repetida
- [ ] Expirar keys antigas
- [ ] Testar concorrência simples

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Mesmo POST com mesma key não duplica dados
- [ ] Split e transação respeitam idempotência
- [ ] Teste cobre retry

    ## Notas técnicas
    - Essencial para PWA offline confiável.
EOF
)" "sprint-12,type:feature,priority:critical,backend,database,security,pwa" "Sprint 12 - PWA + Beta"

create_issue "[S12-04] Configurar Sentry e logs estruturados" "$(cat <<'EOF'
## Contexto
    Beta precisa de visibilidade de erros sem vazar dados financeiros.

    ## Escopo
    - [ ] Configurar Sentry no front
- [ ] Configurar Sentry/API
- [ ] Adicionar release por deploy
- [ ] Configurar pino logs JSON
- [ ] Adicionar requestId
- [ ] Garantir redaction de valores/descrições sensíveis

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Erro de teste aparece no Sentry
- [ ] Logs têm requestId
- [ ] Logs não exibem descrição/valor de transações

    ## Notas técnicas
    - Observabilidade sem PII é requisito de confiança.
EOF
)" "sprint-12,type:chore,priority:high,infra,security,stack:infra" "Sprint 12 - PWA + Beta"

create_issue "[S12-05] Configurar PostHog/eventos de produto" "$(cat <<'EOF'
## Contexto
    Para validar o produto, precisamos medir ativação, AHA, retenção e uso das telas principais.

    ## Escopo
    - [ ] Instalar PostHog ou analytics equivalente
- [ ] Criar eventos: signup, onboarding_completed, transaction_created, split_applied, dashboard_viewed
- [ ] Criar eventos para metas, dívidas e relatório exportado
- [ ] Garantir opt-out básico se necessário
- [ ] Documentar eventos

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Eventos aparecem em ambiente de teste
- [ ] Evento de split_applied existe
- [ ] Não enviar valores financeiros crus sem necessidade

    ## Notas técnicas
    - Métricas ajudam a validar se o app completo não diluiu o AHA.
EOF
)" "sprint-12,type:feature,priority:normal,frontend,infra,domain:dashboard" "Sprint 12 - PWA + Beta"

create_issue "[S12-06] Criar suíte E2E dos caminhos principais" "$(cat <<'EOF'
## Contexto
    Antes do beta, os fluxos principais precisam ser testados de ponta a ponta.

    ## Escopo
    - [ ] Criar setup Playwright
- [ ] Teste cadastro + onboarding
- [ ] Teste criar transação PF
- [ ] Teste receita PJ + split
- [ ] Teste cartão parcelado + fatura
- [ ] Teste meta
- [ ] Teste dívida
- [ ] Teste relatório + exportação

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] E2E roda localmente documentado
- [ ] Fluxos principais passam com seed limpo
- [ ] Falhas geram screenshot/trace

    ## Notas técnicas
    - Se CI ficar pesado, rodar E2E em workflow separado.
EOF
)" "sprint-12,type:test,priority:critical,testing,stack:web,stack:api" "Sprint 12 - PWA + Beta"

create_issue "[S12-07] Configurar deploy preview e produção" "$(cat <<'EOF'
## Contexto
    O projeto precisa demonstrar maturidade com preview por PR e deploy controlado.

    ## Escopo
    - [ ] Configurar Vercel para web
- [ ] Configurar Railway/Fly/Render para API
- [ ] Configurar banco e Redis de staging
- [ ] Criar variáveis de ambiente
- [ ] Rodar migrations no deploy
- [ ] Criar healthcheck pós-deploy

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] PR gera preview web
- [ ] API staging responde healthcheck
- [ ] Deploy main roda migrations antes da API

    ## Notas técnicas
    - Região São Paulo se possível.
EOF
)" "sprint-12,type:chore,priority:critical,infra,stack:infra" "Sprint 12 - PWA + Beta"

create_issue "[S12-08] Criar rotina de backup e teste de restore" "$(cat <<'EOF'
## Contexto
    Backup só é confiável se o restore for testado; isso é diferencial de confiança contra apps com perda de dados.

    ## Escopo
    - [ ] Configurar snapshot diário do Postgres
- [ ] Documentar restore local/staging
- [ ] Criar checklist mensal de restore
- [ ] Testar restore com seed/dados fake
- [ ] Adicionar SECURITY.md com política básica

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Existe documentação de restore
- [ ] Restore foi testado ao menos uma vez em ambiente fake
- [ ] README/SECURITY apontam para a rotina

    ## Notas técnicas
    - Não armazenar dumps reais em repositório.
EOF
)" "sprint-12,type:docs,type:chore,priority:high,database,security,infra" "Sprint 12 - PWA + Beta"

create_issue "[S12-09] Criar checklist de beta e hardening" "$(cat <<'EOF'
## Contexto
    Antes de mostrar para usuários, o app precisa passar por um checklist explícito de qualidade, segurança e produto.

    ## Escopo
    - [ ] Criar `docs/beta-checklist.md`
- [ ] Checklist de segurança/tenancy
- [ ] Checklist de dados e exportação
- [ ] Checklist de acessibilidade
- [ ] Checklist de UX mobile
- [ ] Checklist de erros e observabilidade
- [ ] Checklist de métricas de produto

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] Checklist está no repositório
- [ ] Cada item tem status e responsável
- [ ] Beta não começa com item crítico aberto

    ## Notas técnicas
    - Use isso como peça de portfólio também.
EOF
)" "sprint-12,type:docs,priority:high,docs,security,testing" "Sprint 12 - PWA + Beta"

create_issue "[S12-10] Atualizar README com screenshots e status real" "$(cat <<'EOF'
## Contexto
    Ao final do beta, o README deve refletir o produto real, com telas, roadmap e instruções confiáveis.

    ## Escopo
    - [ ] Atualizar status do projeto
- [ ] Adicionar screenshots das telas principais
- [ ] Atualizar roadmap com progresso
- [ ] Validar comandos de setup
- [ ] Adicionar links de deploy
- [ ] Adicionar seção de arquitetura resumida

    ## Fora do escopo
    - [ ] Funcionalidades de outras sprints

    ## Critério de aceite
    - [ ] README permite rodar o projeto do zero
- [ ] Screenshots representam o estado atual
- [ ] Roadmap está alinhado às issues/milestones

    ## Notas técnicas
    - Este arquivo gerado agora já antecipa o roadmap por telas.
EOF
)" "sprint-12,type:docs,priority:normal,docs" "Sprint 12 - PWA + Beta"

log "Issues criadas."

echo ""
log "Processo finalizado."
info "Próximo passo: abrir o Project $PROJECT_ID e conferir milestones/colunas."
