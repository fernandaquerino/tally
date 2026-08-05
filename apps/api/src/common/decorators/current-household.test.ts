import type { ExecutionContext } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import type { AuthenticatedUser } from "../types/authenticated-user.js";
import { resolveCurrentHousehold } from "./current-household.decorator.js";

function contextWith(
  user: Partial<AuthenticatedUser> | undefined,
): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

describe("resolveCurrentHousehold", () => {
  it("retorna o householdId da sessão", () => {
    const household = resolveCurrentHousehold(
      contextWith({ userId: "u1", householdId: "hh-a", role: "OWNER" }),
    );

    expect(household).toBe("hh-a");
  });

  it("lança 401 quando não há usuário na request", () => {
    expect(() => resolveCurrentHousehold(contextWith(undefined))).toThrow(
      UnauthorizedException,
    );
  });
});
