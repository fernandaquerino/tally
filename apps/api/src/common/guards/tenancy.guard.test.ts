import type { ExecutionContext } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import { describe, expect, it } from "vitest";

import type { AuthenticatedUser } from "../types/authenticated-user.js";
import { TenancyGuard } from "./tenancy.guard.js";

function contextWith(
  user: Partial<AuthenticatedUser> | undefined,
): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => undefined,
    getClass: () => undefined,
  } as unknown as ExecutionContext;
}

function reflectorReturning(isPublic: boolean): Reflector {
  return {
    getAllAndOverride: () => isPublic,
  } as unknown as Reflector;
}

describe("TenancyGuard", () => {
  it("passes when the session has a householdId", () => {
    const guard = new TenancyGuard(reflectorReturning(false));

    expect(
      guard.canActivate(
        contextWith({ userId: "u1", householdId: "hh-a", role: "OWNER" }),
      ),
    ).toBe(true);
  });

  it("blocks with 401 when there is no householdId", () => {
    const guard = new TenancyGuard(reflectorReturning(false));

    expect(() => guard.canActivate(contextWith(undefined))).toThrow(
      UnauthorizedException,
    );
  });

  it("allows routes marked as @Public() without requiring a session", () => {
    const guard = new TenancyGuard(reflectorReturning(true));

    expect(guard.canActivate(contextWith(undefined))).toBe(true);
  });
});
