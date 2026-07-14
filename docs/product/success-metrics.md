# Métricas de Sucesso — Tally

## North Star
**Usuários que fecham o mês sabendo seu "disponível real"** = no mês, usou o divisor em ≥1 recebimento **e** visualizou o resumo mensal.
Por quê: captura o valor central (clareza PF/PJ), correlaciona com retenção e antecede conversão.

## Árvore de métricas

### Aquisição
- Visitantes → cadastro (meta inicial: ≥3% da landing)
- Custo por cadastro por canal (conteúdo/SEO vs. comunidades vs. pago)
- % de cadastros que se identificam como MEI/PJ no onboarding (pureza do beachhead — meta ≥70%)

### Ativação (primeiros 7 dias)
- **A1:** registrou 5+ transações — meta ≥50%
- **A2:** configurou contexto PJ (regime) — meta ≥60% dos que se declararam PJ
- **A3 (AHA):** usou o divisor no 1º recebimento PJ — meta ≥40%
- Tempo até o primeiro lançamento (meta: <5 min do cadastro)

### Retenção
- Semana 4 ativos: ≥25% (mediana da categoria ~30% em 100 dias — meta bater)
- Meses consecutivos com "mês fechado" (North Star recorrente)
- % de transações via IA vs. formulário (proxy de fricção; saúde: IA crescendo)

### Receita
- Conversão grátis→Pro no 1º ciclo: ≥5%
- Churn mensal Pro: <5%
- MRR (acompanhar, sem meta no MVP)

### Qualidade / confiança
- Reclamações de integridade de dados: **zero tolerância** (cada caso = incidente)
- Precisão da categorização IA (aceite sem correção): ≥80% após 1 mês de uso
- NPS trimestral (referência: >40 bom para a categoria)
- Custo de IA por usuário ativo/mês: teto definido antes do beta (guardrail T3)

## Guardrails (métricas que NÃO podem piorar)
- Latência p95 do lançamento manual < 300ms (a promessa dos 10s morre se a API for lenta)
- Uptime API ≥ 99,5%
- Tempo de exportação de dados completa < 1 min (confiança)

## Instrumentação (MVP)
- Eventos mínimos: signup, onboarding_step, transaction_created (props: via_ai, context, type), split_applied, invoice_viewed, weekly_summary_opened, export_csv, upgrade
- Ferramenta: PostHog (self-host ou cloud free tier) — decisão em ADR futuro
- Dashboards: ativação (semanal), retenção coorte (mensal), funil de conversão

## Ritual
- Revisão semanal: ativação + guardrails
- Revisão mensal: coortes de retenção + North Star + custo de IA
