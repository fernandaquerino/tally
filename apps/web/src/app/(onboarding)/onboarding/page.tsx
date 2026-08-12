"use client";

import { formatCents } from "@tally/shared";
import { useState } from "react";

import { TallyLogo } from "@/components/brand";
import { Alert } from "@/components/feedback/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CnpjInput } from "@/components/ui/CnpjInput";
import { Input } from "@/components/ui/Input";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { RadioCardGroup } from "@/components/ui/RadioCard";
import { Range } from "@/components/ui/Range";
import { useSession } from "@/features/auth/hooks/useSession";
import { PillRadioGroup } from "@/features/onboarding/components/PillRadioGroup";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  CreditCard,
  FileText,
  Landmark,
  LockKeyhole,
  PiggyBank,
  Clock3,
  Sparkles,
  Split,
  User,
  Wallet,
} from "lucide-react";

export default function DashboardPage() {
  const { data: user } = useSession();
  const name = user?.name;
  const monthlyRevenue = 1_850_000n;
  const [taxPercentage, setTaxPercentage] = useState(26);
  const [reservePercentage, setReservePercentage] = useState(25);
  const taxAmount = (monthlyRevenue * BigInt(taxPercentage)) / 100n;
  const reserveAmount = (monthlyRevenue * BigInt(reservePercentage)) / 100n;
  const personalPercentage = 100 - taxPercentage - reservePercentage;
  const personalAmount = monthlyRevenue - taxAmount - reserveAmount;

  console.log({ user });

  return (
    <section className="flex min-h-screen bg-background">
      <aside className="bg-neutral-950 p-10 max-w-md flex flex-col justify-between flex-none">
        <div>
          <TallyLogo className="mb-12" />
          <h2 className="text-2xl tracking-tight font-semibold mb-3.5">
            Vamos descobrir quanto do seu faturamento é realmente seu.
          </h2>
          <p className="text-sm text-foreground-muted mb-9">
            Cinco passos rápidos. Só o essencial para o Tally separar o dinheiro
            da empresa do seu dinheiro.
          </p>
          <ol className="flex flex-col gap-0.5">
            <li className="flex items-center gap-3 py-2.5">
              <span className="size-6 rounded-full flex-none flex items-center justify-center border-border border-[1.5px] text-foreground-muted">
                <User aria-hidden="true" className="size-3" />
              </span>
              <p className="text-foreground-subtle font-normal text-sm">
                Perfil
              </p>
            </li>
            <li className="flex items-center gap-3 py-2.5">
              <span className="size-6 rounded-full flex-none flex items-center justify-center border-border border-[1.5px] text-foreground-muted">
                <Building2 aria-hidden="true" className="size-3" />
              </span>
              <p className="text-foreground-subtle font-normal text-sm">
                Sua empresa
              </p>
            </li>
            <li className="flex items-center gap-3 py-2.5">
              <span className="size-6 rounded-full flex-none flex items-center justify-center border-border border-[1.5px] text-foreground-muted">
                <FileText aria-hidden="true" className="size-3" />
              </span>
              <p className="text-foreground-subtle font-normal text-sm">
                Regime fiscal
              </p>
            </li>
            <li className="flex items-center gap-3 py-2.5">
              <span className="size-6 rounded-full flex-none flex items-center justify-center border-border border-[1.5px] text-foreground-muted">
                <PiggyBank aria-hidden="true" className="size-3" />
              </span>
              <p className="text-foreground-subtle font-normal text-sm">
                Separar para imposto
              </p>
            </li>
            <li className="flex items-center gap-3 py-2.5">
              <span className="size-6 rounded-full flex-none flex items-center justify-center border-border border-[1.5px] text-foreground-muted">
                <Landmark aria-hidden="true" className="size-3" />
              </span>
              <p className="text-foreground-subtle font-normal text-sm">
                Conta inicial
              </p>
            </li>
          </ol>
        </div>
        <p className="text-xs text-foreground-subtle leading-[1.55]">
          Seus dados ficam só com você. Nada é compartilhado com a Receita ou
          com terceiros.
        </p>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        {/* border */}
        <div className="h-1 bg-border flex-none">
          <div className="h-full bg-primary" />
        </div>
        <div className="flex flex-none justify-end pt-3.5 px-11 hidden">
          <button className="flex items-center text-sm text-foreground-muted cursor-pointer gap-1.5 hover:text-foreground-subtle transition-colors duration-300">
            Deixar para depois
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>
        {/* Step 1 - Introduction */}
        <div className="flex-1 flex items-center justify-center px-11 py-10 hidden">
          <div className="w-full max-w-[520px]">
            <div className="size-12 rounded-xl bg-ai-subtle flex items-center justify-center mb-5">
              <Sparkles className="size-6 text-primary" />
            </div>
            <h1 className="text-3xl tracking-tight font-semibold mb-3 text-foreground leading-[1.18]">
              Bem-vindo ao Tally
            </h1>
            <p className="text-base text-foreground-subtle leading-[1.6] mb-6">
              Para mostrar quanto do que entra é realmente seu, precisamos
              conhecer o básico da sua empresa: o que você fatura, qual o seu
              regime e quanto separar para imposto.
            </p>
            <div className="flex flex-col gap-2.5 mb-8">
              <div className="flex items-center gap-2.5 border-border p-3 rounded-[10px] bg-surface border">
                <Split className="size-4 text-primary" />
                <span className="text-xs text-foreground-muted">
                  Separa o dinheiro da empresa do seu dinheiro pessoal
                </span>
              </div>
              <div className="flex items-center gap-2.5 border-border p-3 rounded-[10px] bg-surface border">
                <PiggyBank className="size-4 text-primary" />
                <span className="text-xs text-foreground-muted">
                  Mostra quanto deixar separado para imposto
                </span>
              </div>
              <div className="flex items-center gap-2.5 border-border p-3 rounded-[10px] bg-surface border">
                <Wallet className="size-4 text-primary" />
                <span className="text-xs text-foreground-muted">
                  Calcula quanto pode virar pró-labore com segurança
                </span>
              </div>
            </div>
            <Button>
              Começar
              <ArrowRight />
            </Button>
            <p className="text-xs text-foreground-subtle mt-4">
              Leva menos de 2 minutos · você pode pular o que não souber agora
            </p>
          </div>
        </div>
        {/* Step 2 - Profile  */}
        <div className="flex-1 flex items-center justify-center px-11 py-10 hidden">
          <div className="w-full max-w-[520px]">
            <p className="text-xs font-semibold uppercase text-primary mb-2 tracking-[0.06em]">
              Passo 1 de 5
            </p>
            <h1 className="text-2xl text-foreground font-semibold mb-2 leading-[1.22] tracking-[-0.025em]">
              Como podemos te chamar?
            </h1>
            <p className="text-sm text-foreground-subtle mb-6">
              Usamos seu nome nas saudações e nos relatórios.
            </p>
            <div className="grid gap-6 mb-7">
              <Input label="Seu nome" value={name} />
              <PillRadioGroup
                label="O que você faz?"
                optional
                options={[
                  { value: "design", label: "Design" },
                  { value: "development", label: "Desenvolvimento" },
                  { value: "consulting", label: "Consultoria" },
                  { value: "marketing", label: "Marketing" },
                  { value: "health", label: "Saúde" },
                  { value: "other", label: "Outro" },
                ]}
              />
            </div>
            <div className="flex items-center gap-2.5">
              <Button>
                Continuar <ArrowRight />
              </Button>
              <button className="flex items-center text-sm text-foreground-muted cursor-pointer gap-1.5 hover:text-foreground-subtle transition-colors duration-300 px-3">
                Voltar
              </button>
            </div>
          </div>
        </div>

        {/* Step 3 - Sua empresa */}
        <div className="flex-1 flex items-center justify-center px-11 py-10 hidden">
          <div className="w-full max-w-[520px]">
            <p className="text-xs font-semibold uppercase text-primary mb-2 tracking-[0.06em]">
              Passo 2 de 5
            </p>
            <h1 className="text-2xl text-foreground font-semibold mb-2 leading-[1.22] tracking-[-0.025em]">
              Quanto sua empresa costuma faturar por mês?
            </h1>
            <p className="text-sm text-foreground-subtle mb-6">
              Um valor médio já serve. Dá pra ajustar depois.
            </p>
            <div className="grid gap-6 mb-7">
              <MoneyInput
                label="Faturamento médio mensal"
                helperText="Some o que entra pela empresa — notas, recebimentos de clientes, plataformas."
                placeholder="0,00"
                className="h-13 text-xl"
              />
              <CnpjInput />
            </div>
            <div className="flex items-center gap-2.5">
              <Button>
                Continuar <ArrowRight />
              </Button>
              <button className="flex items-center text-sm text-foreground-muted cursor-pointer gap-1.5 hover:text-foreground-subtle transition-colors duration-300 px-3">
                Voltar
              </button>
            </div>
          </div>
        </div>

        {/* Step 4 - Regime fiscal */}
        <div className="flex-1 flex items-center justify-center px-11 py-10 hidden">
          <div className="w-full max-w-[520px]">
            <p className="text-xs font-semibold uppercase text-primary mb-2 tracking-[0.06em]">
              Passo 3 de 5
            </p>
            <h1 className="text-2xl text-foreground font-semibold mb-2 leading-[1.22] tracking-[-0.025em]">
              Qual o regime da sua empresa?
            </h1>
            <p className="text-sm text-foreground-subtle mb-6">
              Isso muda quanto o Tally sugere separar para imposto.
            </p>
            <div className="grid gap-4 mb-7">
              <RadioCardGroup
                label="Regime fiscal"
                hideLabel
                defaultValue="unknown"
                options={[
                  {
                    value: "mei",
                    label: (
                      <span className="flex items-center gap-2">
                        <span>MEI</span>
                        <Badge
                          variant="neutral"
                          className="border-0 px-2 py-1 text-xs"
                        >
                          ~6%
                        </Badge>
                      </span>
                    ),
                    description:
                      "Faturamento até R$ 81 mil por ano. Imposto fixo mensal (DAS).",
                  },
                  {
                    value: "simples_nacional",
                    label: (
                      <span className="flex items-center gap-2">
                        <span>Simples Nacional</span>
                        <Badge
                          variant="neutral"
                          className="border-0 px-2 py-1 text-xs"
                        >
                          ~15%
                        </Badge>
                      </span>
                    ),
                    description:
                      "A alíquota varia com o faturamento e a atividade da empresa.",
                  },
                  {
                    value: "unknown",
                    label: (
                      <span className="flex items-center gap-2">
                        <span>Ainda não sei</span>
                        <Badge
                          variant="neutral"
                          className="border-0 px-2 py-1 text-xs"
                        >
                          ~15%
                        </Badge>
                      </span>
                    ),
                    description:
                      "Começamos com uma estimativa segura e você ajusta depois.",
                  },
                ]}
              />
              <Alert variant="warning" className="py-3.5 leading-relaxed">
                Não é aconselhamento contábil. O Tally usa isso só para estimar
                quanto deixar separado — confirme com seu contador.
              </Alert>
            </div>
            <div className="flex items-center gap-2.5">
              <Button>
                Continuar <ArrowRight />
              </Button>
              <button className="flex items-center text-sm text-foreground-muted cursor-pointer gap-1.5 hover:text-foreground-subtle transition-colors duration-300 px-3">
                Voltar
              </button>
            </div>
          </div>
        </div>

        {/* Step 5 - Separar para imposto */}
        <div className="flex-1 flex items-center justify-center px-11 py-10 hidden">
          <div className="w-full max-w-[520px]">
            <p className="text-xs font-semibold uppercase text-primary mb-2 tracking-[0.06em]">
              Passo 4 de 5
            </p>
            <h1 className="text-2xl text-foreground font-semibold mb-2 leading-[1.22] tracking-[-0.025em]">
              Como quer dividir o que entra?
            </h1>
            <p className="text-sm text-foreground-subtle mb-6">
              Esta é uma sugestão inicial. Você poderá ajustar quando quiser.
            </p>

            <div className="grid gap-4 mb-7">
              <section
                aria-label="Prévia dos percentuais separados"
                className="grid gap-7 rounded-xl border border-border bg-card p-5"
              >
                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-foreground">
                      Separado para imposto
                    </span>
                    <span className="font-semibold tabular-nums text-warning-foreground">
                      {taxPercentage}% · {formatCents(taxAmount)}
                    </span>
                  </div>
                  <Range
                    aria-label="Percentual separado para imposto"
                    min={0}
                    max={40}
                    value={taxPercentage}
                    variant="warning"
                    onValueChange={setTaxPercentage}
                  />
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-foreground">
                      Reserva da empresa
                    </span>
                    <span className="font-semibold tabular-nums text-pj">
                      {reservePercentage}% · {formatCents(reserveAmount)}
                    </span>
                  </div>
                  <Range
                    aria-label="Percentual da reserva da empresa"
                    min={0}
                    max={40}
                    value={reservePercentage}
                    variant="pj"
                    onValueChange={setReservePercentage}
                  />
                </div>
              </section>

              <section
                aria-labelledby="split-summary-title"
                className="rounded-xl border border-primary-border bg-primary-subtle p-5"
              >
                <h2
                  id="split-summary-title"
                  className="mb-4 text-xs font-semibold uppercase tracking-[0.06em] text-foreground-muted"
                >
                  De {formatCents(monthlyRevenue)} que entram
                </h2>

                <div
                  className="mb-4 flex h-2.5 overflow-hidden rounded-full"
                  aria-hidden="true"
                >
                  <span
                    className="bg-warning"
                    style={{ width: `${taxPercentage}%` }}
                  />
                  <span
                    className="bg-pj"
                    style={{ width: `${reservePercentage}%` }}
                  />
                  <span
                    className="bg-primary"
                    style={{ width: `${personalPercentage}%` }}
                  />
                </div>

                <dl className="grid gap-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-2 text-foreground-subtle">
                      <span
                        className="size-2.5 rounded-sm bg-warning"
                        aria-hidden="true"
                      />
                      Imposto
                    </dt>
                    <dd className="font-medium tabular-nums text-foreground">
                      {formatCents(taxAmount)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-2 text-foreground-subtle">
                      <span
                        className="size-2.5 rounded-sm bg-pj"
                        aria-hidden="true"
                      />
                      Fica na empresa
                    </dt>
                    <dd className="font-medium tabular-nums text-foreground">
                      {formatCents(reserveAmount)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-primary-border pt-3">
                    <dt className="flex items-center gap-2 font-semibold text-foreground">
                      <span
                        className="size-2.5 rounded-sm bg-primary"
                        aria-hidden="true"
                      />
                      Realmente seu
                    </dt>
                    <dd className="font-semibold tabular-nums text-foreground">
                      {formatCents(personalAmount)}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            <div className="flex items-center gap-2.5">
              <Button>
                Continuar <ArrowRight />
              </Button>
              <button className="flex items-center text-sm text-foreground-muted cursor-pointer gap-1.5 hover:text-foreground-subtle transition-colors duration-300 px-3">
                Voltar
              </button>
            </div>
          </div>
        </div>

        {/* Step 5 - Conta inicial */}
        <div className="flex-1 flex items-center justify-center px-11 py-10 hidden">
          <div className="w-full max-w-[520px]">
            <p className="text-xs font-semibold uppercase text-primary mb-2 tracking-[0.06em]">
              Passo 5 de 5
            </p>
            <h1 className="text-2xl text-foreground font-semibold mb-2 leading-[1.22] tracking-[-0.025em]">
              Qual conta quer adicionar primeiro?
            </h1>
            <p className="text-sm text-foreground-subtle mb-6">
              Escolha uma opção para começar. Você poderá adicionar outras
              contas depois.
            </p>

            <div className="grid gap-4 mb-7">
              <RadioCardGroup
                label="Conta inicial"
                hideLabel
                hideControl
                defaultValue="business_account"
                options={[
                  {
                    value: "business_account",
                    label: "Conta da empresa",
                    trailing: (
                      <Badge variant="pj" className="px-2 py-1 text-xs">
                        Empresa
                      </Badge>
                    ),
                    description: "Onde o faturamento cai",
                    icon: (
                      <span className="flex size-8 items-center justify-center rounded-lg bg-pj-subtle text-pj">
                        <Building2 />
                      </span>
                    ),
                  },
                  {
                    value: "personal_account",
                    label: "Conta pessoal",
                    trailing: (
                      <Badge variant="pf" className="px-2 py-1 text-xs">
                        Pessoal
                      </Badge>
                    ),
                    description: "Onde você recebe o pró-labore",
                    icon: (
                      <span className="flex size-8 items-center justify-center rounded-lg bg-pf-subtle text-pf">
                        <User />
                      </span>
                    ),
                  },
                  {
                    value: "credit_card",
                    label: "Cartão de crédito",
                    trailing: (
                      <Badge variant="pf" className="px-2 py-1 text-xs">
                        Pessoal
                      </Badge>
                    ),
                    description: "Para acompanhar a fatura",
                    icon: (
                      <span className="flex size-8 items-center justify-center rounded-lg bg-pf-subtle text-pf">
                        <CreditCard />
                      </span>
                    ),
                  },
                  {
                    value: "later",
                    label: "Faço isso depois",
                    trailing: (
                      <Badge variant="neutral" className="px-2 py-1 text-xs">
                        Opcional
                      </Badge>
                    ),
                    description: "Começar sem cadastrar conta",
                    icon: (
                      <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-foreground-muted">
                        <Clock3 />
                      </span>
                    ),
                  },
                ]}
              />

              <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary px-4 py-3.5 text-sm leading-relaxed text-foreground-muted">
                <LockKeyhole
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <p>
                  Nesta etapa é só o nome da conta e o contexto. Nenhuma senha
                  bancária é pedida.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button>
                Concluir <Check />
              </Button>
              <button className="flex items-center text-sm text-foreground-muted cursor-pointer gap-1.5 hover:text-foreground-subtle transition-colors duration-300 px-3">
                Pular por agora
              </button>
            </div>
          </div>
        </div>

        {/* Conclusão */}
        <div className="flex flex-1 items-center justify-center px-11 py-10 hidden">
          <div className="flex w-full max-w-[520px] flex-col items-center text-center">
            <div
              className="relative mb-9 size-32"
              role="img"
              aria-label={`${personalPercentage}% do faturamento é realmente seu`}
            >
              <svg
                viewBox="0 0 96 96"
                className="size-full -rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="48"
                  cy="48"
                  r="39"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="9"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="39"
                  fill="none"
                  pathLength="100"
                  stroke="var(--primary)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={`${personalPercentage} 100`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <strong className="text-2xl leading-none font-semibold tabular-nums text-foreground">
                  {personalPercentage}%
                </strong>
                <span className="mt-1 text-xs text-foreground-muted">
                  é seu
                </span>
              </div>
            </div>

            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-foreground">
              Tudo pronto{name ? `, ${name}` : ""}
            </h1>
            <p className="mb-7 max-w-[560px] text-base leading-relaxed text-foreground-subtle">
              De{" "}
              <strong className="font-semibold text-foreground">
                {formatCents(monthlyRevenue)}
              </strong>{" "}
              que entram pela empresa,{" "}
              <strong className="font-semibold text-foreground">
                {formatCents(personalAmount)}
              </strong>{" "}
              podem ser considerados realmente seus.
            </p>

            <dl className="mb-7 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-warning-border bg-warning-subtle px-4 py-4">
                <dt className="mb-2 text-sm text-warning-foreground">
                  Imposto
                </dt>
                <dd className="text-lg font-semibold tabular-nums text-warning-foreground">
                  {formatCents(taxAmount)}
                </dd>
              </div>
              <div className="rounded-xl border border-pj-border bg-pj-subtle px-4 py-4">
                <dt className="mb-2 text-sm text-pj">Empresa</dt>
                <dd className="text-lg font-semibold tabular-nums text-pj">
                  {formatCents(reserveAmount)}
                </dd>
              </div>
              <div className="rounded-xl border border-pf-border bg-pf-subtle px-4 py-4">
                <dt className="mb-2 text-sm text-pf">Seu</dt>
                <dd className="text-lg font-semibold tabular-nums text-pf">
                  {formatCents(personalAmount)}
                </dd>
              </div>
            </dl>

            <Button size="lg" className="mb-4 px-6">
              Ir para o dashboard <ArrowRight />
            </Button>
            <p className="text-sm text-foreground-muted">
              Você pode revisar tudo em Configurações › Dados da empresa
            </p>
          </div>
        </div>

        <div className="border-t border-t-border hidden items-center justify-between px-11 py-4">
          <span className="text-xs text-foreground-muted">
            Progresso salvo automaticamente
          </span>
          <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
            <Check className="size-3 text-success" />
            <span>Salvo agora</span>
          </span>
        </div>
      </div>
    </section>
  );
}
