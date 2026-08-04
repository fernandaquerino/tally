"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@tally/shared";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useLogin } from "../hooks/useLogin";
import { FormError } from "./FormError";

export function LoginForm() {
  const router = useRouter();
  const { mutate, isPending, error } = useLogin();
  const { control, handleSubmit } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => router.push("/dashboard"),
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {error ? <FormError message={error.message} /> : null}

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            required
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            required
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Button type="submit" loading={isPending} className="w-full">
        Entrar
      </Button>
    </form>
  );
}
