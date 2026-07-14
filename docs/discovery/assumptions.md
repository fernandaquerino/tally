# Premissas e Hipóteses — Tally

> Toda decisão relevante do produto está apoiada em uma premissa. Se a premissa cair, a decisão é revisitada.

## Hipóteses de produto (testáveis)

| ID  | Hipótese                                                                 | Teste                               | Critério de invalidação                 | Status         |
| --- | ------------------------------------------------------------------------ | ----------------------------------- | --------------------------------------- | -------------- |
| H1  | O PJ híbrido sente a dor PF/PJ com intensidade para trocar de ferramenta | 10–12 entrevistas                   | <60% relatam a dor espontaneamente      | 🔴 não testada |
| H2  | Ele paga R$ 15–30/mês                                                    | Entrevistas + landing com preço     | Âncora dominante = "só grátis"          | 🔴 não testada |
| H3  | Registro manual excelente + IA sustenta uso sem Open Finance             | Beta; retenção S4 + motivo de churn | Churn cita fricção de digitar como nº 1 | 🔴 não testada |
| H4  | O divisor de recebimento é o momento AHA                                 | Teste de protótipo                  | Reação morna generalizada               | 🔴 não testada |
| H5  | Conta família é motivo de upgrade, não de aquisição                      | Entrevistas + ranking na waitlist   | Família aparece como dor nº 1           | 🔴 não testada |
| H6  | IA proativa (avisa) > IA chat (responde)                                 | A/B no beta                         | Uso/retenção maior no grupo chat        | 🔴 não testada |

## Premissas de negócio

- P1: O mercado de PJs "de uma pessoa só" (MEI + Simples unipessoal) é grande o suficiente (milhões de CNPJs ativos) e cresce com a pejotização. **Risco: baixo.**
- P2: Pierre/CloudWalk não lança contexto PJ nos próximos ~12 meses. **Risco: médio — monitorar trimestralmente.**
- P3: Regras MEI/Simples básicas permanecem estáveis o suficiente durante a transição da reforma tributária. **Mitigação: regras como configuração versionada, não hardcode (ver domain-model).**

## Premissas técnicas

- T1: Next.js + NestJS dão velocidade suficiente para um dev solo entregar o MVP (é também objetivo de aprendizado). — ADR-0002
- T2: Um web app responsivo bem feito é aceitável para registro no celular até o app nativo existir. **Risco: médio — o registro diário acontece no celular; PWA mitiga.** — ADR-0001
- T3: Custo de IA por usuário fica controlável limitando a IA v1 a categorização + resumo semanal (sem chat livre).
- T4: PostgreSQL atende todo o MVP sem necessidade de outros stores (Redis opcional para filas). — ADR-0003

## Registro de invalidações

| Data | Premissa | O que aconteceu | Decisão tomada |
| ---- | -------- | --------------- | -------------- |
| —    | —        | —               | —              |
