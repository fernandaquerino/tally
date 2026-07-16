import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

function renderTable() {
  return render(
    <Table>
      <TableCaption>Transações do mês</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead sortDirection="descending">Descrição</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow data-state="selected">
          <TableCell>Consultoria — Acme</TableCell>
          <TableCell>+8.500,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Assinatura Figma</TableCell>
          <TableCell>-89,90</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
}

describe("Table", () => {
  it("renders an accessible table with caption and column headers", () => {
    renderTable();

    const table = screen.getByRole("table", { name: "Transações do mês" });
    expect(table).toBeInTheDocument();
    expect(
      within(table).getByRole("columnheader", { name: "Descrição" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("exposes aria-sort on sortable headers", () => {
    renderTable();

    expect(
      screen.getByRole("columnheader", { name: "Descrição" }),
    ).toHaveAttribute("aria-sort", "descending");
  });

  it("marks selected rows with data-state", () => {
    renderTable();

    const selectedCell = screen.getByText("Consultoria — Acme");
    const row = selectedCell.closest("tr")!;
    expect(row).toHaveAttribute("data-state", "selected");
    expect(row).toHaveClass("data-[state=selected]:bg-primary-subtle");
  });

  it("lets the consumer align a cell via className", () => {
    renderTable();

    expect(screen.getByText("+8.500,00")).not.toHaveClass("text-right");
    expect(screen.getByRole("columnheader", { name: "Valor" })).toHaveClass(
      "text-right",
    );
  });
});
