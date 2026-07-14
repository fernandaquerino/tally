import type { Meta, StoryObj } from "@storybook/nextjs";
import { Building2, Info, UserRound } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const primitivePalettes = [
  {
    name: "Neutral",
    prefix: "neutral",
    steps: [0, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  },
  {
    name: "Primary",
    prefix: "primary",
    steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  },
  {
    name: "Pessoa física (PF)",
    prefix: "pf",
    steps: [50, 100, 200, 300, 400, 500, 600, 700],
  },
  {
    name: "Pessoa jurídica (PJ)",
    prefix: "pj",
    steps: [50, 100, 200, 300, 400, 500, 600, 700],
  },
] as const;

const semanticColors = [
  "background",
  "background-subtle",
  "surface",
  "surface-raised",
  "surface-hover",
  "surface-selected",
  "foreground",
  "foreground-muted",
  "foreground-subtle",
  "border",
  "border-strong",
  "primary",
  "pf",
  "pj",
  "success",
  "warning",
  "error",
  "info",
  "income",
  "expense",
  "transfer",
  "pending",
  "overdue",
  "paid",
  "ai",
] as const;

const spacingSteps = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24] as const;

function TokenName({ children }: { children: ReactNode }) {
  return <code className="text-xs text-foreground-muted">{children}</code>;
}

function SectionIntro({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground-subtle">
      <span className="text-primary">{index}</span>
      <span className="h-px w-6 bg-border-strong" />
      <span>{label}</span>
    </div>
  );
}

function useTokenValue(token: string) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const styles = window.getComputedStyle(document.documentElement);
    setValue(styles.getPropertyValue(token).trim().toUpperCase());
  }, [token]);

  return value;
}

function PrimitiveSwatch({ prefix, step }: { prefix: string; step: number }) {
  const token = `--color-${prefix}-${step}`;
  const value = useTokenValue(token);

  return (
    <div className="min-w-0">
      <div
        className="h-14 rounded-lg border border-black/6 shadow-[0_1px_1px_rgb(16_24_40/0.04)] sm:h-16"
        style={{ backgroundColor: `var(${token})` }}
      />
      <div className="mt-2 font-mono text-[11px] font-semibold text-foreground">
        {step}
      </div>
      <div className="mt-0.5 truncate font-mono text-[9px] uppercase text-foreground-subtle">
        {value || token}
      </div>
    </div>
  );
}

function Palette({
  name,
  prefix,
  steps,
  icon,
}: {
  name: string;
  prefix: string;
  steps: readonly number[];
  icon?: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {name}
      </h2>
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
        }}
      >
        {steps.map((step) => (
          <PrimitiveSwatch key={step} prefix={prefix} step={step} />
        ))}
      </div>
    </section>
  );
}

function SemanticSwatch({ color }: { color: (typeof semanticColors)[number] }) {
  const token = `--color-${color}`;
  const value = useTokenValue(token);

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-surface p-3">
      <div
        className="size-9 shrink-0 rounded-md border border-black/6"
        style={{ backgroundColor: `var(${token})` }}
      />
      <div className="min-w-0">
        <div className="truncate font-mono text-[11px] font-semibold text-foreground">
          {color}
        </div>
        <div className="mt-0.5 truncate font-mono text-[9px] text-foreground-subtle">
          {value || token}
        </div>
      </div>
    </div>
  );
}

function ColorsDocumentation() {
  const neutral = primitivePalettes[0];
  const primary = primitivePalettes[1];
  const pf = primitivePalettes[2];
  const pj = primitivePalettes[3];

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-4">
          <SectionIntro index="02" label="Cores" />
          <h1 className="text-3xl font-bold tracking-tight">
            Sistema de cores
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-foreground-muted sm:text-base">
            Base clara, neutra e levemente fria. Um roxo azulado sofisticado
            como cor da marca. Contexto e semântica nunca dependem só da cor.
          </p>
        </header>

        <Palette {...neutral} name="Neutros" />
        <Palette {...primary} name="Primary · roxo da marca" />

        <div className="grid gap-8 lg:grid-cols-2">
          <Palette
            {...pf}
            name="Contexto Pessoal · PF · índigo"
            icon={<UserRound aria-hidden className="size-4 text-pf" />}
          />
          <Palette
            {...pj}
            name="Contexto Empresa · PJ · teal"
            icon={<Building2 aria-hidden className="size-4 text-pj" />}
          />
        </div>

        <div className="flex gap-2 rounded-lg border border-warning-border bg-warning-subtle px-4 py-3 text-xs leading-5 text-warning-foreground">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>
            A diferenciação PF/PJ sempre combina cor + ícone + texto
            (“Pessoal”/“Empresa”) + badge. Nunca apenas cor.
          </p>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">Cores semânticas</h2>
            <p className="mt-1 text-sm text-foreground-muted">
              Use estes tokens nos componentes; eles respondem aos temas claro e
              escuro.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
            {semanticColors.map((color) => (
              <SemanticSwatch color={color} key={color} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SpacingDocumentation() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-4">
          <SectionIntro index="04" label="Espaçamento" />
          <h1 className="text-3xl font-bold tracking-tight">
            Sistema de espaçamento
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-foreground-muted sm:text-base">
            Uma escala previsível baseada em múltiplos de 4px mantém ritmo e
            consistência entre componentes, páginas e diferentes tamanhos de
            tela.
          </p>
        </header>

        <section className="overflow-hidden rounded-xl border bg-surface shadow-[0_1px_2px_rgb(16_24_40/0.03)]">
          {spacingSteps.map((step) => (
            <div
              className="grid grid-cols-[5rem_1fr_5rem] items-center gap-5 border-b px-5 py-4 last:border-b-0"
              key={step}
            >
              <span className="font-mono text-xs font-semibold">{step}</span>
              <div className="flex min-h-5 items-center">
                <div
                  className="h-4 max-w-full rounded-sm bg-primary"
                  style={{ width: `calc(var(--spacing) * ${step})` }}
                />
              </div>
              <span className="text-right font-mono text-xs text-foreground-subtle">
                {step * 4}px
              </span>
            </div>
          ))}
        </section>

        <div className="rounded-lg border border-info-border bg-info-subtle px-4 py-3 text-xs leading-5 text-info-foreground">
          Use classes como <TokenName>gap-4</TokenName>,{" "}
          <TokenName>p-6</TokenName> e <TokenName>space-y-8</TokenName>. Valores
          arbitrários devem ser exceção justificada.
        </div>
      </div>
    </main>
  );
}

const meta = {
  title: "Design System/Tokens",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  name: "Cores",
  render: () => <ColorsDocumentation />,
};

export const Spacing: Story = {
  name: "Espaçamentos",
  render: () => <SpacingDocumentation />,
};
