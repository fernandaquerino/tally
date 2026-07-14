# ADR-0007: Manual-first — sem Open Finance no MVP

**Status:** Aceito · **Data:** 2026-07-13

## Contexto

Open Finance é expectativa de mercado (40M+ consentimentos no Brasil), mas o benchmark mostra: (1) é a maior fonte de reviews negativas dos concorrentes (sync instável, duplicados); (2) cobrar por feature instável gera as piores avaliações; (3) agregadores custam por conexão — pesado pré-receita; (4) sustentar conexões exige time que não existe (solo dev). Em tensão: a fricção do registro manual é a maior causa de abandono da categoria (hipótese H3 endereça isso).

## Opções

### A: Open Finance no MVP

**Prós:** menor fricção; paridade de expectativa. **Contras:** custo fixo pré-receita; complexidade regulatória/técnica; herdar a dor nº 1 do mercado sem braço para sustentá-la; atrasa o lançamento em meses.

### B: Manual-first com IA + import (escolhida)

Registro <10s + linguagem natural (IA) no MVP; import CSV/OFX na v1.5; Open Finance na v2+ quando houver receita e evidência.
**Prós:** lança rápido; testa H3 e H4 de verdade; schema já prevê a chegada do OF sem retrofit (staging `imported_transactions`).
**Contras:** risco real de churn por fricção (H3); comparação desfavorável com Pierre no quesito automação.

## Decisão

Opção B. O beta mede H3 explicitamente: se o churn citar fricção de digitação como motivo nº 1, antecipar OF vira prioridade máxima (gatilho documentado em assumptions.md).

## Consequências

- Fica mais fácil: lançar, controlar custo, qualidade percebida.
- Fica mais difícil: aquisição de quem já espera conexão automática (mensagem da landing deve ancorar no split, não no tracking).
- Revisitar quando: H3 invalidada OU receita ≥ custo projetado do agregador × 3.
