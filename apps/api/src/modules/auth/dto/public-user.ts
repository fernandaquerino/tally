import type { HouseholdRole } from "@tally/db";

/** Usuário exposto ao client — nunca inclui `passwordHash` (AGENTS §8.1). */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  householdId: string;
  role: HouseholdRole;
  onboardingCompleted: boolean;
}

type UserIdentity = Pick<PublicUser, "id" | "name" | "email"> & {
  onboardingCompletedAt: Date | null;
};

export function toPublicUser(
  user: UserIdentity,
  householdId: string,
  role: HouseholdRole,
): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    householdId,
    role,
    onboardingCompleted: user.onboardingCompletedAt !== null,
  };
}
