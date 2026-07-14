# AGENTS.md — Tally

> Instruções persistentes para agentes de IA trabalhando neste repositório.
> Leia este arquivo antes de qualquer alteração. Ele é o contrato de produto, arquitetura, pastas, escopo e qualidade.

---

## 0. Como usar este arquivo

Este arquivo deve orientar qualquer agente de IA, como Codex, Claude Code, Cursor Agent ou ChatGPT, ao trabalhar no projeto **Tally**.

Antes de agir:

1. Leia este `AGENTS.md`.
2. Leia a issue ou pedido atual.
3. Leia os documentos relevantes em `docs/` e as ADRs relacionadas.
4. Leia os arquivos do repositório antes de editar.
5. Faça a menor mudança completa possível.
6. Rode as validações disponíveis.
7. Explique no final o que mudou, onde mudou, o que foi validado e o que ficou pendente.

Este projeto é pessoal, mas deve ser tratado como produto real: **production-minded, portfolio-grade, incremental, testável, seguro e financeiramente correto**.

O Tally trabalha com dinheiro, dados financeiros e decisões sensíveis. Qualquer agente deve priorizar **confiança, integridade, privacidade e auditabilidade** acima de velocidade aparente.

---

## 1. Visão do produto

**Nome do produto:** Tally  
**Repositório:** `fernandaquerino/tally`  
**Tipo:** web app financeiro para quem vive de CNPJ.  
**Usuário principal:** pessoa física que também atua como pessoa jurídica — MEI, freelancer, consultor PJ, profissional liberal ou prestador de serviço solo.

O Tally é o app financeiro para quem precisa enxergar **PF e PJ no mesmo lugar, sem misturar os dinheiros**.

Ele ajuda a responder:

- Quanto entrou no mês?
- Quanto desse faturamento é realmente meu?
- Quanto preciso separar para imposto?
- Quanto vai para reserva da empresa?
- Quanto posso retirar como meu salário?
- O que está comprometido em cartão, parcelas, metas e dívidas?
- O que é PF, o que é PJ e o que está misturado?
- Quais alertas preciso ver antes do susto?
- Como fechar o mês de forma clara e auditável?
- Como exportar meus dados para mim ou para meu contador?

A dor central do produto:

> PF e PJ são a mesma pessoa, mas precisam ser dinheiros diferentes.

O momento AHA do produto:

> “Pela primeira vez eu sei quanto do meu faturamento PJ é realmente meu.”

O Tally não é só um CRUD financeiro. Ele é um método embutido para separar faturamento, impostos, reserva, pró-labore, vida pessoal, cartão, metas e dívidas.

---

## 2. Princípios de produto

1. **O split é o método.** O diferencial central é transformar recebimento PJ em imposto, reserva e salário pessoal.
2. **Dez segundos ou nada.** Registrar uma transação deve levar menos de 10 segundos. Se uma tela adiciona fricção ao registro, justifique ou corte.
3. **PF e PJ sempre visíveis, nunca misturados.** Toda transação, relatório, número e alerta deve deixar claro se é PF, PJ ou ambos.
4. **O número antes do gráfico.** A pergunta principal é “quanto posso gastar?”, não “qual gráfico ficou bonito?”.
5. **Números que batem são sagrados.** Todo total precisa ser derivável, auditável e reconciliável.
6. **IA propõe, humano confirma.** A IA nunca persiste ação silenciosa, nunca calcula imposto e nunca substitui validação de domínio.
7. **Avisar antes do susto.** O app deve avisar sobre DAS, teto MEI, fatura, dívida e ritmo de gastos antes do problema virar urgência.
8. **Simples na entrada, profundo sob demanda.** A primeira experiência deve ser leve; relatórios, configurações fiscais e detalhes ficam atrás de “ver mais”.
9. **Confiança é feature.** Backup, exportação, auditoria e exclusão transparente são parte do produto, não extras técnicos.
10. **Pago = o que funciona melhor.** Nunca colocar paywall em cima de feature instável.
11. **Web de verdade.** Desktop deve ter densidade, atalhos e tabelas; mobile PWA deve ter registro rápido e usável com o polegar.
12. **Linguagem de gente, não de banco.** Use “seu salário” antes de “pró-labore”, “separado para imposto” antes de “provisão tributária”.
13. **Melhor simples funcionando do que complexo pela metade.** Não superengenheire antes de entregar valor ponta a ponta.

---

## 3. Escopo do app completo de portfólio

O roadmap atual é a versão **app completo por telas**, incluindo Dashboard, Transações, Contas, Categorias, Cartões, Metas, Dívidas, Relatórios, Settings, IA e PWA.

A ordem foi organizada para facilitar desenvolvimento no GitHub Projects e demonstrar maturidade fullstack.

### Dentro do escopo planejado

- autenticação e usuário;
- onboarding fiscal e financeiro;
- app shell autenticado com sidebar;
- dashboard com 3 números principais;
- transações PF/PJ;
- lançamento rápido em menos de 10s;
- lançamento por linguagem natural com IA;
- categorias padrão e customizadas;
- contas PF/PJ;
- cartão de crédito modelado por fatura;
- parcelamentos e recorrências;
- divisor de recebimento PJ;
- provisões de imposto;
- pró-labore como ponte PJ → PF;
- metas financeiras PF/PJ;
- dívidas, parcelas e priorização;
- relatórios mensais com filtros PF/PJ/Tudo;
- exportação CSV/JSON;
- settings de perfil, segurança, fiscal, split e dados;
- alertas e resumo semanal;
- PWA instalável;
- fila offline mínima para criação de transações;
- observabilidade mínima;
- testes unitários, integração e E2E dos fluxos críticos;
- deploy beta.

### Fora do escopo sem issue explícita e ADR

Não implemente sem uma issue clara e uma ADR aprovada:

- app mobile nativo;
- Open Finance;
- importação automática via banco;
- emissão de nota fiscal;
- pagamento de DAS dentro do app;
- conta bancária própria;
- crédito/empréstimo;
- investimentos avançados;
- RAG, embeddings ou pgvector;
- agentes de IA customizáveis;
- chat financeiro aberto ilimitado;
- multiusuário avançado/família;
- visão do contador com permissão granular;
- marketplace ou comunidade;
- integrações fiscais regulatórias;
- OCR de recibos;
- gamificação complexa.

Esses itens são `Future` até uma decisão formal.

---

## 4. Stack oficial

Não adicione bibliotecas fora desta stack sem justificar claramente o trade-off.

| Camada           | Tecnologia                                                     |
| ---------------- | -------------------------------------------------------------- |
| Monorepo         | pnpm workspaces + Turborepo                                    |
| Frontend         | Next.js 15 App Router                                          |
| UI               | Tailwind CSS + shadcn/ui + componentes próprios                |
| Estado servidor  | React Query                                                    |
| Estado UI        | Zustand para estado efêmero                                    |
| Formulários      | React Hook Form + Zod                                          |
| Backend          | NestJS monólito modular                                        |
| API              | REST `/v1`                                                     |
| Linguagem        | TypeScript strict                                              |
| Banco            | PostgreSQL 16                                                  |
| ORM              | Prisma + Prisma Migrate                                        |
| Filas/cache leve | Redis + BullMQ                                                 |
| IA               | LLM via API, chamada apenas pelo backend                       |
| PWA/offline      | Service worker + IndexedDB para fila mínima                    |
| Testes           | Vitest, Testing Library, Playwright                            |
| Infra local      | Docker Compose                                                 |
| CI/CD            | GitHub Actions                                                 |
| Deploy           | Vercel para web; Railway/Fly/Render para API, Postgres e Redis |

Antes de instalar qualquer pacote novo, responda no PR ou na issue:

```md
## Por que preciso deste pacote?

- Problema que resolve:
- Alternativas consideradas:
- Por que não dá para fazer com o que já existe:
- Impacto no bundle/manutenção:
- Riscos de segurança ou privacidade:
```

Se não houver justificativa, não instale.

---

## 5. Estrutura de pastas esperada

Estrutura alvo do monorepo:

```txt
tally/
├── apps/
│   ├── web/                              # Next.js — landing + app autenticada + PWA
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (marketing)/          # landing, blog, SEO
│   │       │   ├── (auth)/               # login, cadastro, callback, onboarding
│   │       │   └── (app)/                # rotas autenticadas
│   │       │       ├── dashboard/
│   │       │       ├── transacoes/
│   │       │       ├── contas/
│   │       │       ├── categorias/
│   │       │       ├── cartoes/
│   │       │       ├── metas/
│   │       │       ├── dividas/
│   │       │       ├── relatorios/
│   │       │       └── settings/
│   │       ├── components/
│   │       │   ├── ui/                   # shadcn/primitivos locais se não estiverem em package
│   │       │   ├── app/                  # AppShell, Sidebar, Topbar, PageHeader
│   │       │   ├── feedback/             # EmptyState, LoadingState, ErrorState, Toast
│   │       │   ├── charts/               # wrappers Recharts
│   │       │   └── data-display/         # MetricCard, DataTable, ContextBadge
│   │       ├── features/
│   │       │   ├── auth/
│   │       │   ├── onboarding/
│   │       │   ├── dashboard/
│   │       │   ├── transactions/
│   │       │   ├── accounts/
│   │       │   ├── categories/
│   │       │   ├── cards/
│   │       │   ├── invoices/
│   │       │   ├── split/
│   │       │   ├── provisions/
│   │       │   ├── goals/
│   │       │   ├── debts/
│   │       │   ├── reports/
│   │       │   ├── settings/
│   │       │   ├── ai-entry/
│   │       │   └── insights/
│   │       ├── lib/                      # api client, auth helpers, money/date formatters
│   │       ├── stores/                   # Zustand para UI efêmera
│   │       ├── styles/                   # tokens/css vars se necessário
│   │       └── pwa/                      # service worker, IndexedDB, fila offline
│   │
│   └── api/                              # NestJS API REST /v1
│       └── src/
│           ├── main.ts
│           ├── app.module.ts
│           ├── config/                   # env validation/config tipada
│           ├── common/                   # guards, filters, interceptors, decorators
│           ├── prisma/                   # PrismaService
│           └── modules/
│               ├── auth/
│               ├── users/
│               ├── households/
│               ├── onboarding/
│               ├── contexts/
│               ├── accounts/
│               ├── categories/
│               ├── cards/
│               ├── invoices/
│               ├── transactions/
│               ├── splits/
│               ├── provisions/
│               ├── goals/
│               ├── debts/
│               ├── reports/
│               ├── exports/
│               ├── fiscal/
│               ├── ai/
│               ├── insights/
│               ├── settings/
│               └── jobs/
│
├── packages/
│   ├── shared/                           # schemas Zod, tipos de API, utils de dinheiro/data
│   └── config/                           # eslint, tsconfig, prettier compartilhados
│
├── prisma/                               # schema.prisma, migrations e seed
├── docs/
│   ├── discovery/
│   ├── product/
│   ├── ux/
│   └── architecture/
│       ├── adr/
│       ├── architecture.md
│       ├── system-design.md
│       ├── domain-model.md
│       ├── data-model.md
│       └── threat-model.md
├── scripts/                              # scripts idempotentes
├── .github/workflows/                    # CI/CD
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
├── tsconfig.base.json
├── README.md
└── AGENTS.md
```

### Regra de ouro de pastas

- Se algo tem domínio de produto, coloque na feature/domínio correspondente.
- Se algo é primitivo visual genérico, coloque em `components/ui` ou package apropriado.
- Se algo é contrato compartilhado, coloque em `packages/shared`.
- Se algo é regra de backend, coloque em `apps/api/src/modules/<domain>`.
- Se algo fala com banco, deve passar por repository/service do backend, nunca pelo frontend.
- Se algo é decisão arquitetural, documente ou atualize ADR.

---

## 6. O que vai em cada pasta

### `apps/api/src/modules/<domain>`

Cada domínio do NestJS deve seguir, sempre que fizer sentido:

```txt
modules/<domain>/
├── <domain>.module.ts
├── <domain>.controller.ts
├── <domain>.service.ts
├── <domain>.repository.ts
├── dto/
├── mappers/
├── entities/              # tipos internos do domínio, se necessário
├── policies/              # regras de autorização específicas, se necessário
└── tests/
```

Regras:

- controller é fino;
- service contém regra de negócio;
- repository é a única camada do domínio que fala com Prisma;
- DTO valida entrada;
- mapper converte banco → resposta;
- módulo não deve acessar repository de outro domínio diretamente sem service público;
- toda query de domínio deve receber `householdId` derivado da sessão/token;
- não aceitar `householdId` ou `userId` como fonte de autorização vinda do client.

### `apps/web/src/features/<domain>`

Cada feature do web deve seguir:

```txt
features/<domain>/
├── components/
├── hooks/
├── services/              # chamadas ao api client ou server actions finas
├── types/                 # tipos locais da UI
├── utils/                 # util específico da feature
└── constants.ts
```

Regras:

- componente de feature pode conhecer o domínio;
- componente de feature não deve virar UI genérica sem motivo;
- hooks de query/mutation ficam na feature;
- transformação pesada de dados não fica no JSX;
- não criar `features/shared` como lixeira;
- nomes de domínio no código podem ser em inglês, mas a UI deve ser PT-BR.

### `packages/shared`

Use para:

- schemas Zod compartilhados;
- tipos de request/response;
- enums de domínio;
- utils puros de dinheiro;
- utils puros de data;
- constantes compartilhadas realmente globais.

Não coloque aqui:

- React;
- NestJS;
- PrismaClient;
- regra de negócio que depende de banco;
- lógica de renderização.

### `prisma/`

Use para:

- `schema.prisma`;
- migrations versionadas;
- seed local;
- scripts relacionados ao banco.

Regras:

- nunca edite migration antiga já aplicada;
- gere nova migration para mudança de schema;
- revise migration antes de considerar pronta;
- seed deve usar dados fictícios e realistas;
- não coloque dados financeiros pessoais reais em seed.

### `docs/architecture/adr`

Use para decisões arquiteturais.

ADR não é decoração. Se uma decisão muda, atualize a ADR.

---

## 7. Regras de “não fazer de jeito nenhum”

Estas regras são obrigatórias.

### Produto e escopo

- Não transformar o Tally em Mobills genérico.
- Não transformar o Tally em ERP, emissor de nota ou banco digital.
- Não implementar Open Finance sem issue explícita e ADR.
- Não criar chat IA aberto antes da IA v1 enxuta estar estável.
- Não esconder o contexto PF/PJ do usuário.
- Não criar dashboard cheio de gráfico antes de responder “quanto posso gastar?”.
- Não tratar metas e dívidas como enfeite visual; elas afetam comprometido futuro.
- Não criar telas só com dados mockados e considerar pronto.
- Não adicionar gamificação infantil em produto financeiro sério.

### Arquitetura

- Não colocar regra de negócio dentro de componente React.
- Não colocar regra de negócio dentro de controller NestJS.
- Não acessar Prisma pelo frontend.
- Não duplicar regra financeira no Next e no Nest.
- Não criar store global monolítica para dados de servidor.
- Não salvar dados de servidor em Zustand/localStorage como fonte de verdade.
- Não criar `utils.ts` gigante.
- Não criar abstração com apenas um uso real.
- Não refatorar arquitetura inteira durante uma issue pequena.
- Não implementar microserviços no MVP/app completo de portfólio sem ADR.

### Dinheiro e domínio financeiro

- Não usar `number`, `float`, `double`, `parseFloat` ou cálculo decimal solto para dinheiro.
- Não armazenar dinheiro em reais como decimal no banco.
- Não exibir soma que não possa ser auditada.
- Não salvar saldo como fonte única da verdade.
- Não editar fatura fechada diretamente.
- Não tratar cartão de crédito como conta comum.
- Não misturar competência e caixa sem explicitar.
- Não calcular imposto via LLM.
- Não hardcodar alíquota fiscal em componente ou prompt.
- Não criar split que não feche em soma exata de centavos.

### Segurança e dados

- Não confiar em `userId` ou `householdId` vindo do client.
- Não retornar dados de outro household.
- Não logar token, senha, JWT, cookies, e-mail completo, valores financeiros, descrições de transações ou dados fiscais sensíveis.
- Não salvar token em localStorage.
- Não commitar `.env`, secrets, chaves ou credenciais.
- Não expor stack trace em response de produção.
- Não ignorar autorização em update/delete.
- Não renderizar texto de IA sem sanitização quando houver risco de HTML/markdown inseguro.

### Banco

- Não editar migration aplicada manualmente.
- Não criar tabela de domínio sem `householdId`, salvo tabela global justificada.
- Não fazer hard delete por padrão em dados financeiros.
- Não usar JSON/JSONB como atalho para evitar modelagem sem ADR.
- Não remover campos/tabelas sem migration e sem ajustar consumers.
- Não fazer cascade destrutivo em dados financeiros sem entender impacto.

### Frontend

- Não usar `any` para calar TypeScript.
- Não usar `// @ts-ignore` sem explicação e issue de follow-up.
- Não criar Client Component se Server Component resolve.
- Não remover focus outline sem substituir por focus visível.
- Não deixar tela com dados remotos sem loading/error/empty.
- Não usar texto hardcoded em inglês na UI, exceto termos técnicos inevitáveis.
- Não usar cor como único diferenciador entre PF/PJ.
- Não esconder ação principal.
- Não criar formulário que perde dados ao falhar submit.

### Testes e qualidade

- Não remover teste para passar build sem explicar.
- Não pular lint/typecheck se o comando existe.
- Não deixar `console.log` solto.
- Não engolir erro com `catch {}` vazio.
- Não finalizar issue dizendo que está pronta se não rodou validação ou não explicou por que não rodou.

---

## 8. Domínios do produto

### 8.1 Auth e usuário

Responsável por:

- cadastro;
- login;
- logout;
- refresh de sessão;
- perfil;
- timezone;
- preferências;
- segurança da conta.

Regras:

- `userId` sempre vem da sessão/token.
- Rotas privadas exigem autenticação.
- Não retornar hash de senha.
- Sessão deve usar cookie httpOnly/Secure/SameSite quando aplicável.
- Tokens sensíveis nunca vão para localStorage.

### 8.2 Household e tenancy

Mesmo que no início exista apenas uma pessoa, o modelo deve nascer preparado para `household`.

Responsável por:

- isolar dados financeiros;
- permitir futuro família/contador sem refatoração brutal;
- garantir que toda query de domínio filtre por `householdId`.

Regras:

- `householdId` vem do servidor.
- O client nunca decide o household autoritativo.
- Toda tabela financeira deve ter `householdId`.
- Testes de IDOR são obrigatórios para endpoints autenticados.

### 8.3 Onboarding fiscal e financeiro

Responsável por coletar dados mínimos para entregar valor:

- perfil: PF, MEI, Simples, PJ prestador de serviço;
- faixa/regime fiscal simplificado;
- percentual de imposto/reserva;
- contas iniciais;
- cartão inicial opcional;
- meta inicial opcional;
- dívida inicial opcional.

Regras:

- Progressive disclosure: não transformar onboarding em formulário de contador.
- Pedir o mínimo para gerar os 3 números principais.
- Dados fiscais são configuração, não cálculo por IA.

### 8.4 Dashboard

Responsável por responder rápido:

- resultado PJ;
- disponível pessoal;
- comprometido futuro;
- painel PJ;
- próximas provisões;
- alertas;
- últimas transações;
- metas em andamento;
- dívidas relevantes.

Regras:

- Home prioriza números, não gráficos.
- Todo número deve ser clicável ou auditável.
- Mostrar PF/PJ claramente.
- Não criar cards decorativos sem ação ou explicação.

### 8.5 Transações

Core operacional do app.

Tipos esperados:

- receita;
- despesa;
- transferência;
- ajuste;
- pagamento de fatura;
- pagamento de dívida;
- contribuição em meta;
- provisão;
- split.

Regras:

- criação em menos de 10s;
- toda transação tem contexto PF/PJ;
- toda transação tem fonte: `form`, `ai`, `import`, `system`;
- toda transação precisa pertencer a uma conta ou fatura, respeitando regras do domínio;
- mutações críticas devem ser auditáveis;
- excluir deve ser soft delete quando houver histórico financeiro relevante.

### 8.6 Categorias

Responsável por classificar transações.

Regras:

- categorias padrão existem para PF e PJ;
- categorias customizadas pertencem ao household;
- categoria pode ter contexto PF, PJ ou ambos;
- última categoria usada pode melhorar velocidade do lançamento;
- IA pode sugerir categoria, mas usuário confirma.

### 8.7 Contas

Responsável por dinheiro em caixa.

Tipos possíveis:

- conta corrente PF;
- conta corrente PJ;
- carteira;
- reserva;
- poupança;
- conta manual.

Regras:

- saldo exibido é derivado das transações;
- saldo materializado, se existir, é cache/reconciliação, não fonte da verdade;
- transferência entre contas deve gerar duas pernas auditáveis;
- pró-labore é ponte PJ → PF;
- não misturar conta com cartão de crédito.

### 8.8 Cartões e faturas

Cartão de crédito deve ser modelado corretamente.

Entidades esperadas:

- card;
- invoice;
- invoice payment;
- installment group;
- transactions vinculadas à fatura.

Regras:

- fatura é agrupador de competência;
- pagamento de fatura é caixa;
- compra parcelada cria parcelas nas faturas corretas;
- fatura aberta tem total derivado;
- fatura fechada congela total e fica imutável;
- correção de fatura fechada deve ocorrer via ajuste auditado;
- cartão misto PF/PJ precisa separar relatórios por contexto.

### 8.9 Split de recebimento PJ

O split é o coração do Tally.

Quando entra uma receita PJ, o app deve sugerir:

- imposto/DAS/IR/reserva fiscal;
- reserva da empresa;
- salário/pró-labore;
- valor disponível.

Regras:

- split deve rodar em transação atômica no banco;
- todas as pernas devem referenciar `splitId`;
- percentuais são configuráveis;
- fiscal rules são versionadas;
- LLM nunca calcula imposto;
- arredondamento em centavos deve fechar exatamente.

### 8.10 Provisões

Responsável por dinheiro separado para obrigação futura.

Exemplos:

- DAS;
- IR;
- contador;
- reserva mensal;
- impostos configuráveis.

Regras:

- provisão tem status: pendente, paga, cancelada;
- provisão tem vencimento;
- lembrete D-7 e D-1 quando aplicável;
- pagar provisão gera transação ou marca baixa com auditoria.

### 8.11 Metas

Tela real do app completo.

Exemplos:

- reserva de emergência;
- trocar notebook;
- férias;
- quitar dívida;
- reserva de imposto;
- meta PJ de caixa mínimo.

Campos esperados:

- nome;
- contexto PF/PJ;
- valor alvo em centavos;
- valor atual/contribuído;
- data alvo opcional;
- status;
- prioridade;
- contribuições vinculadas a transações.

Regras:

- meta não é só card visual;
- contribuições devem ser auditáveis;
- meta afeta planejamento, mas não deve mentir sobre saldo;
- metas PF e PJ podem coexistir;
- dashboard pode mostrar widget compacto.

### 8.12 Dívidas

Tela real do app completo.

Exemplos:

- cartão atrasado;
- empréstimo;
- financiamento;
- dívida com pessoa física;
- imposto parcelado;
- dívida PJ.

Campos esperados:

- credor;
- contexto PF/PJ;
- principal em centavos;
- saldo atual em centavos;
- taxa de juros opcional;
- parcelas;
- vencimento;
- prioridade;
- status;
- pagamentos vinculados.

Regras:

- dívida impacta comprometido futuro;
- pagamentos reduzem saldo;
- parcelas futuras devem aparecer em projeção;
- priorização deve ser explicável;
- não prometer aconselhamento financeiro profissional;
- mostrar critérios: juros, vencimento, valor, risco.

### 8.13 Relatórios

Responsável por fechamento e análise.

Relatórios esperados:

- relatório mensal;
- categorias;
- PF/PJ/Tudo;
- fluxo de caixa;
- faturas;
- metas;
- dívidas;
- exportação CSV/JSON;
- drill-down dos números.

Regras:

- relatório deve ser auditável;
- filtros relevantes ficam na URL quando fizer sentido;
- gráfico é detalhe expansível;
- exportação deve respeitar household e autorização;
- export não deve vazar dados de outro usuário.

### 8.14 Settings

Responsável por:

- perfil;
- preferências de tema;
- configurações fiscais;
- regras de split;
- categorias padrão;
- segurança;
- exportação;
- exclusão de conta;
- LGPD;
- plano/assinatura no futuro.

Regras:

- configurações sensíveis exigem autorização;
- exclusão de conta deve ser explícita;
- exportação completa deve ser fácil;
- alterar regra fiscal não deve reescrever histórico sem fluxo claro.

### 8.15 IA e alertas

IA v1 é enxuta e proativa.

Pode conter:

- parsing de lançamento por linguagem natural;
- categorização sugerida;
- resumo semanal;
- explicação de alertas;
- insights com evidências.

Não deve conter sem ADR:

- chat aberto ilimitado;
- agentes customizáveis;
- RAG;
- embeddings;
- recomendação financeira complexa;
- cálculo fiscal por LLM.

Regras:

- IA retorna proposta;
- proposta passa por schema Zod;
- usuário confirma antes de persistir;
- timeout tem fallback para formulário;
- prompts versionados;
- testes com modelo mockado;
- custos medidos por usuário/dia quando implementado.

### 8.16 PWA e offline

Escopo mínimo:

- app instalável;
- service worker;
- fila offline apenas para criação de transações;
- IndexedDB;
- flush com `Idempotency-Key`;
- leitura offline como snapshot desatualizado.

Fora do escopo inicial:

- edição offline;
- resolução complexa de conflitos;
- sync completo;
- push notification avançado.

---

## 9. Roadmap por sprint

### Sprint 0 — Fundação

Foco: infraestrutura, base técnica e ADRs.

Entregável: app roda local, API responde healthcheck, banco sobe, CI valida, design system mínimo existe.

Issues típicas:

- monorepo com pnpm workspaces;
- Turborepo;
- Docker Compose com Postgres 16 e Redis;
- setup base do Next.js;
- setup base do NestJS;
- Prisma inicial;
- `.env.example`;
- CI com lint, typecheck e test;
- design system mínimo;
- ADRs iniciais.

### Sprint 1 — App Shell + Auth

Entregável: usuário consegue registrar/logar, passar pelo onboarding inicial e ver layout autenticado com sidebar completa.

Inclui:

- auth;
- sessão;
- tenancy;
- onboarding fiscal;
- AppShell;
- Sidebar;
- Topbar;
- rotas vazias das telas principais;
- guards de rota;
- testes básicos de autorização.

### Sprint 2 — Dashboard

Entregável: dashboard inicial com 3 números, painel PJ, alertas e últimas transações.

Inclui:

- cards principais;
- painel PJ;
- widget de comprometido futuro;
- últimas transações;
- próximos alertas;
- empty/loading/error;
- APIs agregadas.

### Sprint 3 — Transações

Entregável: CRUD de transações PF/PJ com lançamento rápido, filtros, recorrências, parcelamentos e divisor de recebimento PJ.

Inclui:

- tela de lista;
- modal/form de nova transação;
- filtros;
- detalhe;
- split;
- recorrência;
- parcelamento;
- testes de invariantes.

### Sprint 4 — Contas

Entregável: contas PF/PJ, saldos derivados, transferências, pró-labore e reconciliação.

### Sprint 5 — Categorias

Entregável: categorias padrão e customizadas por contexto, usadas no lançamento e relatórios.

### Sprint 6 — Cartões

Entregável: cartões, faturas, compra parcelada, fechamento e pagamento de fatura.

### Sprint 7 — Metas

Entregável: metas PF/PJ com progresso, contribuições e widget no dashboard.

### Sprint 8 — Dívidas

Entregável: dívidas com parcelas, pagamentos, prioridade e impacto no comprometido futuro.

### Sprint 9 — Relatórios

Entregável: relatório mensal PF/PJ/Tudo, gráficos expansíveis, drill-down e exportação.

### Sprint 10 — Settings

Entregável: perfil, fiscal, regras de split, segurança, dados, exportação e exclusão de conta.

### Sprint 11 — IA + Alertas

Entregável: lançamento por linguagem natural, categorização, feedback, insights, alertas e resumo semanal.

### Sprint 12 — PWA + Beta

Entregável: PWA instalável, fila offline, idempotência, observabilidade, testes E2E, deploy, backup/restore e checklist beta.

---

## 10. ADRs obrigatórias

Escreva ou atualize ADRs em `docs/architecture/adr`.

ADRs esperadas ou sugeridas:

- `0001-web-first.md`
- `0002-stack-next-nest.md`
- `0003-postgres-prisma.md`
- `0004-monorepo.md`
- `0005-cartao-por-fatura.md`
- `0006-dinheiro-em-centavos.md`
- `0007-manual-first-sem-open-finance.md`
- `0008-auth-e-tenancy.md`
- `0009-ia-v1-propoe-humano-confirma.md`
- `0010-metas-e-dividas-no-app-completo.md`

Template:

```md
# ADR-0000 — Título

## Status

Proposta | Aceita | Substituída

## Contexto

Explique o problema e as forças envolvidas.

## Opções consideradas

- Opção A
- Opção B

## Decisão

Explique a escolha.

## Consequências

- Positivas
- Negativas
- Trade-offs
```

Não implemente solução contrária à ADR aceita sem atualizar a ADR.

---

## 11. Backend guidelines — NestJS

### Controllers

Controllers devem:

- validar sessão/autorização;
- receber parâmetros;
- validar input;
- chamar service;
- retornar resposta padronizada.

Controllers não devem:

- conter regra de negócio;
- montar query Prisma complexa;
- decidir lógica financeira;
- fazer transformação pesada.

### Services

Services devem:

- concentrar regra de negócio;
- orquestrar repositories;
- aplicar invariantes financeiras;
- usar transações do Prisma quando necessário;
- ser testáveis.

Exemplos de regra de service:

- split de recebimento;
- fechamento de fatura;
- pagamento de fatura;
- contribuição em meta;
- pagamento de dívida;
- baixa de provisão;
- geração de relatório.

### Repositories

Repositories devem:

- ser a única camada do domínio que fala diretamente com Prisma;
- sempre filtrar por `householdId`;
- retornar apenas dados necessários;
- não conter regra complexa de produto;
- não aceitar `householdId` arbitrário do client.

Exemplo conceitual:

```ts
await repository.findTransactionById({
  householdId: request.householdId,
  transactionId,
});
```

Nunca:

```ts
await repository.findTransactionById(transactionId);
```

### DTOs e validação

- Valide input no backend sempre.
- Se schema for compartilhado com frontend, use `packages/shared`.
- Rejeite input inválido com erro estruturado.
- Valide saída da IA com Zod antes de usar.

Envelope sugerido:

```ts
{
  data: T;
}
```

Erro sugerido:

```ts
{
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

### Status HTTP

- `200` leitura/atualização OK;
- `201` criação OK;
- `204` delete sem body;
- `400` request malformada;
- `401` não autenticado;
- `403` sem permissão;
- `404` recurso não encontrado ou não pertence ao household;
- `409` conflito de domínio;
- `422` validação de input;
- `500` erro inesperado sem detalhes sensíveis.

### Rotas REST esperadas

Use prefixo `/v1` desde o início.

```txt
POST   /v1/auth/register
POST   /v1/auth/login
POST   /v1/auth/refresh
POST   /v1/auth/logout
GET    /v1/me

GET    /v1/onboarding
POST   /v1/onboarding

GET    /v1/dashboard
GET    /v1/dashboard/pj-panel

GET    /v1/accounts
POST   /v1/accounts
PATCH  /v1/accounts/:id
DELETE /v1/accounts/:id
POST   /v1/accounts/transfer

GET    /v1/categories
POST   /v1/categories
PATCH  /v1/categories/:id
DELETE /v1/categories/:id

GET    /v1/transactions
POST   /v1/transactions
GET    /v1/transactions/:id
PATCH  /v1/transactions/:id
DELETE /v1/transactions/:id
POST   /v1/transactions/:id/split

GET    /v1/cards
POST   /v1/cards
PATCH  /v1/cards/:id
DELETE /v1/cards/:id
GET    /v1/cards/:id/invoices
GET    /v1/invoices/:id
POST   /v1/invoices/:id/pay

GET    /v1/goals
POST   /v1/goals
PATCH  /v1/goals/:id
DELETE /v1/goals/:id
POST   /v1/goals/:id/contributions

GET    /v1/debts
POST   /v1/debts
PATCH  /v1/debts/:id
DELETE /v1/debts/:id
POST   /v1/debts/:id/payments

GET    /v1/provisions
POST   /v1/provisions/:id/pay

GET    /v1/reports/monthly
GET    /v1/reports/pj-panel
GET    /v1/exports/full

POST   /v1/ai/parse-transaction
GET    /v1/insights
POST   /v1/insights/:id/read

PATCH  /v1/settings
DELETE /v1/account
```

### Idempotência

POSTs de escrita que podem ser repetidos devem aceitar `Idempotency-Key`, especialmente:

- criação offline de transação;
- split;
- pagamento de fatura;
- pagamento de dívida;
- contribuição em meta.

---

## 12. Frontend guidelines — Next.js

### Server Components por padrão

Use Server Components quando:

- a tela apenas carrega dados;
- não há estado local interativo;
- não usa browser API;
- não usa eventos do usuário.

Use Client Components quando:

- há formulário;
- há filtros interativos;
- há modal/dropdown controlado;
- há estado local;
- há React Query mutation;
- há acesso a IndexedDB/service worker;
- há gráfico interativo.

Marque `"use client"` no menor componente possível, nunca na página inteira sem necessidade.

### Organização de páginas

Páginas em `app/` devem ser finas. Elas podem:

- montar layout;
- buscar dados iniciais;
- chamar componentes de feature;
- definir metadata.

Páginas não devem:

- conter JSX gigante;
- conter regra de domínio;
- conter transformação complexa;
- espalhar `fetch()` sem camada.

### API client

Centralize chamadas HTTP em:

```txt
apps/web/src/lib/api/
```

ou em services por feature:

```txt
features/transactions/services/transactions-api.ts
```

Não espalhe `fetch()` bruto por vários componentes.

### React Query

Use para dados de servidor:

- transações;
- contas;
- cartões;
- categorias;
- metas;
- dívidas;
- relatórios;
- settings.

Regras:

- query keys devem ser previsíveis;
- filtros relevantes entram na query key;
- mutations invalidam queries afetadas;
- optimistic update só quando rollback for claro;
- não duplique dados do servidor em Zustand.

### Zustand

Use apenas para UI efêmera:

- modal aberto;
- contexto visual selecionado;
- sidebar colapsada;
- rascunho temporário não sensível;
- filtros locais antes de aplicar.

Não use Zustand como banco local autoritativo.

### Formulários

- React Hook Form + Zod.
- Validação client melhora UX; backend é fonte final.
- Erros aparecem perto do campo.
- Submit tem loading.
- Formulário não deve limpar se request falhar.
- Dinheiro deve entrar/sair como centavos, com formatação na borda.

### Listas e tabelas

Toda lista com dados remotos precisa de:

- loading;
- error;
- empty;
- paginação ou cursor quando crescer;
- filtros claros;
- estado de busca sem resultado.

### Acessibilidade

Obrigatório:

- labels em inputs;
- botões com texto acessível;
- focus visível;
- navegação por teclado;
- contraste AA mínimo;
- `aria-describedby` para erro de campo;
- modais com focus trap;
- PF/PJ com ícone + texto, não apenas cor.

---

## 13. Design system e UI

O design deve ser:

- profissional-leve;
- claro;
- moderno;
- calmo;
- útil;
- confiável;
- denso no desktop e simples no mobile;
- com hierarquia visual forte;
- sem poluição de dashboard.

Referências visuais:

- Linear;
- Copilot Money;
- Raycast;
- Stripe Dashboard;
- Vercel Dashboard;
- Nubank para linguagem simples;
- Notion para organização;
- Cursor para IA contextual.

Anti-referências:

- dashboard corporativo cinza;
- gráfico demais sem ação;
- gamificação infantil;
- app financeiro que parece planilha abandonada;
- interface bancária cheia de jargão.

### Tokens sugeridos

```txt
Background: #F8FAFC ou #FAFAFB
Surface: #FFFFFF
Surface subtle: #F3F4F6
Text primary: #111827
Text secondary: #6B7280
Primary: #7C6FF7
Primary dark: #5B4FE8
Border: #E5E7EB
Success: verde suave
Warning: amarelo suave
Danger: vermelho apenas para alerta real
PJ: azul/ícone + label
PF: verde/ícone + label
```

### Componentes mínimos

- `Button`
- `Input`
- `MoneyInput`
- `Textarea`
- `Select`
- `Card`
- `Badge`
- `Chip`
- `Checkbox`
- `Dialog`
- `Dropdown`
- `Tabs`
- `SegmentedControl`
- `Skeleton`
- `Toast`
- `DataTable`
- `MetricCard`
- `ContextBadge`
- `PageHeader`
- `EmptyState`
- `LoadingState`
- `ErrorState`

### Componentes de produto importantes

- `QuickEntryModal`
- `AIEntryField`
- `AIProposalCard`
- `SplitPanel`
- `PJPanel`
- `ProvisionCard`
- `InvoiceView`
- `InstallmentTag`
- `GoalProgressCard`
- `DebtPriorityCard`
- `MonthlyReport`
- `ExportPanel`

`SplitPanel` é componente crítico do produto. Deve ser simples, auditável e testado.

### Microcopy

Use frases como:

- “Quanto desse dinheiro é realmente seu?”
- “Separado para imposto”
- “Seu salário estimado”
- “Dinheiro da empresa”
- “Dinheiro pessoal”
- “Comprometido futuro”
- “Ver de onde veio esse número”
- “A IA sugeriu. Você confirma.”
- “Exportar meus dados”

Evite:

- “provisão tributária” sem explicação;
- “cashflow statement”;
- “forecast financeiro avançado”;
- tom de banco;
- excesso de emojis;
- linguagem que pareça promessa de consultoria financeira.

---

## 14. Banco de dados e Prisma

### Convenções

- Prisma é a fonte oficial do schema físico.
- Migrations ficam versionadas em `prisma/migrations`.
- Nomes de tabelas/colunas no banco podem usar padrão Prisma, mas mantenha consistência.
- Dinheiro deve ser armazenado em centavos com `BigInt`/`bigint`.
- Toda entidade financeira deve ter `householdId`.
- Toda entidade principal deve ter `createdAt`, `updatedAt` e, quando fizer sentido, `deletedAt`.
- Use constraints e índices para invariantes importantes.

### Regras obrigatórias

- Toda query de domínio filtra por `householdId`.
- Não aceitar `householdId` do client como fonte de autorização.
- Não criar tabela financeira sem FK para household.
- Não editar migration antiga aplicada.
- Não usar JSON como desculpa para evitar modelagem.
- Não remover dados em cascata sem entender impacto.
- Não criar PrismaClient novo em cada repository. Reutilize `PrismaService`.
- SQL raw só com justificativa, tipagem e cuidado com injection.

### Dinheiro

- Valores monetários sempre em centavos.
- API pode serializar centavos como string para evitar perda de precisão.
- Formatação só na borda com `Intl.NumberFormat`.
- Nunca usar float para cálculo financeiro.
- Split proporcional deve distribuir resto de centavos de forma determinística.

### Invariantes importantes

- Transação pertence a uma conta ou fatura, não às duas sem regra explícita.
- Fatura fechada não é editável diretamente.
- Saldo é derivado de transações.
- Split deve fechar exatamente no total original.
- Transferência deve ter pernas vinculadas.
- Pagamento de fatura deve conectar caixa e competência.
- Pagamento de dívida deve reduzir saldo da dívida e gerar histórico.
- Contribuição em meta deve ser auditável.

### Soft delete

Preferir `deletedAt` para:

- transações;
- contas;
- categorias customizadas;
- cartões;
- metas;
- dívidas;
- provisões;
- settings históricos importantes.

Hard delete apenas em fluxo explícito de exclusão de conta/purge LGPD.

### Seeds

Seeds devem criar dados fictícios e realistas, por exemplo:

- usuário “Rafael”;
- conta PJ;
- conta PF;
- cartão misto;
- receita PJ de cliente;
- split aplicado;
- meta de reserva;
- dívida parcelada;
- relatório mensal com dados auditáveis.

Não colocar dados reais da usuária.

---

## 15. Autenticação e autorização

Arquitetura esperada:

- Auth/session no Next.js quando aplicável;
- JWT/sessão validada pelo NestJS;
- cookies httpOnly/Secure/SameSite para tokens sensíveis;
- `userId` e `householdId` extraídos no servidor;
- `AuthGuard` → `TenancyGuard` → `PlanGuard`, quando houver planos.

### Regras

- Toda rota privada exige autenticação.
- Toda mutação verifica propriedade do recurso.
- Nunca confiar em ids enviados pelo client para autorização.
- Ao buscar recurso por `id`, também filtrar por `householdId`.
- IDOR deve ser testado nos endpoints autenticados.

Exemplo conceitual:

```ts
findDebtById({ id, householdId });
```

Nunca:

```ts
findDebtById(id);
```

---

## 16. Segurança e privacidade

O Tally armazena dados financeiros sensíveis.

Nunca logar:

- senha;
- hash de senha;
- JWT;
- cookies;
- refresh token;
- e-mail completo;
- valores financeiros;
- descrições completas de transações;
- dados fiscais;
- dados de cartão;
- conteúdo integral enviado à IA;
- secrets.

### LocalStorage

Não use localStorage para:

- token;
- sessão;
- dados financeiros;
- transações;
- saldos;
- metas;
- dívidas;
- dados fiscais.

Pode ser usado apenas para UI efêmera não sensível, se necessário.

### Env

- `.env` nunca deve ser commitado.
- `.env.example` contém nomes de variáveis sem valores reais.
- Validar envs na inicialização quando possível.

### Erros

- Em produção, responses não vazam stack trace.
- Mensagens para usuário são claras, mas sem detalhes internos.
- Logs estruturados devem usar `requestId`.

### LGPD

- Exportação completa precisa existir.
- Exclusão de conta deve ter fluxo claro.
- Purge real deve ser documentado.
- Dados devem ser minimizados.
- Evite coletar CPF/CNPJ completo no MVP/app inicial se não for necessário.

---

## 17. IA — regras do Tally

IA faz parte do app, mas com limites rígidos.

### Permitido na IA v1

- parsing de transação por linguagem natural;
- sugestão de categoria;
- resumo semanal baseado em números calculados por SQL;
- insight textual com evidências;
- alertas determinísticos explicados em linguagem simples.

### Proibido sem ADR

- chat aberto ilimitado;
- agentes autônomos;
- RAG;
- embeddings;
- pgvector;
- execução de ações sem confirmação;
- cálculo fiscal por LLM;
- recomendação de investimento/crédito;
- envio de extrato completo para prompt;
- tool calling que altera dados sem confirmação explícita.

### Regras obrigatórias

- LLM nunca persiste dados diretamente.
- Toda saída vira proposta.
- Proposta passa por schema Zod.
- Usuário confirma ou edita.
- Timeout tem fallback para formulário.
- Prompt deve separar instruções do conteúdo do usuário.
- Prompts versionados em `apps/api/src/modules/ai/prompts` ou equivalente.
- Testes usam modelo mockado.
- Conteúdo de prompt deve ser minimizado.
- Alíquotas e regras fiscais vêm do banco/configuração, nunca do modelo.

---

## 18. Testes

Priorize testes onde há risco real:

- isolamento por household;
- cálculos financeiros;
- split de recebimento;
- fatura por competência;
- pagamento de fatura;
- pagamento de dívida;
- contribuição em meta;
- relatório mensal;
- exportação;
- auth/autorização;
- IA parse fallback;
- PWA offline/idempotência.

### Unit tests

Use para:

- money utils;
- split;
- fiscal rules;
- cálculo de comprometido futuro;
- cálculo de progresso de metas;
- cálculo de saldo de dívida;
- mappers;
- validators.

### Integration tests

Use para:

- service + repository;
- Prisma com banco de teste;
- autorização por household;
- criação/listagem de transações;
- fechamento de fatura;
- exportação;
- relatórios.

### Component tests

Use para:

- `MoneyInput`;
- `QuickEntryModal`;
- `SplitPanel`;
- `AIProposalCard`;
- `InvoiceView`;
- `GoalProgressCard`;
- `DebtPriorityCard`;
- empty/loading/error states.

### E2E

Fluxos críticos:

1. cadastro/login;
2. onboarding fiscal;
3. abrir dashboard;
4. criar conta PF/PJ;
5. criar categoria;
6. registrar transação em menos de 10s;
7. registrar recebimento PJ;
8. aplicar split;
9. ver dashboard atualizado;
10. criar cartão e compra parcelada;
11. fechar/pagar fatura;
12. criar meta e contribuição;
13. criar dívida e pagamento;
14. abrir relatório mensal;
15. exportar dados.

### Regra de regressão

Bug corrigido deve virar teste quando possível.

---

## 19. Comandos esperados

Antes de assumir comando, verifique `package.json`.

Comandos desejados:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

Banco:

```bash
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

Se um comando não existir e a issue pedir setup, crie o script no `package.json` adequado.

Antes de finalizar uma alteração, rode o máximo possível:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Se não rodar, explique o motivo.

---

## 20. Workflow do agente

Ao receber uma tarefa:

1. Identifique a sprint e o domínio.
2. Leia a issue/pedido completo.
3. Leia arquivos relevantes.
4. Verifique ADRs relacionadas.
5. Faça um plano curto antes de mudanças grandes.
6. Implemente a menor alteração completa.
7. Não altere arquivos fora de escopo sem necessidade.
8. Atualize testes e documentação se o contrato mudou.
9. Rode validações.
10. Finalize com resumo objetivo.

### Final response esperada após implementação

```md
## O que foi feito

- ...

## Arquivos alterados

- `path/file.ts` — motivo

## Validações

- `pnpm lint` ✅
- `pnpm typecheck` ✅
- `pnpm test` não rodei porque ...

## Observações

- Risk: ...
- Decision Needed: ...
- Future: ...
```

---

## 21. Git, branches e commits

### Branches

Formato sugerido:

```txt
sprint-0/setup-monorepo
sprint-1/auth-app-shell
sprint-2/dashboard
sprint-3/transactions-core
sprint-6/cards-invoices
sprint-8/debts
```

### Commits

Use Conventional Commits simples:

```txt
feat: configure pnpm workspace
feat(api): add transactions module
feat(web): add quick entry modal
feat(db): model invoices
fix(api): enforce household filter on debts
test(api): cover split cents distribution
docs: add ADR for card invoices
chore: add lint workflow
```

### Não misturar no mesmo commit

- feature + refactor grande;
- schema + redesign;
- auth + dashboard complexo;
- lint massivo + alteração funcional;
- dependência nova + várias features;
- IA + mudança de schema financeira sem teste.

---

## 22. Issues e labels

Use issues pequenas e rastreáveis.

Labels esperadas:

- `sprint-0` até `sprint-12`;
- `domain:auth`;
- `domain:onboarding`;
- `domain:dashboard`;
- `domain:transacoes`;
- `domain:contas`;
- `domain:categorias`;
- `domain:cartoes`;
- `domain:metas`;
- `domain:dividas`;
- `domain:relatorios`;
- `domain:settings`;
- `domain:ia`;
- `domain:pwa`;
- `stack:api`;
- `stack:web`;
- `stack:db`;
- `stack:infra`;
- `stack:ui`;
- `stack:shared`;
- `type:feature`;
- `type:bug`;
- `type:docs`;
- `type:adr`;
- `type:refactor`;
- `type:test`;
- `priority:critical`;
- `priority:high`;
- `priority:normal`;
- `priority:low`.

Template:

```md
## Contexto

Por que essa issue existe e qual problema resolve.

## Escopo

- [ ] Item concreto
- [ ] Item concreto

## Fora do escopo

- O que não entra agora

## Critérios de aceite

- Dado que...
- Quando...
- Então...

## Notas técnicas

- Endpoint:
- Componentes:
- Schema:
- Testes:
```

---

## 23. Qualidade de código

### TypeScript

- `strict` ligado.
- Não usar `any` sem justificativa.
- Preferir tipos explícitos nas bordas.
- Usar inferência dentro de funções quando claro.
- Não usar `as unknown as` para forçar tipo.

### Funções

- Funções pequenas.
- Nome que explica intenção.
- Evitar boolean trap com muitos booleans.
- Preferir objeto de parâmetros quando função cresce.
- Separar cálculo puro de efeito colateral.

### Componentes

- Componentes pequenos e coesos.
- Props tipadas.
- Evitar componente com 300 linhas.
- Separar container/data fetching de apresentação quando melhorar clareza.
- Componentes de domínio ficam na feature.
- Componentes genéricos ficam no design system.

### Erros

- Tratar erros previsíveis.
- Não engolir erro silenciosamente.
- Usar mensagens úteis.
- Log estruturado no backend sem dados sensíveis.

---

## 24. Performance

Não otimizar cedo, mas evitar decisões ruins.

- Não buscar lista gigante sem paginação.
- Não recalcular transformação pesada no render sem necessidade.
- Não colocar tudo como Client Component.
- Não carregar biblioteca pesada sem justificar.
- Não renderizar gráficos complexos sem fallback.
- Não fazer N+1 queries no backend.
- Não gerar relatório mensal com múltiplas queries desnecessárias sem medir.
- Não chamar LLM em render ou carregamento inicial.

Use paginação/filtros para:

- transações;
- faturas;
- metas;
- dívidas;
- relatórios detalhados;
- insights.

---

## 25. Observabilidade mínima

Mesmo em side project, registre:

- erro de API com request id;
- falhas de autenticação sem dados sensíveis;
- falhas de validação agregadas quando útil;
- tempo de endpoints críticos;
- custo/latência de IA quando IA existir;
- divergência de reconciliação;
- falha de job;
- falha de exportação;
- falha de fila offline.

Ferramentas esperadas:

- logs estruturados;
- Sentry front/API;
- healthcheck;
- métricas simples;
- alertas básicos no deploy.

Não implementar observabilidade avançada antes da fundação, salvo issue específica.

---

## 26. Definição de pronto

Uma issue só está pronta quando:

- compila;
- lint passa ou falha está documentada;
- typecheck passa ou falha está documentada;
- teste relevante foi criado/atualizado quando aplicável;
- fluxo principal foi validado manualmente ou por teste;
- UI tem loading/error/empty quando busca dados;
- dados são filtrados por usuário/household autenticado;
- dinheiro é tratado em centavos;
- números exibidos são auditáveis;
- documentação/ADR foi atualizada quando contrato mudou;
- não há alteração fora de escopo;
- não há `console.log`, `any` injustificado ou TODO vago;
- riscos e pendências foram sinalizados.

---

## 27. Prioridade atual

No começo do projeto, priorize a Sprint 0 e a Sprint 1.

Ordem recomendada:

1. monorepo;
2. Docker Compose;
3. Next.js base;
4. NestJS base;
5. Prisma/Postgres base;
6. Redis base;
7. packages compartilhados;
8. CI;
9. design system mínimo;
10. auth;
11. tenancy;
12. onboarding;
13. AppShell/Sidebar;
14. ADRs.

Não pule para IA, Open Finance, gráficos sofisticados ou telas avançadas antes de a fundação estar estável.

---

## 28. Modo mentoria sênior

Este projeto também serve para evolução técnica da usuária. O agente deve atuar como mentor sênior.

Comportamentos esperados:

- explicar trade-offs;
- apontar riscos;
- sugerir alternativas;
- separar `Risk`, `Decision Needed` e `Future`;
- não decidir arquitetura silenciosamente;
- ensinar o padrão usado;
- sugerir testes relevantes;
- ajudar a transformar decisão técnica em explicação de PR/entrevista;
- manter foco em entrega incremental;
- lembrar que clareza e confiança importam mais que complexidade.

Sinalização:

- `Risk` — pode quebrar produção, segurança, performance, dinheiro ou confiança.
- `Decision Needed` — escolha arquitetural/produto precisa de validação.
- `Future` — melhoria válida, mas fora do escopo atual.

---

## 29. Lembrete final

O Tally deve ajudar uma pessoa que vive de CNPJ a saber quanto do dinheiro é da empresa, quanto é imposto, quanto é reserva e quanto é dela de verdade.

Sempre que houver dúvida entre uma solução chamativa e uma solução confiável, escolha a confiável.

Sempre que houver dúvida entre um gráfico bonito e um número auditável, escolha o número auditável.

Sempre que houver dúvida entre IA mágica e fluxo confirmável, escolha o fluxo confirmável.

Sempre que houver dúvida entre abstração sofisticada e implementação simples que funciona, escolha a simples.

O objetivo não é parecer complexo. O objetivo é ser útil, seguro e difícil de quebrar.
