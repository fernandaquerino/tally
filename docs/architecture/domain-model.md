# Modelo de Domínio — Tally

> Linguagem ubíqua + regras de negócio. O modelo de dados (tabelas) está em `data-model.md`.

## Conceitos centrais

### Context (Contexto) — o coração do Tally

Todo dinheiro pertence a um contexto: **PF** (pessoal) ou **PJ** (empresa). Um usuário tem 1 contexto PF e 0..1 contexto PJ no MVP (multi-CNPJ fica pra depois).

- O contexto PJ carrega o **FiscalProfile**: regime (MEI | SIMPLES), faixa, alíquota efetiva, teto anual.
- Regra: alíquotas/tetos são **configuração versionada** (tabela `fiscal_rules` com vigência), nunca hardcode — a reforma tributária vai mexer nisso.

### Account (Conta)

Onde dinheiro fica: conta corrente, carteira, **reserva**. Pertence a um contexto. Tem saldo derivado (nunca armazenado como verdade — sempre recalculável das transações; snapshot materializado apenas como cache invalidável).

### Card (Cartão) e Invoice (Fatura) — ADR-0005

- Cartão NÃO é conta. Gasto no cartão não mexe em saldo de conta.
- Cartão tem `closing_day` e `due_day`. Fatura = agrupador de transações por ciclo (competência).
- Um cartão pode receber gastos PF **e** PJ (cartão misto) — o contexto vive na transação, não no cartão.
- **Pagamento da fatura** = transação de conta (caixa) vinculada à fatura.
- Parcelamento: compra de N parcelas gera N transações, uma por fatura futura, ligadas por `installment_group_id`.
- Estados da fatura: `open → closed → paid` (parcial permitido: `partially_paid`).

### Transaction (Transação)

Evento financeiro atômico. Sempre tem: valor (centavos, ADR-0006), contexto, categoria, data de competência, e **ou** uma conta **ou** uma fatura (nunca ambos).
Tipos: `income` | `expense` | `transfer` (par de pernas ligadas por `transfer_id`).

### Split (Divisor de recebimento) — o diferencial

Aplicado a uma receita PJ. Gera, em transação atômica:

1. **Provision** de imposto (compromisso futuro, não é despesa ainda)
2. Transfer para conta-reserva
3. **Pró-labore**: transfer especial **PJ → PF** (a única ponte entre contextos)
   Regras: percentuais vêm do FiscalProfile + preferências; usuário pode ajustar por recebimento; tudo referencia o `split_id` (auditabilidade).

### Provision (Provisão)

Dinheiro comprometido com destino certo (DAS, IR). Estados: `pending → paid` (vira despesa PJ realizada) ou `cancelled`. Alimenta o número "comprometido futuro" da home e os lembretes.

### Category (Categoria)

Por contexto (categorias PJ ≠ PF), com defaults de sistema + customizadas. Soft-delete apenas (transações históricas apontam pra ela).

### Insight / Alert (IA)

Saída da IA v1: `weekly_summary`, `provision_reminder`, `anomaly`, `mei_ceiling`. Sempre com payload das evidências (transações que o geraram) — princípio "números que batem".

### Household (v2 — modelar cedo, implementar depois)

Agrupa usuários (família). No MVP: todo usuário tem um household de 1 pessoa. Custo de criar a entidade agora: baixo. Custo de retrofit multi-tenant depois: alto. Toda query já filtra por household_id.

## Invariantes (testes obrigatórios)

1. Soma das pernas de um transfer = 0.
2. Transação tem conta XOR fatura.
3. Pró-labore é o único fluxo PJ→PF; não existe PF→PJ no MVP (aporte fica pra depois).
4. Saldo de conta = Σ transações da conta (propriedade verificável; job de reconciliação diária loga divergência como incidente).
5. Σ parcelas de um installment_group = valor total da compra (centavos: sobra na última parcela).
6. Fatura fechada é imutável (correções = transação de ajuste, nunca edição).
7. Provisão paga gera exatamente 1 despesa vinculada.

## Glossário (linguagem do produto)

| Termo técnico | Como o produto fala     |
| ------------- | ----------------------- |
| Pró-labore    | "Seu salário"           |
| Provisão      | "Separado para imposto" |
| Competência   | "Mês da compra"         |
| Caixa         | "Quando o dinheiro sai" |
| Contexto      | "Pessoal / Empresa"     |
