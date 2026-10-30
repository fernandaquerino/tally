# Design Principles — Tally

> Decision criteria for the whole product. In a conflict, the lower-numbered one wins.

## 1. Ten seconds or nothing

Recording a transaction takes <10s. Every new screen answers: "does this add friction to entry?" If so, justify it or cut it. (Organizze lesson; the category's #1 churn cause is friction)

## 2. PF and PJ always visible, never mixed

The context (PF/PJ) appears on every transaction, every report, every number. One click to switch, zero clicks to understand which is which. Consistent colors/icons (e.g. PJ = 🟦, PF = 🟩) across the whole product.

## 3. The number before the chart

The user's question is "how much can I spend?", not "how is the distribution by category". Home = 3 big numbers. Charts are an expandable detail, never the first answer. (anti-lesson of generic dashboards; Pierre lesson: translation > data)

## 4. Warn before the shock

The system speaks first: DAS in 7 days, pace blowing up, MEI ceiling at 85%. A proactive notification > a report nobody opens. But sparingly: max 1 proactive notification/day — too many alerts become ignored noise.

## 5. AI proposes, a human confirms

Every AI action (category, split, parsing) becomes a proposal confirmable in 1 click, never a silent action. A user correction = training data. Trust is built with control. (Copilot lesson: review as a micro-habit)

## 6. Numbers that add up are sacred

Any displayed sum is reconcilable: click the number → see the transactions that make it up. If the user can't audit it, we don't show it. (anti-Mobills/Wallet lesson)

## 7. Simple on entry, deep on demand

First experience: 3 questions, 3 numbers. Depth (subcategories, reports, fiscal settings) exists, but behind "see more". Progressive disclosure always. (Organizze lesson without the low ceiling)

## 8. Real web

Desktop: keyboard shortcuts (N = new entry, / = search), data density, navigable tables. Mobile (PWA): the thumb reaches everything, a fixed "+" button, one-column forms. It's not a stretched mobile app nor a squeezed desktop.

## 9. Human language, not bank language

"Seu salário" instead of "pró-labore" (with the technical term in parentheses the first time). "Separado para imposto" instead of "provisão tributária". Tone: the friendly accountant, not the bank manager.

## 10. The exit is easy

Export everything, always, in 1 minute. Cancel without a maze. The confidence of being able to leave is what makes people stay. (anti-lesson of the category's cancellation complaints)

## Tokens and visual direction (draft)

- Feel: light-professional (it's a work tool, but for one person, not a finance department)
- Anti-references: a gray corporate dashboard; childish gamification
- References: Copilot Money (clarity), Linear (elegant density), Nubank statements (language)
- Accessibility: minimum AA contrast; never color as the only encoder of PF/PJ (icon + label always)
