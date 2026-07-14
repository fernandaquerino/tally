# ADR-0005: Cartão de crédito modelado por fatura (competência vs. caixa)

**Status:** Aceito · **Data:** 2026-07-13

## Contexto

O benchmark mostrou que "saldo não bate" por cartão mal modelado é dor crônica da categoria (reviews de Mobills, Organizze; o LAPI faz disso diferencial). No Brasil, parcelamento em N× é o modelo mental dominante. Refatorar essa modelagem depois é caríssimo — a decisão precisa nascer certa.

## Opções

### A: Cartão como conta com saldo negativo (o erro comum da categoria)

**Prós:** simples de implementar. **Contras:** mistura competência e caixa; parcelas futuras viram gambiarra; o saldo "mente" — exatamente a dor nº 3 do mercado. Descartada.

### B: Fatura como entidade agrupadora (escolhida)

Gasto no cartão → entra na fatura do ciclo (competência). Pagamento da fatura → transação de conta (caixa). Parcelas = N transações em N faturas futuras (`installment_group_id`). Fatura fechada é imutável.
**Prós:** números que batem; projeção de comprometimento futuro correta; cartão misto PF/PJ possível (contexto na transação).
**Contras:** mais entidades e regras (fechamento, estados, pagamento parcial); jobs de fechamento.

## Decisão

Opção B, com as invariantes 2, 5 e 6 do domain-model como testes obrigatórios e job diário de fechamento de ciclo.

## Consequências

- Fica mais fácil: confiança do usuário; "comprometido futuro" na home; relatório PF/PJ correto em cartão misto.
- Fica mais difícil: implementação inicial (~a feature mais complexa do MVP depois do split).
- Revisitar quando: nunca — é fundação.
