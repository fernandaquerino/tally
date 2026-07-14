# Fluxos de Usuário — Tally MVP (web)

> Fluxo = passos de tela. Wireframes correspondentes em `wireframes/`.

## F1 — Cadastro e onboarding
```
Landing → [Criar conta] → e-mail+senha ou Google
→ Pergunta 1: "Você tem CNPJ?" (MEI / Simples / Ainda não / Só pessoal)
→ Pergunta 2 (se PJ): faixa de faturamento → sugere % imposto default
→ Pergunta 3: % de reserva desejada (default 15%, editável)
→ Home vazia com CTA duplo: [Registrar um gasto] [Registrar um recebimento]
```
Regras: máx. 3 perguntas; tudo editável depois; sem pedir cartão de crédito.

## F2 — Lançamento rápido (formulário)
```
Home → botão "+" (fixo, canto inferior no mobile / atalho "N" no desktop)
→ Modal: valor (foco automático) → tipo despesa/receita → toggle [PF|PJ]
→ categoria (última usada pré-selecionada) → data (hoje default)
→ [meio de pagamento: conta ou cartão → se cartão: parcelas]
→ Salvar (Enter) → toast + home atualizada
```
Meta: <10s, ≤5 interações no caminho feliz.

## F3 — Lançamento por linguagem natural (IA)
```
Home → campo "Descreva: 'almoço com cliente 45, empresa'"
→ IA propõe: R$ 45 · Alimentação · PJ · hoje · [cartão?]
→ Card de confirmação editável → [Confirmar] → salvo
```
Regras: IA sempre propõe, usuário sempre confirma (1 clique); correções alimentam o aprendizado; fallback para F2 se parsing falhar.

## F4 — Recebimento PJ com split (o fluxo AHA) ⭐
```
"+" → receita → PJ → valor 5.000 → cliente/descrição
→ TELA DO SPLIT:
   ┌────────────────────────────────┐
   │ Entrou R$ 5.000,00             │
   │ 🧾 Imposto (6%)      R$ 300    │
   │ 🛟 Reserva (15%)     R$ 750    │
   │ 💰 Seu salário       R$ 3.950  │
   │ [ajustar %] [aplicar split]    │
   └────────────────────────────────┘
→ Aplicar → cria: receita PJ + provisão imposto + reserva + pró-labore (PJ→PF)
→ Home mostra "disponível pessoal" atualizado
```
Regras: % vêm do onboarding; ajuste manual salvo como novo default (perguntar); usuário pode pular o split (registrar só a receita) — medir quem pula.

## F5 — Cartão de crédito e fatura
```
Menu → Cartões → [novo cartão: nome, fechamento, vencimento, limite]
→ Tela do cartão = lista de FATURAS (aberta, fechadas, futuras)
→ Fatura aberta: transações do ciclo + parcelas que caem nela + total PF vs PJ
→ Fechamento: fatura vira "fechada" com valor; ao pagar → despesa na conta (caixa)
```
Regras: gasto no cartão afeta a fatura (competência), não o saldo da conta; pagamento da fatura afeta o saldo (caixa). Ver ADR-0005.

## F6 — Provisão e vencimento de DAS
```
Split cria provisão → aparece em "Comprometido futuro" na home
→ 7 dias antes: alerta (in-app + e-mail) "DAS vence dia 20 — você já tem R$ 300 separados"
→ Ao pagar: [marcar como pago] → provisão vira despesa PJ realizada
```

## F7 — Fechar o mês
```
Home → "Fechar setembro" (disponível a partir do dia 1 do mês seguinte)
→ Resumo: faturamento · impostos · reserva · seu salário · gastos por categoria (PF/PJ)
→ 3 insights da IA → [Exportar CSV]
```

## F8 — Exportação / backup
```
Configurações → Dados → [Exportar tudo (CSV/JSON)] → download imediato
```
Regra: sem fricção, sem e-mail de retenção — exportar fácil é argumento de confiança.

## Estados de erro e vazios (todos os fluxos)
- Home vazia: mostra o F4 como tutorial guiado com dados de exemplo descartáveis
- IA indisponível: F3 degrada para F2 com aviso discreto
- Offline (PWA): fila local de lançamentos + sync ao reconectar, com indicador de status
