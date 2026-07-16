import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  ArrowDownLeftIcon,
  ArrowLeftRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Badge } from "../Badge";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { ContextBadge, type FinancialContext } from "../ContextBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

type TxType = "income" | "expense" | "transfer";

interface Transaction {
  id: string;
  description: string;
  category: string;
  context: FinancialContext;
  date: string;
  cents: bigint;
  type: TxType;
}

const transactions: Transaction[] = [
  {
    id: "1",
    description: "Consultoria — Acme",
    category: "Faturamento",
    context: "pj",
    date: "09/06",
    cents: 850000n,
    type: "income",
  },
  {
    id: "2",
    description: "Assinatura Figma",
    category: "Software",
    context: "pj",
    date: "07/06",
    cents: -8990n,
    type: "expense",
  },
  {
    id: "3",
    description: "Pró-labore",
    category: "Transferência",
    context: "pf",
    date: "05/06",
    cents: 500000n,
    type: "transfer",
  },
];

const typeIcon: Record<TxType, typeof ArrowDownLeftIcon> = {
  income: ArrowDownLeftIcon,
  expense: ArrowUpRightIcon,
  transfer: ArrowLeftRightIcon,
};

const typeIconChip: Record<TxType, string> = {
  income: "bg-income-subtle text-income",
  expense: "bg-expense-subtle text-expense",
  transfer: "bg-secondary text-foreground-muted",
};

function formatValue(cents: bigint, type: TxType): string {
  const formatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay:
      type === "income" ? "always" : type === "expense" ? "auto" : "never",
  });
  return formatter.format(Number(cents) / 100);
}

function FinancialTable() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["1"]));

  const allSelected = selected.size === transactions.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(transactions.map((t) => t.id)) : new Set());
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  return (
    <div className="w-[min(92vw,60rem)]">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>
              <Checkbox
                aria-label="Selecionar todas as transações"
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead sortDirection="descending">
              <span className="inline-flex items-center gap-1">
                Descrição
                <ChevronDownIcon className="size-3.5" aria-hidden="true" />
              </span>
            </TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Contexto</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((tx) => {
            const Icon = typeIcon[tx.type];
            const isSelected = selected.has(tx.id);
            return (
              <TableRow
                key={tx.id}
                data-state={isSelected ? "selected" : undefined}
              >
                <TableCell>
                  <Checkbox
                    aria-label={`Selecionar ${tx.description}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => toggleOne(tx.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-md",
                        typeIconChip[tx.type],
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="font-medium text-foreground">
                      {tx.description}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="text-foreground-muted">
                  {tx.category}
                </TableCell>
                <TableCell>
                  <ContextBadge context={tx.context} />
                </TableCell>
                <TableCell className="text-foreground-subtle tabular-nums">
                  {tx.date}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-semibold tabular-nums",
                    tx.type === "income" ? "text-income" : "text-foreground",
                  )}
                >
                  {formatValue(tx.cents, tx.type)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={6} className="py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-normal text-foreground-subtle">
                  {selected.size} selecionada
                  {selected.size === 1 ? "" : "s"} · 128 transações
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Página anterior"
                    disabled
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <span className="text-[13px] font-normal text-foreground-muted tabular-nums">
                    1 / 9
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Próxima página"
                  >
                    <ChevronRightIcon />
                  </Button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

const meta = {
  title: "UI/Table",
  component: Table,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Financeira: Story = {
  render: () => <FinancialTable />,
};

export const Basic: Story = {
  render: () => (
    <div className="w-[min(92vw,40rem)]">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Conta</TableHead>
            <TableHead>Contexto</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Nubank PJ</TableCell>
            <TableCell>
              <Badge variant="pj">Empresa</Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">12.430,00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Conta pessoal</TableCell>
            <TableCell>
              <Badge variant="pf">Pessoal</Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">3.120,45</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};
