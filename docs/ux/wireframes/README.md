# Wireframes — Tally MVP

> Ferramenta: Figma (link do projeto: _adicionar_). Este diretório guarda exports PNG/PDF das versões estáveis + notas de decisão.

## Inventário de telas do MVP (checklist)

### Fluxo de entrada
- [ ] Landing page (dor: "Faturou bem. Por que não sobrou?")
- [ ] Cadastro / login
- [ ] Onboarding — pergunta CNPJ (MEI/Simples/não)
- [ ] Onboarding — faixa + % reserva

### Core
- [ ] Home (3 números: resultado PJ · disponível pessoal · comprometido) — desktop e mobile
- [ ] Modal de lançamento rápido (F2)
- [ ] Campo/fluxo de lançamento por IA com card de confirmação (F3)
- [ ] **Tela do split de recebimento (F4)** ⭐ — a tela mais importante do produto; prototipar primeiro e testar (H4)
- [ ] Lista de transações com filtro PF/PJ e busca

### Cartão
- [ ] Lista de cartões
- [ ] Tela do cartão = lista de faturas
- [ ] Detalhe da fatura (transações do ciclo, parcelas, PF vs PJ, status)

### PJ
- [ ] Painel PJ (faturamento, provisionado, disponível, teto MEI com barra)
- [ ] Provisões (lista + marcar como pago)

### Fechamento e dados
- [ ] Resumo mensal / fechar o mês (F7)
- [ ] Configurações (regime fiscal, % split, categorias)
- [ ] Exportação de dados

### Estados
- [ ] Home vazia (tutorial com dados de exemplo)
- [ ] Erro de IA (degradação para formulário)
- [ ] Offline (PWA, fila de sync)

## Convenção de nomes dos exports
`NN-nome-da-tela--vX.png` (ex.: `04-split-recebimento--v2.png`)

## Ordem de prototipagem (para o teste de H4)
1. Split de recebimento → 2. Home → 3. Lançamento rápido → 4. Fatura do cartão → resto
