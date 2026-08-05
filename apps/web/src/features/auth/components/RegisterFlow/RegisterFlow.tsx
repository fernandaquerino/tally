"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@tally/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useRegister } from "../../hooks/useRegister";
import {
  readLastLoginMethod,
  type LoginMethod,
} from "../../utils/last-login-method";
import { FormError } from "../FormError";
import { LastLoginHint } from "../LastLoginHint";
import { SocialButtons } from "../SocialButtons";

type RegisterStep = "method" | "email" | "details";

export function RegisterFlow() {
  const router = useRouter();
  const [step, setStep] = useState<RegisterStep>("method");
  const [lastLoginMethod, setLastLoginMethod] = useState<LoginMethod | null>(
    null,
  );
  const { mutate, isPending, error, reset } = useRegister();
  const { control, getValues, handleSubmit, setFocus, trigger } =
    useForm<RegisterInput>({
      resolver: zodResolver(registerSchema),
      defaultValues: { name: "", email: "", password: "" },
    });

  useEffect(() => {
    if (step === "email") setFocus("email");
    if (step === "details") setFocus("name");
  }, [setFocus, step]);

  useEffect(() => {
    setLastLoginMethod(readLastLoginMethod());
  }, []);

  function goToStep(nextStep: RegisterStep) {
    reset();
    setStep(nextStep);
  }

  async function continueWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await trigger("email")) goToStep("details");
  }

  const submitRegister = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => router.push("/dashboard"),
    });
  });

  return (
    <div className="min-h-[31rem] w-full">
      <div key={step} className="auth-step-enter">
        {step === "method" ? (
          <section aria-labelledby="register-method-title">
            <h1
              id="register-method-title"
              className="typography-heading-2 text-center"
            >
              Criar sua conta no Tally
            </h1>

            <div className="mt-8 flex flex-col gap-3">
              <Button
                type="button"
                size="lg"
                variant={
                  lastLoginMethod === null || lastLoginMethod === "email"
                    ? "default"
                    : "outline"
                }
                className="w-full"
                onClick={() => goToStep("email")}
              >
                Continuar com e-mail
              </Button>
              {lastLoginMethod === "email" ? (
                <LastLoginHint method="e-mail" />
              ) : null}
              <SocialButtons
                showDivider={false}
                size="lg"
                lastUsedMethod={lastLoginMethod}
              />
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground hover:underline"
              >
                Entrar
              </Link>
            </p>
          </section>
        ) : null}

        {step === "email" ? (
          <section aria-labelledby="register-email-title">
            <h1
              id="register-email-title"
              className="typography-heading-2 text-center"
            >
              Qual é o seu e-mail?
            </h1>

            <form
              onSubmit={continueWithEmail}
              noValidate
              className="mt-8 flex flex-col gap-3"
            >
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    aria-label="E-mail"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    required
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    className="h-11 text-sm"
                  />
                )}
              />

              <Button type="submit" size="lg" className="w-full">
                Continuar
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => goToStep("method")}
              >
                Voltar para o cadastro
              </Button>
            </form>
          </section>
        ) : null}

        {step === "details" ? (
          <section aria-labelledby="register-details-title">
            <h1
              id="register-details-title"
              className="typography-heading-2 text-center"
            >
              Complete seu cadastro
            </h1>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {getValues("email")}
            </p>

            <form
              onSubmit={submitRegister}
              noValidate
              className="mt-8 flex flex-col gap-3"
            >
              {error ? <FormError message={error.message} /> : null}

              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    aria-label="Nome"
                    autoComplete="name"
                    placeholder="Como podemos chamar você?"
                    required
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    className="h-11 text-sm"
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    aria-label="Senha"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Crie uma senha"
                    helperText="Mínimo de 8 caracteres."
                    required
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    className="h-11 text-sm"
                  />
                )}
              />

              <Button
                type="submit"
                size="lg"
                loading={isPending}
                className="w-full"
              >
                Criar conta
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => goToStep("email")}
              >
                Alterar e-mail
              </Button>
            </form>
          </section>
        ) : null}
      </div>
    </div>
  );
}
