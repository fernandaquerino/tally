# Princípios de Design — Tally

> Critérios de decisão para todo o produto. Em conflito, o de número menor vence.

## 1. Dez segundos ou nada
Registrar uma transação leva <10s. Toda tela nova responde: "isso adiciona fricção ao registro?" Se sim, justifique ou corte. (lição Organizze; causa nº 1 de churn da categoria é fricção)

## 2. PF e PJ sempre visíveis, nunca misturados
O contexto (PF/PJ) aparece em toda transação, todo relatório, todo número. Um clique para alternar, zero cliques para entender qual é qual. Cores/ícones consistentes (ex.: PJ = 🟦, PF = 🟩) em todo o produto.

## 3. O número antes do gráfico
A pergunta do usuário é "quanto posso gastar?", não "como está a distribuição por categoria". Home = 3 números grandes. Gráficos são detalhe expansível, nunca a primeira resposta. (anti-lição dos dashboards genéricos; lição Pierre: tradução > dados)

## 4. Avisar antes do susto
O sistema fala primeiro: DAS em 7 dias, ritmo estourando, teto MEI a 85%. Notificação proativa > relatório que ninguém abre. Mas com parcimônia: máx. 1 notificação proativa/dia — alerta demais vira ruído ignorado.

## 5. IA propõe, humano confirma
Toda ação da IA (categoria, split, parsing) vira proposta confirmável em 1 clique, nunca ação silenciosa. Correção do usuário = dado de treino. Confiança se constrói com controle. (lição Copilot: revisão como micro-hábito)

## 6. Números que batem são sagrados
Qualquer soma exibida é reconciliável: clique no número → veja as transações que o compõem. Se o usuário não consegue auditar, não mostramos. (anti-lição Mobills/Wallet)

## 7. Simples na entrada, profundo sob demanda
Primeira experiência: 3 perguntas, 3 números. Profundidade (subcategorias, relatórios, configurações fiscais) existe, mas atrás de "ver mais". Progressive disclosure sempre. (lição Organizze sem o teto baixo)

## 8. Web de verdade
Desktop: atalhos de teclado (N = novo lançamento, / = busca), densidade de dados, tabelas navegáveis. Mobile (PWA): polegar alcança tudo, botão "+" fixo, formulários de uma coluna. Não é um app mobile esticado nem um desktop espremido.

## 9. Linguagem de gente, não de banco
"Seu salário" em vez de "pró-labore" (com o termo técnico entre parênteses na primeira vez). "Separado para imposto" em vez de "provisão tributária". Tom: o contador amigo, não o gerente de banco.

## 10. A saída é fácil
Exportar tudo, sempre, em 1 minuto. Cancelar sem labirinto. A confiança de poder sair é o que faz ficar. (anti-lição das reclamações de cancelamento da categoria)

## Tokens e direção visual (rascunho)
- Sensação: profissional-leve (é ferramenta de trabalho, mas de uma pessoa, não de um depto financeiro)
- Anti-referências: dashboard corporativo cinza; gamificação infantil
- Referências: Copilot Money (clareza), Linear (densidade elegante), extratos do Nubank (linguagem)
- Acessibilidade: contraste AA mínimo; nunca cor como único codificador de PF/PJ (ícone + label sempre)
