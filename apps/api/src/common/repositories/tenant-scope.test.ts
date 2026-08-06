import { describe, expect, it } from "vitest";

import { tenantWhere } from "./tenant-scope.js";

describe("tenantWhere", () => {
  it("injects the householdId into an empty where", () => {
    expect(tenantWhere("hh-a")).toEqual({ householdId: "hh-a" });
  });

  it("preserves the other filters in the where", () => {
    expect(tenantWhere("hh-a", { status: "ACTIVE" })).toEqual({
      status: "ACTIVE",
      householdId: "hh-a",
    });
  });

  it("overrides a forged householdId coming from the client", () => {
    // Anti-IDOR: o tenant da sessão sempre vence, mesmo se o input tentar forjar.
    const forged = { householdId: "hh-b", status: "ACTIVE" };

    expect(tenantWhere("hh-a", forged)).toEqual({
      status: "ACTIVE",
      householdId: "hh-a",
    });
  });

  it("throws when the householdId is missing/empty", () => {
    expect(() => tenantWhere("")).toThrow(/householdId/);
  });
});
