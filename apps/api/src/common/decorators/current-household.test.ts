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
  it("returns the householdId from the session", () => {
    const household = resolveCurrentHousehold(
      contextWith({ userId: "u1", householdId: "hh-a", role: "OWNER" }),
    );

    expect(household).toBe("hh-a");
  });

  it("throws 401 when there is no user on the request", () => {
    expect(() => resolveCurrentHousehold(contextWith(undefined))).toThrow(
      UnauthorizedException,
    );
  });
});
