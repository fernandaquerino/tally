# Escopo do MVP — Tally (web-first)

## Princípio de corte
MVP = a menor fatia que entrega o momento AHA do Rafael: **"pela primeira vez eu sei quanto do meu faturamento é meu"**. Tudo que não serve a esse momento sai.

## Decisão de plataforma
**Web app responsivo (Next.js) — sem app mobile no MVP.** Racional e trade-offs no ADR-0001. Implicações no escopo:
- Experiência mobile via **responsivo caprichado + PWA** (instalável, ícone na home) — o registro diário acontece no celular
- Atalhos de teclado e densidade de informação no desktop (vantagem do web: relatórios, mês fechado, visão contador)

## ✅ Dentro do MVP

### 1. Fundação de registro
- [ ] Lançamento de receita/despesa em <10s (defaults inteligentes, última categoria usada, atalho de teclado no desktop)
- [ ] Lançamento por linguagem natural via IA ("almoço com cliente 45 reais, empresa")
- [ ] Toggle PF/PJ em 1 clique em qualquer transação
- [ ] Recorrências e parcelamentos (12x é o modelo mental brasileiro)
- [ ] Categorias padrão + customizadas, por contexto PF/PJ

### 2. Cartão de crédito modelado certo (ADR-0005)
- [ ] Fatura como agrupador; competência vs. caixa; fechamento e vencimento
- [ ] Parcelas futuras projetadas nas faturas certas
- [ ] Cartão misto (gastos PF e PJ) com separação nos relatórios

### 3. Coração PJ (o diferencial)
- [ ] Cadastro de regime (MEI / Simples com faixa) → alíquotas básicas como configuração versionada
- [ ] **Divisor de recebimento**: a cada receita PJ, split sugerido imposto/reserva/pró-labore (percentuais configuráveis)
- [ ] Provisão de DAS/imposto com lembrete de vencimento
- [ ] Pró-labore como ponte PJ→PF
- [ ] Painel PJ: faturamento do mês, provisionado, disponível, alerta de teto MEI

### 4. IA v1 (enxuta e proativa)
- [ ] Parsing de linguagem natural para lançamento
- [ ] Categorização automática com aprendizado das correções
- [ ] Resumo semanal proativo (3 frases, e-mail + in-app)
- [ ] Alertas: vencimento de provisão, gasto fora do padrão, ritmo de gastos vs. mês
- ❌ Fora da IA v1: chat aberto ilimitado, agentes customizáveis

### 5. Visão mensal unificada
- [ ] Home com 3 números: resultado PJ · disponível pessoal · comprometido futuro
- [ ] Relatório mensal por categoria com filtro PF/PJ/tudo
- [ ] Exportação CSV (confiança + contador)

### 6. Fundação de confiabilidade (invisível, inegociável)
- [ ] API como fonte única de verdade (sem estado divergente cliente/servidor — anti-lição Mobills)
- [ ] Backup automático + exportação completa pelo usuário
- [ ] Auth segura (ver threat-model.md)

## ❌ Fora do MVP
| Feature | Racional | Destino |
|---|---|---|
| App mobile nativo | Web-first (ADR-0001); PWA cobre o registro no celular | v2 |
| Open Finance | Instável no mercado, caro, paywall sobre feature instável = piores reviews | v2+ (ADR-0007) |
| Conta família | Complexidade de permissões; Rafael não precisa pro AHA | v2 — motivo de upgrade |
| Módulo de dívidas | Persona terciária; MVP mostra dívidas como comprometido | v2–3 |
| Plano financeiro longo | MVP entrega o plano do mês; plano de vida vem após o hábito | v2 |
| Chat IA aberto / agentes | Custo alto; território Pierre — entrar depois com vantagem de contexto | v1.5 (limitado no Pro) |
| NF / DAS in-app | Território Cora/MEI Fácil; regulatório | Parceria, talvez nunca |
| Investimentos | Saldo manual basta | v3 / parceria |
| OCR de recibos | Linguagem natural resolve 80% | v1.5 |

## Monetização — [HIPÓTESE H2]
- **Grátis:** registro ilimitado, 1 contexto PJ, 1 cartão, relatório mensal, IA de registro
- **Tally Pro (R$ 14,90–19,90/mês):** divisor automático, alertas proativos, resumo semanal IA, múltiplos cartões/contas, exportações
- Trial de 30 dias · grandfathering para early users

## Critérios de sucesso (90 dias)
- Ativação: ≥50% registram 5+ transações na 1ª semana
- AHA: ≥40% usam o divisor no primeiro recebimento PJ
- Retenção S4: ≥25%
- Conversão grátis→pago: ≥5%
- Qualitativo: usuários descrevem o Tally como "app pra quem é PJ"
