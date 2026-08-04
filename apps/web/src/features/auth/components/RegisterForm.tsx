"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@tally/shared";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useRegister } from "../hooks/useRegister";
import { FormError } from "./FormError";

export function RegisterForm() {
  const router = useRouter();
  const { mutate, isPending, error } = useRegister();
  const { control, handleSubmit } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
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
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            label="Nome"
            autoComplete="name"
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
            autoComplete="new-password"
            helperText="Mínimo de 8 caracteres."
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
        Criar conta
      </Button>
    </form>
  );
}
