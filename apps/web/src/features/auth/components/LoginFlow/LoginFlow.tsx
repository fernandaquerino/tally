"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@tally/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useLogin } from "../../hooks/useLogin";
import {
  readLastLoginMethod,
  type LoginMethod,
} from "../../utils/last-login-method";
import { FormError } from "../FormError";
import { LastLoginHint } from "../LastLoginHint";
import { SocialButtons } from "../SocialButtons";

type LoginStep = "method" | "email" | "password";

export function LoginFlow() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("method");
  const [lastLoginMethod, setLastLoginMethod] = useState<LoginMethod | null>(
    null,
  );
  const { mutate, isPending, error, reset } = useLogin();
  const { control, getValues, handleSubmit, setFocus, trigger } =
    useForm<LoginInput>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: "", password: "" },
    });

  useEffect(() => {
    if (step === "email") setFocus("email");
    if (step === "password") setFocus("password");
  }, [setFocus, step]);

  useEffect(() => {
    setLastLoginMethod(readLastLoginMethod());
  }, []);

  function goToStep(nextStep: LoginStep) {
    reset();
    setStep(nextStep);
  }

  async function continueWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await trigger("email")) goToStep("password");
  }

  const submitLogin = handleSubmit((values) => {
    mutate(values, {
      onSuccess: ({ user }) =>
        router.push(user.onboardingCompleted ? "/dashboard" : "/onboarding"),
    });
  });

  return (
    <div className="min-h-[28rem] w-full">
      <div key={step} className="auth-step-enter">
        {step === "method" ? (
          <section aria-labelledby="login-method-title">
            <h1
              id="login-method-title"
              className="typography-heading-2 text-center"
            >
              Entrar no Tally
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
              Não tem conta?{" "}
              <Link
                href="/signup"
                className="font-medium text-foreground hover:underline"
              >
                Criar conta
              </Link>
            </p>
          </section>
        ) : null}

        {step === "email" ? (
          <section aria-labelledby="login-email-title">
            <h1
              id="login-email-title"
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
                Voltar para o login
              </Button>
            </form>
          </section>
        ) : null}

        {step === "password" ? (
          <section aria-labelledby="login-password-title">
            <h1
              id="login-password-title"
              className="typography-heading-2 text-center"
            >
              Digite sua senha
            </h1>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {getValues("email")}
            </p>

            <form
              onSubmit={submitLogin}
              noValidate
              className="mt-8 flex flex-col gap-3"
            >
              {error ? <FormError message={error.message} /> : null}

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    aria-label="Senha"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
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
                Entrar
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
