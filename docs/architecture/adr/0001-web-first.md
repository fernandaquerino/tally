# ADR-0001: Web-first — adiar o app mobile nativo

**Status:** Aceito · **Data:** 2026-07-13 · **Decisor:** fundador

## Contexto
O MVP precisa ser entregue por 1 dev, que também tem como objetivo explícito praticar Next.js e NestJS. O discovery original recomendava mobile-first (o registro diário de gastos acontece no celular — dado da categoria). Forças em tensão: velocidade de aprendizado/entrega vs. adequação ao hábito de registro móvel.

## Opções consideradas
### A: Mobile-first (React Native/Flutter)
**Prós:** alinhado ao hábito de registro; presença nas lojas.
**Contras:** stack fora do objetivo de aprendizado; ciclo de release mais lento (review de loja); duas superfícies (app + web admin) para 1 dev; pior para relatórios/visão contador.

### B: Web-first responsivo + PWA (escolhida)
**Prós:** uma superfície só; deploy contínuo; stack desejada (Next/Nest); desktop é ótimo p/ relatórios, fechamento de mês e visão do contador — casos fortes da persona PJ; PWA instalável cobre o registro móvel razoavelmente.
**Contras:** PWA < app nativo em fricção de registro (sem widget, notificações push limitadas no iOS); risco direto sobre H3 (retenção sem baixa fricção).

### C: Ambos em paralelo
Descartada: inviável para 1 dev.

## Decisão
Web-first com Next.js, com **responsivo mobile + PWA tratados como requisito de primeira classe** (não afterthought): botão de lançamento fixo, formulário de 1 coluna, fila offline de criação, instalável.

## Consequências
- Fica mais fácil: iterar rápido, aprender a stack, atender relatórios/desktop.
- Fica mais difícil: competir em fricção de registro móvel com apps nativos; push no iOS.
- Mitigações: lançamento por linguagem natural (menos toques), e-mail/notificação web para alertas.
- Revisitar quando: (a) H3 mostrar churn por fricção móvel, ou (b) retenção validada e receita justificar o app (v2). Métrica-sentinela: % de sessões mobile e taxa de registro mobile vs. desktop.
