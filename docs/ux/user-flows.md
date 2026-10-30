# User Flows — Tally MVP (web)

> A flow = screen steps. Corresponding wireframes in `wireframes/`. UI copy inside the mockups is kept in Brazilian Portuguese (product's displayed text).

## F1 — Sign up and onboarding

```
Landing → [Create account] → email+password or Google
→ Question 1: "Do you have a CNPJ?" (MEI / Simples / Not yet / Personal only)
→ Question 2 (if PJ): revenue bracket → suggests a default tax %
→ Question 3: desired reserve % (default 15%, editable)
→ Empty home with a dual CTA: [Record an expense] [Record an income]
```

Rules: max 3 questions; everything editable later; don't ask for a credit card.

## F2 — Quick entry (form)

```
Home → "+" button (fixed, bottom corner on mobile / "N" shortcut on desktop)
→ Modal: amount (auto focus) → type expense/income → toggle [PF|PJ]
→ category (last used pre-selected) → date (today default)
→ [payment method: account or card → if card: installments]
→ Save (Enter) → toast + updated home
```

Target: <10s, ≤5 interactions on the happy path.

## F3 — Natural-language entry (AI)

```
Home → field "Describe: 'lunch with client 45, company'"
→ The AI proposes: R$ 45 · Food · PJ · today · [card?]
→ An editable confirmation card → [Confirm] → saved
```

Rules: the AI always proposes, the user always confirms (1 click); corrections feed the learning; a fallback to F2 if parsing fails.

## F4 — PJ income with split (the AHA flow) ⭐

```
"+" → income → PJ → amount 5,000 → client/description
→ SPLIT SCREEN:
   ┌────────────────────────────────┐
   │ Entrou R$ 5.000,00             │
   │ 🧾 Imposto (6%)      R$ 300    │
   │ 🛟 Reserva (15%)     R$ 750    │
   │ 💰 Seu salário       R$ 3.950  │
   │ [ajustar %] [aplicar split]    │
   └────────────────────────────────┘
→ Apply → creates: PJ income + tax provision + reserve + owner's draw (PJ→PF)
→ Home shows the updated "personal available"
```

Rules: % come from onboarding; a manual adjustment saved as a new default (ask); the user can skip the split (record only the income) — measure who skips.

## F5 — Credit card and statement

```
Menu → Cards → [new card: name, closing, due date, limit]
→ The card screen = a list of STATEMENTS (open, closed, future)
→ Open statement: the cycle's transactions + installments that fall in it + total PF vs PJ
→ Closing: the statement becomes "closed" with an amount; on payment → an expense in the account (cash)
```

Rules: a card purchase affects the statement (accrual), not the account balance; the statement payment affects the balance (cash). See ADR-0005.

## F6 — Provision and DAS due date

```
The split creates a provision → appears in "Future committed" on the home
→ 7 days before: an alert (in-app + email) "The DAS is due on the 20th — you already have R$ 300 set aside"
→ On payment: [mark as paid] → the provision becomes a realized PJ expense
```

## F7 — Close the month

```
Home → "Close September" (available from the 1st of the following month)
→ Summary: revenue · taxes · reserve · your salary · spending by category (PF/PJ)
→ 3 AI insights → [Export CSV]
```

## F8 — Export / backup

```
Settings → Data → [Export everything (CSV/JSON)] → immediate download
```

Rule: no friction, no retention email — easy export is a trust argument.

## Error and empty states (all flows)

- Empty home: shows F4 as a guided tutorial with disposable sample data
- AI unavailable: F3 degrades to F2 with a discreet notice
- Offline (PWA): a local entry queue + sync on reconnect, with a status indicator
