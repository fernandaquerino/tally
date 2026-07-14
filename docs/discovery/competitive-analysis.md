# Análise Competitiva — Tally

> Pesquisa de julho/2026. Versão condensada; análise completa por app (reviews, dores, preços) no documento de benchmark original.

## Mapa do mercado

| App | Origem | Preço (plano útil) | Open Finance | IA | PJ | Família | Cartão por fatura | Força | Fraqueza |
|---|---|---|---|---|---|---|---|---|---|
| Mobills | 🇧🇷 | ~R$ 120/ano | ✅ instável | Básica | ❌ | ❌ | Parcial | Completude + marca | Sync não confiável |
| Organizze | 🇧🇷 | ~R$ 135/ano | ✅ cobertura menor | Básica | Rótulo de conta | Login compartilhado | Parcial | Simplicidade | Teto baixo |
| Minhas Economias | 🇧🇷 | Freemium | ✅ | ❌ | Separação de contas | ❌ | Parcial | Confiabilidade | Datado |
| Wallet (BudgetBakers) | 🇨🇿 | ~US$ 20/ano | Agregadores | Categorização | ❌ | Compartilhado | ❌ | Orçamentos flexíveis | Sync + perda de dados |
| Pierre (CloudWalk) | 🇧🇷 | R$ 39/mês | ✅ 100+ bancos | ⭐ Multiagente | ❌ | ❌ | Via OF | IA proativa conversacional | Caro, sem PJ, sem manual |
| Despezzas | 🇧🇷 | Freemium | ✅ instável p/ alguns | Chat conectado | ❌ | ❌ | Sim | Custo-benefício | OF instável no paywall |
| Copilot Money | 🇺🇸 | US$ 95/ano | Plaid EUA | ⭐ Categorização | ❌ | Fraco | N/A | Design + review por swipe | Apple-only, sem BR |
| YNAB | 🇺🇸 | US$ 109/ano | Plaid EUA/UE | ❌ deliberado | ❌ | ✅ 6 pessoas | N/A | Metodologia + comunidade | Rígido, não traduz p/ BR |
| Monarch Money | 🇺🇸 | US$ 100–199/ano | 13k instituições | Assistente | Tier Plus (novo) | ⭐ Melhor | N/A | Dashboard p/ casais | Preço, trial 7 dias |
| LAPI | 🇧🇷 | Freemium | ❌ por design | Coach + OCR | ❌ | ✅ + contador | ⭐ Referência | Privacidade + multiplataforma | Fricção do manual |
| ZMoney | 🇧🇷 | Grátis | ❌ | ❌ | ❌ | ❌ | ❌ | Preço + conteúdo | Sem diferencial |
| Servora | ❓ | — | — | — | — | — | — | **Não identificado — aguardando link** | — |

## As 5 dores transversais do mercado
1. **Sync bancário que quebra** — dor nº 1 de Mobills, Wallet e Despezzas; Open Finance é expectativa mas ninguém entrega confiável.
2. **Perda/divergência de dados** — casos graves em Mobills (web ≠ app) e Wallet (transações corrompidas sem backup).
3. **Cartão de crédito mal modelado** — competência vs. caixa; só o LAPI trata como prioridade. Gera o eterno "saldo não bate".
4. **Paywall sobre features instáveis** — cobrar por Open Finance bugado gera as piores reviews (Despezzas, Mobills).
5. **Família/casal como gambiarra** — login compartilhado ou cobrança extra; Monarch prova o valor lá fora, no Brasil está vago.

## Espaços vazios identificados
- **Híbrido PF+PJ**: nenhum dos 12 atende. Organizze/Minhas Economias têm só "separação de contas". Pierre (o líder de IA) ignora PJ. Cora/MEI Fácil são PJ-only e fiscais.
- **IA com contexto fiscal**: "ter IA" já é commodity (Pierre, Despezzas, Minhas Finanças, LAPI); IA que entende DAS, pró-labore e teto MEI não existe.
- **Confiabilidade como marca**: o mercado inteiro falha em integridade de dados.

## Concorrentes a monitorar (trimestral)
- **Pierre/CloudWalk**: se lançarem contexto PJ, atacam nosso core. InfinitePay é canal de distribuição deles.
- **Cora / MEI Fácil**: se descerem para vida pessoal, atacam pelo outro lado.
- **Monarch**: tier Plus com small business sinaliza que o híbrido é tendência global.

## Lições aplicadas ao Tally
| Lição | Fonte | Aplicação |
|---|---|---|
| Registro em segundos retém | Organizze | Requisito de UX nº 1 |
| Cartão por fatura é o acerto raro | LAPI | Modelo de dados desde o dia 1 (ADR-0005) |
| IA proativa > chat reativo | Pierre | Resumo semanal + alertas antes de chat aberto |
| Pago = o que funciona melhor | Despezzas (anti-exemplo) | OF só quando estável |
| Trial curto gera reclamação | Monarch | Trial de 30 dias |
| Aumentos de preço corroem a base | YNAB | Grandfathering de early users |
| Delegação p/ contador é ouro | LAPI | Roadmap v1.5 |
| Conteúdo = aquisição barata | Mobills, ZMoney | Blog/SEO "finanças para PJ" |
