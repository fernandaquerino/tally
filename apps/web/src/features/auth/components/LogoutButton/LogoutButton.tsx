"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

import { useLogout } from "../../hooks/useLogout";

export function LogoutButton() {
  const router = useRouter();
  const { mutate, isPending } = useLogout();

  return (
    <Button
      variant="outline"
      size="sm"
      loading={isPending}
      onClick={() =>
        mutate(undefined, { onSuccess: () => router.replace("/login") })
      }
    >
      Sair
    </Button>
  );
}
