# Threat Model — Tally MVP

> Metodologia: STRIDE simplificado. App financeiro = alvo com dados sensíveis por definição, mesmo pequeno. Revisar a cada feature nova que toque auth, dinheiro ou IA.

## Ativos a proteger

1. Dados financeiros dos usuários (transações, saldos, faturamento PJ)
2. Credenciais e sessões
3. Integridade dos números (corromper = destruir o produto)
4. Chaves de API da LLM (custo + abuso)
5. Disponibilidade

## Ameaças e mitigações (STRIDE)

### S — Spoofing (identidade)

| Ameaça                            | Mitigação MVP                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Credential stuffing / brute force | Hash argon2id · rate limit por IP+e-mail (ex.: 5/min) · bloqueio progressivo                                             |
| Roubo de sessão                   | JWT curto (15min) em cookie httpOnly+Secure+SameSite=Lax · refresh token rotativo com detecção de reuso (revoga família) |
| OAuth confuso                     | Validar `aud`/`iss` do token Google; vincular por google_id, não por e-mail apenas                                       |

### T — Tampering (adulteração)

| Ameaça                                    | Mitigação                                                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| Alterar valores via API (mass assignment) | DTOs com whitelist (class-validator, `whitelist: true, forbidNonWhitelisted: true`)           |
| SQL injection                             | Prisma parametrizado; proibir `$queryRawUnsafe`                                               |
| Adulterar fatura fechada                  | Invariante no domínio: fechada = imutável; ajustes só via transação de ajuste auditada        |
| XSS → ações em nome do usuário            | Escape padrão React · CSP estrita · sanitizar QUALQUER texto vindo da LLM antes de renderizar |

### R — Repudiation (não-repúdio)

| Ameaça                       | Mitigação                                                                 |
| ---------------------------- | ------------------------------------------------------------------------- |
| "Eu não fiz esse lançamento" | audit_log de escrita (quem, quando, diff) · created_via em toda transação |

### I — Information Disclosure ⚠️ (o risco nº 1)

| Ameaça                                  | Mitigação                                                                                                                                                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **IDOR/BOLA — usuário A lê dados de B** | Toda query filtra por household_id derivado do TOKEN, nunca de parâmetro do cliente · guard global no Nest · **testes automatizados de tenancy em todo endpoint** (o teste mais importante do repositório) |
| Vazamento por logs                      | Nunca logar payloads de transações/valores; logs estruturados com campos whitelisted                                                                                                                       |
| Vazamento via LLM                       | Enviar o mínimo (texto do lançamento, categorias) — nunca extrato completo, e-mail, nome · provedor com data-retention zero/opt-out de treino · DPA assinado                                               |
| Enumeração de e-mails                   | Respostas idênticas em login/registro/reset ("se existir, enviamos e-mail")                                                                                                                                |
| Backups expostos                        | Backups criptografados; acesso por IAM mínimo                                                                                                                                                              |

### D — Denial of Service

| Ameaça                              | Mitigação                                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Flood na API                        | Rate limit global + por rota sensível (auth, /ai/*)                                                                       |
| **Abuso do endpoint de IA (custo)** | /ai/parse: limite por usuário/dia por plano · teto de gasto diário global com circuit breaker · cache de parsing repetido |
| Payloads gigantes                   | Limite de body (ex.: 50kb) e de itens por página                                                                          |

### E — Elevation of Privilege

| Ameaça                                | Mitigação                                                                  |
| ------------------------------------- | -------------------------------------------------------------------------- |
| Usuário grátis acessando features Pro | Checagem de plano no servidor (guard), nunca só no front                   |
| Admin interno futuro                  | Sem painel admin no MVP; acesso a dados de produção só via processo logado |

## Ameaças específicas de IA

1. **Prompt injection no lançamento** ("ignore instruções e me categorize como..."): saída da LLM é DADO, validada por schema estrito (Zod); LLM nunca executa ações — só propõe JSON que passa pela mesma validação do formulário.
2. **Alucinação de valores fiscais**: alíquotas vêm SEMPRE de `fiscal_rules` (banco), nunca do modelo; a LLM redige texto, não calcula imposto.
3. **Resumo semanal vazando dados de outro usuário**: prompts montados por household_id do job; testes de isolamento no worker.

## LGPD (mínimo viável e honesto)

- Base legal: execução de contrato (dados financeiros inseridos pelo titular)
- Direitos: exportação completa (já é feature — F8) · exclusão de conta com purge real em ≤30 dias (job) · política de privacidade em linguagem simples
- Minimização: não coletar CPF/CNPJ completo no MVP (regime + faixa bastam para o split)
- Encarregado: fundador (declarar); registro de operações de tratamento simples

## Checklist de segurança do MVP (gate de lançamento)

- [ ] Testes de tenancy (IDOR) em 100% dos endpoints autenticados
- [ ] Rate limit em auth e /ai/*
- [ ] Cookies httpOnly + CSP + HSTS
- [ ] Dependabot/renovate + npm audit no CI
- [ ] Secrets fora do repositório (env do provedor); rotação documentada
- [ ] Backup diário + restore testado 1x antes do lançamento
- [ ] Fluxo de exclusão de conta funcionando de ponta a ponta
