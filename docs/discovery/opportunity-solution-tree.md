# Opportunity Solution Tree — Tally

> Teresa Torres format. Outcome at the top; opportunities = pains/needs heard (not features); solutions linked to opportunities; experiments test solutions.

## Outcome (business)

**Users who close the month knowing their "real available"** (North Star) → a proxy for retention and paid conversion.

```
OUTCOME: the user closes the month knowing how much is really theirs
│
├── OPPORTUNITY 1: "I don't know how much of what I bill is mine"
│   ├── Solution 1a: Income splitter (tax/reserve/owner's-draw split)         ← MVP
│   │   └── Experiment: Figma prototype — reaction to the split (H4)
│   ├── Solution 1b: PJ panel with revenue / provisioned / available          ← MVP
│   └── Solution 1c: Variable-income projection (moving average)              ← v2
│
├── OPPORTUNITY 2: "Taxes are always a shock"
│   ├── Solution 2a: Automatic DAS/tax provision with a reminder             ← MVP
│   ├── Solution 2b: MEI ceiling overrun alert                               ← MVP
│   └── Solution 2c: In-app DAS payment                                      ← rejected (Cora territory; regulatory)
│
├── OPPORTUNITY 3: "PF and PJ become a soup"
│   ├── Solution 3a: 1-click PF/PJ toggle on any transaction                 ← MVP
│   ├── Solution 3b: Owner's draw as the PJ→PF bridge                        ← MVP
│   └── Solution 3c: A mixed card with separation in reports                 ← MVP
│
├── OPPORTUNITY 4: "Logging an expense is a chore, I give up"
│   ├── Solution 4a: Entry in <10s (shortcuts, smart defaults)               ← MVP
│   ├── Solution 4b: Natural-language entry (AI)                             ← MVP
│   ├── Solution 4c: CSV/OFX import                                          ← v1.5
│   └── Solution 4d: Open Finance                                            ← v2+ (ADR-0007)
│
├── OPPORTUNITY 5: "The balance never adds up because of the card"
│   └── Solution 5a: Statement as a grouping; accrual vs. cash               ← MVP (ADR-0005)
│
├── OPPORTUNITY 6: "Nobody warns me before the problem"
│   ├── Solution 6a: Proactive weekly summary (3 sentences)                  ← MVP
│   ├── Solution 6b: Anomalous-pattern / spending-pace alerts                ← MVP (basic)
│   └── Solution 6c: Customizable agents                                     ← v3 (Pierre territory; enter with a context advantage)
│
└── OPPORTUNITY 7: "Money causes fights at home"                             ← [H5: acquisition or upgrade?]
    ├── Solution 7a: Family account (profiles + joint view + privacy)        ← v2
    └── Solution 7b: Read-only sharing (accountant/partner)                  ← v1.5

Maintenance rules:
- An opportunity only enters with attached evidence (interview/review).
- A solution without a parent opportunity = an orphan feature → doesn't enter.
- Review the tree after each round of 4 interviews.
```
