import { describe, expect, it } from "vitest";

import { tenantWhere } from "./tenant-scope.js";

describe("tenantWhere", () => {
  it("injeta o householdId num where vazio", () => {
    expect(tenantWhere("hh-a")).toEqual({ householdId: "hh-a" });
  });

  it("preserva os demais filtros do where", () => {
    expect(tenantWhere("hh-a", { status: "ACTIVE" })).toEqual({
      status: "ACTIVE",
      householdId: "hh-a",
    });
  });

  it("sobrescreve householdId forjado vindo do client", () => {
    // Anti-IDOR: o tenant da sessão sempre vence, mesmo se o input tentar forjar.
    const forged = { householdId: "hh-b", status: "ACTIVE" };

    expect(tenantWhere("hh-a", forged)).toEqual({
      status: "ACTIVE",
      householdId: "hh-a",
    });
  });

  it("lança quando o householdId está ausente/vazio", () => {
    expect(() => tenantWhere("")).toThrow(/householdId/);
  });
});
