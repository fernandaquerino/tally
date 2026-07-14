# Opportunity Solution Tree — Tally

> Formato Teresa Torres. Outcome no topo; oportunidades = dores/necessidades ouvidas (não features); soluções ligadas a oportunidades; experimentos testam soluções.

## Outcome (negócio)
**Usuários que fecham o mês sabendo seu "disponível real"** (North Star) → proxy de retenção e conversão paga.

```
OUTCOME: usuário fecha o mês sabendo quanto é realmente dele
│
├── OPORTUNIDADE 1: "Não sei quanto do que fatura é meu"
│   ├── Solução 1a: Divisor de recebimento (split imposto/reserva/pró-labore)  ← MVP
│   │   └── Experimento: protótipo Figma — reação ao split (H4)
│   ├── Solução 1b: Painel PJ com faturamento / provisionado / disponível     ← MVP
│   └── Solução 1c: Projeção de renda variável (média móvel)                  ← v2
│
├── OPORTUNIDADE 2: "Imposto é sempre susto"
│   ├── Solução 2a: Provisão automática de DAS/imposto com lembrete           ← MVP
│   ├── Solução 2b: Alerta de estouro do teto MEI                             ← MVP
│   └── Solução 2c: Pagamento do DAS in-app                                   ← descartada (território Cora; regulatório)
│
├── OPORTUNIDADE 3: "PF e PJ viram uma sopa"
│   ├── Solução 3a: Toggle PF/PJ em 1 clique em qualquer transação            ← MVP
│   ├── Solução 3b: Pró-labore como ponte PJ→PF                               ← MVP
│   └── Solução 3c: Cartão misto com separação nos relatórios                 ← MVP
│
├── OPORTUNIDADE 4: "Registrar gasto é chato, eu desisto"
│   ├── Solução 4a: Lançamento em <10s (atalhos, defaults inteligentes)       ← MVP
│   ├── Solução 4b: Lançamento por linguagem natural (IA)                     ← MVP
│   ├── Solução 4c: Import CSV/OFX                                            ← v1.5
│   └── Solução 4d: Open Finance                                              ← v2+ (ADR-0007)
│
├── OPORTUNIDADE 5: "O saldo nunca bate por causa do cartão"
│   └── Solução 5a: Fatura como agrupador; competência vs. caixa              ← MVP (ADR-0005)
│
├── OPORTUNIDADE 6: "Ninguém me avisa antes do problema"
│   ├── Solução 6a: Resumo semanal proativo (3 frases)                        ← MVP
│   ├── Solução 6b: Alertas de padrão anômalo / ritmo de gastos               ← MVP (básico)
│   └── Solução 6c: Agentes customizáveis                                     ← v3 (território Pierre; entrar com vantagem de contexto)
│
└── OPORTUNIDADE 7: "Dinheiro dá briga em casa"                               ← [H5: aquisição ou upgrade?]
    ├── Solução 7a: Conta família (perfis + visão conjunta + privacidade)     ← v2
    └── Solução 7b: Compartilhamento somente-leitura (contador/parceiro)      ← v1.5

Regras de manutenção:
- Oportunidade só entra com evidência (entrevista/review) anexada.
- Solução sem oportunidade-mãe = feature órfã → não entra.
- Revisar a árvore após cada rodada de 4 entrevistas.
```
